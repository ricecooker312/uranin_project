import React from 'react'

import './css/Button.css'

const sizes = [
    'big',
    'medium',
    'small'
]

const styles = [
    'primary',
    'secondary',
    'danger',
    'error'
]

const Button = ({
    size,
    style,
    link,
    to,
    children,
    block,
    onClick,
    className
}) => {
  const buttonStyle = styles.includes(style) ? style : styles[0]
  const buttonSize = sizes.includes(size) ? size : sizes[0]
  const buttonBlock = block ? " btn-block" : ""  

  return (
    <button className={`btn btn-${buttonStyle} btn-${buttonSize}${buttonBlock} ${className}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default Button