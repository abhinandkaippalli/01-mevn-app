const Post = require("../models/posts")
const fs = require('fs')


module.exports = class API {
    static async fetchAllPost(req, res) {
        try {
            const posts = await Post.find()
            res.status(200).json(posts)
        } catch (error) {
            res.status(404).json({ messae: error.messaege })
        }
    }

    static async fetchPostByID(req, res) {
        try {
            const post = await Post.findById(req.params.id)
            res.status(200).json(post)
        } catch (error) {
            res.status(404).json({ messaege: error.messae })
        }
    }

    static async createPost(req, res) {
        const post = req.body
        const imagename = req.file.filename
        post.image = imagename
        try {
            console.log(imagename);
            await Post.create(post)
            res.status(201).json({ messaege: "Post created successfully!" })
        } catch (error) {
            res.status(400).json({ messaege: error.messae })
        }
    }

    static async updatePost(req, res) {
        const id = req.params.id
        let new_image = ""
        if (req.file) {
            new_image = req.file.filename
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image)
            } catch (error) {
                console.log(error);
            }
        } else {
            new_image = req.body.old_image
        }
        const newPost = req.body
        newPost.image = new_image

        try {
            await Post.findByIdAndUpdate(id, newPost)
            res.status(200).json({ messae: 'Post updated successfully!' })
        } catch (error) {
            res.status(404).json({ messae: error.messaege })
        }
    }

    static async deletePost(req, res) {
        const id = req.params.id
        try {
            const result = await Post.findByIdAndDelete(id)
            if(result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image)
                } catch(error) {
                    console.log(error);
                }
            }
            res.status(200).json({meessage: 'Post deleted successfully'})
        } catch (error) {
            res.status(404).json({ messaege: error.meessage})
        }
    }
}