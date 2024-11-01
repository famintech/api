# Complex RBAC + Permission + Real-Time

You are tasked with developing my ultimate backend api app using NestJS. For now our goal is to implement authentication and authorization using RBAC while following these flow of development and you are not to jump to other flow until we finish a flow according to the flows. You are also not to deviate from the flow. You are also need to consider about security, performance, and best practices in the real-world application and follow them. You may use any NestJS features and third-party packages but must consider about security, performance, and best practices. You are also must consider about real-time updates using WebSocket throughout the app. You also must consider I will be containerizing the app using Docker and run it on my VPS. You also dont need to repeat my instructions. Show me the solution. Last but not least, when developing you need to consider that we will be documenting the API, but what tools or libraries that I can use to document the API is up to you, but must be easy for me to understand and use and follows the best practices. Each flow of development have sub-flow of development. You are not to deviate from the flow and wait for me to say I'm ready for the next flow. Even for example subflow Initialize NestJS project, must wait for me to be done with Initialize NestJS project the move on to the next sub-flow. You also must give code in the context of the sub-flow. You also remember which flow we are in and what sub-flow we are in. You must also consider I'm using ubuntu 22.04 and docker for my VPS where I deploy production app and my local development will be in Windows. But for testing I will not be using Windows, I'm using Windows solely because I'm using my favourite editor VSCode, but for testing I will be using ubuntu 22.04 in which usually the process is i will push the code to repo and pull in vps, then build the docker image, currently I already have a Postgres and Redis running in my VPS with Nginx as the web server. So it is a must to have a dockerfile. but like i said, follow the flow and decide which comes first. you must also consider i love yarn so npm is a no. Also my style of development is I'd like to push and pull on the VPS for every changes so I can see is it working in production. so after every subflow i will be doing that. even small minor changes I will be building a new image. also give me the nginx server block for the first time only to route to the nestjs api container. also my subdomain for my backend is api.famin.cloud. also i know how to request ssl certificate using certbot so you dont have to show me the instructions. just the nginx default.conf server block. Also you are not allowed to repeat the same code something like, for example you show the original code and say replace this code with something something... 
Here is the flow of development: 

1. Project Setup and Architecture Design
   - Initialize NestJS project
   - Set up project structure (modules, services, controllers, etc.)
   - Configure database connection (e.g., PostgreSQL for persistent storage)
   - Set up Redis for caching and real-time updates
   - Configure WebSocket support (e.g., Socket.io)
   - Set up environment variables and configuration management

2. User Management and Authentication
   - Implement user registration
   - Implement user login with JWT
   - Set up refresh token mechanism
   - Implement logout and token revocation
   - Set up password reset functionality
   - Implement multi-factor authentication (optional but recommended)

3. RBAC System Design
   - Design role and permission schemas
   - Implement role and permission CRUD operations
   - Set up user-role associations
   - Implement permission inheritance (if applicable)
   - Design and implement permission caching in Redis

4. Authorization Middleware and Guards
   - Implement JWT validation middleware
   - Create a permissions guard for route protection
   - Implement role-based guards
   - Set up custom decorators for permission and role checks

5. Real-time Permission Updates
   - Implement WebSocket connection for real-time updates
   - Create a service to manage permission changes
   - Set up listeners for permission change events
   - Implement cache invalidation and update mechanism in Redis

6. API Design and Implementation
   - Design RESTful API endpoints for user management
   - Implement CRUD operations for roles and permissions
   - Create endpoints for assigning/revoking roles and permissions
   - Implement endpoints for checking user permissions

7. Frontend Integration
   - Implement JWT storage and management on the frontend
   - Set up interceptors for adding JWT to API requests
   - Implement WebSocket connection for real-time updates
   - Create a permission management service on the frontend
   - Implement UI components for displaying/hiding based on permissions

8. Testing and Quality Assurance
   - Write unit tests for authentication and authorization logic
   - Implement integration tests for API endpoints
   - Perform end-to-end testing of the entire authentication flow
   - Conduct security audits and penetration testing

9. Security Enhancements
   - Implement rate limiting for authentication endpoints
   - Set up CORS configuration
   - Implement secure password hashing (e.g., bcrypt)
   - Set up HTTPS and SSL/TLS configuration
   - Implement audit logging for security-related events

10. Performance Optimization
    - Implement caching strategies for frequently accessed data
    - Optimize database queries and indexes
    - Set up database connection pooling
    - Implement horizontal scaling for the application (if needed)

11. Monitoring and Logging
    - Set up application-wide logging
    - Implement error tracking and reporting
    - Set up performance monitoring
    - Create dashboards for system health and user activity

12. Documentation and Maintenance
    - Create API documentation (e.g., using Swagger)
    - Document the authentication and authorization flow
    - Set up a process for regular security updates
    - Plan for periodic review and updates of the RBAC system
