const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid').v4

const checkAuth = require('../middleware/checkAuth')
const writeToFile = require('../../utils/common')
const user_db = require('../../data/user.json')
const appConstants = require('../../constants/appConstants')
const getResponse = require('../../utils/response')
const stringToASCII = require('../../utils/stringToASCII')

const router = express.Router()

const userList = [...user_db] //POST LIST MUST BE ARRAY

router.get('/', (req, res) => {
    const searchKey = req.query.searchKey
    const page = req.query.page || appConstants.CURRENT_PAGE
    const limit = req.query.limit || appConstants.CURRENT_LIMIT

    const startIdx = (page - 1) * limit
    const endIdx = page * limit

    const newUserList = userList.filter((item) =>
        searchKey
            ? stringToASCII(item.fullname).includes(stringToASCII(searchKey)) ||
              stringToASCII(item.email).includes(stringToASCII(searchKey))
            : item
    )

    const totalPage = Math.ceil(newUserList.length / limit)
    const total = newUserList.length

    const data = {
        data: newUserList.slice(startIdx, endIdx),
        pagination: {
            page: page,
            limit: limit,
            total: total,
            total_page: totalPage,
        },
    }

    getResponse.onSuccess(res, data)
})

//SIGN UP
router.post('/signup', (req, res) => {
    const email = req.body.email

    const checkUser = userList.find((item) => item.email === email)

    if (checkUser) {
        res.status(409).json({
            message: 'Mail exits',
        })

        return
    }

    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
            res.status(400).json({
                error: {
                    message: error.message,
                },
            })

            return
        }

        const user = {
            id: uuid(),
            email: req.body.email,
            password: hash,
            role: req.body.role,
            fullname: req.body.fullname,
            description: req.body.description,
            avatar: req.body.avatar,
            gender: req.body.gender,
            createdAt: new Date(),
        }

        const newUserList = [user, ...userList]
        writeToFile(newUserList, './data/user.json')
        getResponse.onSuccess(res, { data: user })
    })
})

// LOGIN
router.post('/login', (req, res) => {
    const email = req.body.email
    const user = userList.find((item) => item.email === email)

    if (!user) {
        res.status(409).json({
            message: "Mail not found, user does't exits",
        })

        return
    }

    bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error) {
            res.status(400).json({
                error: {
                    message: error.message,
                },
            })

            return
        }

        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user.id,
                },
                appConstants.JWT_KEY,
                {
                    expiresIn: '1h',
                }
            )

            getResponse.onSuccess(res, { data: { token: token, userId: user.id } })

            return
        }

        getResponse.onFail(res, { data: null })
    })
})

router.get('/:userId', (req, res) => {
    const userId = req.params.userId
    const user = userList.find((item) => item.id === userId)

    if (!user) {
        getResponse.onSuccess(res, { data: null })
        return
    }

    const newUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        description: user.description,
        avatar: user.avatar,
        gender: user.gender,
        createdAt: user.createdAt,
    }

    getResponse.onSuccess(res, { data: newUser })
})

router.delete('/:userId', (req, res) => {
    const userId = req.params.userId
    const newUserList = [...userList]
    const idx = newUserList.findIndex((item) => item.id === userId)

    if (!newUserList[idx]) {
        res.status(200).json({
            message: 'user not found',
        })

        return
    }

    newUserList.splice(idx, 1)
    writeToFile(newUserList, './data/user.json')

    res.status(200).json({
        message: `Deleted user ${userId} success`,
    })
})

module.exports = router
