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
        localStorage.clear()
        localStorage.setItem("rtoken", token)
        localStorage.setItem("atoken", data.newAccessToken)
    })
    .catch((err) => {
        console.log('Refresh token error: ', err)
    })

    return localStorage.getItem("atoken")
}