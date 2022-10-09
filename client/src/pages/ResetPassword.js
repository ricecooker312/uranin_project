import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

import { isAuthenticated } from '../components/jwtfns'

import Item from '../components/Item'
import Group from '../components/Group'
import Alert from '../components/Alert'
import Textfield from '../components/Textfield'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'

import './css/ResetPassword.css'

const ResetPassword = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
  })

  const [password, setPassword] = useState()
  const [passwordC, setPasswordC] = useState()
  const [message, setMessage] = useState()
  const [error, setError] = useState()

  const { email, username, uid } = useParams()

  const resetPassword = () => {
    const passwordResetPayload = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            uid: uid,
            password: password,
            passwordc: passwordC
        })
    }

    fetch('/api/auth/update/forgot-password', passwordResetPayload)
    .then(res => res.json())
    .then(json => {
        if (json.message) {
            setError(null)
            setMessage(json.message)
        } else if (json.error) {
            setMessage(null)
            setError(json.error)
        }
    })
  }

  return (
    <Group className={'resetpassword-container'}>
        <Item space={'full'}>
            <Header type={'h1'}>Reset Your Password</Header>
        </Item>
        <Item space={'full'}>
            <Paragraph>Make your new password here</Paragraph>
        </Item>
        <Alert>{error}</Alert>
        <Alert atype={'good'}>{message}</Alert>
        <Item space={'full'}>
            <Textfield label='Password' type='password' onChange={(e) => {
                if (e.target.value === "") setPassword(null)
                else setPassword(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Textfield label='Password Confirm' type='password' onChange={(e) => {
                if (e.target.value === "") setPasswordC(null)
                else setPasswordC(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Button style={'primary'} size='medium' onClick={resetPassword}>Change Password</Button>
        </Item>
    </Group>
  )
}

export default ResetPassword