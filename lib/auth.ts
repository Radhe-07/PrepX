import bcrypt from "bcrypt";
import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(password, passwordHash);
}

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createToken(payload: Record<string, unknown>) {
  const header = base64url(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const body = base64url(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest();

  return `${header}.${body}.${base64url(signature)}`;
}

export function verifyToken(token: string) {
  try {
    const [header, body, signature] = token.split(".");

    if (!header || !body || !signature) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest();

    const receivedSignature = Buffer.from(
      signature.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    );

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return null;
    }

    return JSON.parse(
      Buffer.from(
        body.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString()
    );
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}