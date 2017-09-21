import { addValueObjects } from 'lib/object'

export const getData = id => window.ffbedata.units[id]

export const getName = (id, language = 'en') =>
  getData(id).name[language] || getData(id).name['en']

export const getAwakeningMatsFor = (id, rarity) =>
  getData(id)['awakenings'][String(rarity)]['materials']

export const sumMaterials = (id, baseRarity = null, targetRarity = null ) => {
  let unit = getData(id)

  if (baseRarity === null) baseRarity = unit['rarity_max'] - 1
  if (targetRarity === null) targetRarity = unit['rarity_max']
  if (baseRarity === targetRarity - 1) return getAwakeningMatsFor(id, baseRarity)

  let mats = []

  for (let i = baseRarity; i < targetRarity; i++) {
    mats.push(getAwakeningMatsFor(id, i))
  }

  return addValueObjects(...mats)
}
