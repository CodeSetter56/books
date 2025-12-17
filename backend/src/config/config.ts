import {config as conf} from 'dotenv';
import path from "path";

conf({ path: path.resolve(__dirname, "../../../.env") });

const _config = {

    port: process.env.PORT,
    mongo: process.env.MONGO_URI,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        apiSecret: process.env.CLOUDINARY_API_SECRET!,
    },
    frontendUrl: process.env.FRONTEND_URL,

    refreshToken: {
        cookieName: "refreshToken",
        tokenExpiry: {
            access: "15m" as const,
            refresh: "7d" as const,
        },
        cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
}

export const config = Object.freeze(_config);