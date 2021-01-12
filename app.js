const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//create static folder in the server containing all files to server the client
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/signup.html"));
});

app.post("/", (req, res) => {
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);
});

app.listen(3000, () => {
  console.log("Server listening at post 3000");
});
