// Funções de navegação do formulário
let currentContainer = 0
let containers

function startSurvey() {
  // Início do formulário - sem validação
  document.getElementById("intro").style.display = "none"
  document.getElementById("myForm").classList.remove("hidden")
  containers = document.querySelectorAll(".form-container")

  // Mostra primeiro container sem validação
  containers.forEach((container) => {
    container.style.display = "none"
    container.style.transform = "translateX(100%)"
    container.style.opacity = "0"
  })

  containers[0].style.display = "flex"
  setTimeout(() => {
    containers[0].style.transform = "translateX(0)"
    containers[0].style.opacity = "1"
  }, 50)

  currentContainer = 0
  updateNavigationButtons()
}

function showContainer(index, direction) {
  // Só valida se estiver indo para frente
  if (direction > 0 && !validateCurrentContainer()) {
    return
  }

  containers.forEach((container) => {
    container.style.display = "none"
    container.style.transform = direction > 0 ? "translateX(100%)" : "translateX(-100%)"
    container.style.opacity = "0"
  })

  containers[index].style.display = "flex"
  setTimeout(() => {
    containers[index].style.transform = "translateX(0)"
    containers[index].style.opacity = "1"
  }, 50)

  currentContainer = index
  updateNavigationButtons()
}

function validateCurrentContainer() {
  const current = containers[currentContainer]
  const requiredRadios = current.querySelectorAll('input[type="radio"][required]')
  const requiredTexts = current.querySelectorAll('input[type="text"][required], input[type="email"][required]')

  // Valida radio buttons
  let radioSelected = false
  for (const radio of requiredRadios) {
    if (radio.checked) {
      radioSelected = true
      break
    }
  }

  if (requiredRadios.length > 0 && !radioSelected) {
    showModal("Por favor, selecione uma opção para continuar")
    return false
  }

  // Valida inputs de texto
  for (const input of requiredTexts) {
    if (!input.value.trim()) {
      showModal(`Por favor, preencha o campo "${input.name}"`)
      input.focus()
      return false
    }
  }

  return true
}

function showModal(message) {
  const modal = document.getElementById("alertModal")
  document.getElementById("modalMessage").textContent = message
  modal.style.display = "block"
}

function closeModal() {
  document.getElementById("alertModal").style.display = "none"
}

function updateNavigationButtons() {
  const prevButtons = document.querySelectorAll('button[onclick*="navigate(-1)"]')
  const nextButtons = document.querySelectorAll('button[onclick*="navigate(1)"]')

  prevButtons.forEach((btn) => {
    btn.disabled = currentContainer === 0
  })

  nextButtons.forEach((btn) => {
    btn.disabled = currentContainer === containers.length - 1
  })
}

function navigate(direction) {
  const newIndex = currentContainer + direction
  if (newIndex >= 0 && newIndex < containers.length) {
    showContainer(newIndex, direction)
  }
}

function autoNext() {
  if (currentContainer >= containers.length - 1) {
    console.log("Última pergunta, não avança")
    return
  }

  if (validateCurrentContainer()) {
    setTimeout(() => navigate(1), 500)
  }
}

// Expor funções globalmente
window.startSurvey = startSurvey
window.showContainer = showContainer
window.validateCurrentContainer = validateCurrentContainer
window.showModal = showModal
window.closeModal = closeModal
window.updateNavigationButtons = updateNavigationButtons
window.navigate = navigate
window.autoNext = autoNext

