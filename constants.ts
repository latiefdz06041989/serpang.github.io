
import { Teacher } from './types';

export const TEACHERS: Teacher[] = [
  { id: '1', name: 'Dapen Saepudin, S.Pd.', subjects: ['PJOK'] },
  { id: '2', name: 'Suryadi Sunaryadi, S.Pd.', subjects: ['Biologi'] },
  { id: '3', name: 'Agus Wawan G, S.Pd., M.M.Pd.', subjects: ['Bahasa Indonesia'] },
  { id: '4', name: 'Lily Budiman, S.Pd., M.M.Pd.', subjects: ['Seni dan Budaya'] },
  { id: '5', name: 'H. Asep Sahudin, S.Pd., M.M.', subjects: ['Pendidikan Pancasila'] },
  { id: '6', name: 'Enjang Sutarmo, S.Pd.', subjects: ['Bimbingan Konseling (BK)'] },
  { id: '7', name: 'Sukendar, S.Pd.', subjects: ['Biologi'] },
  { id: '8', name: 'Lea Juhriani, S.Pd.', subjects: ['Kimia'] },
  { id: '9', name: 'Didin Ruswandi, S.Pd.', subjects: ['Matematika', 'Matematika Tingkat Lanjut'] },
  { id: '10', name: 'Endang Kusnadi, S.Pd., M.M.Pd.', subjects: ['Bahasa Indonesia'] },
  { id: '11', name: 'Udin Saepudin, S.Pd.I', subjects: ['Seni dan Budaya'] },
  { id: '12', name: 'Wawan Hendrawan, S.Pd.', subjects: ['Ekonomi'] },
  { id: '13', name: 'Yulia Mintarsih, S.Pd.', subjects: ['Bimbingan Konseling (BK)'] },
  { id: '14', name: 'Asep Sopian, S.Pd.', subjects: ['Ekonomi'] },
  { id: '15', name: 'Ain Zaelan, S.Pd.', subjects: ['Fisika'] },
  { id: '16', name: 'Kicky Filino H., S.Si.', subjects: ['Kimia'] },
  { id: '17', name: 'Aam Ali Salam, S.Pd.', subjects: ['Kimia', 'PKWU', 'PJOK'] },
  { id: '18', name: 'Sri Wulan, S.Pd.', subjects: ['Biologi (IPA)'] },
  { id: '19', name: 'Syarif Hidayatulloh, S.Pd.', subjects: ['Matematika Tingkat Lanjut', 'Sosiologi'] },
  { id: '20', name: 'Evi Rosvalinasari, S.Pd.', subjects: ['Sejarah', 'Sejarah Tingkat Lanjut'] },
  { id: '21', name: 'Dusep Tarman Setiawan, M.Pd.', subjects: ['Matematika', 'Geografi'] },
  { id: '22', name: 'Asep Muhtar, S.Pd.', subjects: ['PKWU', 'Ekonomi'] },
  { id: '23', name: 'Desi Darus Minuriyah, S.Pd.', subjects: ['Matematika Tingkat Lanjut', 'Fisika (IPA)'] },
  { id: '24', name: 'Syukron Habibi Mukhtar, S.Pd.', subjects: ['Sejarah', 'Sejarah Tingkat Lanjut'] },
  { id: '25', name: 'Andri Noberta, S.Pd.', subjects: ['Bimbingan Konseling (BK)'] },
  { id: '26', name: 'Nova Dwi Yati, S.Sos', subjects: ['Sosiologi'] },
  { id: '27', name: 'Nenden Nurhasanah, S.Pd.', subjects: ['Matematika (Umum)', 'Geografi'] },
  { id: '28', name: 'Cucu Hendrayani, S.Pd.', subjects: ['Bahasa Inggris'] },
  { id: '29', name: 'Didin Wahyudin, S.Pd.', subjects: ['Pendidikan Pancasila', 'Geografi'] },
  { id: '30', name: 'Nunung Kurnia Nugraha, S.Pd.', subjects: ['PAI dan Budi Pekerti', 'PJOK'] },
  { id: '31', name: 'Nenah Suhaenah, S.Pd.', subjects: ['Bahasa Inggris'] },
  { id: '32', name: 'Mukhlisin, S.Ud.', subjects: ['PAI dan Budi Pekerti', 'Geografi (IPS)'] },
  { id: '33', name: 'Susi Sadiyah, S.Pd.', subjects: ['Ekonomi (IPS)', 'PKWU', 'Sosiologi'] },
  { id: '34', name: 'Abdul Latif Djauharuddin, S.Si', subjects: ['Informatika'] },
  { id: '35', name: 'Mia Kusmiati, S.Pd.I.', subjects: ['PAI dan Budi Pekerti', 'Bahasa Sunda'] },
  { id: '36', name: 'Rita Nurhaeni, S.Pd.I', subjects: ['PAI dan Budi Pekerti', 'PKWU'] },
  { id: '37', name: 'Hanifah Khalidiyah, S.Pd.', subjects: ['Bahasa Inggris'] },
  { id: '38', name: 'Fhuzy Pangestu Fratama, S.Pd.', subjects: ['Matematika', 'Fisika (IPA)'] },
  { id: '39', name: 'Rika Yustika, S.Pd.', subjects: ['Bahasa Sunda'] },
  { id: '40', name: 'Diani Ratu Rahayu, S.I.Pust', subjects: ['Bahasa Indonesia'] }
];

export const SUBJECTS = [
  'PAI dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Matematika (Umum)',
  'Matematika Tingkat Lanjut',
  'Sejarah',
  'Sejarah Tingkat Lanjut',
  'Bahasa Inggris',
  'Seni dan Budaya',
  'PJOK',
  'PKWU',
  'Fisika',
  'Fisika (IPA)',
  'Kimia',
  'Biologi',
  'Biologi (IPA)',
  'Ekonomi',
  'Ekonomi (IPS)',
  'Sosiologi',
  'Geografi',
  'Geografi (IPS)',
  'Informatika',
  'Bimbingan Konseling (BK)',
  'Bahasa Sunda'
];

export const CLASSES = [
  'KELAS X-1', 'KELAS X-2', 'KELAS X-3', 'KELAS X-4', 'KELAS X-5', 'KELAS X-6', 'KELAS X-7', 'KELAS X-8', 'KELAS X-9',
  'KELAS XI-1', 'KELAS XI-2', 'KELAS XI-3', 'KELAS XI-4', 'KELAS XI-5', 'KELAS XI-6', 'KELAS XI-7', 'KELAS XI-8', 'KELAS XI-9',
  'KELAS XII-1', 'KELAS XII-2', 'KELAS XII-3', 'KELAS XII-4', 'KELAS XII-5', 'KELAS XII-6', 'KELAS XII-7', 'KELAS XII-8'
];

export const STORAGE_KEY = 'epresensi_data_v1';
