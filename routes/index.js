var express = require("express");
const Joi = require("joi");
const Movie = require("../models/movie");
var router = express.Router();
var HandlerGenerator = require("../handlegenerator.js");
HandlerGenerator = new HandlerGenerator();
var middleware = require("../middleware.js");

const schema = Joi.object({
  name: Joi.string().min(3).required()
});

router.get('/', middleware.checkToken, HandlerGenerator.index);

router.post('/login', HandlerGenerator.login);

/* GET users listing. */
router.get('/', middleware.checkToken ,function(req, res, next) {
  Movie.findAll().then(result => {
    console.log("Result", result);
    res.send(result);
  });
});

router.get('/:id', middleware.checkToken ,function(req, res, next) {
    Movie.findByPk(req.params.id).then(result => {
      console.log("Result: ", result);
      if(!result) {
        return res.status(404).send("Not found");
      }
      res.send(result);
    })
  });

router.post('/', middleware.checkToken ,function(req, res, next) {
    console.log(req.body);  
    
    if(req.role !== "w") {
      return req.status(400).send("Usurio sin permisos.");
    }

    const { error } = schema.validate(req.body);

    if(error) {
        return req.status(400).send(error.details[0].message);
    }

    Movie.create({name: body.name, description: req.body.description}).then(movie => {
      res.send(movie);  
    });  
  });

  router.put('/:id', middleware.checkToken ,function(req, res, next) {

    if(req.role !== "w") {
      return req.status(400).send("Usurio sin permisos.");
    }

    //Validar que existe
    const {error} = validate(req.body);

    if(error) {
      return res.status(400).send(error.details[0].message);
    }

    Movie.update(req.body, {where: {id: req.params.id}}).then(response => {
      console.log(response);
      if(response[0] !== 0) {
        res.send("Movie updated");
      } else {
        return res.status(404).send("Id not found");
      }
    });
  });

  router.delete('/:id', middleware.checkToken ,function(req, res, next) {

    if(req.role !== "w") {
      return req.status(400).send("Usurio sin permisos.");
    }

    Movie.destroy({where:{id: req.params.id}}).then((result) => {
      if (result === 0) {
        res.status(404).send("No hay una peli con ese id");
      }
      else
      {
        res.status(204).send();
      }
    })

  });

module.exports = router;

