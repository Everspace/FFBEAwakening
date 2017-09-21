
// Sum a series of objects that have keys to values that can
// be added together.
export const addValueObjects = (...args) => {
  let base = args.reduce(
      (memory, list) => {
        for (var itemId in list) {
          if (memory.hasOwnProperty(itemId)) {
            memory[itemId] += list[itemId]
          } else {
            memory[itemId] = list[itemId]
          }
        }
        return memory
      }
      , {}
    )

  return base
}
