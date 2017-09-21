import React from 'react'
import styled from 'styled-components'
import { getName } from 'ffbe/item'

const ItemFrame = styled.div`
  position: relative;
  vertical-align: inherit;
  min-width: ${props => props.size || 50}px;
  min-weight: ${props => props.size || 50}px;
  height: ${props => props.size || 50}px;
  width: ${props => props.size || 50}px;
  display: inline-block;
  background-image: url('./build/img/items/frame-item.png');
  background-position: centre;
  background-size: cover;
  background-repeat: no-repeat;
`

const ItemSprite = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  zoom: ${props => props.zoom || 1};
`

export const Image = ({id, size = 50, ...otherProps}) =>
  <ItemFrame size={size} id={id} {...otherProps}>
    <ItemSprite
      src={`./build/img/items/Icon-${getName(id)}.png`}
      zoom={(size + 5) / 100} id={id} />
  </ItemFrame>
