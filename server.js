const express = require('express')
const cors = require('cors')

const app = express()

app.use( express.json() )
app.use(cors())

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const pool = require('./dbconnect')

const path = require('path')

require('dotenv').config()

const indexPath = path.join(__dirname, 'client/build/index.html')

const sendVerificationEmail = require('./mailer').sendVerificationEmail
const sendForgotPasswordEmail = require('./mailer').sendPasswordForgotEmail

const port = process.env.NODE_ENV === "production" ? process.env.PORT : 8000

const tokenTypes = {
    access: 'access',
    refresh: 'refresh'
}

const addRefreshToken = (token) => {
    pool.query('INSERT INTO refreshtoken (token) VALUES ($1)', [token], (err, results) => {
        if (err) throw err

        return results
    })
}

const deleteRefreshToken = (token) => {
    pool.query('DELETE FROM refreshtoken WHERE token = $1', [token], (err, results) => {
        if (err) throw err

        return results
    })
}

const decodeToken = (token, tokenType) => {
    function decodeAccessToken(err, user) {
        if (err) throw new Error(err)
        else {
            return user
        }
    }

    function decodeRefreshToken(err, user) {
        if (err) throw new Error(err)
        else {
            return user
        }
    }

    if (tokenType == tokenTypes.access) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, decodeAccessToken)

        return decoded
    } else if (tokenType === tokenTypes.refresh) {
        const decoded = jwt.verify(token, jwt.JWT_REFRESH_TOKEN_SECRET, decodeRefreshToken)

        return decoded
    }
}

const generateToken = (user, tokenType) => {
    switch (tokenType) {
        case tokenTypes.access:
            return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SECRET })
        case tokenTypes.refresh:
            return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET)
    }
}

const checkToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization']

    if (!tokenHeader) return res.status(200).send({
        'error': 'Token not found'
    })

    const token = tokenHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('jwt err: ', err)
            return res.status(200).send({
                'error': 'Unauthorized'
            })
        }

        req.user = user

        return next()
    })
}

const checkClubExist = (req, res, next) => {
    const clubId = parseInt(req.params.clubId)

    pool.query('SELECT * FROM club WHERE id = $1', [clubId], (err, results) => {
        if (err) throw err

        if (results.rows.length == 0) return res.status(400).send({
            'error': 'That club does not exist'
        })

        return next()
    })
}

app.post('/api/auth/register', async (req, res) => {
    const { name, email, username, password, age } = req.body

    if (!req.body.name) {
        return res.status(200).send({
            'error': 'Name is required'
        })
    }

    if (!req.body.email) {
        return res.status(200).send({
            'error': 'Email is required'
        })
    }

    if (!req.body.username) {
        return res.status(200).send({
            'error': 'Username is required'
        })
    }

    if (!req.body.age) {
        return res.status(200).send({
            'error': 'Age is required'
        })
    }

    if (!req.body.password) {
        return res.status(200).send({
            'error': 'Password is required'
        })
    }

    if (!req.body.passwordc) {
        return res.status(200).send({
            'error': 'Password confirm is required'
        })
    }

    if (req.body.password !== req.body.passwordc) return res.status(200).send({
        'error': 'Password and password confirm do not match'
    })

    const findUser = async (err, results) => {
        if (err) throw err

        if (results.rowCount > 0) {
            res.status(200).send({
                'error': 'That username already exists'
            })
        } else {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            pool.query('INSERT INTO "user" (name, email, username, password, age) VALUES ($1, $2, $3, $4, $5)', [
                name,
                email,
                username,
                hashedPassword,
                age
            ], async (err, results) => {
                if (err) throw err

                pool.query('SELECT * FROM "user" WHERE username = $1', [username], (err, results) => {
                    const user = { username: username }

                    const accessToken = generateToken(user, tokenTypes.access)
                    const refreshToken = generateToken(user, tokenTypes.refresh)

                    addRefreshToken(refreshToken)

                    sendVerificationEmail(results.rows[0].email, accessToken, refreshToken, results.rows[0].uid)

                    res.status(200).send({
                        'accessToken': accessToken,
                        'refreshToken': refreshToken
                    })
                })
            })
        }
    }

    pool.query('SELECT username FROM "user" WHERE username = $1', [req.body.username], findUser)
})



app.post('/api/auth/login', async (req, res) => {
    const { password } = req.body

    if (!req.body.username) {
        return res.status(200).send({
            'error': "Username is required"
        })
    }

    if (!req.body.password) {
        return res.status(200).send({
            'error': "Password is required"
        })
    }

    if (req.body.username && req.body.email) {
        return res.status(200).send({
            'error': "You cannot put both username and email"
        })
    }

    if (req.body.username) {
        const username = req.body.username

        pool.query('SELECT * FROM "user" WHERE username = $1', [username], async (err, results) => {
            if (err) throw err

            if (results.rows.length === 0) {
                return res.status(200).send({
                    'error': "Username or password was incorrect"
                })
            }

            const compare = await bcrypt.compare(password, results.rows[0].password)

            if (compare) {
                const accessToken = generateToken({ username: username }, tokenTypes.access)
                const refreshToken = generateToken({ username: username }, tokenTypes.refresh)

                addRefreshToken(refreshToken)

                res.status(200).send({
                    'accessToken': accessToken,
                    'refreshToken': refreshToken
                })
            } else {
                res.status(200).send({
                    'error': "Username or password was incorrect"
                })
            }
        })
    }
})

app.post('/api/auth/refresh', (req, res) => {
    const { rtoken } = req.body

    if (!rtoken) {
        return res.status(200).send({
            'error': "Please send token to refresh token"
        })
    }

    jwt.verify(rtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(200).send({
            'error': 'Unauthorized'
        })

        pool.query('SELECT token FROM refreshtoken WHERE token = $1', [rtoken], (err, results) => {
            if (err) throw err
    
            if (results.rowCount == 0) { return res.status(200).send({
                'error': 'Invalid refresh token'
            }) } else {
                const accessToken = generateToken({ username: user.username }, tokenTypes.access)

                return res.status(200).send({
                    'newAccessToken': accessToken
                })
            }
        })
    })
})

app.patch('/api/auth/update/', checkToken, (req, res) => {
    if (!req.body.username) {
        return res.status(200).send({
            'error': 'Username is required'
        })
    }

    if (!req.body.name) {
        return res.status(200).send({
            'error': 'Name is required'
        })
    }

    if (!req.body.age) {
        return res.status(200).send({
            'error': 'Age is required'
        })
    }

    if (req.body.password) {
        return res.status(200).send({
            'error': 'Change password is not here'
        })
    }

    if (!req.body.email) {
        return res.status(200).send({
            'error': 'Email is required'
        })
    }

    const { email, name, username, age } = req.body

    const accessToken = generateToken({ username: username }, tokenTypes.access)
    const refreshToken = generateToken({ username: username }, tokenTypes.refresh)

    pool.query('SELECT * FROM "user" WHERE username = $1', [req.user.username], (err, results) => {
        if (err) throw err

        if (results.rows[0].email !== email) {
            pool.query('UPDATE "user" SET verified = FALSE WHERE username = $1', [req.user.username], (errt, resultst) => {
                if (errt) throw errt

                sendVerificationEmail(email, accessToken, refreshToken, results.rows[0].uid)
            })
        }
    })

    pool.query('SELECT * FROM "user" WHERE email = $1', [email], (errt, resultst) => {
        if (errt) throw errt

        if (resultst.rows.length > 0) return res.status(200).send({
            'error': 'That username already exists'
        })

        pool.query('UPDATE "user" SET name = $1, email = $2, age = $3, username = $4 WHERE username = $5', [name, email, age, username, req.user.username], (err, results) => {
            if (err) throw err
    
            addRefreshToken(refreshToken)
    
            return res.status(200).send({
                'message': "User updated successfully!",
                'accessToken': accessToken,
                'refreshToken': refreshToken
            })
        })
    })
})

app.patch('/api/auth/update/password', checkToken, async (req, res) => {
    const { oldPassword, newPassword, newPasswordC } = req.body

    if (!oldPassword) {
        return res.status(200).send({
            'error': 'Old password is required'
        })
    }

    if (!newPassword) {
        return res.status(200).send({
            'error': 'New password is required'
        })
    }

    if (!newPasswordC) {
        return res.status(200).send({
            'error': 'New password confirm is required'
        })
    }

    if (newPassword !== newPasswordC) {
        return res.status(200).send({
            'error': 'New password and new password confirm do not match'
        })
    }

    pool.query('SELECT password FROM "user" WHERE username = $1', [req.user.username], async (err, results) => {
        if (err) throw err

        const password = results.rows[0].password

        const compare = await bcrypt.compare(oldPassword, password)

        if (!compare) { return res.status(200).send({
            'error': "Old password is incorrect"
        }) } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            pool.query('UPDATE "user" SET password = $1 WHERE username = $2', [hashedPassword, req.user.username], (err, results) => {
                if (err) throw err

                return res.status(200).send({
                    'message': "Pasword updated successfully!"
                })
            })
        }
    })
})

app.get('/api/auth/user/profile', checkToken, (req, res) => {
    pool.query('SELECT * FROM "user" WHERE username = $1', [req.user.username], (err, results) => {
        if (err) throw err
        res.json(results.rows[0] ?? {
            'error': "Something went wrong"
        })
    })
})

app.delete('/api/auth/logout', (req, res) => {
    const { rtoken } = req.body

    if (!rtoken) {
        return res.status(200).send({
            'error': "No refresh token"
        })
    }

    jwt.verify(rtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(200).send({
                'error': "Invalid refresh token"
            })
        }

        deleteRefreshToken(rtoken)

        return res.status(200).send({
            'message': "Successfully logged out!"
        })
    })
})

app.delete('/api/auth/user/delete', (req, res) => {
    const { rtoken } = req.body

    if (!rtoken) return res.status(200).send({
        'error': 'No refresh token was provided'
    })

    jwt.verify(rtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) { res.status(200).send({
            'error': 'Invalid refresh token'
        }) } else {
            deleteRefreshToken(rtoken)

            pool.query('DELETE FROM "user" WHERE username = $1', [user.username], (err, results) => {
                if (err) throw err

                return res.status(200).send({
                    'message': 'User deleted successfully!'
                })
            })
        }
    })
})

app.patch('/api/auth/verify', checkToken, (req, res) => {
    const { uid } = req.body

    if (!uid) return res.status(200).send({
        'error': 'No uid provided'
    })

    pool.query('SELECT * FROM "user" WHERE username = $1', [req.user.username], (err, results) => {
        if (err) throw err

        if (results.rows[0].username !== req.user.username) return res.status(200).send({
            'error': 'Incorrect or invalid access token provided'
        })

        if (results.rows[0].uid !== uid) return res.status(200).send({
            'error': 'Incorrect or invalid uid provided'
        })

        pool.query('SELECT * FROM "user" WHERE uid = $1', [uid], (err, resultsu) => {
            if (err) throw err

            if (resultsu.rows.length < 1) return res.status(200).send({
                'error': "Incorrect or invalid uid"
            })

            if (results.rows[0].username !== resultsu.rows[0].username) return res.status(200).send({
                'error': "Incorrect or invalid username"
            })
        })

        pool.query('UPDATE "user" SET verified = TRUE WHERE uid = $1', [uid], (err, results) => {
            if (err) throw err

            return res.status(200).send({
                'message': 'User was updated successfully!'
            })

        })
    })
})

app.post('/api/auth/resend-verify', (req, res) => {
    const { email } = req.body

    if (!email) return res.status(200).send({
        'error': 'Email is required'
    })

    pool.query('SELECT * FROM "user" WHERE email = $1', [email], (err, results) => {
        if (err) throw err

        const accessToken = generateToken({ username: results.rows[0].username }, tokenTypes.access)
        const refreshToken = generateToken({ username: results.rows[0].username }, tokenTypes.refresh)

        sendVerificationEmail(email, accessToken, refreshToken, results.rows[0].uid)

        return res.status(200).send({
            'message': 'Email resent successfully!'
        })
    })
})

app.get('/api/auth/user/profile/:username', (req, res) => {
    const username = req.params.username

    if (!username) return res.status(200).send({
        'error': 'No username provided'
    })

    pool.query('SELECT * FROM "user" WHERE username = $1', [username], (err, results) => {
        if (err) throw err

        res.status(200).send(results.rows[0])
    })
})

app.post('/api/auth/forgotpassword', (req, res) => {
    const { email } = req.body

    if (!email) return res.status(200).send({
        'error': 'No email to send forgot password email'
    })

    pool.query('SELECT * FROM "user" WHERE email = $1', [email], (err, results) => {
        if (err) throw err

        if (results.rows.length < 1) return res.status(200).send({
            'error': 'That email does not exist'
        })

        sendForgotPasswordEmail(email, results.rows[0].username, results.rows[0].uid)

        return res.status(200).send({
            'message': 'Email sent successfully!'
        })
    })
})

app.patch('/api/auth/update/forgot-password', async (req, res) => {
    const { username, email, uid, password, passwordc } = req.body

    if (!username) return res.status(200).send({
        'error': 'Username is required'
    })

    if (!email) return res.status(200).send({
        'error': 'Email is required'
    })

    if (!uid) return res.status(200).send({
        'error': 'Uid is required'
    })

    if (!password) return res.status(200).send({
        'error': 'Password is required'
    })

    if (!passwordc) return res.status(200).send({
        'error': 'Password confirm is required'
    })

    if (password !== passwordc) return res.status(200).send({
        'error': 'Password and password confirm do not match'
    })

    pool.query('SELECT * FROM "user" WHERE uid = $1', [uid], (err, results) => {
        if (err) throw err

        if (results.rows[0].username !== username) return res.status(200).send({
            'error': 'Incorrect or invalid username'
        })

        pool.query('SELECT * FROM "user" WHERE username = $1', [username], async (err, results) => {
            if (err) throw err

            if (results.rows[0].uid !== uid) return res.status(200).send({
                'error': 'Incorrect or invalid uid'
            })

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            pool.query('UPDATE "user" SET password = $1 WHERE username = $2', [hashedPassword, username], (err, results) => {
                if (err) throw err

                return res.status(200).send({
                    'message': 'Password changed successfully! Now you can log in!'
                })
            })
        })
    })
})

app.get('/api/clubs/all', (req, res) => {
    pool.query('SELECT * FROM club', (err, results) => {
        if (err) throw err

        return res.status(200).send(results.rows)
    })
})

app.post('/api/clubs/create', checkToken, (req, res) => {
    const { title, description, priceToJoin } = req.body

    if (!title) return res.status(400).send({
        'error': 'Title is required'
    })

    if (!description) return res.status(400).send({
        'error': 'Description is required'
    })

    if (!priceToJoin) return res.status(400).send({
        'error': 'Price to join is required'
    })

    const priceSplitTest = priceToJoin.split('.')

    if (priceSplitTest.length > 1) return res.status(400).send({
        'error': 'Price to join must be a whole number'
    })

    const priceToJoinReal = parseInt(priceToJoin)

    pool.query('INSERT INTO club (title, description, price_to_join, members, leader) VALUES ($1, $2, $3, $4, $5)', [title, description, priceToJoinReal, [], req.user.username], (err, results) => {
        if (err) throw err

        return res.status(200).send({
            'message': "Club created successfully!"
        })
    })
})

app.patch('/api/clubs/:clubId/addmember', (req, res) => {
    const clubId = parseInt(req.params.clubId)

    const { memberUsername } = req.body

    if (!memberUsername) return res.status(400).send({
        'error': 'Member username is required'
    })

    pool.query('SELECT * FROM "user" WHERE username = $1', [memberUsername], (err, results) => {
        if (err) throw err

        if (results.rows.length == 0) return res.status(400).send({
            'error': 'That member does not exist'
        })

        pool.query('SELECT * FROM club WHERE id = $1', [clubId], (errt, resultst) => {
            if (errt) throw errt

            if (resultst.rows.length == 0) return res.status(400).send({
                'error': 'That club does not exist'
            })

            console.log(resultst.rows[0].members.length)

            for (var i = 0; i < resultst.rows[0].members.length; i++) {
                const members = resultst.rows[0].members

                if (members[i] == memberUsername) return res.status(400).send({
                    'error': 'That member is already part of the club'
                })
            }

            pool.query('UPDATE club SET members = array_append($1, $2) WHERE id = $3', [resultst.rows.members, memberUsername, clubId], (errth, resultsth) => {
                if (errth) throw errth

                return res.status(200).send({
                    'message': 'Member added successfully!'
                })
            })
        })
    })
})

app.patch('/api/clubs/:clubId/update', checkClubExist, (req, res) => {
    const { title, description, priceToJoin } = req.body
    const clubId = parseInt(req.params.clubId)

    if (!title) return res.status(400).send({
        'error': 'Title is required'
    })

    if (!description) return res.status(400).send({
        'error': 'Description is required'
    })

    if (!priceToJoin) return res.status(400).send({
        'error': 'Price to join is required'
    })

    const priceSplitTest = priceToJoin.split('.')

    if (priceSplitTest.length > 1) return res.status(400).send({
        'error': 'Price to join must be a whole number'
    })

    const priceToJoinReal = parseInt(priceToJoin)

    pool.query('UPDATE club SET title = $1, description = $2, price_to_join = $3 WHERE id = $4', [title, description, priceToJoinReal, clubId], (err, results) => {
        if (err) throw err

        return res.status(200).send({
            'message': 'Club updated successfully!'
        })
    })
})

app.delete('/api/clubs/:clubId/delete', checkClubExist, (req, res) => {
    const clubId = parseInt(req.params.clubId)

    pool.query('DELETE FROM club WHERE id = $1', [clubId], (err, results) => {
        if (err) throw err

        return res.status(200).send({
            'message': 'Club deleted successfully!'
        })
    })
})

app.delete('/api/clubs/all/delete', (req, res) => {
    pool.query('DELETE FROM club', (err, results) => {
        if (err) throw err

        return res.status(200).send({
            'message': "All clubs deleted successfully!"
        })
    })
})

app.delete('/api/clubs/all/:leader/delete', (req, res) => {
    const leader = req.params.leader

    pool.query('SELECT * FROM club WHERE leader = $1', [leader], (err, results) => {
        if (err) throw err

        if (results.rows.length == 0) return res.status(400).send({
            'error': "That leader does not exist or does not have a club"
        })

        pool.query('DELETE FROM club WHERE leader = $1', [leader], (errt, resultst) => {
            if (errt) throw errt

            return res.status(200).send({
                'message': 'All clubs deleted successfully!'
            })
        })
    })
})

if (process.env.NODE_ENV == "production") {
    app.use( express.static( path.join(__dirname, 'client/build')) )
    
    app.get('*', (req, res) => {
        console.log('404 Not Found')
        
        res.sendFile(indexPath)
    })
}

app.listen(port, (err) => {
    if (err) console.log(`error: ${err}`)
    console.log(`Server is listening on port ${port}`)
})