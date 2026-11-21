/* =========================================================
   FIREGUARD — navegação
   - Mostra uma seção por vez (páginas curtas, sem rolagem longa)
   - Usa o hash da URL (#sobre, #testes...) para permitir links diretos
   - Destaca a seção atual e controla o menu no celular
   ========================================================= */
(function () {
  'use strict';

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var menu = document.getElementById('menu');
  var toggle = document.querySelector('.menu-toggle');
  var main = document.getElementById('conteudo');
  var ids = pages.map(function (p) { return p.id; });
  var first = true;

  // Texto de cada seção, usado nos botões "anterior / próximo"
  var labels = {
    inicio: 'Início', sobre: 'Sobre', componentes: 'Componentes',
    funcionamento: 'Funcionamento', arquitetura: 'Arquitetura',
    desenvolvimento: 'Desenvolvimento', testes: 'Testes e resultados', equipe: 'Equipe', referencias: 'Referências'
  };

  /** Lê o id da seção a partir do hash; volta ao início se for inválido. */
  function currentId() {
    var id = decodeURIComponent(location.hash.replace('#', ''));
    return ids.indexOf(id) !== -1 ? id : ids[0];
  }

  /** Exibe a seção pedida e atualiza o menu. */
  function show(id) {
    pages.forEach(function (p) { p.hidden = p.id !== id; });

    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    var label = labels[id] || '';
    document.title = (id === 'inicio' ? '' : label + ' — ') + 'Fireguard — Documentação do projeto';

    closeMenu();
    window.scrollTo(0, 0);

    // Acessibilidade: leva o foco ao título da seção (exceto no primeiro carregamento)
    if (!first) {
      var title = document.querySelector('#' + id + ' h1, #' + id + ' h2');
      if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
    }
    first = false;
  }

  /** Monta os botões "anterior / próximo" no fim de cada seção. */
  function buildPagers() {
    document.querySelectorAll('[data-pager]').forEach(function (el) {
      var section = el.closest('.page');
      var i = ids.indexOf(section.id);
      var html = '';
      if (i > 0) html += '<a class="btn" href="#' + ids[i - 1] + '">← ' + labels[ids[i - 1]] + '</a>';
      if (i < ids.length - 1) html += '<a class="btn btn-primary" href="#' + ids[i + 1] + '">' + labels[ids[i + 1]] + ' →</a>';
      el.innerHTML = html;
    });
  }

  /* ----- Menu móvel ----- */
  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('.sr-only').textContent = 'Fechar menu';
  }
  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.sr-only').textContent = 'Abrir menu';
  }
  toggle.addEventListener('click', function () {
    toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  // No computador, o menu nunca fica "aberto" por engano
  window.matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);

  /* ----- Inicialização ----- */
  buildPagers();
  window.addEventListener('hashchange', function () { show(currentId()); });
  show(currentId());
})();
