const morgan = require("morgan")

const logger = () => {
    return morgan((token,req,res) => {
        return [
            `METHOD:: ${token.method(req, res)}`,
            `URL:: ${token.url(req, res)}`,
            `STATUS:: ${token.status(req, res)}`,
        ].join(' ')
    })
}

module.exports = logger