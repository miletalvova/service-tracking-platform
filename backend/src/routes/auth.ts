import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import userService from "../services/userService.js";
import jwt from "jsonwebtoken";

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, username, password, role } = req.body;
    if (firstname == null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "First name is required" });
    }
    if (lastname == null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "Last name is required" });
    }
    if (email == null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "Email is required" });
    }
    if (username == null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "Username is required" });
    }
    if(password == null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "Password is required" });
    }
    const existingUser = await userService.getOne(email);
    if (existingUser != null) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await userService.create({
            FirstName: firstname, LastName: lastname, Email: email, Username: username, EncryptedPassword: hashedPassword, RoleId: role.id
        });
        res.json({ status: "success", statuscode: 201, message: "User registered successfully" });
    } catch (err) {
        next(err);
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email) {
      return res.status(400).json({ status: "error", statuscode: 401, message: "Email is required" });
  }
  if (!password) {
      return res.status(400).json({ status: "error", statuscode: 401, message: "Password is required" });
  }
  try {
    const data = await userService.getOne(email);
    if (!data) {
        return res.status(401).json({ status: "error", statuscode: 401, message: "Invalid email or password" });
    }
    bcrypt.compare(password, data.EncryptedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ status: "error", statuscode: 500, message: "Internal server error" });
        }        if (!result) {
            return res.status(401).json({ status: "error", statuscode: 401, message: "Invalid username or password" });
        }
        let token;
        try {
            token = jwt.sign({ id: data.id, email: data.Email }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        } catch (err) {
            return res.status(500).json({ status: "error", statuscode: 500, message: "Internal server error" });
        }
        res.json({ status: "success", statuscode: 200, message: "Login successful", token });
    });
  } catch (err) {
    res.status(500).json({ status: "error", statuscode: 500, message: "Internal server error" });
  }
});

export default router;