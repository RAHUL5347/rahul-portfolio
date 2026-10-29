(function () {
  // Copy buttons
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
      try { navigator.clipboard.writeText(t).then(done, function () { b.textContent = 'Select text'; }); }
      catch (e) { b.textContent = 'Select text'; }
    });
  });

  // Simulated sensor trace
  var cv = document.getElementById('trace');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var N = 120, data = [], t = 0;
  var r1 = document.getElementById('r1'), r2 = document.getElementById('r2'), r3 = document.getElementById('r3');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sample(x) { return 72 + 6 * Math.sin(x / 9) + 2.2 * Math.sin(x / 3.1) + 1.2 * Math.sin(x * 1.7); }
  for (var i = 0; i < N; i++) data.push(sample(i));
  function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function draw() {
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var grid = css('--trace-grid'), line = css('--trace-line'), txt = css('--trace-text');
    ctx.lineWidth = 1; ctx.strokeStyle = grid; ctx.fillStyle = txt; ctx.font = '10px "IBM Plex Mono", monospace';
    var lo = 60, hi = 84, padL = 30, padB = 14;
    for (var v = 60; v <= 84; v += 8) {
      var y = (h - padB) - (v - lo) / (hi - lo) * (h - padB - 6);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w, y); ctx.stroke();
      ctx.fillText(v, 2, y + 3);
    }
    ctx.beginPath();
    data.forEach(function (d, k) {
      var x = padL + k / (N - 1) * (w - padL - 4);
      var y = (h - padB) - (d - lo) / (hi - lo) * (h - padB - 6);
      if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.strokeStyle = line; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
    var last = data[N - 1];
    var ex = w - 4, ey = (h - padB) - (last - lo) / (hi - lo) * (h - padB - 6);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, 6.3); ctx.fill();
    r1.textContent = last.toFixed(1) + ' °C';
    r2.textContent = (4.2 + (last - 72) * 0.05).toFixed(2) + ' bar';
    r3.textContent = (118 + (last - 72) * 2.4).toFixed(0) + ' L/m';
  }
  draw();
  if (!reduce) {
    setInterval(function () { t++; data.shift(); data.push(sample(N + t) + (Math.random() - 0.5) * 0.8); draw(); }, 600);
  }
  window.addEventListener('resize', draw);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
})();
