import React from 'react'

import { connect } from 'react-redux'
import { Image as UnitImage } from 'components/Unit'
import UnitSearchBar from 'components/UnitSearchBar'

let makeOptions = (min, max) => {
  var collection = []
  var i = min
  while (i <= max) {
    collection.push(
      <option key={i} value={i}>{i}*</option>
    )
    i++
  }
  return collection
}

let Dropdown = ({ min, max, current, onChange }) => {
  return <select onChange={onChange} value={current}>
    {makeOptions(min, max)}
  </select>
}

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
        <Dropdown
          key='rarityFrom'
          min={this.state.rarityMin}
          current={this.state.rarityFrom}
          max={this.state.rarityMax - 1}
          onChange={e => {
            let v = Number(e.target.value)
            this.setState({
              rarityFrom: v,
              // If we go higher than the target at the moment,
              // bump it up accordingly
              rarityTo: v >= this.state.rarityTo ?
                  v + 1
                : this.state.rarityTo
            })
          }}
        />
      )

      content.push(<span>-to-></span>)

      content.push(
        <Dropdown
          key='rarityTo'
          min={this.state.rarityMin + 1}
          current={this.state.rarityTo}
          max={this.state.rarityMax}
          onChange={e => {
            let v = Number(e.target.value)
            this.setState({
              // If we go lower turn it down accordingly
              rarityFrom: v <= this.state.rarityFrom ?
                  v - 1
                : this.state.rarityFrom,
              rarityTo: v
            })
          }}
        />
      )

      content.push(
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
      )
    }

    return (
      <div className='UnitSelectionArea' >
        <div>
          {content}
        </div>
        <div>
          {
            this.state.unitId !== null ?
            [
              <UnitImage id={this.state.unitId} rarity={this.state.rarityFrom} />,
              <span>-to-></span>,
              <UnitImage id={this.state.unitId} rarity={this.state.rarityTo} />
            ]
            : null
          }
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(UnitSelectionArea)
