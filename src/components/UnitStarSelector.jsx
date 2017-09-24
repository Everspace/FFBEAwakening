import React from 'react'
import { Image as UnitImage } from 'components/Unit'
import { ImageDropdownSelect } from 'lib/styledComponents/ReactSelect'
import { DropdownArrow } from 'lib/ReactSelect'

// Value is the currently selected thing.
const UnitSelectorValue = ({value}) =>
  <div className='Select-value' >
    <UnitImage id={value.id} rarity={value.value} />
  </div>

// Make a bunch of {value: rarity, id: unitid} objects
const makeOptions = (id, min, max, current) => {
  var collection = []
  var value = min
  while (value <= max) {
    collection.push({value, id})
    value++
  }
  return collection
}

export const UnitSelector = ({onChange = () => {}, id, min, max, current}) =>
  <ImageDropdownSelect
    onChange={onChange}

    clearable={false}
    searchable={false}

    value={current}
    valueComponent={UnitSelectorValue}

    options={makeOptions(id, min, max, current)}
    optionRenderer={(value, index) => <UnitImage id={value.id} rarity={value.value} />}

    arrowRenderer={DropdownArrow}
  />
