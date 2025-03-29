// Configuração do Supabase para ambiente de produção e preview
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

    // Detectar ambiente (preview ou produção)
    const isPreviewEnvironment =
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("v0.dev")

    let supabaseUrl
    let supabaseKey

    if (isPreviewEnvironment) {
      console.log("Ambiente de preview detectado, usando cliente Supabase simulado")

      // Criar um cliente Supabase simulado para o ambiente de preview
      window.supabaseClient = createMockSupabaseClient()

      // Disparar evento para notificar que o Supabase está pronto
      document.dispatchEvent(new Event("supabaseReady"))

      return
    } else {
      // Ambiente de produção - usar valores reais
      // Estas variáveis são substituídas pelo deploy-script.js durante o deploy
      supabaseUrl = "{{SUPABASE_URL}}"
      supabaseKey = "{{SUPABASE_ANON_KEY}}"

      // Verificar se os placeholders foram substituídos
      if (supabaseUrl.includes("{{") || supabaseKey.includes("{{")) {
        console.warn("Placeholders não substituídos. Usando valores de ambiente se disponíveis.")

        // Tentar usar variáveis de ambiente diretamente (caso estejam disponíveis)
        if (typeof process !== "undefined" && process.env) {
          supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
          supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }

        // Se ainda não tiver valores válidos, usar cliente simulado
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("{{") || supabaseKey.includes("{{")) {
          console.log("Variáveis de ambiente não disponíveis, usando cliente Supabase simulado")
          window.supabaseClient = createMockSupabaseClient()
          document.dispatchEvent(new Event("supabaseReady"))
          return
        }
      }
    }

    // Verificar se temos uma URL válida
    try {
      new URL(supabaseUrl)
    } catch (e) {
      console.error("URL do Supabase inválida:", supabaseUrl)
      console.log("Usando cliente Supabase simulado devido a URL inválida")
      window.supabaseClient = createMockSupabaseClient()
      document.dispatchEvent(new Event("supabaseReady"))
      return
    }

    // Criar o cliente Supabase usando a biblioteca carregada via CDN
    console.log("Inicializando cliente Supabase com URL:", supabaseUrl)
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

    console.log("Cliente Supabase inicializado com sucesso")

    // Disponibilizar o cliente globalmente para outros scripts
    window.supabaseClient = supabaseClient

    // Disparar evento para notificar que o Supabase está pronto
    document.dispatchEvent(new Event("supabaseReady"))
  } catch (error) {
    console.error("Erro ao inicializar o cliente Supabase:", error)
    console.log("Usando cliente Supabase simulado devido a erro")
    window.supabaseClient = createMockSupabaseClient()
    document.dispatchEvent(new Event("supabaseReady"))
  }
}

// Função para criar um cliente Supabase simulado para ambiente de preview
function createMockSupabaseClient() {
  console.log("Criando cliente Supabase simulado")

  // Criar um objeto que simula a API do Supabase
  return {
    from: (table) => ({
      insert: async (data) => {
        console.log(`[MOCK] Inserindo dados na tabela ${table}:`, data)
        // Simular um atraso de rede
        await new Promise((resolve) => setTimeout(resolve, 800))
        return {
          data: { ...data[0], id: "mock-id-" + Date.now() },
          error: null,
        }
      },
      select: async () => {
        console.log(`[MOCK] Selecionando dados da tabela ${table}`)
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
          data: [{ id: "mock-id", created_at: new Date().toISOString() }],
          error: null,
        }
      },
    }),
  }
}

// Expor funções globalmente
window.initSupabase = initSupabase
window.supabaseClient = supabaseClient

