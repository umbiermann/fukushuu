const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// grammar Model
const Collection = require("../../models/collection");
const User = require("../../models/user");
const Card = require("../../models/card");
const { exampleLogs } = require("../../lib/example-data/exampleLogs");

router.get("/examplelogs", (req, res) => {
  res.json(exampleLogs);
});

// @route GET api/collections
// @desc Get collections, depending on current user
// @access Private
router.get("/:userId", auth, (req, res) => {
  User.findById(req.params.userId, { collections: 1 }).then((user) => {
    Collection.find(
      { _id: { $in: user.collections } },
      { name: 1 }
    ).then((collections) => res.json(collections));
  });
});

router.get("/invitations/:userId", auth, (req, res) => {
  User.findById(req.params.userId, { invitations: 1 }).then((user) => {
    Collection.find(
      { _id: { $in: user.invitations } },
      { name: 1 }
    ).then((collections) => res.json({ invitations: collections }));
  });
});

// Get logs, depending on current user
router.get("/logs/:userId/:i", auth, (req, res) => {
  User.findById(req.params.userId, { collections: 1 }).then((user) => {
    Collection.find({ _id: { $in: user.collections } }, { logs: 1 }).then(
      (collections) => {
        var userLogs = [];
        collections.forEach(
          (collection) => (userLogs = [...userLogs, ...collection.logs])
        );
        const userLogsFiltered = userLogs.filter((log) => log.original !== "");
        const userLogsSorted = userLogsFiltered.sort(
          (logA, logB) => logB.date - logA.date
        );
        const i = req.params.i;
        const logs = userLogsSorted.slice(i * 10, i * 10 + 10);
        const pages = Math.floor(Math.abs(userLogsSorted.length - 1) / 10);
        res.json({ logs: logs, pages: pages });
      }
    );
  });
});

// @route POST api/collection
// @desc Create a Collection
// @access Private
router.post("/", auth, (req, res) => {
  const newCollection = new Collection({
    name: req.body.name,
    cards: [],
    logs: [],
  });

  newCollection.save(function (err, collection) {
    if (err) return console.error(err);
    res.json(collection);
  });
});

// @route POST api/collection
// @desc Create a Collection
// @access Private
router.post("/:id", auth, (req, res) => {
  Collection.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((collection) => res.json(collection))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/cards/:id
// @desc Updates a Card
// @access Private
router.post("/card/:id", auth, (req, res) => {
  Collection.findByIdAndUpdate(
    req.params.id,
    { $push: { cards: req.body.cardId } },
    { new: true, useFindAndModify: false }
  )
    .then((card) => res.json(card))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/cards
// @desc Create a Card
// @access Private
router.post("/log/:id", auth, (req, res) => {
  const log = req.body;
  Collection.updateMany(
    { cards: req.params.id },
    { $push: { logs: log } },
    { new: true, useFindAndModify: false }
  )
    .then((log) => res.json(log))
    .catch((err) => res.status(404).json({ success: false }));
});

router.post("/logs/comment/:id", auth, (req, res) => {
  const comment = req.body;
  Collection.updateMany(
    { "logs._id": req.params.id },
    { $push: { "logs.$.comment": comment } },
    { new: true, useFindAndModify: false }
  )
    .then((collection) => res.json(collection))
    .catch((err) => res.status(404).json({ success: false }));
});

router.delete("/:id", auth, (req, res) => {
  Collection.findOneAndDelete({ _id: req.params.id }).then((collection) => {
    Card.deleteMany({ _id: { $in: collection.cards } }).then(
      res.json(collection)
    );
  });
});

module.exports = router;
