import pool from "./config/db.js";
import { createUsersTable, getAllUsers, createUser, findUserByEmail } from "./models/userModel.js";

// connecting to DB
async function connect() {
	try {
		// Check DB connectivity before boot
		await pool.query("SELECT 1");
		console.log("Connected to PostgreSQL");
	} catch (err) {
		console.error("Database not reachable:", err);
		process.exit(1); // stop process
	}
}
connect();
// createUsersTable();
// getAllUsers();
// createUser({ username: "test", email: "test", password: "test" });
// findUserByEmail("test");
