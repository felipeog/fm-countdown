const init = () => {
  const topCurrentWrapper = document.querySelector('.top__current')
  const topCurrentNumber = document.querySelector('.top__current .top__number')
  const topNextNumber = document.querySelector('.top__next .top__number')

  const bottomNextWrapper = document.querySelector('.bottom__next')
  const bottomCurrentNumber = document.querySelector(
    '.bottom__current .bottom__number',
  )
  const bottomNextNumber = document.querySelector(
    '.bottom__next .bottom__number',
  )

  const initialSeconds = 5

  let topCurrentSeconds = initialSeconds
  let topNextSeconds = topCurrentSeconds - 1
  let bottomCurrentSeconds = topCurrentSeconds
  let bottomNextSeconds = topNextSeconds

  topCurrentNumber.textContent = topCurrentSeconds
  topNextNumber.textContent = topNextSeconds
  bottomCurrentNumber.textContent = bottomCurrentSeconds
  bottomNextNumber.textContent = bottomNextSeconds

  const intervalId = setInterval(() => {
    topCurrentSeconds = topCurrentSeconds - 1
    topNextSeconds = topCurrentSeconds - 1

    if (topNextSeconds >= -1) {
      topCurrentWrapper.classList.add('top__current--flip')
      setTimeout(() => {
        topCurrentNumber.textContent = topCurrentSeconds
        topNextNumber.textContent = topNextSeconds
        topCurrentWrapper.classList.remove('top__current--flip')
      }, 500)
    }

    if (bottomNextSeconds >= 0) {
      setTimeout(() => {
        bottomCurrentSeconds = bottomCurrentSeconds - 1
        bottomNextSeconds = bottomCurrentSeconds - 1

        bottomNextWrapper.classList.add('bottom__next--flip')
        setTimeout(() => {
          bottomCurrentNumber.textContent = bottomCurrentSeconds
          bottomNextNumber.textContent = bottomNextSeconds
          bottomNextWrapper.classList.remove('bottom__next--flip')
        }, 500)
      }, 500)
    }

    if (topNextSeconds < -1) clearInterval(intervalId)
  }, 1_000)
}

window.addEventListener('load', init)
