const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');




const app = express();

const postRoutes = require('./routes/posts');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use('/posts',postRoutes);

app.get('/',(req,res,next)=>{
    res.send('Home Page');
});

mongoose.connect(process.env.DB_ID,{useNewUrlParser:true},()=>{ 
    console.log('Connected to the DB!');
});

app.listen(8010); 
