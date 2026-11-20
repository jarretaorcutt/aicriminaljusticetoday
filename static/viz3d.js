/* AI in Criminal Justice Today — interactive 3D story scenes (D-029). Needs three.js r128 (loaded before this file).
   <div class="scene3d" data-scene="faces|camera|corridor|document|scale|globe|map|wave|monitor|tree|network" data-nums="905117,79">
   Decorative illustration only: no data is invented here; data-nums only scales shapes from the story's own chart numbers. */
(function () {
  if (!window.THREE) return;
  var T = THREE, CY = 0x00e5ff, MG = 0xff2bd6, RD = 0xff2b4a;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function line(c, o) { return new T.LineBasicMaterial({ color: c, transparent: true, opacity: o == null ? 0.85 : o }); }
  function wire(geo, c, o) { return new T.LineSegments(new T.EdgesGeometry(geo), line(c, o)); }
  function basic(c, o) { return new T.MeshBasicMaterial({ color: c, transparent: true, opacity: o == null ? 0.25 : o }); }
  function rnd(i) { var x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); }

  var B = {
    faces: function (g) {
      var heads = [];
      for (var i = 0; i < 12; i++) {
        var h = new T.LineSegments(new T.WireframeGeometry(new T.SphereGeometry(0.45, 10, 8)), line(i === 5 ? RD : CY, 0.7));
        h.scale.y = 1.3; h.position.set((i % 4) * 1.3 - 1.95, 0.2, Math.floor(i / 4) * -1.4 + 1.2); g.add(h); heads.push(h);
        var box = wire(new T.BoxGeometry(1.05, 1.35, 0.05), i === 5 ? RD : MG, 0.6); box.position.copy(h.position); box.position.z += 0.5; g.add(box);
      }
      var scan = new T.Mesh(new T.PlaneGeometry(6, 0.04), basic(CY, 0.9)); scan.position.z = 1.8; g.add(scan);
      return function (t) { scan.position.y = Math.sin(t * 1.2) * 0.9 + 0.2; heads.forEach(function (h, i) { h.rotation.y = t * 0.3 + i; }); };
    },
    camera: function (g) {
      var pole = wire(new T.CylinderGeometry(0.06, 0.06, 3, 6), CY); pole.position.set(-2, 0, 0); g.add(pole);
      var cam = wire(new T.BoxGeometry(0.8, 0.4, 0.4), MG); cam.position.set(-1.6, 1.5, 0); g.add(cam);
      var beam = new T.Mesh(new T.ConeGeometry(1.2, 3.4, 24, 1, true), basic(CY, 0.12)); beam.rotation.z = Math.PI / 2.6; beam.position.set(-0.1, 0.7, 0); g.add(beam);
      for (var k = -3; k <= 3; k++) { var d = wire(new T.BoxGeometry(0.6, 0.01, 0.06), CY, 0.5); d.position.set(k, -1.5, 0); g.add(d); }
      var cars = [];
      for (var i = 0; i < 4; i++) { var c = wire(new T.BoxGeometry(0.9, 0.35, 0.5), i === 2 ? RD : CY, 0.8); c.position.set(i * 2 - 3, -1.3, i % 2 ? 0.6 : -0.6); g.add(c); cars.push(c); }
      return function (t) { beam.rotation.y = Math.sin(t) * 0.5; cars.forEach(function (c, i) { c.position.x = ((t * 0.8 + i * 2) % 8) - 4; }); };
    },
    corridor: function (g, nums) {
      for (var i = 0; i < 7; i++) for (var s = -1; s <= 1; s += 2) { var cell = wire(new T.BoxGeometry(1, 1.8, 1), CY, 0.55 - i * 0.05); cell.position.set(s * 1.4, 0, -i * 1.1 + 2); g.add(cell); }
      var bars = [], mx = Math.max.apply(null, nums.length ? nums : [1]);
      (nums.length ? nums : [3, 5, 2, 6, 4]).forEach(function (n, i, a) {
        var hgt = 0.2 + 1.6 * n / (nums.length ? mx : 6); var b = new T.Mesh(new T.BoxGeometry(0.22, hgt, 0.22), basic(i % 2 ? MG : CY, 0.7));
        b.position.set((i - (a.length - 1) / 2) * 0.35, -0.9 + hgt / 2, 1.5); g.add(b); bars.push(b);
      });
      var panel = wire(new T.PlaneGeometry(2.2, 1.6), MG, 0.7); panel.position.set(0, 0.5, 1.4); g.add(panel);
      return function (t) { bars.forEach(function (b, i) { b.material.opacity = 0.45 + 0.35 * Math.sin(t * 2 + i); }); };
    },
    document: function (g) {
      var pages = [];
      for (var i = 0; i < 6; i++) {
        var p = new T.Group(), red = i === 3;
        p.add(wire(new T.PlaneGeometry(1.6, 2.1), red ? RD : CY, 0.8));
        for (var l = 0; l < 7; l++) { var ln = new T.Mesh(new T.PlaneGeometry(1.1 - (l % 3) * 0.2, 0.05), basic(red && l % 2 ? RD : (l % 3 ? CY : MG), 0.7)); ln.position.set(-0.1, 0.75 - l * 0.24, 0.01); p.add(ln); }
        p.position.set((i % 3) * 1.9 - 1.9, i < 3 ? 1.1 : -1.2, -i * 0.3); p.rotation.y = (i % 3 - 1) * 0.35; g.add(p); pages.push(p);
      }
      return function (t) { pages.forEach(function (p, i) { p.position.z = Math.sin(t + i) * 0.3 - i * 0.3; if (i === 3) p.children[0].material.opacity = 0.4 + 0.5 * (Math.sin(t * 6) > 0); }); };
    },
    scale: function (g) {
      g.add(wire(new T.CylinderGeometry(0.08, 0.5, 2.6, 8), CY));
      var beam = new T.Group(); beam.position.y = 1.3; g.add(beam);
      beam.add(wire(new T.BoxGeometry(4, 0.08, 0.08), MG));
      var pans = [-1.9, 1.9].map(function (x) { var p = wire(new T.CylinderGeometry(0.7, 0.4, 0.2, 16), CY); p.position.set(x, -0.9, 0); beam.add(p); return p; });
      return function (t) { var a = Math.sin(t * 0.8) * 0.18; beam.rotation.z = a; pans.forEach(function (p) { p.rotation.z = -a; }); };
    },
    globe: function (g) {
      var s = new T.LineSegments(new T.WireframeGeometry(new T.SphereGeometry(1.7, 18, 12)), line(CY, 0.35)); g.add(s);
      var pts = [], geo = new T.SphereGeometry(0.06, 6, 6);
      for (var i = 0; i < 40; i++) { var u = rnd(i) * 2 - 1, th = rnd(i + 99) * 6.283, r = Math.sqrt(1 - u * u); var m = new T.Mesh(geo, basic(i % 5 ? CY : MG, 0.9)); m.position.set(r * Math.cos(th) * 1.72, u * 1.72, r * Math.sin(th) * 1.72); s.add(m); pts.push(m); }
      for (var j = 0; j < 14; j++) { var a = pts[j].position, b = pts[j + 20].position, mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(2.4);
        var cv = new T.QuadraticBezierCurve3(a, mid, b); s.add(new T.Line(new T.BufferGeometry().setFromPoints(cv.getPoints(24)), line(MG, 0.6))); }
      return function (t) { s.rotation.y = t * 0.25; };
    },
    map: function (g, nums) {
      var grid = new T.GridHelper(6, 12, CY, CY); grid.material.transparent = true; grid.material.opacity = 0.3; grid.position.y = -1; g.add(grid);
      var cols = [];
      for (var i = 0; i < 36; i++) { var h = 0.2 + 2 * rnd(i + 7); var c = new T.Mesh(new T.BoxGeometry(0.3, h, 0.3), basic(rnd(i) > 0.7 ? RD : (i % 2 ? CY : MG), 0.55)); c.position.set((i % 6) - 2.5, -1 + h / 2, Math.floor(i / 6) - 2.5); g.add(c); cols.push(c); }
      return function (t) { cols.forEach(function (c, i) { c.material.opacity = Math.max(0.05, 0.55 * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 1.7)) * (1 - ((t * 0.05) % 1) * (i % 3 === 0))); }); };
    },
    wave: function (g) {
      var N = 120, pos = new Float32Array(N * 3), geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      var w = new T.Line(geo, line(CY, 0.95)); g.add(w);
      var w2 = new T.Line(geo.clone(), line(MG, 0.6)); w2.position.z = -0.4; g.add(w2);
      var rings = []; for (var r = 1; r <= 3; r++) { var ring = new T.LineSegments(new T.EdgesGeometry(new T.RingGeometry(r * 0.7, r * 0.7 + 0.02, 48)), line(CY, 0.25)); ring.position.z = -1; g.add(ring); rings.push(ring); }
      return function (t) {
        [w, w2].forEach(function (L, k) { var p = L.geometry.attributes.position; for (var i = 0; i < N; i++) { var x = i / N * 6 - 3; p.setXYZ(i, x, Math.sin(x * 3 + t * 3 + k) * 0.5 * Math.exp(-x * x / 3) + (k ? 0 : Math.sin(x * 11 + t * 5) * 0.12), 0); } p.needsUpdate = true; });
        rings.forEach(function (r, i) { var s = 1 + ((t * 0.3 + i / 3) % 1); r.scale.set(s, s, s); r.material.opacity = 0.35 * (2 - s); });
      };
    },
    monitor: function (g) {
      var band = new T.LineSegments(new T.WireframeGeometry(new T.TorusGeometry(1, 0.22, 8, 32)), line(CY, 0.6)); band.rotation.x = Math.PI / 2; g.add(band);
      var dev = wire(new T.BoxGeometry(0.9, 0.6, 0.5), MG); dev.position.set(0, 0, 1.1); g.add(dev);
      var led = new T.Mesh(new T.SphereGeometry(0.08, 8, 8), basic(RD, 1)); led.position.set(0.25, 0.12, 1.37); g.add(led);
      var rings = []; for (var i = 0; i < 3; i++) { var r = new T.LineSegments(new T.EdgesGeometry(new T.RingGeometry(0.5, 0.52, 40)), line(RD, 0.6)); r.position.set(0, 0, 1.4); g.add(r); rings.push(r); }
      return function (t) { led.material.opacity = Math.sin(t * 6) > 0 ? 1 : 0.2; rings.forEach(function (r, i) { var s = 1 + ((t * 0.5 + i / 3) % 1) * 3; r.scale.set(s, s, s); r.material.opacity = 0.6 * (1 - (s - 1) / 3); }); };
    },
    tree: function (g) {
      var nodes = [], geo = new T.SphereGeometry(0.12, 10, 10);
      function node(x, y, c) { var m = new T.Mesh(geo, basic(c, 0.9)); m.position.set(x, y, 0); g.add(m); nodes.push(m); return m.position; }
      function link(a, b) { g.add(new T.Line(new T.BufferGeometry().setFromPoints([a, b]), line(CY, 0.5))); }
      var root = node(0, 1.8, MG), lv = [-1.8, 0, 1.8].map(function (x) { var p = node(x, 0.4, CY); link(root, p); return p; });
      lv.forEach(function (p, i) { [-0.5, 0.5].forEach(function (dx, j) { var q = node(p.x + dx, -1, (i + j) % 2 ? CY : MG); link(p, q); var r2 = node(p.x + dx, -2, CY); link(q, r2); }); });
      return function (t) { nodes.forEach(function (n, i) { var s = 1 + 0.4 * Math.max(0, Math.sin(t * 2 - i * 0.5)); n.scale.set(s, s, s); }); };
    },
    network: function (g) {
      var pts = [], geo = new T.SphereGeometry(0.09, 8, 8);
      for (var i = 0; i < 26; i++) { var m = new T.Mesh(geo, basic(i % 4 ? CY : MG, 0.9)); m.position.set(rnd(i) * 5 - 2.5, rnd(i + 50) * 3.4 - 1.7, rnd(i + 90) * 2 - 1); g.add(m); pts.push(m.position); }
      var pulses = [];
      for (var j = 0; j < 26; j++) { var a = pts[j], b = pts[(j * 7 + 3) % 26]; g.add(new T.Line(new T.BufferGeometry().setFromPoints([a, b]), line(CY, 0.3)));
        if (j % 3 === 0) { var p = new T.Mesh(geo, basic(MG, 1)); g.add(p); pulses.push([p, a, b]); } }
      return function (t) { pulses.forEach(function (q, i) { var f = (t * 0.4 + i * 0.13) % 1; q[0].position.lerpVectors(q[1], q[2], f); }); };
    }
  };

  function mount(el) {
    var kind = el.getAttribute('data-scene'); if (!B[kind]) return;
    var nums = (el.getAttribute('data-nums') || '').split(',').map(Number).filter(function (n) { return n > 0; });
    var W = el.clientWidth || 600, H = el.clientHeight || 340;
    var r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(W, H); el.appendChild(r.domElement);
    var sc = new T.Scene(); sc.fog = new T.FogExp2(0x050b16, 0.06);
    var cam = new T.PerspectiveCamera(45, W / H, 0.1, 100); cam.position.set(0, 0.6, 7.5);
    var g = new T.Group(); sc.add(g); var tick = B[kind](g, nums);
    var drag = null, ry = 0, rx = 0, vis = true, t0 = performance.now();
    el.addEventListener('pointerdown', function (ev) { drag = [ev.clientX, ev.clientY, ry, rx]; el.setPointerCapture(ev.pointerId); });
    el.addEventListener('pointermove', function (ev) { if (!drag) return; ry = drag[2] + (ev.clientX - drag[0]) * 0.01; rx = Math.max(-0.8, Math.min(0.8, drag[3] + (ev.clientY - drag[1]) * 0.01)); if (still) draw(); });
    el.addEventListener('pointerup', function () { drag = null; });
    window.addEventListener('resize', function () { W = el.clientWidth; H = el.clientHeight; r.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix(); if (still) draw(); });
    function draw() { var t = (performance.now() - t0) / 1000; if (!still) tick(t); else tick(1.5); g.rotation.y = ry + (drag || still ? 0 : t * 0.12); g.rotation.x = rx; r.render(sc, cam); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(el);
    if (still) { draw(); return; }
    (function loop() { if (vis) draw(); requestAnimationFrame(loop); })();
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('.scene3d'), mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
