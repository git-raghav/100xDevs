import pool from "../config/db.js";

type User = {
    email: string;
    username: string;
    password: string;
}

export async function createUsersTable() {
	const result = await pool.query(
		`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`,
	);
	console.log(result);
}

export async function getAllUsers() {
	const result = await pool.query(`SELECT * FROM users`);
	console.log(result.rows);
}

export async function createUser({ email, username, password }: User) {
  const result = await pool.query(
    `INSERT INTO users (email, username, password)
     VALUES ($1, $2, $3) RETURNING *`,
    [email, username, password]
  );
  console.log(result.rows[0]);
}

export async function findUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  console.log(result.rows[0]);
}

// export async function findUserByUsername(username) {
//   const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//   return result.rows[0];
// }

// export async function updatePassword(userId, newPasswordHash) {
//   await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
// }

// export async function deleteUser(userId) {
//   await pool.query('DELETE FROM users WHERE id = $1', [userId]);
// }
