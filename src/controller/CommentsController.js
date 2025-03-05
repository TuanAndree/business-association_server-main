const comments = require("../models/CommentModel");
const posts = require("../models/PostModel");
class CommentsController {

    // [GET] /comments/:slug (post)
    commentsForPost(req, res, next) {
        const postID = req.params.slug;
        comments
            .find({ postID: postID })
            .lean()
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [DELETE] /comments/:id
    deleteComment(req, res, next) {
        const commentID = req.params.id;
        comments
            .findByIdAndDelete(commentID)
            .then((result) => res.status(500).json("success"))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [POST] /comments/:slug
    storeComment(req, res, next) {
        const postID = req.params.slug;
        const commentData = {...req.body, postID: postID}
        const newComment = new comments(commentData);
        newComment
            .save()
            .then((result) => {res.status(200).json('success')})
            .catch((error) => res.status(500).json({ error: error }));
    }
}

module.exports = new CommentsController;
