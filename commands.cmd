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


@REM create migration for adding column to Users table
npx sequelize-cli migration:generate --name users-add-remove-columns

@REM undo last migration
npx sequelize-cli db:migrate:undo


//-----------------------------------------------------
@REM testing from How to use API Docs to Code Endpoints video
npx sequelize-cli model:generate --name wishlist --attributes gameId:integer,userId:integer

@REM generating new seed file
npx sequelize-cli seed:generate --name wishlists
