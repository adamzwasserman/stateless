// Copy to clipboard functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.textContent
      btn.textContent = 'copied!'
      setTimeout(() => {
        btn.textContent = originalText
      }, 2000)
    })
  })
})

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})
