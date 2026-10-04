const layanan = [
  { nama: "Web", isi: "Website company profile, toko online, dan dashboard internal yang cepat dan mudah dikelola." },
  { nama: "Mobile", isi: "Aplikasi Android dan iOS dengan satu basis kode, lengkap dengan notifikasi dan mode offline." },
  { nama: "Data", isi: "Laporan otomatis dan visualisasi data supaya keputusan bisnis tidak lagi berdasarkan tebakan." }
];
const sejarah = [
  { tahun: 2015, judul: "Berdiri di Bandung", isi: "Tiga orang pendiri memulai dari garasi dengan proyek website pertama untuk toko kain lokal." },
  { tahun: 2019, judul: "Klien ke-50", isi: "Kami membuka kantor pertama dan mulai mengerjakan aplikasi mobile." },
  { tahun: 2023, judul: "Tim 20 orang", isi: "Divisi data dibentuk untuk membantu klien membaca angka penjualan mereka." },
  { tahun: 2026, judul: "Ekspansi nasional", isi: "Kini melayani klien dari Sumatra sampai Papua secara remote." }
];
const tim = [
  { nama: "Dhimas", peran: "CEO" }, { nama: "Bagus", peran: "CTO" },
  { nama: "Suyono", peran: "Desainer utama" }, { nama: "Eca", peran: "Kepala data" }
];

const root = document.documentElement, themeBtn = document.getElementById("themeBtn");
themeBtn.onclick = () => {
  const gelap = root.dataset.theme === "dark";
  root.dataset.theme = gelap ? "light" : "dark";
  themeBtn.textContent = gelap ? "Mode gelap" : "Mode terang";
};

const kata = ["UMKM.", "Enterprise.", "Startup.", "Indonesia."];
const typed = document.getElementById("typed");
let k = 0, h = 0, hapus = false;
function ketik() {
  const t = kata[k];
  typed.textContent = t.slice(0, h);
  h += hapus ? -1 : 1;
  let jeda = hapus ? 50 : 100;
  if (!hapus && h > t.length) { hapus = true; jeda = 1200; }
  else if (hapus && h < 0) { hapus = false; k = (k + 1) % kata.length; h = 0; jeda = 300; }
  setTimeout(ketik, jeda);
}
ketik();

const c = document.getElementById("canvas"), ctx = c.getContext("2d");
let W, H, titik = [], mouse = { x: -999, y: -999 };
function ukur() {
  W = c.width = c.offsetWidth; H = c.height = c.offsetHeight;
  titik = Array.from({ length: Math.min(90, W / 12) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
}
ukur(); addEventListener("resize", ukur);
c.parentElement.addEventListener("mousemove", e => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
function gambar() {
  ctx.clearRect(0, 0, W, H);
  for (const p of titik) {
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 100) { p.x += dx / d * 2; p.y += dy / d * 2; }   // menjauh dari kursor
    p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
    ctx.fillStyle = "#ffb347"; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill();
  }
  for (let i = 0; i < titik.length; i++) for (let j = i + 1; j < titik.length; j++) {
    const d = Math.hypot(titik[i].x - titik[j].x, titik[i].y - titik[j].y);
    if (d < 90) { ctx.strokeStyle = `rgba(20,168,154,${1 - d / 90})`; ctx.beginPath(); ctx.moveTo(titik[i].x, titik[i].y); ctx.lineTo(titik[j].x, titik[j].y); ctx.stroke(); }
  }
  requestAnimationFrame(gambar);
}
gambar();

const tabs = document.getElementById("tabs"), panel = document.getElementById("panel");
function pilih(i) {
  [...tabs.children].forEach((b, n) => b.setAttribute("aria-selected", n === i));
  panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap"); // ulang animasi
  panel.innerHTML = `<h3>${layanan[i].nama}</h3><p>${layanan[i].isi}</p>`;
}
layanan.forEach((l, i) => { const b = document.createElement("button"); b.textContent = l.nama; b.role = "tab"; b.onclick = () => pilih(i); tabs.append(b); });
pilih(0);

const tl = document.getElementById("timeline");
sejarah.forEach(s => {
  const e = document.createElement("div"); e.className = "event";
  e.innerHTML = `<button aria-expanded="false">${s.tahun} - ${s.judul}</button><div class="more">${s.isi}</div>`;
  const btn = e.querySelector("button");
  btn.onclick = () => { const buka = e.classList.toggle("open"); btn.setAttribute("aria-expanded", buka); };
  tl.append(e);
});

document.getElementById("team").innerHTML = tim.map(t =>
  `<div class="person"><div class="avatar">${t.nama.split(" ").map(x => x[0]).join("")}</div><b class="sans">${t.nama}</b><div style="color:var(--muted)">${t.peran}</div></div>`).join("");

function hitung(el) {
  const target = +el.dataset.target, mulai = performance.now();
  (function step(now) {
    const p = Math.min((now - mulai) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(mulai);
}
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("show");
  en.target.querySelectorAll("[data-target]").forEach(hitung);
  io.unobserve(en.target);
}), { threshold: .2 });
document.querySelectorAll(".reveal").forEach(s => io.observe(s));

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const nama = e.target.nama.value.trim(), email = e.target.email.value.trim(), pesan = e.target.pesan.value.trim();
  const msg = document.getElementById("msg");
  if (!nama) return tampil("Isi nama Anda.", true);
  if (!/^\S+@\S+\.\S+$/.test(email)) return tampil("Format email belum benar, contoh: nama@email.com.", true);
  if (pesan.length < 10) return tampil("Pesan minimal 10 karakter.", true);
  tampil(`Terima kasih, ${nama}. Pesan terkirim.`, false); e.target.reset();
  function tampil(t, salah) { msg.textContent = t; msg.className = "msg " + (salah ? "err" : "ok"); }
});
