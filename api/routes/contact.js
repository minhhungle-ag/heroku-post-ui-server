const express = require('express')
const uuid = require('uuid').v4

const getResponse = require('../../utils/response')
const contact_db = require('../../data/contact.json')
const writeToFile = require('../../utils/common')
const checkAuth = require('../middleware/checkAuth')
const appConstants = require('../../constants/appConstants')
const router = express.Router()
const contactList = [...contact_db] // Array

router.get('/', checkAuth, (req, res) => {
    const page = parseInt(req.query.page) || appConstants.CURRENT_PAGE
    const limit = parseInt(req.query.limit) || appConstants.CURRENT_LIMIT

    const startIdx = (page - 1) * limit
    const endIdx = page * limit

    const totalPage = Math.ceil(contactList.length / limit)
    const total = contactList.length

    const data = {
        data: contactList.slice(startIdx, endIdx),
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
    const contact = {
        id: uuid(),
        fullName: req.body.fullName,
        email: req.body.email,
        description: req.body.description,
    }

    const newContactList = [contact, ...contactList]
    writeToFile(newContactList, './data/contact.json')

    getResponse.onSuccess(res, { data: contact })
})

module.exports = router
