import React from 'react'
import { ThemeProvider, injectGlobal } from 'styled-components'
import { normalize } from 'polished'

import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'

import { addValueObjects } from 'lib/object'

import * as Item from 'ffbe/item'
import { ItemImage } from 'components/Item'

import { Name, Image as UnitImage } from 'components/Unit'
import UnitSelectionArea from 'components/UnitSelectionArea'
import selectedUnits from 'reducers/selectedUnits'
import { GridLayout, Header, Content, Footer, Sidebar } from 'components/Grid'

injectGlobal`
  ${normalize()}
`

let Dropdown = ({ items, current }) => <div>farts</div>

let HelloAll = ({ thingsToHello, dispatch }) =>
  <div>{
    thingsToHello.map((unit, index) => {
      let removalButton = <input
        type='button'
        onClick={() => dispatch({type: 'REMOVE_UNIT_AT_INDEX', index: index})}
        value='-'
      />
      return <div key={unit.id + String(index)}>
        {removalButton}
        <span>Awakening <Name id={unit.id} /></span>
        <UnitImage key={unit.id + unit.rarityFrom} id={unit.id} rarity={unit.rarityFrom} /> ->
        <UnitImage key={unit.id + unit.rarityTo} id={unit.id} rarity={unit.rarityTo} />
      </div>
    })
  }</div>

HelloAll = connect(
  state => ({thingsToHello: state.selectedUnits}),
  dispatch => ({dispatch})
)(HelloAll)

let unitToMatsNeeded = unit => {
  let awakenings = window.ffbedata.units[unit.id]['awakenings']

  if (unit.rarityFrom === unit.rarityTo - 1) {
    return awakenings[String(unit.rarityFrom)]['materials']
  }

  let totalMats = []

  for (let i = unit.rarityFrom; i < unit.rarityTo; i++) {
    totalMats.push(awakenings[String(i)]['materials'])
  }

  return addValueObjects(...totalMats)
}

let NeededItems = ({ units }) => {
  if (!units) {
    return null
  }

  let itemAmount = addValueObjects(...units.map(unitToMatsNeeded))

  return (<ul>
    {Object.keys(itemAmount)
      .sort(Item.sortByName)
      .map(itemId =>
        <li style={{verticalAlign: 'middle', margin: '0.3em'}} key={itemId}>
          <ItemImage itemId={itemId} />
          <span style={{verticalAlign: 'inherit'}}>
            {` ${itemAmount[itemId]}x ${Item.getName(itemId)}`}
          </span>
        </li>
    )}
  </ul>)
}

NeededItems = connect(state => ({units: state.selectedUnits}))(NeededItems)

export default class WindowContainer extends React.Component {

  store = createStore(
    combineReducers({
      selectedUnits
    })
  )

  theme = {uggghhh: 'whatever'}

  testImages = [
    {
      // Garland
      id: '201000203',
      rarity: '6'
    },
    {
      // Garland
      id: '201000203'
    },
    {
      // Veritas of Water
      id: '100007904',
      rarity: 5
    },
    {
      // Veritas of the Dark
      id: '100007705'
    },
    {
      // Maxwell
      id: '302000505'
    },
    {
      // CoD
      id: '203000803'
    },
    // Mechs
    {
      // Grace
      id: '100006204'
    },

    // 1 2 and 3 star
    {
      id: '100001301',
      rarity: 1
    },

    {
      id: '100001601',
      rarity: 2
    },
    {
      id: '206000403',
      rarity: 3
    }
  ].map((stuff, index) => <UnitImage key={index} {...stuff} />)

  render () {
    return (
      <Provider store={this.store}>
        <ThemeProvider theme={this.theme}>
          <GridLayout>
            <Header>
              <UnitSelectionArea />
            </Header>
            <Content >
              <HelloAll />
            </Content>
            <Sidebar>
              <NeededItems />
            </Sidebar>
            <Footer>All shit belongs to SE and stuff</Footer>
          </GridLayout>
        </ThemeProvider>
      </Provider>
    )
  }

  // render () {
  //   return (
  //     <Provider store={this.store}>
  //       <ThemeProvider theme={this.theme}>
  //         <div>
  //           <h1>Awakening Calc</h1>
  //           <UnitSelectionArea />
  //           <HelloAll />
  //           <NeededItems />
  //         </div>
  //       </ThemeProvider>
  //     </Provider>
  //   )
  // }
}
