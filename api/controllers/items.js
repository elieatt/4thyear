const { default: mongoose } = require("mongoose");
const Item = require("../models/item");
const fs = require("fs");
const Message = require("../models/message");

const path = require("path");




exports.itemsGetItems = (req, res, next) => {
    Item.find()
        .select("_id title description imageUrl dateOfLoose found category governorate user")
        .populate("user", "_id email phoneNumber userName")
        .exec()
        .then(docs => {
            const items = docs.reverse().map((doc) => {

                return {
                    _id: doc._id,
                    title: doc.title,
                    description: doc.description,
                    imageUrl: doc.imageUrl,
                    dateOfLoose: doc.dateOfLoose,
                    found: doc.found,
                    category: doc.category,
                    governorate: doc.governorate,
                    user: doc.user,
                    request: {
                        type: "GET",
                        url: `${process.env.DOMAIN}/items/${doc._id}`
                    }

                }
            });
            res.status(200).json({
                count: docs.length,
                items: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.itemsGetOneItem = (req, res, next) => {
    //console.log("here");
    Item.findById(req.params.itemId)
        .select("_id title description imageUrl dateOfLoose found category governorate user")
        .populate("user", "_id email phoneNumber userName")
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


exports.itemsCreateItem = (req, res, next) => {

    console.log(req.file.path);
    const item = new Item({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        imageUrl: `${process.env.DOMAIN}/${req.file.path}`.replace(/\\/g, "/"),
        dateOfLoose: req.body.dateOfLoose,
        found: req.body.found,
        category: req.body.category,
        governorate: req.body.governorate,
        user: req.userData._id
    });

    item.save()
        .then(result => {
            res.status(201).json({
                message: "item was added",
                item: item,
                request: {
                    type: "GET",
                    url: `${process.env.DOMAIN}/items/${item._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.itemsCreateItemNoImage = (req, res, next) => {



    const item = new Item({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        imageUrl: `${process.env.DOMAIN}/uploads/NOIMAGE.jpg`,
        found: req.body.found,
        dateOfLoose: req.body.dateOfLoose,
        category: req.body.category,
        governorate: req.body.governorate,
        user: req.userData._id
    });


    item.save()
        .then(result => {
            res.status(201).json({
                message: "item was added",
                item: item,
                request: {
                    type: "GET",
                    url: `${process.env.DOMAIN}/items/${item._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.itemsUpdateItem = (req, res, next) => {
    Item.updateOne({ _id: req.params.itemId }, { $set: req.body })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "updated successfully"
            })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}


exports.itemsDeleteItem = async (req, res, next) => {
    var imagePath;

    Item.findById(req.params.itemId).exec().then(async doc => {
        imagePath = doc.imageUrl.split(`${process.env.DOMAIN}/uploads/`)[1];
        console.log(imagePath);
        let del = await Message.deleteMany({ item: req.params.itemId });
        Item.deleteOne({ _id: req.params.itemId })
            .exec()
            .then(result => {
                if (imagePath != "NOIMAGE.jpg") {
                    fs.unlinkSync(path.join("uploads", imagePath));
                }

                res.status(200).json({
                    message: "deleted successfully"
                });
            })

    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })

}
//////////*******/ */