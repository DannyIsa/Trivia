# Trivia


hello welcome to trivia game version -2
in order to run the app , locally on your computer follow the the next orders:
(we are going to work on branch cloud2-amit)



first of all you should open a local connection on your SQL workbench

a.after cloning this repo , go to branch cloud2-amit and open in vs code.

b.go to the folder db and add a file named ".env" - (the file should be at the root of the folder db : "TRIVIA/DB/.env").

c. go to the file ".gitignore" inside the db folder and type .env in a new line

d.the content of the .env file-you just created should look like this:

---

SQL_PASSWORD =
SQL_USERNAME =
SQL_DATA_BASE =
SQL_HOST =
SQL_DIALECT =
ACCESS_TOKEN_SECRET =
REFRESH_TOKEN_SECRET =

---

copy the above and sing into those variables your one local sql connection details.

2.open the terminal and run the commends:
a. cd client
b. npm i
c. cd ..
d. cd db
h. npm i
now you loaded the dependencie on both folders: db and client and you should be in db folder.
run the next commands in the terminal:
1.npx sequelize-cli db:migrate
2.npx sequelize-cli db:seed:all

---

now in the terminal run:

1. npm run dev. you should see the log: listening on port 3000.
   open another terminal and type:
1. cd client
1. npm start. the browser should open and you are good to go.
   good luck
