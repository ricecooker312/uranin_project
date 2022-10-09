import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import Group from '../components/Group'
import Item from '../components/Item'
import Paragraph from '../components/Paragraph'
import Header from '../components/Header'

const OtherUserProfile = () => {
  const { username } = useParams()

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/auth/user/profile/${username}`)
    .then(res => res.json())
    .then(json => setUser(json))
  }, [])

  if (user === null) return (
    <Group>
        <Item>Loading...</Item>
    </Group>
  )
  else return (
    <Group>
        <Item className={'center'}>
            <Header type={'h1'}>{user.username}</Header>
        </Item>
        <Item className={'center'}>
            <Paragraph>Email: {user.email}</Paragraph>
        </Item>
        <Item className={'center'}>
            <Paragraph>Age: {user.age}</Paragraph>
        </Item>
        <Item className={'center'}>
            <Paragraph>Name: {user.name}</Paragraph>
        </Item>
    </Group>
  )
}

export default OtherUserProfile