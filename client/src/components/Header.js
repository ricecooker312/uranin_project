import React from 'react'

import './css/Header.css'

const Header = ({
    type,
    children,
    onClick,
    className
}) => {
  switch (type) {
    case 'h1':
        return <h1 className={className} onClick={onClick}>{children}</h1>
    case 'h2':
        return <h2 className={className} onClick={onClick}>{children}</h2>
    case 'h3':
        return <h3 className={className} onClick={onClick}>{children}</h3>
    case 'h4':
        return <h4 className={className} onClick={onClick}>{children}</h4>
    case 'h5':
        return <h5 className={className} onClick={onClick}>{children}</h5>
    case 'h6':
        return <h6 className={className} onClick={onClick}>{children}</h6>
    default:
        return <h1 className={className} onClick={onClick}>{children}</h1>
  }
}

export default Header