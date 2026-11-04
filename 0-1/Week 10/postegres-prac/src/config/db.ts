import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:raghav123@localhost:5432/postgresLearning",
});

export default pool;
