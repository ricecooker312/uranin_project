import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { isAuthenticated, refreshToken } from '../components/jwtfns'

import Textfield from '../components/Textfield'
import Header from '../components/Header'
import Button from '../components/Button'
import Group from '../components/Group'
import Item from '../components/Item'
import Paragraph from '../components/Paragraph'

import './css/ChangePassword.css'

const ChangePassword = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/')
  })

  const [oldPassword, setOldPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [newPasswordC, setNewPasswordC] = useState(null)
  const [error, setError] = useState()

  const changePassword = () => {
    const rtl = localStorage.getItem("rtoken")
    const atl = refreshToken(rtl)

    const changePayload = {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${atl}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
            newPasswordC: newPasswordC
        })
    }

    fetch('/api/auth/update/password', changePayload)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.log(data.error)
            setError(data.error)
        } else navigate('/')
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
            <Header type={'h1'}>Change Your Password</Header>
        </Item>
        <Item space={'full'}>
            <Textfield type={'password'} onChange={(e) => {
                if (e.target.value === "") setOldPassword(null)
                else setOldPassword(e.target.value) 
            }} label={'Old Password'} required />
        </Item>
        <Item space={'full'}>
            <Textfield type={'password'} onChange={(e) => {
                if (e.target.value === "") setNewPassword(null)
                else setNewPassword(e.target.value)
            }} label={'New Password'} required />
        </Item>
        <Item space={'full'}>
            <Textfield type={'password'} onChange={(e) => {
                if (e.target.value === "") setNewPasswordC(null)
                else setNewPasswordC(e.target.value) 
            }} label={'New Password Confirm'} required />
        </Item>
        <Item space={'full'}>
            <Button style={'primary'} onClick={changePassword}>Change Password</Button>
        </Item>
    </Group>
  )
}

export default ChangePassword