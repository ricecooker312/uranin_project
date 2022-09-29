import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import { isAuthenticated, checkVerified, refreshToken } from '../components/jwtfns'

import Group from '../components/Group'
import Item from '../components/Item'
import Button from '../components/Button'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'

const Home = () => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState()

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.clear()
      setAuthenticated(false)
    }
    else {
      setUser('logged in')
      setAuthenticated(true)

      const rtl = localStorage.getItem("rtoken")
      const atl = refreshToken(rtl)

      const profilePayload = {
        headers: {
          'Authorization': `Bearer ${atl}`,
          'Content-Type': 'application/json'
        }
      }

      fetch('/api/auth/user/profile', profilePayload)
      .then(res => res.json())
      .then(json => {
        if (json.verified === false) {
          setVerified(false)
          setEmail(json.email)
        } else if (json.verified === true) {
          setVerified(true)
          setEmail(json.email)
        }
      })
    }
  }, [])

  if (authenticated) {
    if (user !== null) return (
      <Group>
        {verified ? (
          <Item className={'center'}>
            <Paragraph>Your email {email} has been verified</Paragraph>
          </Item>
        ) : (
          <Item className={'center'}>
            <Paragraph>We have a sent a verification email to {email}. Please check your inbox.</Paragraph>
          </Item>
        )}
        <Item className={'center'}>
          <Header type={'h1'}>You have no clubs</Header>
        </Item>
      </Group>
    )
  
    else return (
      <Item>Loading...</Item>
    )
  } else {
    return (
      <Group>
        <Item className={'center'} space='full'>
          <Header type={'h1'}>Uranin: The Best Club Manager Ever</Header>
        </Item>
        <Item className={'center'} space='full'>
          <Link to='/accounts/register'>
            <Button style={'primary'} size='medium'>Register Now</Button>
          </Link>
        </Item>
      </Group>
    )
  }
}

export default Home