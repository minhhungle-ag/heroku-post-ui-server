const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid').v4

const checkAuth = require('../middleware/checkAuth')
const writeToFile = require('../../utils/common')
const user_db = require('../../data/user.json')
const appConstants = require('../../constants/appConstants')

const router = express.Router()

const userList = [...user_db] //POST LIST MUST BE ARRAY

router.get('/', (req, res) => {
    const page = req.query.page || appConstants.CURRENT_PAGE
    const limit = req.query.limit || appConstants.CURRENT_LIMIT
    const startIdx = (page - 1) * limit
    const endIdx = page * limit

    const totalPage = Math.ceil(userList.length / limit)
    const total = userList.length
    const newUserList = userList.slice(startIdx, endIdx)

    res.status(200).json({
        status: 200,
        message: 'get posts success!',
        data: {
            data: newUserList,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                total_page: totalPage,
            },
        },
    })
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
            role: 'user',
            fullname: req.body.fullname,
            age: req.body.age,
            description: req.body.description,
            avatar: req.body.avatar,
            gender: req.body.gender,
        }

        const newUserList = [user, ...userList]
        writeToFile(newUserList, './data/user.json')

        res.status(200).json({
            status: 200,
            message: 'create user success',
            data: { data: user },
        })
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

            res.status(200).json({
                message: 'Auth successful',
                data: { token: token },
            })

            return
        }

        res.status(401).json({
            message: 'Auth failed, password is not correct ',
        })
    })
})

router.get('/:userId', (req, res) => {
    const userId = req.params.userId
    const user = userList.find((item) => item.id === userId)

    if (user) {
        res.status(200).json({
            message: 'get user success',
            data: { data: user },
        })

        return
    }

    res.status(400).json({
        message: 'not found',
        data: null,
    })
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
