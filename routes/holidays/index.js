const router = require("express").Router();
const AdminAuth = require("../../middlewares/AdminAuth");
const upload = require("../../middlewares/multerConfig");
const controller = require('./holidays')

router.get('/', controller.get);
router.post('/', AdminAuth, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'pdf', maxCount: 10 }
  ]),controller.add);

router.delete('/:id',AdminAuth,controller.delete);

module.exports = router;