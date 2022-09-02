import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import { isAuthenticated, refreshToken } from '../components/jwtfns'

import Group from '../components/Group'
import Item from '../components/Item'
import Button from '../components/Button'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'

const Home = () => {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.clear()
      setAuthenticated(false)
    }
    else {
      setAuthenticated(true)

      const token = refreshToken(localStorage.getItem("rtoken"))

      const profilePayload = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }

      fetch('/api/auth/user/profile', profilePayload)
      .then(res => res.json())
      .then(data => setUser(data))
    }
  }, [])

  if (authenticated) {
    if (user !== null) return (
      <Group>
        <Item className={'center'}>
          <Header type={'h1'}>Hello, {user.username}</Header>
        </Item>
        <Item className={'center'}>
          <Paragraph>We have sent verification to {user.email}</Paragraph>
        </Item>
        <Item className={'center'}>
          <Paragraph>Hello, {user.name}</Paragraph>
        </Item>
        <Item className={'center'}>
          <Paragraph>You are {user.age} years old</Paragraph>
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
          <Header type={'h1'}>The Best Club Manager Ever</Header>
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