const blogSchema = require('../models/blog.schema');
const ratingSchema = require('../models/blogRating.schema')
const commentSchema = require('../models/blogComments.schema')
// const headerSchema = require('../models/header.schema')

exports.getAllBlog = async (req, res) => {
    try {
        const { query : {_id, page, limit}} = req;
        if(_id){
            await blogSchema.findById(_id)
            .populate('ratingId')
            .populate('commentId')
            .then(result => {
                if(result) {
                    let totalConent = {
                        title: '', _id: '', value: [], category: ''
                    }
                    let desResponse = result.description.split('--SPLIT_HERE--');
                    let imageResponse = result.file.split(',');
                    let cloudinaryImage = result.cloudinaryPath.split(',');
                    
                    trendingTopic(result);
                    for(let i = 0; i < imageResponse.length; i++) {
                        let blogData = {description: '', file: '', cloudImage:'', category: ''}
                         blogData.description = desResponse[i];
                         blogData.file = imageResponse[i];
                         blogData.cloudImage = cloudinaryImage[i];
                         totalConent.value.push(blogData);
                    } 
                    totalConent.title = result.title;
                    totalConent._id = result._id;
                    totalConent.category = result.category;
                    res.status(200).send({data: totalConent, comments: result.commentId, rating: result.ratingId});
                } else {
                    res.status(500).send({message: 'Could not find it'});
                }
            })
        } else {
            const filter = {active: true}
            await blogSchema.find(filter)
            .populate('ratingId')
            .populate('commentId')
            .then(result => {
                if(result) {
                    res.status(200).send({data: result});
                } else {
                    res.status(500).send({message: 'Could not find it'});
                }
            })
        }
        
    } catch (error) {
        res.status(400).send({message: error})
    }
}

exports.createBlog = async (req, res) => {
    try {
        const { body, files } = req;
        console.log(body, 'body here')
        let blog = setBlogValues(body, files, req.cloudinaryPath);
        await blog.save(blog).then(result => {
            if(result) {
               res.status(200).send({message: 'Saved Successfully', data: result})
            } else {
                res.status(500).send({message: 'Please Try Again!'});
            }
        }).catch(error => {
            res.status(400).send({message: 'Something went wrong'});
        })

    } catch (error) {
        res.status(400).send({message: error});
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const { _id } = req.body;
        const { files } = req;
        const updateType = {new: true, upsert: true};
        const blogUpdate = setBlogValues(req.body, files, req.cloudinaryPath);
         blogSchema.findByIdAndUpdate(_id, blogUpdate, updateType)
         .then(result => {
            if(result) {
                res.status(200).send({message: 'Updated Successfully', data: result});
            } else {
                res.status(500).send({message: 'Please Review Your Data!'})
            }
         })
         .catch((error) =>{
            res.status(500).send({message:error, data: 'error'});
         }) 
    } catch (error) {
        res.status(400).send({message: error})
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const { _id } = req.body;
        const { file } = req;
        const updateType = {new: true, upsert: true};
        // const deleteBlogById = setBlogValues(req.body, file);
        const deleteBlogById = new blogSchema({
            _id: _id,
            active: false
        })
         blogSchema.findByIdAndUpdate(_id, deleteBlogById, updateType)
         .then(result => {
            if(result) {
                res.status(200).send({message: 'Deleted Successfully', data: result});
            } else {
                res.status(500).send({message: 'Please Review Your Data!'})
            }
         })
         .catch((error) =>{
            res.status(500).send({message:error, data: 'error'});
         })

    } catch (error) {
        
    }
}

exports.setRating = async (req, res) => {
    const { body: {id, rating} } = req;
    try {
        const updateType = {new: true};
        const ratingModel = new ratingSchema({
            blogId: id,
            rating: rating
        });
        await ratingModel.save(ratingModel).then(result => {
            if(result) {
                const filterValue = {_id: id};
                const updatedValue = {ratingId: result.id};
                blogSchema.findOneAndUpdate(filterValue, updatedValue, updateType)
                .then(data => {
                    if(data) {
                        res.status(200).send({message: 'Thank you for your rating', data: result});
                    }
                })
            } else {
                res.status(400).send({message: 'Please try again'});
            }
        }).catch(error => {
            res.status(400).send({message: 'Please try again!' + error});
        })
    } catch (error) {
        res.status(500).status({message: error})
    }
}

exports.createComments = async(req, res) => {
    const { body: {id, comment} } = req;
    const updateType = {new: true, findAndModify: true};
    try {
        const comments = new commentSchema({
            comments: comment
        });
        await comments.save(comments).then(result => {
            if(result) {
                const filterValue = {_id: id};
                blogSchema.findOneAndUpdate(filterValue, { $push: { commentId: result._id } }, updateType)
                .then(data => {
                    if(data) {
                        res.status(200).send({message: 'Successfully Created Comments', data: result});
                    }
                })
            } else {
                res.status(500).send({message: 'Please Try Again'});
            }
        }).catch(error => {
            res.status(501).send({message: 'Please Try Again!', error: error});

        })
    } catch(error) {
        res.status(500).send({message: error})
    }

}

exports.getAllTrendingTopic = async (req, res) => {
    try {
        let filter = {active: true};
        await blogSchema.find(filter)
        .sort({count: -1})
        .limit(5)
        .skip(0)
        .then(result => {
            res.status(200).send({message: '', data: result});
        })
    } catch (error) {
        res.status(500).send({message: error});
        
    }
}

exports.getLatest = async (req, res) => {
    try {
        const { body: {page, limit} } = req;
        filter = {active: true}
        sortingValue = {createdAt: -1}
        blogSchema.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortingValue)
        .then(result => {
            if(result) {
                res.status(200).send({data: result});
            }
        })
        .catch(error => {
            res.status(501).send({message: error});
        })

    } catch (error) {
        res.status(500).send({message: error})
    }
}

exports.getBlogByContent = async (req, res) => {
    try {
        const { body } = req;
        let {category, page, limit} = body
        page = page || 1;
        limit = limit || 30;
        let filter1 = {active: true, category: category?.toLowerCase()};
        const regex = new RegExp(category, 'i');
        let filter3 = {description: {$regex : regex}}
        let filter = {$or:[filter1, filter3]}
        sortingValue = {createdAt: -1}
        blogSchema.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortingValue)
        .then(result => {
            if(result) {
                res.status(200).send({data: result});
            }
        })
        .catch(error => {
            res.status(501).send({message: error});
        })

    } catch (error) {
        console.log(error,'error here')
       res.status(400).send({message: error})
    }

}


function setBlogValues(body, files, cloudinaryURL) {
    const  {_id, file, description, title, cloudImagPath, category } = body;
    let path = '';
    let blog = new blogSchema();
    blog._id = _id;
    blog.description = description;
    blog.title = title;
    blog.category = category?.toLowerCase();
    console.log(body, category, 'here')
    if(file) {
        path = file;
        blog.cloudinaryPath = cloudImagPath;
    }
    if(file && files.length > 0) {
        path += ',' + files.map(res => res.path)?.toString();
        let cloudPath = cloudinaryURL.toString();
        blog.cloudinaryPath += cloudPath;
    } else if (files.length > 0) {
        path = files.map(res => res.path)?.toString();
        blog.cloudinaryPath = cloudinaryURL.toString();
    }
    // return;
    blog.file = path;
    blog.active = true;
    // return;
    return blog;

}



function  trendingTopic(value) {
    const filterValue = {_id: value._id}
    const totalCount = value.count += 1;
    const updateType = {new: true, findAndModify: true};
    blogSchema.findOneAndUpdate(filterValue, {count: totalCount}, updateType)
        .then(data => {
        return data;
    })
}

//testing //testing toohere
exports.deleteAll = async (req, res) => {
    try {
      await blogSchema.deleteMany({});
      await ratingSchema.deleteMany({});
      await commentSchema.deleteMany({});
      //   await headerSchema.deleteMany({});
      res.send({message: 'success'})
    } catch (error) {
      res.status(400).send({error: error})
    }
  }