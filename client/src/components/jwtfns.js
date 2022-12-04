export const isAuthenticated = () => {
    const atl = localStorage.getItem("atoken")
    const rtl = localStorage.getItem("rtoken")

    if (atl && rtl) return true
    else return false
}

export const refreshToken = (token) => {
    const refreshPayload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            rtoken: token
        })
    }

    fetch('/api/auth/refresh', refreshPayload)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("rtoken", token)
        localStorage.setItem("atoken", data.newAccessToken)
    })
    .catch((err) => {
        console.log('Refresh token error: ', err)
    })

    return localStorage.getItem("atoken")
}

export const replaceRefreshToken = (oldToken, newToken) => {
    const deletePayload = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rtoken: oldToken
        })
    }

    fetch('/api/auth/logout', deletePayload)
    .then(res => res.json())
    .then(data => {
        if (data.error) throw new Error(data.error)
        else {
            localStorage.setItem("rtoken", newToken)
        }
    })

    return localStorage.getItem("rtoken")
}

export const checkVerified = (rtoken) => {
    const atl = refreshToken(rtoken)

    const profilePayload = {
        headers: {
            'Authorization': `Bearer ${atl}`,
            'Content-Type': 'application/json'
        }
    }

    fetch('/api/auth/user/profile', profilePayload)
    .then(res => res.json())
    .then(json => {
        if (json.verified === false) localStorage.setItem("verified", false)
        else if (json.verified === true) localStorage.setItem("verified", true)
    })

    return localStorage.getItem("verified")
}