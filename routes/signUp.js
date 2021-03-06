"use strict"
const express = require('express');
const router = express.Router();
const db = require('../con_db');
const nodemailer = require('nodemailer');

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validdatePasswords(password1, password2) {
    console.log("Password Length: ", password1.length)
    return ((password1 == password2) && (password1.length >= 8));
}

/* GET signUp page. */
router.get('/', function (req, res, next) {
    res.render('signUp', {});
});

router.post('/', function (req, res, next) {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    db.tempUser.find({email:email}, function(err, response ){
        if(!err && response.length >= 1) {
            db.tempUser.remove({email:email}, function(err) {
                if(err) {
                    console.log("Error while removing dupicate entries from tempUser");
                    res.end();
                    return;
                }
            });
        }
    });

    db.user.find({email:email}, function (err, response) {
        if (!err && response.length >=1 ) {
            console.log("You are already registered");
            res.end("Already Registered");
            return;
        }
    });

    if (!validateEmail(email) || !validdatePasswords(password, confirmPassword)) {
        res.end("Bad request");
        return;
    }

    //create random 16 character token
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';

    for (var i = 16; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    var newUser = new db.tempUser({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        token: token,
        dateAndTime: new Date()
    });



    newUser.save(function (err) {
        if (err) {
            console.log("Error while saving to db:", err);
            res.end("Error while saving data");
            return;
        }

        res.end("Data saved");

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'grublord69@gmail.com',
                pass: 'Grublord69!'
            }
        });

        // setup email 
        let mailOptions = {
            from: '"Grub Lord" <grublord69@gmail.com>',
            to: email,
            subject: 'Greetings from Grub Lord',
            html: '<p>Hi, you are requested to click the below link to authenticate yourself. </p><br><p>http://localhost:3000/authenticateuser?token=' + token + '</p>'
        };

        // send mail 
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });

    });

});

module.exports = router;