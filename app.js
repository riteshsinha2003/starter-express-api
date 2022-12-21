
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();

app.use(express.static("public"));                      //public is the name of static folder
app.use(bodyParser.urlencoded({extended: true}));



app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

mailchimp.setConfig({
  apiKey: "d7422f4c66fe8004103e41c676da8a9f-us14",
  server: "us14",
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const listId = "9f1869b83d";
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      }
    });
    res.sendFile(__dirname + "/success.html");


    console.log(`Successfully added contact as an audience member. The contact id is ${
 response.id
 }.`);
  }




  run().catch(e => res.sendFile(__dirname + "/failure.html"));



});








// API KEY
// d7422f4c66fe8004103e41c676da8a9f-us14

// list id
// 9f1869b83d
