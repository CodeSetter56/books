const fs = require("node:fs");
const path = require("node:path");
const config = require("./project-config.json");

const backendEnvContent = `
PORT=${config.backendPort}
MONGO_URI=${config.dbUrl}
NODE_ENV=${config.nodeEnv}
JWT_SECRET=${config.jwtSecret}
FRONTEND_URL=http://localhost:${config.frontendPort}
CLOUDINARY_CLOUD_NAME=${config.cloudinary.cloudName}
CLOUDINARY_API_KEY=${config.cloudinary.apiKey}
CLOUDINARY_API_SECRET=${config.cloudinary.apiSecret}
`.trim();

const frontendEnvContent = `
NEXT_PUBLIC_BACKEND_URL=http://localhost:${config.backendPort}/api
`.trim();

const backendPath = path.join(__dirname, "backend", ".env");
const frontendPath = path.join(__dirname, "frontend", ".env");

fs.writeFileSync(backendPath, backendEnvContent);
fs.writeFileSync(frontendPath, frontendEnvContent);
