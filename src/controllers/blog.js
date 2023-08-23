const blogSchema = require('../models/blog.schema');
const ratingSchema = require('../models/blogRating.schema')
// const headerSchema = require('../models/header.schema')

exports.getAllBlog = async (req, res) => {
    try {
        const { query : {_id, page, limit}} = req;
        if(_id){
            await blogSchema.findById(_id)
            .then(result => {
                if(result) {
                    let totalConent = {
                        title: '', _id: '', value: []
                    }
                    let desResponse = result.description.split('--SPLIT_HERE--');
                    let imageResponse = result.file.split(',');
                    for(let i = 0; i < imageResponse.length; i++) {
                        let blogData = {description: '', file: ''}
                         blogData.description = desResponse[i];
                         blogData.file = imageResponse[i];
                         totalConent.value.push(blogData);
                    } 
                    totalConent.title = result.title;
                    totalConent._id = result._id;
                    res.status(200).send({data: totalConent});
                } else {
                    res.status(500).send({message: 'Could not find it'});
                }
            })
        } else {
            const filter = {active: true}
            await blogSchema.find(filter)
            .populate('ratingId')
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

        let blog = setBlogValues(body, files);
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

        const blogUpdate = setBlogValues(req.body, files);
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
    const { body: {id, rating, files} } = req;
    try {
        const updateType = {new: true};
        const ratingModel = new ratingSchema({
            blogId: id,
            rating: rating
        });
        await ratingModel.save(ratingModel).then(result => {
            if(result) {
                const filterValue = {_id: id};
                const updatedValue = {ratingId: id};
                blogSchema.findOneAndUpdate(filterValue, updatedValue, updateType);
                res.status(200).send({message: 'Thank you for your rating', data: result});
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


function setBlogValues(body, files) {
    const  {_id, file, description, title } = body;
    let path = '';
    let blog = new blogSchema();
    blog._id = _id;
    blog.description = description;
    blog.title = title;
    if(file) {
        path = file
    }
    if(files.length > 1) {
        path += ',' + files.map(res => res.path)?.toString();
    } else if(files.length === 1) {
        path +=  files.map(res => res.path)?.toString();
    }
    blog.file = path;
    blog.active = true;
    return blog;

}

//testing 
exports.deleteAll = async (req, res) => {
    try {
      await blogSchema.deleteMany({});
    //   await headerSchema.deleteMany({});
      res.send({message: 'success'})
    } catch (error) {
      res.status(400).send({error: error})
    }
  }