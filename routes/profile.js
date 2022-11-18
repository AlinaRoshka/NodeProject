const express = require("express");
const { User } = require("../models/User");
const auth = require("../middlewares/auth");
const _ = require("lodash");
const router = express.Router();



router.get('/', auth, async (req,res)=>{
    try {
        let user = await User.findOne({email:req.payload.email})
        res.status(200).send(_.pick(user,["_id","name","email","biz"]))

    } catch (error) {
        res.status(400).send('ERROR in profile')
    }
})

module.exports = router;
