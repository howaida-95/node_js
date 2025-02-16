const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
/*
initialize  nodemailer
-> transporter: 
  tells nodemailer how your email will be delivered 
*/
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // it only hold a value if we have error flash into our session
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
  //console.log(req.get("cookie").split("=")[1], "cookie");
};

exports.postLogin = (req, res, next) => {
  /* 
  functionality to ensure that we can sign in
  - extract information from request
  - validate the req body data ==> email, password
  - find the user with that email ==> if no user found ==> return error
  - compare the password
  - redirect to home page
  - set the session
  */

  // extract data from request
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  // find the user with that email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
          //validationErrors: [{ path: "email", path: "password" }],
          validationErrors: [], // not defining which field is invalid
        });
      } else {
        // if user found ==> check the password
        // bcrypt
        bcrypt.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "invalid email or password",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [], // not defining which field is invalid
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/*
steps:
- extract information from request 
- validate the req body data --> email, password & confirmPassword
- check if the user with that email already exist 
because there is no duplicate email in db 
how ??
------
=> create index in mongodb  
=> find user with that email 
- create a new user 
*/

exports.postSignup = (req, res, next) => {
  // extract information from request
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return true or false depends on there is error or not
    return res
      .status(422) // validation failed status code -> 422
      .render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
        validationErrors: errors.array(),
      });
  } else {
    //  check if the user with that email already exist
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        // create a new user
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then((result) => {
        // redirect
        res.redirect("/login");
        // send email
        return transporter.sendMail({
          to: email,
          from: "howaidasayed95@gmail.com",
          subject: "signup succeeded",
          html: "<h1>you successfully signed up</h1>",
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    // function called once session is destroyed
    res.redirect("/");
  });
};

// reset password
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    // store in user object -->
    const token = buffer.toString("hex");
    // find the user with that email in database (match email with the email we want to reset)
    User.findOne({ email: req.body.email })
      .then((user) => {
        // console.log(user);
        if (!user) {
          // flash message
          req.flash("error", "no account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour (in ms)
        return user.save(); // save the user with the reset token to db
      })
      .then((result) => {
        return transporter
          .sendMail({
            to: req.body.email,
            from: "howaidasayed95@gmail.com",
            subject: "Password Reset",
            html: `
            <p>you requested a password reset</p>
            <p>click this link <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `,
          })
          .then((result) => {
            console.log("email sent");
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
};

//update password
exports.getNewPassword = (req, res, next) => {
  /*
  first --> check if the user for those token exists
  -> route to encode the token in params ex: /reset/:token
  -> extract the token from the url
  -> find the user with that token
  */
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }) // gt --> stands for  greater than
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() }, // non expired token --> greater than current date
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      // hash the password
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined; // clear reset token to prevent reuse
      resetUser.resetTokenExpiration = undefined; // clear resetTokenExpiration to prevent reuse
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

/*
  session needs cookie to store the session id
  to identify the user
  but the sensitive data is stored on the server
  we can't modify it from the client side
  --------------------------------------------
  we can store other data in sessions like: cart 
*/
