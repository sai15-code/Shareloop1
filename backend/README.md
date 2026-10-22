# ShareLoop Backend

## Installation

From the `backend` directory, install the backend dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection
string. For a local MongoDB server, the example URI uses the default local
address and the `shareloop` database. For MongoDB Atlas, replace it with the
connection string provided by Atlas; keep credentials in `.env` and never
commit that file. Set `JWT_SECRET` to a long, random value; do not use the
placeholder in production.

The server connects to MongoDB before listening for requests. It exits with an
error if `MONGODB_URI` is missing or the database connection fails. Mongoose
models for users, listings, and claims are defined in `src/models/`.

## Start the server

Run in development mode with automatic restarts:

```bash
npm run dev
```

Start the server without watch mode:

```bash
npm start
```

After MongoDB is running and configured, the health endpoint is available at
`http://localhost:5000/api/health` by default.

## Authentication API

Successful responses use `success: true` and return data under `data`. Errors
use `success: false` and include a `message`.

### `POST /api/auth/register`

Request body:

```json
{
  "name": "Sam Member",
  "email": "sam@example.com",
  "password": "at-least-8-characters"
}
```

Returns `201` with the safe user profile (id, name, email, and timestamps).
Returns `400` for missing or invalid fields and `409` if the email is already
registered. Passwords must be at least 8 characters and no more than 72 UTF-8
bytes.

Example response (`201`):

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Sam Member",
      "email": "sam@example.com",
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```

Status codes: `201` created, `400` invalid input, `409` duplicate email.

### `POST /api/auth/login`

Request body:

```json
{
  "email": "sam@example.com",
  "password": "at-least-8-characters"
}
```

Returns `200` with a JWT and safe user profile. Returns `400` for invalid input
and `401` for incorrect credentials.

Example response (`200`):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Sam Member",
      "email": "sam@example.com",
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```

Status codes: `200` authenticated, `400` invalid input, `401` invalid
credentials.

### `GET /api/auth/me`

Send the login token in the `Authorization: Bearer <token>` header. Returns
`200` with the authenticated user's safe profile, or `401` if the token is
missing, invalid, or expired.

Example response (`200`):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Sam Member",
      "email": "sam@example.com",
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```

Status codes: `200` authenticated, `401` missing, invalid, or expired token.

## Listings API

Listing requests and responses use the existing `Listing` model fields:
`title`, `description`, `category`, `condition`, `images`, `locality`,
`pickupDetails`, `status`, and `owner`. Categories, conditions, and handover
types must match the values defined in `src/models/Listing.js`. The API sets
`owner` from the authenticated user; clients cannot set or change it.

Protected requests use the token returned by `POST /api/auth/login` in the
Postman **Authorization → Bearer Token** field.

### `GET /api/listings?page=1&limit=20`

Returns only listings with `status: "available"`, newest first. `page` is
one-based, `limit` defaults to 20 and cannot exceed 100.

Example response (`200`):

```json
{
  "success": true,
  "data": {
    "listings": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 0,
      "totalPages": 0
    }
  }
}
```

Returns `400` if pagination values are invalid.

### `GET /api/listings/:id`

Returns one listing. Returns `400` for a malformed MongoDB ID and `404` if no
listing exists for a valid ID.

### `POST /api/listings`

Requires authentication. Required JSON fields are `title`, `description`,
`category`, `condition`, `locality`, and `pickupDetails` (with `handoverType`
and `instructions`). `images` is optional and defaults to an empty array.

Example request:

```json
{
  "title": "Community bookshelf",
  "description": "A sturdy bookshelf available for pickup this week.",
  "category": "Furniture",
  "condition": "Gently Used",
  "images": [],
  "locality": "North Park",
  "pickupDetails": {
    "handoverType": "Porch Pickup",
    "instructions": "Message before arriving to arrange pickup."
  }
}
```

Returns `201` with the created listing. Returns `400` for invalid fields or
schema validation failures (the response identifies invalid schema paths) and
`401` if authentication is missing or invalid.

### `PATCH /api/listings/:id`

Requires authentication and listing ownership. Accepts one or more listing
fields from the schema; `owner` cannot be changed.

Example request:

```json
{
  "title": "Updated bookshelf title",
  "status": "withdrawn"
}
```

Returns `200` with the updated listing. Returns `400` for invalid input or ID,
`401` if authentication is missing or invalid, `403` if the caller is not the
owner, and `404` if the listing does not exist.

### `DELETE /api/listings/:id`

Requires authentication and listing ownership. Returns `200` after deletion,
`400` for a malformed ID, `401` if authentication is missing or invalid,
`403` if the caller is not the owner, and `404` if the listing does not exist.

Database failures return `500` using the standard error response.

## Run backend tests

The tests require MongoDB and use a dedicated database named `shareloop_test`
by default. You can set `TEST_MONGODB_URI` to another dedicated test database
URI. The tests clear the users collection in that test database.

```bash
npm test
```
