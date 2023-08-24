const ratingSchema = require('../models/blogRating.schema')

exports.getAllRating = async (req, res) => {
    try {
        const {query: {blogId}} = req;
        const filter = {blogId: blogId}
        await ratingSchema.find(filter).then(result => {
            let totalCount = result.length;
            let totalRating = result.reduce((acc, curr) => {
                return acc += curr.rating
            }, 0);
            const avarageRating = totalRating / totalCount
            res.status(200).send({rating: +avarageRating.toFixed()});
        }).catch(error => {
            res.status(501).send({message: error})
        })
    } catch (error) {
        res.status(500).send({message: error})
    }
}