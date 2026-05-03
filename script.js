// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
});
function animateRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// PARTICLES
const pContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `left:${Math.random()*100}%;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*10}s;opacity:${Math.random()*0.5}`;
  pContainer.appendChild(p);
}

// QR PATTERN
const qrEl = document.getElementById('qrPattern');
if (qrEl) {
  const pattern = [1,1,1,0,1,1,1,1,0,0,0,0,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,1,1,1,1,1,0,1,1,0];
  pattern.forEach(v => {
    const c = document.createElement('div');
    c.className = 'qr-cell' + (v ? '' : ' w');
    qrEl.appendChild(c);
  });
}

// COUNTER ANIMATION
document.querySelectorAll('[data-target]').forEach(el => {
  const target = +el.dataset.target;
  const isLarge = target > 1000;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = isLarge
          ? (start >= 1000000 ? (start/1000000).toFixed(1)+'M' : Math.floor(start).toLocaleString())
          : Math.floor(start);
        if (start >= target) clearInterval(timer);
      }, 16);
      obs.disconnect();
    }
  });
  obs.observe(el);
});

// BLOOD TYPE BUTTONS
let selectedBlood = '';
document.querySelectorAll('.blood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedBlood = btn.dataset.val;
    document.getElementById('bloodType').value = selectedBlood;
  });
});

// FORM SUBMIT
document.getElementById('mediForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('fname').value;
  const dob = document.getElementById('dob').value;
  const blood = selectedBlood || '—';
  
  // Capturing the raw input, but applying a privacy mask to protect the phone number
  const emergencyRaw = document.getElementById('emergency').value || '—';
  const emergency = emergencyRaw !== '—' ? emergencyRaw.replace(/\d(?=\d{4})/g, "*") : '—';
  
  const allergies = document.getElementById('allergies').value || 'None reported';
  const conditions = document.getElementById('conditions').value || 'None reported';
  const meds = document.getElementById('medications').value || 'None';
  const doctor = document.getElementById('doctor').value || '—';

  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25*24*3600*1000)) : '—';
  const id = 'MC-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*9000+1000);
  const hasAllergyAlert = allergies !== 'None reported' && allergies !== 'None';

  document.getElementById('generatedCard').innerHTML = `
    <div class="gc-header">
      <div>
        <div class="gc-name">${name.toUpperCase()}</div>
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:2px;">${id} · AGE ${age}</div>
      </div>
      <div class="gc-blood">${blood}</div>
    </div>
    <div class="gc-grid">
      <div class="gc-field">
        <div class="gc-key">⚠ Allergies</div>
        <div class="gc-val ${hasAllergyAlert ? 'danger' : 'ok'}">${allergies}</div>
      </div>
      <div class="gc-field">
        <div class="gc-key">Conditions</div>
        <div class="gc-val">${conditions}</div>
      </div>
      <div class="gc-field">
        <div class="gc-key">Emergency Contact</div>
        <div class="gc-val">${emergency}</div>
      </div>
      <div class="gc-field">
        <div class="gc-key">Primary Doctor</div>
        <div class="gc-val">${doctor}</div>
      </div>
    </div>
    <div class="gc-field">
      <div class="gc-key">Current Medications</div>
      <div class="gc-val" style="font-size:13px;">${meds}</div>
    </div>
  `;

  document.getElementById('modal').classList.add('active');
});

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('active');
});

function copyCard() {
  const name = document.getElementById('fname').value;
  const blood = selectedBlood || '—';
  const allergies = document.getElementById('allergies').value || 'None';
  const meds = document.getElementById('medications').value || 'None';
  const text = `MEDICARD\n\nName: ${name}\nBlood Type: ${blood}\nAllergies: ${allergies}\nMedications: ${meds}`;
  navigator.clipboard.writeText(text).then(() => showToast('Card details copied to clipboard'));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = '// ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Auto flip card demo
let flipped = false;
setInterval(() => {
  const card = document.getElementById('demoCard');
  if (card) {
    flipped = !flipped;
    card.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }
}, 4000);