const STORAGE_KEY = "postroute-v2";
const defaultCenter = [48.101, 15.408]; // Kilb, Niederösterreich
let route = [];
let splitBefore = 0;
let selectedPoint = null;
let markers = [];
let routeLine = null;

const $ = id => document.getElementById(id);
const map = L.map("map").setView(defaultCenter, 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({route, splitBefore}));
}
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    route = Array.isArray(data.route) ? data.route : [];
    splitBefore = Number(data.splitBefore) || 0;
  } catch { route = []; splitBefore = 0; }
  render();
}
function safeText(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}
function message(text, isError=false) {
  $("searchMessage").textContent = text;
  $("searchMessage").style.color = isError ? "#a82f2f" : "#176b52";
}
function addTarget(target) {
  const duplicate = route.some(x => x.lat.toFixed(5) === target.lat.toFixed(5) && x.lon.toFixed(5) === target.lon.toFixed(5));
  if (duplicate) { message("Dieser Kartenpunkt ist bereits in deiner Route.", true); return; }
  route.push({...target, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()), status:"open"});
  selectedPoint = null;
  render();
  message("Adresse wurde zur Route hinzugefügt.");
}
function clearMapMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
}
function render() {
  clearMapMarkers();
  route.forEach((item, index) => {
    const marker = L.marker([item.lat, item.lon]).addTo(map);
    const section = splitBefore && index >= splitBefore ? "Abschnitt 2" : "Abschnitt 1";
    marker.bindPopup(`<b>${index+1}. ${safeText(item.address)}</b><br>${section}<br>Status: ${item.status === "done" ? "Erledigt" : item.status === "skipped" ? "Übersprungen" : "Offen"}`);
    markers.push(marker);
  });
  if (route.length > 1) {
    routeLine = L.polyline(route.map(x => [x.lat,x.lon]), {color:"#176b52", weight:4, opacity:.8, dashArray:"7 6"}).addTo(map);
  }
  $("routeCount").textContent = `${route.length} Ziele`;
  $("routeList").innerHTML = route.length ? route.map((item,i) => `
    <div class="route-item ${item.status}" data-id="${item.id}">
      <div class="route-number">${i+1}</div>
      <div><div class="route-address">${safeText(item.address)}</div>
      <div class="route-meta">${splitBefore && i >= splitBefore ? "Abschnitt 2" : "Abschnitt 1"} · ${item.status === "done" ? "Erledigt" : item.status === "skipped" ? "Übersprungen" : "Offen"}</div></div>
      <div class="item-actions">
        <button class="secondary" data-action="focus" data-id="${item.id}">Karte</button>
        <button data-action="done" data-id="${item.id}">${item.status === "done" ? "Wieder öffnen" : "Erledigt"}</button>
        <button class="secondary" data-action="skip" data-id="${item.id}">${item.status === "skipped" ? "Wieder öffnen" : "Überspringen"}</button>
        <button class="danger" data-action="delete" data-id="${item.id}">✕</button>
      </div>
    </div>`).join("") : '<p class="hint">Noch keine Ziele. Suche eine Adresse oder tippe auf die Karte.</p>';
  const select = $("splitSelect");
  const old = splitBefore;
  select.innerHTML = '<option value="0">Kein Abschnitt 2</option>' + route.map((x,i) => `<option value="${i}">Abschnitt 2 beginnt vor Ziel ${i+1}: ${safeText(x.address)}</option>`).join("");
  select.value = route.length && old > 0 && old < route.length ? String(old) : "0";
  splitBefore = Number(select.value);
  save();
}
$("routeList").addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const index = route.findIndex(x => x.id === btn.dataset.id);
  if (index < 0) return;
  const item = route[index];
  switch(btn.dataset.action) {
    case "focus": map.setView([item.lat,item.lon],18); markers[index]?.openPopup(); break;
    case "done": item.status = item.status === "done" ? "open" : "done"; render(); break;
    case "skip": item.status = item.status === "skipped" ? "open" : "skipped"; render(); break;
    case "delete": route.splice(index,1); if (splitBefore > index) splitBefore--; render(); break;
  }
});
$("splitSelect").addEventListener("change", () => { splitBefore = Number($("splitSelect").value); render(); });
$("splitBtn").addEventListener("click", () => {
  $("splitSelect").focus();
  $("nextMessage").textContent = "Wähle unten aus, vor welchem Ziel Abschnitt 2 beginnen soll.";
});
function nextOpen() {
  const item = route.find(x => x.status === "open");
  if (!item) { $("nextMessage").textContent = route.length ? "Keine offenen Ziele mehr." : "Füge zuerst Adressen hinzu."; return; }
  map.setView([item.lat,item.lon],18);
  const index = route.indexOf(item);
  markers[index]?.openPopup();
  $("nextMessage").textContent = `Nächstes offenes Ziel: ${item.address}`;
}
$("nextBtn").addEventListener("click", nextOpen);
let pendingMapPoint = null;
map.on("click", e => {
  pendingMapPoint = {lat:e.latlng.lat, lon:e.latlng.lng};
  $("pointCoordinates").textContent = `Kartenpunkt: ${pendingMapPoint.lat.toFixed(5)}, ${pendingMapPoint.lon.toFixed(5)}. Die Adresse kannst du selbst eintragen.`;
  $("pointAddress").value = "";
  $("pointDialog").showModal();
});
$("addMapPointBtn").addEventListener("click", () => {
  if (!pendingMapPoint) { message("Tippe zuerst auf die Karte, um einen Punkt auszuwählen.", true); return; }
  $("pointDialog").showModal();
});
$("pointForm").addEventListener("submit", e => {
  if (e.submitter && e.submitter.value === "cancel") return;
  e.preventDefault();
  if (!pendingMapPoint || !$("pointAddress").value.trim()) return;
  addTarget({...pendingMapPoint, address:$("pointAddress").value.trim()});
  $("pointDialog").close();
});
$("clearSearchBtn").addEventListener("click", () => { selectedPoint = null; pendingMapPoint = null; $("searchResults").innerHTML=""; message("Suchauswahl gelöscht."); });
async function searchAddress() {
  const query = $("addressSearch").value.trim();
  if (!query) { message("Bitte gib eine Adresse ein.", true); return; }
  message("Suche Adresse …");
  $("searchResults").innerHTML = "";
  try {
    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=" + encodeURIComponent(query);
    const response = await fetch(url, {headers: {"Accept-Language":"de"}});
    if (!response.ok) throw new Error("Die Suche ist momentan nicht erreichbar.");
    const results = await response.json();
    if (!results.length) { message("Keine passende Adresse gefunden. Versuche Straße, Hausnummer und Kilb.", true); return; }
    message("Wähle den passenden Treffer aus:");
    $("searchResults").innerHTML = results.map((r,i) => `<div class="result-item"><div>${safeText(r.display_name)}</div><button data-result="${i}">Ansehen</button></div>`).join("");
    $("searchResults")._results = results;
  } catch (err) { message("Adresssuche fehlgeschlagen. Bitte Internetverbindung prüfen und erneut versuchen.", true); }
}
$("searchBtn").addEventListener("click", searchAddress);
$("addressSearch").addEventListener("keydown", e => { if(e.key === "Enter") searchAddress(); });
$("searchResults").addEventListener("click", e => {
  const btn = e.target.closest("button[data-result]");
  if (!btn) return;
  const r = $("searchResults")._results?.[Number(btn.dataset.result)];
  if (!r) return;
  selectedPoint = {lat:Number(r.lat),lon:Number(r.lon),address:r.display_name};
  pendingMapPoint = {lat:selectedPoint.lat,lon:selectedPoint.lon};
  map.setView([selectedPoint.lat,selectedPoint.lon],18);
  L.popup().setLatLng([selectedPoint.lat,selectedPoint.lon]).setContent(`<b>${safeText(r.display_name)}</b><br><button id="popupAdd">Zur Route hinzufügen</button>`).openOn(map);
  setTimeout(() => {
    const popupAdd = document.getElementById("popupAdd");
    if (popupAdd) popupAdd.onclick = () => { addTarget(selectedPoint); map.closePopup(); };
  }, 0);
});
$("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) { $("nextMessage").textContent = "GPS ist in diesem Browser nicht verfügbar."; return; }
  $("nextMessage").textContent = "Standort wird ermittelt …";
  navigator.geolocation.getCurrentPosition(pos => {
    const p = [pos.coords.latitude,pos.coords.longitude];
    L.circleMarker(p,{radius:8,color:"#176b52",fillColor:"#8de0b9",fillOpacity:1}).addTo(map).bindPopup("Dein aktueller Standort").openPopup();
    map.setView(p,17);
    $("nextMessage").textContent = "Dein Standort wurde angezeigt. Tippe auf „Nächstes offenes Ziel“, um das nächste Ziel auf der Karte zu finden.";
  }, () => $("nextMessage").textContent = "Standort konnte nicht ermittelt werden. Bitte GPS-Berechtigung prüfen.", {enableHighAccuracy:true,timeout:12000});
});
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({route,splitBefore},null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="postroute-backup.json"; a.click(); URL.revokeObjectURL(url);
});
$("importInput").addEventListener("change", async e => {
  const file=e.target.files[0]; if(!file)return;
  try { const data=JSON.parse(await file.text()); if(!Array.isArray(data.route)) throw new Error(); route=data.route; splitBefore=Number(data.splitBefore)||0; render(); message("Route importiert."); }
  catch { message("Datei konnte nicht importiert werden.",true); }
  e.target.value="";
});
$("clearRouteBtn").addEventListener("click", () => {
  if(confirm("Möchtest du wirklich alle Ziele aus der Route löschen?")) { route=[]; splitBefore=0; render(); $("nextMessage").textContent=""; }
});
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
}
load();