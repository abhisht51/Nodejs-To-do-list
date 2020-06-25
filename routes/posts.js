const express = require('express');

const Post = require('../models/Post');
const verify = require('./TokenVerification');
const router = express.Router();

// Private route for logged in users 
router.get('/',verify, async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.postId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});

router.post('/add', async (req, res, next) => {
    title = req.body.title;
    content = req.body.content;
    creator = req.body.creator;

    const post = new Post({
        title: title,
        content: content,
        creator: creator,
    });
    const savedPost = await post.save()

    try {
        res.json(savedPost);
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});

router.patch('/update', async (req, res) => {
    try {
        
        title = req.body.title;
        content = req.body.content;
        creator = req.body.creator;
        _id = req.body._id;
        console.log(_id);
        const post = await Post.updateOne({_id:_id},{$set:{title:title,
            content:content,
            creator:creator}
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});



router.delete('/delete/:postId', async (req, res, next) => {
    try {
        const post = await Post.remove({_id:req.params.postId});
        res.status(200).json(
            {
                message1:post,
                message: 'Post Deleted Successfully'
            })
    } catch (error) {
        res.status(422).json({
            message: error
        });
    }
});

module.exports = router;

