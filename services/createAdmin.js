import { sql } from "../database/database.js";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const createAdmin = async () => {
    const result = await sql`SELECT * FROM users WHERE admin = true`;

    if (result.length === 0) {
        const adminPassword = "123456";
        const adminEmail = "admin@admin.com";
        const hashedPassword = await hash(adminPassword);
        await sql`INSERT INTO users(email,admin,password) VALUES (${adminEmail},true,${hashedPassword})`;
        console.log("admin created");
    }
};

export { createAdmin };
