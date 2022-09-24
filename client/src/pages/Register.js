import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import Group from '../components/Group'
import Item from '../components/Item'
import Button from '../components/Button'
import Textfield from '../components/Textfield'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Alert from '../components/Alert'

import { isAuthenticated } from '../components/jwtfns'

import './css/Register.css'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [username, setUsername] = useState(null)
  const [age, setAge] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordc, setPasswordC] = useState(null)
  const [error, setError] = useState()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
    else {
        localStorage.clear()
        document.title = 'Register | Uranin'
    }
  })
  
  const register = () => {
    if (email.split('@').length !== 2) setError('That email is invalid')
    else {
        const registerPayload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                username: username,
                age: age,
                password: password,
                passwordc: passwordc
            })
        }
    
        fetch('/api/auth/register', registerPayload)
        .then(res => res.json())
        .then(data => {
            if (data.error) setError(data.error)
            else {
                const atl = localStorage.getItem("atoken")
                const rtl = localStorage.getItem("rtoken")
    
                if (atl || rtl) throw new Error('User already logged in')
                else {
                    localStorage.setItem("atoken", data.accessToken)
                    localStorage.setItem("rtoken", data.refreshToken)
    
                    window.location = '/'
                }
            }
        })
    }
  }

  return (
    <Group className={'register-container'}>
        <Alert atype={'error'}>{error}</Alert>
        <Item className={'center'} space='full'>
            <Header type={'h1'}>Register</Header>
        </Item>
        <Group className={'flex-area'}>
        <Group className={'second-half'}>
            <Item space={'full'}>
                <Textfield label={'Name'} type='text' required onChange={(e) => {
                    if (e.target.value === "") setName(null)
                    else setName(e.target.value)
                }} />
            </Item>
            <Item space={'full'}>
                <Textfield label={'Email'} type='email' required onChange={(e) => {
                    if (e.target.value === "") setEmail(null)
                    else setEmail(e.target.value)
                }} />
            </Item>
            <Item space={'full'}>
                <Textfield label={'Username'} type='text' required onChange={(e) => {
                    if (e.target.value === "") setUsername(null)
                    else setUsername(e.target.value)
                }} />
            </Item>
        </Group>
        <Group className={'third-half'}>
            <Item space={'full'}>
                <Textfield label={'Age'} type='number' required onChange={(e) => {
                    if (e.target.value === "") setAge(null)
                    else setAge(e.target.value)
                }} />
            </Item>
            <Item space={'full'}>
                <Textfield label={'Password'} type='Password' required onChange={(e) => {
                    if (e.target.value === "") setPassword(null)
                    else setPassword(e.target.value)
                }} />
            </Item>
            <Item space={'full'}>
                <Textfield label={'Password Confirm'} type='Password' required onChange={(e) => {
                    if (e.target.value === "") setPasswordC(null)
                    else setPasswordC(e.target.value)
                }} />
            </Item>
        </Group>
        </Group>
        <Item space={'full'}>
            <Button size={'medium'} style='primary' onClick={register}>Register</Button>
        </Item>
        <Item space={'full'}>
            <Paragraph>Already have an account? Login <Link to='/accounts/login'>here</Link>.</Paragraph>
        </Item>
    </Group>
  )
}

export default Register