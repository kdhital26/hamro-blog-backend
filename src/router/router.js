const express = require('express');
const routes = express.Router();
// const blogController = require('../controllers/blog');
const blogController = require('../controllers/blog')
const files = require('../middleware/file-middleware');



routes.get('/getallblogs', blogController.getAllBlog);
routes.post('/createblog', files.array('image'), blogController.createBlog);
routes.post('/updateblog', files.array('image'), blogController.updateBlog);
routes.post('/deleteblog', files.single('image'), blogController.deleteBlog); //soft delete only
routes.post('/setRating', blogController.setRating);
//for testing purpose only, if it goes to production please comment this piece of code;
routes.delete('/deleteall', blogController.deleteAll);



module.exports = routes;