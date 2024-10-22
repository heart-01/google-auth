import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const router = express.Router();
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

// Add user to request express
declare module "express-serve-static-core" {
  interface Request {
    user?: number;
  }
}

// Route for Google login
router.post(
  "/api/v1/auth/google",
  async (req: Request, res: Response): Promise<void> => {
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
          },
        });
      }

      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ accessToken, user });
    } catch (error) {
      console.error("Error during authentication:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route for Local SignUp
router.post(
  "/api/v1/auth/local/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email, authProvider: "LOCAL" },
      });

      if (existingUser) {
        res.status(400).json({ message: "Email is already in use" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          authProvider: "LOCAL",
          username,
          email,
          password: hashedPassword,
        },
      });

      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ accessToken, user });
    } catch (error) {
      console.error("Error during sign up:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route for Local SignIn
router.post(
  "/api/v1/auth/local/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email, authProvider: "LOCAL" },
      });
      if (!user || !user.password) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ accessToken, user });
    } catch (error) {
      console.error("Error during sign up:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
