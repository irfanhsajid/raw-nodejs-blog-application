# Raw Node.js Blog API with MySQL

A RESTful API built with raw Node.js (no Express.js) and MySQL for a blog application. This project demonstrates how to create a production-grade API implementing MVC architecture, MySQL database operations, and authentication from scratch without using any web frameworks.

## Features

### Authentication

- User registration with password hashing
- JWT-based authentication with access and refresh tokens
- Protected routes using custom middleware
- Token refresh mechanism
- Secure password storage using bcrypt

### Blog Operations

- Create new blog posts
- Retrieve all posts
- Get single post by ID
- Update existing posts
- Delete posts
- User-specific post management

### Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- Database security with prepared statements
- CORS support

### Database Implementation

- MySQL for robust data persistence
- Connection pooling for efficient database operations
- Prepared statements to prevent SQL injection
- Foreign key relationships for data integrity
- Timestamp tracking for records

### MVC Architecture

- **Models**: Handle database operations and business logic
  - `auth-model.js`: User and token management
  - `blog-model.js`: Blog post CRUD operations
- **Views**: API responses in JSON format
- **Controllers**: Handle HTTP requests and responses
  - `auth-controller.js`: Authentication endpoints
  - `blog-controller.js`: Blog operation endpoints
- **Services**: Business logic layer
  - `auth-service.js`: Authentication logic
  - `blog-service.js`: Blog operation logic

## MVC Implementation Details

### Models (Data Layer)

- Handle all database interactions
- Implement prepared statements
- Manage database connections
- Handle data validation

### Controllers (Request Handler)

- Process HTTP requests
- Validate input data
- Call appropriate services
- Format API responses

### Services (Business Logic)

- Implement business rules
- Handle data processing
- Manage transactions
- Error handling

## API Endpoints

### Authentication Routes

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Blog Routes (Protected)

- `GET /posts` - Get all posts
- `POST /create-post` - Create new post
- `GET /posts/:id` - Get specific post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
