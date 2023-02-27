@REM running pending migrations
npx dotenv sequelize-cli db:migrate

@REM undo last migration
npx dotenv sequelize-cli db:migrate:undo

@REM undo all migrations
npx dotenv sequelize-cli db:migrate:undo:all

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


@REM order of migrations should be: Spots Bookings Reviews ReviewImages SpotImages
npx sequelize-cli model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:integer,lng:integer,name:string,description:string,price:integer

npx sequelize-cli model:generate --name Booking --attributes spotId:integer,userId:integer,startDate:DATE,endDate:DATE

npx sequelize-cli model:generate --name Review --attributes userId:integer,spotId:integer,review:string,stars:integer

npx sequelize-cli model:generate --name SpotImage --attributes spotId:integer,url:text,preview:boolean

npx sequelize-cli model:generate --name ReviewImage --attributes url:text,reviewId:integer


@REM generating seeder files for demo:spot/spot-image/booking/review/reviewimage
npx sequelize seed:generate --name demo-user

npx sequelize seed:generate --name demo-spot

npx sequelize seed:generate --name demo-spot-image

npx sequelize seed:generate --name demo-booking

npx sequelize seed:generate --name demo-review

npx sequelize seed:generate --name demo-review-image



//-----------------------------------------------------
@REM testing from How to use API Docs to Code Endpoints video
npx sequelize-cli model:generate --name wishlist --attributes gameId:integer,userId:integer

@REM generating new seed file
npx sequelize-cli seed:generate --name wishlists
