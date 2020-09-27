const express = require('express');
const router = express.Router();
const authRouter = require('../controllers/auth');

router.get('/login', authRouter.getLogin);
router.post('/login', authRouter.postLogin);
router.post('/logout', authRouter.postLogout);

module.exports = router;