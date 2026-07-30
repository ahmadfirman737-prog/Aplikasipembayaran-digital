import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
  Key,
  CheckCircle2,
  XCircle,
  X,
  Phone,
  Mail,
  User as UserIcon,
  Filter,
  Lock,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { Language, translations } from '../i18n/translations';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (newUser: Omit<User, 'id'>) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  lang: Language;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onAddUser,
  onEditUser,
  onDeleteUser,
  lang,
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'kasir' as UserRole,
    status: 'Active' as 'Active' | 'Inactive',
    is2FAEnabled: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    password: '',
  });

  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    gudang: 'Gudang & Logistik',
    kasir: 'Kasir & Penjualan',
    manager: 'Manager & Audit',
  };

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    gudang: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    kasir: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    manager: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole =
      selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'kasir',
      status: 'Active',
      is2FAEnabled: false,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + users.length}?w=150`,
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
      status: u.status || 'Active',
      is2FAEnabled: u.is2FAEnabled,
      avatar: u.avatar,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      onEditUser({
        ...editingUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        is2FAEnabled: formData.is2FAEnabled,
      });
    } else {
      onAddUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '0812-0000-0000',
        role: formData.role,
        status: formData.status,
        is2FAEnabled: formData.is2FAEnabled,
        avatar: formData.avatar,
        lastLogin: 'Baru dibuat',
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (u: User) => {
    onEditUser({
      ...u,
      status: u.status === 'Active' ? 'Inactive' : 'Active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400 backdrop-blur-sm border border-indigo-500/30">
              <Users className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Manajemen User & Hak Akses Pengguna
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-300 max-w-xl">
            Atur data pengguna, penugasan peran (Admin, Gudang, Kasir, Manager), otentikasi dua faktor (2FA), serta status aktifasi akun.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah User Baru</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Pengguna Registered
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {users.length} <span className="text-xs font-normal text-slate-500">Akun</span>
            </p>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              Sistem Active
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-500">
            Administrator
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {users.filter((u) => u.role === 'admin').length}
            </p>
            <span className="text-xs text-slate-400">Super User</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Kasir & POS Sales
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {users.filter((u) => u.role === 'kasir').length}
            </p>
            <span className="text-xs text-slate-400">Frontline</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            Gudang & Logistik
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {users.filter((u) => u.role === 'gudang').length}
            </p>
            <span className="text-xs text-slate-400">Inventory</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama user, email, atau no handphone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Role Filter tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { id: 'all', label: 'Semua Role' },
            { id: 'admin', label: 'Admin' },
            { id: 'kasir', label: 'Kasir' },
            { id: 'gudang', label: 'Gudang' },
            { id: 'manager', label: 'Manager' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRoleFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedRoleFilter === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
              <tr>
                <th className="p-4 font-bold">Profil & Nama User</th>
                <th className="p-4 font-bold">Peran (Role)</th>
                <th className="p-4 font-bold">No. Handphone</th>
                <th className="p-4 font-bold">Status Akun</th>
                <th className="p-4 font-bold">2FA Security</th>
                <th className="p-4 font-bold">Terakhir Akses</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                  >
                    {/* User Profile */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                            <span>{u.name}</span>
                            {u.id === currentUser.id && (
                              <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                SAYA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                          roleColors[u.role]
                        }`}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>{roleNames[u.role]}</span>
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">
                      {u.phone || '0812-3456-7890'}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={currentUser.role !== 'admin'}
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                          u.status !== 'Inactive'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status aktif"
                      >
                        {u.status !== 'Inactive' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-slate-400" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* 2FA */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1 text-[11px] font-semibold ${
                          u.is2FAEnabled
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{u.is2FAEnabled ? '2FA Aktif' : 'Nonaktif'}</span>
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {u.lastLogin || '2026-07-30 09:00'}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Edit Pengguna"
                        >
                          <Edit className="h-3.5 w-3.5 text-amber-500" />
                        </button>

                        {currentUser.role === 'admin' && u.id !== currentUser.id && (
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-indigo-600" />
                <span>{editingUser ? 'Edit Data Pengguna' : 'Tambah User Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Rizky"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Login
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@perusahaan.co.id"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    No. Handphone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-XXXX-XXXX"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Peran / Hak Akses (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white font-semibold"
                >
                  <option value="admin">Administrator (Akses Penuh + User Mgmt)</option>
                  <option value="kasir">Kasir & POS Penjualan</option>
                  <option value="gudang">Gudang & Inventaris Stok</option>
                  <option value="manager">Manager & Laporan Audit</option>
                </select>
              </div>

              {/* Password / PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password / Kata Sandi {editingUser && '(Kosongkan jika tidak diubah)'}
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Status & 2FA Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Active">Aktif (Bisa Login)</option>
                    <option value="Inactive">Nonaktif (Di-suspend)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Otentikasi 2FA
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is2FAEnabled: !formData.is2FAEnabled })}
                    className={`mt-1 flex w-full items-center justify-between rounded-xl border p-2 text-xs font-bold transition-all ${
                      formData.is2FAEnabled
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <span>{formData.is2FAEnabled ? '2FA Diaktifkan' : '2FA Nonaktif'}</span>
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat User Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-center text-base font-extrabold text-slate-900 dark:text-white">
              Hapus Akun Pengguna?
            </h3>
            <p className="mt-1 text-center text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus akun <strong className="text-slate-900 dark:text-white">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteUser(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500"
              >
                Ya, Hapus User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
