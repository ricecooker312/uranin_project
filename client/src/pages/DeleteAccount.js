import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import Group from '../components/Group'
import Item from '../components/Item'
import Header from '../components/Header'
import Button from '../components/Button'
import Alert from '../components/Alert'

import { isAuthenticated } from '../components/jwtfns'

const DeleteAccount = () => {
  const navigate = useNavigate()

  const [error, setError] = useState()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/')
  })

  const deleteAccount = () => {
    const rtl = localStorage.getItem('rtoken')

    const deletePayload = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            rtoken: rtl
        })
    }

    fetch('/api/auth/user/delete', deletePayload)
    .then(res => res.json())
    .then(data => {
        if (data.error) setError(data.error)
        else {
            localStorage.clear()
            localStorage.removeItem("atoken")
            
            window.location.reload()
        }
    })
  }

  return (
    <Group>
        <Item space={'full'}>
            <Alert>{error}</Alert>
        </Item>
        <Item space={'full'}>
            <Header className={'center'} type={'h1'}>Are you sure?</Header>
        </Item>
        <Item>
            <Button style={'danger'} size='medium' block onClick={deleteAccount}>Yes</Button>
            <Button style={'primary'} size='medium' block onClick={() => navigate('/')}>No</Button>
        </Item>
    </Group>
  )
}

export default DeleteAccount