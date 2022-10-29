const express = require('express')
const uuid = require('uuid').v4

const comments_db = require('../../data/comment.json')
const getResponse = require('../../utils/response')
const appConstants = require('../../constants/appConstants')
const writeToFile = require('../../utils/common')

const router = express.Router()
const commentDbList = [...comments_db]

router.get('/', (req, res) => {
    const postId = req.query.postId
    const page = parseInt(req.query.page) || appConstants.CURRENT_PAGE
    const limit = parseInt(req.query.limit) || appConstants.CURRENT_LIMIT
    const newCommentDbList = [...commentDbList]

    const commentDb = newCommentDbList.find((item) => item.postId === postId)
    const commentList = commentDb?.comments || [] // comment list must be array

    const startIdx = (page - 1) * limit
    const endIdx = page * limit
    const totalPage = Math.ceil(commentList.length / limit)
    const total = commentList.length

    const data = {
        data: [...commentList].slice(startIdx, endIdx),
        pagination: {
            page: page,
            limit: limit,
            total: total,
            total_page: totalPage,
        },
    }

    getResponse.onSuccess(res, data)
})

router.post('/', (req, res) => {
    const postId = req.body.postId
    const comments = {
        id: uuid(),
        name: req.body.name,
        comment: req.body.comment,
    }

    const dbIdx = commentDbList.findIndex((item) => item.postId === postId)

    console.log(commentDbList[dbIdx])

    if (commentDbList[dbIdx]) {
        const commentList = [...commentDbList[dbIdx].comments]

        const newCommentList = [...commentList, comments]
        commentDbList[dbIdx].comments = [...newCommentList]

        writeToFile(commentDbList, './data/comment.json')
        getResponse.onSuccess(res, { data: comments })
        return
    }

    const commentDb = {
        postId: postId,
        comments: [{ ...comments }],
    }

    const newCommentDbList = [commentDb, ...commentDbList]
    writeToFile(newCommentDbList, './data/comment.json')

    getResponse.onSuccess(res, { data: comments })
})

module.exports = router
