import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";
import { makeId } from '../util/util';
import { createAccessToken, createRefreshToken } from './token.controller';

const { JWT_SECRET_KEY } = process.env;

/**
 * Creates a user with a unique email and username.
 * If successful, returns an access and refresh token.
 */
export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, username, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res.status(400).json({ error: "An account with this email was already created." });
    }
    const userWithUsername = await User.findOne({ username });
    if (userWithUsername) {
      return res.status(400).json({ error: "Username taken." });
    }

    const newUser = await new User(req.body).save();
    const accessToken = createAccessToken(newUser);
    const refreshToken = await createRefreshToken(newUser);

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Given a valid email and password, returns an access and refresh token.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid password!" });
    }
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    const userobj = {
      _id: user._id,
      username: user.username
    };
    return res.status(201).json({ accessToken, refreshToken, userobj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Given a valid email address, updates the user with a reset code and sends an email with a reset link.
 */
export const forgot = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const code: string = makeId(10);
    const user = await User.findOneAndUpdate(
      { email },
      { resetCode: code },
      { useFindAndModify: false }
    );
    if (!user) {
      return res.status(404).json({ error: "No user found with this email." });
    }
    // Todo: Send email
    return res.status(201).json({ message: 'Email sent to reset your password.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Resets a user's password when given the correct reset code.
 */
export const reset = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { resetCode, newPassword } = req.body;
    if (!resetCode) {
      return res.status(400).json({ error: "Reset code is required." });
    }
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required." });
    }
    const user = await User.findOne({ resetCode });
    if (!user) {
      return res.status(404).json({ error: "The reset link you have is wrong." });
    } else {
      user.resetCode = undefined;
      user.password = newPassword;
      await user.save();
      return res.status(201).json({ message: 'Password reset.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Generates a JWT access token from a valid Refresh token.
 */
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ error: "Access denied, refresh token missing." });
    }
    const tokenPayload: any = jwt.verify(refreshToken, JWT_SECRET_KEY);
    if (tokenPayload.type !== 'refresh') {
      return res.status(403).json({ error: "Access denied, wrong token type." });
    }
    const userId = tokenPayload._id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(403).json({ error: "Access denied, no user matching token." });
    }
    const keyToCompare = userId + user.password;

    const valid = bcrypt.compareSync(keyToCompare, tokenPayload.key);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "Invalid token, please login again." });
    }
    const accessToken = createAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Returns the user's information from what is stored in their JWT access token.
 */
export const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const payload: any = jwt.verify(token, JWT_SECRET_KEY);
    return res.status(200).json({ _id: payload._id, username: payload.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
