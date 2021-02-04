const dateMax = { hours: 23, minutes: 59, seconds: 59 }
const localStorageKey = 'fm-countdown/finalDate'

const zeroPad = (value) => {
  return value < 10 ? `0${value}` : `${value}`
}

const setValue = (current, dateType) => {
  const next = current > 0 ? current - 1 : dateMax[dateType]

  const topCurrentNumber = document.querySelector(
    `.card--${dateType} .top__current .top__number`,
  )
  const topNextNumber = document.querySelector(
    `.card--${dateType} .top__next .top__number`,
  )
  const bottomCurrentNumber = document.querySelector(
    `.card--${dateType} .bottom__current .bottom__number`,
  )
  const bottomNextNumber = document.querySelector(
    `.card--${dateType} .bottom__next .bottom__number`,
  )

  topCurrentNumber.textContent = zeroPad(current)
  topNextNumber.textContent = zeroPad(next)
  bottomCurrentNumber.textContent = zeroPad(current)
  bottomNextNumber.textContent = zeroPad(next)
}

const setValueWithTransition = (current, dateType) => {
  const next = current > 0 ? current - 1 : dateMax[dateType]

  const topCurrentWrapper = document.querySelector(
    `.card--${dateType} .top__current`,
  )
  const topCurrentNumber = document.querySelector(
    `.card--${dateType} .top__current .top__number`,
  )
  const topNextNumber = document.querySelector(
    `.card--${dateType} .top__next .top__number`,
  )
  const bottomNextWrapper = document.querySelector(
    `.card--${dateType} .bottom__next`,
  )
  const bottomCurrentNumber = document.querySelector(
    `.card--${dateType} .bottom__current .bottom__number`,
  )
  const bottomNextNumber = document.querySelector(
    `.card--${dateType} .bottom__next .bottom__number`,
  )

  topCurrentWrapper.classList.add('top__current--flip')
  setTimeout(() => {
    topCurrentNumber.textContent = zeroPad(current)
    topNextNumber.textContent = zeroPad(next)
    topCurrentWrapper.classList.remove('top__current--flip')
  }, 500)

  setTimeout(() => {
    bottomNextWrapper.classList.add('bottom__next--flip')
    setTimeout(() => {
      bottomCurrentNumber.textContent = zeroPad(current)
      bottomNextNumber.textContent = zeroPad(next)
      bottomNextWrapper.classList.remove('bottom__next--flip')
    }, 500)
  }, 500)
}

const getDate = () => {
  if (localStorage.getItem(localStorageKey)) {
    const today = dayjs()
    const localStorageDate = dayjs(localStorage.getItem(localStorageKey))

    const millisecondsDiff = localStorageDate.diff(today)
    const secondsDiff = millisecondsDiff / 1000
    const minutesDiff = secondsDiff / 60
    const hoursDiff = minutesDiff / 60
    const daysDiff = hoursDiff / 24

    const finalDate = {
      days: Math.floor(daysDiff),
      hours: Math.floor(hoursDiff % 24),
      minutes: Math.floor(minutesDiff % 60),
      seconds: Math.floor(secondsDiff % 60),
    }

    return finalDate
  }

  const defaultFinalDate = { days: 8, hours: 23, minutes: 55, seconds: 41 }
  const finalDate = dayjs().add(dayjs.duration(defaultFinalDate)).format()

  localStorage.setItem(localStorageKey, finalDate)

  return defaultFinalDate
}

const init = () => {
  const date = getDate()

  Object.keys(date).forEach((dateType) => {
    setValue(date[dateType], dateType)
  })

  const intervalId = setInterval(() => {
    if (Object.values(date).every((value) => value === 0))
      return clearInterval(intervalId)

    if (date.hours === 0 && date.minutes === 0 && date.seconds === 0) {
      date.days = date.days - 1
      setValueWithTransition(date.days, 'days')
    }

    if (date.minutes === 0 && date.seconds === 0) {
      date.hours = date.hours > 0 ? date.hours - 1 : dateMax.hours
      setValueWithTransition(date.hours, 'hours')
    }

    if (date.seconds === 0) {
      date.minutes = date.minutes > 0 ? date.minutes - 1 : dateMax.minutes
      setValueWithTransition(date.minutes, 'minutes')
    }

    date.seconds = date.seconds > 0 ? date.seconds - 1 : dateMax.seconds
    setValueWithTransition(date.seconds, 'seconds')
  }, 1_000)
}

window.addEventListener('load', init)
