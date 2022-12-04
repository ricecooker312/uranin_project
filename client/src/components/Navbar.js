import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Group from './Group'
import Header from './Header'

import { isAuthenticated, refreshToken } from './jwtfns'

import './css/Navbar.css'

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) setAuthenticated(true)
    else setAuthenticated(false) 
  }, [])

  const logout = () => {
    console.log(isAuthenticated())
    if (!isAuthenticated()) throw new Error('User is not authenticated')
    else {
      const rtl = localStorage.getItem("rtoken")

      const logoutPayload = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          rtoken: rtl
        })
      }

      fetch('/api/auth/logout', logoutPayload)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        else {
          localStorage.clear()
          localStorage.removeItem("atoken")

          window.location.reload()
          navigate('/')
        }
      })
    }
  }

  const navigate = useNavigate()

  if (authenticated === false) return (
    <Group className={'nav-container'}>
        <nav className='nav'>
            <li className='item nav-header'>
                <Link to='/'><Header className={'nav-real-header'} type={'h1'}>Home</Header></Link>
            </li>
            <Group className={'nav-thing'}>
                <ul>
                    <li className='item'>
                        <Link className='a-tag' to='/accounts/register'>Register</Link>
                    </li>
                    <li className='item'>
                        <Link className='a-tag' to='/accounts/login'>Login</Link>
                    </li>
                </ul>
            </Group>
        </nav>
    </Group>
  )
  else return (
    <Group className={'nav-container'}>
        <nav className='nav'>
            <li className='item nav-header'>
                <Link to='/'><Header className={'nav-real-header'} type={'h1'}>Uranin</Header></Link>
            </li>
            <Group className={'nav-thing'}>
                <ul>
                    <li className='item'>
                      <Link className='a-tag' to='/accounts/profile'>Profile</Link>
                    </li>
                    <li className='item'>
                        <Link className='a-tag' onClick={logout} to='/'>Logout</Link>
                    </li>
                    <li className='item'>
                        <Link className='a-tag' to='/accounts/change-password'>Change Password</Link>
                    </li>
                    <li className='item'>
                        <Link className='a-tag' to='/accounts/delete-account'>Delete Account</Link>
                    </li>
                    <li className='item'>
                        <Link className='a-tag' to='/clubs/add-club'>Add Club</Link>
                    </li>
                </ul>
            </Group>
        </nav>
    </Group>
  )
}

export default Navbar