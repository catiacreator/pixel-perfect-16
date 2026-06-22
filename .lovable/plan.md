## Objetivo

Receber 30 imagens de referência, guardá-las no CDN da Lovable Assets de forma organizada, analisar cada uma e reproduzir o seu visual/layout no projeto Paraíso Digital exatamente como mostrado.

## Fluxo de trabalho

### 1. Receção e catalogação
Quando enviares as 30 imagens numa mensagem, vou:
- Listar todas as imagens recebidas
- Para cada uma, identificar a que página/secção do site corresponde (Home, Pilar 1, Pilar 2, aulas, Consultoria IA, Doc Mestre, etc.) — peço confirmação se houver dúvidas
- Propor um esquema de nomenclatura semântica antes de fazer upload

### 2. Upload para Lovable Assets (CDN)
- Cada imagem é carregada via `lovable-assets create --file ...`
- Cada upload gera um ficheiro `.asset.json` em `src/assets/<categoria>/<nome>.<ext>.asset.json`
- Organização por pasta:
  ```text
  src/assets/
    home/
    pilar-1/
    pilar-2/
    consultoria/
    doc-mestre/
    shared/
  ```
- Os binários originais não ficam no repo — só os pointers `.asset.json`

### 3. Análise visual de cada imagem
Para cada referência, identifico:
- Layout (grelha, hero, cards, lista, etc.)
- Tipografia (tamanhos, pesos, hierarquia)
- Paleta de cores efetivamente usada
- Espaçamentos e respiração
- Componentes presentes (botões, badges, ícones, accordions)
- Estado/interação visível

### 4. Implementação fiel ao mockup
- Para cada imagem, edito a página/componente correspondente para corresponder exatamente
- Uso os tokens já definidos em `src/styles.css` (cream, terracotta, gold, Lora, Work Sans)
- Se a imagem exigir uma cor/token novo, adiciono ao design system em vez de hardcoded
- Imagens que sejam conteúdo visual (hero, ilustrações) entram no JSX via `import asset from "./....asset.json"; <img src={asset.url} />`
- Imagens que sejam apenas referência de design (mockups de UI) NÃO entram no site — servem só de guia visual; são guardadas em `src/assets/_refs/` e podem ser apagadas depois

### 5. Verificação
- Após cada lote de alterações, screenshot da rota afetada e comparação lado a lado com a referência
- Ajustes finos até o resultado bater certo

## Premissas

- **Destino**: Lovable Assets CDN (confirmado)
- **Nomes**: renomeados semanticamente (confirmado)
- **Envio**: todas as 30 numa só mensagem (confirmado)
- **Tarefa**: reproduzir visualmente cada imagem no site existente

## O que NÃO vou fazer

- Não vou alterar a estrutura de rotas já portada
- Não vou substituir o stack (mantém-se TanStack Start + Tailwind v4)
- Não vou adicionar Lovable Cloud (não é necessário para este trabalho)
- Não vou inventar conteúdo — se uma imagem tiver texto ilegível, pergunto

## Próximo passo

Após aprovação deste plano, envia as 30 imagens. Vou processá-las e implementar.