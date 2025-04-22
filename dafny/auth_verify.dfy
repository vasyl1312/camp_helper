datatype LoginResult = Success | Failure

class AuthSystem {
  var adminUsername: string
  var adminPassword: string

  constructor (username: string, password: string)
    requires username != "" && password != ""
    ensures adminUsername == username
    ensures adminPassword == password
  {
    adminUsername := username;
    adminPassword := password;
  }

  function LoginPure(inputUsername: string, inputPassword: string): LoginResult
    requires inputUsername != "" && inputPassword != ""
    reads this
  {
    if inputUsername == adminUsername && inputPassword == adminPassword then Success else Failure
  }

  method Login(inputUsername: string, inputPassword: string) returns (result: LoginResult)
    requires inputUsername != "" && inputPassword != ""
    ensures result == LoginPure(inputUsername, inputPassword)
  {
    result := LoginPure(inputUsername, inputPassword);
  }
}

// Тест успішного входу
method TestLoginSuccess()
{
  var sys := new AuthSystem("admin", "1234");
  var r := sys.Login("admin", "1234");
  assert r == Success;
}

// Тест невдалого входу
method TestLoginFailure()
{
  var sys := new AuthSystem("admin", "1234");
  var r := sys.Login("user", "wrong");
  assert r == Failure;
}

lemma LoginSpec(sys: AuthSystem, u: string, p: string)
  requires u != "" && p != ""
  ensures sys.LoginPure(u, p) == (if u == sys.adminUsername && p == sys.adminPassword then Success else Failure)
{}
