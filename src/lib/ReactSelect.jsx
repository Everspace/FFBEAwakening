import React from 'react'

/**
 * Renders a ◄ when closed and a ▼ when open
 * @param {isOpen}
 */
export const DropdownArrow = ({isOpen}) => {
  return isOpen ? <span>▼</span> : <span>◄</span>
}
