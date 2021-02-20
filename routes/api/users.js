const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/user");
const Card = require("../../models/card");
const Collection = require("../../models/collection");
const { exampleCards } = require("../../lib/example-data/exampleCards");
const { exampleLogs } = require("../../lib/example-data/exampleLogs");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "User already exists." });
    }

    const newUser = new User({
      name,
      email,
      password,
    });
    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.jwtSecret || config.get("jwtSecret"),
            //              {expiresIn: 3600}
            (err, token) => {
              if (err) {
                throw err;
              }
              res.json({
                token,
                user: user,
              });
            }
          );
        });
      });
    });
  });
});

// @route POST api/users/progress
// @desc Updates user progress
// @access Private
router.post("/updateprogress", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.body.userId,
      "cardProgress.cardId": req.body.cardId,
    },
    {
      $set: {
        "cardProgress.$": {
          cardId: req.body.cardId,
          level: req.body.level,
          lastDate: req.body.lastDate,
        },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ success: false }));
});

router.post("/addprogress", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.body.userId,
    },
    {
      $push: {
        cardProgress: {
          cardId: req.body.cardId,
          level: req.body.level,
          lastDate: req.body.lastDate,
        },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((collection) => res.json(collection))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/users/addcollection
// @desc Adds User Collection
// @access Private
router.post("/addcollection", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.body.userId,
    },
    {
      $push: {
        collections: req.body.collectionId,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ success: false }));
});

router.post("/examplecollection", auth, (req, res) => {
  Card.insertMany(exampleCards).then((cards) => {
    cardIds = cards.map((card) => card._id);

    var exampleDate = new Date();
    exampleDate.setDate(exampleDate.getDate() - 2);
    const exampleProgress = [
      {
        cardId: cardIds[1],
        level: 2,
      },
      {
        cardId: cardIds[2],
        level: 0,
        lastDate: exampleDate,
      },
    ];

    const newCollection = new Collection({
      name: "ExampleCollection",
      cards: cardIds,
      logs: exampleLogs,
    });

    newCollection.save(function (err, collection) {
      if (err) return console.error(err);
      User.findOneAndUpdate(
        {
          _id: req.body.userId,
        },
        {
          $push: {
            collections: collection._id,
            cardProgress: { $each: exampleProgress },
          },
          $set: {
            exampleCollection: collection._id,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      ).then((user) => res.json(user));
    });
  });
});

router.post("/leavecollection", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userId },
    { $pull: { collections: req.body.collectionId } },
    {
      new: true,
      useFindAndModify: false,
    }
  ).then((user) => {
    var change = false;
    if (req.body.collectionId === user.exampleCollection) {
      user.exampleCollection = "";
      change = true;
    }
    if (req.body.collectionId === user.selectOptions.filterCollection) {
      user.selectOptions.filterCollection = "";
      change = true;
    }
    if (req.body.collectionId === user.selectOptions.addCollection) {
      user.selectOptions.addCollection = "";
      change = true;
    }
    if (change) {
      User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $set: {
            exampleCollection: user.exampleCollection,
            "selectOptions.filterCollection":
              user.selectOptions.filterCollection,
            "selectOptions.addCollection": user.selectOptions.addCollection,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      ).then((user) => res.json(user));
    } else {
      return res.json(user);
    }
  });
});

router.get("/lastUser/:collectionId", auth, (req, res) => {
  User.countDocuments({ collections: req.params.collectionId }).then(
    (userCount) => {
      if (userCount > 1) {
        return res.json({ lastUser: false });
      } else {
        return res.json({ lastUser: true });
      }
    }
  );
});

router.get("/invitations/:id", auth, (req, res) => {
  User.find(
    { invitations: req.params.id },
    { email: 1, invitations: 1 }
  ).then((users) => res.json({ invitations: users }));
});

router.post("/invite", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      email: req.body.userMail,
      invitations: { $ne: req.body.collectionId },
      collections: { $ne: req.body.collectionId },
    },
    {
      $push: {
        invitations: req.body.collectionId,
      },
    },
    {
      projection: { email: 1, invitations: 1 },
      new: true,
      useFindAndModify: false,
    }
  ).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    } else {
      return res.json(user);
    }
  });
});

router.post("/invitation", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userId },
    { $pull: { invitations: req.body.collectionId } }
  ).then((user) => {
    return res.json(user);
  });
});

router.post("/cardselectoptions/:userId", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: { selectOptions: req.body } },
    {
      new: true,
      useFindAndModify: false,
    }
  ).then((user) => {
    return res.json(user);
  });
});

module.exports = router;
