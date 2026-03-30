import React from 'react'

const Buttons = ({children, type,...props}) => {
  return (
    <button {...props}>
        {children}
    </button>
  )
}

export default Buttons