import React from 'react'
import { getName, getData } from 'ffbe/unit'
import styled, { css } from 'styled-components'

export const Name = ({ id, language = 'en' }) => <span>{getName(id)}</span>

const getSprite = ({
  width, height,
  xOffset = 0, yOffset = 0,
  startX = 0, startY = 0,
  xPadding = 0, yPadding = xPadding
}) => {
  return {
    backgroundPositionX: width * xOffset * -1 - xOffset * xPadding,
    backgroundPositionY: height * yOffset * -1 - yOffset * yPadding
  }
}

const getBigBasePlateStyle = rarity => {
  let standSize = {
    width: 153,
    height: 163
  }

  let rarityToBackgroundOffset = {
    '1': { xOffset: 1, yOffset: 0 },
    '2': { xOffset: 2, yOffset: 0 },
    '3': { xOffset: 3, yOffset: 0 },
    '4': { xOffset: 4, yOffset: 0 },
    '5': { xOffset: 0, yOffset: 1 },
    '6': { xOffset: 1, yOffset: 1 }
  }

  rarity = String(rarity)

  let offset = getSprite({
    ...standSize,
    ...rarityToBackgroundOffset[rarity],
    xPadding: 9,
    yPadding: 10
  })

  return {
    ...offset,
    // minWidth: standSize.width,
    width: standSize.width,
    // minHeight: standSize.height,
    height: standSize.height,
    backgroundColor: '#222',
    backgroundImage: "url('./build/img/units/unit_charastand.png')",
    backgroundRepeat: 'no-repeat'
  }
}

//https://css-tricks.com/scaled-proportional-blocks-with-css-and-javascript/
//Deal with this
export const ImageWithBaseplate = ({ id, rarity = getData(id)['rarity_max'] }) => {
  return <div>
    <div style={{
      ...getBigBasePlateStyle(rarity),
      position: 'relative',
      verticalAlign: 'inherit',
      display: 'block',
      backgroundRepeat: 'no-repeat'
      // backgroundPosition: 'centre',
      // backgroundSize: 'cover',
    }} >
      <img
        style={{
          transform: 'scale(1.4)',
          display: 'block',
          position: 'absolute'
        }}
        src={`./build/img/units/Unit-${getName(id)}-${rarity}.png`} />
    </div>
  </div>
}

export const Star = ({ rarity, style }) =>
  <img
    style={{
      display: 'flex',
      filter: 'drop-shadow(1px 1px 1px)',
      margin: 0,
      ...style
    }}
    src={`./build/img/shared/Rarity-${rarity}.png`}
  />

const starEvenStyle = (rarity, index, step = 0.5) => {
  let s = {}

  if (index <= rarity / 2) {
    s = {
      marginTop: `${step / 2 * index}em`,
      marginRight: `-${step}em`,
      zIndex: index
    }

    if (index === rarity / 2) {
      s.marginRight = null
    }
  } else if (index >= rarity / 2 + 1) {
    let reverseIndex = rarity - index + 1
    s = {
      marginTop: `${step / 2 * reverseIndex}em`,
      marginLeft: `-${step}em`,
      zIndex: reverseIndex
    }

    if (index === rarity / 2 + 1) {
      s.marginLeft = null
    }
  }

  return s
}

const starOddStyle = (rarity, index, step = 0.5) => {
  let s = {}
  if (index < rarity / 2) {
    s = {
      marginTop: `${step / 2 * index}em`,
      marginRight: `-${step}em`,
      zIndex: index
    }
  } else if (index > rarity / 2 + 1) {
    let reverseIndex = rarity - index + 1
    s = {
      marginTop: `${step / 2 * reverseIndex}em`,
      marginLeft: `-${step}em`,
      zIndex: reverseIndex
    }
  } else {
    let midValue = Math.ceil(rarity / 2)
    s = {
      marginTop: `${step / 2 * (midValue)}em`,
      zIndex: midValue
    }
  }

  return s
}

export const Stars = ({ rarity, style }) => {
  let stars = []

  for (let i = 1; i <= rarity; i++) {
    let s = {}

    s = rarity % 2 === 0 ?
        starEvenStyle(rarity, i)
      : starOddStyle(rarity, i)

    stars.push(<Star key={i} rarity={rarity} style={s} />)
  }

  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  }}>
    {stars}
  </div>
}

const imageCSSAdjustments = (id) => {
  switch (id) {
    case '302000705': // White Knight Noel
      return {
        margin: -30
      }
    default:
      return {}
  }
}

export const Image = ({ id, rarity = getData(id)['rarity_max'], style = {}, className = '' }) => {
  return <div
    className={'UnitImage ' + className}
    style={{
      display: 'inline-block',
      position: 'relative',
      ...style
    }}
  >
    <img
      style={{
        display: 'block',
        filter: 'drop-shadow(1px 1px 1px)',
        ...(imageCSSAdjustments(id))
      }}
      src={`./build/img/units/Unit-${getName(id)}-${rarity}.png`}
    />
    <Stars rarity={rarity}
      className='rowOfStars'
      style={{position: 'absolute', bottom: 0, width: '100%'}} />
  </div>
}

