// Smooth scroll for guide navigation
document.querySelectorAll('.guide-nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault()
    const targetId = this.getAttribute('href')
    const target = document.querySelector(targetId)

    if (target) {
      // Update active state
      document.querySelectorAll('.guide-nav-link').forEach(l => l.classList.remove('active'))
      this.classList.add('active')

      // Scroll to section
      const headerOffset = 100
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  })
})

// Update active nav on scroll
const sections = document.querySelectorAll('.guide-article section')
const navLinks = document.querySelectorAll('.guide-nav-link')

function updateActiveNav() {
  let current = ''

  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id')
    }
  })

  navLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active')
    }
  })
}

window.addEventListener('scroll', updateActiveNav)
updateActiveNav()

// Copy code blocks
document.querySelectorAll('.example-block').forEach(block => {
  const codeElement = block.querySelector('code')
  if (codeElement) {
    const copyBtn = document.createElement('button')
    copyBtn.className = 'copy-code-btn'
    copyBtn.textContent = 'copy'
    copyBtn.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--gray-700);
      color: white;
      border: none;
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.2s;
    `

    block.style.position = 'relative'
    block.appendChild(copyBtn)

    block.addEventListener('mouseenter', () => {
      copyBtn.style.opacity = '1'
    })

    block.addEventListener('mouseleave', () => {
      copyBtn.style.opacity = '0'
    })

    copyBtn.addEventListener('click', () => {
      const text = codeElement.textContent
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'copied!'
        setTimeout(() => {
          copyBtn.textContent = 'copy'
        }, 2000)
      })
    })
  }
})
