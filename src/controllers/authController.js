// src/controllers/authController.js
function login(req, res) {
    const { name, phone } = req.body;
  
    if (!name || !phone) {
      // meget simpel validering
      return res.status(400).send("Navn og telefon er påkrævet");
    }
  
    // gem "bruger" i session
    req.session.user = { name, phone };
  
    // send brugeren videre til hjulet
    return res.redirect("/wheel");
  }
  
  function logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/"); // tilbage til login
    });
  }
  
  module.exports = { login, logout };
  