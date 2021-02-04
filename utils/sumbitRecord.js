export const sortWithBusNumber = (a, b) => {
  const [nameA, ,] = a.name.split(' ')
  const [nameB, ,] = b.name.split(' ')

  // check if contains alphabet at beginning
  const alphabetRegex = /^[A-Za-z]/
  const alphabetTestA = alphabetRegex.test(nameA)
  const alphabetTestB = alphabetRegex.test(nameB)
  if (alphabetTestA && alphabetTestB) {
    return nameA < nameB
  } else if (alphabetTestA && !alphabetTestB) {
    return 1
  } else if (!alphabetTestA && alphabetTestB) {
    return -1
  }

  // sort with number order
  const numberRegx = /^\d+/
  const numA = Number(nameA.match(numberRegx))
  const numB = Number(nameB.match(numberRegx))
  if (numA > numB) return 1
  else if (numA < numB) return -1
  else return nameA > nameB // if both number same, sort according to alphabet order
}

export const sortWithWordsMatch = (input) => (a, b) => {
  const nameA = a.name
  const nameB = b.name
  const range = input.length

  if (
    nameA.substring(0, range) !== input &&
    nameB.substring(0, range) === input
  )
    return 1
  else if (
    nameA.substring(0, range) === input &&
    nameB.substring(0, range) !== input
  )
    return -1
  else return 0
}

export const filterAutoComplete = (computed, data, sortFunc) => {
  if (!computed && !data) return []
  const filtered = computed.filter((option) => {
    const name = option.name.toLowerCase()
    const input1 = data.split(' ')[0].toLowerCase()
    // if str begins with number
    if (input1.match(/^\d/)) {
      return name.startsWith(input1)
    }
    return name.includes(data.toLowerCase())
  })

  if (sortFunc) return filtered.sort(sortFunc)

  return filtered
}

export const onOnboardStopSelect = (option) => {
  if (option === null && this.alight) this.alight = ''
  this.$store.commit('pt/setRecord', { onboard: option })
  if (
    this.selectedType === 'bus' ||
    this.selectedType === 'minibus' ||
    this.selectedType === 'ferry'
  ) {
    this.$store.dispatch('pt/getAbortStops', option)
  }
}

export const onAbortStopSelect = (option) => {
  this.$store.commit('pt/setRecord', { alight: option })
}

export const getEffectiveChart = (charts, date) => {
  let chart

  // start from the end to get the latest
  for (let i = charts.length - 1; i >= 0; i--) {
    if (
      charts[i].effective_date &&
      new Date(charts[i].effective_date) <= date
    ) {
      chart = charts[i]
    }
  }

  return chart
}
