const getResponse = {
    onSuccess(res, data, message) {
        res.status(200).json({
            status: 'success',
            message: message,
            data: data,
        })
    },
    onFail(res, message) {
        res.status(400).json({
            status: 'failed',
            message: message,
            data: null,
        })
    },
    onError(res, error, message) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    },
}

module.exports = getResponse
