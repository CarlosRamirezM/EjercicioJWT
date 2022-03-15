let jwt = require("jsonwebtoken");
let sha256 = require("js-sha256");
let config = require("./config");

const User = require("./models/user");

// Clase encargada de la creación del token
class HandlerGenerator {
  getHash(str, algo = "SHA-256") {}

  login(req, res) {
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = sha256(req.body.password);

    let mockedUsername;
    let mockedPassword;
    let userRole;

    User.findByPk(username).then((user) => {
      if (!user) {
        res.send(403).json({
          success: false,
          message: "Incorrect username or password",
        });
      } else {
        mockedUsername = user.username;
        mockedPassword = user.password;
        userRole = user.role;

        // Si se especifico un usuario y contraseña, proceda con la validación
        // de lo contrario, un mensaje de error es retornado
        if (username && password) {
          // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
          // de lo contrario, un mensaje de error es retornado
          if (username === mockedUsername && password === mockedPassword) {
            // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
            let token = jwt.sign(
              { username: username, role: userRole },
              config.secret,
              {
                expiresIn: "24h",
              }
            );

            // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
            res.json({
              success: true,
              message: "Authentication successful!",
              token: token,
            });
          } else {
            // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
            res.send(403);
          }
        } else {
          // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
          res.send(400);
        }
      }
    });
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    res.json({
      success: true,
      message: "Index page",
    });
  }
}

module.exports = HandlerGenerator;
