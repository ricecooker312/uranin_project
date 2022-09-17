import React from 'react'

import Item from './Item'
import Paragraph from './Paragraph'

import './css/Alert.css'

const Alert = ({
    atype,
    children
}) => {
  const possibleTypes = [
    'error',
    'good'
  ]

  const type = possibleTypes.includes(atype) ? atype : 'error'

  if (children) {
    return (
        <Item className={`${type}`} space='full'>
            <Paragraph className={'alert-error'}>{children}</Paragraph>
        </Item>
    )
  } else {
    return <Item></Item>
  }
}

export default Alert