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
      setUser('logged in')
      setAuthenticated(true)
    }
  }, [])

  if (authenticated) {
    if (user !== null) return (
      <Group>
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