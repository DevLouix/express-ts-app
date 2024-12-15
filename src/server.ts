require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import indexRouter from "./routes/index";
import net from "net";

const app = express();
const PORT = process.env.PORT as unknown as number

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET!, // Replace with a secure key
    resave: false, // Prevent resaving session if not modified
    saveUninitialized: false, // Only save sessions with data
    cookie: { secure: false }, // Use `true` if serving over HTTPS
  })
);

// add routes
app.use("/", indexRouter);

// Function to check if a port is in use
const isPortInUse = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(true); // Port is in use
      } else {
        resolve(false); // Other errors
      }
    });
    server.listen(port, "127.0.0.1", () => {
      server.close();
      resolve(false); // Port is available
    });
  });
};

// Function to find the next available port
const findAvailablePort = async (startingPort: number): Promise<number> => {
  let port = startingPort;
  while (await isPortInUse(port)) {
    console.log(`Port ${port} is in use. Trying the next port...`);
    port++;
  }
  return port;
};

// Find the next available port starting from 3000
findAvailablePort(PORT!).then((port) => {
  // Start the server on the available port
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
