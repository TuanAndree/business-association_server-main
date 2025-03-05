const partners = require("../models/PartnerModel");

const tempModel = require('../models/TempModel')
const partnerModel = require('../models/PartnerModel')
const adminPath = "http://localhost:3000/admin/partners";

function getPartnerPublic(req, res, next) {
    partnerModel.find({state:'public'})
        .then(partnerData => {
            res.status(200).json(partnerData);
        })
        .catch((error) => res.status(500).json(error));
}

function getPartnerTemp(req, res, next) {
    const state = req.params.type;
   tempModel.find({ type: "partner", state: state })
        .then(partnerData => {
            const customData = partnerData.map((item, index) => {
                const finalData = {
                    ...item._doc,
                    index: index + 1,
                    
                };
                return finalData;
            });
            console.log("here 3", customData);
            res.status(200).json(customData);
        })
        .catch((error) => res.status(500).json(error));
}

class PartnersController {
    index(req, res, next) {
        partners
            .find({})
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json({"error: ": error}));
    }

    // [GET] /partners/:slug
    partnerDetail(req, res, next) {
        const slug_web = req.params.slug;
        partners
            .findOne({ slug: slug_web })
            .lean()
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(500).json({ error: error }));
    }

    // [POST] /partners/store
    storePartner(req, res, next) {
        const partnerData = req.body;
        const newPartner = new partners(partnerData);
        newPartner
            .save()
            .then((result) => res.status(200).json("success"))
            .catch((error) => res.status(500).json({ error }));
    }

    // [PUT] /partners/:slug
    updatePartner(req, res, next) {
        const partnerID = req.params.slug;
        const partnerData = req.body;
        partners
            .findByIdAndUpdate(partnerID, partnerData)
            .then((result) => res.status(200).json("success"))
            .catch((error) => res.status(500).json({ error }));
    }

    // [DELETE] /partners/:slug
    deletePartner(req, res, next) {
        const partnerID = req.params.slug;
        partners
            .findByIdAndDelete(partnerID)
            .then((result) => res.status(200).json("success"))
            .catch((error) => res.status(500).json({ error }));
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
                getPartnerTemp(req, res, next);
                break;
            case "public":
            default:
                getPartnerPublic(req, res, next);
                break;
        }
    }

    partnerByID(req, res, next) {
        const partnerID = req.query.q;
        tempModel.findById(partnerID).then(data => {
            if(data) {
               res.status(200).json({...data.data, _id:partnerID, partnerID: data.data._id}) 
               return;
            }
            partnerModel
                .findById(partnerID)
                .then((data) => { const partnerData = {...data._doc, partnerID: partnerID}; res.status(200).json(partnerData)})
                .catch((error) => res.status(500).json({ error: error }));
            
        }).catch(error => res.status(500).json(error))
       
    }

    admin_addPartner(req, res, next) {
        const item = req.body;
        const newPartner = new partnerModel(item);
        const name = item.userName;
        const email = item.userEmail;
        const role = item.role;
        const baRole = item.baRole;
        const human = {name, email, role, baRole};

        delete newPartner.userName;
        delete newPartner.userEmail;
        delete newPartner.role;
        delete newPartner.baRole;

        const tempData = {...newPartner, human}        


        const newTemps = new tempModel({
            data: tempData,
            type: "partner",
            method: "add",
            state: "pending",
        });
        newTemps.save().then((data) => res.status(200).redirect('http://localhost:3000/admin/partners/pending'));
    }

    admin_updatePartner(req, res, next) {
        const partnerID = req.params.slug;
        const partnerData = req.body;
        
        console.log(partnerData)
        const name = partnerData.userName;
        const email = partnerData.userEmail;
        const role = partnerData.role;
        const baRole = partnerData.baRole;
        const human = {name, email, role, baRole};
        delete partnerData.userName;
        delete partnerData.userEmail;
        delete partnerData.role;
        delete partnerData.baRole;
        

        tempModel
            .findByIdAndUpdate(partnerID, { data: {...partnerData,human} })
            .then((result) => {
                if (!result) {
                    const newPartner = new partnerModel({...partnerData, human});

                    const newTemps = new tempModel({
                        data: newPartner,
                        type: "partner",
                        method: "update",
                        state: "pending",
                    });
                    newTemps.save().then((data) =>{ res.json(req.body)});
                    partnerModel.findByIdAndUpdate(partnerID, {state: 'pending'}).then(result => res.status(200).json('success'))
                    return;
               
                }
                res.status(200).json('success')
            });
    }
    
    admin_deletePartner(req, res, next) {
        console.log('delete partner')
        const partnerID = req.params.slug;
        partnerModel.findById(partnerID).then(partnerData => {

            const customData = new partnerModel(partnerData)
            delete customData.state;
            const newTemps = new tempModel({
                data: customData,
                type: "partner",
                method: "delete",
                state: "pending",
            });
            newTemps.save().then((data) =>{});
            partnerModel.findByIdAndUpdate(partnerID, {state: 'pending'}).then(result => res.status(200).json('success'))
            return;
        })
        
    }

    async admin_agreeUpdate(req, res, next) {
        const state = req.params.state;
        const partnerID = req.params.id;
       
        switch(state) {
            case 'pending':
                tempModel.findByIdAndUpdate(partnerID, {state:'accepting'}).then(result => res.status(200).json('success'));
                break;
            case 'accepting':
                tempModel
                    .findById(partnerID)
                    .then(async (tempData) => {
                        switch (tempData.method) {
                            case "add":
                                const newPartner = new partnerModel(tempData.data);
                                newPartner.save().then((result) => {} );
                                tempModel.findByIdAndDelete(partnerID).then((result) => res.status(200).json('success'));
                                break;
                            case "update":
                                partnerModel.findByIdAndUpdate(tempData.data._id,{...tempData.data, state:'public'}).then(result =>  {});
                                tempModel.findByIdAndDelete(partnerID).then((result) => res.status(200).json('success'));
                                break;
                            case 'delete':
                                partnerModel.findByIdAndDelete(tempData.data._id).then((result) => {});
                                tempModel.findByIdAndDelete(partnerID).then((result) =>res.status(200).json('success'));
                                break;
                        }
                    })
                    .catch((error) => res.status(500).json({ error: error }));
                break;
        }
       

    }
}

module.exports = new PartnersController();
