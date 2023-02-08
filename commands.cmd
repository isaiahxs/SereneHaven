@REM running pending migrations
npx dotenv sequelize-cli db:migrate

@REM undo last migration
npx dotenv sequelize-cli db:migrate:undo

@REM generating a user seeder file for the demo user
npx sequelize seed:generate --name demo-user

@REM seed all
npx dotenv sequelize db:seed:all

@REM undo last seed
npx dotenv sequelize db:seed:undo

@REM undo all seeds
npx dotenv sequelize db:seed:undo:all
