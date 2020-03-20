const express = require('express');
const app = express();
const PORT = 5000; // port 8080 wasn't working
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { checkEmail } = require('./helpers')

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

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};



app.get('/urls', (req, res) => {
  const user_id = req.cookies.user_id
  const user = users[user_id]
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
    user: req.cookies.user_id
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
    username: body.req.username,
  };
  
  res.render("urls_index", templateVars);
  res.render("urls_new", templateVars);
  res.render("urls_show", templateVars);
  res.render('login');
});

// endpoint for login page
// app.get('/login', (req, res) => {
// });

app.post('/login', (req, res) => {
  res.cookie("user_id", req.body.username);
  res.redirect('/urls')
});

app.post('/logout', (req, res) => {
  // console.log('hi')
  res.clearCookie("user_id");
  res.redirect('/urls');
});


// registration template
app.get('/register', (req, res) => {
  res.render('registration');
});

// endpoint that handles the registration form data
app.post('/register', (req, res) => {
  let newUser = generateRandomString();
  users[newUser] = {
    id: newUser,
    email: req.body.email,
    password: req.body.password,
  }
  // Error handling
  // Check if the email and password input are empty. If they are, then return a 400 status code 
  let email = users[newUser].email
  let password = users[newUser].password

  if(email.length === 0 || password.length === 0) {
    res.statusCode = 400;
    res.send(res.statusCode);
  } else if (checkEmail(users, email)) {
    res.statusCode = 400;
    res.send(res.statusCode);
  }

  res.cookie("user_id", users[newUser]);
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

// app.get('/hello', (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});