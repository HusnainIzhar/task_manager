import app from "./app";
import { connectDB } from "./config/db.config";
require("dotenv").config();

const PORT = process.env.PORT || 9000;

// Connect to database first, then start server
// This helps with cold starts in serverless environments
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// For Vercel serverless deployment, export the app
export default app;
