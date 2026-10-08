

This repo contains two main folders (client built with Next Js, and server built with express js)

<h1>USED TECHNOLOGIES ARE:</h1>
1-Next Js for client side
2-Express Js for server side
3-MariaDB


1-DB:
  $ docker compose up -d
  $ mariadb -u root -p < database/schema.sql



2- How to run client side
    <b>Install Deps</b>
    $ npm install

    <b>Add .env.local</b>
    please fill the .env.local file with the following variables:
    NEXT_PUBLIC_API_URL=http://localhost:8000


    <b>Directly Run Application</b>
    $ npm run dev


3- How to run server side
    <b>Install Deps</b>
    $ npm install

    <b>add .env</b>
    please use the env variable below for server side:

    .env:
    PORT=8000
    DB_HOST=localhost
    DB_PORT=3300
    DB_USER=root
    DB_PASSWORD=admin
    DB_NAME=e2next_db
    SECRET_KEY='KAaN238D_SDB93uQS@#nDS()@nDIS=029dn@#ndpi9@SID'


    <b>Seed:</b>
    $ npm run seed
    
    <b>Run the server:</b>
    $ npm run dev
    


## Seeded Accounts
- **Admin:** `admin@example.com` / `admin123`
- **Staff:** `staff@example.com` / `staff123`