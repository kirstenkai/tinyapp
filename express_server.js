// requiring node modules
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const PORT = 8080;

const app = express();

// Middlewear
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

// Module exports
const {
  checkEmail,
  validatePassword,
  findUser,
  verifyLogin,
  findUserByEmail
} = require('./helpers')

// Create a random 6 alphanumeric string for shortURL
function generateRandomString() {
  let random = crypto.randomBytes(3).toString('hex');
  return random
}

let shortURL = generateRandomString();


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "testId": {
    id: "testId",
    email: "test@gmail.com",
    password: bcrypt.hashSync("test", 10)
  }
};

// GET routes
app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

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

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    user: req.cookies.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] // should have longURL
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log("longURL", longURL)
  res.redirect(longURL);
});

// handle routing for login
app.get('/login', (req, res) => {
  let templateVars = {
    user: findUser(users)
  };
  res.render('login', templateVars)
});


// registration template
app.get('/register', (req, res) => {
  let templateVars = {
    user: req.cookies.user_id
  }
  res.render('registration', templateVars);
});

// ------------------------------------------

// POST routes
app.post("/urls", (req, res) => {
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body;

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



// endpoint that handles the registration form data
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  let existingUser = false;
  for (let user in users) {
    if (users[user].email === email) {
      existingUser = true
    }
  }

  if (email === "" && password === "") {
    res.send(400, "Email and Password cannot be empty");
  } else if (existingUser) {
    res.send(400, "username taken");
  } else {
    let pass = bcrypt.hashSync(password, 10);
    let id = shortURL;

    users[id] = {
      id: id,
      email: email,
      password: pass,
    }

    urlDatabase[id] = {};

    res.cookie("user_id", id);
    res.redirect('/urls');
  }

});



// *******  Edit button is deleting the link *******
app.post('/urls/:id', (req, res) => {
  const {
    id
  } = req.body;
  // const verifyID = urlsForUser(id)
  if (id === id) {
    urlDatabase[req.params.id] = req.body.update;
    res.redirect('/urls');
  } else {
    res.send("Please login to view your URLs")
  }
});


// listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});