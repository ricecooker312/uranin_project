require('dotenv').config()

const nodemailer = require('nodemailer')

const sendVerificationEmail = (email, atoken, rtoken, uid) => {
    const urlStarter = process.env.NODE_ENV === "production" ? 'https://uranin.herokuapp.com/accounts/verify' : 'http://localhost:3000/accounts/verify'
    const url = `${urlStarter}/${uid}/${rtoken}/${atoken}`

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const options = {
        from: 'reallybigbro121@gmail.com',
        to: email,
        subject: 'Verify Your Uranin Account',
        html: `<!DOCTYPE html>
        <html lang=en>
        <head>
        <meta charset=UTF-8>
        <meta http-equiv=X-UA-Compatible content="IE=edge">
        <meta name=viewport content="width=device-width, initial-scale=1.0">
        <title>Verify Your Uranin Account</title>
        <link rel=preconnect href=https://fonts.googleapis.com>
        <link rel=preconnect href=https://fonts.gstatic.com crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel=stylesheet>
        <style>*{margin:0;padding:0;box-sizing:border-box;font-family:'Roboto',sans-serif}h1{margin:20px;text-align:center}p{margin:20px;text-align:center}a{margin-top:30px}</style>
        </head>
        <body>
        <h1>Verify Your Uranin Account</h1>
        <p>You have made an account on Uranin. Please click the button below to verify your account. If you did not sign up for an account on Uranin, please let us know at reallybigbro121@gmail.com</p>
        <br />
        <a href=${url}>Verify Your Account</a>
        </body>
        </html>`
    }

    transport.sendMail(options, (err, info) => {
        if (err) console.log(err)
        else console.log('Email sent: ' + info.response)
    })
}

const sendPasswordForgotEmail = (email, username, uid) => {
    const urlStarter = process.env.NODE_ENV === "production" ? 'https://uranin.herokuapp.com/accounts/reset-password' : 'http://localhost:3000/accounts/reset-password'
    const url = `${urlStarter}/${email}/${username}/${uid}`

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const options = {
        from: 'reallybigbro121@gmail.com',
        to: email,
        subject: "Reset Your Password",
        html: `<!DOCTYPE html>
        <html lang=en>
        <head>
        <meta charset=UTF-8>
        <meta http-equiv=X-UA-Compatible content="IE=edge">
        <meta name=viewport content="width=device-width, initial-scale=1.0">
        <title>Verify Your Uranin Account</title>
        <link rel=preconnect href=https://fonts.googleapis.com>
        <link rel=preconnect href=https://fonts.gstatic.com crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel=stylesheet>
        <style>*{margin:0;padding:0;box-sizing:border-box;font-family:'Roboto',sans-serif}h1{margin:20px;text-align:center}p{margin:20px;text-align:center}a{margin-top:30px}</style>
        </head>
        <body>
        <h1>Reset Your Password</h1>
        <p>Hello, ${username}</p>
        <p>You have forgotten your password. Please click the link below to reset it. If you have not forgotten your password, please let us know at ${process.env.EMAIL_USERNAME}</p>
        <br />
        <a href="${url}">Reset Your Password</a>
        </body>
        </html>`
    }

    transport.sendMail(options, (err, info) => {
        if (err) console.log(err)
        else console.log('Email sent: ' + info.response)
    })
}

module.exports = {
    sendVerificationEmail,
    sendPasswordForgotEmail
}