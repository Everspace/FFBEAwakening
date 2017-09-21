
export const getName = itemId => window.ffbedata.items[itemId].name['en']

export const sortById = (a, b) => {
  if (a > b) return 1
  else if (a === b) return 0 // shouldn't happen?
  else return -1
}

export const sortByName = (a, b) => {
  return getName(a).toLocaleLowerCase()
                   .localeCompare(
                     getName(b).toLocaleLowerCase()
                    )
}

// Return sorter for a list provided sortItemByNumberInList(list)
export const sortByNumberInList = itemList => {
  return (a, b) => {
    if (itemList[a] > itemList[b]) return -1
    if (itemList[a] === itemList[b]) {
      return sortByName(a, b)
    } else return 1
  }
}
