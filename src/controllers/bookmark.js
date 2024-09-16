const bookmarkedSchema = require('../models/bookmark.schema');

exports.createBookmark = async (req, res) => {
    const { body: {_id, blogId, bookmarked, userId} } = req;
    try {
        const updateType = {new: true, upsert: true};
		let  update = {bookmarked: bookmarked}
		let filter = {blogId: blogId, userId: userId}
        await bookmarkedSchema.findOneAndUpdate(filter, update, updateType).then(result => {
            if(result) {
				res.status(200).send({message: 'Bookmarked', data: result});
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

exports.getAllBookmarked = async (request, res) => {
    const {body: { userId }} = request;
    let filter = {userId: userId, bookmarked : true};
    try {
        await bookmarkedSchema.find(filter)
        .populate("blogId")
        .then(result => {
            res.status(200).send({message: '', data: result});
        })
    } catch (error) {
        res.status(500).status({message: error})
    }
}