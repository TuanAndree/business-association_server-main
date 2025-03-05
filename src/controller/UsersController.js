const userModel = require("../models/UserModel");
const adminPath = "http://localhost:3000/admin/users";

class UsersController {
    // [GET] /users/
    index(req, res, next) {
        userModel
            .find({})
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json(error));
    }

    // [GET] /users/:slug
    getUser(req, res, next) {
        const userID = req.params.slug;
        userModel
            .findById(userID)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json(error));
    }

    // [POST] /users/add
    store(req, res, next) {
        const userData = req.body;
        const newUser = new userModel(userData);
        newUser
            .save()
            .then((data) => res.status(200).redirect(adminPath))
            .catch((error) => res.status(500).json(error));
    }

    // [PUT] /users/:slug
    update(req, res, next) {
        const userID = req.params.slug;
        const userData = req.body;

        userModel
            .findByIdAndUpdate(userID, { ...userData })
            .then((data) => res.status(200).redirect(adminPath))
            .catch((error) => res.status(500).json(error));
    }

    // [DELETE] /users/:slug
    delete(req, res, next) {
        {
            const userId = req.params.slug;
            userModel
                .findByIdAndDelete(userId)
                .then((data) => res.status(200).json("success"))
                .catch((error) => res.status(500).json(error));
        }
    }

    // [GET] /users/authen?email&password
    authen(req, res, next) {
        console.log("start");
        const email = req.query.email;
        const password = req.query.password;
        console.log("email: ", email);
        console.log("password:", password);
        userModel
            .findOne({ email: email, password: password })
            .then((data) => {
                if (data) res.status(200).json(data);
                else res.status(200).json(error);
            })
            .catch((error) => res.status(500).json(error));
    }
}

module.exports = new UsersController();
