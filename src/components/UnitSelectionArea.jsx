import React from 'react'

import { connect } from 'react-redux'
import { Image as UnitImage } from 'components/Unit'
import { UnitSelector as Dropdown } from 'components/UnitStarSelector'
import UnitSearchBar from 'components/UnitSearchBar'

class UnitSelectionArea extends React.Component {
  emptyState = {
    unitId: null,
    minRarity: null,
    maxRarity: null,

    rarityFrom: null,
    rarityTo: null
  }

  constructor () {
    super()
    this.state = this.emptyState
  }

  initDropdowns = (unitId) => {
    let unit = window.ffbedata.units[unitId]

    this.setState({
      unitId: unitId,

      rarityMin: unit.rarity_min,
      rarityMax: unit.rarity_max,

      rarityFrom: unit.rarity_max - 1, // Change how default works
      rarityTo: unit.rarity_max
    })
  }

  cleanSearchBar = () => {
    this.searchBar.setState({value: ''})
    // this.searchBar.input.value = ''
    // this.searchBar.input.focus()
  }

  reset = () => {
    this.setState(this.emptyState)
  }

  onSearchChange = (event, { method }) => {
    if (method === 'type') {
      this.reset()
    }
  }

  onSearchSelect = (event, { suggestion }) => {
    this.initDropdowns(suggestion.id)
  }

  render () {
    let content = [
      <UnitSearchBar
        key='bar'
        ref={ref => this.searchBar = ref}
        onSelect={this.onSearchSelect}
        onChange={this.onSearchChange}
      />
    ]

    if (this.state.unitId !== null) {
      /*
        if(state.unitSelected)
          dropdownBase
          dropdownTarget
          goButton
            - onClick clear unit serachbar
      */

      content.push(
        <div
          key='selectorContinaer'
          style={{display: 'flex', flexDirection: 'row'}}
        >
          <Dropdown
            key='rarityFrom'
            id={this.state.unitId}
            min={this.state.rarityMin}
            current={this.state.rarityFrom}
            max={this.state.rarityMax - 1}
            onChange={option => {
              this.setState({
                rarityFrom: option.value,
                // If we go higher than the target at the moment,
                // bump it up accordingly
                rarityTo: option.value >= this.state.rarityTo ?
                    option.value + 1
                  : this.state.rarityTo
              })
            }}
          />
          <span style={{margin: 'auto 0'}} key="ahuehuehauehahahaha">→</span>
          <Dropdown
            key='rarityTo'
            id={this.state.unitId}
            min={this.state.rarityMin + 1}
            current={this.state.rarityTo}
            max={this.state.rarityMax}
            onChange={option => {
              this.setState({
                // If we go lower turn it down accordingly
                rarityFrom: option.value <= this.state.rarityFrom ?
                    option.value - 1
                  : this.state.rarityFrom,
                rarityTo: option.value
              })
            }}
          />
          <input type='button'
            key='submitButton'
            value='Select'
            onClick={
              e => {
                this.props.dispatch({
                  type: 'ADD_UNIT',
                  id: this.state.unitId,
                  rarityTo: this.state.rarityTo,
                  rarityFrom: this.state.rarityFrom
                })

                this.reset()
                this.cleanSearchBar()
              }
            }
          />
        </div>
      )
    }

    return (
      <div className='UnitSelectionArea' >
        <div>
          {content}
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(UnitSelectionArea)
