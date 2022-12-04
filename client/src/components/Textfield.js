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
    className,
    multirow,
    rows,
    cols,
    style
}) => {
  if (multirow) {
    if (!required) {
      return (
          <div className='textfield'>
              <label className='textfield-label' htmlFor={name}>{label}</label>
              <br />
              <textarea 
              className={`textfield-input ${className}`} 
              value={value} 
              defaultValue={defaultValue} 
              type={type} 
              defaultChecked={defaultChecked}
              placeholder={placeholder}
              name={name}
              onChange={onChange}
              rows={rows}
              cols={cols}
              style={style}
              />
          </div>
        )
    }
  
    if (required == true) {
      return (
          <div className='textfield'>
              <label className='textfield-label' htmlFor={name}>{label}</label>
              <br />
              <textarea 
              className={`textfield-input ${className}`}
              value={value} 
              defaultValue={defaultValue} 
              type={type} 
              defaultChecked={defaultChecked}
              placeholder={placeholder}
              name={name}
              required
              onChange={onChange}
              rows={rows}
              cols={cols}
              style={style}
              />
          </div>
        )
    }
  } else {
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
              style={style}
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
              style={style}
              />
          </div>
        )
    }
  }
}

export default Textfield