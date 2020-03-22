const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const PORT = 8080; 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

const { checkEmail, validatePassword, findUser, verifyLogin, findUserByEmail } = require('./helpers')

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
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "testId": {
    id: "testId",
    email: "test@gmail.com",
    password: "test"
  }
};


app.get('/urls', (req, res) => {
  const userId = req.cookies.user_id
  // const user = users[user_id]
  const user = findUser(users, userId)
  let templateVars = {
    urls: urlDatabase,
    // user_id: req.cookies.username,
    user
  };
  res.render('urls_index', templateVars);
});


// Render urls_new template 
app.get('/urls/new', (req, res) => {
  // check if logged in: by looking at cookie
  const userId = req.cookies.user_id
  const user = findUser(users, userId)
  const templateVars = {
    user
  }

  if (user) {
    // do something
    res.render('urls_new', templateVars)
  } else {
    // redirect to login
    res.redirect("/login")
  }
});


app.post("/urls", (req, res) => {
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    user: req.cookies.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log("HELLO", req)
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

// handle routing for login
app.get('/login', (req, res) => {
  let templateVars = {
    user: findUser(users)
  };
  res.render('login', templateVars)
});



app.post('/login', (req, res) => {
  const {email, password} = req.body;

  const verified = verifyLogin(users, email, password);
  const user = findUserByEmail(users, email);

  if (verified) {
    // user is logged in successfully
    // go to entry page
    res.statusCode = 200;
    res.cookie("user_id", user.id);
    res.redirect('/urls');

  } else {
    // return a 403 status code
    res.statusCode = 403;
    res.send(res.statusCode);
  }
});

app.post('/logout', (req, res) => {
  const { email } = req.body;
  res.clearCookie("user_id", email);
  res.redirect('/urls');
});


// registration template
app.get('/register', (req, res) => {
  let templateVars = {
    user: req.cookies.user_id
  }
  res.render('registration', templateVars);
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


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});