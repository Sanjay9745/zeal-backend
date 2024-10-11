const router = require('express').Router();
const controller = require('./model')

router.post('/', controller.add)

module.exports = router