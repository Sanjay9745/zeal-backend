const router = require("express").Router();
const AdminAuth = require("../../middlewares/AdminAuth");
const upload = require("../../middlewares/multerConfig");
const controller = require('./umraha')

router.get('/', controller.get);

router.get('/:id', controller.getSingle);

router.post(
    '/',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 }
    ]),
    controller.add
);

router.put(
    '/:id',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 }
    ]),
    controller.update
);

router.delete('/:id', AdminAuth, controller.delete);


module.exports = router;