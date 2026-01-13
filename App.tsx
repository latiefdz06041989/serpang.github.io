
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  History, 
  Trash2, 
  PlusCircle,
  FileSpreadsheet,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  Search,
  Lock,
  LogOut,
  Users,
  FileText
} from 'lucide-react';
import { AttendanceEntry, Reason } from './types';
import { STORAGE_KEY, TEACHERS, SUBJECTS, CLASSES } from './constants';
import { analyzeAttendance } from './services/geminiService';

const ADMIN_PASSWORD = 'admin123';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'stats'>('form');
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kelas: '',
    namaGuru: '',
    mataPelajaran: '',
    jamKe: 1,
    alasan: Reason.NONE,
    memberiTugas: false,
    catatan: '',
    rekapSiswa: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const suggestedSubjects = useMemo(() => {
    const teacher = TEACHERS.find(t => t.name === formData.namaGuru);
    return (teacher && teacher.subjects.length > 0) ? teacher.subjects : SUBJECTS;
  }, [formData.namaGuru]);

  const handleTeacherChange = (val: string) => {
    const teacher = TEACHERS.find(t => t.name === val);
    setFormData(prev => ({
      ...prev, 
      namaGuru: val,
      mataPelajaran: (teacher && teacher.subjects.length === 1) ? teacher.subjects[0] : (teacher ? '' : prev.mataPelajaran)
    }));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError(false);
      showNotification('Login Admin Berhasil', 'success');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('form');
    showNotification('Berhasil Logout', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kelas) return showNotification('Mohon pilih Kelas', 'error');
    if (!formData.namaGuru.trim() || !formData.mataPelajaran.trim()) return showNotification('Mohon lengkapi Nama Guru dan Mata Pelajaran', 'error');
    if (!formData.rekapSiswa.trim()) return showNotification('Mohon isi Rekapitulasi Kehadiran Siswa', 'error');

    const newEntry: AttendanceEntry = {
      id: crypto.randomUUID(),
      tanggal: formData.tanggal,
      kelas: formData.kelas,
      namaGuru: formData.namaGuru.trim(),
      mataPelajaran: formData.mataPelajaran.trim(),
      jamKe: formData.jamKe,
      alasanTidakHadir: formData.alasan,
      memberiTugas: formData.memberiTugas,
      timestamp: Date.now(),
      catatan: formData.catatan.trim(),
      rekapSiswa: formData.rekapSiswa.trim()
    };

    setEntries(prev => [newEntry, ...prev]);
    showNotification('Presensi berhasil disimpan!', 'success');
    
    setFormData(prev => ({
      ...prev,
      kelas: '',
      namaGuru: '',
      mataPelajaran: '',
      jamKe: (prev.jamKe % 10) + 1,
      alasan: Reason.NONE,
      memberiTugas: false,
      catatan: '',
      rekapSiswa: ''
    }));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Hapus data ini?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      showNotification('Data dihapus', 'success');
    }
  };

  const exportToCSV = () => {
    if (entries.length === 0) return;
    const headers = [
      'Tanggal', 'Kelas', 'Jam Ke', 'Guru', 'Mapel', 'Status Guru', 'Tugas', 
      'Rekap Kehadiran Siswa', 'Catatan/Detail Tugas'
    ];
    const rows = entries.map(e => [
      e.tanggal, e.kelas, `Jam ${e.jamKe}`, e.namaGuru, e.mataPelajaran, 
      e.alasanTidakHadir === Reason.NONE ? 'Hadir' : e.alasanTidakHadir,
      e.memberiTugas ? 'Ya' : 'Tidak',
      e.rekapSiswa,
      e.catatan || '-'
    ]);

    const escapeCSV = (val: any) => {
      const stringVal = String(val);
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.map(escapeCSV).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_SMAN1_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SchoolLogo = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center bg-white rounded-lg p-1 shadow-sm border border-slate-200/50 ${className}`}>
      <img 
        src="https://www.sman1serangpanjang.sch.id/assets/images/icon-1654482549.png" 
        alt="Logo SMAN 1" 
        className="w-full h-full object-contain"
        onError={(e) => { e.currentTarget.src = "https://placehold.co/100x120?text=SMAN1"; }}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8" /></div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Akses Admin</h3>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password" autoFocus required placeholder="Kata sandi..." value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-xl outline-none mb-4 text-center ${loginError ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 px-4 py-3 bg-slate-100 font-bold rounded-xl">BATAL</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">LOGIN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex flex-col w-72 bg-slate-900 text-slate-300 p-6 shadow-xl sticky top-0 h-screen border-r border-slate-800">
        <div className="flex flex-col items-center mb-10 px-2 py-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
          <SchoolLogo className="w-20 h-24 mb-3" />
          <div className="text-center">
            <span className="block font-black text-white text-xl tracking-tight leading-none mb-1 uppercase">Serangpanjang</span>
            <span className="block text-[11px] text-slate-400 font-bold tracking-[0.1em] uppercase">E-Presensi Terpadu</span>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('form')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'form' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><PlusCircle className="w-5 h-5" /> Input Presensi</button>
          {isAdmin && (
            <>
              <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><History className="w-5 h-5" /> Riwayat Data</button>
              <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5" /> Statistik & AI</button>
            </>
          )}
        </div>
        <div className="pt-6 border-t border-slate-800">
          {!isAdmin ? (
            <button onClick={() => setShowLoginModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 text-xs font-black tracking-widest uppercase text-slate-400 border border-slate-700/50 hover:bg-slate-800 transition-all"><Lock className="w-3.5 h-3.5" /> Akses Admin</button>
          ) : (
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 text-xs font-black tracking-widest uppercase text-red-400 border border-red-900/30 hover:bg-red-900/40 transition-all"><LogOut className="w-3.5 h-3.5" /> Logout</button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 max-w-6xl mx-auto w-full pb-28 md:pb-10">
        {notification && (
          <div className={`fixed top-4 right-4 z-[100] p-4 rounded-xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-right ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-medium text-sm">{notification.message}</p>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Lapor Kehadiran</h2>
              <p className="text-slate-500 text-sm md:text-base italic">"Disiplin adalah kunci kemajuan kita bersama."</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Pelajaran</label>
                  <input type="date" required value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Kelas</label>
                  <select required value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                    <option value="">-- Pilih Kelas --</option>
                    {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Guru Pengajar</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input list="teacher-list" required placeholder="Ketik nama guru..." value={formData.namaGuru} onChange={e => handleTeacherChange(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                  </div>
                  <datalist id="teacher-list">{TEACHERS.map(t => <option key={t.id} value={t.name} />)}</datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jam Pelajaran Ke-</label>
                  <select value={formData.jamKe} onChange={e => setFormData({...formData, jamKe: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                    {[1,2,3,4,5,6,7,8,9,10].map(j => <option key={j} value={j}>Jam Ke-{j}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mata Pelajaran</label>
                <input list="subject-list" required placeholder="Pilih mapel..." value={formData.mataPelajaran} onChange={e => setFormData({...formData, mataPelajaran: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                <datalist id="subject-list">{suggestedSubjects.map((s, idx) => <option key={idx} value={s} />)}</datalist>
              </div>

              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 uppercase mb-3">Kehadiran Guru di Kelas</label>
                <select value={formData.alasan} onChange={e => setFormData({...formData, alasan: e.target.value as Reason})} className="w-full px-4 py-3.5 bg-white border border-indigo-200 rounded-2xl font-black text-slate-700 shadow-sm outline-none">
                  <option value={Reason.NONE}>Hadir Tepat Waktu</option>
                  <option value={Reason.SAKIT}>Tidak Hadir - Sakit</option>
                  <option value={Reason.IZIN}>Tidak Hadir - Izin</option>
                  <option value={Reason.DINAS}>Tidak Hadir - Tugas Dinas</option>
                  <option value={Reason.TANPA_KETERANGAN}>Tidak Hadir - Tanpa Keterangan</option>
                </select>
                <div className="mt-4 flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold text-slate-600 uppercase">Memberi Tugas/Instruksi?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.memberiTugas} onChange={e => setFormData({...formData, memberiTugas: e.target.checked})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* REKAP SISWA SECTION - TEXT BOX */}
              <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider">Rekapitulasi Kehadiran Siswa</label>
                </div>
                <div className="space-y-2">
                  <textarea 
                    rows={3} 
                    required
                    value={formData.rekapSiswa} 
                    onChange={e => setFormData({...formData, rekapSiswa: e.target.value})} 
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300" 
                    placeholder="Contoh: Hadir 32, Sakit 2 (Budi, Ani), Izin 0, Alpha 1 (Dedi)"
                  ></textarea>
                  <p className="text-[10px] text-emerald-700 font-medium italic">*Sebutkan nama siswa jika ada yang tidak hadir.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Catatan Tambahan / Detail Tugas</label>
                <textarea rows={2} value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold resize-none" placeholder="Opsional: Keterangan tambahan atau link tugas..."></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]">
                <ClipboardCheck className="w-6 h-6" /> SIMPAN DATA PRESENSI
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && isAdmin && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-slate-900">Log Presensi Guru & Siswa</h2>
              <button onClick={exportToCSV} disabled={entries.length === 0} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 shadow-lg transition-all"><FileSpreadsheet className="w-5 h-5" /> UNDUH CSV</button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu & Kelas</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guru & Mapel</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rekap Siswa</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Guru</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entries.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold">Belum ada data laporan dari siswa.</td></tr>
                    ) : (
                      entries.map(entry => (
                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-bold text-slate-900 text-xs">{formatDate(entry.tanggal)}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                               <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black">{entry.kelas}</span>
                               <span className="text-[10px] text-slate-400 font-black">JAM {entry.jamKe}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-black text-slate-900 text-sm leading-tight">{entry.namaGuru}</div>
                            <div className="text-[10px] text-indigo-600 font-black uppercase tracking-wide mt-1">{entry.mataPelajaran}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-2 max-w-[250px]">
                              <FileText className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                              <p className="text-[11px] font-medium text-slate-600 line-clamp-2 italic" title={entry.rekapSiswa}>
                                "{entry.rekapSiswa}"
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-black tracking-widest ${entry.alasanTidakHadir === Reason.NONE ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {entry.alasanTidakHadir === Reason.NONE ? 'HADIR' : entry.alasanTidakHadir.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button onClick={() => deleteEntry(entry.id)} className="p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && isAdmin && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Analisis Akademik SMAN 1</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Laporan Masuk</p>
                <p className="text-4xl font-black text-indigo-600">{entries.length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ketidakhadiran Guru</p>
                <p className="text-4xl font-black text-red-600">{entries.filter(e => e.alasanTidakHadir !== Reason.NONE).length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pemberian Tugas</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-amber-600">
                    {entries.length > 0 ? Math.round((entries.filter(e => e.memberiTugas).length / entries.length) * 100) : 0}
                  </p>
                  <span className="text-lg font-black text-amber-600/50">%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <BrainCircuit className="w-8 h-8 text-indigo-400" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Evaluasi Gemini AI</h3>
                </div>
                {aiSummary ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 font-medium whitespace-pre-line text-indigo-50 leading-relaxed antialiased">{aiSummary}</div>
                ) : (
                  <p className="text-indigo-200/60 mb-8 italic">Klik tombol di bawah untuk menganalisis data kehadiran dan rekapitulasi siswa secara komprehensif.</p>
                )}
                <button 
                  onClick={async () => { setLoading(true); setAiSummary(await analyzeAttendance(entries)); setLoading(false); }}
                  disabled={loading || entries.length === 0}
                  className="px-8 py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-50 disabled:opacity-30 flex items-center gap-3 transition-all"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <BrainCircuit className="w-5 h-5" />}
                  {aiSummary ? 'Segarkan Analisis' : 'Mulai Analisis AI'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'form' ? 'text-indigo-600' : 'text-slate-400'}`}><PlusCircle className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Input</span></button>
        {isAdmin && (
          <>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}><History className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Riwayat</span></button>
            <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'stats' ? 'text-indigo-600' : 'text-slate-400'}`}><LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Statistik</span></button>
          </>
        )}
      </nav>
    </div>
  );
};

export default App;
