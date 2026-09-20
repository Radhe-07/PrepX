import "dotenv/config";
import bcrypt from "bcrypt";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const vishnuPassword = await bcrypt.hash("123", 12);
  const adminPassword = await bcrypt.hash("admin123", 12);

  await client.query(
    `
    INSERT INTO "User"
      ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
    VALUES
      ($1, $2, $3, $4, $5, NOW(), NOW()),
      ($6, $7, $8, $9, $10, NOW(), NOW())
    `,
    [
      crypto.randomUUID(),
      "Vishnu",
      "vishnu@prepx.com",
      vishnuPassword,
      "STUDENT",

      crypto.randomUUID(),
      "Radhe",
      "radhe@prepx.com",
      adminPassword,
      "ADMIN",
    ]
  );

  console.log("Users created successfully");

  await client.end();
}

main().catch(console.error);