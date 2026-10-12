# LawCore

LawCore é uma demonstração de extensão de navegador para simplificar termos de uso, políticas de privacidade e contratos em linguagem clara e acessível.

A ideia central é ajudar o usuário a identificar cláusulas importantes, entender o texto em linguagem simples e ter uma visão rápida dos pontos que exigem atenção antes de aceitar um contrato ou continuar em uma plataforma.

## Objetivo do projeto

O projeto foi pensado para:

- detectar páginas com termos de uso ou políticas de privacidade;
- extrair o texto relevante sem que o usuário precise copiar e colar manualmente;
- reescrever trechos jurídicos em linguagem simples;
- destacar cláusulas de risco, como compartilhamento de dados, cobrança automática e uso do conteúdo do usuário;
- sinalizar alertas em níveis de prioridade: alta, média e baixa.

## Visão geral

LawCore funciona como uma ferramenta de apoio à leitura de contratos digitais. Ele não substitui assessoria jurídica, mas serve como ponte entre o texto técnico e a compreensão do usuário comum.

A solução combina:

- um manifesto de extensão do navegador (`manifest.json`);
- um script de conteúdo (`content.js`) responsável por detectar e analisar páginas;
- estilos visuais (`content.css`) para a interface do painel;
- uma página de demonstração (`index.html`) para visualizar o comportamento em cenários fictícios.

## Estrutura do projeto

Todos os arquivos ficam na mesma pasta (a raiz do repositório). Os nomes são em minúsculas, porque o GitHub diferencia maiúsculas de minúsculas.

- `manifest.json`: configura a extensão e define o script que roda em todas as páginas.
- `content.js`: lógica principal da extensão. Detecta termos, simplifica o texto, classifica risco e monta o painel lateral com as cláusulas destacadas.
- `content.css`: estilos do painel flutuante exibido sobre a página.
- `index.html`: interface demonstrativa com um navegador falso e exemplos de páginas de cadastro/assinatura.
- `script.js`: comportamento visual da demonstração no navegador de exemplo.
- `style.css`: estilos gerais da interface de demonstração.

## Como funciona

1. O script identifica uma página que parece conter termos de uso ou política de privacidade.
2. Procura o bloco textual relevante na interface.
3. Quebra o texto em trechos e classifica cada trecho por nível de risco.
4. Reformula o texto em linguagem simples.
5. Exibe um painel com os trechos mais relevantes, organizados por atenção alta, média ou tranquila.
6. Permite que o usuário veja o texto original em detalhes.

## Regras de classificação

Os trechos são avaliados com base em palavras-chave e padrões de cláusulas problemáticas. Exemplos:

- localização e coleta contínua de dados;
- uso de conteúdo do usuário por terceiros;
- mudança de termos sem aviso prévio;
- cancelamento e multa;
- cobrança automática;
- reajuste de preços;
- compartilhamento de dados com parceiros ou anunciantes.

## Como executar

### Opção 1: visualização local da demonstração

Abra o arquivo `index.html` em um navegador.

Isso mostra a interface demonstrativa do projeto em um navegador simulado, com páginas de exemplo.

### Opção 2: uso como extensão de navegador

1. Abra o navegador baseado em Chromium (Chrome, Edge, Brave etc.).
2. Acesse a página de extensões do navegador.
3. Ative o modo de desenvolvedor.
4. Carregue a pasta do projeto como extensão.
5. Acesse qualquer página que contenha termos de uso e veja o painel do LawCore aparecer.

Observação: o projeto está em versão de demonstração e não está conectado a um backend real ou a uma API de IA para análise jurídica automatizada.

## Exemplo de fluxo

O usuário entra em uma página de cadastro ou assinatura, clica em “Termos de Uso” e o painel LawCore mostra algo como:

- atenção alta: uso de sua localização;
- atenção média: cobrança automática;
- atenção baixa: responsabilidade sobre a senha ou idade mínima.

Assim, o usuário consegue entender rapidamente os riscos antes de concordar.

## Limitações

- o projeto é uma prova de conceito/demonstração;
- a simplificação textual é manual e baseada em regras pré-definidas;
- a extensão depende do formato e da estrutura HTML da página;
- não substitui análise jurídica profissional.

## Possíveis evoluções futuras

- integração com IA para resumir e interpretar termos jurídicos;
- suporte a múltiplos idiomas;
- extração mais robusta de textos em páginas complexas;
- painel com melhor visualização de risco e filtros por categoria;
- comparação entre versões de contrato ou políticas de privacidade.

## Conclusão

LawCore representa uma proposta prática de tornar a leitura de termos legais mais acessível ao usuário comum. O projeto demonstra como ferramentas de navegador podem ajudar a identificar riscos, traduzir linguagem jurídica para o cotidiano e aumentar a transparência em serviços digitais.
