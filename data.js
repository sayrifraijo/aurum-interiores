/* ============================================================
   AURUM · Llave Maestra — Base de datos del documento
   ------------------------------------------------------------
   Esta es la única fuente de contenido. Tu script de Google
   Sheets puede regenerar este objeto completo: la interfaz se
   redibuja sola a partir de `window.AURUM`.
   Precios en MXN. Los `url` vacíos ("") se muestran sin botón
   de tienda pero conservan proveedor + SKU.
   ============================================================ */
window.AURUM = {
  meta: {
    studio: "Aurum Arquitectos",
    document: "Llave Maestra",
    subtitle: "Programa de Interiores",
    client: "Familia Navarro Muñoz",
    lot: "Lote 8 · Mza 269 · Villa Fraterna",
    development: "Las Riberas",
    city: "Hermosillo, Sonora · México",
    email: "proyectos@aurumarquitectos.com",
    phone: "+52 662 200 0340",
    version: "I",
    date: "5 de septiembre, 2025",
    code: "RNM · 01",
    currency: "MXN",
    locale: "es-MX"
  },

  /* ---- 01 · Resumen / Concepto de interiores ---- */
  concept: {
    sectionCode: "01.A",
    style: "Hygge transicional",
    statement:
      "El diseño de interiores de este proyecto se concibió bajo los principios de calidad, confort y conexión con el entorno. La propuesta se fundamenta en colores neutros y saturados en contraste con mobiliario claro y una abundante iluminación natural, aprovechando al máximo la vista privilegiada desde la zona privada hacia el exterior a través de ventanales de doble altura.",
    body: [
      "La naturaleza, el cielo y la vegetación se convierten en los protagonistas, resaltados mediante una paleta interior neutra y cálida. Las líneas rectas y la base neutra, junto con el uso intencional de texturas, aportan calidez y equilibrio incluso en espacios amplios y de gran altura.",
      "El estilo adoptado es un Hygge transicional con matices de modernismo clásico, al que en áreas privadas se suma un carácter regional, como una evolución armónica del concepto. La arquitectura interior se desarrolla con líneas limpias y claras, buscando que cada rincón abrace al usuario y transmita la sensación de estar en el corazón de la casa."
    ],
    definition:
      "Fusión entre el estilo Hygge escandinavo —centrado en la calidez, simplicidad y bienestar— y el estilo transicional, que mezcla elementos clásicos y contemporáneos para lograr equilibrio y atemporalidad.",
    pillars: [
      { t: "Paleta neutra y cálida", d: "Blancos, beige, grises suaves y tonos tierra como base." },
      { t: "Materiales naturales", d: "Madera, textiles suaves, piedra y fibras vegetales." },
      { t: "Mobiliario equilibrado", d: "Líneas limpias, texturas clásicas y detalles escultóricos." },
      { t: "Iluminación cálida y abundante", d: "Prioriza la luz natural y luminarias sencillas." },
      { t: "Texturas ricas", d: "Alfombras, cojines y tapizados que aportan confort." },
      { t: "Equilibrio visual", d: "Minimalismo con toques ornamentales: acogedor y sofisticado." }
    ]
  },

  /* ---- Características de los espacios ---- */
  spaces: [
    { name: "Cocina + Pantry", level: "Planta Baja", surface: "15.55 + 8.32", dims: "3.14×4.95 + 4.03×2.06", floor: "Mármol", ceiling: "Sencilla · 2.70 m", walls: "Chapa de madera · Pintura vinílica", budget: 320000 },
    { name: "Sala + Comedor", level: "Planta Baja", surface: "18.81 + 17.01", dims: "4.60×4.10 + 3.43×4.95", floor: "Mármol", ceiling: "Doble altura", walls: "Pintura vinílica · Ventanales · Chapa de madera", budget: 410000 },
    { name: "Recámara Principal", level: "Planta Baja", surface: "40.86", dims: "3.98×4.10", floor: "Piso de ingeniería", ceiling: "Sencilla · 3.00 m", walls: "Pintura vinílica · Papel tapiz · Chapa de madera", budget: 280000 },
    { name: "Baño Principal", level: "Planta Baja", surface: "12.40", dims: "2.63×4.72", floor: "Mármol", ceiling: "Sencilla · 3.00 m", walls: "Pintura vinílica · Azulejo", budget: 190000 },
    { name: "Sala Privada", level: "Planta Baja", surface: "16.20", dims: "3.90×4.15", floor: "Piso de ingeniería", ceiling: "Sencilla · 3.00 m", walls: "Pintura vinílica", budget: 150000 },
    { name: "Medio Baño", level: "Planta Baja", surface: "2.67", dims: "1.43×1.55", floor: "Mármol", ceiling: "Sencilla · 3.00 m", walls: "Pintura vinílica", budget: 60000 },
    { name: "Cuarto de Lectura", level: "Planta Alta", surface: "13.29", dims: "2.78×4.10", floor: "Piso de ingeniería", ceiling: "Sencilla · 3.50 m", walls: "Pintura vinílica", budget: 95000 },
    { name: "Recámara Secundaria", level: "Planta Alta", surface: "32.89", dims: "3.98×6.65 + 1.43×2.40", floor: "Piso de ingeniería", ceiling: "Sencilla · 3.50 m", walls: "Pintura vinílica", budget: 165000 },
    { name: "Recámara Multiusos", level: "Planta Alta", surface: "33.95 + 4.52", dims: "4.10×5.80 + 2.33×5.10", floor: "Piso de ingeniería", ceiling: "Sencilla · 3.50 m", walls: "Pintura vinílica", budget: 175000 },
    { name: "Lavandería", level: "Planta Alta", surface: "14.50", dims: "2.33×5.25", floor: "Mármol", ceiling: "Sencilla · 3.50 m", walls: "Pintura vinílica", budget: 70000 },
    { name: "Terraza + Balcón", level: "Planta Baja + Alta", surface: "19.98 + 14.36", dims: "4.95×3.83 + 6.65×2.15", floor: "Mármol", ceiling: "Aparente · 4.80 m", walls: "Pintura vinílica · Piedra braza", budget: 210000 }
  ],

  /* ---- Panel conceptual (mood board) ----
     Cada tile puede recibir una imagen (campo `img`). Vacío = placeholder. */
  mood: {
    sectionCode: "02",
    palette: [
      { name: "Lino", hex: "#EAE3D6" },
      { name: "Arena", hex: "#D8C7AE" },
      { name: "Greige", hex: "#B7A990" },
      { name: "Roble", hex: "#9C7A4F" },
      { name: "Tierra", hex: "#6E5A45" },
      { name: "Carbón", hex: "#3A352E" }
    ],
    materials: ["Roble natural", "Mármol blanco", "Lino crudo", "Bouclé arena", "Travertino", "Latón cepillado", "Piedra braza", "Lana anudada"],
    tiles: [
      { label: "Sala de doble altura", note: "Render principal", span: "tall", img: "" },
      { label: "Detalle de chapa de madera", note: "Textura · muro", span: "wide", img: "" },
      { label: "Paleta de materiales", note: "Flat lay", span: "", img: "" },
      { label: "Recámara principal", note: "Ambiente", span: "", img: "" },
      { label: "Luz natural · ventanales", note: "Atmósfera", span: "tall", img: "" },
      { label: "Textiles & bouclé", note: "Cercanía", span: "", img: "" }
    ]
  },

  /* ---- Programa de Productos ----
     category: Mobiliario · Iluminación · Textiles · Decoración · Herrajes · Equipamiento
     url vacío "" => sin liga de tienda (se muestran proveedor + SKU igual). */
  products: [
    { id: "p01", name: "Sofá modular Linho · 3 plazas", category: "Mobiliario", space: "Sala + Comedor", brand: "Mobica", sku: "MB-LIN-3P", material: "Lino crudo · estructura de roble", dims: "240 × 95 × 72 cm", price: 52400, qty: 1, url: "https://mobica.com", img: "" },
    { id: "p02", name: "Mesa de comedor en roble macizo", category: "Mobiliario", space: "Sala + Comedor", brand: "Taller Cravan", sku: "TC-MES-220", material: "Roble natural aceitado", dims: "220 × 100 × 75 cm", price: 38900, qty: 1, url: "https://tallercravan.com", img: "" },
    { id: "p03", name: "Silla Wishbone · juego de 6", category: "Mobiliario", space: "Sala + Comedor", brand: "Carl Hansen & Søn", sku: "CH24-OAK", material: "Roble jabonado · asiento de cuerda", dims: "55 × 51 × 76 cm", price: 64800, qty: 6, url: "https://carlhansen.com", img: "" },
    { id: "p04", name: "Lámpara colgante de lino plisado", category: "Iluminación", space: "Sala + Comedor", brand: "Astep", sku: "AST-MOD-50", material: "Pantalla de lino · herraje latón", dims: "Ø 50 cm", price: 14200, qty: 2, url: "", img: "" },
    { id: "p05", name: "Tapete de lana anudado a mano", category: "Textiles", space: "Sala Privada", brand: "Taller Mara", sku: "TM-RUG-300", material: "Lana natural sin teñir", dims: "300 × 200 cm", price: 28500, qty: 1, url: "", img: "" },
    { id: "p06", name: "Cabecera tapizada en bouclé", category: "Mobiliario", space: "Recámara Principal", brand: "Mobica", sku: "MB-CAB-180", material: "Bouclé arena", dims: "180 × 130 cm", price: 19900, qty: 1, url: "https://mobica.com", img: "" },
    { id: "p07", name: "Buró de nogal · 2 cajones", category: "Mobiliario", space: "Recámara Principal", brand: "Taller Cravan", sku: "TC-BUR-02", material: "Nogal macizo", dims: "55 × 40 × 50 cm", price: 12400, qty: 2, url: "https://tallercravan.com", img: "" },
    { id: "p08", name: "Poltrona de lectura en cuero", category: "Mobiliario", space: "Cuarto de Lectura", brand: "Tapizados Sur", sku: "TS-POL-01", material: "Cuero camel · base de roble", dims: "78 × 82 × 90 cm", price: 31700, qty: 1, url: "", img: "" },
    { id: "p09", name: "Mesa de centro de travertino", category: "Mobiliario", space: "Sala Privada", brand: "Atra", sku: "ATR-TRV-120", material: "Travertino romano", dims: "120 × 60 × 35 cm", price: 42300, qty: 1, url: "https://atra.mx", img: "" },
    { id: "p10", name: "Espejo redondo con marco de latón", category: "Decoración", space: "Baño Principal", brand: "La Metropolitana", sku: "LM-ESP-80", material: "Latón cepillado", dims: "Ø 80 cm", price: 8900, qty: 1, url: "https://lametropolitana.mx", img: "" },
    { id: "p11", name: "Cortina de lino a medida · blackout", category: "Textiles", space: "Recámara Principal", brand: "Casa Textil", sku: "CT-COR-LIN", material: "Lino belga · forro blackout", dims: "A medida", price: 15600, qty: 1, url: "", img: "" }
  ],

  /* ---- Programa de Iluminación (comprable) ---- */
  lighting: [
    { id: "l01", name: "Aplique de muro en lino", category: "Iluminación", space: "Recámara Principal", brand: "Astep", sku: "AST-WL-22", material: "Latón · pantalla de lino", dims: "Ø 22 cm", price: 6800, qty: 2, url: "https://astep.design", img: "" },
    { id: "l02", name: "Lámpara de piso tipo arco", category: "Iluminación", space: "Sala Privada", brand: "Flos", sku: "FL-ARC-01", material: "Acero · base de mármol", dims: "H 210 cm", price: 38500, qty: 1, url: "https://flos.com", img: "" },
    { id: "l03", name: "Riel de spots empotrados", category: "Iluminación", space: "Cocina + Pantry", brand: "Lumens", sku: "LM-TRK-6", material: "Aluminio negro mate", dims: "120 cm · 6 luces", price: 9200, qty: 2, url: "", img: "" },
    { id: "l04", name: "Candil de comedor esférico", category: "Iluminación", space: "Sala + Comedor", brand: "Pulpo", sku: "PU-SPH-9", material: "Vidrio soplado · latón", dims: "Ø 90 cm", price: 54200, qty: 1, url: "https://pulpoproducts.com", img: "" },
    { id: "l05", name: "Lámpara de lectura abatible", category: "Iluminación", space: "Cuarto de Lectura", brand: "Marset", sku: "MS-RD-01", material: "Aluminio lacado", dims: "Brazo 60 cm", price: 12900, qty: 1, url: "", img: "" }
  ],

  /* ---- Programa de Herrajes (comprable) ---- */
  hardware: [
    { id: "h01", name: "Jaladera tipo barra", category: "Herrajes", space: "Cocina + Pantry", brand: "Tradisa", sku: "TR-JL-30", material: "Latón cepillado", dims: "30 cm", price: 480, qty: 24, url: "https://tradisa.com", img: "" },
    { id: "h02", name: "Bisagra oculta soft-close", category: "Herrajes", space: "General", brand: "Häfele", sku: "HF-BIS-SC", material: "Acero niquelado", dims: "110°", price: 120, qty: 40, url: "https://hafele.com", img: "" },
    { id: "h03", name: "Manija de puerta minimalista", category: "Herrajes", space: "Recámara Principal", brand: "Tradisa", sku: "TR-MN-02", material: "Latón mate", dims: "Roseta Ø 50", price: 950, qty: 6, url: "", img: "" },
    { id: "h04", name: "Corredera de cajón push", category: "Herrajes", space: "Cocina + Pantry", brand: "Blum", sku: "BL-RL-500", material: "Acero", dims: "50 cm", price: 680, qty: 18, url: "https://blum.com", img: "" },
    { id: "h05", name: "Toallero / colgador de baño", category: "Herrajes", space: "Baño Principal", brand: "Tradisa", sku: "TR-TP-01", material: "Latón", dims: "40 cm", price: 320, qty: 4, url: "", img: "" }
  ],

  /* ---- Programa de Equipamiento (comprable) ---- */
  equipment: [
    { id: "e01", name: "Campana de extracción", category: "Equipamiento", space: "Cocina + Pantry", brand: "Teka", sku: "TK-CMP-90", material: "Acero inoxidable", dims: "90 cm", price: 18900, qty: 1, url: "https://teka.com", img: "" },
    { id: "e02", name: "Parrilla de inducción · 5 zonas", category: "Equipamiento", space: "Cocina + Pantry", brand: "Bosch", sku: "BS-IND-5", material: "Cristal templado", dims: "80 cm", price: 24500, qty: 1, url: "https://bosch.mx", img: "" },
    { id: "e03", name: "Lavadora-secadora", category: "Equipamiento", space: "Lavandería", brand: "LG", sku: "LG-WD-22", material: "Acero / cristal", dims: "22 kg", price: 21900, qty: 1, url: "https://lg.com", img: "" },
    { id: "e04", name: "Calentador de paso", category: "Equipamiento", space: "General", brand: "Rheem", sku: "RH-CAL-13", material: "—", dims: "13 L/min", price: 9800, qty: 1, url: "", img: "" },
    { id: "e05", name: "Mini split inverter", category: "Equipamiento", space: "Recámara Principal", brand: "Mirage", sku: "MR-MS-12", material: "—", dims: "12,000 BTU", price: 13900, qty: 3, url: "https://mirage.com.mx", img: "" }
  ],

  /* ---- Esquema de Acabados (informativo · sin compra) ---- */
  finishes: [
    { id: "f01", type: "Piso", name: "Mármol blanco", finish: "Pulido", space: "Cocina + Pantry", brand: "Interceramic", sku: "IC-MRM-60", area: "23.87 m²" },
    { id: "f02", type: "Muro", name: "Chapa de madera de roble", finish: "Natural mate", space: "Cocina + Pantry", brand: "Maderería Sonora", sku: "MS-CHP-RB", area: "—" },
    { id: "f03", type: "Piso", name: "Piso de ingeniería de roble", finish: "Aceitado", space: "Recámara Principal", brand: "Quick-Step", sku: "QS-ING-RB", area: "40.86 m²" },
    { id: "f04", type: "Muro", name: "Papel tapiz textil", finish: "Lino", space: "Recámara Principal", brand: "Casa Textil", sku: "CT-TAP-01", area: "—" },
    { id: "f05", type: "Piso", name: "Mármol", finish: "Pulido", space: "Baño Principal", brand: "Interceramic", sku: "IC-MRM-BN", area: "12.40 m²" },
    { id: "f06", type: "Muro", name: "Azulejo zellige", finish: "Esmaltado", space: "Baño Principal", brand: "Mosaico", sku: "MO-ZEL-10", area: "—" },
    { id: "f07", type: "Techo", name: "Pintura vinílica", finish: "Mate", space: "General", brand: "Comex", sku: "CMX-VIN-BL", area: "—" },
    { id: "f08", type: "Piso", name: "Piedra braza", finish: "Natural", space: "Terraza + Balcón", brand: "Canteras del Norte", sku: "CN-BRZ-01", area: "34.34 m²" }
  ],

  /* ---- Fichas técnicas de Carpintería ---- */
  carpentry: [
    { id: "c01", name: "Mueble de cocina · módulo inferior", space: "Cocina + Pantry", dims: "320 × 90 × 60 cm", materials: "MDF enchapado roble · cubierta de mármol", finish: "Laca mate", note: "Cajones con sistema push, herraje Blum. Cubierta de mármol blanco a 4 cm.", img: "" },
    { id: "c02", name: "Closet vestidor", space: "Recámara Principal", dims: "380 × 260 × 60 cm", materials: "MDF enchapado nogal", finish: "Natural aceitado", note: "Módulos abiertos + cajonera con jaladera de latón. Iluminación LED en repisas.", img: "" },
    { id: "c03", name: "Librero a medida", space: "Cuarto de Lectura", dims: "280 × 350 × 35 cm", materials: "MDF lacado", finish: "Mate arena", note: "Doble altura con escalera corrediza. Entrepaños ajustables.", img: "" },
    { id: "c04", name: "Pantry / alacena", space: "Cocina + Pantry", dims: "200 × 240 × 60 cm", materials: "Enchapado roble", finish: "Natural mate", note: "Puertas abatibles con persiana superior y cajones internos.", img: "" }
  ],

  /* ---- Renders / moodboard por zona ---- */
  renders: [
    { space: "Sala + Comedor", label: "Vista hacia ventanales", note: "Render principal", img: "" },
    { space: "Sala + Comedor", label: "Detalle de comedor", note: "Render secundario", img: "" },
    { space: "Recámara Principal", label: "Ambiente nocturno", note: "Render", img: "" },
    { space: "Cocina + Pantry", label: "Isla y pantry", note: "Render", img: "" },
    { space: "Baño Principal", label: "Zona de tina", note: "Render", img: "" },
    { space: "Cuarto de Lectura", label: "Rincón de lectura", note: "Render", img: "" }
  ],

  /* ---- Planos (imágenes que tú incrustas en `img`) ---- */
  planos: [
    { title: "Planta Baja", space: "Planta Baja", note: "Distribución general", img: "" },
    { title: "Planta Alta", space: "Planta Alta", note: "Distribución general", img: "" },
    { title: "Plano de carpintería", space: "General", note: "Despieces y cotas", img: "" }
  ]
};
