# Guia de Instalação

## Método 1: Chrome Web Store (Recomendado)

A maneira mais fácil de instalar o TextAlchemy é através da Chrome Web Store:

1. Visite a [Chrome Web Store](https://chrome.google.com/webstore) (link em breve)
2. Pesquise por "TextAlchemy"
3. Clique em "Adicionar ao Chrome"
4. Confirme a instalação
5. A extensão aparecerá na sua barra de ferramentas

## Método 2: Instalação Manual (Modo Desenvolvedor)

Se você quiser instalar a versão mais recente de desenvolvimento:

### Pré-requisitos
- Navegador Google Chrome
- Node.js (para compilar a partir do código fonte)

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/felipebossolani/text-alchemy-chrome-extension.git
cd text-alchemy-chrome-extension
```

### Passo 2: Instalar Dependências
```bash
pnpm install
```

### Passo 3: Compilar a Extensão
```bash
pnpm build:all
```

### Passo 4: Carregar no Chrome
1. Abra o Chrome e vá para `chrome://extensions/`
2. Ative o "Modo desenvolvedor" (alternância no canto superior direito)
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `dist` do projeto
5. A extensão deve aparecer na sua barra de ferramentas

## Método 3: Baixar Versão Pré-compilada

1. Vá para a [página de Releases](https://github.com/felipebossolani/text-alchemy-chrome-extension/releases)
2. Baixe o `text-alchemy-extension.zip` mais recente
3. Extraia o arquivo zip
4. Siga os passos "Carregar como Extensão Não Empacotada" acima

## Verificação

Após a instalação, você deve ver:

1. **Ícone na Barra de Ferramentas**: O ícone roxo do TextAlchemy na sua barra de ferramentas do Chrome
2. **Popup**: Clique no ícone para abrir o formatador de texto
3. **Menu de Contexto**: Clique com o botão direito em qualquer texto para ver as opções "TextAlchemy"

## Solução de Problemas

### Extensão Não Carrega
- Certifique-se de que todos os arquivos estão na estrutura de pastas correta
- Verifique se o `manifest.json` é um JSON válido
- Confirme se o modo desenvolvedor está ativado nas extensões do Chrome

### Erros de Compilação
- Certifique-se de ter o Node.js 20+ instalado
- Tente executar `pnpm install` novamente
- Verifique o console para mensagens de erro específicas

### Extensão Não Funciona
- Tente atualizar a página
- Verifique se a extensão está ativada em `chrome://extensions/`
- Procure por mensagens de erro no console do navegador

## Próximos Passos

Uma vez instalado, confira o [Guia de Início Rápido](/pt/quick-start) para aprender como usar o TextAlchemy efetivamente!

## Suporte

Se você encontrar algum problema:

1. Verifique o [FAQ](/pt/faq) para soluções comuns
2. Pesquise [Issues existentes no GitHub](https://github.com/felipebossolani/text-alchemy-chrome-extension/issues)
3. Crie uma nova issue com informações detalhadas sobre seu problema 