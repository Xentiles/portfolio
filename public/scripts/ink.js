/* Orbital Clarity ink field, orbit and portrait. Ported from e-ink study 03. */
(() => {
  const root = document.documentElement;
  const L = Object.assign({ copied: "Copied: ", toCharcoal: "Switch to Charcoal theme", toPaper: "Switch to Paper theme", charcoal: "Charcoal", paper: "Paper", pause: "Pause motion", resume: "Resume motion" }, window.__ink_i18n || {});
  // Any script error is written into the footer, so a broken view can be diagnosed from a screenshot.
  function reportError(e) {
    const msg = (e && (e.message || e.reason && e.reason.message)) || String(e);
    const note = document.getElementById("fieldNote");
    if (note && !note.dataset.err) { note.dataset.err = "1"; note.hidden = false; note.textContent = (note.textContent ? note.textContent + " · " : "") + "Script error: " + String(msg).slice(0, 240); }
    console.error(e);
  }
  addEventListener("error", e => reportError(e.error || e.message));
  addEventListener("unhandledrejection", e => reportError(e.reason));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // On touch screens the page scrolls on its own thread, so anything the field paints a frame later
  // than the scroll (the portrait, the scroll parallax) visibly jitters. There the portrait is a plain
  // masked image that scrolls with the page, and scroll parallax is off.
  const touch = !matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (touch) root.classList.add("touch");
  // Pages without the hero (case studies) get an invisible stand-in, so the field, orbit and portrait
  // code runs unchanged and simply draws nothing visible.
  if (!document.getElementById("orbit")) {
    const box = document.createElement("div");
    box.setAttribute("aria-hidden", "true");
    box.style.cssText = "position:fixed;left:-9999px;top:0;width:300px;height:450px;visibility:hidden;pointer-events:none";
    box.innerHTML = '<canvas id="orbit"></canvas><figure id="portrait" style="margin:0;width:300px;height:450px"><img id="pfpImg" alt=""></figure>';
    document.body.appendChild(box);
  }
  const defaults = { mode: "charcoal" };
  let state = { ...defaults };
  try { Object.assign(state, JSON.parse(localStorage.getItem("dn-site") || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem("dn-site", JSON.stringify(state)); } catch (e) {} };
  let paused = reduce;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const css = n => getComputedStyle(root).getPropertyValue(n).trim();

  /* ---------- Spring easing, sampled into CSS linear() where supported ---------- */
  function springCurve(stiffness = 170, damping = 15, mass = 1, samples = 48) {
    // Damped harmonic oscillator from 0 to 1, simulated until it settles.
    let x = 0, v = 0; const dt = 1 / 240; const pts = []; let t = 0;
    const total = 1.2;
    const stepEvery = total / samples;
    let next = 0;
    while (t <= total + 1e-6) {
      if (t >= next) { pts.push(x); next += stepEvery; }
      const a = (-stiffness * (x - 1) - damping * v) / mass;
      v += a * dt; x += v * dt; t += dt;
    }
    pts[pts.length - 1] = 1;
    return pts;
  }
  const springPts = springCurve(170, 15);
  if (CSS.supports("transition-timing-function", "linear(0, 1)")) {
    root.style.setProperty("--spring", `linear(${springPts.map(p => p.toFixed(4)).join(", ")})`);
  }
  const springLinear = `linear(${springPts.map(p => p.toFixed(4)).join(", ")})`;
  const canLinear = CSS.supports("transition-timing-function", "linear(0, 1)");
  const easeSpring = canLinear ? springLinear : "cubic-bezier(.2, 1.3, .4, 1)";
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  /* ---------- Paper fibre texture ---------- */
  (function makeTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    const img = g.createImageData(256, 256);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (rnd() - 0.5) * 70;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // Fibres: short, slightly curved strokes in light and dark.
    for (let i = 0; i < 220; i++) {
      const x = rnd() * 256, y = rnd() * 256, len = 6 + rnd() * 22, ang = rnd() * Math.PI;
      g.strokeStyle = rnd() > 0.5 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.30)";
      g.lineWidth = 0.6 + rnd() * 0.6;
      g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(ang) * len * 0.5 + (rnd() - 0.5) * 6, y + Math.sin(ang) * len * 0.5 + (rnd() - 0.5) * 6, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      g.stroke();
    }
    root.style.setProperty("--paper-tex", `url(${c.toDataURL("image/png")})`);
  })();

  /* ---------- Ink bloom masks: round capsules that grow until they merge ---------- */
  const maskCache = new Map();
  function bloomURL(r, c) {
    const key = r.toFixed(2) + ":" + c;
    if (maskCache.has(key)) return maskCache.get(key);
    const h = c / 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${c}"><circle cx="${h}" cy="${h}" r="${r.toFixed(2)}"/></svg>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    maskCache.set(key, url); return url;
  }
  const BLOOM_STEPS = 22;
  function setBloom(el, p) {
    const c = 6;
    const r = Math.min(p, 1) * c * 0.75;
    const u = bloomURL(Math.round(r * 4) / 4, c);
    el.style.webkitMaskImage = el.style.maskImage = u;
    el.style.webkitMaskSize = el.style.maskSize = `${c}px ${c}px`;
  }
  function clearBloom(el) { el.style.webkitMaskImage = el.style.maskImage = ""; el.style.webkitMaskSize = el.style.maskSize = ""; }
  const motionOn = () => !reduce;

  // Content soaks in like ink while it rises with a spring.
  function bloomIn(el, delay = 0, dur = 640) {
    if (!motionOn()) { clearBloom(el); return Promise.resolve(); }
    setBloom(el, 0);
    el.animate([{ transform: "translateY(14px)" }, { transform: "translateY(0)" }], { duration: 1200, delay, easing: easeSpring, fill: "backwards" });
    return new Promise(res => {
      const t0 = performance.now() + delay;
      const step = now => {
        const t = (now - t0) / dur;
        if (t < 0) { requestAnimationFrame(step); return; }
        if (t >= 1) { clearBloom(el); res(); return; }
        setBloom(el, easeOut(t)); requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  function drainOut(el, dur = 520) {
    return new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        const t = Math.min((now - t0) / dur, 1);
        setBloom(el, 1 - easeOut(t));
        el.style.opacity = String(1 - t * 0.35);
        if (t < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
  }
  function bloomAll(scope, base = 0) {
    const els = [...scope.querySelectorAll("[data-ink]")];
    return Promise.all(els.map((el, i) => bloomIn(el, base + i * 65)));
  }

  addEventListener("scroll", () => { if (paused) draw(); }, { passive: true });

  /* ---------- Link hub: liquid fill from the pointer's entry point ---------- */
  document.querySelectorAll(".hub > *").forEach(el => {
    const setOrigin = e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--fx", (e.clientX - r.left) + "px");
      el.style.setProperty("--fy", (e.clientY - r.top) + "px");
    };
    el.addEventListener("pointerenter", e => { setOrigin(e); requestAnimationFrame(() => el.classList.add("on")); });
    el.addEventListener("pointerleave", e => { setOrigin(e); el.classList.remove("on"); });
    el.addEventListener("focus", () => { el.style.setProperty("--fx", "0px"); el.style.setProperty("--fy", "50%"); el.classList.add("on"); });
    el.addEventListener("blur", () => el.classList.remove("on"));
  });
  // Every contact button assembles the address only when pressed, so it never sits in the page.
  document.querySelectorAll("[data-contact]").forEach(btn => btn.addEventListener("click", async () => {
    const addr = ["domisweden", "gmail.com"].join("@"), meta = btn.querySelector(".meta");
    try { await navigator.clipboard.writeText(addr); meta.textContent = L.copied + addr; }
    catch (e) { meta.textContent = addr; }
  }));

  /* ---------- Orbit: Kepler motion with a fading trail ---------- */
  const orbit = document.getElementById("orbit");
  const og = orbit.getContext("2d");
  orbit.addEventListener("contextrestored", () => { try { sizeOrbit(); drawOrbit(); } catch (e) {} });
  const ORB = { cx: 290, cy: 165, a: 150, e: 0.42, tilt: -0.32, period: 13 };
  ORB.b = ORB.a * Math.sqrt(1 - ORB.e * ORB.e) * 0.62; // flattened to read as a tilted orbit
  const trail = [];
  let orbitT = 3.2;
  function keplerPos(t) {
    const M = (2 * Math.PI * t) / ORB.period;
    let E = M; for (let i = 0; i < 6; i++) E = E - (E - ORB.e * Math.sin(E) - M) / (1 - ORB.e * Math.cos(E));
    const x = ORB.a * (Math.cos(E) - ORB.e), y = ORB.b * Math.sin(E);
    const c = Math.cos(ORB.tilt), s = Math.sin(ORB.tilt);
    return { x: ORB.cx + x * c - y * s, y: ORB.cy + x * s + y * c, z: y / ORB.b };
  }
  const portraitEl = document.getElementById("portrait");
  function sizeOrbit() {
    const d = Math.min(devicePixelRatio || 1, 2);
    // Scale the orbit to the portrait and pin its focus on the head.
    // Layout boxes, not screen rects, so the shared parallax shift is not counted twice.
    const pr = { left: portraitEl.offsetLeft, top: portraitEl.offsetTop, width: portraitEl.offsetWidth, height: portraitEl.offsetHeight };
    const W = pr.width * 1.6, sc = W / 460;
    orbit.style.width = W + "px"; orbit.style.height = (320 * sc) + "px";
    orbit.style.left = (pr.left + pr.width * 0.57 - ORB.cx * sc) + "px";
    orbit.style.top = (pr.top + pr.height * 0.30 - ORB.cy * sc) + "px";
    const r = orbit.getBoundingClientRect();
    orbit.width = Math.round(r.width * d); orbit.height = Math.round(r.height * d);
    og.setTransform(orbit.width / 460, 0, 0, orbit.height / 320, 0, 0);
  }
  // Occluder for the orbit: the portrait silhouette limited to the same soft circle the field paints.
  let headMask = null;
  (function buildHeadMask() {
    const img = document.getElementById("pfpImg");
    const make = () => {
      const w = 320, h = 480, c = document.createElement("canvas"); c.width = w; c.height = h;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, w, h);
      const g = x.createRadialGradient(w * .55, h * .29, w * .37, w * .55, h * .29, w * .62);
      g.addColorStop(0, "#000"); g.addColorStop(1, "rgba(0,0,0,0)");
      x.globalCompositeOperation = "destination-in"; x.fillStyle = g; x.fillRect(0, 0, w, h);
      headMask = c;
    };
    if (img.complete && img.naturalWidth) make(); else img.addEventListener("load", make, { once: true });
  })();
  function drawOrbit() {
    og.globalCompositeOperation = "source-over";
    og.clearRect(0, 0, 460, 320);
    const ink = css("--ink-soft"), accent = css("--accent");
    // Trail colour: the accent pulled a third of the way toward the page ink, so the dot alone carries full saturation.
    const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const a3 = hx(accent), i3 = hx(css("--ink"));
    const trailCol = `rgb(${a3.map((v, i) => Math.round(v + (i3[i] - v) * 0.35)).join(",")})`;
    // The orbit is a ring in 3D around the head. z < 0 is the far half (the upper arc on screen),
    // which is drawn first and then cut away wherever the head stands in front of it.
    const ring = [];
    for (let i = 0; i <= 240; i++) {
      const E = (i / 240) * Math.PI * 2, x = ORB.a * (Math.cos(E) - ORB.e), y = ORB.b * Math.sin(E);
      const c = Math.cos(ORB.tilt), sn = Math.sin(ORB.tilt);
      ring.push({ x: ORB.cx + x * c - y * sn, y: ORB.cy + x * sn + y * c, z: Math.sin(E) });
    }
    const n = trail.length, BANDS = 40, p = trail[n - 1];
    // Stroke the runs of pts[s0..s1] that lie on one side of the head.
    function runs(pts, s0, s1, front) {
      og.beginPath(); let on = false;
      for (let q = s0; q <= s1; q++) {
        const f = pts[q].z >= 0;
        if (f === front) { if (!on) { const a = q > s0 ? pts[q - 1] : pts[q]; og.moveTo(a.x, a.y); on = true; } og.lineTo(pts[q].x, pts[q].y); }
        else if (on) { og.lineTo(pts[q].x, pts[q].y); on = false; }
      }
      og.stroke();
    }
    function layer(front) {
      og.globalAlpha = 1; og.lineCap = "round"; og.strokeStyle = ink; og.lineWidth = 1;
      runs(ring, 0, ring.length - 1, front);
      if (!front) { og.beginPath(); og.arc(ORB.cx, ORB.cy, 3, 0, Math.PI * 2); og.stroke(); } // the focus sits inside the head
      // Trail: tapers and fades, drawn in bands so overlapping segments never stack up their opacity.
      og.lineCap = "butt"; og.lineJoin = "round"; og.strokeStyle = trailCol;
      for (let b = 0; b < BANDS; b++) {
        const s0 = Math.floor((b * (n - 1)) / BANDS), s1 = Math.floor(((b + 1) * (n - 1)) / BANDS);
        if (s1 <= s0) continue;
        const k = (b + 1) / BANDS;
        const zf = 0.35 + 0.65 * Math.min(Math.max((trail[(s0 + s1) >> 1].z + 0.35) / 0.7, 0), 1);
        og.globalAlpha = 0.9 * Math.pow(k, 1.8) * zf; og.lineWidth = (0.8 + k * 1.8) * (0.7 + 0.3 * zf);
        runs(trail, s0, s1, front);
      }
      og.globalAlpha = 1;
      if (p && (p.z >= 0) === front) { const zf = Math.min(Math.max((p.z + 0.35) / 0.7, 0), 1); og.beginPath(); og.arc(p.x, p.y, 3.6 + 1.6 * zf, 0, Math.PI * 2); og.fillStyle = accent; og.globalAlpha = 0.55 + 0.45 * zf; og.fill(); og.globalAlpha = 1; }
    }
    layer(false);
    // Occlusion: erase the far half wherever the portrait's silhouette covers it.
    if (headMask) {
      const r = orbit.getBoundingClientRect(), pr = portraitEl.getBoundingClientRect();
      if (r.width && r.height) {
        const sx = 460 / r.width, sy = 320 / r.height;
        og.globalCompositeOperation = "destination-out";
        og.drawImage(headMask, (pr.left - r.left) * sx, (pr.top - r.top) * sy, pr.width * sx, pr.height * sy);
        og.globalCompositeOperation = "source-over";
      }
    }
    layer(true);
  }
  function stepOrbit(dt) {
    orbitT += dt;
    // Sample densely so the trail stays smooth at perihelion speed.
    const sub = 4;
    for (let i = 1; i <= sub; i++) trail.push(keplerPos(orbitT - dt + (dt * i) / sub));
    trimTrail();
  }
  // The trail covers a tenth of the orbit's length, measured along the path, so it reads the same
  // whether the dot is racing past the head or drifting at the far end.
  const ORB_LEN = Math.PI * (3 * (ORB.a + ORB.b) - Math.sqrt((3 * ORB.a + ORB.b) * (ORB.a + 3 * ORB.b)));
  const TRAIL_LEN = ORB_LEN * 0.1;
  function trimTrail() {
    let len = 0, i = trail.length - 1;
    for (; i > 0; i--) { len += Math.hypot(trail[i].x - trail[i - 1].x, trail[i].y - trail[i - 1].y); if (len >= TRAIL_LEN) break; }
    if (i > 0) trail.splice(0, i - 1);
  }
  function primeOrbit() { trail.length = 0; for (let i = 0; i < 2400; i++) trail.push(keplerPos(orbitT - (2400 - i) / 240)); trimTrail(); }

  /* ---------- Capsule field (WebGL2) ---------- */
  const canvas = document.getElementById("field");
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
  let glOK = false;
  // Any graphics failure falls back to the still pattern and says why, instead of leaving a black page.
  function fieldFail(reason) {
    glOK = false; root.classList.add("no-gl");
    const note = document.getElementById("fieldNote");
    if (note) { note.hidden = false; note.textContent = "Ink field unavailable: " + reason; }
    console.warn("Ink field unavailable:", reason);
  }
  // If the graphics card drops the context (sleep, GPU reset, too much load), show the still pattern
  // for the moment and bring the field back as soon as the browser restores it.
  let lostCount = 0;
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); lostCount++; fieldFail("the graphics context was lost (" + lostCount + "), waiting for it to come back"); });
  canvas.addEventListener("webglcontextrestored", () => {
    glOK = initGL();
    if (!glOK) return;
    photoReady = false; uploadPhoto();
    root.classList.remove("no-gl");
    const note = document.getElementById("fieldNote"); if (note) { note.hidden = true; note.textContent = ""; }
    drawCount = 0; resize();
  });
  const VERT = `#version 300 es
in vec2 a; void main(){ gl_Position=vec4(a,0.,1.); }`;
  const FRAG = `#version 300 es
precision highp float; precision highp int;
out vec4 color;
uniform vec2 resolution; uniform vec2 cssSize; uniform float time; uniform float intensity;
uniform int mode; uniform float cell; uniform vec3 base; uniform vec3 capsule; uniform vec3 ink; uniform vec3 wall;
uniform vec3 touch[8];                         // cursor and its fading wake: x, y in CSS px, strength
uniform sampler2D photo; uniform vec4 pRect; uniform float pReveal; uniform vec3 tone0; uniform vec3 tone1;
float hash(vec2 p){ p=mod(p,289.); return fract((p.x*34.+1.)*p.x/289.+(p.y*71.+1.)*p.y/293.); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ return noise(p)*.57+noise(p*2.03+17.2)*.28+noise(p*4.11+41.7)*.15; }
float grainHash(vec2 p, uint seed){ uvec2 q=uvec2(ivec2(p)); uint h=(q.x*0x9e3779b9u)^(q.y*0x85ebca6bu)^seed;
  h=(h^(h>>16u))*0x7feb352du; h=(h^(h>>15u))*0x846ca68bu; h=h^(h>>16u); return float(h>>8u)/16777216.; }
float grainNoise(vec2 p, uint seed){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(grainHash(i,seed),grainHash(i+vec2(1.,0.),seed),f.x),mix(grainHash(i+vec2(0.,1.),seed),grainHash(i+vec2(1.,1.),seed),f.x),f.y); }
float dunesAt(vec2 pixel, float t){
  vec2 p=pixel/430.;
  vec2 warp=vec2(fbm(p*.74+vec2(t*.028,3.4)),fbm(p*.69+vec2(8.2,-t*.022)));
  float field=p.x*.78+p.y*.67+warp.x*2.2+warp.y*.9-t*.052;
  float wave=sin(field*3.5);
  float cw=(wave-.55)*5.; float crest=exp(-cw*cw);
  float broad=(fbm(p*.65+warp+vec2(t*.011,0.))-.5)*10.;
  return wave*5.5+crest*7.5+broad-3.5;
}
float fineAt(vec2 pixel, float t){
  vec2 p=pixel/430.;
  vec2 drift=vec2(sin(p.y*1.7+t*.13),cos(p.x*1.4+t*.11))*2.3;
  vec2 q=(pixel+drift)*.82;
  vec2 q2=vec2(q.x*.8-q.y*.6,q.x*.6+q.y*.8)*1.73+31.;
  vec2 q3=vec2(q.x*12./13.+q.y*5./13.,-q.x*5./13.+q.y*12./13.)*2.27+71.;
  return (grainNoise(q,11u)+grainNoise(q2,137u)+grainNoise(q3,719u)-1.5)*9.;
}
void main(){
  vec2 frag=vec2(gl_FragCoord.x, resolution.y-gl_FragCoord.y);
  vec2 pixel=frag/resolution*cssSize;
  float t=time;
  if(mode==0){
    float value=clamp(44.+intensity*(dunesAt(pixel,t)+fineAt(pixel,t)),24.,60.);
    color=vec4(vec3(value/255.),1.); return;
  }
  // Capsules sit in offset rows, like a honeycomb of microcapsules.
  float row=floor(pixel.y/cell);
  vec2 sp=pixel; sp.x+=mod(row,2.)*.5*cell;
  vec2 cid=floor(sp/cell);
  vec2 local=(fract(sp/cell)-.5);            // -0.5..0.5 inside this capsule
  vec2 center=(cid+.5)*cell; center.x-=mod(row,2.)*.5*cell;
  // How much ink this capsule holds, and which way the fluid is pushing it.
  float d0=dunesAt(center,t);
  float gx=dunesAt(center+vec2(cell,0.),t)-dunesAt(center-vec2(cell,0.),t);
  float gy=dunesAt(center+vec2(0.,cell),t)-dunesAt(center-vec2(0.,cell),t);
  vec2 flow=vec2(gx,gy); float fl=length(flow); flow=fl>1e-4?flow/fl:vec2(0.);
  float n=smoothstep(-9.,13.,intensity*d0);
  // The cursor behaves like an electrode: nearby capsules draw ink up and pool it toward the cursor.
  vec2 pull=vec2(0.); float lift=0.;
  for(int i=0;i<8;i++){
    vec3 tp=touch[i]; if(tp.z<.002) continue;
    vec2 dv=tp.xy-center; float d2=dot(dv,dv);
    float w=tp.z*exp(-d2/(2.*40.*40.));   // reach halved after review: a small, quiet electrode
    lift+=w; pull+=dv/(sqrt(d2)+1.)*w;
  }
  n=clamp(n+lift*.45,0.,1.);
  float charge=min(lift,1.);
  vec2 mixed=flow*(1.-min(lift,1.)*.6)+pull*1.; float ml=length(mixed); flow=ml>1e-4?mixed/ml:flow;
  float ph=grainHash(cid+3.,29u)*6.2831;
  float wob=sin(t*1.7+ph)*.03;                 // each capsule breathes a little on its own clock
  float wallR=.46;
  float r=wallR*sqrt(clamp(n+wob,0.,1.));
  vec2 off=flow*(wallR-r)*.85;                 // ink pools against the wall it is pushed toward
  float aa=1.2/cell;
  float inkMask=smoothstep(r+aa,r-aa,length(local-off));
  float inCap=smoothstep(wallR+aa,wallR-aa,length(local));
  vec3 col=mix(wall,capsule,inCap);
  vec3 inkC=mix(ink,ink+(ink-capsule)*1.4,charge*.35);  // charged ink near the cursor reads a touch brighter
  col=mix(col,inkC,inkMask*inCap);
  // Fine paper tooth across everything.
  // Portrait: a solid photograph at its core that breaks into capsule-sized dots toward its edges,
  // so it melts into the field instead of ending at a line.
  if(pReveal>0.){
    vec2 puv=(pixel-pRect.xy)/pRect.zw;
    vec2 cuv=(center-pRect.xy)/pRect.zw;
    if(cuv.x>-.05&&cuv.x<1.05&&cuv.y>-.05&&cuv.y<1.05){
      // An even circle around the middle of the head: fully clear inside, fading softly outward
      // (distances measured in portrait widths, so the circle stays round on the 2:3 frame).
      const vec2 HEAD=vec2(.55,.29); const float R0=.37, R1=.62;
      float circP=1.-smoothstep(R0,R1,length((puv-HEAD)*vec2(1.,1.5)));
      float circC=1.-smoothstep(R0,R1,length((cuv-HEAD)*vec2(1.,1.5)));
      vec4 phc=texture(photo,clamp(puv,0.,1.));
      float inP=step(0.,puv.x)*step(puv.x,1.)*step(0.,puv.y)*step(puv.y,1.);
      float mP=phc.a*circP*inP;
      float mC=texture(photo,clamp(cuv,0.,1.)).a*circC;
      // The reveal grows outward from the face like ink developing.
      float grow=smoothstep(pReveal*1.25-.25,pReveal*1.25,length((cuv-vec2(.57,.32))*vec2(1.,.75))*1.6);
      grow=1.-grow;
      mP*=grow; mC*=grow;
      float lum=dot(phc.rgb,vec3(.299,.587,.114));
      vec3 duo=mix(tone0,tone1,smoothstep(.03,.97,lum));
      vec3 pcol=mix(duo,phc.rgb,.32);
      // Inside the circle the photo is whole. In the fading ring it also breaks into capsule dots
      // that shrink to nothing, so the edge dissolves into the ink rather than ending on a line.
      float ring=1.-circC;
      float core=mP;
      float rr=wallR*1.18*sqrt(clamp(mC*1.1+wob+charge*.3*step(.05,mC),0.,1.));
      float dotM=smoothstep(rr+aa,rr-aa,length(local))*step(.04,mC)*smoothstep(0.,.25,ring);
      // Toward the rim the dots take on the field's own ink colour, so the photo hands over to the
      // capsules instead of leaving a ring of hard dark (Paper) or bright (Charcoal) dots.
      vec3 dcol=mix(pcol,inkC,smoothstep(.15,.85,ring));
      col=mix(col,dcol,dotM*(1.-core));
      col=mix(col,pcol,core);
    }
  }
  float tooth=(grainHash(pixel*1.,401u)-.5)*.018;
  col+=tooth;
  color=vec4(col,1.);
}`;
  let U = {}, elapsed = 0, lastDraw = -1e9;
  function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  function initGL() {
    if (!gl) return false;
    try {
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["resolution", "cssSize", "time", "intensity", "mode", "cell", "base", "capsule", "ink", "wall", "photo", "pRect", "pReveal", "tone0", "tone1"].forEach(n => U[n] = gl.getUniformLocation(prog, n));
      U.touch = gl.getUniformLocation(prog, "touch[0]");
      return true;
    } catch (e) { fieldFail(String(e && e.message || e).slice(0, 300)); return false; }
  }
  glOK = initGL(); if (!gl) fieldFail("WebGL 2 is not available in this browser");
  let photoReady = false, photoT0 = 0;
  const photoReveal = () => reduce ? 1 : Math.min((performance.now() - photoT0) / 1800, 1);
  function uploadPhoto() {
    const img = document.getElementById("pfpImg");
    const upload = () => {
      if (!glOK) return;
      const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      photoReady = true; photoT0 = performance.now() + 250;
    };
    if (img.complete && img.naturalWidth) upload(); else img.addEventListener("load", upload, { once: true });
  }
  if (glOK) uploadPhoto();
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const FIELD = {
    charcoal: { capsule: "#272220", ink: "#3D332B", wall: "#1E1A17", tone0: "#17130F", tone1: "#F1EADF" },
    paper: { capsule: "#ECE5D9", ink: "#DACDB9", wall: "#E2D9CB", tone0: "#241F1B", tone1: "#F7F2EA" }
  };
  // Field colours glide between themes instead of snapping.
  let fieldCol = null, fieldFrom = null, fieldTo = null, fieldT0 = 0;
  const FIELD_MS = 700;
  function targetField() { const f = FIELD[state.mode]; return { capsule: hex(f.capsule), ink: hex(f.ink), wall: hex(f.wall), tone0: hex(f.tone0), tone1: hex(f.tone1) }; }
  function currentField(now) {
    if (!fieldCol) fieldCol = targetField();
    if (fieldTo) {
      const k = Math.min((now - fieldT0) / FIELD_MS, 1), e = 1 - Math.pow(1 - k, 3);
      for (const n of ["capsule", "ink", "wall", "tone0", "tone1"]) fieldCol[n] = fieldFrom[n].map((v, i) => v + (fieldTo[n][i] - v) * e);
      if (k >= 1) fieldTo = null;
    }
    return fieldCol;
  }
  function glideField() { if (!fieldCol || reduce) { fieldCol = targetField(); return; } fieldFrom = JSON.parse(JSON.stringify(fieldCol)); fieldTo = targetField(); fieldT0 = performance.now(); }
  let lastW = 0;
  function resize(e) {
    if (e && touch && innerWidth === lastW) return;
    lastW = innerWidth;
    if (glOK) {
      const d = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(innerWidth * d); canvas.height = Math.round(innerHeight * d);
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    }
    sizeOrbit(); drawOrbit();
  }
  let drawCount = 0;
  function draw() {
    if (!glOK) return;
    try { drawField(); } catch (e) { fieldFail(String(e && e.message || e).slice(0, 300)); return; }
    // Sanity check once: the field never renders pure black, so pure black means the GPU produced nothing.
    if (++drawCount === 3) {
      const px = new Uint8Array(4);
      gl.readPixels(canvas.width >> 1, canvas.height >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      const err = gl.getError();
      if (err !== gl.NO_ERROR) fieldFail("graphics error " + err);
      else if (px[0] + px[1] + px[2] === 0) fieldFail("the graphics card returned an empty frame");
    }
  }
  function drawField() {
    const f = currentField(performance.now());
    gl.uniform2f(U.resolution, canvas.width, canvas.height);
    gl.uniform2f(U.cssSize, innerWidth, innerHeight);
    gl.uniform1f(U.time, elapsed);
    gl.uniform1f(U.intensity, 1.25);
    gl.uniform1i(U.mode, 1);
    gl.uniform1f(U.cell, innerWidth < 720 ? 7 : 7.5);
    gl.uniform3f(U.capsule, ...f.capsule); gl.uniform3f(U.ink, ...f.ink); gl.uniform3f(U.wall, ...f.wall);
    gl.uniform3fv(U.touch, touchBuf);
    gl.uniform3f(U.tone0, ...f.tone0); gl.uniform3f(U.tone1, ...f.tone1);
    const pr = portraitEl.getBoundingClientRect();
    gl.uniform4f(U.pRect, pr.left, pr.top, pr.width, pr.height);
    gl.uniform1i(U.photo, 0);
    gl.uniform1f(U.pReveal, photoReady && !touch ? photoReveal() : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  let prev = performance.now();
  // Each part runs on its own, so a failure in one (reported in the footer) never stops the others.
  function safely(fn, ...args) { try { fn(...args); } catch (e) { reportError(e); } }
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - prev) / 1000, 0.1); prev = now;
    if (!paused && !document.hidden) {
      const fps = 60;
      elapsed += dt * 0.85;
      safely(stepOrbit, dt);
      safely(stepPointer, dt, now);
      safely(stepParallax, dt);
      if (now - lastDraw >= 1000 / fps - 1) { lastDraw = now; draw(); safely(drawOrbit); }
    } else if (fieldTo) { draw(); safely(drawOrbit); }
  }

  /* ---------- Cursor: electrode for the ink field, light and lean for the UI ---------- */
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;
  const touchBuf = new Float32Array(24);
  const ptr = { tx: -9999, ty: -9999, x: -9999, y: -9999, vx: 0, vy: 0, presence: 0, inside: false, wake: [], lastSample: 0 };
  function stepPointer(dt, now) {
    if (!finePointer) return;
    // Spring-follow the real cursor so the ink lags a little behind it, with weight.
    const k = 120, d = 18;
    if (ptr.x < -9000) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
    // Small fixed substeps keep the spring stable even when frames arrive late.
    for (let left = dt; left > 0; left -= 1 / 240) {
      const h = Math.min(left, 1 / 240);
      ptr.vx += ((ptr.tx - ptr.x) * k - ptr.vx * d) * h; ptr.vy += ((ptr.ty - ptr.y) * k - ptr.vy * d) * h;
      ptr.x += ptr.vx * h; ptr.y += ptr.vy * h;
    }
    ptr.presence += ((ptr.inside ? 1 : 0) - ptr.presence) * Math.min(dt * 4, 1);
    const speed = Math.hypot(ptr.vx, ptr.vy);
    if (ptr.inside && now - ptr.lastSample > 70 && speed > 40) {
      ptr.wake.unshift({ x: ptr.x, y: ptr.y, t: now, s: Math.min(0.25 + speed / 1400, 0.85) });
      ptr.wake.length = Math.min(ptr.wake.length, 7); ptr.lastSample = now;
    }
    touchBuf.fill(0);
    touchBuf[0] = ptr.x; touchBuf[1] = ptr.y; touchBuf[2] = 0.8 * ptr.presence;
    ptr.wake.forEach((w, i) => {
      const age = (now - w.t) / 1000;
      touchBuf[3 + i * 3] = w.x; touchBuf[4 + i * 3] = w.y; touchBuf[5 + i * 3] = w.s * Math.exp(-age / 0.7);
    });
  }
  // Parallax: cursor offset from the viewport centre, eased with a soft follow; scroll lag for the portrait.
  const plx = { x: 0, y: 0, sy: 0, set: "" };
  function stepParallax(dt) {
    if (reduce) return;
    let tx = 0, ty = 0;
    if (finePointer && ptr.inside && ptr.tx > -9000) { tx = (ptr.tx / innerWidth - 0.5) * 2; ty = (ptr.ty / innerHeight - 0.5) * 2; }
    const f = Math.min(dt * 3, 1);
    plx.x += (tx - plx.x) * f; plx.y += (ty - plx.y) * f;
    plx.sy = touch ? 0 : Math.min(scrollY, innerHeight) * 0.12;
    const key = plx.x.toFixed(3) + plx.y.toFixed(3) + plx.sy.toFixed(1);
    if (key === plx.set) return; plx.set = key;
    root.style.setProperty("--plx", plx.x.toFixed(3)); root.style.setProperty("--ply", plx.y.toFixed(3)); root.style.setProperty("--sy", plx.sy.toFixed(1));
  }
  let tiltEl = null, magnetEl = null;
  function clearTilt() { if (!tiltEl) return; tiltEl.classList.remove("hovering", "tracking"); tiltEl.style.removeProperty("--rx"); tiltEl.style.removeProperty("--ry"); tiltEl = null; }
  function clearMagnet() { if (!magnetEl) return; magnetEl.classList.remove("tracking"); magnetEl.style.setProperty("--tx", "0px"); magnetEl.style.setProperty("--ty", "0px"); magnetEl = null; }
  if (finePointer) {
    document.querySelectorAll(".chip, .tab").forEach(el => el.classList.add("magnet"));
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      ptr.tx = e.clientX; ptr.ty = e.clientY; ptr.inside = true;
      // Cards and link buttons tilt toward the cursor and carry a light where it sits.
      const t = e.target.closest && e.target.closest(".hub > a, .hub > button, .card");
      if (t !== tiltEl) { clearTilt(); tiltEl = t; if (t) t.classList.add("hovering", "tracking"); }
      if (t) {
        const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        const amt = t.classList.contains("card") ? 3 : 7;
        t.style.setProperty("--ry", ((px - 0.5) * amt).toFixed(2) + "deg");
        t.style.setProperty("--rx", (-(py - 0.5) * amt).toFixed(2) + "deg");
        t.style.setProperty("--mx", (e.clientX - r.left) + "px"); t.style.setProperty("--my", (e.clientY - r.top) + "px");
      }
      // Small controls lean toward the cursor, then spring back.
      const m = e.target.closest && e.target.closest(".magnet");
      if (m !== magnetEl) { clearMagnet(); magnetEl = m; if (m) m.classList.add("tracking"); }
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        m.style.setProperty("--tx", (dx * 6).toFixed(1) + "px"); m.style.setProperty("--ty", (dy * 4).toFixed(1) + "px");
      }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { ptr.inside = false; clearTilt(); clearMagnet(); });
    addEventListener("blur", () => { ptr.inside = false; });
  }

  /* ---------- Theme toggle and pause ---------- */
  const toggle = document.getElementById("themeToggle"), themeLabel = document.getElementById("themeLabel"), pauseBtn = document.getElementById("pause");
  function sync() {
    const paper = state.mode === "paper";
    toggle.setAttribute("aria-pressed", String(paper));
    toggle.setAttribute("aria-label", paper ? L.toCharcoal : L.toPaper);
    themeLabel.textContent = paper ? L.charcoal : L.paper;
    pauseBtn.textContent = paused ? L.resume : L.pause;
  }
  function apply() { root.dataset.mode = state.mode; resize(); sync(); save(); }
  // Keep the field sharp when the window changes size (rotation, desktop resizing). Height-only changes
  // on touch screens are the address bar sliding, which is ignored so the field never flickers.
  { let q = 0; addEventListener("resize", e => { cancelAnimationFrame(q); q = requestAnimationFrame(() => { try { resize(e); } catch (err) { reportError(err); } }); }); }
  toggle.addEventListener("click", () => { state.mode = state.mode === "paper" ? "charcoal" : "paper"; glideField(); root.dataset.mode = state.mode; sync(); save(); drawOrbit(); });
  pauseBtn.addEventListener("click", () => { paused = !paused; sync(); });

  primeOrbit();
  apply();
  requestAnimationFrame(loop);
  bloomAll(document.querySelector(".page"), 150);
})();

  // Show the frosted band only once the page has scrolled under the bar.
  { const bar = document.querySelector(".bar"); const onScroll = () => bar.classList.toggle("stuck", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
