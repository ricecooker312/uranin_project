import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { isAuthenticated, refreshToken } from '../components/jwtfns'

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
  const [username, setUsername] = useState()
  const [name, setName] = useState()
  const [age, setAge] = useState()
  const [email, setEmail] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    if (!isAuthenticated()) {
        localStorage.clear()
        navigate('/')
    }
    else {
        document.title = 'Your Profile | Club Manager'

        const rtl = localStorage.getItem("rtoken")
        const atl = refreshToken(rtl)

        const profilePayload = {
            headers: {
                'Authorization': `Bearer ${atl}`
            }
        }

        fetch('/api/auth/user/profile', profilePayload)
        .then(res => res.json())
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
            if (data.error) setError(data.error)
            else {
                console.log(data)
                navigate('/')
            }
        })
    }
  }

  if (user === null) return (
    <div>Loading...</div>
  ) 
  else return (
    <Group className={'login-container'}>
        <Alert>{error}</Alert>
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
        <Button style={'primary'} size={'medium'} onClick={updateProfile}>Save Changes</Button>
    </Group>
  )
}

export default Profile