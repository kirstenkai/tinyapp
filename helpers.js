
const checkEmail = (users, email) => {
  for (let username in users) {
    if (users[username].email === email) {
      return true;
    } 
    return false;
  }
};

module.exports = { checkEmail }



