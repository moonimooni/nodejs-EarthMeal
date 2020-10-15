const express = require('express');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/user');

const authRouter = require('../controllers/auth');

router.get('/login', authRouter.getLogin);
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('password')
      .trim()
  ], authRouter.postLogin
);
router.post('/logout', authRouter.postLogout);
router.get('/join', authRouter.getJoin);
router.post('/join',
  [
    check('email')
      .isEmail()
      .withMessage('유효하지 않은 이메일 유형입니다.')
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('이미 사용중인 이메일주소입니다.')
            };
          });
      })
      .normalizeEmail(),

    check('password') // you can add second arg of custom error message
      .trim()
      .isLength({ min: 8 })
      .withMessage('최소 8자를 입력해주세요.'),

    body('password_chk')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('비밀번호가 일치하지 않습니다.')
        };
        return true;
      })
  ], authRouter.postJoin
);
router.get('/find-pwd', authRouter.getFindPwd);
router.post('/find-pwd', authRouter.postFindPwd);
router.get('/reset-pwd/:token', authRouter.getResetPwd);
router.post('/reset-pwd', authRouter.postResetPwd);
module.exports = router;