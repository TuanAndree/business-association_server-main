const menuModel = require("../models/MenuModel");

const PostModel = require("../models/PostModel");

class MenuController {
    // [GET] /menus/
    index(req, res, next) {
        menuModel
            .find({})
            .lean()
            .then((data) =>{res.status(200).json(data)})
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [GET] /menus/:slug
    menuDetail(req, res, next) {
        const slug = req.params.slug;
        menuModel
            .findOne({slug:slug})
            .lean()
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [GET] /menus/:type/:slug
    menuChildDetail(req, res, next)  {
        // const type = req.params.type;
        // const slug = req.params.slug;
       
        
    //     menuModel
    //         .findOne({slug: type})
    //         .lean()
    //         .then(data => PostModel.findOne({slug:slug}))
    //         .then(data => res.status(200).json(data))
    //         .catch((error) => res.status(500).json({ error: error }));
    }

    // [POST] /menus
    storeMenu(req, res, next) {
        const menuData = req.body;
        const newMenu = new menuModel(menuData);
        newMenu
            .save()
            .then((result) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [PUT] /menus/:slug
    updateMenu(req, res, next) {
        const menuID = req.params.slug;
        const menuData = req.body;
        menuModel
            .findByIdAndUpdate(menuID, menuData)
            .then((result) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [DELETE] /menus/:slug
    deleteMenu(req, res, next) {
        const menuID = req.params.slug;
        menuModel
            .findByIdAndDelete(menuID)
            .then((result) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }
}

module.exports = new MenuController();
