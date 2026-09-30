// Usage: node scripts/hash-password.mjs
// Generates a random admin password, its scrypt hash, and a session secret.
// Save the printed password in a password manager: only the hash goes in env.
import { randomBytes, scryptSync } from "node:crypto";

const password = randomBytes(18).toString("base64url"); // 24 chars, no shell-special characters
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`Password (log in with this, then store it safely): ${password}\n`);
console.log("Add to .env.local / Coolify runtime env:");
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log(`INVITE_SECRET=${randomBytes(32).toString("hex")}`);
