/**
 * ItaliaMap — Web Component riutilizzabile
 * Mappa interattiva delle 20 regioni italiane (D3 + TopoJSON + ISTAT)
 *
 * UTILIZZO BASE:
 *   <italia-map></italia-map>
 *
 * ATTRIBUTI:
 *   width="300"              larghezza SVG in px (default: 300)
 *   height="500"             altezza SVG in px (default: 500)
 *   color-base="#4CAF50"     colore regioni (default: verde)
 *   color-hover="#F57C00"    colore hover/selezione (default: arancione)
 *   show-list="true"         mostra lista regioni a fianco (default: true)
 *   show-info="true"         mostra barra info sotto (default: true)
 *
 * EVENTI CUSTOM (ascoltabili dall'esterno):
 *   region-select → event.detail = { name, slug }
 *
 * METODI PUBBLICI:
 *   el.setData(obj)          passa dati per regione { "Lombardia": 42, ... }
 *   el.selectRegion(name)    seleziona regione da codice
 *   el.getSelected()         restituisce nome regione attiva
 *
 * ESEMPIO con dati e callback:
 *   const map = document.querySelector('italia-map');
 *   map.setData({ Lombardia: 42, Lazio: 31 });
 *   map.addEventListener('region-select', e => console.log(e.detail));
 *
 * DIPENDENZE (caricate automaticamente via CDN):
 *   D3 v7, TopoJSON Client v3
 *   GeoJSON: openpolis/geojson-italy (confini ISTAT ufficiali)
 */

const TOPO_URL = 'https://cdn.jsdelivr.net/gh/openpolis/geojson-italy@master/topojson/limits_IT_regions.topo.json';
const D3_URL   = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
const TOPO_CLIENT_URL = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';

function slugify(name) {
  return name.toLowerCase()
    .replace(/[àáâã]/g, 'a').replace(/[èéê]/g, 'e')
    .replace(/[ìíî]/g, 'i').replace(/[òóô]/g, 'o')
    .replace(/[ùúû]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host { display: block; font-family: system-ui, sans-serif; }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .wrap { display: flex; gap: 0; align-items: flex-start; }
  .map-col { position: relative; flex-shrink: 0; }
  .list-col { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 8px 0 8px 18px; min-width: 160px; }

  #map-loading {
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: #888;
  }
  #italy-svg { display: none; }

  .region-path {
    fill: var(--im-color-base, #4CAF50);
    stroke: #fff; stroke-width: 0.8;
    cursor: pointer;
    transition: fill .15s;
  }
  .region-path:hover  { fill: var(--im-color-hover, #F57C00); }
  .region-path.active { fill: var(--im-color-hover, #F57C00); }

  #map-tooltip {
    position: absolute;
    background: #222; color: #fff;
    padding: 4px 10px; border-radius: 5px;
    font-size: 12px; font-weight: 500;
    pointer-events: none; display: none;
    white-space: nowrap; z-index: 10;
  }

  /* Lista regioni */
  .list-title {
    font-size: 10px; font-weight: 600;
    color: #888; letter-spacing: .07em;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .regioni-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .reg-item {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 6px; border-radius: 4px;
    cursor: pointer; transition: background .12s;
    font-size: 11.5px; color: #333;
  }
  .reg-item:hover  { background: #f0f0ec; }
  .reg-item.active { background: #f0f0ec; color: #2e7d32; }
  .reg-item .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--im-color-base, #4CAF50);
    flex-shrink: 0; transition: background .12s;
  }
  .reg-item.active .dot { background: var(--im-color-hover, #F57C00); }

  /* Info bar */
  .info-bar {
    margin-top: 14px; padding: 10px 14px;
    background: #f7f7f3; border-radius: 8px;
    border: 1px solid #e0e0d8; font-size: 13px;
  }
  .info-name { font-weight: 600; font-size: 14px; color: #1a1a1a; }
  .info-sub  { color: #666; font-size: 12px; margin-top: 2px; }
  .info-btn  {
    margin-top: 8px; display: inline-block;
    padding: 5px 12px;
    background: var(--im-color-base, #4CAF50);
    color: #fff; border-radius: 5px;
    font-size: 12px; font-weight: 500;
    cursor: pointer; border: none;
    transition: opacity .15s;
    display: none;
  }
  .info-btn:hover { opacity: .85; }

  /* nasconde sezioni opzionali */
  .list-col.hidden  { display: none; }
  .info-bar.hidden  { display: none; }
</style>

<div class="wrap">
  <div class="map-col">
    <div id="map-tooltip"></div>
    <div id="map-loading">Caricamento mappa…</div>
    <svg id="italy-svg"></svg>
  </div>
  <div class="list-col">
    <div class="list-title">Seleziona regione</div>
    <div class="regioni-list" id="regiList"></div>
  </div>
</div>
<div class="info-bar" id="infoBar">
  <div class="info-name" id="infoName">Tutte le regioni</div>
  <div class="info-sub"  id="infoSub">Clicca una regione per esplorare</div>
  <button class="info-btn" id="infoBtn">Vai alla regione →</button>
</div>
`;

class ItaliaMap extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._data      = {};
    this._active    = null;
    this._features  = [];
    this._onBtnClick = null;
  }

  /* ── Lifecycle ── */

  connectedCallback() {
    this._applyAttrs();
    this._init();
  }

  static get observedAttributes() {
    return ['color-base','color-hover','width','height','show-list','show-info'];
  }

  attributeChangedCallback() {
    this._applyAttrs();
  }

  /* ── Attributi → CSS vars ── */

  _applyAttrs() {
    const w    = this.getAttribute('width')       || '300';
    const h    = this.getAttribute('height')      || '500';
    const base = this.getAttribute('color-base')  || '#4CAF50';
    const hov  = this.getAttribute('color-hover') || '#F57C00';
    const showList = this.getAttribute('show-list') !== 'false';
    const showInfo = this.getAttribute('show-info') !== 'false';

    this.style.setProperty('--im-color-base',  base);
    this.style.setProperty('--im-color-hover', hov);

    const svg = this.shadowRoot.getElementById('italy-svg');
    const loading = this.shadowRoot.getElementById('map-loading');
    if (svg)     { svg.setAttribute('width', w); svg.setAttribute('height', h); }
    if (loading) { loading.style.width = w + 'px'; loading.style.height = h + 'px'; }

    const listCol = this.shadowRoot.querySelector('.list-col');
    const infoBar = this.shadowRoot.getElementById('infoBar');
    if (listCol) listCol.classList.toggle('hidden', !showList);
    if (infoBar) infoBar.classList.toggle('hidden', !showInfo);
  }

  /* ── Caricamento dipendenze + mappa ── */

  async _init() {
    try {
      await loadScript(D3_URL);
      await loadScript(TOPO_CLIENT_URL);
      await this._loadMap();
    } catch(e) {
      this.shadowRoot.getElementById('map-loading').textContent = 'Errore caricamento mappa.';
      console.error('[ItaliaMap]', e);
    }
  }

  async _loadMap() {
    const w = parseInt(this.getAttribute('width')  || '300');
    const h = parseInt(this.getAttribute('height') || '500');

    const topo     = await d3.json(TOPO_URL);
    const objKey   = Object.keys(topo.objects)[0];
    this._features = topojson.feature(topo, topo.objects[objKey]).features;

    const projection = d3.geoMercator()
      .fitSize([w, h], { type: 'FeatureCollection', features: this._features });
    const pathGen = d3.geoPath().projection(projection);

    const svgEl  = this.shadowRoot.getElementById('italy-svg');
    const loading = this.shadowRoot.getElementById('map-loading');

    loading.style.display = 'none';
    svgEl.style.display = 'block';
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const tt = this.shadowRoot.getElementById('map-tooltip');
    const regionNames = [];

    this._features.forEach(feat => {
      const nome = this._regionName(feat);
      if (nome) regionNames.push(nome);

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('class', 'region-path');
      pathEl.setAttribute('d', pathGen(feat));
      pathEl.dataset.name = nome;

      pathEl.addEventListener('mouseenter', () => {
        tt.textContent = nome;
        tt.style.display = 'block';
      });
      pathEl.addEventListener('mousemove', e => {
        const rect = svgEl.getBoundingClientRect();
        tt.style.left = (e.clientX - rect.left + 12) + 'px';
        tt.style.top  = (e.clientY - rect.top  - 30) + 'px';
      });
      pathEl.addEventListener('mouseleave', () => { tt.style.display = 'none'; });
      pathEl.addEventListener('click', () => this.selectRegion(nome));

      svgEl.appendChild(pathEl);
    });

    /* Lista laterale */
    const list = this.shadowRoot.getElementById('regiList');
    regionNames.sort().forEach(r => {
      const el = document.createElement('div');
      el.className = 'reg-item';
      el.dataset.name = r;
      el.innerHTML = `<span class="dot"></span>${r}`;
      el.addEventListener('click', () => this.selectRegion(r));
      list.appendChild(el);
    });
  }

  _regionName(feat) {
    return feat.properties.reg_name
        || feat.properties.name
        || feat.properties.NAME_1
        || '';
  }

  /* ── API pubblica ── */

  /**
   * Passa dati per regione: { "Lombardia": 42, "Lazio": 31, ... }
   * Vengono mostrati nel tooltip e nell'info bar.
   */
  setData(obj) {
    this._data = obj || {};
    // aggiorna tooltip se una regione è già attiva
    if (this._active) this._updateInfoBar(this._active);
  }

  /** Seleziona una regione programmaticamente */
  selectRegion(nome) {
    this._active = nome;

    this.shadowRoot.querySelectorAll('.region-path')
      .forEach(p => p.classList.toggle('active', p.dataset.name === nome));
    this.shadowRoot.querySelectorAll('.reg-item')
      .forEach(el => el.classList.toggle('active', el.dataset.name === nome));

    this._updateInfoBar(nome);

    /* Evento custom verso l'esterno */
    this.dispatchEvent(new CustomEvent('region-select', {
      bubbles: true, composed: true,
      detail: { name: nome, slug: slugify(nome) }
    }));
  }

  /** Restituisce il nome della regione attiva (o null) */
  getSelected() { return this._active; }

  /* ── Info bar ── */

  _updateInfoBar(nome) {
    const infoName = this.shadowRoot.getElementById('infoName');
    const infoSub  = this.shadowRoot.getElementById('infoSub');
    const infoBtn  = this.shadowRoot.getElementById('infoBtn');

    infoName.textContent = nome;

    const val = this._data[nome];
    if (val !== undefined) {
      infoSub.textContent = typeof val === 'number'
        ? `${val} element${val === 1 ? 'o' : 'i'} disponibil${val === 1 ? 'e' : 'i'}`
        : String(val);
    } else {
      infoSub.textContent = 'Nessun dato disponibile';
    }

    infoBtn.style.display = 'inline-block';
    infoBtn.onclick = () => {
      this.dispatchEvent(new CustomEvent('region-navigate', {
        bubbles: true, composed: true,
        detail: { name: nome, slug: slugify(nome) }
      }));
    };
  }
}

customElements.define('italia-map', ItaliaMap);
