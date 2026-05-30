/* ============================================================
   AURUM · Llave Maestra — App (vanilla, data-driven)
   Vistas: "Por programa" (listas por categoría) y
           "Por espacio" (dossier completo de un ambiente).
   ============================================================ */
(function () {
  "use strict";
  var D = (function () {
    try { var s = localStorage.getItem("aurum_data_v1"); if (s) { var o = JSON.parse(s); if (o && o.meta && o.products) return o; } } catch (e) {}
    return window.AURUM;
  })();
  var SEL_KEY = "aurum_sel_v2";
  var VIEW_KEY = "aurum_view_v1";
  var SPACE_KEY = "aurum_space_v1";
  var CAT_KEY = "aurum_cat_v1";
  var CATS = ["Productos", "Luminarias", "Herrajes", "Equipamiento", "Carpintería", "Acabados"];

  /* Catálogo comprable unificado (todos con precio + liga) */
  var BUYABLE = [].concat(D.products || [], D.lighting || [], D.hardware || [], D.equipment || [], D.carpentry || [], (D.finishes || []).filter(function (f) { return Number(f.price) > 0; }));
  var BUY_BY_ID = {}; BUYABLE.forEach(function (p) { BUY_BY_ID[p.id] = p; });

  /* ---------- helpers ---------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function money(n) { return new Intl.NumberFormat(D.meta.locale || "es-MX", { style: "currency", currency: D.meta.currency || "MXN", maximumFractionDigits: 0 }).format(n); }
  function qn(p) { return Number(p.qty) || 1; }
  function lineTotal(p) { return (Number(p.price) || 0) * qn(p); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  /* Convierte links de Google Drive / Dropbox a imagen directa */
  function imgUrl(u) {
    if (!u) return u;
    u = String(u).trim();
    var m = u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) || u.match(/drive\.google\.com\/open\?id=([^&]+)/) || u.match(/[?&]id=([^&]+)/);
    if (m) return "https://lh3.googleusercontent.com/d/" + m[1];
    if (/dropbox\.com/.test(u)) return u.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace(/([?&])dl=0/, "$1raw=1");
    return u;
  }
  function getJSON(k, f) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } }
  function bySpace(arr, space) { return space === "Todos" ? arr : arr.filter(function (x) { return x.space === space; }); }
  /* Productos sin luminarias: las de category "Iluminación" viven solo en el bloque de Luminarias */
  function realProducts() { return (D.products || []).filter(function (p) { return p.category !== "Iluminación"; }); }
  /* Luminarias = lista de iluminación + cualquier producto categorizado como "Iluminación" */
  function lightingItems() { return (D.lighting || []).concat((D.products || []).filter(function (p) { return p.category === "Iluminación"; })); }
  function emptyState(msg) { return '<p class="empty">' + esc(msg) + '</p>'; }

  /* ---------- estado ---------- */
  var selected = (localStorage.getItem(SEL_KEY) !== null) ? getJSON(SEL_KEY, []) : BUYABLE.map(function (p) { return p.id; });
  if (localStorage.getItem(SEL_KEY) === null) localStorage.setItem(SEL_KEY, JSON.stringify(selected));
  var view = localStorage.getItem(VIEW_KEY) || "programa";
  var space = localStorage.getItem(SPACE_KEY) || "Todos";
  var cat = localStorage.getItem(CAT_KEY) || "Todas";
  function setSel() { localStorage.setItem(SEL_KEY, JSON.stringify(selected)); }

  /* ============================================================
     HEADER / HERO / RESUMEN / PANEL  (estáticos)
     ============================================================ */
  function renderNav() {
    return '<header class="topbar"><div class="wrap topbar__row">' +
      '<a class="brand" href="#top"><span class="brand__mark">Aurum</span><span class="brand__sub">Arquitectos</span></a>' +
      '<nav class="nav" id="nav">' +
        '<a href="#resumen" data-sec="resumen"><span class="nav__num">01</span>Resumen</a>' +
        '<a href="#panel" data-sec="panel"><span class="nav__num">02</span>Concepto</a>' +
        '<a href="#programa" data-sec="programa"><span class="nav__num">03</span>Programa</a>' +
        '<a href="#planos" data-sec="planos"><span class="nav__num">04</span>Planos</a>' +
      '</nav>' +
      '<button class="btn btn--sm" onclick="window.aurumPrint && window.aurumPrint()">Exportar PDF</button>' +
    '</div></header>';
  }

  function fact(l, v) { return '<div class="fact"><span class="label">' + esc(l) + '</span><b>' + esc(v) + '</b></div>'; }
  function renderHero() {
    var m = D.meta;
    var total = D.spaces.reduce(function (s, x) { return s + (x.budget || 0); }, 0);
    var area = D.spaces.reduce(function (s, x) { return s + String(x.surface).split("+").reduce(function (a, b) { return a + (parseFloat(b) || 0); }, 0); }, 0);
    return '<section class="hero" id="top">' +
      '<div class="wrap hero__masthead">' +
        (m.logo
          ? '<img class="hero__logo hero__logo--img" src="' + esc(imgUrl(m.logo)) + '" alt="' + esc(m.studio) + '">'
          : '<image-slot id="aurum-logo" class="hero__logo" fit="contain" position="left center" shape="rect" radius="0" placeholder="Logo Aurum"></image-slot>') +
        '<span class="hero__issue">' + esc(m.code) + ' · Edición ' + esc(m.version) + ' · ' + esc(m.date) + '</span>' +
      '</div>' +
      '<div class="wrap hero__head">' +
        '<span class="hero__kicker">' + esc(m.subtitle) + '</span>' +
        '<h1 class="hero__title"><em>La</em>Llave Maestra</h1>' +
        '<div class="hero__byline"><span>' + esc(m.client) + '</span><span class="hero__dot"></span><span>' + esc(m.lot) + '</span><span class="hero__dot"></span><span>' + esc(m.city) + '</span></div>' +
      '</div>' +
      '<figure class="hero__cover">' +
        (m.heroRender
          ? '<img class="hero__render hero__render--img" src="' + esc(imgUrl(m.heroRender)) + '" alt="Render principal" style="object-position:' + esc(m.heroRenderPos || "center center") + '">'
          : '<image-slot id="hero-render" class="hero__render" fit="cover" placeholder="Render principal del proyecto"></image-slot>') +
        '<figcaption class="hero__cover-cap"><span class="label">Render conceptual</span>' + esc(D.concept.style) + '</figcaption>' +
      '</figure>' +
      '<div class="wrap hero__below">' +
        '<p class="hero__lead">' + esc(D.concept.statement) + '</p>' +
        '<div class="factstrip">' + fact("Estilo", D.concept.style) + fact("Espacios", D.spaces.length + " ambientes") + fact("Superficie", Math.round(area) + " m²") + fact("Inversión est.", money(total)) + '</div>' +
      '</div>' +
    '</section>';
  }

  function renderResumen() {
    var c = D.concept;
    var pillars = c.pillars.map(function (p, i) { return '<div class="pillar"><span class="n">0' + (i + 1) + '</span><h5>' + esc(p.t) + '</h5><p>' + esc(p.d) + '</p></div>'; }).join("");
    var body = c.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("");
    var rows = D.spaces.map(function (s) {
      return '<div class="space-row">' +
        '<div class="space-row__name"><span class="lvl">' + esc(s.level) + '</span>' + esc(s.name) + '</div>' +
        '<div class="cell"><span class="label">Sup. m²</span><span class="tnum">' + esc(s.surface) + '</span></div>' +
        '<div class="cell"><span class="label">Dimensiones</span><span class="tnum">' + esc(s.dims) + '</span></div>' +
        '<div class="cell"><span class="label">Acabados</span><span>' + esc(s.floor) + ' · ' + esc(s.walls) + '</span></div>' +
        '<div class="space-row__budget"><span class="label">Presupuesto</span>' + money(s.budget) + '</div>' +
      '</div>';
    }).join("");
    var totalBudget = D.spaces.reduce(function (s, x) { return s + (x.budget || 0); }, 0);
    var totalRow = '<div class="space-row space-row--total"><div class="space-row__name">Total de interiores</div><div class="cell"></div><div class="cell"></div><div class="cell"><span class="label">' + D.spaces.length + ' espacios</span></div><div class="space-row__budget">' + money(totalBudget) + '</div></div>';
    return '<section class="section" id="resumen"><div class="wrap">' +
      '<div class="section__head"><div><div class="section__kicker"><span class="num">' + esc(c.sectionCode) + '</span><span class="label">Resumen de Interiores</span></div><h2 class="section__title">Concepto de diseño</h2></div><p class="section__note">Una lectura del proyecto antes de entrar al detalle de cada ambiente.</p></div>' +
      '<div class="concept"><div>' + body + '</div><aside class="concept__aside"><span class="label">El estilo</span><h4>' + esc(c.style) + '</h4><p>' + esc(c.definition) + '</p></aside></div>' +
      '<div class="pillars">' + pillars + '</div>' +
      '<div class="section__head" style="margin-top:64px;margin-bottom:14px;"><div><div class="section__kicker"><span class="num">01.B</span><span class="label">Características de los espacios</span></div></div></div>' +
      '<div class="spaces">' + rows + totalRow + '</div>' +
    '</div></section>';
  }

  function renderPanel() {
    var md = D.mood;
    var tiles = md.tiles.map(function (t) {
      var inner = t.img ? '<img src="' + esc(imgUrl(t.img)) + '" alt="' + esc(t.label) + '">' : '<div class="tile__ph"><span class="label">' + esc(t.note) + '</span><span class="ph-name">' + esc(t.label) + '</span></div>';
      return '<figure class="tile ' + esc(t.span) + '">' + inner + '</figure>';
    }).join("");
    var sw = md.palette.map(function (p) { return '<div class="swatch"><div class="swatch__chip" style="background:' + esc(p.hex) + '"></div><span class="label">' + esc(p.name) + '</span><small>' + esc(p.hex.toUpperCase()) + '</small></div>'; }).join("");
    var mats = md.materials.map(function (m) { return '<span class="mat-tag">' + esc(m) + '</span>'; }).join("");
    return '<section class="section" id="panel"><div class="wrap">' +
      '<div class="section__head"><div><div class="section__kicker"><span class="num">' + esc(md.sectionCode) + '</span><span class="label">Panel Conceptual</span></div><h2 class="section__title">Atmósfera & materiales</h2></div><p class="section__note">La paleta y los materiales guían toda la selección.</p></div>' +
      '<div class="mood-grid">' + tiles + '</div><div class="swatches">' + sw + '</div><div class="materials">' + mats + '</div>' +
    '</div></section>';
  }

  /* ============================================================
     PROGRAMA · control bar + cuerpo conmutable
     ============================================================ */
  function renderProgramaShell() {
    var opts = ['<option value="Todos">Todos los espacios</option>'].concat(D.spaces.map(function (s) { return '<option value="' + esc(s.name) + '">' + esc(s.name) + '</option>'; })).join("");
    var catOpts = ['<option value="Todas">Todas las categorías</option>'].concat(CATS.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; })).join("");
    return '<section class="section section--programa" id="programa"><div class="wrap">' +
      '<div class="section__head"><div><div class="section__kicker"><span class="num">03</span><span class="label">Programa de Interiores</span></div><h2 class="section__title" id="progTitle">Selección</h2></div><p class="section__note">Cambia entre el catálogo por categoría y la vista completa de cada ambiente.</p></div>' +
      '<div class="ctrlbar" id="ctrlbar">' +
        '<div class="seg seg--view" id="viewSeg"><button data-v="programa">Por programa</button><button data-v="espacio">Por espacio</button></div>' +
        '<label class="space-select cat-select"><span class="label">Categoría</span><select id="catSel">' + catOpts + '</select></label>' +
        '<label class="space-select"><span class="label">Espacio</span><select id="spaceSel">' + opts + '</select></label>' +
        '<div class="ctrlbar__meta" id="ctrlMeta"></div>' +
      '</div>' +
      '<div id="programaBody"></div>' +
    '</div></section>';
  }

  /* ---------- tarjeta de producto ---------- */
  function productCard(p) {
    var isSel = selected.indexOf(p.id) >= 0;
    var media = p.img ? '<img src="' + esc(imgUrl(p.img)) + '" alt="' + esc(p.name) + '">' : '<div class="card__ph"><span class="label">Foto de producto</span></div>';
    var shop = p.url ? '<a class="btn btn--solid btn--sm shop" href="' + esc(p.url) + '" target="_blank" rel="noopener">Comprar →</a>' : '<span class="no-link">Sin liga · cotizar</span>';
    return '<article class="card' + (isSel ? ' is-selected' : '') + '" data-id="' + esc(p.id) + '">' +
      '<div class="card__media"><span class="card__cat">' + esc(p.category) + '</span>' + media + '</div>' +
      '<div class="card__body"><div><span class="label card__space">' + esc(p.space) + '</span><h3 class="card__name">' + esc(p.name) + '</h3></div>' +
      '<dl class="spec"><dt>Proveedor</dt><dd>' + esc(p.brand) + '</dd><dt>SKU</dt><dd class="tnum">' + esc(p.sku) + '</dd><dt>Material</dt><dd>' + esc(p.material) + '</dd><dt>Medidas</dt><dd class="tnum">' + esc(p.dims) + '</dd><dt>Cantidad</dt><dd class="tnum">' + esc(p.qty) + '</dd></dl>' +
      '<div class="card__foot"><div class="price">' + money(lineTotal(p)) + '<small>' + esc(D.meta.currency) + (qn(p) > 1 ? ' · ' + money(p.price) + ' c/u' : '') + '</small></div>' +
      '<div class="card__actions">' + shop + '<button class="add-toggle" title="Agregar a mi selección" aria-label="Agregar"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="ic-plus" d="M5 12h14M12 5v14"/><path class="ic-check" d="M4 12.5l5 5 11-11"/></svg></button></div></div>' +
      '</div></article>';
  }
  function productGrid(items) {
    if (!items.length) return "";
    return '<div class="product-grid">' + items.map(productCard).join("") + '</div>';
  }

  /* ---------- tabla comprable (luminarias / herrajes / equipamiento) ---------- */
  function buyTable(items, showSpace) {
    if (!items.length) return "";
    var rows = items.map(function (p) {
      var isSel = selected.indexOf(p.id) >= 0;
      var shop = p.url ? '<a class="tlink shop" href="' + esc(p.url) + '" target="_blank" rel="noopener">Comprar →</a>' : '<span class="no-link">Cotizar</span>';
      return '<tr class="brow' + (isSel ? ' is-selected' : '') + '" data-id="' + esc(p.id) + '">' +
        '<td class="brow__sel"><span class="rcheck"></span></td>' +
        '<td class="brow__name"><b>' + esc(p.name) + '</b>' + (showSpace ? '<small>' + esc(p.space) + '</small>' : '') + '</td>' +
        '<td class="t-prov">' + esc(p.brand) + '<small class="tnum">' + esc(p.sku) + '</small></td>' +
        '<td class="t-mat">' + esc(p.material) + '</td>' +
        '<td class="tnum t-dim">' + esc(p.dims) + '</td>' +
        '<td class="tnum t-qty">' + esc(qn(p)) + '</td>' +
        '<td class="tnum t-price">' + money(lineTotal(p)) + '</td>' +
        '<td class="t-buy">' + shop + '</td>' +
      '</tr>';
    }).join("");
    return '<div class="table-wrap"><table class="ltable"><thead><tr>' +
      '<th></th><th>Elemento</th><th>Proveedor · SKU</th><th>Material</th><th>Medidas</th><th>Cant.</th><th>Importe</th><th></th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ---------- tabla de acabados (informativa + cotizable) ---------- */
  function finishTable(items, showSpace) {
    if (!items.length) return "";
    var anyPriced = items.some(function (f) { return Number(f.price) > 0; });
    var rows = items.map(function (f) {
      var price = Number(f.price) || 0;
      var qty = Number(f.qty) || 1;
      var isSel = selected.indexOf(f.id) >= 0;
      var sel = anyPriced ? (price > 0
        ? '<td class="brow__sel"><span class="rcheck"></span></td>'
        : '<td class="brow__sel"></td>') : '';
      var priceCell = anyPriced ? (price > 0
        ? '<td class="t-price tnum">' + money(price * qty) + (qty > 1 ? '<small> · ' + money(price) + ' c/u</small>' : '') + '</td>'
        : '<td class="t-obra">Obra</td>') : '';
      return '<tr' + (price > 0 ? ' class="brow' + (isSel ? ' is-selected' : '') + '" data-id="' + esc(f.id) + '"' : '') + '>' +
        sel +
        '<td><span class="ftype ftype--' + esc((f.type || "").toLowerCase()) + '">' + esc(f.type) + '</span></td>' +
        '<td class="brow__name"><b>' + esc(f.name) + '</b><small>' + esc(f.finish) + '</small></td>' +
        '<td class="t-prov">' + esc(f.brand) + '<small class="tnum">' + esc(f.sku) + '</small></td>' +
        (showSpace ? '<td>' + esc(f.space) + '</td>' : '') +
        '<td class="tnum t-area">' + esc(f.area) + '</td>' +
        priceCell +
      '</tr>';
    }).join("");
    return '<div class="table-wrap"><table class="ltable ltable--finish"><thead><tr>' +
      (anyPriced ? '<th></th>' : '') +
      '<th>Tipo</th><th>Material · Acabado</th><th>Proveedor · SKU</th>' + (showSpace ? '<th>Espacio</th>' : '') + '<th>Superficie</th>' + (anyPriced ? '<th>Importe</th>' : '') +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ---------- ficha de carpintería ---------- */
  function carpentryCards(items) {
    if (!items.length) return "";
    var cards = items.map(function (c) {
      var isSel = selected.indexOf(c.id) >= 0;
      var media = c.img ? '<img src="' + esc(imgUrl(c.img)) + '" alt="' + esc(c.name) + '">' : '<div class="card__ph carp__ph"><span class="label">Plano de despiece</span></div>';
      var qty = Number(c.qty) || 1;
      var priceBlock = c.price ? '<div class="carp-card__foot"><div class="price">' + money(c.price * qty) + '<small>' + esc(D.meta.currency) + (qty > 1 ? ' · ' + money(c.price) + ' c/u' : '') + '</small></div>' +
        '<button class="add-toggle" title="Agregar a mi selección" aria-label="Agregar"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="ic-plus" d="M5 12h14M12 5v14"/><path class="ic-check" d="M4 12.5l5 5 11-11"/></svg></button></div>' : '';
      return '<article class="carp-card' + (isSel ? ' is-selected' : '') + '"' + (c.price ? ' data-id="' + esc(c.id) + '"' : '') + '><div class="carp-card__media">' + media + '</div>' +
        '<div class="carp-card__body"><span class="label">' + esc(c.space) + '</span><h4 class="carp-card__name">' + esc(c.name) + '</h4>' +
        '<dl class="spec"><dt>Medidas</dt><dd class="tnum">' + esc(c.dims) + '</dd><dt>Materiales</dt><dd>' + esc(c.materials) + '</dd><dt>Acabado</dt><dd>' + esc(c.finish) + '</dd>' + (qty > 1 ? '<dt>Cantidad</dt><dd class="tnum">' + qty + '</dd>' : '') + '</dl>' +
        (c.note ? '<p class="carp-card__note">' + esc(c.note) + '</p>' : '') + priceBlock + '</div></article>';
    }).join("");
    return '<div class="carp-grid">' + cards + '</div>';
  }

  /* ---------- bloque con encabezado ---------- */
  function block(num, title, count, bodyHtml, note) {
    if (!bodyHtml) return "";
    return '<div class="prog-block">' +
      '<div class="prog-block__head"><div class="section__kicker"><span class="num">' + num + '</span><span class="label">' + esc(title) + '</span></div>' +
      '<span class="prog-block__count">' + count + '</span></div>' +
      (note ? '<p class="prog-block__note">' + esc(note) + '</p>' : '') +
      bodyHtml + '</div>';
  }

  function renderRenders(sp) {
    var rs = bySpace(D.renders, sp);
    var tiles;
    if (rs.length) {
      tiles = rs.map(function (r) {
        var inner = r.img ? '<img src="' + esc(imgUrl(r.img)) + '" alt="' + esc(r.label) + '">' : '<div class="tile__ph"><span class="label">' + esc(r.note) + '</span><span class="ph-name">' + esc(r.label) + '</span></div>';
        return '<figure class="tile">' + inner + '</figure>';
      }).join("");
    } else {
      tiles = '<figure class="tile tall"><div class="tile__ph"><span class="label">Render</span><span class="ph-name">' + esc(sp) + '</span></div></figure>';
    }
    return '<div class="mood-grid mood-grid--zone">' + tiles + '</div>';
  }

  /* ---------- cuerpo del programa ---------- */
  function renderProgramaBody() {
    var body = document.getElementById("programaBody");
    var title = document.getElementById("progTitle");
    var n = function (a) { return bySpace(a, space).length; };

    if (view === "espacio") {
      if (space === "Todos") { space = D.spaces[0].name; localStorage.setItem(SPACE_KEY, space); syncControls(); }
      var sObj = D.spaces.filter(function (s) { return s.name === space; })[0] || {};
      title.textContent = space;
      var dossierHead = '<div class="dossier-head"><div><span class="lvl-tag">' + esc(sObj.level || "") + '</span><h3 class="dossier-name">' + esc(space) + '</h3></div>' +
        '<dl class="dossier-meta"><div><dt>Superficie</dt><dd class="tnum">' + esc(sObj.surface || "—") + ' m²</dd></div><div><dt>Dimensiones</dt><dd class="tnum">' + esc(sObj.dims || "—") + '</dd></div><div><dt>Presupuesto</dt><dd class="tnum">' + (sObj.budget ? money(sObj.budget) : "—") + '</dd></div></dl></div>';
      var planosSp = D.planos.filter(function (p) { return p.space === space || (sObj.level && p.space === sObj.level); });
      var planoBlock = planosSp.length ? block("E·07", "Plano", planosSp.length + "", planosHtml(planosSp)) : "";
      body.innerHTML =
        dossierHead +
        block("E·01", "Render / Moodboard", n(D.renders) || "—", renderRenders(space)) +
        block("E·02", "Acabados", n(D.finishes), finishTable(bySpace(D.finishes, space), false)) +
        block("E·03", "Productos", bySpace(realProducts(), space).length, productGrid(bySpace(realProducts(), space)) || emptyState("Sin mobiliario o decoración asignados a este espacio.")) +
        block("E·04", "Luminarias", bySpace(lightingItems(), space).length, productGrid(bySpace(lightingItems(), space))) +
        block("E·05", "Herrajes", n(D.hardware), buyTable(bySpace(D.hardware, space), false)) +
        block("E·06", "Equipamiento", n(D.equipment), buyTable(bySpace(D.equipment, space), false)) +
        block("E·07", "Carpintería", n(D.carpentry), carpentryCards(bySpace(D.carpentry, space))) +
        planoBlock;
      if (!body.querySelector(".prog-block") ) body.innerHTML = dossierHead + '<p class="empty">Sin elementos registrados para este espacio.</p>';
    } else {
      title.textContent = cat === "Todas" ? "Catálogo completo" : cat;
      var blocks = [
        { key: "Productos", code: "03.A", label: "Productos", count: realProducts().length, html: buyTable(realProducts(), true), note: "Marca lo que quieras adquirir. Donde hay liga, compra directo." },
        { key: "Luminarias", code: "03.B", label: "Luminarias", count: lightingItems().length, html: buyTable(lightingItems(), true) },
        { key: "Herrajes", code: "03.C", label: "Herrajes", count: D.hardware.length, html: buyTable(D.hardware, true) },
        { key: "Equipamiento", code: "03.D", label: "Equipamiento", count: D.equipment.length, html: buyTable(D.equipment, true) },
        { key: "Carpintería", code: "03.E", label: "Carpintería", count: D.carpentry.length, html: carpentryCards(D.carpentry) },
        { key: "Acabados", code: "03.F", label: "Esquema de Acabados", count: D.finishes.length, html: finishTable(D.finishes, true), note: "Los acabados con precio se cuantifican y se pueden seleccionar. Los marcados \u201cObra\u201d vienen del catálogo de construcción (sin costo aquí)." }
      ].filter(function (b) { return cat === "Todas" || b.key === cat; });
      body.innerHTML = blocks.map(function (b) { return block(b.code, b.label, b.count, b.html, b.note); }).join("");
      if (!body.querySelector(".prog-block")) body.innerHTML = '<p class="empty">No hay elementos.</p>';
    }
    updateCtrlMeta();
  }

  function planosHtml(items) {
    return '<div class="planos-grid">' + items.map(function (p) {
      var inner = p.img ? '<img src="' + esc(imgUrl(p.img)) + '" alt="' + esc(p.title) + '">' : '<div class="plano__ph"><span class="label">' + esc(p.note) + '</span><span class="ph-name">' + esc(p.title) + '</span></div>';
      return '<figure class="plano">' + inner + '<figcaption><span class="label">' + esc(p.space) + '</span><b>' + esc(p.title) + '</b></figcaption></figure>';
    }).join("") + '</div>';
  }

  /* ============================================================
     PLANOS (sección global)
     ============================================================ */
  function renderPlanos() {
    return '<section class="section" id="planos"><div class="wrap">' +
      '<div class="section__head"><div><div class="section__kicker"><span class="num">04</span><span class="label">Planos</span></div><h2 class="section__title">Planimetría</h2></div><p class="section__note">Incrusta aquí las imágenes de plantas, cortes y despieces (campo <code>img</code> en el archivo).</p></div>' +
      planosHtml(D.planos) +
    '</div></section>';
  }

  function renderSummary() {
    return '<div class="wrap"><div class="summary" id="summary">' +
      '<div class="summary__info"><span class="summary__count" id="sumCount">0</span><span class="summary__total tnum" id="sumTotal">' + money(0) + '</span></div>' +
      '<div class="summary__actions"><button class="btn" id="sumAll">Todo</button><button class="btn" id="sumClear">Vaciar</button><button class="btn" id="sumCsv">CSV</button><button class="btn btn--accent" id="sumPdf">Exportar selección</button></div>' +
    '</div></div>';
  }

  function renderFooter() {
    var m = D.meta;
    return '<footer class="foot"><div class="wrap foot__grid">' +
      '<div class="foot__col"><span class="brand__mark">Aurum</span><p style="margin-top:8px;color:var(--muted)">' + esc(m.studio) + '</p></div>' +
      '<div class="foot__col"><span class="label">Proyecto</span><p>' + esc(m.client) + '<br>' + esc(m.lot) + '<br>' + esc(m.development) + ' · ' + esc(m.city) + '</p></div>' +
      '<div class="foot__col"><span class="label">Contacto</span><p>' + esc(m.email) + '<br>' + esc(m.phone) + '</p></div>' +
      '<div class="foot__col"><span class="label">Documento</span><p>' + esc(m.code) + '<br>Versión ' + esc(m.version) + '<br>' + esc(m.date) + '</p></div>' +
    '</div>' +
    '<div class="wrap foot__tools"><button id="openData" class="foot__datalink">⚙ Base de datos · editar contenido</button></div>' +
    '</footer>';
  }

  /* ============================================================
     SELECCIÓN / SUMMARY / CONTROLES
     ============================================================ */
  function updateSummary() {
    var items = BUYABLE.filter(function (p) { return selected.indexOf(p.id) >= 0; });
    var total = items.reduce(function (s, p) { return s + lineTotal(p); }, 0);
    document.getElementById("sumCount").textContent = items.length + (items.length === 1 ? " elemento" : " elementos");
    document.getElementById("sumTotal").textContent = money(total);
    document.getElementById("summary").classList.toggle("is-on", items.length > 0);
    updateCtrlMeta();
  }
  function buyablePool(c) {
    if (c === "Productos") return realProducts();
    if (c === "Luminarias") return lightingItems();
    if (c === "Herrajes") return D.hardware || [];
    if (c === "Equipamiento") return D.equipment || [];
    if (c === "Carpintería") return (D.carpentry || []).filter(function (x) { return x.price; });
    if (c === "Acabados") return (D.finishes || []).filter(function (x) { return Number(x.price) > 0; });
    return [];
  }
  function updateCtrlMeta() {
    var meta = document.getElementById("ctrlMeta"); if (!meta) return;
    if (view === "programa") {
      var poolP = (cat === "Todas") ? BUYABLE : buyablePool(cat);
      if (!poolP.length) { meta.innerHTML = '<div class="ctrlstat"><span class="label">' + esc(cat) + '</span><b>Informativo · sin compra</b></div>'; return; }
      var totalP = poolP.reduce(function (s, p) { return s + lineTotal(p); }, 0);
      var selP = poolP.filter(function (p) { return selected.indexOf(p.id) >= 0; });
      var selTotal = selP.reduce(function (s, p) { return s + lineTotal(p); }, 0);
      var diff = totalP - selTotal;
      meta.innerHTML =
        '<div class="ctrlstat"><span class="label">Catálogo</span><b class="tnum">' + money(totalP) + '</b></div>' +
        '<div class="ctrlstat"><span class="label">Seleccionado · ' + selP.length + '/' + poolP.length + '</span><b class="tnum ctrlstat--accent">' + money(selTotal) + '</b></div>' +
        '<div class="ctrlstat"><span class="label">Por incluir</span><b class="tnum">' + (diff === 0 ? "Completo" : money(diff)) + '</b></div>';
      return;
    }
    var pool = (space === "Todos") ? BUYABLE : BUYABLE.filter(function (p) { return p.space === space; });
    var sel = pool.filter(function (p) { return selected.indexOf(p.id) >= 0; });
    var total = sel.reduce(function (s, p) { return s + lineTotal(p); }, 0);
    meta.innerHTML = '<div class="ctrlstat"><span class="label">Selección visible</span><b class="tnum">' + sel.length + ' / ' + pool.length + ' · ' + money(total) + '</b></div>';
  }
  function toggleSel(id) {
    var i = selected.indexOf(id);
    if (i >= 0) selected.splice(i, 1); else selected.push(id);
    setSel();
    Array.prototype.forEach.call(document.querySelectorAll('[data-id="' + id + '"]'), function (n) { n.classList.toggle("is-selected", selected.indexOf(id) >= 0); });
    updateSummary();
  }
  function exportCSV(onlySelected) {
    var rows = BUYABLE.filter(function (p) { return !onlySelected || selected.indexOf(p.id) >= 0; });
    if (!rows.length) { alert("No hay elementos seleccionados."); return; }
    var head = ["Programa", "Elemento", "Espacio", "Proveedor", "SKU", "Material", "Medidas", "Cantidad", "Precio unitario", "Importe", "Liga"];
    var lines = [head.join(",")];
    rows.forEach(function (p) {
      var r = [p.category, p.name, p.space, p.brand, p.sku, p.material, p.dims, qn(p), p.price, lineTotal(p), p.url || ""];
      lines.push(r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","));
    });
    var blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "Aurum_LlaveMaestra.csv"; a.click();
  }

  /* ---------- Exportar PDF · solo la selección ---------- */
  function selByList(list) { return (list || []).filter(function (p) { return selected.indexOf(p.id) >= 0; }); }

  function printSelection() {
    if (!selected.length) { alert("Selecciona al menos un elemento para exportar el PDF."); return; }
    var groups = [
      { label: "Mobiliario y decoración", items: selByList(realProducts()) },
      { label: "Iluminación", items: selByList(lightingItems()) },
      { label: "Herrajes", items: selByList(D.hardware) },
      { label: "Equipamiento", items: selByList(D.equipment) },
      { label: "Carpintería", items: selByList(D.carpentry) },
      { label: "Acabados", items: selByList(D.finishes) }
    ].filter(function (g) { return g.items.length; });

    var grand = 0, totalCount = 0;
    var sections = groups.map(function (g) {
      var sub = 0;
      var rows = g.items.map(function (p) {
        var imp = lineTotal(p); sub += imp;
        return '<tr>' +
          '<td class="pd-name"><b>' + esc(p.name) + '</b>' + (p.sku ? '<span class="pd-sku">' + esc(p.sku) + '</span>' : '') + '</td>' +
          '<td>' + esc(p.space) + '</td>' +
          '<td>' + esc(p.brand || "—") + '</td>' +
          '<td class="pd-num">' + qn(p) + '</td>' +
          '<td class="pd-num">' + money(p.price) + '</td>' +
          '<td class="pd-num pd-imp">' + money(imp) + '</td>' +
          '</tr>';
      }).join("");
      grand += sub; totalCount += g.items.length;
      return '<section class="pd-group">' +
        '<div class="pd-group__head"><h2>' + esc(g.label) + '</h2><span class="pd-group__meta">' + g.items.length + ' · ' + money(sub) + '</span></div>' +
        '<table class="pd-table"><thead><tr><th>Elemento</th><th>Espacio</th><th>Proveedor</th><th class="pd-num">Cant</th><th class="pd-num">P. unitario</th><th class="pd-num">Importe</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></section>';
    }).join("");

    var m = D.meta;
    var cover =
      '<header class="pd-cover">' +
        '<div class="pd-cover__row"><span class="pd-studio">' + esc(m.studio) + '</span><span class="pd-code">' + esc(m.code) + ' · v' + esc(m.version) + '</span></div>' +
        '<h1 class="pd-title">' + esc(m.document) + ' <em>· Selección</em></h1>' +
        '<p class="pd-sub">' + esc(m.subtitle) + '</p>' +
        '<dl class="pd-meta">' +
          '<div><dt>Cliente</dt><dd>' + esc(m.client) + '</dd></div>' +
          '<div><dt>Ubicación</dt><dd>' + esc(m.lot) + '</dd></div>' +
          '<div><dt>Fecha</dt><dd>' + esc(m.date) + '</dd></div>' +
        '</dl>' +
        '<div class="pd-headline">' +
          '<div class="pd-headline__col"><span class="pd-headline__n">' + totalCount + '</span><span class="pd-headline__l">elementos seleccionados</span></div>' +
          '<div class="pd-headline__col pd-headline__col--total"><span class="pd-headline__l">Total estimado</span><span class="pd-headline__t">' + money(grand) + '</span></div>' +
        '</div>' +
      '</header>';

    var foot = '<footer class="pd-foot"><span>' + esc(m.studio) + ' · ' + esc(m.email) + '</span><span class="pd-grand">Total ' + money(grand) + ' ' + esc(m.currency) + '</span></footer>';

    var host = document.getElementById("printDoc");
    if (!host) { host = document.createElement("div"); host.id = "printDoc"; document.body.appendChild(host); }
    host.innerHTML = cover + sections + foot;

    document.body.classList.add("print-sel");
    var cleanup = function () { document.body.classList.remove("print-sel"); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }
  window.aurumPrint = printSelection;

  function syncControls() {
    var vs = document.getElementById("viewSeg");
    if (vs) vs.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-v") === view); });
    var sel = document.getElementById("spaceSel"); if (sel) sel.value = space;
    var cs = document.getElementById("catSel"); if (cs) cs.value = cat;
    document.body.classList.toggle("view-espacio", view === "espacio");
  }

  /* ============================================================
     SCROLLSPY
     ============================================================ */
  function initSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("#nav a"));
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-sec") === e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["resumen", "panel", "programa", "planos"].forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* ============================================================
     TWEAKS
     ============================================================ */
  var ACCENTS = [{ name: "Auto", v: "" }, { name: "Clay", v: "#a8703f" }, { name: "Terracota", v: "#9a5638" }, { name: "Salvia", v: "#4f6f63" }, { name: "Pizarra", v: "#5a6675" }];
  function applyTweaks(t) {
    var r = document.documentElement;
    r.setAttribute("data-theme", t.direction); r.setAttribute("data-density", t.density);
    if (t.accent) r.style.setProperty("--accent", t.accent); else r.style.removeProperty("--accent");
    document.body.classList.toggle("hide-prices", !t.showPrices);
  }
  function buildTweaks(t, setTweak) {
    var panel = el('<div id="tweaks"><button class="tw-close" id="twClose">×</button><h6>Tweaks</h6><p class="tw-sub">Dirección y ajustes del documento</p>' +
      '<div class="tw-group"><span class="label">Dirección</span><div class="seg" id="twDir"><button data-v="warm">Revista cálida</button><button data-v="gallery">Galería</button></div></div>' +
      '<div class="tw-group"><span class="label">Acento</span><div class="tw-colors" id="twAccent"></div></div>' +
      '<div class="tw-group"><span class="label">Densidad</span><div class="seg" id="twDensity"><button data-v="compact">Compacta</button><button data-v="regular">Normal</button><button data-v="comfy">Amplia</button></div></div>' +
      '<div class="tw-group"><span class="label">Precios</span><div class="seg" id="twPrices"><button data-v="on">Mostrar</button><button data-v="off">Ocultar</button></div></div></div>');
    document.body.appendChild(panel);
    var ac = panel.querySelector("#twAccent");
    ACCENTS.forEach(function (a) { var b = el('<button title="' + a.name + '" style="background:' + (a.v || "linear-gradient(135deg,#a8703f,#4f6f63)") + '"></button>'); b.dataset.v = a.v; b.addEventListener("click", function () { setTweak({ accent: a.v }); sync(); }); ac.appendChild(b); });
    function seg(id, key) { panel.querySelectorAll("#" + id + " button").forEach(function (b) { b.addEventListener("click", function () { var val = b.getAttribute("data-v"); if (key === "showPrices") setTweak({ showPrices: val === "on" }); else { var o = {}; o[key] = val; setTweak(o); } sync(); }); }); }
    seg("twDir", "direction"); seg("twDensity", "density"); seg("twPrices", "showPrices");
    panel.querySelector("#twClose").addEventListener("click", function () { panel.classList.remove("is-open"); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); });
    function mark(s, v) { panel.querySelectorAll(s + " button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-v") === v); }); }
    function sync() { var c = window.__TW; mark("#twDir", c.direction); mark("#twDensity", c.density); mark("#twPrices", c.showPrices ? "on" : "off"); ac.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === (c.accent || "")); }); }
    window.__syncTweaks = sync; sync(); return panel;
  }
  function initTweaks() {
    var t = Object.assign({}, window.TWEAK_DEFAULTS); window.__TW = t;
    function setTweak(edits) { Object.assign(t, edits); window.__TW = t; applyTweaks(t); window.parent.postMessage({ type: "__edit_mode_set_keys", edits: edits }, "*"); }
    applyTweaks(t);
    var panel = buildTweaks(t, setTweak);
    window.addEventListener("message", function (e) { var d = e.data || {}; if (d.type === "__activate_edit_mode") panel.classList.add("is-open"); if (d.type === "__deactivate_edit_mode") panel.classList.remove("is-open"); });
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }

  /* ---------- reencuadre del render del hero (solo editor) ----------
     Arrastra verticalmente la imagen para elegir el encuadre; muestra el
     valor exacto para pegar en la columna heroRenderPos del Excel/Sheet. */
  function initHeroReframe() {
    // Solo en el editor (dentro de iframe). En el sitio publicado no se muestra.
    var inEditor = false; try { inEditor = window.self !== window.top; } catch (e) { inEditor = true; }
    if (!inEditor) return;
    var img = document.querySelector(".hero__render--img");
    if (!img) return;
    var badge = el('<div class="reframe-badge" title="Copiar valor para heroRenderPos">Arrastra ↕ para encuadrar</div>');
    img.parentNode.appendChild(badge);
    var dragging = false, startY = 0, startPct = 50;
    function curPct() { var p = (D.meta.heroRenderPos || "center center").split(/\s+/)[1] || "50%"; var n = parseFloat(p); return isNaN(n) ? (p === "top" ? 0 : p === "bottom" ? 100 : 50) : n; }
    startPct = curPct();
    function setPct(p) { p = Math.max(0, Math.min(100, p)); img.style.objectPosition = "center " + p.toFixed(0) + "%"; badge.textContent = 'heroRenderPos: center ' + p.toFixed(0) + '%  ·  clic para copiar'; badge.dataset.val = "center " + p.toFixed(0) + "%"; D.meta.heroRenderPos = badge.dataset.val; }
    img.style.cursor = "ns-resize";
    img.addEventListener("pointerdown", function (e) { dragging = true; startY = e.clientY; startPct = curPct(); img.setPointerCapture(e.pointerId); e.preventDefault(); });
    img.addEventListener("pointermove", function (e) { if (!dragging) return; var dy = e.clientY - startY; var pct = startPct + (dy / img.clientHeight) * 100; setPct(pct); });
    img.addEventListener("pointerup", function () { dragging = false; });
    badge.addEventListener("click", function () {
      var v = badge.dataset.val || (D.meta.heroRenderPos || "center center");
      if (navigator.clipboard) navigator.clipboard.writeText(v);
      badge.textContent = "¡Copiado! " + v + " → pégalo en heroRenderPos";
      setTimeout(function () { badge.textContent = 'heroRenderPos: ' + (D.meta.heroRenderPos || 'center center') + '  ·  clic para copiar'; }, 1800);
    });
    badge.textContent = 'heroRenderPos: ' + (D.meta.heroRenderPos || 'center center') + '  ·  arrastra ↕';
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    document.getElementById("app").innerHTML =
      renderNav() + renderHero() + renderResumen() + renderPanel() + renderProgramaShell() + renderPlanos() + renderSummary() + renderFooter();

    syncControls();
    renderProgramaBody();
    updateSummary();
    initSpy();
    initTweaks();
    initHeroReframe();

    // delegated clicks within programa body (cards + table rows)
    document.getElementById("programaBody").addEventListener("click", function (e) {
      if (e.target.closest(".shop")) return; // dejar pasar la liga
      var row = e.target.closest(".brow");
      if (row) { toggleSel(row.getAttribute("data-id")); return; }
      var card = e.target.closest(".card");
      if (card && e.target.closest(".add-toggle")) { toggleSel(card.getAttribute("data-id")); return; }
      var carp = e.target.closest(".carp-card");
      if (carp && carp.getAttribute("data-id") && e.target.closest(".add-toggle")) { toggleSel(carp.getAttribute("data-id")); }
    });

    // view toggle
    document.getElementById("viewSeg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      view = b.getAttribute("data-v"); localStorage.setItem(VIEW_KEY, view);
      syncControls(); renderProgramaBody();
    });
    // space select
    document.getElementById("spaceSel").addEventListener("change", function (e) {
      space = e.target.value; localStorage.setItem(SPACE_KEY, space);
      renderProgramaBody();
    });
    // category select (solo Por programa)
    document.getElementById("catSel").addEventListener("change", function (e) {
      cat = e.target.value; localStorage.setItem(CAT_KEY, cat);
      renderProgramaBody();
    });

    // summary actions
    document.getElementById("sumCsv").addEventListener("click", function () { exportCSV(true); });
    document.getElementById("sumPdf").addEventListener("click", function () { printSelection(); });
    document.getElementById("sumClear").addEventListener("click", function () {
      selected = []; setSel();
      document.querySelectorAll(".is-selected").forEach(function (n) { n.classList.remove("is-selected"); });
      updateSummary();
    });
    document.getElementById("sumAll").addEventListener("click", function () {
      var pool = (view === "programa" || space === "Todos") ? BUYABLE : BUYABLE.filter(function (p) { return p.space === space; });
      var ids = pool.map(function (p) { return p.id; });
      var allSel = ids.every(function (id) { return selected.indexOf(id) >= 0; });
      ids.forEach(function (id) {
        var has = selected.indexOf(id) >= 0;
        if (allSel && has) selected.splice(selected.indexOf(id), 1);
        else if (!allSel && !has) selected.push(id);
      });
      setSel();
      document.querySelectorAll("[data-id]").forEach(function (n) { var id = n.getAttribute("data-id"); if (BUY_BY_ID[id]) n.classList.toggle("is-selected", selected.indexOf(id) >= 0); });
      updateSummary();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
