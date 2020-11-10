const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const adminRouter = require('../controllers/admin');
const isAuth = require('../middleware/auth');

router.get('/product-add', isAuth, adminRouter.getProductAdd);
router.post('/product-update', isAuth,
  [
    body('name')
      .trim()
      .notEmpty().withMessage('필수 입력란입니다.')
      .isLength({ min: 5 }).withMessage('최소 다섯자를 입력해 주세요.'),
    // body('img')
    //   .notEmpty().withMessage('필수 입력란입니다.'),
    body('price')
      .notEmpty().withMessage('필수 입력란입니다.'),
    body('description')
      .trim()
      .notEmpty().withMessage('필수 입력란입니다.')
  ], adminRouter.createOrUpdateProduct);
// router.post('/product-edit', isAuth,
//   [
//     body('name')
//       .trim()
//       .notEmpty().withMessage('필수 입력란입니다')
//       .isLength({ min: 5 }).withMessage('최소 다섯자를 입력해 주세요.'),
//     body('img')
//       .notEmpty().withMessage('필수 입력란입니다'),
//     body('price')
//       .notEmpty().withMessage('필수 입력란입니다.'),
//     body('description')
//       .trim()
//       .notEmpty().withMessage('필수 입력란입니다.')
//   ], adminRouter.createOrUpdateProduct);
router.get('/products', isAuth, adminRouter.getProducts);
router.get('/product-edit/:id', isAuth, adminRouter.getProductEdit);
router.post('/product-delete/:id', isAuth, adminRouter.deleteProduct);

module.exports = router;