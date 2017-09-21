function reducer (state, action) {
  if (state === undefined) {
    return []
  }

  let newState = [...state]

  switch (action.type) {
    case 'ADD_UNIT':
      let unit = window.ffbedata.units[action.id]
      return [
        ...state,
        {
          name: unit.name['en'],
          id: action.id,
          rarityFrom: action.rarityFrom,
          rarityTo: action.rarityTo,
          index: state.length - 1
        }
      ]
    case 'REMOVE_UNIT_AT_INDEX':
      newState.splice(action.index, 1)
      return newState
    case 'EDIT_UNIT_AT_INDEX':
      let newUnit = Object.assign({}, state[action.index], action.newValues)
      newState.splice(action.index, 1, newUnit)
      return newState
    default:
      return newState
  }
}
// {
//   id: "201000203", // Garland
//   rarity_start: 3,
//   rarity_end: 6
// }, {
//   id: "201000104", // WoL
//   rarity_start: 4,
//   rarity_end: 6
// }

export default reducer
