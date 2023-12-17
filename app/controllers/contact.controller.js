const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body || !req.body.name) {
        return next(new ApiError(400, "Name can not empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, " Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return (new ApiError(500,
            `Error retrieving contact with id=${req.params.id}`
        )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(404, "Data update cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, " Contact not found"));
        }
        return res.send({ message: " Contact was updated successfully" });
    } catch (error) {
        return (new ApiError(500,
            `Error updating contact with id=${req.params.id}`
        )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return new (new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was delete successfully" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete contact with id=${req.params.id}`));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deleteResult = await contactService.deleteAll();
        const deleteCount = deleteResult.deletedCount;
        return res.send({
            message: `${deleteCount} contact ware delete successfully`,
        });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }
};