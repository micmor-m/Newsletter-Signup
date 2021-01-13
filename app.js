const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const { response } = require("express");
const { url } = require("inspector");

//require dotenv to import env variable
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//create static folder in the server containing all files to server the client
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/signup.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  //the url is provided by the API owner
  const url =
    "https://us7.api.mailchimp.com/3.0/lists/" + `${process.env.LIST_ID}`;

  const options = {
    method: "POST",
    auth: `user:${process.env.API_KEY}`,
  };

  //Method request of https allow to specify the method of the request (GET, POST,...)
  const request = https.request(url, options, (response) => {
    //error message in case of any problem
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "/success.html"));
    } else {
      res.sendFile(path.join(__dirname, "/failure.html"));
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server listening at post 3000");
});
