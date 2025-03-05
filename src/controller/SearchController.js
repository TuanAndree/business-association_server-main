const postsModel = require('../models/PostModel')

class SearchController {
    index(req, res, next) {
        const queryStr = req.query.q.toLowerCase();
        postsModel.find({}).lean().then(data => {
            if(!(data.length >0)) {
                res.json([]);
            }
            let dataPost = data.filter(item => { return (item.title.toLowerCase().indexOf(queryStr) != -1 || item.content.toLowerCase().indexOf(queryStr) != -1) ? true : false})
            res.json(dataPost)

        }).catch(error => res.json({error: error}))
    }
}

module.exports = new SearchController;
