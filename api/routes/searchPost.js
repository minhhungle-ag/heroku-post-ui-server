const express = require('express')
const post_db = require('../../data/post.json')
const getResponse = require('../../utils/response')
const stringToASCII = require('../../utils/stringToASCII')

const router = express.Router()
const postList = [...post_db] //POST LIST MUST BE ARRAY

router.get('/', (req, res) => {
    const searchKey = req.query.searchKey

    const newPostList = postList.filter(
        (item) =>
            stringToASCII(item.author.toLowerCase()).includes(
                stringToASCII(searchKey.toLowerCase())
            ) ||
            stringToASCII(item.title.toLowerCase()).includes(stringToASCII(searchKey.toLowerCase()))
    )

    const data = {
        data: newPostList,
    }

    getResponse.onSuccess(res, data)
})

module.exports = router
