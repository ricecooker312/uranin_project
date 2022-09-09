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

if (process.env.NODE_ENV == "production") {
    app.use( express.static( path.join(__dirname, 'client/build')) )
}

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
        if (err) return res.status(200).send({
            'error': 'Unauthorized'
        })

        req.user = user

        next()
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

                const user = { name: name, email: email, age: age, username: username }

                const accessToken = generateToken(user, tokenTypes.access)
                const refreshToken = generateToken(user, tokenTypes.refresh)

                addRefreshToken(refreshToken)

                res.status(200).send({
                    'accessToken': accessToken,
                    'refreshToken': refreshToken
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

    pool.query('UPDATE "user" SET name = $1, email = $2, age = $3, username = $4 WHERE username = $5', [name, email, age, username, req.user.username], (err, results) => {
        if (err) throw err

        return res.status(200).send({
            'message': "User updated successfully!"
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
        res.json(results.rows[0])
    })
})

app.delete('/api/auth/logout', checkToken, (req, res) => {
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

app.get('*', (req, res) => {
    res.sendFile(indexPath)
})

app.listen(port, (err) => {
    if (err) console.log(`ERROR: ${err}`)
    console.log(`Server is listening on port ${port}`)
})