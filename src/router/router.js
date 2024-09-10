const express = require('express');
const routes = express.Router();
// const blogController = require('../controllers/blog');
const blogController = require('../controllers/blog');
const ratingController = require('../controllers/rating')
const files = require('../middleware/file-middleware');
const cloudinaryHelper = require('../middleware/cloudinary').helper;
const userController = require('../controllers/user');



routes.get('/getallblogs', blogController.getAllBlog);
routes.get('/getAllTrendingTopic', blogController.getAllTrendingTopic);
routes.post('/getLatest', blogController.getLatest);
routes.post('/getBlogByContent', blogController.getBlogByContent)
routes.post('/createblog', files.array('image'), ((req, res, next) => {
    cloudinaryHelper(req.files, req, next);
}), blogController.createBlog);

routes.post('/updateblog', files.array('image'), ((req, res, next) => {
    cloudinaryHelper(req.files, req, next);
}), blogController.updateBlog);
routes.get('/getBlogsByUser', blogController.getBlogsByUser);

routes.post('/deleteblog', files.single('image'), blogController.deleteBlog); //soft delete only
routes.post('/setRating', blogController.setRating);
routes.post('/createComment', blogController.createComments);

//rating controller
routes.get('/getAllRating', ratingController.getAllRating);


//for testing purpose only, if it goes to production please comment this piece of code;
routes.delete('/deleteall', blogController.deleteAll);

//users API here
routes.post('/getUsers', userController.getAllUsers);
routes.post('/createUser', userController.createUsers);
routes.post('/login', userController.signIn);

module.exports = routes;