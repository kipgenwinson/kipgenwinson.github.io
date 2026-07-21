(function () {
  'use strict';

  var MAX_DIM = 1600;      // longest edge, px
  var QUALITY = 0.72;      // JPEG quality
  var images = [];         // { filename, dataUrl, sizeKB }

  var $ = function (id) { return document.getElementById(id); };

  // default date = today
  var dateEl = $('cDate');
  if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);

  var drop = $('drop');
  var fileInput = $('cFiles');
  var thumbs = $('thumbs');

  if (drop && fileInput) {
    drop.addEventListener('click', function () { fileInput.click(); });
    ['dragover', 'dragenter'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag'); });
    });
    drop.addEventListener('drop', function (e) { handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', function () { handleFiles(fileInput.files); });
  }

  function slugDate() {
    return (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().slice(0, 10);
  }

  function handleFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (file) {
      if (!file.type.match(/^image\//)) return;
      var reader = new FileReader();
      reader.onload = function (e) { compress(e.target.result); };
      reader.readAsDataURL(file);
    });
  }

  function compress(dataUrl) {
    var img = new Image();
    img.onload = function () {
      var w = img.width, h = img.height;
      if (w > h && w > MAX_DIM) { h = Math.round(h * MAX_DIM / w); w = MAX_DIM; }
      else if (h >= w && h > MAX_DIM) { w = Math.round(w * MAX_DIM / h); h = MAX_DIM; }

      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      var out = canvas.toDataURL('image/jpeg', QUALITY);
      var idx = images.length + 1;
      var filename = slugDate() + '-' + idx + '.jpg';
      var sizeKB = Math.round((out.length * 0.75) / 1024);

      images.push({ filename: filename, dataUrl: out, sizeKB: sizeKB });
      renderThumbs();
    };
    img.src = dataUrl;
  }

  function renderThumbs() {
    if (!thumbs) return;
    thumbs.innerHTML = '';
    images.forEach(function (im, i) {
      var wrap = document.createElement('div');
      wrap.className = 'thumb';
      wrap.innerHTML =
        '<img src="' + im.dataUrl + '" alt="">' +
        '<div class="sz">' + im.sizeKB + ' KB</div>' +
        '<a class="dl" download="' + im.filename + '" href="' + im.dataUrl + '">download</a>' +
        '<button class="rm" title="Remove" data-i="' + i + '">&times;</button>';
      thumbs.appendChild(wrap);
    });
    thumbs.querySelectorAll('.rm').forEach(function (btn) {
      btn.addEventListener('click', function () {
        images.splice(parseInt(btn.getAttribute('data-i'), 10), 1);
        // re-number filenames so they stay tidy
        images.forEach(function (im, k) { im.filename = slugDate() + '-' + (k + 1) + '.jpg'; });
        renderThumbs();
      });
    });
  }

  function youtubeId(url) {
    if (!url) return '';
    url = url.trim();
    var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|v=)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url; // already an ID
    return '';
  }

  function makeSlug(text) {
    var base = (text || 'update').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().split(/\s+/).slice(0, 5).join('-');
    return base || 'update';
  }

  var genBtn = $('cGen');
  if (genBtn) {
    genBtn.addEventListener('click', function () {
      var date = slugDate();
      var place = ($('cPlace').value || '').trim();
      var text = ($('cText').value || '').trim();
      var ytId = youtubeId($('cYT').value);
      var tags = ($('cTags').value || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);

      var fm = ['---'];
      fm.push('date: ' + date);
      if (place) fm.push('place: "' + place.replace(/"/g, '\\"') + '"');
      if (images.length) {
        fm.push('images:');
        images.forEach(function (im) { fm.push('  - /assets/updates/' + im.filename); });
      }
      if (ytId) fm.push('youtube_id: "' + ytId + '"');
      if (tags.length) {
        fm.push('tags:');
        tags.forEach(function (t) { fm.push('  - ' + t); });
      }
      fm.push('---');

      var content = fm.join('\n') + '\n' + (text ? text + '\n' : '');

      var filename = '_updates/' + date + '-' + makeSlug(text) + '.md';
      $('cFilename').textContent = filename;
      $('cOut').value = content;
      $('cOutBox').style.display = 'block';
      $('cOutBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  var copyBtn = $('cCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var ta = $('cOut');
      ta.select();
      try {
        navigator.clipboard.writeText(ta.value);
      } catch (e) { document.execCommand('copy'); }
      copyBtn.textContent = 'Copied ✓';
      setTimeout(function () { copyBtn.textContent = 'Copy file contents'; }, 1800);
    });
  }
})();
