const express = require('express');
const router = express.Router();
const {registerValidation,loginValiddation} = require('../validations');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const User = require('../models/User');

router.post('/register', async (req, res) => {
    const {error} = await registerValidation(req.body);
    if(error) return res.status(400).send(error.details); 

    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist)
        res.json('Email Already Exist');

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        date: req.body.date
    });

    try {
        const postData = await user.save();
        res.json(postData);
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});

router.post('/login',async (req,res)=>{
    const {error} = await loginValiddation(req.body);
    if(error) return res.status(400).send(error.details); 

    const emailExist = await User.findOne({email:req.body.email});
    if(!emailExist)
        res.json('User does not exist!');

    const validPass = await bcrypt.compare(req.body.password,emailExist.password);
    if(validPass){
        const token = jwt.sign({_id:emailExist._id},process.env.TOKEN_KEY);
        res.header('auth-token',token).status(200).json({message:"Logged In", token:token});
    }
    else{
        res.status(400).json({message:"Invalid Password"});
    }
});

module.exports = router;