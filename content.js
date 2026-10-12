(function () {
  'use strict';

  if (window.__lawcoreLoaded) return;
  window.__lawcoreLoaded = true;

  const TERMS_REGEX = /termos de uso|termos e condi[çc][õo]es|pol[ií]tica de privacidade|terms of (use|service)|privacy policy/i;

  const MIN_TERMS_LENGTH = 200;

  const OPEN_DELAY_MS = 700;

  const LEVEL_LABELS = {
    high: 'Atenção alta',
    medium: 'Atenção média',
    none: 'Sem alerta',
  };

  const GLOSSARY = [
    [/a seu exclusivo critério/gi, 'quando quiser'],
    [/reserva-se o direito de/gi, 'pode'],
    [/independentemente de aviso prévio/gi, 'sem avisar antes'],
    [/sem (necessidade de )?aviso prévio/gi, 'sem avisar antes'],
    [/tacitamente/gi, 'sem precisar dizer'],
    [/irrevogável/gi, 'que não dá para desfazer'],
    [/dados de geolocalização/gi, 'sua localização'],
    [/sublicenciável/gi, 'que pode ser repassado a outras empresas'],
    [/a título de/gi, 'como'],
    [/multa compensatória/gi, 'multa'],
    [/legítimos interesses/gi, 'interesses'],
    [/bem como/gi, 'e também'],
    [/terceiros/gi, 'outras empresas'],
    [/rescindir/gi, 'encerrar'],
    [/rescisão/gi, 'encerramento'],
    [/mediante/gi, 'com'],
    [/ensejar/gi, 'causar'],
    [/podendo/gi, 'e pode'],
    [/aprimoramento/gi, 'melhoria'],
    [/utilização/gi, 'uso'],
    [/efetuados?/gi, 'feitos'],
    [/vigência/gi, 'duração'],
    [/finalidade/gi, 'motivo'],
    [/o usuário/gi, 'você'],
    [/do usuário/gi, 'seu'],
    [/ao usuário/gi, 'a você'],
  ];

  const RISK_RULES = [
    ['high',   'Localização',                  /geolocaliza|localiza[çc][ãa]o/i],
    ['high',   'Sem volta',                    /irrevog/i],
    ['high',   'Uso do seu conteúdo',          /sublicenci|licen[çc]a mundial/i],
    ['high',   'Abrir mão de direitos',        /renunci|ren[úu]ncia/i],
    ['high',   'Compartilhamento de dados',    /compartilh\w+[^.]*(terceiros|parceiros)|(terceiros|parceiros)[^.]*compartilh/i],
    ['medium', 'Cobrança automática',          /renov\w*\s+autom/i],
    ['medium', 'Multa ou retenção',            /multa|reten[çc][ãa]o/i],
    ['medium', 'Reembolso',                    /reembolso/i],
    ['medium', 'Mudança ou bloqueio sem aviso', /exclusivo crit[ée]rio|sem (necessidade de )?aviso|aviso pr[ée]vio/i],
    ['medium', 'Preço',                        /reajust/i],
    ['medium', 'Anúncios',                     /an[úu]ncios|publicidade|marketing/i],
    ['medium', 'Suspensão da conta',           /suspen|rescis|encerr/i],
    ['medium', 'Dados pessoais',               /dados pessoais|coleta/i],
    ['medium', 'Cancelamento',                 /cancel/i],
  ];

  function simplifyClauses(rawText) {
    const sentences = rawText
      .split(/(?<=[.;])\s+|\n+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 20; });

    return sentences.map(function (original) {
      return {
        original: original,
        simple: simplifySentence(original),
        ...classifyRisk(original),
      };
    });
  }

  function simplifySentence(sentence) {
    let text = sentence;
    GLOSSARY.forEach(function (rule) { text = text.replace(rule[0], rule[1]); });
    text = text.replace(/\s+/g, ' ').trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function classifyRisk(sentence) {
    for (const rule of RISK_RULES) {
      if (rule[2].test(sentence)) return { level: rule[0], topic: rule[1] };
    }
    return { level: 'none', topic: 'Trecho informativo' };
  }


  function analyze(textElement) {
    const rawText = (textElement.innerText || textElement.textContent || '').trim();
    if (rawText.length < MIN_TERMS_LENGTH) return;

    const clauses = simplifyClauses(rawText);
    if (clauses.length === 0) return;
    showPanel(clauses);
  }

  function isTermsPage() {
    return TERMS_REGEX.test(document.title) || TERMS_REGEX.test(location.pathname);
  }

  function findTermsDialog() {
    const candidates = document.querySelectorAll(
      '[role="dialog"], [aria-modal="true"], dialog, .modal, [class*="terms"], [id*="terms"]'
    );
    for (const candidate of candidates) {
      const text = candidate.innerText || candidate.textContent || '';
      if (text.length >= MIN_TERMS_LENGTH && TERMS_REGEX.test(text)) return candidate;
    }
    return null;
  }

  function watchTermsClicks() {
    document.addEventListener('click', function (event) {
      const target = event.target.closest('a, button, label, [role="button"]');
      if (!target) return;
      const label = target.textContent || '';
      if (label.length > 80 || !TERMS_REGEX.test(label)) return;

      setTimeout(function () {
        const dialog = findTermsDialog();
        if (dialog) analyze(dialog);
      }, OPEN_DELAY_MS);
    }, true);
  }

  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function showPanel(clauses) {
    const old = document.getElementById('lawcore-panel');
    if (old) old.remove();

    const panel = el('aside');
    panel.id = 'lawcore-panel';
    panel.setAttribute('aria-label', 'LawCore');

    const header = el('div', 'lawcore-header');
    header.appendChild(el('strong', null, 'LawCore'));
    const closeButton = el('button', 'lawcore-close', 'Fechar');
    closeButton.type = 'button';
    closeButton.addEventListener('click', function () { panel.remove(); });
    header.appendChild(closeButton);
    panel.appendChild(header);

    const high = clauses.filter(function (c) { return c.level === 'high'; }).length;
    const medium = clauses.filter(function (c) { return c.level === 'medium'; }).length;
    panel.appendChild(el('p', 'lawcore-summary',
      'Termos simplificados: ' + high + ' ponto(s) de atenção alta e ' + medium + ' de atenção média.'));

    const order = { high: 0, medium: 1, none: 2 };
    const sorted = clauses.slice().sort(function (a, b) { return order[a.level] - order[b.level]; });

    const list = el('div', 'lawcore-list');
    sorted.forEach(function (clause) {
      const item = el('article', 'lawcore-clause lawcore-' + clause.level);

      const title = el('h4', 'lawcore-title', clause.topic + ' ');
      title.appendChild(el('span', 'lawcore-tag', LEVEL_LABELS[clause.level]));
      item.appendChild(title);

      item.appendChild(el('p', 'lawcore-simple', clause.simple));

      const details = el('details');
      details.appendChild(el('summary', null, 'Ver texto original'));
      details.appendChild(el('p', 'lawcore-original', clause.original));
      item.appendChild(details);

      list.appendChild(item);
    });
    panel.appendChild(list);

    document.body.appendChild(panel);
  }

  watchTermsClicks();
  if (isTermsPage()) analyze(document.querySelector('main, article') || document.body);

})();