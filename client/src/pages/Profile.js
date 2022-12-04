import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { isAuthenticated, refreshToken, replaceRefreshToken } from '../components/jwtfns'

import Group from '../components/Group'
import Item from '../components/Item'
import Header from '../components/Header'
import Button from '../components/Button'
import Textfield from '../components/Textfield'
import Alert from '../components/Alert'

import './css/Profile.css'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [name, setName] = useState(null)
  const [age, setAge] = useState(null)
  const [email, setEmail] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState()

  useEffect(() => {
    if (!isAuthenticated()) {
        localStorage.clear()
        navigate('/')
    }
    else {
        document.title = 'Your Profile | Uranin'

        const rtl = localStorage.getItem("rtoken")
        const atl = refreshToken(rtl)

        const profilePayload = {
            headers: {
                'Authorization': `Bearer ${atl}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        fetch('/api/auth/user/profile', profilePayload)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if (data.error) throw new Error(data.error)
            else {
                setUser('setted')
                setUsername(data.username)
                setName(data.name)
                setAge(data.age)
                setEmail(data.email)
            }
        })
        .catch((err) => {
            console.log('An error occured while getting your info: ', err)
        })
    }
  }, [])

  const updateProfile = () => {
    if (email.split('@').length !== 2) setError('That email is invalid')
    else {

        const rtl = localStorage.getItem("rtoken")
        const atl = refreshToken(rtl)

        const profileChangePayload = {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${atl}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                name: name,
                age: age,
                email: email
            })
        }

        fetch('/api/auth/update', profileChangePayload)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                setMessage(undefined)
                setError(data.error)
            }
            else if (data.message) {
                localStorage.setItem("rtoken", data.refreshToken)
                localStorage.setItem("atoken", data.accessToken)
                setError(undefined)
                setMessage(data.message)
            }
        })
        .catch((err) => {
            console.log('An error occured while updating your info: ', err)
        })
    }
  }

  if (user === null) return (
    <div>Loading...</div>
  ) 
  else return (
    <Group className={'login-container'}>
        <Alert>{error}</Alert>
        <Alert atype={'good'}>{message}</Alert>
        <Item space={'full'}>
            <Header type={'h1'}>Your Profile</Header>
        </Item>
        <Item space={'full'}>
            <Textfield className='profile-field' label={'Username'} type={'text'} defaultValue={username} onChange={(e) => {
                if (e.target.value === "") setUsername(null)
                else setUsername(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Textfield className='profile-field' label={'Name'} type={'text'} defaultValue={name} onChange={(e) => {
                if (e.target.value === "") setName(null)
                else setName(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Textfield className='profile-field' label={'Age'} type={'number'} defaultValue={age} onChange={(e) => {
                if (e.target.value === "") setAge(null)
                else setAge(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Textfield className='profile-field' label={'Email'} type={'text'} defaultValue={email} onChange={(e) => {
                if (e.target.value === "") setEmail(null)
                else setEmail(e.target.value)
            }} />
        </Item>
        <Item space={'full'}>
            <Button style={'primary'} size={'medium'} onClick={updateProfile}>Save Changes</Button>
        </Item>
    </Group>
  )
}

export default Profile