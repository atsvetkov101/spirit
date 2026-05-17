import { Sequelize } from 'sequelize';

// Для доступа к process.env
declare const process: {
  env: {
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    NODE_ENV?: string;
  };
};

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'spirit',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'developer',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Синхронизация моделей с базой данных (в продакшене использовать миграции)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // В development режиме можно синхронизировать, в production - использовать миграции
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, syncDatabase }