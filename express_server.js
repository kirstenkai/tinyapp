const express = require('express');
const app = express();
const PORT = 5000; // port 8080 wasn't working
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Using crypto module to create a randomized alphanumeric string
const crypto = require('crypto');

function generateRandomString() {
  let random = crypto.randomBytes(3).toString('hex');
  return random
}

let shortURL = generateRandomString();

// --------------------------------------------

app.set('view engine', 'ejs');

// user res.render to load up an ejs view file
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
  };
  res.render('urls_index', templateVars);
});


// Render urls_new template 
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post("/urls", (req, res) => {
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  console.log("HELLO", req)
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

// handle routing for login
app.get('/login', (req, res) => {
  let templateVars = {
    username: req.cookies.username,
  };
  res.render("urls_index", templateVars);
  res.render("urls_new", templateVars);
  res.render("urls_show", templateVars);
});


app.post('/login', (req, res) => {
  res.cookie("username", req.body.username );
  res.redirect('/urls')
});

app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
});

// *******  Edit button is deleting the link *******
app.post('/urls/:id', (req, res) => {

  urlDatabase[req.params.id] = req.body.update;
  res.redirect('/urls');
});

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

