import React from 'react'
import { getName } from 'ffbe/item'

export const ItemImage = ({ itemId, size = 50, style = {} }) =>
  <div
    style={{
      position: 'relative',
      verticalAlign: 'inherit',
      minWidth: size,
      minHeight: size,
      height: size,
      width: size,
      display: 'inline-block',
      backgroundImage: "url('./build/img/items/frame-item.png')",
      backgroundPosition: 'centre',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      ...style
    }}
  >
    <img key='itemImage'
      src={`./build/img/items/Icon-${getName(itemId)}.png`}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto', height: '60%', width: '60%' }}
    />
  </div>

