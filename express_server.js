// requiring node modules
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')

const PORT = 3000;

const app = express();

// MIDDLEWARE
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set(cookieSession({
  name: 'session',
  secret: 'helloWorld',
}))


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

// Users Database
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234",
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
  // console.log(r)
  res.redirect('/login');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const userId = req.cookies.user_id
  console.log(userId)

  const user = findUser(users, userId)
  let templateVars = {
    urls: urlDatabase,
    user
  };
  res.render('urls_index', templateVars);
});

// Render urls_new template 
app.get('/urls/new', (req, res) => {
  // check if logged in: by looking at cookie
  const userId = req.cookies.user_id
  console.log(userId)
  const user = findUser(users, userId)
  const templateVars = {
    user
  }

  if (user) {
    res.render('urls_new', templateVars)
  } else {
    res.redirect("/login")
  }
});


app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    user: req.cookies.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  }
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
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };

  // should this redirect to the shortURL page or the home page
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const id = urlDatabase[req.params.shortURL]['userID']
  if (id !== urlDatabase[req.params.shortURL].userID) {
    res.send(401);
  } else {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body;

  const verified = verifyLogin(users, email, password);
  const user = findUserByEmail(users, email);
  const hash = bcrypt.hashSync(password,10);

  const hashPassword = bcrypt.compareSync(password, hash);
  console.log(hashPassword)

  if (verified) {
    // user is logged in successfully
    // go to entry page
    if (hashPassword) {      
      res.statusCode = 200;
      res.cookie("user_id", user.id);
      res.redirect('/urls');
    }
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

  if (email === "" || password === "") {
    res.send(400, "Email and Password cannot be empty");
  } else if (existingUser) {
    res.send(400, "username taken");
  } else {
    let pass = bcrypt.hashSync(password, 10);
    let id = generateRandomString();
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

app.post('/urls/:id', (req, res) => {
  const userID = req.cookies.user_id
  const { id } = req.params

  if(userID) {
    urlDatabase[id] = {
      userID: userID,
      longURL: req.body.update
    }
    res.redirect('/urls');

  } else {
    res.send("Please login to view your URLs")
  }
});


// listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});