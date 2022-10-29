const fs = require('fs')

function writeToFile(array, dirname) {
    try {
        fs.writeFileSync(dirname, JSON.stringify(array), () => console.log('write file success'))
    } catch (error) {
        console.log({ error })
    }
}

module.exports = writeToFile
