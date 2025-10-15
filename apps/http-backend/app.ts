import app from "./src/index.ts";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`HTTP server is live at http://localhost:${PORT}`);
});

// optional graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => console.log("Server closed"));
});
