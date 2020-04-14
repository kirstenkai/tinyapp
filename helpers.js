
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


const urlsForUser = (user, urls) => {
  if (!user) {
    return {}
  }
  const userID = user.id
  const filterURLs = {}

  for (let shortURL in urls) {
    const url = urls[shortURL]
    if (userID === url.userID) {
      filterURLs[shortURL] = url;
    }
  }
  return filterURLs

}

const validatePassword = (users, password) => {
  for (let user in users) {
    if ((users[user].password) === password) {
      return true;
    }
    return false;
  }
};


const verifyLogin = (users, email, password) => {
  return checkEmail(users, email) && validatePassword(users, password)
}

module.exports = {
  checkEmail,
  validatePassword,
  findUser,
  verifyLogin,
  findUserByEmail,
  urlsForUser
};
