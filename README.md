# Aurum · Llave Maestra — Programa de Interiores

Documento interactivo del programa de interiores (Aurum Arquitectos). Una sola fuente de datos (`assets/data.js`) alimenta todo: tablas de productos, luminarias, herrajes, equipamiento, acabados, carpintería, espacios, planos y panel conceptual.

## Ver en línea
Publicado con GitHub Pages. La página de inicio es `index.html`.

## Editar el contenido (sin tocar código)
1. Abre el documento y, hasta abajo, haz clic en **"⚙ Base de datos · editar contenido"**.
2. **Descargar plantilla (Excel)** — un `.xlsx` con una hoja por tabla, ya con los datos actuales.
3. Llénalo en Excel o Google Sheets. Reglas:
   - `img` = URL de imagen/render (vacío = placeholder).
   - `url` = liga de compra (vacío = sin botón, solo proveedor + SKU).
   - `price` y `qty` = solo números.
   - `space` debe coincidir con un nombre de la hoja **Espacios**.
   - No cambies encabezados ni nombres de hoja.
4. **Cargar Excel** — el documento se reconstruye (queda guardado en tu navegador).
5. **Descargar data.js** — reemplaza `assets/data.js` con ese archivo y súbelo al repo para que el sitio publicado se actualice.

## Estructura
```
index.html              Documento principal
assets/
  data.js               ← ÚNICA fuente de contenido (la reemplazas para actualizar)
  app.js                Render e interacción
  styles.css            Sistema visual
  data-tools.js         Plantilla Excel · importar · exportar
  image-slot.js         Slots de imagen del hero/logo
```

## Notas
- Las imágenes deben ser URLs (columna `img`) para que se vean en el sitio publicado.
- Precios en MXN.
