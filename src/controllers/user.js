const userSchema = require("../models/user.schema");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');


exports.getAllUsers = async (req, res) => {
    const {body: {loggedInUser, page, limit}} = req;
    if(loggedInUser) {
        await getUserById(loggedInUser, res);
    } else {
        await getAllUsers(res);
    }
}

exports.createUsers = async (req, res) => {
   await createUser(req, res);
}


exports.signIn = async (req, res) => {
    try {
    console.log(req.body, 'req here')

      await userSchema
        .findOne({
          email: req.body.email,
        })
        .then((user) => {
          if (!user) {
            res.status(500).send({ message: "Invalid username or password!" });
          } else {
            // if the user is inactive or deleted
            if (!user.active) {
              res
                .status(404)
                .send({ message: "You are not authorized to login" });
              return;
            }
            //comparing passwords
            let passwordIsValid = bcrypt.compareSync(
              req.body.password,
              user.hPassword
            );
            if (!passwordIsValid) {
              return res.status(401).send({
                accessToken: null,
                message: "Invalid username or password!",
              });
            }
            //responding to client request with user profile success message and  access token .
            res.status(200).send({
              user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName(),
              },
              message: `Welcome, ${user.fullName()}`,
            });
          }
        })
        .catch((error) => {
          res.status(404).send({ message: "Please Insert data " + error });
        });
    } catch (error) {
      res.send({ message: error.message });
    }
  };


 async function getUserById(userName, res) {
     userSchema.findOne({userName: userName})
    .then(result => {
        res.status(200).send({users: result});
    }).catch(error => {
        res.status(400).send({message: error});
    });
}

async function getAllUsers(res) {
    let filter = {active: true}
    await userSchema.find(filter).then(result => {
        res.status(200).send({users: result});
    }).catch(error => {
        res.status(400).send({message: error});
    })
}

async function createUser(req, res) {
    let { body } = req;
    let date = new Date();
    const salt = await bcrypt.genSalt(10);
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let randomNumber  = Math.floor((Math.random() + date.getMonth() + minutes) * (seconds + date.getDay()))?.toString();
    let randomUserNumber = (date.getDay()?.toString() + (date.getMonth() + 1)?.toString() + randomNumber);
    let users = new userSchema(body);
    users.hPassword = await bcrypt.hash(users.password, salt);
    users.userName = body?.firstName.toLowerCase() + (randomUserNumber);
    await users.save(body).then(result => {
        res.status(200).send({user: result});
    }).catch(error => {
        res.status(400).send({message: error});
    })
}