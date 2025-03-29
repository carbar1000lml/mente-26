// Manipulador de formulário para ambiente de produção e preview
// Este arquivo NÃO é um módulo ES6

// Configurar o manipulador de formulário quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  setupFormHandler()
})

// Configurar o manipulador de formulário
function setupFormHandler() {
  const form = document.getElementById("myForm")

  if (form) {
    form.addEventListener("submit", handleFormSubmit)
    console.log("Manipulador de formulário configurado com sucesso")
  } else {
    console.error("Formulário não encontrado")
  }
}

// Função para lidar com o envio do formulário
async function handleFormSubmit(event) {
  event.preventDefault()

  // Validar o formulário antes de enviar
  if (typeof window.validateCurrentContainer === "function" && !window.validateCurrentContainer()) {
    return
  }

  // Mostrar mensagem de carregamento
  showFlashMessage("Enviando formulário...", "info")

  // Desabilitar o botão de envio para evitar múltiplos envios
  const submitButton = document.getElementById("submitButton")
  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = "Enviando..."
  }

  // Obter dados do formulário
  const formData = new FormData(event.target)
  const formDataObj = {}

  // Converter FormData para objeto
  for (const [key, value] of formData.entries()) {
    formDataObj[key] = value
  }

  console.log("Enviando dados:", formDataObj)

  try {
    // Verificar se o cliente Supabase está disponível
    if (!window.supabaseClient) {
      // Tentar esperar um pouco para ver se o cliente é inicializado
      await new Promise((resolve) => {
        const checkSupabase = () => {
          if (window.supabaseClient) {
            resolve()
          } else {
            setTimeout(checkSupabase, 100)
          }
        }
        checkSupabase()
        // Timeout após 5 segundos
        setTimeout(() => {
          if (!window.supabaseClient) {
            resolve()
          }
        }, 5000)
      })

      // Verificar novamente após a espera
      if (!window.supabaseClient) {
        throw new Error("Cliente Supabase não inicializado")
      }
    }

    // Detectar ambiente (preview ou produção)
    const isPreviewEnvironment =
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("v0.dev")

    // Enviar dados para a tabela "Respostas" no Supabase
    const { data, error } = await window.supabaseClient
      .from(isPreviewEnvironment ? "mock_respostas" : "Respostas")
      .insert([formDataObj])

    if (error) {
      throw error
    }

    console.log("Dados enviados com sucesso:", data)

    // Mostrar mensagem de sucesso
    showFlashMessage("Formulário enviado com sucesso!", "success")

    // Redirecionar para a página de agradecimento após 1 segundo
    setTimeout(() => {
      window.location.href = "obrigado.html"
    }, 1000)
  } catch (error) {
    console.error("Erro ao enviar formulário:", error)
    showFlashMessage("Erro ao enviar formulário. Por favor, tente novamente.", "error")

    // Reativar o botão de envio
    if (submitButton) {
      submitButton.disabled = false
      submitButton.textContent = "Enviar formulário"
    }
  }
}

// Função para mostrar mensagem flash
function showFlashMessage(message, type) {
  const flashMessage = document.getElementById("flashMessage")

  if (flashMessage) {
    flashMessage.textContent = message
    flashMessage.className = `flash-message ${type} show`

    setTimeout(() => {
      flashMessage.classList.remove("show")
    }, 5000)
  }
}

// Expor funções globalmente
window.setupFormHandler = setupFormHandler
window.handleFormSubmit = handleFormSubmit
window.showFlashMessage = showFlashMessage

