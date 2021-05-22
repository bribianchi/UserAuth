import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/user.model';

const { JWT_SECRET_KEY } = process.env;

/**
 * Creates a JWT access token for a given user.
 * @param user The user who is receiving the access token.
 * @returns  Access JWT.
 */
export const createAccessToken = (user: UserDocument): string => {
    const type = 'access';
    const _id = user._id;
    const username = user.username;

    const tokenPayload = { type, _id, username };
    const accessToken = jwt.sign(
        tokenPayload,
        JWT_SECRET_KEY,
        {
            expiresIn: "15m",
            issuer: "issuer",
            audience: "audience",
            subject: user._id.toString()
        }
    );
    return accessToken;
};

/**
 * Creates a JWT refreosh token for a given user.
 * @param user The user who is receiving the refresh token.
 * @returns Refresh JWT.
 */
export const createRefreshToken = async (user: UserDocument): Promise<string> => {
    const type = 'refresh';
    const _id = user._id;
    const username = user.username;
    const password = user.password;
    const key = await generateKey(_id, password);

    const tokenPayload = { type, _id, username, key };

    const refreshToken = jwt.sign(
        tokenPayload,
        JWT_SECRET_KEY,
        {
            issuer: "issuer",
            audience: "audience",
            subject: user._id.toString()
        });
    return refreshToken;
};

/**
 * User's id and password are concatenated and hashed to create a unique key used in the refresh token.
 * @param id User's database generated id.
 * @param password User's encrypted password.
 * @returns Unique, encrypted user key.
 */
const generateKey = async (id: string, password: string): Promise<string> => {
    const rawKey = id + password;
    const salt = await bcrypt.genSalt(12);
    const key = await bcrypt.hash(rawKey, salt);
    return key;
};
