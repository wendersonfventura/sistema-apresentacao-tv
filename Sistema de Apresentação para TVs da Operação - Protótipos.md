# Sistema de Apresentação para TVs da Operação - Protótipos

## Visão Geral

O sistema será composto por duas interfaces principais:

### 1. Interface Administrativa (Com Autenticação)

**Funcionalidades:**
- Upload de imagens (JPG, PNG)
- Gerenciamento da ordem de exibição
- Configuração do tempo de exibição por slide
- Gerenciamento de links de sistemas externos
- Configurações gerais do sistema

**Características do Design:**
- Layout responsivo e moderno
- Sidebar de navegação com seções organizadas
- Área de drag-and-drop para upload de imagens
- Lista visual das imagens com miniaturas
- Controles de reordenação intuitivos
- Configuração de tempo por slide
- Gerenciamento de URLs dos sistemas externos

### 2. Interface de Exibição (Modo TV)

**Funcionalidades:**
- Exibição em tela cheia
- Alternância automática entre slides e sistemas
- Ciclo contínuo sem intervenção
- Otimizada para visualização à distância

**Tipos de Conteúdo Exibido:**

#### A) Slides Institucionais
- Comunicados internos
- Informações corporativas
- Avisos e instruções
- Design limpo e profissional
- Texto grande e legível

#### B) Sistemas Externos (DSSBox, Channels)
- Painéis de monitoramento em tempo real
- Dashboards operacionais
- Métricas e indicadores
- Status de agentes e sistemas

## Fluxo de Funcionamento

1. **Configuração Inicial** (Interface Admin):
   - Upload das imagens institucionais
   - Definição da ordem de exibição
   - Configuração dos tempos (ex: 15s por slide)
   - Cadastro dos links dos sistemas externos

2. **Ciclo de Exibição** (Modo TV):
   - Slide 1 → Slide 2 → ... → Slide N
   - Sistema DSSBox (painel de agentes)
   - Slide 1 → Slide 2 → ... → Slide N  
   - Sistema Channels (monitoramento)
   - Repetição contínua

## Especificações Técnicas

### Tecnologias Propostas:
- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Banco de Dados**: SQLite (para configurações)
- **Upload**: Suporte a JPG, PNG
- **Responsividade**: CSS Grid/Flexbox

### Recursos Especiais:
- **Iframe Integration**: Para exibição dos sistemas externos
- **Session Management**: Para manter logins ativos nos sistemas
- **Auto-refresh**: Para atualização automática dos dashboards
- **Fullscreen API**: Para modo de exibição em tela cheia
- **Local Storage**: Para configurações do cliente

### Estrutura de URLs:
- `/admin` - Interface administrativa (com autenticação)
- `/display` - Modo de exibição para TV
- `/api/upload` - Endpoint para upload de imagens
- `/api/config` - Configurações do sistema

## Próximos Passos

1. Validação dos protótipos com o usuário
2. Desenvolvimento da estrutura base
3. Implementação das funcionalidades administrativas
4. Desenvolvimento do modo de exibição
5. Testes e ajustes finais
6. Implantação e configuração

## Observações

- O sistema será totalmente baseado em navegador
- Compatível com Chrome, Edge e outros navegadores modernos
- Design otimizado para TVs de diferentes tamanhos
- Possibilidade de expansão futura com novas funcionalidades

