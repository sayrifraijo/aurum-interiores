/* ============================================================
   AURUM · Llave Maestra — Herramientas de base de datos
   ------------------------------------------------------------
   - Descargar plantilla (Excel) con los datos actuales
   - Cargar un Excel lleno y reconstruir el documento
   - Exportar data.js (versión "horneada" para publicar)
   Requiere SheetJS (XLSX) cargado antes que este archivo.
   ============================================================ */
(function () {
  "use strict";
  var DATA_KEY = "aurum_data_v1";

  function activeData() {
    try { var s = localStorage.getItem(DATA_KEY); if (s) { var o = JSON.parse(s); if (o && o.meta && o.products) return o; } } catch (e) {}
    return window.AURUM;
  }

  /* Hojas de tipo tabla: clave en AURUM + columnas en orden */
  var TABLES = [
    { key: "products",  name: "Productos",    cols: ["id", "name", "category", "space", "brand", "sku", "material", "dims", "price", "qty", "url", "img"] },
    { key: "lighting",  name: "Luminarias",   cols: ["id", "name", "category", "space", "brand", "sku", "material", "dims", "price", "qty", "url", "img"] },
    { key: "hardware",  name: "Herrajes",     cols: ["id", "name", "category", "space", "brand", "sku", "material", "dims", "price", "qty", "url", "img"] },
    { key: "equipment", name: "Equipamiento", cols: ["id", "name", "category", "space", "brand", "sku", "material", "dims", "price", "qty", "url", "img"] },
    { key: "finishes",  name: "Acabados",     cols: ["id", "type", "name", "finish", "space", "brand", "sku", "area"] },
    { key: "carpentry", name: "Carpinteria",  cols: ["id", "name", "space", "dims", "materials", "finish", "note", "img"] },
    { key: "renders",   name: "Renders",      cols: ["space", "label", "note", "img"] },
    { key: "planos",    name: "Planos",       cols: ["title", "space", "note", "img"] },
    { key: "spaces",    name: "Espacios",     cols: ["name", "level", "surface", "dims", "floor", "ceiling", "walls", "budget"] }
  ];
  var NUMERIC = { price: 1, qty: 1, budget: 1 };
  var META_FIELDS = ["studio", "document", "subtitle", "client", "lot", "development", "city", "email", "phone", "version", "date", "code", "currency", "locale", "logo", "heroRender"];

  /* -------- Construir el libro de Excel a partir de los datos -------- */
  function buildWorkbook() {
    var D = activeData();
    var wb = XLSX.utils.book_new();

    // LÉEME
    var readme = [
      ["AURUM · Llave Maestra — Base de datos"],
      [""],
      ["Cómo llenar este archivo:"],
      ["• Cada hoja es una tabla del documento. Edita, agrega o borra filas."],
      ["• NO cambies los encabezados (primera fila) ni el nombre de las hojas."],
      ["• Columna 'img'  = liga (URL) de la imagen o render. Déjala vacía para placeholder."],
      ["• Columna 'url'  = liga de compra del producto. Vacía = sin botón, solo proveedor + SKU."],
      ["• Columna 'price' y 'qty' = solo números (sin $ ni comas)."],
      ["• Columna 'space' debe coincidir con un 'name' de la hoja Espacios (o 'General')."],
      ["• Las luminarias van en la hoja Luminarias; no las dupliques en Productos."],
      ["• 'category' en Productos: Mobiliario · Textiles · Decoración (NO Iluminación)."],
      [""],
      ["Hojas tabla: Productos, Luminarias, Herrajes, Equipamiento, Acabados,"],
      ["             Carpinteria, Renders, Planos, Espacios."],
      ["Hojas de texto: Meta, Concepto, Pilares, Paleta, Materiales, Mood."],
      [""],
      ["Al terminar: regresa al documento → 'Cargar Excel' y sube este archivo."]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(readme), "LÉEME");

    // Meta (campo / valor)
    var metaRows = [["campo", "valor"]];
    META_FIELDS.forEach(function (f) { metaRows.push([f, (D.meta && D.meta[f] != null) ? D.meta[f] : ""]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(metaRows), "Meta");

    // Concepto (campo / valor)
    var c = D.concept || {};
    var conRows = [["campo", "valor"],
      ["sectionCode", c.sectionCode || ""],
      ["style", c.style || ""],
      ["statement", c.statement || ""],
      ["body1", (c.body && c.body[0]) || ""],
      ["body2", (c.body && c.body[1]) || ""],
      ["definition", c.definition || ""]];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(conRows), "Concepto");

    // Pilares
    var pilRows = [["titulo", "texto"]];
    (c.pillars || []).forEach(function (p) { pilRows.push([p.t || "", p.d || ""]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pilRows), "Pilares");

    // Paleta + Materiales + Mood (de D.mood)
    var mood = D.mood || {};
    var palRows = [["name", "hex"]];
    (mood.palette || []).forEach(function (p) { palRows.push([p.name || "", p.hex || ""]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(palRows), "Paleta");

    var matRows = [["material"]];
    (mood.materials || []).forEach(function (m) { matRows.push([m]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(matRows), "Materiales");

    var moodRows = [["label", "note", "span", "img"]];
    (mood.tiles || []).forEach(function (t) { moodRows.push([t.label || "", t.note || "", t.span || "", t.img || ""]); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(moodRows), "Mood");

    // Tablas
    TABLES.forEach(function (t) {
      var rows = [t.cols];
      (D[t.key] || []).forEach(function (item) {
        rows.push(t.cols.map(function (col) { return item[col] != null ? item[col] : ""; }));
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), t.name);
    });

    return wb;
  }

  function downloadTemplate() {
    try {
      var wb = buildWorkbook();
      XLSX.writeFile(wb, "Aurum_LlaveMaestra_Base.xlsx");
      setStatus("Plantilla descargada. Llénala y vuelve con 'Cargar Excel'.", "ok");
    } catch (e) { setStatus("No se pudo generar la plantilla: " + e.message, "err"); }
  }

  /* -------- Importar un Excel lleno -------- */
  function sheetByName(wb, name) {
    var key = Object.keys(wb.Sheets).filter(function (k) { return k.toLowerCase() === name.toLowerCase(); })[0];
    return key ? wb.Sheets[key] : null;
  }
  function aoa(ws) { return ws ? XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" }) : []; }
  function kv(ws) {
    var m = {}; aoa(ws).slice(1).forEach(function (r) { if (r[0] !== "" && r[0] != null) m[String(r[0]).trim()] = r[1] != null ? r[1] : ""; }); return m;
  }
  function rowsToObjects(ws, cols) {
    var data = aoa(ws); if (!data.length) return [];
    var head = data[0].map(function (h) { return String(h).trim(); });
    return data.slice(1).filter(function (r) { return r.some(function (c) { return c !== "" && c != null; }); }).map(function (r) {
      var o = {};
      cols.forEach(function (col) {
        var idx = head.indexOf(col);
        var v = idx >= 0 ? r[idx] : "";
        if (NUMERIC[col]) { v = Number(String(v).replace(/[^0-9.\-]/g, "")) || 0; }
        o[col] = v == null ? "" : v;
      });
      return o;
    });
  }

  function importWorkbook(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var wb = XLSX.read(e.target.result, { type: "array" });
        var D = JSON.parse(JSON.stringify(activeData())); // clon de base actual

        // Meta
        var metaWs = sheetByName(wb, "Meta");
        if (metaWs) { var mm = kv(metaWs); D.meta = D.meta || {}; META_FIELDS.forEach(function (f) { if (mm[f] !== undefined) D.meta[f] = mm[f]; }); }

        // Concepto
        var conWs = sheetByName(wb, "Concepto");
        if (conWs) {
          var cc = kv(conWs); D.concept = D.concept || {};
          ["sectionCode", "style", "statement", "definition"].forEach(function (f) { if (cc[f] !== undefined) D.concept[f] = cc[f]; });
          var b = []; if (cc.body1) b.push(cc.body1); if (cc.body2) b.push(cc.body2); if (b.length) D.concept.body = b;
        }
        // Pilares
        var pilWs = sheetByName(wb, "Pilares");
        if (pilWs) { var pr = aoa(pilWs).slice(1).filter(function (r) { return r[0]; }); if (pr.length) { D.concept = D.concept || {}; D.concept.pillars = pr.map(function (r) { return { t: r[0] || "", d: r[1] || "" }; }); } }

        // Mood: paleta, materiales, tiles
        D.mood = D.mood || {};
        var palWs = sheetByName(wb, "Paleta");
        if (palWs) { var pal = aoa(palWs).slice(1).filter(function (r) { return r[0]; }); if (pal.length) D.mood.palette = pal.map(function (r) { return { name: r[0] || "", hex: r[1] || "" }; }); }
        var matWs = sheetByName(wb, "Materiales");
        if (matWs) { var mat = aoa(matWs).slice(1).map(function (r) { return r[0]; }).filter(function (x) { return x !== "" && x != null; }); if (mat.length) D.mood.materials = mat; }
        var moodWs = sheetByName(wb, "Mood");
        if (moodWs) { var mt = rowsToObjects(moodWs, ["label", "note", "span", "img"]); if (mt.length) D.mood.tiles = mt; }

        // Tablas
        TABLES.forEach(function (t) {
          var ws = sheetByName(wb, t.name);
          if (ws) { D[t.key] = rowsToObjects(ws, t.cols); }
        });

        localStorage.setItem(DATA_KEY, JSON.stringify(D));
        setStatus("¡Datos cargados! Recargando…", "ok");
        setTimeout(function () { location.reload(); }, 600);
      } catch (err) {
        setStatus("Error al leer el Excel: " + err.message, "err");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* -------- Exportar data.js (versión horneada) -------- */
  function exportDataJs() {
    var D = activeData();
    var header = "/* AURUM · Llave Maestra — Base de datos (generada). Reemplaza assets/data.js con este archivo para publicar. */\n";
    var js = header + "window.AURUM = " + JSON.stringify(D, null, 2) + ";\n";
    var blob = new Blob([js], { type: "text/javascript;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.js"; a.click();
    setStatus("data.js descargado. Reemplaza assets/data.js con este archivo para publicar.", "ok");
  }

  function resetData() {
    if (!confirm("¿Quitar los datos cargados y volver a los del archivo data.js?")) return;
    localStorage.removeItem(DATA_KEY); location.reload();
  }

  /* -------- Panel / UI -------- */
  function setStatus(msg, kind) {
    var el = document.getElementById("dataStatus"); if (!el) return;
    el.textContent = msg; el.className = "data-status" + (kind ? " is-" + kind : "");
  }
  function buildPanel() {
    if (document.getElementById("dataPanel")) return;
    var hasOverride = !!localStorage.getItem(DATA_KEY);
    var ov = document.createElement("div");
    ov.id = "dataPanel"; ov.className = "data-overlay";
    ov.innerHTML =
      '<div class="data-modal" role="dialog" aria-label="Base de datos">' +
        '<button class="data-close" id="dataClose" aria-label="Cerrar">×</button>' +
        '<span class="data-kicker">Base de datos · Excel</span>' +
        '<h3 class="data-title">Editar el contenido del documento</h3>' +
        '<p class="data-lead">El documento se llena desde un Excel. Descarga la plantilla con los datos actuales, edítala y vuelve a cargarla. Las imágenes y ligas van como columnas (img / url).</p>' +
        '<div class="data-steps">' +
          '<div class="data-step"><span class="data-n">1</span><div><b>Descargar plantilla</b><small>Excel con todas las hojas y los datos actuales como ejemplo.</small><button class="data-btn" id="dataTpl">Descargar plantilla (Excel)</button></div></div>' +
          '<div class="data-step"><span class="data-n">2</span><div><b>Llenar en Excel o Google Sheets</b><small>Edita filas, pega ligas de imágenes (img) y de compra (url). No cambies encabezados ni nombres de hoja.</small></div></div>' +
          '<div class="data-step"><span class="data-n">3</span><div><b>Cargar tu Excel</b><small>El documento se reconstruye y queda guardado en este navegador.</small><button class="data-btn data-btn--solid" id="dataLoad">Cargar Excel…</button><input type="file" id="dataFile" accept=".xlsx,.xls" hidden></div></div>' +
          '<div class="data-step"><span class="data-n">4</span><div><b>Publicar</b><small>Genera el archivo data.js definitivo y reemplaza assets/data.js para subirlo a GitHub / compartir.</small><button class="data-btn" id="dataExport">Descargar data.js</button></div></div>' +
        '</div>' +
        '<div class="data-foot"><span class="data-status" id="dataStatus">' + (hasOverride ? "Mostrando datos cargados (Excel). " : "Mostrando datos del archivo base. ") + '</span>' +
        (hasOverride ? '<button class="data-reset" id="dataReset">Restablecer a data.js</button>' : '') + '</div>' +
      '</div>';
    document.body.appendChild(ov);

    ov.addEventListener("click", function (e) { if (e.target === ov) closePanel(); });
    document.getElementById("dataClose").addEventListener("click", closePanel);
    document.getElementById("dataTpl").addEventListener("click", downloadTemplate);
    document.getElementById("dataExport").addEventListener("click", exportDataJs);
    var fileInput = document.getElementById("dataFile");
    document.getElementById("dataLoad").addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function (e) { if (e.target.files[0]) { setStatus("Leyendo…", ""); importWorkbook(e.target.files[0]); } });
    var rb = document.getElementById("dataReset"); if (rb) rb.addEventListener("click", resetData);
  }
  function openPanel() { buildPanel(); document.getElementById("dataPanel").classList.add("is-open"); }
  function closePanel() { var p = document.getElementById("dataPanel"); if (p) p.classList.remove("is-open"); }

  function init() {
    var btn = document.getElementById("openData");
    if (btn) btn.addEventListener("click", openPanel);
    if (typeof XLSX === "undefined") { if (btn) btn.title = "Cargando librería…"; }
    // atajo: abrir con #datos en la URL
    if (location.hash === "#datos") openPanel();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
