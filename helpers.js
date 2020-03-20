
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


const validatePassword = (users, password) => {
  for (let user in users) {
    if (users[user].password === password) {
      return true;
    }
    return false;
  }
};

module.exports = { checkEmail, validatePassword };

