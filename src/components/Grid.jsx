import styled from 'styled-components'
// import { normalize } from 'polished'

export const GridLayout = styled.div`
  display: grid;
  grid-gap: 5px;

  height: 100vh;
  width: 100vw;

  grid-template-columns: 1fr 1fr 33%;
  grid-template-rows: 10em 1fr 2em;
  grid-template-areas:
    "header  header  sidebar"
    "content content sidebar"
    "footer  footer  footer";
`

export const Header = styled.div`
  grid-area: header;
  background-color: #EEE;
  z-index: 100; /* Handle dropdowns going underneath Content and Sidebar */
`

export const Content = styled.div`
  grid-area: content;
  background-color: #EEE;
  /* overflow: */
`

export const Sidebar = styled.div`
  grid-area: sidebar;
  background-color: #EEE;
  /* overflow: */
`

export const Footer = styled.div`
  grid-area: footer;
  background-color: #EEE;
  /* overflow: */
`
