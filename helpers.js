
// let users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur",
//   },
//   "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };

const checkEmail = (users, email) => {
  for (let username in users) {
    if (users[username].email === email) {
      return true;
    }
    return false;
  }
};

const findUser = (users, id) => {
  return id ? users[id] : undefined
}

const findUserByEmail = (users, email) => { 
    for (let id in users) {
      const user = users[id];
      if (user.email === email) {
        return user;
      }
    }
  }
  



const validatePassword = (users, password) => {
  for (let user in users) {
    if (users[user].password === password) {
      return true;
    }
    return false;
  }
};

const verifyLogin = (users, email, password) => {
  return checkEmail(users, email) && validatePassword(users, password)
}

module.exports = { checkEmail, validatePassword, findUser, verifyLogin, findUserByEmail };

