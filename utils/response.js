const getResponse = {
    onSuccess(res, data) {
        res.status(200).json({
            status: 'success',
            data: data,
        })
    },
    onFail(res, data) {
        res.status(400).json({
            status: 'failed',
            data: null,
        })
    },
    onError(res, error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    },
}

module.exports = getResponse
