const postModel = require("../models/PostModel");
const menuModel = require("../models/MenuModel");
const tempModel = require("../models/TempModel");
function getPostType(slug_postType) {
    return menuModel.findOne({ slug: slug_postType }).lean();
}

function getPostType_2(parentID, slug_postType) {
    return menuModel
        .findOne({ slug: slug_postType, parentID: parentID })
        .lean();
}

function getPost(slug_post) {
    return postModel.findOne({ slug: slug_post }).lean();
}

function getPosts(postTypeID) {
    return postModel.find({ parentID: postTypeID }).lean();
}

function getPostPublic(req, res, next) {
    const menusPromise = menuModel.find({});
    const postsPromise = postModel.find({state:'public'});
    Promise.all([menusPromise, postsPromise])
        .then(([menusData, postsData]) => {
            const customPostsData = postsData.map((item, index) => {
                const postTypeName = menusData.filter(
                    (menu) => menu._id == item.parentID
                )[0].name;
                const finalData = {
                    ...item._doc,
                    postTypeName: postTypeName,
                    index: index + 1,
                };
                return finalData;
            });
            res.status(200).json(customPostsData);
        })
        .catch((error) => res.status(500).json(error));
}

function getPostTemp(req, res, next) {
    const state = req.params.type;
    const postsPromise = tempModel.find({ type: "post", state: state });
    const menusPromise = menuModel.find({});
    console.log("here 1");
    Promise.all([menusPromise, postsPromise])
        .then( ([menusData, postsData]) => {
            console.log("here 2");
            console.log("menuData: ", menusData.length);
            console.log("posts data", postsData.length);
            console.log('state: ', state)

            const customPostsData = postsData.map( (item, index) => {
                const postTypeName = menusData.filter(
                    (menu) => menu._id == item.data.parentID
                )[0].name;
                console.log('index: '+index +" : ",postTypeName)
                item._doc.data.postTypeName = postTypeName;
                const finalData = {
                    ...item._doc,
                    index: index + 1,
                };
                console.log('hoàn thành lượt: ', index)
                console.log('final data: ', finalData)
                return finalData;
            });
            console.log("here 3", customPostsData);

            res.status(200).json(customPostsData);
        })
        .catch((error) => res.status(500).json(error));
}

class PostsController {
    index(req, res, next) {
        postModel
            .find({})
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json("error: ", error));
    }

    // [GET] /posts/:parent/:slug
    postsForTypeFull(req, res, next) {
        const slug_parent = req.params.parent;
        const slug_postType = req.params.slug;

        getPostType(slug_parent)
            .then((data) => getPostType_2(data._id.toString(), slug_postType))
            .then((data) => getPosts(data._id.toString()))
            .then((data) => res.status(200).json(data));
    }

    // [GET] /posts/:parent/:type/:slug
    postDetailFull(req, res, next) {
        const slug_parent = req.params.parent;
        const slug_postType = req.params.type;
        const slug = req.params.slug;

        getPostType(slug_parent)
            .then((data) => getPostType_2(data._id.toString(), slug_postType))
            .then((data) => getPost(slug))
            .then((data) => res.status(200).json(data));
    }

    // [GET] /posts/:slug
    postsForType(req, res, next) {
        const slug_postType = req.params.slug;
        const postTypeID = getPostType(slug_postType);
        if (postTypeID) getPosts(postTypeID);
        else res.json({ error: "không tim thay" });
    }

    // [GET] /posts/:type/:slug
    postDetail(req, res, next) {
        const slug_postType = req.params.type;
        const slug_post = req.params.slug;
        const postTypeID = getPostType(slug_postType);
        if (postTypeID) getPost(slug_post);
        else res.status(500).json({ error: "không tìm thấy" });
    }

    // [POST] /posts/store
    storePost(req, res, next) {
        const postData = req.body;
        res.json(postData);
        return;
        const newPost = new postModel(postData);
        newPost
            .save()
            .then((result) => res.status(200).json(postData))
            .catch((error) => res.status(500).json({ "error: ": error }));
    }

    // [GET] /posts/edit/:slug
    editPost(req, res, next) {
        const postID = req.params.slug;
        postModel
            .findById(postID)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json("error: ", error));
    }

    // [PUT] /posts/:slug
    updatePost(req, res, edit) {
        const postId = req.params.slug;
        const postData = req.body;

        postModel
            .updateOne({ _id: postId }, postData)
            .then((result) => res.status(200).redirect("back"))
            .catch((error) => res.status(500).json("error: ", error));
    }

    // [DELETE] /posts/:slug
    deletePost(req, res, next) {
        const postID = req.params.slug;
        postModel
            .findByIdAndDelete(postID)
            .then((result) => res.status(200).json("success"))
            .catch((error) => res.status(500).json("error: ", error));
    }

    // ADMIN

    // [GET] /admin/posts/:type
    fullPosts(req, res, next) {
        let type = req.params.type;
        console.log(type);
        switch (type) {
            case "pending":
            case "accepting":
            case "executing":
                getPostTemp(req, res, next);
                break;
            case "public":
            default:
                getPostPublic(req, res, next);
                break;
        }
    }

    postByID(req, res, next) {
        const postID = req.query.q;
        tempModel.findById(postID).then(data => {
            if(data) {
               res.status(200).json({...data.data, _id:postID, postID: data.data._id}) 
               return;
            }
            postModel
                .findById(postID)
                .then((data) => { const postData = {...data._doc, postID: postID}; res.status(200).json(postData)})
                .catch((error) => res.status(500).json({ error: error }));
            
        }).catch(error => res.status(500).json(error))
       
    }

    admin_addPost(req, res, next) {
        const item = req.body;
        const newPost = new postModel(item);
        newPost.attachments[0].image = item.image;
        delete newPost.image;
        const newTemps = new tempModel({
            data: newPost,
            type: "post",
            method: "add",
            state: "pending",
        });
        newTemps.save().then((data) => res.status(200).redirect('http://localhost:3000/admin/posts/pending'));
    }

    admin_updatePost(req, res, next) {
        const postId = req.params.slug;
        const postData = req.body;
        
        console.log(postData)
        const image = postData.image;
        delete postData.image;

        tempModel
            .findByIdAndUpdate(postId, { data: {...postData, attachments: [{title: "", image: image}]} })
            .then((result) => {
                if (!result) {
                    const newPost = new postModel({...postData, attachments:[{title:"", image: image}]});

                    const newTemps = new tempModel({
                        data: newPost,
                        type: "post",
                        method: "update",
                        state: "pending",
                    });
                    newTemps.save().then((data) =>{ });
                    postModel.findByIdAndUpdate(postId, {state: 'pending'}).then(result => {res.json(result)})
                    return;
               
                }
                res.status(200).json('success')
            });
    }
    admin_deletePost(req, res, next) {
        console.log('delete post')
        const postId = req.params.slug;
        postModel.findById(postId).then(postData => {

            const customData = new postModel(postData)
            delete customData.state;
            const newTemps = new tempModel({
                data: customData,
                type: "post",
                method: "delete",
                state: "pending",
            });
            newTemps.save().then((data) =>{});
            postModel.findByIdAndUpdate(postId, {state: 'pending'}).then(result =>  res.status(200).json(result))
            return;
        })
        
    }

    async admin_agreeUpdate(req, res, next) {
        const state = req.params.state;
        const postID = req.params.id;
        console.log('state: ',state )
        console.log('postID', postID)
        switch(state) {
            case 'pending':
                tempModel.findByIdAndUpdate(postID, {state:'accepting'}).then(result => res.status(200).json(result));
                return;
            case 'accepting':
                tempModel
                    .findById(postID)
                    .then(async (tempData) => {
                        switch (tempData.method) {
                            case "add":
                                const newPost = new postModel(tempData.data);
                                newPost.save().then((result) => {} );
                                tempModel.findByIdAndDelete(postID).then((result) =>  res.status(200).json(result));
                                break;
                            case "update":
                                postModel.findByIdAndUpdate(tempData.data._id,{...tempData.data, state:'public'}).then(result => {});
                                tempModel.findByIdAndDelete(postID).then((result) => {res.status(200).json(result)});
                                break;
                            case 'delete':
                                postModel.findByIdAndDelete(tempData.data._id).then((result) => {});
                                tempModel.findByIdAndDelete(postID).then((result) => {res.status(200).json(result)});
                                break;
                        }
                    })
                    .catch((error) => res.status(500).json({ error: error }));
                break;
        }

    }
}

module.exports = new PostsController();
