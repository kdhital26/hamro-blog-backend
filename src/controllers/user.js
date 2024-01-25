const userSchema = require("../models/user.schema");

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
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let randomNumber  = Math.floor((Math.random() + date.getMonth() + minutes) * (seconds + date.getDay()))?.toString();
    let randomUserNumber = (date.getDay()?.toString() + (date.getMonth() + 1)?.toString() + randomNumber);
    let users = new userSchema(body);
    users.userName = body?.firstName.toLowerCase() + (randomUserNumber);
    await users.save(body).then(result => {
        res.status(200).send({user: result});
    }).catch(error => {
        res.status(400).send({message: error});
    })
}