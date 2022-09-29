import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { isAuthenticated, refreshToken } from '../components/jwtfns'

const VerifyEmail = () => {
  const navigate = useNavigate()

  const { uid, rtoken } = useParams()

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) navigate('/')
    else {
      if (localStorage.getItem("rtoken") === rtoken) {
        const atl = refreshToken(rtoken)

        const verifyEmailPayload = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${atl}`
          },
          body: JSON.stringify({
            uid: uid
          })
        }

        fetch('/api/auth/verify', verifyEmailPayload)
        .then(res => res.json())
        .then(json => {
          if (json.error) console.log('Error: ' + json.error)
          else setVerified(true)
        })
      } else {
        console.log('Error: Invalid or incorrect refresh token')
      }
    }
  })

  if (!verified) return (
    <div>Verifying...</div>
  )
  else if (verified) return (
    <div>
      <div>Your email has been verified!</div>
      <a href='/' onClick={() => { navigate('/') }}>Go home</a>
    </div>
  )
}

export default VerifyEmail