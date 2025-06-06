import { Pool } from "pg";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_DATABASE || "book_catalog",
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "Post_1234",
  ssl: process.env.NODE_ENV === "production",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const createDatabasePool = (): Pool => {
  return new Pool({
    host: databaseConfig.host,
    port: databaseConfig.port,
    database: databaseConfig.database,
    user: databaseConfig.username,
    password: databaseConfig.password,
    ssl: databaseConfig.ssl ? { rejectUnauthorized: false } : false,
    max: databaseConfig.max,
    idleTimeoutMillis: databaseConfig.idleTimeoutMillis,
    connectionTimeoutMillis: databaseConfig.connectionTimeoutMillis,
  });
};
