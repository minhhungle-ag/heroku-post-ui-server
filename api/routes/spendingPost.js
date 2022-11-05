const express = require('express')
const uuid = require('uuid').v4

const writeToFile = require('../../utils/common')
const post_db = require('../../data/post.json')
const appConstants = require('../../constants/appConstants')
const checkAuth = require('../middleware/checkAuth')

const getResponse = require('../../utils/response')
const stringToASCII = require('../../utils/stringToASCII')

const router = express.Router()
const postList = [...post_db] //POST LIST MUST BE ARRAY

router.get('/', (req, res) => {
    const author = req.query.author
    const searchKey = req.query.searchKey
    const recentId = req.query.recentId

    const page = parseInt(req.query.page) || appConstants.CURRENT_PAGE
    const limit = parseInt(req.query.limit) || appConstants.CURRENT_LIMIT

    const startIdx = (page - 1) * limit
    const endIdx = page * limit

    const newPostList = postList
        .filter((item) => (author ? item.author === author : item))
        .filter((item) =>
            searchKey
                ? stringToASCII(item.author.toLowerCase()).includes(
                      stringToASCII(searchKey.toLowerCase())
                  ) ||
                  stringToASCII(item.title.toLowerCase()).includes(
                      stringToASCII(searchKey.toLowerCase())
                  )
                : item
        )
        .filter((item) => (recentId ? item.id !== recentId : item))

    const totalPage = Math.ceil(newPostList.length / limit)
    const total = newPostList.length

    const data = {
        data: newPostList.slice(startIdx, endIdx),
        pagination: {
            page: page,
            limit: limit,
            total: total,
            total_page: totalPage,
        },
    }

    getResponse.onSuccess(res, data)
})

router.get('/:postId', (req, res) => {
    const postId = req.params.postId
    const post = postList.find((item) => item.id === postId)

    if (post) {
        getResponse.onSuccess(res, { data: post })
        return
    }

    getResponse.onFail(res, { data: null })
    return
})

router.post('/', checkAuth, (req, res) => {
    const post = {
        id: uuid(),
        title: req.body.title,
        author: req.body.author,
        avatar: req.body.avatar,
        short_description: req.body.short_description,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const newPostList = [post, ...postList]
    writeToFile(newPostList, './data/spendingPost.json')

    getResponse.onSuccess(res, { data: post })
})

router.delete('/:postId', checkAuth, (req, res) => {
    const postId = req.params.postId
    const newPostList = [...postList]
    const idx = newPostList.findIndex((item) => item.id === postId)

    if (!newPostList[idx]) {
        res.status(200).json({
            message: 'Post not found',
        })

        return
    }

    newPostList.splice(idx, 1)
    writeToFile(newPostList, './data/spendingPost.json')

    res.status(200).json({
        message: `Deleted post ${postId} success`,
    })
})

module.exports = router
