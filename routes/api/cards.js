const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// card Model
const Card = require("../../models/card");
const User = require("../../models/user");
const Collection = require("../../models/collection");
const { exampleCards } = require("../../lib/example-data/exampleCards");
const {
  getCardListWithReviewDate,
  sortCardList,
  searchCardList,
} = require("../../lib/cards");

// @route GET api/cards/listdemo
// @param search: search for card name
// @param sort: sorting of list
// @desc Get demo Card with user progress
// @access Public
router.get("/listdemo", (req, res) => {
  res.json(
    sortCardList(
      searchCardList([...exampleCards], req.query.search),
      req.query.sort
    )
  );
});

// @route GET api/cards/list
// @param filterCollection: filter for certain collection
// @param search: search for card name
// @param sort: sorting of list
// @desc Get Cards with user progress
// @access Private
router.get("/list/:userId", auth, (req, res) => {
  User.findById(req.params.userId, { cardProgress: 1, collections: 1 }).then(
    (user) => {
      var collections = user.collections;
      if (req.query.filterCollection) {
        collections = [req.query.filterCollection];
      }
      Collection.find({ _id: { $in: collections } }, { cards: 1 }).then(
        (collections) => {
          var userCollectionCardIds = [];
          collections.forEach(
            (collection) =>
              (userCollectionCardIds = [
                ...userCollectionCardIds,
                ...collection.cards,
              ])
          );
          Card.find({
            _id: { $in: userCollectionCardIds },
            name: { $regex: req.query.search },
          })
            .lean()
            .sort({ date: -1 })
            .then((cards) => {
              res.json(
                sortCardList(
                  getCardListWithReviewDate(cards, user.cardProgress),
                  req.query.sort,
                  true
                )
              );
            });
        }
      );
    }
  );
});

router.get("/next", (req, res) => {
  res.json(sortCardList([...exampleCards], "Review")[0]);
});

// @desc Get next card with userprogress
router.get("/next/:id/:filterCollections?", auth, (req, res) => {
  User.findById(req.params.id, { collections: 1, cardProgress: 1 }).then(
    (user) => {
      var collections = user.collections;
      if (req.params.filterCollections) {
        collections = [req.params.filterCollections];
      }
      Collection.find({ _id: { $in: collections } }, { cards: 1 }).then(
        (collections) => {
          var userCollectionCardIds = [];
          collections.forEach(
            (collection) =>
              (userCollectionCardIds = [
                ...userCollectionCardIds,
                ...collection.cards,
              ])
          );
          Card.find({ _id: { $in: userCollectionCardIds } })
            .sort({ date: -1 })
            .lean()
            .then((cards) => {
              nextCard = sortCardList(
                getCardListWithReviewDate(cards, user.cardProgress),
                "Review"
              )[0];

              if (nextCard?.progress < 0) {
                res.json(nextCard);
              } else {
                res.json(null);
              }
            });
        }
      );
    }
  );
});

// @route GET api/cards/:id
// @desc Get a Card
// @access Public
router.get("/:id", (req, res) => {
  Card.findById(req.params.id).then((card) => res.json(card));
});

// @route POST api/cards
// @desc Create a Card
// @access Private
router.post("/", auth, (req, res) => {
  const newCard = new Card({
    name: req.body.name,
    type: req.body.type,
    info: req.body.info,
  });

  newCard.save().then((card) => res.json(card));
});

// @route POST api/cards/:id
// @desc Updates a Card
// @access Private
router.post("/:id", auth, (req, res) => {
  Card.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((card) => res.json(card))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route DELETE api/cards/:id
// @desc Delete a Card
// @access Public
router.delete("/:id", auth, (req, res) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .then((card) => {
      User.updateMany(
        { cardProgress: { $elemMatch: { cardId: req.params.id } } },
        { $pull: { cardProgress: { cardId: req.params.id } } }
      )
        .then((user) => {
          Collection.updateMany(
            { cards: req.params.id },
            { $pull: { cards: req.params.id } }
          )
            .then((collection) => res.json({ success: true }))
            .catch((err) => res.status(404).json({ success: false }));
        })
        .catch((err) => res.status(404).json({ success: false }));
    })
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
