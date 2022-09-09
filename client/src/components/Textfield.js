import React from 'react'

import './css/Textfield.css'

const Textfield = ({
    value,
    defaultValue,
    type,
    defaultChecked,
    placeholder,
    label,
    name,
    required,
    onChange,
    className
}) => {
  if (!required) {
    return (
        <div className='textfield'>
            <label className='textfield-label' htmlFor={name}>{label}</label>
            <br />
            <input 
            className={`textfield-input ${className}`} 
            value={value} 
            defaultValue={defaultValue} 
            type={type} 
            defaultChecked={defaultChecked}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            />
        </div>
      )
  }

  if (required == true) {
    return (
        <div className='textfield'>
            <label className='textfield-label' htmlFor={name}>{label}</label>
            <br />
            <input 
            className={`textfield-input ${className}`}
            value={value} 
            defaultValue={defaultValue} 
            type={type} 
            defaultChecked={defaultChecked}
            placeholder={placeholder}
            name={name}
            required
            onChange={onChange}
            />
        </div>
      )
  }
}

export default Textfield