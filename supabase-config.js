// Configuração do Supabase para ambiente de produção
// Este arquivo NÃO é um módulo ES6

// Variável global para o cliente Supabase
let supabaseClient

// Inicializar o cliente Supabase quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  initSupabase()
})

// Função para inicializar o cliente Supabase
function initSupabase() {
  try {
    // Verificar se a biblioteca Supabase está carregada via CDN
    if (typeof supabase === "undefined") {
      console.error("Biblioteca Supabase não encontrada. Verifique se o script CDN foi carregado corretamente.")
      return
    }

    // Obter as variáveis de ambiente do Supabase
    // Estas variáveis são substituídas pelo deploy-script.js durante o deploy
    const supabaseUrl = "{{SUPABASE_URL}}"
    const supabaseKey = "{{SUPABASE_ANON_KEY}}"

    // Verificar se os placeholders foram substituídos
    if (supabaseUrl.includes("{{") || supabaseKey.includes("{{")) {
      console.error("Erro: Os placeholders do Supabase não foram substituídos. Verifique o script de deploy.")
      return
    }

    // Criar o cliente Supabase usando a biblioteca carregada via CDN
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

    console.log("Cliente Supabase inicializado com sucesso")

    // Disponibilizar o cliente globalmente para outros scripts
    window.supabaseClient = supabaseClient

    // Disparar evento para notificar que o Supabase está pronto
    document.dispatchEvent(new Event("supabaseReady"))
  } catch (error) {
    console.error("Erro ao inicializar o cliente Supabase:", error)
  }
}

// Expor funções globalmente
window.initSupabase = initSupabase
window.supabaseClient = supabaseClient

