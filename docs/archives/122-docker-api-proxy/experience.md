# Development Experience Summary

## 🎯 Core Experience

### Architecture Design Experience
1. **Simplicity First Principle**
   - In trusted environments, prioritize simple and maintainable solutions.
   - Avoid over-engineering; local forwarding with nginx is more reliable than dynamic proxies.
   - Separation of responsibilities: nginx handles forwarding, Node.js handles business logic.

2. **Zero Dependency Value Realization**
   - Enhance security: reduce the risk of supply chain attacks.
   - Improve maintainability: rely only on Node.js built-in modules.
   - Increase stability: avoid version conflicts of third-party libraries.

3. **Incremental Development Method**
   - Implement basic functionality first, then add advanced features.
   - Each phase has clear validation criteria.
   - Test promptly to avoid problem accumulation.

## 🛠️ Technical Implementation Experience

### Stream Response Handling
1. **Key nginx Configuration Points**
   ```nginx
   proxy_buffering off;
   proxy_request_buffering off;
   add_header X-Accel-Buffering no always;
   ```
   - Must disable all buffering to ensure real-time passthrough.
   - `X-Accel-Buffering no` is the key configuration.

2. **Node.js Stream Handling**
   ```javascript
   const stream = Readable.fromWeb(upstreamRes.body);
   stream.pipe(res);
   ```
   - Use `Readable.fromWeb()` to correctly handle Web Streams.
   - Directly pipe to the response to avoid memory accumulation.

### Error Handling Best Practices
1. **Intelligent Error Classification**
   - Timeout: 504 Gateway Timeout
   - DNS resolution failure: 502 Bad Gateway
   - Connection refused: 502 Bad Gateway
   - Other errors: 500 Internal Server Error

2. **User-Friendly Error Messages**
   - Avoid technical jargon; use simple and understandable descriptions.
   - Provide possible solutions.
   - Maintain consistency in error messages.

3. **Request Tracking System**
   - Generate a unique ID for each request.
   - Associate request ID with errors in logs.
   - Facilitate problem troubleshooting and performance monitoring.

### Timeout Strategy Design
1. **Differentiated Timeouts**
   - Streaming requests: 5 minutes (LLM generation takes time).
   - Regular requests: 2 minutes (quick failure).
   - Support environment variable configuration.

2. **Timeout Handling**
   - Clean up timers promptly to avoid memory leaks.
   - Return clear timeout error codes.
   - Log timeout events for monitoring.

## 🚫 Pitfall Guide

### Common Mistakes
1. **Duplicate CORS Header Settings**
   - Issue: CORS headers set by both nginx and Node.js.
   - Solution: Handle uniformly in Node.js, do not set in nginx.
   - Lesson: Clarify responsibilities to avoid duplicate configurations.

2. **Streaming Response Buffering**
   - Issue: Default buffering in nginx causes delays in streaming responses.
   - Solution: Disable all related buffering configurations.
   - Lesson: Streaming responses require special configurations.

3. **HEAD Request Handling**
   - Issue: HEAD requests should not have a response body.
   - Solution: Specially handle HEAD requests to return only headers.
   - Lesson: Strictly follow HTTP specifications.

4. **Timeout Settings**
   - Issue: Uniform timeout is not suitable for all scenarios.
   - Solution: Differentiate settings based on request types.
   - Lesson: Consider the differences in actual usage scenarios.

### Design Traps
1. **Overly Secure Protections**
   - In trusted environments, excessive security measures may hinder functionality.
   - Choose an appropriate security level based on the actual deployment environment.
   - Leave room for security enhancements.

2. **Pursuit of Complex Configurations**
   - While nginx dynamic proxies are powerful, they are complex to configure.
   - Simple local forwarding is more reliable and easier to maintain.
   - Consider maintenance costs when choosing a solution.

3. **Dependency Management**
   - External dependencies increase complexity and risk.
   - Prefer built-in functionalities whenever possible.
   - Evaluate the necessity of each dependency.

## 🔄 Architecture Design Experience

### Solution Selection Thought Process
1. **Requirement Analysis**
   - Functional requirements: support for regular and streaming requests.
   - Performance requirements: low latency, high concurrency.
   - Maintenance requirements: simple configuration, easy debugging.

2. **Solution Comparison**
   - nginx dynamic proxy: powerful but complex to configure.
   - nginx local forwarding: simple, reliable, and easy to maintain.
   - Selection criteria: choose the simplest solution that meets requirements.

3. **Architecture Evolution**
   - An evolution process from complexity to simplicity.
   - Validate the feasibility of solutions through practice.
   - Adjust architecture design in a timely manner.

### Integration Strategy
1. **Frontend Integration**
   - Reuse existing environment detection patterns.
   - Maintain a user experience consistent with Vercel proxy.
   - Use visual differentiation (color themes).

2. **Backend Integration**
   - Add Docker proxy support in LLM services.
   - Maintain interface consistency.
   - Improve type definitions.

3. **Build Integration**
   - Ensure all packages build correctly.
   - Pass TypeScript type checks.
   - Validate integration effects promptly.

## 🎯 Reusable Experience

### Proxy Service Implementation Model
1. **Zero Dependency HTTP Proxy**
   - Use Node.js built-in http module.
   - Correctly handle various HTTP methods.
   - Implement complete error handling.

2. **Streaming Data Passthrough**
   - Use `Readable.fromWeb()` to handle Web Streams.
   - Configure nginx to disable buffering.
   - Achieve real-time data transmission.

3. **Request Tracking System**
   - Generate a unique request ID.
   - Record the complete request lifecycle.
   - Facilitate problem troubleshooting and performance monitoring.

### Environment Integration Model
1. **Docker Service Integration**
   - Use supervisord to manage multiple processes.
   - Configure nginx to forward to internal services.
   - Achieve coordination between services.

2. **Frontend Environment Detection**
   - Implement availability detection interfaces.
   - Cache detection results to avoid repeated requests.
   - Dynamically display features based on the environment.

3. **Configuration Management**
   - Support environment variable configuration.
   - Provide reasonable default values.
   - Implement configuration persistence.

## 📊 Performance Optimization Experience

### Key Optimization Points
1. **Reduce Latency**
   - Use local forwarding to avoid DNS resolution.
   - Disable unnecessary buffering.
   - Implement quick error handling.

2. **Resource Management**
   - Clean up timers and connections promptly.
   - Avoid memory leaks.
   - Monitor resource usage.

3. **Concurrent Processing**
   - Node.js inherently supports high concurrency.
   - Avoid blocking operations.
   - Implement reasonable timeout strategies.

### Monitoring and Debugging
1. **Log Design**
   - Record key information: timestamp, request ID, IP, duration.
   - Use structured log formats.
   - Differentiate logs by severity levels.

2. **Error Tracking**
   - Assign a unique ID to each error.
   - Record the complete context of errors.
   - Implement error classification and statistics.

3. **Performance Monitoring**
   - Record response time distribution.
   - Monitor changes in error rates.
   - Track resource usage.

## 🚀 Future Improvement Directions

### Optional Enhancement Features
1. **Security Enhancements**
   - URL whitelist validation.
   - Request rate limiting.
   - Request size limiting.

2. **Monitoring Enhancements**
   - Integrate professional monitoring tools.
   - Implement alert mechanisms.
   - Provide monitoring dashboards.

3. **Performance Optimization**
   - Connection pool management.
   - Cache strategy optimization.
   - Load balancing support.

### Architecture Evolution
1. **Microservices**
   - Independently deploy proxy services.
   - Implement service discovery mechanisms.
   - Support horizontal scaling.

2. **Configuration Center**
   - Centralize configuration management.
   - Support dynamic configuration updates.
   - Implement configuration version management.

These experiences provide a comprehensive reference for similar proxy service development, especially for API proxy implementations in Docker environments.