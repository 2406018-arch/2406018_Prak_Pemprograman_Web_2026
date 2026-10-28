// File: dasar_logika.js
// Praktik Dasar Sintaks, Tipe data, dan Arrow Function

const namaProgrammer = "Hilma Putri Andriyani Lestari"
const tahunMulai = 2025;
const tahunSekarang = new Date().getFullYear();

// Arrow function meghitung masa pengalaman
const hitungMasaPengalaman = (Tahunmulai, Tahunsekarang) => Tahunsekarang - Tahunmulai;
const masaKerja = hitungMasaPengalaman (tahunMulai, tahunSekarang);

// evaluasi kondisi dengan ternary operator
const statusSenioritas = masaKerja >= 2 ? "mid-level Developer" : "junior Developer";

console.log("=== INFORMASI PENGEMBANG ===");
console.log(`Nama Programmer: ${namaProgrammer}`);
console.log(`pengalaman: ${masaKerja} tahun`);
console.log(`Status Senioritas: ${statusSenioritas}`);

// menguji equality vs loose equality
console.log("=== UJI PERBANDINGAN TIPE DATA ===");
console.log("10 == '10' :", 10 == '10'); // true
console.log("10 === '10' :", 10 === '10'); // false
console.log("Tipe 10  :", typeof 10);
console.log("Tipe '10' :", typeof '10');