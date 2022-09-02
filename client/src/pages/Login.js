import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import Textfield from '../components/Textfield'
import Button from '../components/Button'
import Header from '../components/Header'
import Item from '../components/Item'
import Group from '../components/Group'
import Paragraph from '../components/Paragraph'

import { isAuthenticated } from '../components/jwtfns'

import './css/Login.css'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
    else localStorage.clear()
  }, [])

  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)

  const login = () => {
    const loginPayload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }

  fetch('/api/auth/login', loginPayload)
  .then(res => res.json())
  .then(data => {
    if (data.error) setError(data.error)
    else {
      const atl = localStorage.getItem("atoken")
      const rtl = localStorage.getItem("rtoken")

      if (atl) throw new Error('User already logged in')
      if (rtl) throw new Error('User already logged in')

      localStorage.setItem("atoken", data.accessToken)
      localStorage.setItem("rtoken", data.refreshToken)

      window.location = '/'
    }
  })
}

  return (
    <Group className={'login-container'}>
        {error ? (
          <Item className={'alert'} space={'full'}>
            <Paragraph className='alert-error'>{error}</Paragraph>
          </Item>
        ) : (
          <Item></Item>
        )}
        <Item space={'full'}>
            <Header type={'h1'}>Log In</Header>
        </Item>
        <Item space={'full'}>
            <Textfield label='Username' type='text' onChange={(e) => {
              if (e.target.value == "") setUsername(null)
              else setUsername(e.target.value)
            }} />
        </Item> 
        <Item space={'full'}>
          <Textfield label={'Password'} type='password' onChange={(e) => {
            if (e.target.value == "") setPassword(null)
            else setPassword(e.target.value)
          }} />
        </Item>
        <Item space={'full'}>
          <Button className='login-button' style={'primary'} size='medium' onClick={login}>Login</Button>
        </Item>
        <Item space={'full'}>
            <Paragraph>Don't have an account? Register <Link to='/accounts/register'>here</Link>.</Paragraph>
        </Item>
    </Group>
  )
}

export default Login