const express = require("express");
const { Card } = require("../models/Card");
const joi = require("joi");
const auth = require("../middlewares/auth");
const _ = require("lodash");
const router = express.Router();

const cardsSchema = joi.object({
  name: joi.string().required().min(2),
  address: joi.string().required().min(6),
  description: joi.string().required().min(2),
  phone: joi
    .string()
    .required()
    .regex(/^0[2-9]\d{7,8}$/),
  image: joi.string().required(),
});

const genCardNumber = async () => {
  while (true) {
    let randomNum = _.random(1000, 999999);
    let card = await Card.findOne({ cardNumber: randomNum });

    if (!card) return randomNum;
  }
};

router.post("/", auth, async (req, res) => {
  //1 joi validation
  try {
    const { error } = cardsSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    //2.add cardNumber + user
    let card = new Card(req.body);
    card.cardNumber = await genCardNumber();
    card.user_id = req.payload._id;

    //3.save card to db
    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send("Error in post card");
  }
});

//8
// cards of specific user 
// נקודת גישה זו תהייה פתוחה למחוברים בלבד ותדרוש את ה token שסופק לאחר
// התחברות )מסעיף 2

router.get("/myCards", auth, async (req, res) => {
  try {
    
    const myCards = await Card.find({user_id: req.payload._id});
    res.status(200).send(myCards);
  } catch (error) {
    res.status(400).send("Error in get specific  card");
  }
});


//9
// all req that give back all user cards
// נקודת גישה זו תהייה פתוחה למחוברים בלבד ותדרוש את ה token שסופק לאחר
// התחברות )מסעיף 2

router.get("/", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("Error in get specific  card");
  }
});


// 5
// get specific card of specific user
// נקודת גישה זו תהייה פתוחה למחוברים בלבד ותדרוש את ה token שסופק לאחר
// התחברות )מסעיף 2
router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params.id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(404).send("card was not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in get specific  card");
  }
});

//6
// put req that get card id and give ability to add user card

// נקודת גישה זו תהייה פתוחה למחוברים בלבד ותדרוש את ה token שסופק לאחר
// התחברות )מסעיף 2

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = cardsSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let card = await Card.findOneAndUpdate(
      { _id: req.params.id, user_id: req.payload._id },
      req.body,
      { new: true }
    );
    if (!card) return res.status(404).send("Card was not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in put specific  card");
  }
});

//7
//  delete req that get user id card and get ability delete user card
// נקודת גישה זו תהייה פתוחה למחוברים בלבד ותדרוש את ה token שסופק לאחר
// התחברות )מסעיף 2
router.delete("/:id", auth, async (req, res) => {
  try {
  
    const card = await Card.findOneAndRemove(
      {_id: req.params.id,user_id: req.payload._id,}
      );
    if (!card) return res.status(404).send("Card was not found");
    res.status(200).send(`u delete :${card} `);
  } catch (error) {
    res.status(400).send("Error in put specific  card");
  }
});



module.exports = router;


// "name":"Pizza Hut",
// "description":"sdgsgd ghdgd gth",
// "address":"Floret 15",
// "phone":"052456985",
// "image":"https://play-lh.googleusercontent.com/2ltNkuoIjYwXUGT-9w26Wt3BjM4ow2zqyis0DJuzaPTj5jY9v3H2W1Uuw6b3PglMak7Y"

// });
