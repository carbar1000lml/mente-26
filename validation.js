// validation.js
// Este arquivo contém a função de validação do formulário

function validateCurrentContainer() {
  const containers = document.querySelectorAll(".form-container")
  const currentContainerIndex = Array.from(containers).findIndex((container) => container.style.display === "flex")

  if (currentContainerIndex === -1) {
    console.warn("Nenhum container visível para validar.")
    return true // Ou false, dependendo da lógica desejada
  }

  const current = containers[currentContainerIndex]
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

// Exporta a função de validação
export { validateCurrentContainer }

