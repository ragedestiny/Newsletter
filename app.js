const bodyParser = require('body-parser');
const https = require("https");
const express = require('express');


const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;


  const data = {
    members: [{
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us21.api.mailchimp.com/3.0/lists/10999e3987'

  const options = {
    method: 'POST',
    auth: 'Sporky:5a5e7d307e77c2cb8b47edbcd8f00c1f-us21a'
  }

  const request = https.request(url, options, response => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', data => {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})

app.post('/failure', (req,res) => {
  res.redirect('/');
})


app.listen(port, () => {
  console.log('Server is running on port ' + port);
})

// API Key
// 5a5e7d307e77c2cb8b47edbcd8f00c1f-us21

// Audience Id
// 10999e3987
