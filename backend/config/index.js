// backend/config/index.js
module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    },

    //adding production key including internal database url for Postgres (this is from troubleshooting project configuration)
    production: {
      // use_env_variable: 'postgres://app_academy_projects_2w5m_user:r6edBUHr4fyzuvmfhxWUMy8TFdcARaHp@dpg-cfjsu7hmbjsn9e9keip0-a/app_academy_projects_2w5m',
      use_env_variable: 'postgres://aa_projects_big5_user:KZT4l1v3iucepsa2pQuT9R4o6E4JPTth@dpg-chf8ejgrddl9buirjle0-a/aa_projects_big5',
      dialect: 'postgres',
      // ...
    }
  };

//Each environment variable will be read and exported as a key from this file.
