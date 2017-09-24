import ReactSelect from 'react-select'
import styled from 'styled-components'

// Styled versions of React-Select

/**
 * For things that that use an image instead of an input
 * Make sure clearable={false} and searchable={false}
 * Generally overrides valueComponent, and optionRenderer
 */
export const ImageDropdownSelect = styled(ReactSelect)`
  margin-right: 0.2em;
  margin-left: 0.2em;

  position: relative;
  max-width: min-content;

  display: flex;
  flex: 1 0 100%;

  background-color: #EEE;

  /* offset-x | offset-y | blur-radius | spread-radius | color
  box-shadow: 1px 1px 1px 1px black ;*/

  border-radius: 0.4em;
  border: 1px solid #222;

  &.is-open {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    .Select-control {
      /* offset-x | offset-y | blur-radius | spread-radius | color */
      border-bottom: 1px solid black;
    }
  }

  .Select-input {
    display: none !important; /* the style is on the div itself, sorryyyyyy */
  }

  .Select-control {
    display: flexbox;
    flex-direction: row;

    align-items: center;
    justify-content: center;
  }

  .Select-option {
    height: 100%;
    width: 100%;

    > div {
      margin: auto;
      height: min-content;
      width: min-content;

      display: block !important; /* the style is on the div itself, sorryyyyyy */
    }

    &.is-focused {
      background-color: #EEE;
    }

    :last-of-type {
      border-bottom-right-radius: 0.4em;
      border-bottom-left-radius: 0.4em;
    }
  }

  .Select-multi-value-wrapper,
  .Select-arrow-zone {
    display: flex;
  }

  .Select-value,
  .Select-multi-value-wrapper,
  .Select-arrow-zone > span {
    height: min-content;
    max-height: min-content;
  }


  .Select-arrow-zone {
    height: 100%;
    background-color: #DDF;

    > span {
      margin: auto 0;
    }
  }

  .Select-menu-outer {
    top: 100%;
    left: -1px; /* -borderWidth */
    width: 100%;
    position: absolute;

    background-color: #DDD;

    /* offset-x | offset-y | blur-radius | spread-radius | color
    box-shadow: 2px 2px 1px 0px black ; */

    border: 1px solid #222;
    border-top: none;

    border-bottom-right-radius: 0.4em;
    border-bottom-left-radius: 0.4em;
  }
`
