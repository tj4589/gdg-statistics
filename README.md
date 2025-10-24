# GDG Statistics Application

A Google Developer Group member registration and statistics application.

## 🚀 Render Deployment

### Environment Variables Required:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production` (automatically set by Render)

### Deployment Steps:
1. Connect your GitHub repository to Render
2. Set the environment variables
3. Render will automatically deploy from the `master` branch

### API Endpoints:
- `GET /` - Server status
- `GET /health` - Health check
- `GET /api/members` - Get all members
- `POST /api/members` - Register new member
- `DELETE /api/members/:id` - Delete member

## 🔧 Local Development

```bash
cd backend
npm install
npm start
```

## 📱 Frontend
The frontend is a static site that can be deployed to Vercel, Netlify, or any static hosting service.
