(function () {
  'use strict';

  const LEVEL_LABELS = {
    high:   'Atenção alta',
    medium: 'Atenção média',
    low:    'Tranquilo',
  };

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCAN_DURATION_MS = prefersReducedMotion ? 300 : 1100;

  const EXTENSION_ICON_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect width="24" height="24" rx="6" fill="#0B5C7A"/>' +
      '<path d="M7 8h10M7 12h6M7 16h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M14.5 16.2l1.8 1.8 3.2-3.6" stroke="#8FE0B0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  const SITES = [
    {
      name: 'Pedidoz',
      label: 'Pedidoz (entregas)',
      url: 'pedidoz.example/cadastro',
      formTitle: 'Crie sua conta',
      submitLabel: 'Criar conta',
      updatedAt: '12/03/2026',
      clauses: [
        { topic: 'Localização', level: 'high',
          original: 'O USUÁRIO autoriza, de forma irrevogável, a coleta contínua de dados de geolocalização, inclusive quando o aplicativo estiver em segundo plano, para fins de otimização de rotas, personalização de ofertas e aprimoramento dos serviços, podendo tais dados ser compartilhados com parceiros comerciais e terceiros afiliados.',
          simple: 'O app vai saber onde você está o tempo todo, até com o app fechado. Essa informação pode ser passada para outras empresas parceiras.' },
        { topic: 'Mudança das regras', level: 'medium',
          original: 'A EMPRESA reserva-se o direito de, a seu exclusivo critério e a qualquer tempo, modificar os presentes Termos, independentemente de aviso prévio, considerando-se tacitamente aceitas as alterações pelo uso continuado da plataforma.',
          simple: 'A empresa pode mudar as regras quando quiser, sem avisar. Se você continuar usando o app, vale como se tivesse concordado.' },
        { topic: 'Cancelar um pedido', level: 'medium',
          original: 'Cancelamentos efetuados após a confirmação do estabelecimento estarão sujeitos à retenção de até 100% (cem por cento) do valor do pedido, a título de multa compensatória.',
          simple: 'Se você cancelar depois que a loja confirmar, pode perder até o valor total do pedido.' },
        { topic: 'Sua senha', level: 'low',
          original: 'O USUÁRIO é o único responsável pela guarda e sigilo de suas credenciais de acesso, respondendo por todas as operações realizadas mediante o uso das mesmas.',
          simple: 'Cuide da sua senha. Se alguém usar sua conta, a responsabilidade é sua.' },
        { topic: 'Onde resolver problemas na Justiça', level: 'medium',
          original: 'Fica eleito o foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja, para dirimir quaisquer controvérsias oriundas do presente instrumento.',
          simple: 'Se houver um processo, ele acontece em São Paulo, mesmo que você more em outro lugar. Em contratos de consumo, esse tipo de cláusula costuma poder ser questionado.' },
      ],
    },
    {
      name: 'Conectar+',
      label: 'Conectar+ (rede social)',
      url: 'conectarmais.example/entrar',
      formTitle: 'Crie seu perfil',
      submitLabel: 'Criar perfil',
      updatedAt: '03/02/2026',
      clauses: [
        { topic: 'Uso das suas fotos e textos', level: 'high',
          original: 'O USUÁRIO concede à EMPRESA licença mundial, não exclusiva, gratuita, sublicenciável e transferível para usar, reproduzir, modificar e distribuir todo o conteúdo por ele publicado na plataforma.',
          simple: 'Suas fotos e textos podem ser usados pela empresa e repassados a outras empresas, no mundo todo, sem você receber nada por isso.' },
        { topic: 'Anúncios', level: 'medium',
          original: 'As informações de navegação e interação do USUÁRIO poderão ser utilizadas para a exibição de anúncios direcionados, podendo ser compartilhadas com anunciantes e parceiros de mensuração.',
          simple: 'O que você curte e clica é usado para escolher os anúncios que aparecem para você. Anunciantes podem receber esses dados.' },
        { topic: 'Apagar a conta', level: 'medium',
          original: 'Mesmo após a exclusão da conta, os dados poderão ser mantidos pelo prazo necessário ao cumprimento de obrigações legais e à tutela de legítimos interesses da EMPRESA.',
          simple: 'Apagar a conta não apaga tudo. Alguns dados ficam guardados por um tempo.' },
        { topic: 'Bloqueio da conta', level: 'medium',
          original: 'A EMPRESA poderá suspender ou encerrar a conta do USUÁRIO a seu exclusivo critério, sem necessidade de justificativa prévia.',
          simple: 'A empresa pode bloquear sua conta quando quiser, sem explicar o motivo antes.' },
        { topic: 'Idade mínima', level: 'low',
          original: 'A utilização da plataforma é restrita a pessoas com idade igual ou superior a 13 (treze) anos.',
          simple: 'Você precisa ter pelo menos 13 anos para usar a rede.' },
      ],
    },
    {
      name: 'StreamBox',
      label: 'StreamBox (assinatura)',
      url: 'streambox.example/assinar',
      formTitle: 'Assine agora',
      submitLabel: 'Assinar',
      updatedAt: '20/01/2026',
      clauses: [
        { topic: 'Cobrança automática', level: 'medium',
          original: 'A assinatura será renovada automaticamente por períodos iguais e sucessivos, mediante cobrança no meio de pagamento cadastrado, até que o USUÁRIO solicite o cancelamento.',
          simple: 'A cobrança se repete sozinha todo mês no seu cartão, até você cancelar.' },
        { topic: 'Preço', level: 'medium',
          original: 'A EMPRESA poderá reajustar os valores da assinatura a qualquer tempo, mediante comunicação prévia com antecedência mínima de 30 (trinta) dias.',
          simple: 'O preço pode subir. Você será avisado pelo menos 30 dias antes.' },
        { topic: 'Reembolso', level: 'medium',
          original: 'Não haverá reembolso proporcional por período não utilizado, ainda que o cancelamento ocorra antes do término do ciclo de cobrança vigente.',
          simple: 'Se você cancelar no meio do mês, não devolvem o que sobrou do período já pago.' },
        { topic: 'Dividir a senha', level: 'medium',
          original: 'O compartilhamento de credenciais com pessoas não pertencentes ao mesmo domicílio poderá ensejar a suspensão do acesso.',
          simple: 'Dividir a senha com quem não mora com você pode fazer a conta ser bloqueada.' },
        { topic: 'Recomendações', level: 'low',
          original: 'As informações de visualização do USUÁRIO são utilizadas exclusivamente para fins de recomendação de conteúdo dentro da plataforma.',
          simple: 'Guardamos o que você assiste só para sugerir filmes e séries dentro do app.' },
      ],
    },
  ];

  let state = createState(0);
  let scanTimer = null;

  function createState(siteIndex, simplifiedCount = 0) {
    return {
      siteIndex,                    
      simplifiedCount,             

     
      isPopupOpen: false,
      autoTranslate: true,         
      warnBeforeAccept: true,       

  
      isTermsOpen: false,
      hasOpenedTerms: false,        
      isScanning: false,            
      isSimplified: false,          
      termsView: 'simple',          

      
      isChecked: false,             
      errorMessage: '',
      isSignupDone: false,

      
      alertType: null,
      hasConfirmedWarning: false,
    };
  }

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, attributes, ...children) {
    const element = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (name) {
      const value = attributes[name];
      if (name === 'text') element.textContent = value;
      else if (name === 'class') element.className = value;
      else if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
      else element.setAttribute(name, value);
    });
    children.forEach(function (child) {
      if (child == null) return;
      element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return element;
  }

  function createIcon() {
    const span = el('span');
    span.innerHTML = EXTENSION_ICON_SVG;
    span.style.display = 'contents';
    return span;
  }

  function currentSite() {
    return SITES[state.siteIndex];
  }

  function countByLevel() {
    const counts = { high: 0, medium: 0, low: 0 };
    currentSite().clauses.forEach(function (clause) { counts[clause.level]++; });
    return counts;
  }

  function levelClass(level) {
    return 'level-' + level;
  }


  function resetDemo(siteIndex) {
    clearTimeout(scanTimer);
    state = createState(siteIndex, state.simplifiedCount);
    render();
  }


  function startScan() {
    clearTimeout(scanTimer);
    state.isScanning = true;
    state.isSimplified = false;
    render();

    scanTimer = setTimeout(function () {
      state.isScanning = false;
      state.isSimplified = true;
      state.termsView = 'simple';
      state.simplifiedCount++;
      render();
    }, SCAN_DURATION_MS);
  }

  function openTerms() {
    state.isTermsOpen = true;
    state.hasOpenedTerms = true;
    state.alertType = null;
    if (state.autoTranslate && !state.isSimplified) {
      startScan();   
    } else {
      render();
    }
  }

  function closeTerms() {
    state.isTermsOpen = false;
    render();
  }

  function togglePopup() {
    state.isPopupOpen = !state.isPopupOpen;
    render();
  }

  function completeSignup() {
    state.alertType = null;
    state.isSignupDone = true;
    state.hasConfirmedWarning = true;
    render();
  }

  function handleSubmit() {
    if (!state.isChecked) {
      state.errorMessage = 'Aceite os termos para continuar.';
      render();
      return;
    }
    state.errorMessage = '';

    if (state.warnBeforeAccept) {
      if (!state.hasOpenedTerms) {
        state.alertType = 'unread';        
        render();
        return;
      }
      if (countByLevel().high > 0 && !state.hasConfirmedWarning) {
        state.alertType = 'warning';       
        render();
        return;
      }
    }
    completeSignup();
  }

  function scrollToClause(index) {
    state.termsView = 'simple';
    render();
    const target = document.querySelector('[data-clause="' + index + '"]');
    if (target) {
      target.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }


  function render() {
    renderSitePicker();
    renderToolbar();
    renderSettingsPopup();
    renderSignupPage();
    renderTermsDialog();
    renderPanel();
    renderAlert();
  }

  function renderSitePicker() {
    const picker = $('site-picker');
    picker.textContent = '';
    picker.appendChild(el('span', { text: 'Site de exemplo:' }));

    SITES.forEach(function (site, index) {
      picker.appendChild(el('button', {
        type: 'button',
        'aria-pressed': String(state.siteIndex === index),
        text: site.label,
        onclick: function () { resetDemo(index); },
      }));
    });
  }

  function renderToolbar() {
    $('address-bar').textContent = '🔒 ' + currentSite().url;

    const button = $('ext-button');
    button.innerHTML = EXTENSION_ICON_SVG;
    button.setAttribute('aria-expanded', String(state.isPopupOpen));

    const counts = countByLevel();
    if (state.isScanning) {
      button.appendChild(el('span', { class: 'ext-badge is-waiting', text: '…' }));
    } else if (state.isSimplified) {
      const attentionPoints = counts.high + counts.medium;
      const alertClass = counts.high > 0 ? ' is-alert' : '';
      button.appendChild(el('span', { class: 'ext-badge' + alertClass, text: String(attentionPoints) }));
    }
  }

  function renderSettingsPopup() {
    const popup = $('settings-popup');
    popup.textContent = '';
    popup.hidden = !state.isPopupOpen;
    if (!state.isPopupOpen) return;

    popup.appendChild(el('h2', { text: 'LawCore' }));
    popup.appendChild(createSettingRow('Traduzir automaticamente', 'autoTranslate'));
    popup.appendChild(createSettingRow('Avisar antes de aceitar', 'warnBeforeAccept'));

    const total = state.simplifiedCount;
    const summary = total === 1 ? ' termo simplificado.' : ' termos simplificados.';
    popup.appendChild(el('small', { text: 'Ativo em todos os sites. Nesta sessão: ' + total + summary }));
  }

  function createSettingRow(label, stateKey) {
    const checkbox = el('input', { type: 'checkbox', role: 'switch' });
    checkbox.checked = state[stateKey];
    checkbox.addEventListener('change', function () {
      state[stateKey] = checkbox.checked;
      render();
    });
    return el('label', { class: 'setting-row' }, el('span', { text: label }), checkbox);
  }

  function renderSignupPage() {
    const site = currentSite();
    const page = $('fake-site');
    page.textContent = '';
    page.appendChild(el('div', { class: 'fake-site-header', text: site.name }));

    const card = el('div', { class: 'signup-card' });
    if (state.isSignupDone) {
      appendSuccessMessage(card, site);
    } else {
      appendSignupForm(card, site);
    }
    page.appendChild(el('div', { class: 'fake-site-main' }, card));
  }

  function appendSuccessMessage(card, site) {
    card.appendChild(el('div', {
      class: 'success-message',
      text: 'Tudo certo (simulação). Sua conta no ' + site.name + ' foi criada.',
    }));
    card.appendChild(el('button', {
      type: 'button', class: 'secondary-button', text: 'Recomeçar',
      onclick: function () { resetDemo(state.siteIndex); },
    }));
  }

  function appendSignupForm(card, site) {
    card.appendChild(el('h2', { text: site.formTitle }));

    card.appendChild(el('input', { class: 'text-field', type: 'text', placeholder: 'Nome completo', 'aria-label': 'Nome completo', tabindex: '-1', readonly: '' }));
    card.appendChild(el('input', { class: 'text-field', type: 'text', placeholder: 'E-mail', 'aria-label': 'E-mail', tabindex: '-1', readonly: '' }));

    const checkbox = el('input', { type: 'checkbox', id: 'agree' });
    checkbox.checked = state.isChecked;
    checkbox.addEventListener('change', function () {
      state.isChecked = checkbox.checked;
      state.errorMessage = '';
      render();
    });
    const termsLink = el('button', {
      type: 'button', class: 'link-button', text: 'Termos de Uso',
      onclick: function (event) { event.preventDefault(); openTerms(); },
    });
    card.appendChild(el('div', { class: 'consent-row' }, checkbox, el('label', { for: 'agree' }, 'Li e aceito os ', termsLink)));

    card.appendChild(el('div', { class: 'form-error', text: state.errorMessage, 'aria-live': 'polite' }));
    card.appendChild(el('button', { type: 'button', class: 'submit-button', text: site.submitLabel, onclick: handleSubmit }));
  }

  function renderTermsDialog() {
    const overlay = $('terms-overlay');

    const oldBody = overlay.querySelector('.terms-body');
    const scrollPosition = oldBody ? oldBody.scrollTop : 0;

    overlay.textContent = '';
    overlay.hidden = !state.isTermsOpen;
    if (!state.isTermsOpen) return;

    const site = currentSite();
    const showTranslated = state.isSimplified && state.termsView === 'simple';

    const body = el('div', { class: 'terms-body' });
    if (showTranslated) {
      body.appendChild(el('div', { class: 'translated-banner', text: 'Traduzido para linguagem simples pelo LawCore' }));
    }
    site.clauses.forEach(function (clause, index) {
      body.appendChild(showTranslated ? createTranslatedClause(clause, index) : createOriginalClause(clause, index));
    });

    const header = el('div', { class: 'terms-header' },
      el('div', null,
        el('h3', { text: 'Termos de Uso' }),
        el('small', { text: site.name + ' · atualizado em ' + site.updatedAt })),
      el('button', { type: 'button', class: 'close-button', text: 'Fechar', onclick: closeTerms }));

    overlay.appendChild(el('div', { class: 'terms-dialog', role: 'dialog', 'aria-label': 'Termos de Uso' }, header, body));
    body.scrollTop = scrollPosition;
  }

  function createOriginalClause(clause, index) {
    return el('p', { class: 'legal-text', 'data-clause': String(index), text: (index + 1) + '. ' + clause.original });
  }

  function createTranslatedClause(clause, index) {
    return el('article', { class: 'clause ' + levelClass(clause.level), 'data-clause': String(index) },
      el('h4', null,
        clause.topic,
        el('span', { class: 'level-tag ' + levelClass(clause.level), text: LEVEL_LABELS[clause.level] })),
      el('p', { class: 'clause-simple', text: clause.simple }),
      el('details', null,
        el('summary', { text: 'Ver texto original' }),
        el('p', { text: clause.original })));
  }

  function renderPanel() {
    const panel = $('ext-panel');
    panel.textContent = '';
    panel.hidden = !state.isTermsOpen;
    if (!state.isTermsOpen) return;

    panel.appendChild(el('div', { class: 'panel-header' }, createIcon(), 'LawCore'));

    const body = el('div', { class: 'panel-body' });
    if (state.isScanning)        fillPanelScanning(body);
    else if (state.isSimplified) fillPanelResult(body);
    else                         fillPanelManual(body);
    panel.appendChild(body);
  }

  function fillPanelScanning(body) {
    body.appendChild(el('p', { text: 'Termos de uso detectados nesta página. Analisando…' }));
    const fillClass = prefersReducedMotion ? 'progress-fill no-animation' : 'progress-fill';
    body.appendChild(el('div', { class: 'progress' }, el('i', { class: fillClass })));
  }

  function fillPanelResult(body) {
    const counts = countByLevel();

    body.appendChild(el('p', { text: 'Termos simplificados automaticamente.' }));

    const chips = el('div', { class: 'summary-chips' });
    ['high', 'medium', 'low'].forEach(function (level) {
      if (counts[level] === 0) return;
      chips.appendChild(el('span', { class: 'chip ' + levelClass(level), text: counts[level] + ' ' + LEVEL_LABELS[level].toLowerCase() }));
    });
    body.appendChild(chips);

    const toggle = el('div', { class: 'view-toggle', role: 'group', 'aria-label': 'Versão do texto' });
    [['simple', 'Simples'], ['original', 'Original']].forEach(function (option) {
      toggle.appendChild(el('button', {
        type: 'button',
        'aria-pressed': String(state.termsView === option[0]),
        text: option[1],
        onclick: function () { state.termsView = option[0]; render(); },
      }));
    });
    body.appendChild(toggle);

    const list = el('ul', { class: 'attention-list' });
    currentSite().clauses.forEach(function (clause, index) {
      if (clause.level === 'low') return;
      list.appendChild(el('li', null,
        el('button', { type: 'button', class: levelClass(clause.level), onclick: function () { scrollToClause(index); } },
          el('b', { text: clause.topic }),
          el('span', { text: LEVEL_LABELS[clause.level] }))));
    });
    body.appendChild(list);
    body.appendChild(el('p', { class: 'panel-hint', text: 'Toque em um ponto para ir até a cláusula.' }));
  }


  function fillPanelManual(body) {
    body.appendChild(el('p', { text: 'Termos de uso detectados. A tradução automática está desligada.' }));
    body.appendChild(el('button', { type: 'button', class: 'primary-button', text: 'Simplificar agora', onclick: startScan }));
  }

  function renderAlert() {
    const overlay = $('alert-overlay');
    overlay.textContent = '';
    overlay.hidden = !state.alertType;
    if (!state.alertType) return;

    const box = el('div', { class: 'alert-box', role: 'alertdialog', 'aria-label': 'Aviso do LawCore' });
    const actions = el('div', { class: 'alert-actions' });

    if (state.alertType === 'unread') {
      box.appendChild(el('h3', { text: 'Você ainda não leu os termos' }));
      box.appendChild(el('p', { text: 'Quer ver a versão em linguagem simples antes de continuar?' }));
      actions.appendChild(createSecondaryChoice('Continuar mesmo assim', completeSignup));
      actions.appendChild(el('button', { type: 'button', class: 'primary-button', text: 'Ver versão simples', onclick: openTerms }));
    } else {
      const highClauses = currentSite().clauses.filter(function (clause) { return clause.level === 'high'; });
      const plural = highClauses.length > 1 ? 's' : '';
      box.appendChild(el('h3', { text: 'Atenção antes de continuar' }));
      box.appendChild(el('p', { text: 'Estes termos têm ' + highClauses.length + ' ponto' + plural + ' de atenção alta:' }));

      const list = el('ul');
      highClauses.forEach(function (clause) { list.appendChild(el('li', { text: clause.simple })); });
      box.appendChild(list);

      actions.appendChild(createSecondaryChoice('Continuar mesmo assim', completeSignup));
      actions.appendChild(el('button', { type: 'button', class: 'primary-button', text: 'Voltar e ler', onclick: openTerms }));
    }

    box.appendChild(actions);
    overlay.appendChild(box);
  }

  function createSecondaryChoice(label, onClick) {
    return el('button', { type: 'button', class: 'secondary-choice', text: label, onclick: onClick });
  }

  $('ext-button').addEventListener('click', togglePopup);
  render();

})();