import React from 'react'

import Item from './Item'
import Paragraph from './Paragraph'

import './css/Alert.css'

const Alert = ({
    type,
    children
}) => {
  const possibleTypes = [
    'error'
  ]

  if (children) {
    return (
        <Item className={'alert'} space='full'>
            <Paragraph className={'alert-error'}>{children}</Paragraph>
        </Item>
    )
  } else {
    return <Item></Item>
  }
}

export default Alert