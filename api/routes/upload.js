const express = require('express')
const multer = require('multer')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + file.originalname)
    },
})

function fileFilter(req, file, cb) {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true)
        return
    }

    cb(null, false)
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 607 * 5,
    },
    fileFilter: fileFilter,
})

router.post('/', upload.single('imageUrl'), (req, res, next) => {
    if (!req.file.filename) {
        res.status(200).json({
            message: 'upload faid',
            imageUrl: null,
        })

        return
    }

    res.status(200).json({
        message: 'upload success',
        imageUrl: `http://${req.headers.host}/uploads/${req.file.filename}`, //https://heroku-post-ui.herokuapp.com
    })
})

module.exports = router
