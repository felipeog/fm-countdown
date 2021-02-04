const localStorageKey = 'fm-countdown/finalDate'
const animationDuration = 500

const dateMax = { hours: 23, minutes: 59, seconds: 59 }
const dateTypes = ['days', 'hours', 'minutes', 'seconds']
const dateElements = dateTypes.reduce((acc, dateType) => {
  return (acc = {
    ...acc,
    [dateType]: {
      topCurrentWrapper: document.querySelector(
        `.card--${dateType} .top__current`,
      ),
      topCurrentNumber: document.querySelector(
        `.card--${dateType} .top__current .top__number`,
      ),
      topNextNumber: document.querySelector(
        `.card--${dateType} .top__next .top__number`,
      ),
      bottomNextWrapper: document.querySelector(
        `.card--${dateType} .bottom__next`,
      ),
      bottomCurrentNumber: document.querySelector(
        `.card--${dateType} .bottom__current .bottom__number`,
      ),
      bottomNextNumber: document.querySelector(
        `.card--${dateType} .bottom__next .bottom__number`,
      ),
    },
  })
}, {})

const zeroPad = (value) => {
  return value < 10 ? `0${value}` : `${value}`
}

const setInitialValues = (date) => {
  Object.keys(date).forEach((dateType) => {
    const current = date[dateType]
    const next = current > 0 ? current - 1 : dateMax[dateType]
    const {
      topCurrentNumber,
      topNextNumber,
      bottomCurrentNumber,
      bottomNextNumber,
    } = dateElements[dateType]

    topCurrentNumber.textContent = zeroPad(current)
    topNextNumber.textContent = zeroPad(next)
    bottomCurrentNumber.textContent = zeroPad(current)
    bottomNextNumber.textContent = zeroPad(next)
  })
}

const setValue = (current, dateType) => {
  const next = current > 0 ? current - 1 : dateMax[dateType]
  const {
    topCurrentWrapper,
    topCurrentNumber,
    topNextNumber,
    bottomNextWrapper,
    bottomCurrentNumber,
    bottomNextNumber,
  } = dateElements[dateType]

  topCurrentWrapper.classList.add('top__current--flip')
  setTimeout(() => {
    topCurrentNumber.textContent = zeroPad(current)
    topNextNumber.textContent = zeroPad(next)
    topCurrentWrapper.classList.remove('top__current--flip')
  }, animationDuration)

  setTimeout(() => {
    bottomNextWrapper.classList.add('bottom__next--flip')
    setTimeout(() => {
      bottomCurrentNumber.textContent = zeroPad(current)
      bottomNextNumber.textContent = zeroPad(next)
      bottomNextWrapper.classList.remove('bottom__next--flip')
    }, animationDuration)
  }, animationDuration)
}

// check if there is a date in local storage
// if there isn't, save the default date in it
const getDate = () => {
  if (localStorage.getItem(localStorageKey)) {
    const today = dayjs()
    const localStorageDate = dayjs(localStorage.getItem(localStorageKey))
    const millisecondsDiff = localStorageDate.diff(today)

    if (millisecondsDiff < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

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

const startCountdown = () => {
  const date = getDate()

  setInitialValues(date)

  const countdown = rxjs.timer(0, 1_000).subscribe(() => {
    // if all values are zero, stop the countdown
    if (Object.values(date).every((value) => value === 0)) {
      return countdown.unsubscribe()
    }

    // check if it should update the days
    if (date.hours === 0 && date.minutes === 0 && date.seconds === 0) {
      date.days = date.days - 1
      setValue(date.days, 'days')
    }

    // check if it should update the hours
    if (date.minutes === 0 && date.seconds === 0) {
      date.hours = date.hours > 0 ? date.hours - 1 : dateMax.hours
      setValue(date.hours, 'hours')
    }

    // check if it should update the minutes
    if (date.seconds === 0) {
      date.minutes = date.minutes > 0 ? date.minutes - 1 : dateMax.minutes
      setValue(date.minutes, 'minutes')
    }

    // update the seconds
    date.seconds = date.seconds > 0 ? date.seconds - 1 : dateMax.seconds
    setValue(date.seconds, 'seconds')
  })
}

window.addEventListener('load', startCountdown)
