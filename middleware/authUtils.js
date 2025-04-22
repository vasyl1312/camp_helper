function isAuthorized(username, password, adminUsername, adminPassword) {
  return username === adminUsername && password === adminPassword;
}

module.exports = { isAuthorized };
