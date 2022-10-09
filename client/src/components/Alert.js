import React, { useState } from 'react'

import Item from './Item'
import Paragraph from './Paragraph'

import './css/Alert.css'

const Alert = ({
    atype,
    children,
    closable
}) => {
  const possibleTypes = [
    'error',
    'good',
    'warning'
  ]

  const type = possibleTypes.includes(atype) ? atype : 'error'

  const [showing, setShowing] = useState(true)

  if (children) {
    if (closable) {
      if (showing) return (
        <Item className={`${type}`} space='full'>
            <Paragraph className={'alert-error'}>{children} <span onClick={() => {
              setShowing(false)
            }} className='x-button'>&times;</span></Paragraph>
        </Item>
      )
      else return (
        <Item className={`not-showing`} space='full'></Item>
      )
    }
    else return (
      <Item className={`${type}`} space='full'>
          <Paragraph className={'alert-error'}>{children}</Paragraph>
      </Item>
  )
  } else {
    return <Item></Item>
  }
}

export default Alert