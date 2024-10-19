import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction } from "express-serve-static-core";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const prisma = new PrismaClient();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

const googleClient = new OAuth2Client(CLIENT_ID);

// Google User Payload
interface GoogleUserPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

// config JWT Payload
interface JwtPayload {
  userId: number;
}

// Add user to request express
declare module "express-serve-static-core" {
  interface Request {
    user?: number;
  }
}

// Middleware for authentication
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = (decoded as JwtPayload).userId;
    next();
  });
};

// Route for Google login
app.post("/api/v1/auth/google", async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload() as GoogleUserPayload;

    let user = await prisma.user.findUnique({
      where: { googleId: payload.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          authProvider: "GOOGLE",
          googleId: payload.sub,
          username: payload.email,
          email: payload.email,
          name: payload.name,
          phoneNumber: "",
        },
      });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken, user });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Route for protected route
app.get(
  "/api/v1/protected-route",
  authenticateToken,
  async (req: Request, res: Response) => {
    const userId = req.user;
    if (!userId) return res.sendStatus(401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ message: "This is a protected route", user });
  }
);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
