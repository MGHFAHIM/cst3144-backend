---

### 3.2 Backend README (in `backend-express/README.md`)

## GitHub Repository

https://github.com/MGHFAHIM/cst3144-backend.git

## Route Link Render.vom

https://cst3144-backend-mqmq.onrender.com/lessons

````markdown
# CST3144 Backend – Express + MongoDB

This is the Express.js backend API for my CST3144 coursework.

## Tech stack

- Node.js
- Express.js
- MongoDB Atlas (native driver, no Mongoose)
- CORS
- dotenv (for local development)

## Endpoints

- `GET /lessons` – return all lessons as JSON
- `GET /search?q=term` – full-text search across subject, location, price, spaces
- `POST /orders` – saves a new order document
- `PUT /lessons/:id` – updates any lesson fields (used to update spaces)
- `GET /images/<filename>` – returns lesson images (static file middleware)

## MongoDB

- Database: `school` (or as configured in `MONGODB_URI`)
- Collections:
  - `lessons` – subject, location, price, spaces, icon, etc.
  - `orders` – name, phone, items, createdAt

## Running locally

1. Create a `.env` file:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
   PORT=4000
   ```
````
