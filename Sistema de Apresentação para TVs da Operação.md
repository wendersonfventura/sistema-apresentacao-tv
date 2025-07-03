# Sistema de Apresentação para TVs da Operação

## 🎯 Visão Geral

O Sistema de Apresentação foi desenvolvido especificamente para facilitar a comunicação visual com os operadores através de TVs, alternando automaticamente entre imagens institucionais e visualização em tempo real dos sistemas internos da operação.

## 🔗 Links de Acesso

### Interface Administrativa (Com Senha)
**URL:** https://zmhqivcgjlok.manus.space
**Senha:** `admin123`

### Modo de Exibição para TV
**URL:** https://zmhqivcgjlok.manus.space/display.html

## 📋 Funcionalidades Implementadas

### Interface Administrativa
- ✅ **Login com senha** para acesso seguro
- ✅ **Upload de imagens** (JPG, PNG até 10MB)
- ✅ **Gerenciamento de ordem** de exibição das imagens
- ✅ **Configuração de tempo** de exibição por slide
- ✅ **Gerenciamento de links** de sistemas externos
- ✅ **Interface responsiva** para diferentes dispositivos

### Modo de Exibição para TV
- ✅ **Tela cheia** sem controles visíveis
- ✅ **Alternância automática** entre imagens e sistemas
- ✅ **Ciclo contínuo** sem intervenção
- ✅ **Otimizado para visualização** à distância
- ✅ **Indicadores visuais** de status e progresso
- ✅ **Tratamento de erros** com reconexão automática

## 🏢 Sistemas Pré-Configurados

O sistema já vem com os seguintes links configurados:

1. **DSS Dashboard - Painel de Agentes**
   - URL: https://dss21.redeservice.com.br/DSS/Dashboard/PainelAgentes.aspx
   - Duração: 45 segundos

2. **Sistema de Atendimento - Dashboard**
   - URL: https://atendimento.redeservice.com.br/v2/admin/dashboard_cliente_sem_resposta_lista.aspx
   - Duração: 45 segundos

## 🚀 Como Usar

### 1. Configuração Inicial

1. Acesse a **Interface Administrativa**: https://zmhqivcgjlok.manus.space
2. Faça login com a senha: `admin123`
3. Navegue pelas seções usando o menu lateral

### 2. Gerenciar Imagens

1. Vá para a seção **"Imagens"**
2. Arraste e solte imagens ou clique para selecionar
3. Configure o tempo de exibição de cada imagem
4. Use o botão "Reordenar" para alterar a sequência

### 3. Gerenciar Sistemas

1. Vá para a seção **"Links de Sistemas"**
2. Adicione novos sistemas preenchendo:
   - Nome do sistema
   - URL completa
   - Tempo de exibição (em segundos)
3. Edite ou remova sistemas existentes

### 4. Configurar TVs

1. Abra o **Modo de Exibição** em cada TV: https://zmhqivcgjlok.manus.space/display.html
2. Coloque o navegador em **tela cheia** (F11)
3. O sistema iniciará automaticamente o ciclo de apresentação

## 🔄 Fluxo de Funcionamento

O sistema segue este ciclo automático:

```
Imagem 1 → Imagem 2 → ... → Imagem N → Sistema 1 → Sistema 2 → Repetir
```

- **Imagens**: Exibidas conforme tempo configurado (padrão: 10s)
- **Sistemas**: Exibidos conforme tempo configurado (padrão: 45s)
- **Transições**: Suaves com efeitos visuais
- **Reconexão**: Automática em caso de erro

## 🛠️ Recursos Técnicos

### Tecnologias Utilizadas
- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Banco de Dados**: SQLite
- **Hospedagem**: Manus Cloud (permanente)

### Características
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Cross-browser**: Compatível com Chrome, Edge, Firefox
- **Offline-ready**: Funciona mesmo com conexão instável
- **Auto-refresh**: Atualização automática de conteúdo

## 🔐 Segurança

- **Autenticação**: Interface administrativa protegida por senha
- **Sessões**: Controle de acesso com timeout automático
- **Uploads**: Validação de tipos e tamanhos de arquivo
- **CORS**: Configurado para acesso seguro

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari

### Dispositivos
- ✅ TVs com navegador
- ✅ Computadores desktop
- ✅ Tablets
- ✅ Smartphones

## 🎛️ Controles Especiais (Modo TV)

Durante a exibição, você pode usar:
- **Seta Direita / Espaço**: Próximo slide
- **Seta Esquerda**: Slide anterior
- **R**: Reiniciar apresentação
- **F**: Alternar tela cheia

## 🔧 Manutenção

### Adicionar Novos Sistemas
1. Acesse a interface administrativa
2. Vá para "Links de Sistemas"
3. Preencha o formulário e clique "Adicionar Sistema"

### Atualizar Imagens
1. Acesse a interface administrativa
2. Vá para "Imagens"
3. Faça upload das novas imagens
4. Remova imagens antigas se necessário

### Alterar Senha de Acesso
Para alterar a senha padrão, será necessário contato técnico.

## 📞 Suporte

Para suporte técnico ou customizações adicionais:
- O sistema é totalmente escalável
- Novas funcionalidades podem ser adicionadas
- Personalização visual disponível
- Integração com outros sistemas possível

## 🎨 Personalização Futura

O sistema foi desenvolvido pensando em escalabilidade:
- ✨ Adição de logo da empresa
- 🎨 Personalização de cores e temas
- 📊 Relatórios de visualização
- 🔔 Notificações em tempo real
- 📅 Agendamento de conteúdo
- 👥 Múltiplos usuários administrativos

---

**Sistema desenvolvido e implantado com sucesso!** 🚀

O sistema está totalmente funcional e pronto para uso nas TVs da operação. Todos os requisitos solicitados foram implementados e testados.

