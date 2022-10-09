import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { isAuthenticated } from '../components/jwtfns'

import Group from '../components/Group'
import Item from '../components/Item'
import Button from '../components/Button'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Textfield from '../components/Textfield'
import Alert from '../components/Alert'

import './css/ResetPasswordEmail.css'

const ResetPasswordEmail = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
  })

  const [email, setEmail] = useState(null)
  const [error, setError] = useState()
  const [message, setMessage] = useState()

  const sendForgotPasswordEmail = () => {
    const forgotEmailPayload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    }

    fetch('/api/auth/forgotpassword', forgotEmailPayload)
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
    <Group className={'email-container'}>
        <Item space='full'>
            <Header type={'h1'}>Reset Your Password</Header>
        </Item>
        <Item space='full'>
            <Paragraph>Put in your email so we can send you a password reset email.</Paragraph>
        </Item>
        <Alert>{error}</Alert>
        <Alert atype={'good'}>{message}</Alert>
        <Item space='full'>
            <Textfield label={'Email'} type='email' onChange={(e) => {
                if (e.target.value == "") setEmail(null)
                else setEmail(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Button style={'primary'} size='medium' onClick={sendForgotPasswordEmail}>Submit</Button>
        </Item>
    </Group>
  )
}

export default ResetPasswordEmail