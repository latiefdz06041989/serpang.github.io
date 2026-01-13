
export enum AttendanceStatus {
  HADIR = 'Hadir',
  TIDAK_HADIR = 'Tidak Hadir'
}

export enum Reason {
  SAKIT = 'Sakit',
  IZIN = 'Izin',
  DINAS = 'Tugas Dinas',
  TANPA_KETERANGAN = 'Tanpa Keterangan',
  NONE = '-'
}

export interface AttendanceEntry {
  id: string;
  tanggal: string;
  kelas: string;
  namaGuru: string;
  mataPelajaran: string;
  jamKe: number;
  alasanTidakHadir: Reason;
  memberiTugas: boolean;
  timestamp: number;
  catatan?: string;
  // Rekapitulasi Siswa dalam bentuk teks bebas
  rekapSiswa: string;
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}
