const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

// require('dotenv').config();
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/user');
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9a05d89dc6f0c7",
    pass: "2fed56616b5977"
  }
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  };
});

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error')
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  };

  return res.render('auth/login', {
    docTitle: '어스밀 - 로그인',
    path: '/login',
    errorMessage: errorMessage
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', '이메일 또는 비밀번호 오류입니다');
        return res.redirect('/login');
      };
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // req.session.save(err => console.log(err)) ??
            return res.redirect('/');
          } else {
            req.flash('error', '이메일 또는 비밀번호 오류입니다');
            return res.redirect('/login');
          };
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  return req.session.destroy((err) => {
    if (err) console.log(err);
    return res.redirect('/');
  });
};

exports.getJoin = (req, res, next) => {
  return res.render('auth/join', {
    docTitle: '어스밀 - 회원가입',
    path: '/join',
    errorMessage: [],
    oldInput: {
      email: '',
      password: '',
      passwordChk: '',
      name: '',
      tel: '',
      gender: '',
      postcode: '',
      roadAddress: '',
      jibunAddress: '',
      extraAddress: ''
    }
  });
};

exports.postJoin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const tel = req.body.tel;
  const postcode = req.body.postcode;
  const roadAddress = `${req.body.roadAddress} ${req.body.extraAddress}`;
  const address = {
    variables:
      [{
        main: true,
        postcode: postcode,
        roadAddress: roadAddress
      }]
  };
  const gender = req.body.gender;
  const birthDay = `${req.body.year} ${req.body.month} ${req.body.day}`;

  const errors = validationResult(req);

  const oldInput = {
    email: email,
    password: password,
    passwordChk: req.body.password_chk,
    name: name,
    tel: tel,
    gender: gender,
    postcode: postcode,
    roadAddress: req.body.roadAddress,
    jibunAddress: req.body.jibunAddress,
    extraAddress: req.body.extraAddress
  }

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render('auth/join', {
        docTitle: '어스밀 - 회원가입',
        path: '/join',
        errorMessage: errors.array(),
        oldInput: oldInput
      });
  };

  bcrypt
    .hash(req.body.password, 12)
    .then(encryptedPW => {
      const newUser = new User({
        email: email,
        password: encryptedPW,
        name: name,
        tel: tel,
        address: address,
        gender: gender,
        birthDay: birthDay
      });
      return newUser.save();
    })
    .then(() => {
      res.redirect('/login');
      const mailContent = {
        from: '"어스밀", <admin@earthmeal.com>',
        to: email,
        subject: '어스밀의 회원이 되신 걸 환영합니다!',
        html: '<h1>그리너가 되신 걸 환영합니다</h1><div>우리 모두 채식을 통해 지구도 살리고 건강한 몸을 만들어 가요.</div>'
      };
      return transport.sendMail(mailContent);
      // return sgMail
      //   .send(mailContent)
      //   .then(() => {}, error => {
      //     console.error(error);
      //   });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getFindPwd = (req, res, next) => {
  let errorMessage = req.flash('error')
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  };

  return res.render('auth/find-pwd', {
    docTitle: '어스밀',
    path: '',
    errorMessage: errorMessage
  });
};

exports.postFindPwd = (req, res, next) => {
  let token;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);
    token = buffer.toString('hex');
  });
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.flash('error', '존재하지 않는 사용자입니다.');
        return res.redirect('/find-pwd');
      }
      user.resetToken = token;
      user.resetTokenExp = Date.now() + 3600000;
      return user.save()
        .then(() => {
          res.redirect('/login');
          const mailContent = {
            from: '"어스밀", <help@earthmeal.com>',
            to: req.body.email,
            subject: '[어스밀] 비밀번호를 재설정 해주세요!',
            html: `
              <p>${req.body.name}님 안녕하세요. 어스밀입니다.</p>
              <p>비밀번호를 재설정하시려면 아래 링크를 눌러주세요.</p>
              <a href="http://localhost:3000/reset-pwd/${token}">비밀번호 변경</a>
            `
          };
          return transport.sendMail(mailContent);
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getResetPwd = (req, res, next) => {
  let errorMessage = req.flash('error')
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  };

  const token = req.params.token;

  User
    .findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    })
    .then(user => {
      res.render('auth/reset-pwd', {
        docTitle: '어스밀',
        path: '',
        errorMessage: errorMessage,
        userId: user._id,
        pwdToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postResetPwd = (req, res, next) => {
  const userId = req.body.userId;
  const newPwd = req.body.password;
  const newPwd_chk = req.body.password_chk;
  const pwdToken = req.body.pwdToken;
  let resetUser;

  if (newPwd !== newPwd_chk) {
    req.flash('error', '비밀번호가 일치하지 않습니다.');
    return res.redirect(`/reset-pwd/${token}`);
  };
  User
    .findOne({
      resetToken: pwdToken,
      resetTokenExp: { $gt: Date.now() },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPwd, 12)
    })
    .then(hashedPwd => {
      resetUser.password = hashedPwd;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExp = undefined;
      return resetUser.save();
    })
    .then(() => res.redirect('/login'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}