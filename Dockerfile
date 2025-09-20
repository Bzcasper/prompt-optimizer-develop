FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest && corepack enable

FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm mcp:build

FROM nginx:stable-alpine
# Install Node.js, htpasswd tool, dos2unix and supervisor
RUN apk add --no-cache apache2-utils dos2unix supervisor nodejs npm gettext curl

# Install pnpm
RUN npm install -g pnpm

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy web application
COPY --from=build /app/packages/web/dist /usr/share/nginx/html

# Copy MCP server
COPY --from=build /app/packages/mcp-server/dist /app/mcp-server/dist
COPY --from=build /app/packages/mcp-server/package.json /app/mcp-server/
COPY --from=build /app/packages/mcp-server/preload-env.js /app/mcp-server/
COPY --from=build /app/packages/mcp-server/preload-env.cjs /app/mcp-server/

# Copy Node Proxy service
COPY --from=build /app/node-proxy /app/node-proxy
# Copy built packages to correct location
COPY --from=build /app/packages /app/packages
# Copy necessary node_modules
COPY --from=build /app/node_modules /app/node_modules

# Ensure content generation templates are available
RUN mkdir -p /app/packages/core/src/services/template/default-templates/content-generation

# Set default environment variables (for backward compatibility)
ENV NGINX_PORT=80

# Set MCP server working directory
WORKDIR /app/mcp-server

# Copy and configure startup scripts
COPY docker/generate-config.sh /docker-entrypoint.d/40-generate-config.sh
COPY docker/generate-auth.sh /docker-entrypoint.d/30-generate-auth.sh
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start-services.sh /start-services.sh

# Ensure scripts have execute permissions
RUN chmod +x /docker-entrypoint.d/40-generate-config.sh
RUN chmod +x /docker-entrypoint.d/30-generate-auth.sh
RUN chmod +x /start-services.sh

# Convert possible Windows line endings to Unix format
RUN dos2unix /docker-entrypoint.d/40-generate-config.sh
RUN dos2unix /docker-entrypoint.d/30-generate-auth.sh
RUN dos2unix /start-services.sh

EXPOSE 80

# Use custom startup script
CMD ["sh", "/start-services.sh"]