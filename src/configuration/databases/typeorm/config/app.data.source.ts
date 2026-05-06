import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { entities } from './entities';

config();
const isProduction = process.env.NODE_ENV === 'production';
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities,
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  synchronize: false,
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOGGING === 'true',
    // ...(isProduction && {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
});

export { AppDataSource };