const express = require('express')
const uuid = require('uuid').v4
const writeToFile = require('../../utils/common')
const post_db = require('../../data/post.json')
const appConstants = require('../../constants/appConstants')
const checkAuth = require('../middleware/checkAuth')
const router = express.Router()
const getResponse = require('../../utils/response')

const postList = [...post_db] //POST LIST MUST BE ARRAY

function stringToASCII(str) {
    try {
        return str
            .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
            .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
            .replace(/[đ]/g, 'd')
            .replace(/[ìíỉĩị]/g, 'i')
            .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
            .replace(/[ùúủũụưừứửữự]/g, 'u')
            .replace(/[ỳýỷỹỵ]/g, 'y')
    } catch {
        return ''
    }
}

router.get('/', (req, res) => {
    const author = req.query.author
    const searchAuthor = req.query.search_author

    const page = parseInt(req.query.page) || appConstants.CURRENT_PAGE
    const limit = parseInt(req.query.limit) || appConstants.CURRENT_LIMIT

    const startIdx = (page - 1) * limit
    const endIdx = page * limit

    console.log(recentPost)

    const newPostList = postList
        .filter((item) => (author ? item.author === author : item))
        .filter((item) =>
            searchAuthor
                ? stringToASCII(item.author).includes(stringToASCII(searchAuthor.toLowerCase()))
                : item
        )

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

router.post('/', (req, res) => {
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
    writeToFile(newPostList, './data/post.json')
    getResponse.onSuccess(res, { data: post })
})

router.put('/:postId', (req, res) => {
    const postId = req.params.postId
    const newPostList = [...postList]
    const idx = newPostList.findIndex((item) => item.id === postId)

    if (!newPostList[idx]) {
        res.status(200).json({
            status: 200,
            message: 'post not found!',
            data: null,
        })

        return
    }

    const post = {
        id: postId,
        title: req.body.title || newPostList[idx].title,
        author: req.body.author || newPostList[idx].author,
        avatar: req.body.avatar || newPostList[idx].avatar,
        short_description: req.body.short_description || newPostList[idx].short_description,
        description: req.body.description || newPostList[idx].description,
        imageUrl: req.body.imageUrl || newPostList[idx].imageUrl,
        createdAt: newPostList[idx].createdAt,
        updatedAt: new Date(),
    }

    newPostList[idx] = post
    writeToFile(newPostList, './data/post.json')
    getResponse.onSuccess(res, { data: post })
})

router.delete('/:postId', (req, res) => {
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
    writeToFile(newPostList, './data/post.json')

    res.status(200).json({
        message: `Deleted post ${postId} success`,
    })
})

module.exports = router
