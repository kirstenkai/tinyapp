const express = require('express');
const app = express();
const PORT = 5000; // port 8080 wasn't working
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

// **** REMINDER: REVIEW THIS CODE WITH A MENTOR 
const crypto = require('crypto');

function generateRandomString() {
  let random = crypto.randomBytes(6).toString('hex');
  return random
}

// --------------------------------------------

// set the view engine to ejs
app.set('view engine', 'ejs');

// user res.render to load up an ejs view file

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

// Render urls_new template 

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});




app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
})


app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

