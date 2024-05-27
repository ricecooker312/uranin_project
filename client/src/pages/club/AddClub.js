import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { refreshToken } from '../../components/jwtfns'

import '../css/AddClub.css'

import Alert from '../../components/Alert'
import Item from '../../components/Item'
import Group from '../../components/Group'
import Header from '../../components/Header'
import Textfield from '../../components/Textfield'
import Button from '../../components/Button'

const AddClub = () => {
  const [verified, setVerified] = useState(null)
  const [email, setEmail] = useState(null)
  const [name, setName] = useState(null)
  const [desc, setDesc] = useState(null)
  const [price, setPrice] = useState(null)
  const [id, setId] = useState(null)

  useEffect(() => {
    const rtl = localStorage.getItem("rtoken")
    const atl = refreshToken(rtl)

    const profilePayload = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${atl}`
      }
    }

    fetch('/api/auth/user/profile', profilePayload)
    .then(res => res.json())
    .then(json => {
      setEmail(json.email)

      if (json.verified == true) setVerified(true)
      else if (json.verified == false) setVerified(false)
    })
  })

  const resendVerificationEmail = () => {
    const resendEmailPayload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    }

    fetch('/api/auth/resend-verify', resendEmailPayload)
    .then(res => res.json())
    .then(json => {
      if (json.error) console.log(json.error)
      else if (json.message) console.log(json.message)
    })
  }

  const addClub = () => {
    const rtl = localStorage.getItem("rtoken")
    const atl = refreshToken(rtl)

    const profilePayload = {
      headers: {
        'Authorization': `Bearer ${atl}`
      }
    }

    fetch('/api/auth/user/profile', profilePayload)
    .then(res => res.json())
    .then(json => {
      console.log(json)
      setId(json.id)
    })

    const clubPayload = {
      method: 'POST',
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     },
     body: JSON.stringify({
      title: name,
      descripton: desc,
      priceToJoin: price
     })
    }

    setTimeout(() => {}, )

    fetch(`/api/clubs/create/${id}`, clubPayload)
    .then(res => res.json())
    .then(json => console.log(json))
  }

  if (verified == null) return (
    <Item>
      Loading...
    </Item>
  )

  if (verified == false) return (
    <Item className={'center alert-container'}>
      <Alert closable atype={'warning'}>Your email must be verified to perform this action. <Link style={{
        color: 'black'
      }} to='/' onClick={resendVerificationEmail}>Resend email</Link></Alert>
    </Item>
  )

  if (verified === true) return (
    <Group className={'form-container'}>
      <Item space={'full'}>
        <Header type='h1'>Add Club</Header>
      </Item>
      <Item space={'full'}>
        <Textfield className={'form-field'} type='text' label='Club Name' onChange={(e) => {
          if (e.target.value == "") setName(null)
          else setName(e.target.value) 
        }} />
      </Item>
      <Item space={'full'}>
        <Textfield className={'form-field'} type='text' label='Club Description' multirow rows={8} style={{
          resize: 'none'
        }} onChange={(e) => {
          if (e.target.value == "") setDesc(null)
          else setDesc(e.target.value) 
        }} />
      </Item>
      <Item space={'full'}>
        <Textfield className={'form-field'} type='number' label={'Price to join'} onChange={(e) => {
          if (e.target.value == "") setPrice(null)
          else setPrice(e.target.value) 
        }} />
      </Item>
      <Item space={'full'}>
        <Button style={'primary'} size='medium' onClick={addClub}>Create Club</Button>
      </Item>
    </Group>
  )
}

export default AddClub