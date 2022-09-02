import { useNavigate } from "react-router"

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
        localStorage.setItem("atoken", data.newAccessToken)
    })

    return localStorage.getItem("atoken")
}

export const addUserToStorage = () => {
    const refresh = localStorage.getItem("rtoken")

    refreshToken(refresh)

    const token = localStorage.getItem("atoken")

    const userPayload = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    fetch('/api/auth/user/profile', userPayload)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("name", data.name)
        localStorage.setItem("email", data.email)
        localStorage.setItem("age", data.age)
        localStorage.setItem("username", data.username)
    })
}

export const logoutUser = () => {
    const rtoken = localStorage.getItem("rtoken")

    refreshToken(rtoken)

    const atoken = localStorage.getItem("atoken")

    localStorage.clear()

    const logoutPayload = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${atoken}`
        },
        body: JSON.stringify({
            rtoken: rtoken
        })
    }

    fetch('/api/auth/logout', logoutPayload)
    .then(res => res.json())
    .then(data => {
        if (data.error) throw new Error(data.error)
        useNavigate('/accounts/login')
    })
}