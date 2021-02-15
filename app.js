const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));  //to make images & css folder dynamic while running on port
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req , res){
    res.sendFile(__dirname +"/signup.html");          
});


mailchimp.setConfig({
  apiKey: "4f352cadf66e276d7d0280524363f6fd-us1",      //will store in mailchimp.com account
  server: "us1"
});


app.post("/signup.html", function(req,res){
    const firstName = req.body.fName;
    const lastName =  req.body.lName;
    const email = req.body.email;

    const listId = "aa34b089d3";

    const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email
    };
    //Uploading the data to the server
    async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
    });

     res.sendFile(__dirname + "/success.html")
     console.log(`${response.merge_fields.FNAME} ${response.merge_fields.LNAME} with email ${response.email_address} has been successfully registered`);
 
    }

    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure.html", function(req,res){
     res.redirect("/");
});

app.listen(process.env.PORT ||3000 , function(){
    console.log("Server is running on port 3000");
});


//API Key  -  4f352cadf66e276d7d0280524363f6fd-us1
//List ID  -  aa34b089d3