// Script de deploy para Vercel
// Este script substitui as variáveis de ambiente nos arquivos de configuração

const fs = require("fs")
const path = require("path")

console.log("🚀 Iniciando script de deploy para Vercel...")

// Função para substituir variáveis de ambiente em um arquivo
function replaceEnvVarsInFile(filePath, replacements) {
  try {
    console.log(`📄 Processando arquivo: ${filePath}`)

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo não encontrado: ${filePath}`)
      return false
    }

    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, "utf8")
    let replaced = false

    // Substituir cada variável
    for (const [placeholder, envVar] of Object.entries(replacements)) {
      const envValue = process.env[envVar]

      if (!envValue) {
        console.warn(`⚠️ Variável de ambiente não encontrada: ${envVar}`)
        continue
      }

      // Substituir a variável no conteúdo
      const regex = new RegExp(placeholder, "g")
      if (content.match(regex)) {
        content = content.replace(regex, envValue)
        replaced = true
        console.log(`✅ Substituído ${placeholder} por valor de ${envVar}`)
      }
    }

    // Se nenhuma substituição foi feita, não reescrever o arquivo
    if (!replaced) {
      console.log(`ℹ️ Nenhuma substituição necessária em: ${filePath}`)
      return false
    }

    // Escrever o conteúdo atualizado de volta para o arquivo
    fs.writeFileSync(filePath, content)
    console.log(`✅ Arquivo atualizado com sucesso: ${filePath}`)
    return true
  } catch (error) {
    console.error(`❌ Erro ao processar arquivo ${filePath}:`, error.message)
    return false
  }
}

// Arquivos a serem processados e suas substituições
const filesToProcess = [
  {
    path: "supabase-config.js",
    replacements: {
      "{{SUPABASE_URL}}": "SUPABASE_URL",
      "{{SUPABASE_ANON_KEY}}": "SUPABASE_ANON_KEY",
    },
  },
]

// Processar cada arquivo
let successCount = 0
for (const file of filesToProcess) {
  const filePath = path.join(process.cwd(), file.path)
  const success = replaceEnvVarsInFile(filePath, file.replacements)
  if (success) successCount++
}

// Relatório final
console.log(`
📊 Relatório de deploy:`)
console.log(`✅ ${successCount} de ${filesToProcess.length} arquivos processados com sucesso`)

if (successCount === filesToProcess.length) {
  console.log("🎉 Deploy preparado com sucesso!")
} else {
  console.warn("⚠️ Deploy preparado com avisos. Verifique os logs acima.")
}

