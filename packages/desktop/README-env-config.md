# Desktop App Environment Variable Configuration Guide

## Environment Variable Loading Order

The desktop application loads environment variables in the following order:

1.  **`.env.local` in the project root directory** (Recommended) - Consistent with the testing environment
2.  **`.env` in the desktop app directory** - Desktop app-specific configuration
3.  **System environment variables** - Manually set environment variables

## Recommended Configuration Methods

### Method 1: Use .env.local in the project root directory (Recommended)

Add the following to the `prompt-optimizer/.env.local` file in the project root directory:

```bash
# OpenAI
VITE_OPENAI_API_KEY=your_openai_key_here

# Google Gemini
VITE_GEMINI_API_KEY=your_gemini_key_here

# DeepSeek
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here

# SiliconFlow
VITE_SILICONFLOW_API_KEY=your_siliconflow_key_here

# Zhipu AI
VITE_ZHIPU_API_KEY=your_zhipu_key_here

# Custom API
VITE_CUSTOM_API_KEY=your_custom_key_here
VITE_CUSTOM_API_BASE_URL=your_custom_base_url
VITE_CUSTOM_API_MODEL=your_custom_model
```

**Advantages**:
-   Share the same configuration with the web version and testing environment
-   Only need to maintain one configuration file
-   Automatically excluded by `.gitignore`, so keys won't be leaked

### Method 2: Desktop app-specific configuration

Add the same environment variables to the `packages/desktop/.env` file.

**Advantages**:
-   Independent configuration for the desktop app
-   Can use different API keys than the web version

### Method 3: System environment variables

For Windows users:
```cmd
set VITE_OPENAI_API_KEY=your_openai_key_here
set VITE_GEMINI_API_KEY=your_gemini_key_here
npm start
```

For macOS/Linux users:
```bash
export VITE_OPENAI_API_KEY=your_openai_key_here
export VITE_GEMINI_API_KEY=your_gemini_key_here
npm start
```

## Verifying the Configuration

When the desktop app starts, the main process console will display:

```
[Main Process] .env.local file loaded from project root
[Main Process] .env file loaded from desktop directory
[Main Process] Checking environment variables...
[Main
[Main Process] Found VITE_OPENAI_API_KEY: sk-1234567...
[Main Process] Found VITE_GEMINI_API_KEY: AIzaSyA...
```

If you see `Missing VITE_XXX_API_KEY`, it means the corresponding environment variable is not set.

## FAQ

### Q: Is my .env.local file valid?
A: **Yes!** The desktop application now automatically loads the `.env.local` file from the project root directory.

### Q: Why does the UI show an API key, but the connection test fails?
A: This is because the UI process and the main process environments are isolated. Make sure:
1.  The environment variables are set correctly in the `.env.local` file
2.  Restart the desktop app to reload the environment variables
3.  Check the main process console to confirm that the environment variables are read correctly

### Q: Can I use multiple configuration methods at the same time?
A: Yes. `dotenv` will merge the configurations in the order they are loaded, and later loaded variables will not overwrite existing ones.

## Security Reminder

-   Never commit files containing API keys to the Git repository
-   `.env.local` is already excluded in `.gitignore`
-   If you use an `.env` file, please add it to `.gitignore` manually
