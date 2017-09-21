import React from 'react'
import Autosuggest from 'react-autosuggest'

import { getName } from 'ffbe/unit'
import { Image as UnitImage } from 'components/Unit'

import styled from 'styled-components'

// Unfortunately StyledComponents don't play nice with our ReactAutosuggest
// so it is now sitting outside of our lovely jsx code.
//
// The only thing that should have to be messed with is the width of the .container
// as the other bits are just to style suggestion containers to allow them to be
// dealt with through the StyledSuggestion
import autosuggestTheme from 'components/UnitSearchBar.css'

const Suggestion = ({ suggestion, className }) => {
  return (
    <div className={className}>
      <div key='image' className='imageContainer'>
        <UnitImage id={suggestion.id} />
      </div>
      <div key='text' className='textContainer' >
        <span className='text'>{suggestion.name}</span>
      </div>
    </div>
  )
}

const StyledSuggestion = styled(Suggestion)`
  & {
    display: flex;
    flex-direction: row;
    padding: 5px;
    max-height: 100px;
    line-height: 100%;
    background-color: ${props => props.isHighlighted ? '#CCC' : 'white'}
  }

  & .imageContainer {
    flex: 1 0 0;
    display: flex;
    align-content:   center;
    justify-content: center;
  }

  & .imageContainer .UnitImage {
    zoom: 0.75;
  }

  & .textContainer {
    flex: 3 0 0;
    display: flex;
    align-items: center;
  }

  & .textContainer .text {

  }
`

class UnitSearchBar extends React.Component {
  constructor () {
    super()
    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    }

    this.possibleUnits = Object.keys(window.ffbedata.units).map(
      key => ({
        id: key,
        name: getName(key),
        game: window.ffbedata.units[key].game
      })
    )
  }

  possibleUnits = []

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    })

    if (this.props.onChange !== undefined) {
      this.props.onChange(event, { newValue, method })
    }
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0 ? []
      : this.possibleUnits.filter(
        unit => {
          let isGameString = unit.game !== null ?
                 unit.game.toLowerCase() === inputValue
              || unit.game.toLowerCase().replace(/^ff/, '') === inputValue
            : false

          let isUnitString = unit.name.toLowerCase().slice(0, inputLength) === inputValue
                             || unit.name.toLowerCase().match(/\b(\w)/g).join('').slice(0, inputLength) === inputValue

          return isGameString || isUnitString
        })
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  getSuggestionValue = suggestion => suggestion.name
  renderSuggestion = (suggestion, otherProps) => <StyledSuggestion key={suggestion.id} suggestion={suggestion} {...otherProps} />

  renderInputComponent = inputProps => (
    <div>
      <input {...inputProps} />
      <div>custom stuff</div>
    </div>
  );

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    return (
      <div {... containerProps}>
        {children}
        <div>
          Press Enter to search <strong>{query}</strong>
        </div>
      </div>
    )
  }

  // Might do this in the future
  // renderSuggestionsContainerThatIsNotReturningADOMNode = ({ containerProps, children }) => {
  //   const { ref, ...restContainerProps } = containerProps
  //   const callRef = notDomNode => {
  //     if (notDomNode !== null) {
  //       ref(notDomNode.component)
  //     }
  //   }

  //   let SomeWackyThing = ({ children }) => <div>{children}</div>

  //   return (
  //     <SomeWackyThing ref={callRef} {...restContainerProps}>
  //       {children}
  //     </SomeWackyThing>
  //   )
  // }

  render () {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: 'Awaken meee',
      value,
      onChange: this.onChange
    }

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionSelected={this.props.onSelect}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        // Uncomment alwaysRenderSuggestions + comment out onSuggestionsClearRequested to keep suggestions open
        // and populated
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        // alwaysRenderSuggestions
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        theme={autosuggestTheme}
        // renderSuggestionsContainer={this.renderSuggestionContainer}
        inputProps={inputProps}
      />
    )
  }
}

export default UnitSearchBar
