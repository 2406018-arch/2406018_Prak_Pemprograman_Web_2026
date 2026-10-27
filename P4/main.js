// File: main.js
// Form Handling, Live Search, dan Aksi Interaktif (Toggle & Hapus)

// ===== STATE =====
let projects = [
  { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
  { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
  { id: 3, title: "Landing Page Profil Perusahaan", category: "Web App", budget: 1500000, completed: false },
  { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 4500000, completed: false }
];

let selectedCategory = "Semua"; // state filter kategori
let searchKeyword = "";         // state pencarian

// ===== HELPER =====
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
};

// Mencegah judul berisi tag HTML merusak tampilan (XSS)
const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

// ===== STATISTIK =====
// Statistik selalu dihitung dari SEMUA proyek (bukan hasil filter)
const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = dataList.filter(item => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// ===== RENDER DAFTAR PROYEK =====
const renderProjects = (filteredList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang cocok.</p>";
    return;
  }

  container.innerHTML = filteredList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${escapeHTML(proj.category)}</span>
          <h4>${escapeHTML(proj.title)}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div class="project-side">
          <span class="badge ${badgeClass}">${statusText}</span>
          <div class="card-actions">
            <button class="btn-action btn-toggle" data-action="toggle" data-id="${proj.id}">Ubah Status</button>
            <button class="btn-action btn-delete" data-action="delete" data-id="${proj.id}">Hapus Proyek</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
};

// ===== FILTER TERPADU (kategori + pencarian) =====
const getVisibleProjects = () => {
  const keyword = searchKeyword.trim().toLowerCase();

  return projects
    .filter(p => selectedCategory === "Semua" || p.category === selectedCategory)
    .filter(p => p.title.toLowerCase().includes(keyword));
};

// Satu fungsi untuk memperbarui seluruh tampilan
const refreshView = () => {
  renderProjects(getVisibleProjects());
  updateStats(projects);
};

// ===== VALIDASI FORM =====
const setError = (inputEl, errorEl, message) => {
  errorEl.textContent = message;
  inputEl.classList.toggle("invalid", message !== "");
};

// ===== INISIALISASI =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("project-form");
  const inputTitle = document.getElementById("input-title");
  const inputCategory = document.getElementById("input-category");
  const inputBudget = document.getElementById("input-budget");
  const inputCompleted = document.getElementById("input-completed");
  const errorTitle = document.getElementById("error-title");
  const errorBudget = document.getElementById("error-budget");

  const searchInput = document.getElementById("search-input");
  const filterButtons = document.querySelectorAll(".btn-filter");
  const projectList = document.getElementById("project-list");

  refreshView();

  // ---- Fitur 1: Submit form ----
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // cegah reload halaman

    const title = inputTitle.value.trim();
    const budget = Number(inputBudget.value);
    let isValid = true;

    // Validasi judul: tidak boleh kosong
    if (title === "") {
      setError(inputTitle, errorTitle, "Judul proyek tidak boleh kosong.");
      isValid = false;
    } else {
      setError(inputTitle, errorTitle, "");
    }

    // Validasi anggaran: harus > 0 (input kosong menjadi 0, sehingga ikut gagal)
    if (!(budget > 0)) {
      setError(inputBudget, errorBudget, "Anggaran harus lebih besar dari 0.");
      isValid = false;
    } else {
      setError(inputBudget, errorBudget, "");
    }

    if (!isValid) return;

    // Buat objek proyek baru dengan id unik
    const newProject = {
      id: Date.now(),
      title: title,
      category: inputCategory.value,
      budget: budget,
      completed: inputCompleted.checked
    };

    // Tambahkan ke array dengan spread operator (tanpa mutasi array lama)
    projects = [...projects, newProject];

    form.reset();
    refreshView();
  });

  // ---- Fitur 2: Pencarian real-time ----
  searchInput.addEventListener("input", (e) => {
    searchKeyword = e.target.value;
    refreshView();
  });

  // ---- Filter kategori ----
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      selectedCategory = e.target.getAttribute("data-category");
      refreshView();
    });
  });

  // ---- Fitur 3: Aksi kartu (event delegation) ----
  // Satu listener di kontainer menangani semua tombol, termasuk kartu yang baru dirender.
  projectList.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "toggle") {
      // Balik status completed untuk proyek dengan id terkait
      projects = projects.map(p =>
        p.id === id ? { ...p, completed: !p.completed } : p
      );
    } else if (action === "delete") {
      // Hapus item berdasarkan id
      projects = projects.filter(p => p.id !== id);
    }

    refreshView();
  });
});