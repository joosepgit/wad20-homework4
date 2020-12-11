const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    console.log("Posting...");
    // Endpoint to create a new post
    let userPost = {
        text: {required: true},
        media: {
            url: {required: true},
            type: {required: true},
        }
    };

    const fieldMissing = {
        code: null,
        message: 'Please provide %s field'
    };

    for (let field in userPost) {
        if (userPost[field].required === true && !request.body[field]) {

            fieldMissing.code = field;
            fieldMissing.message = fieldMissing.message.replace('%s', field);

            response.json(fieldMissing, 400);
            return;
        }
    }

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: {
            url: request.body.media.url,
            type: request.body.media.type,
        }
    }


    PostModel.create(params, () => {
        response.status(201).json
    })
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    //TODO: Olger
    console.log("like tuleks lisada!")
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    //TODO: Olger
    console.log("like tuleks eemaldada!")
});

module.exports = router;