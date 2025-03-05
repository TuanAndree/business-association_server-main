const contacts = require('../models/ContactModel');
class ContactsController {

    index(req, res, next) {
        contacts.find({}).lean()
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({error}))
    }

    createNewContact(req, res, next) {
            const contact = req.body;
            const newContact = new contacts(contact)
            newContact.save()
            .then(()=> res.redirect('back'))
            .catch(next)
    }

    deleteOneContact(req, res, next) {
        const id = req.params.id;
        contacts.findByIdAndDelete(id)
        .then(result => res.status(200).json('success'))
        .catch(error => res.status(500).json({error}))
    }

}

module.exports = new ContactsController
