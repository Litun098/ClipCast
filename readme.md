#### Video Application

# YouTube Backend

This project is a backend system for a YouTube-like application. It is built using Node.js and Express.js and includes various features like authentication, video upload, comments, and more. The application uses MongoDB as the database and integrates with third-party services like Cloudinary for media storage.

## Features

- User authentication (JWT-based).
- Video upload and storage using Multer and Cloudinary.
- Comment system with pagination.
- Secure handling of cookies for authentication and refresh tokens.
- CORS-enabled for cross-origin requests.
- Environmental configuration using `dotenv`.

## Prerequisites

- Node.js (>= 16.x)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd youtube-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   ACCESS_TOKEN_SECRET=<your-access-token-secret>
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```plaintext
src/
├── controllers/       # Handles request logic (e.g., user, video, comment controllers)
├── middlewares/       # Custom middleware (e.g., authentication, error handling)
├── models/            # Mongoose models (e.g., User, Video, Comment)
├── routes/            # API routes definitions
├── utils/             # Utility functions (e.g., token generation, error handling)
├── index.js           # Entry point for the server
```

## Dependencies

### Production Dependencies

- **bcrypt**: For password hashing.
- **body-parser**: Middleware for parsing JSON and URL-encoded data.
- **cloudinary**: Integration for media storage.
- **cookie-parser**: Middleware for parsing cookies.
- **cors**: Enable CORS for handling cross-origin requests.
- **dotenv**: Load environment variables from `.env` file.
- **express**: Web framework for building APIs.
- **jsonwebtoken**: JWT implementation for secure authentication.
- **mongodb**: MongoDB driver for Node.js.
- **mongoose**: ODM for MongoDB.
- **mongoose-aggregate-paginate-v2**: Plugin for aggregating and paginating results.
- **multer**: Middleware for handling `multipart/form-data`, used for file uploads.

### Development Dependencies

- **nodemon**: Automatically restart the server on file changes.
- **prettier**: Code formatter to maintain consistent coding style.

# API Endpoints

### Authentication

#### Register a New User

-**Method:** `POST` 

-**URL**: `localhost:8000/api/v1/users/register`
  ## Request Body (form-data):
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "avatar": "file (optional)",
      "coverImage": "file (optional)"
    }
    ```
  ## Response:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "avatar": "string (URL)",
        "coverImage": "string (URL)"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
    ```

#### **Log In a User**

**POST** `localhost:8000/api/v1/users/login`
  - **Request Body (JSON):**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Login successful",
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "avatar": "string (URL)",
        "coverImage": "string (URL)"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
    ```

#### **Log Out a User**

-**Method:** `POST`

-**URL:** `localhost:8000/api/v1/users/logout`

**Response:**

```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
```

## Video API Endpoints

### Get All Videos

### Request

- **Method**: `GET`
- **URL**: `http://localhost:8000/api/v1/videos`

### Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6762fa888435da7925c0f4a8",
      "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1734539910/vikiix0adidauvelvpm4.mp4",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734539900/duqrnkqztkmc90acxdln.webp",
      "title": "First Video",
      "description": "Description of first video",
      "duration": 4,
      "views": 39,
      "isPublished": true,
      "owner": "6762f5a7885c3668f778aa04",
      "__v": 0
    },
    {
      "_id": "67681eb62dcadc59233256b2",
      "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1734876850/afrcqfqhlxqljuwucndb.mp4",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734876605/dktkljlnkwgl8rvcsepv.webp",
      "title": "Second Video",
      "description": "Description of second video",
      "duration": 4,
      "views": 2,
      "isPublished": true,
      "owner": "6762f5a7885c3668f778aa04",
      "__v": 0
    },
    {
      "_id": "677a1eccaaba8f58c614a18b",
      "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1736056518/ysrtrutcchwolppm9bfs.mp4",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1736056483/shcf2rh1mdae9fzrhvhf.jpg",
      "title": "Third Video",
      "description": "Description of the video",
      "duration": 4,
      "views": 2,
      "isPublished": true,
      "owner": "6762f5a7885c3668f778aa04",
      "__v": 0
    }
  ],
  "message": {
    "total": 3,
    "page": 1,
    "limit": 1,
    "totalPages": 3
  },
  "success": true
}
```

### Upload Video

-**Method:** `POST`

-**URL:** `http://localhost:8000/api/v1/videos/upload-video`

**Request Body (Form Data):**

- **thumbnail**: (File)
- **video**: (File)
- **title**: `Video Title`
- **description**: `Description of the video`

**Response Body:**

```json
{
  "statusCode": 200,
  "data": {
    "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1736093548/iljootvznibiijssoa32.mp4",
    "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1736093510/unorwhzf6qcydz8xqatp.jpg",
    "title": "East Reannaside",
    "description": "I'll calculate the mobile COM array, that should sensor the SAS application!",
    "duration": 4,
    "views": 0,
    "isPublished": true,
    "owner": "6762f5a7885c3668f778aa04",
    "_id": "677aaf6d965a3c57419244f3",
    "__v": 0
  },
  "message": "Video uploaded successfully.",
  "success": true
}
```

## Get Video with Id

-**Method:** `GET`

-**URL:** `http://localhost:8000/api/v1/videos/677a1eccaaba8f58c614a18b`

**Response Body:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "677a1eccaaba8f58c614a18b",
    "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1736056518/ysrtrutcchwolppm9bfs.mp4",
    "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1736056483/shcf2rh1mdae9fzrhvhf.jpg",
    "title": "third video",
    "description": "Description of the video",
    "duration": 4,
    "views": 3,
    "isPublished": true,
    "owner": "6762f5a7885c3668f778aa04",
    "__v": 0
  },
  "message": "Video fetched successfully.",
  "success": true
}
```

## Delete Video

- **Method**: `DELETE`
- **URL**: `localhost:8000/api/v1/videos/6762fb45614d4e2a6988cfd1`

### Toggle Publish Status

- **Method**: `PATCH`
- **URL**: `localhost:8000/api/v1/videos/video-status/6762fa888435da7925c0f4a8`

#### Response:

- **Status Code**: 200
- **Response Body**:

```json
{
  "statusCode": 200,
  "data": {
    "_id": "6762fa888435da7925c0f4a8",
    "videoFile": "https://res.cloudinary.com/dbcc9vr2u/video/upload/v1734539910/vikiix0adidauvelvpm4.mp4",
    "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734539900/duqrnkqztkmc90acxdln.webp",
    "title": "First Video",
    "description": "Description of first video",
    "duration": 4,
    "views": 39,
    "isPublished": true,
    "owner": "6762f5a7885c3668f778aa04",
    "__v": 0
  },
  "message": "Video publish status updated to published",
  "success": true
}
```

## Comments

### Create Comment

### Request

- **Method**: `POST`
- **URL**: `http://localhost:8000/api/v1/comments/6762fa888435da7925c0f4a8`
- **Body**:
  ```json
  {
    "content": "Nice Video"
  }
  ```

### Response

- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "content": "Nice Video",
      "video": "6762fa888435da7925c0f4a8",
      "owner": "6762f5a7885c3668f778aa04",
      "_id": "677a9a839503a1566148cfce",
      "createdAt": "2025-01-05T14:43:15.804Z",
      "updatedAt": "2025-01-05T14:43:15.804Z",
      "__v": 0
    },
    "message": "Comment added successfully.",
    "success": true
  }
  ```

## Comments

### Get Video Comments

**Request:**

- **Method:** `GET`
- **URL:** `localhost:8000/api/v1/comments/6762fa888435da7925c0f4a8`

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "677a9af3a62f54352a409e27",
        "content": "Nice Video",
        "video": "6762fa888435da7925c0f4a8",
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T14:45:07.137Z",
        "updatedAt": "2025-01-05T14:45:07.137Z",
        "__v": 0
      },
      {
        "_id": "677a9a839503a1566148cfce",
        "content": "Nice Video",
        "video": "6762fa888435da7925c0f4a8",
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T14:43:15.804Z",
        "updatedAt": "2025-01-05T14:43:15.804Z",
        "__v": 0
      },
      {
        "_id": "677a9a329503a1566148cfca",
        "content": "Nice Video",
        "video": "6762fa888435da7925c0f4a8",
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T14:41:54.537Z",
        "updatedAt": "2025-01-05T14:41:54.537Z",
        "__v": 0
      },
      {
        "_id": "6770100581f936ea3b1ce221",
        "content": "Nice video. Very comprehensive.",
        "video": "6762fa888435da7925c0f4a8",
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2024-12-28T14:49:41.648Z",
        "updatedAt": "2024-12-28T14:49:41.648Z",
        "__v": 0
      }
    ],
    "totalDocs": 4,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": null
  },
  "message": "Comments fetched successfully.",
  "success": true
}
```

### Delete Comment

**Request:**

- **Method:** `DELETE`
- **URL:** `localhost:8000/api/v1/comments/c/677a9a329503a1566148cfca`

**Response:**

```json
{
  "statusCode": 200,
  "data": "Comment deleted successfully.",
  "message": "Success",
  "success": true
}
```

### Update Comment

**Request:**

- **Method:** `PATCH`
- **URL:** `localhost:8000/api/v1/comments/c/6770100581f936ea3b1ce221`
- **Body:**

```json
{
  "content": "Updated comment 😁"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "6770100581f936ea3b1ce221",
    "content": "Updated comment 😁",
    "video": "6762fa888435da7925c0f4a8",
    "owner": "6762f5a7885c3668f778aa04",
    "createdAt": "2024-12-28T14:49:41.648Z",
    "updatedAt": "2025-01-05T15:51:20.815Z",
    "__v": 0
  },
  "message": "Comment updated successfully.",
  "success": true
}
```

### Subscribe

## Subscribe to a Channel

### Request

- **Method**: `POST`
- **URL**: `localhost:8000/api/v1/subscription/c/6650db452a493b1ea757dace`

### Response

```json
{
  "statusCode": 200,
  "data": "Subscribed to nayak",
  "message": "Success",
  "success": true
}
```

## Get All Subscribed Channels

### Request

- **Method**: GET
- **URL**: `localhost:8000/api/v1/subscription/c/6762f5a7885c3668f778aa04`

### Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "677aabc3965a3c57419244a3",
      "subscriber": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      },
      "channel": "6762f5a7885c3668f778aa04",
      "__v": 0
    }
  ],
  "message": "Success",
  "success": true
}
```

## Get Channels a User is Subscribed To

### Request

- **Method**: GET
- **URL**: `localhost:8000/api/v1/subscription/u/6762f5a7885c3668f778aa04`

### Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "677aab5d4def1a8d7268271f",
      "subscriber": "6762f5a7885c3668f778aa04",
      "channel": {
        "_id": "677a940b35f3f6f35d2d8023",
        "username": "helga50",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1736086525/dmmqufbzltlf7nqt8x6p.jpg"
      },
      "__v": 0
    },
    {
      "_id": "677aab714def1a8d72682724",
      "subscriber": "6762f5a7885c3668f778aa04",
      "channel": {
        "_id": "677a94a435f3f6f35d2d8027",
        "username": "letha.weimann82",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1736086968/nag2dqgfciyymzt41svl.jpg"
      },
      "__v": 0
    },
    {
      "_id": "677aabb2965a3c574192449e",
      "subscriber": "6762f5a7885c3668f778aa04",
      "channel": {
        "_id": "6770110fcbe4da11333ee47f",
        "username": "{{random.username}}",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1735397634/mhx8lnaiwmamrerd9fzr.jpg"
      },
      "__v": 0
    },
    {
      "_id": "677aabc3965a3c57419244a3",
      "subscriber": "6762f5a7885c3668f778aa04",
      "channel": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      },
      "__v": 0
    },
    {
      "_id": "677aabd8965a3c57419244a8",
      "subscriber": "6762f5a7885c3668f778aa04",
      "channel": {
        "_id": "6650db452a493b1ea757dace",
        "username": "nayak",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1716575029/qemsz1mp1yo09bxy7b2o.jpg"
      },
      "__v": 0
    }
  ],
  "message": "Success",
  "success": true
}
```

## Like API

### Like Video

#### Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/likes/toggle/v/67681eb62dcadc59233256b2`

#### Response

**Status:** `201 Created`

**Body:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "6776a6897e2cae35a8bcb62e",
    "video": "6762fa888435da7925c0f4a8",
    "likedBy": "6762f5a7885c3668f778aa04",
    "createdAt": "2025-01-02T14:45:29.955Z",
    "updatedAt": "2025-01-02T14:45:29.955Z",
    "__v": 0
  },
  "message": "Dislike video",
  "success": true
}
```

### Like Comment

## Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/likes/toggle/c/6770100581f936ea3b1ce221`

#### Response

**Status:** `201 Created`

**Body:**

```json
{
  "statusCode": 201,
  "data": "Liked comment",
  "message": "Success",
  "success": true
}
```

### Like Tweet

#### Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/likes/toggle/t/677949eb90b74bbf77220c9c`

#### Response

**Status:** `201 Created`

**Body:**

```json
{
  "statusCode": 201,
  "data": "Liked tweet",
  "message": "Success",
  "success": true
}
```

---

## Request: Get Liked Videos

-**Method**: `GET`  
-**URL**: `localhost:8000/api/v1/likes/videos`

## Response

### Response Body:

```json
{
  "statusCode": 201,
  "data": [
    {
      "_id": "67681eb62dcadc59233256b2",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734876605/dktkljlnkwgl8rvcsepv.webp",
      "title": "Second Video",
      "description": "Description of second video",
      "duration": 4,
      "views": 2,
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    }
  ],
  "message": "Success",
  "success": true
}
```

# Tweets

## Create Tweet

## Request:

-**Method**: `POST` 

-**URL**: `http://localhost:8000/api/v1/tweets/`

**Body**:

```json
{
  "content": "{{$randomCatchPhrase}}"
}
```

### Response

**Status**: `200 OK`

**Response Body**:

```json
{
  "statusCode": 201,
  "data": {
    "content": "Team-oriented zero defect functionalities",
    "owner": "6762f5a7885c3668f778aa04",
    "_id": "677aad25965a3c57419244c7",
    "createdAt": "2025-01-05T16:02:45.005Z",
    "updatedAt": "2025-01-05T16:02:45.005Z",
    "__v": 0
  },
  "message": "Success",
  "success": true
}
```

## Get User Tweets

### Request

- **Method**: `GET`

- **URL**: `localhost:8000/api/v1/tweets/user/6762f5a7885c3668f778aa04`

### Response

- **Status**: OK
- **Code**: 200

#### Response Body

```json
{
  "statusCode": 201,
  "data": [
    {
      "_id": "677949e990b74bbf77220c99",
      "content": "engage dot-com networks",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "677949eb90b74bbf77220c9c",
      "content": "engineer magnetic web services",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "677949ff90b74bbf77220c9f",
      "content": "Pre-emptive intermediate alliance",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "67794a0290b74bbf77220ca2",
      "content": "Exclusive neutral hub",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "67794a0590b74bbf77220ca5",
      "content": "Multi-tiered real-time synergy",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "67794a0690b74bbf77220ca8",
      "content": "Proactive content-based website",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    },
    {
      "_id": "67794a3290b74bbf77220cab",
      "content": "Optimized empowering internet solution",
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      }
    }
  ],
  "message": "Success",
  "success": true
}
```

### Update Tweet

**Request:**

-**Method:** `PATCH` 

-**URL**: `localhost:8000/api/v1/tweets/677a18d74d85d8be06ead817`

**Request Body:**

```json
{
  "content": "Updated Managed non-volatile emulation"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "677a18d74d85d8be06ead817",
    "content": "Updated Managed non-volatile emulation",
    "owner": "6762f5a7885c3668f778aa04",
    "createdAt": "2025-01-05T05:29:59.742Z",
    "updatedAt": "2025-01-05T16:03:59.244Z",
    "__v": 0
  },
  "message": "Tweet updated successfully",
  "success": true
}
```

## Delete Tweet

## Request: 
-**Method:** `DELETE`

-**URL**: `localhost:8000/api/v1/tweets/677949e790b74bbf77220c96`

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "677949e990b74bbf77220c99",
    "content": "engage dot-com networks",
    "owner": "6762f5a7885c3668f778aa04",
    "__v": 0
  },
  "message": "Tweet deleted successfully.",
  "success": true
}
```

## Playlist API

### Create Playlist

## Request:

-**Method:** `POST` 

-**URL**: `localhost:8000/api/v1/playlist/`

**Request Body:**

```json
{
  "name": "{{$randomProductName}}",
  "description": "{{$randomPhrase}}"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "playlist": {
      "name": "Gorgeous Fresh Tuna",
      "description": "copying the card won't do anything, we need to override the virtual SMTP matrix!",
      "videos": [],
      "owner": "6762f5a7885c3668f778aa04",
      "_id": "677aadb4965a3c57419244d6",
      "createdAt": "2025-01-05T16:05:08.210Z",
      "updatedAt": "2025-01-05T16:05:08.210Z",
      "__v": 0
    }
  },
  "message": "Playlist created successfully",
  "success": true
}
```

### Add Video to Playlist

**Request:**

-**Method:** `PATCH` 

-**URL**: `localhost:8000/api/v1/playlist/add/677a1eccaaba8f58c614a18b/677aadb4965a3c57419244d6`

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "playlist": {
      "_id": "677aadb4965a3c57419244d6",
      "name": "Gorgeous Fresh Tuna",
      "description": "copying the card won't do anything, we need to override the virtual SMTP matrix!",
      "videos": ["677a1eccaaba8f58c614a18b"],
      "owner": "6762f5a7885c3668f778aa04",
      "createdAt": "2025-01-05T16:05:08.210Z",
      "updatedAt": "2025-01-05T16:06:22.887Z",
      "__v": 1
    }
  },
  "message": "Video added to playlist successfully",
  "success": true
}
```

### Get Playlist by Id

**Request:**

-**Method:** `GET` 

-**Url:** `localhost:8000/api/v1/playlist/677aadb4965a3c57419244d6`

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "playlist": {
      "_id": "677aadb4965a3c57419244d6",
      "name": "Gorgeous Fresh Tuna",
      "description": "copying the card won't do anything, we need to override the virtual SMTP matrix!",
      "videos": ["677a1eccaaba8f58c614a18b"],
      "owner": {
        "_id": "6762f5a7885c3668f778aa04",
        "username": "litun098",
        "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg"
      },
      "createdAt": "2025-01-05T16:05:08.210Z",
      "updatedAt": "2025-01-05T16:06:22.887Z",
      "__v": 1
    }
  },
  "message": "Playlist fetched successfully",
  "success": true
}
```

### Update Playlist

## Request:

-**Method:** `PATCH` 

-**Url:** `localhost:8000/api/v1/playlist/677aadb4965a3c57419244d6`

**Request Body:**

```json
{
  "name": "{{$randomPhrase}}",
  "description": "Updated parsing the driver won't do anything, we need to back up the optical XML driver!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "playlist": {
      "_id": "677aadb4965a3c57419244d6",
      "name": "If we copy the application, we can get to the RAM card through the auxiliary SDD bandwidth!",
      "description": "Updated parsing the driver won't do anything, we need to back up the optical XML driver!",
      "videos": ["677a1eccaaba8f58c614a18b"],
      "owner": "6762f5a7885c3668f778aa04",
      "createdAt": "2025-01-05T16:05:08.210Z",
      "updatedAt": "2025-01-05T16:07:59.281Z",
      "__v": 1
    }
  },
  "message": "Playlist updated successfully",
  "success": true
}
```

### Remove Video from Playlist

## Request:

-**Method:** `PATCH` 

-**Url:** `localhost:8000/api/v1/playlist/remove/677a1eccaaba8f58c614a18b/677aadb4965a3c57419244d6`

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "playlist": {
      "_id": "677aadb4965a3c57419244d6",
      "name": "If we copy the application, we can get to the RAM card through the auxiliary SDD bandwidth!",
      "description": "Updated parsing the driver won't do anything, we need to back up the optical XML driver!",
      "videos": [],
      "owner": "6762f5a7885c3668f778aa04",
      "createdAt": "2025-01-05T16:05:08.210Z",
      "updatedAt": "2025-01-05T16:08:49.489Z",
      "__v": 2
    }
  },
  "message": "Video removed from playlist successfully",
  "success": true
}
```

### Get user playlists

#### Request

- **Method**: `GET`

- **URL**: `localhost:8000/api/v1/playlist/user/6762f5a7885c3668f778aa04`

#### Response

- **Status**: OK
- **Code**: 200

#### Body

```json
{
  "statusCode": 200,
  "data": {
    "playLists": [
      {
        "_id": "677a1ca4aaba8f58c614a140",
        "name": "Licensed Soft Mouse",
        "description": "Regional",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:46:12.852Z",
        "updatedAt": "2025-01-05T05:46:12.852Z",
        "__v": 0
      },
      {
        "_id": "677a1cb0aaba8f58c614a143",
        "name": "Handcrafted Concrete Hat",
        "description": "Dynamic",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:46:24.900Z",
        "updatedAt": "2025-01-05T05:46:24.900Z",
        "__v": 0
      },
      {
        "_id": "677a1cdeaaba8f58c614a146",
        "name": "Intelligent Soft Towels",
        "description": "Extended multimedia framework",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:47:10.535Z",
        "updatedAt": "2025-01-05T05:47:10.535Z",
        "__v": 0
      },
      {
        "_id": "677a1ce2aaba8f58c614a149",
        "name": "Licensed Metal Keyboard",
        "description": "Optional fresh-thinking hub",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:47:14.774Z",
        "updatedAt": "2025-01-05T05:47:14.774Z",
        "__v": 0
      },
      {
        "_id": "677a1ce4aaba8f58c614a14c",
        "name": "Gorgeous Concrete Chair",
        "description": "De-engineered transitional solution",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:47:16.973Z",
        "updatedAt": "2025-01-05T05:47:16.973Z",
        "__v": 0
      },
      {
        "_id": "677a1cffaaba8f58c614a14f",
        "name": "Licensed Rubber Shoes",
        "description": "directional",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:47:43.208Z",
        "updatedAt": "2025-01-05T05:47:43.208Z",
        "__v": 0
      },
      {
        "_id": "677a1d63aaba8f58c614a155",
        "name": "Rustic Concrete Pants",
        "description": "I'll calculate the open-source IB monitor, that should capacitor the CSS firewall!",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:49:23.772Z",
        "updatedAt": "2025-01-05T05:49:23.772Z",
        "__v": 0
      },
      {
        "_id": "677a1d66aaba8f58c614a158",
        "name": "Handcrafted Metal Sausages",
        "description": "You can't program the driver without navigating the wireless RAM application!",
        "videos": [],
        "owner": "6762f5a7885c3668f778aa04",
        "createdAt": "2025-01-05T05:49:26.190Z",
        "updatedAt": "2025-01-05T05:49:26.190Z",
        "__v": 0
      }
    ]
  },
  "message": "Playlists fetched successfully",
  "success": true
}
```

## Delete playlist

**Request**

- **Method**: `DELETE`

- **URL**: `localhost:8000/api/v1/playlist/677a1ca4aaba8f58c614a140`

---

**Response:**

- **Method**: `DELETE`

- **URL**: `localhost:8000/api/v1/playlist/677a1ca4aaba8f58c614a140`
- **Code**: 200

---

### Response Body:

```json
{
  "statusCode": 200,
  "data": {
    "_id": "677a1ca4aaba8f58c614a140",
    "name": "Licensed Soft Mouse",
    "description": "Regional",
    "videos": [],
    "owner": "6762f5a7885c3668f778aa04",
    "createdAt": "2025-01-05T05:46:12.852Z",
    "updatedAt": "2025-01-05T05:46:12.852Z",
    "__v": 0
  },
  "message": "Playlist deleted successfully",
  "success": true
}
```

## Dashboard

### channel stats

- **Method**: `GET`

- **URL**: `localhost:8000/api/v1/dashboard/stats/6762f5a7885c3668f778aa04`

---

#### Response:

```json
{
  "statusCode": 200,
  "data": {
    "userDetails": {
      "_id": "6762f5a7885c3668f778aa04",
      "username": "litun098",
      "email": "nayaklitun9@gmail.com",
      "fullName": "Litun Nayak",
      "avatar": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538659/efjbolkn8cjgvqabulal.jpg",
      "coverImage": "http://res.cloudinary.com/dbcc9vr2u/image/upload/v1734538661/akdmp1daknshduch7yto.jpg",
      "watchHistory": [
        "677a1eccaaba8f58c614a18b",
        "6762fa888435da7925c0f4a8",
        "67681eb62dcadc59233256b2"
      ],
      "password": "$2b$10$Clvdsk.IQLEOYjsyoQZyue91W9pjHiUmQGoZ9KMM/WbzrCNAqKb9K",
      "createdAt": "2024-12-18T16:17:43.227Z",
      "updatedAt": "2025-01-05T14:39:10.076Z",
      "__v": 10,
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYyZjVhNzg4NWMzNjY4Zjc3OGFhMDQiLCJpYXQiOjE3MzYwODcwNzIsImV4cCI6MTczNzgxNTA3Mn0.9B0lrpNVkPLXa9UO3ClyGU9LmfQfX-rKsgZ-STPTCVc"
    },
    "totalVideos": 0,
    "totalViews": 0,
    "totalSubscribers": 1,
    "totalLikes": 1
  },
  "message": "Channel stats fetched successfully.",
  "success": true
}
```

---

## channel videos

- **Method**: `GET`

- **URL**: `localhost:8000/api/v1/dashboard/videos/6762f5a7885c3668f778aa04`

---

#### Response:

- **Status**: OK
- **Code**: 200

---

#### Response Body:

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6762fa888435da7925c0f4a8",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734539900/duqrnkqztkmc90acxdln.webp",
      "title": "First Video",
      "description": "Description of first video",
      "duration": 4,
      "views": 39
    },
    {
      "_id": "67681eb62dcadc59233256b2",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1734876605/dktkljlnkwgl8rvcsepv.webp",
      "title": "Second Video",
      "description": "Description of second video",
      "duration": 4,
      "views": 2
    },
    {
      "_id": "677a1eccaaba8f58c614a18b",
      "thumbnail": "https://res.cloudinary.com/dbcc9vr2u/image/upload/v1736056483/shcf2rh1mdae9fzrhvhf.jpg",
      "title": "third video",
      "description": "Description of the video",
      "duration": 4,
      "views": 2
    }
  ],
  "message": "Channel videos fetched successfully.",
  "success": true
}
```

## Running Tests

Add your test cases and run:

```bash
npm test
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Author

This project was developed by Dibyakanta Nayak.
