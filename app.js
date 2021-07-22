//inbuilt setup
const fs = require("fs");
const path = require("path");

//express setup
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const basicAuth = require("express-basic-auth");

//link files
const AuthChallenger = require("./utils/auth");
const NoteService = require("./Service/noteService");
const NoteRouter = require("./Router/NoteRouter");

//handlebar config
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//basic Auth function, ref='./utils/auth'
app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(path.join(__dirname + "/utils/users.json")))
    ), // we are defining the file where our users exist with this code: JSON.parse(fs.readFileSync(path.join(__dirname, config.users))), we also parse the data so that we can iterate over each user like a JavaScript variable/ object.
    challenge: true,
    realm: "Note Taking Application",
  })
);

//create new instance of Note Service with targeted storage file path
const noteService = new NoteService(path.join(__dirname, "/Storage/test.json"));

//create new instance of Note Router with the note service above
app.use(("/api/notes", new NoteRouter(noteService).router()));

//Port setup
app.listen(8080, () => {
  console.log(`port 8080`);
});


module.exports = app