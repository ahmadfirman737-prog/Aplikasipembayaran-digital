import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  ChevronDown,
  Layers,
  Menu,
  CheckCircle,
} from 'lucide-react';
import { UserRole, User, CompanyProfile } from '../types';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  currentUser: User;
  companyProfile: CompanyProfile;
  onSwitchRole: (role: UserRole) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpen2FA: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  companyProfile,
  onSwitchRole,
  lang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpen2FA,
  onToggleMobileSidebar,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const t = translations[lang];

  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator (Super)',
    gudang: 'Gudang & Logistik',
    kasir: 'Kasir & Penjualan',
    manager: 'Manager & Audit',
  };

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    gudang: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    kasir: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    manager: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left section: Hamburger for Mobile + Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-lg text-white shadow-md shadow-indigo-500/20">
            {companyProfile.logo.startsWith('http') || companyProfile.logo.startsWith('data:') ? (
              <img src={companyProfile.logo} alt={companyProfile.name} className="h-full w-full object-cover" />
            ) : (
              <span>{companyProfile.logo || '🏢'}</span>
            )}
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg leading-tight">
              {companyProfile.name}
            </h1>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              {companyProfile.tagline || t.appTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => onLanguageChange(lang === 'id' ? 'en' : 'id')}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Switch Language"
          >
            <Globe className="h-4 w-4 text-indigo-500" />
            <span className="uppercase">{lang}</span>
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          title={isDarkMode ? t.lightMode : t.darkMode}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* 2FA Security button */}
        <button
          onClick={onOpen2FA}
          className={`hidden items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:flex ${
            currentUser.is2FAEnabled
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
          }`}
          title="2FA Authentication Status"
        >
          <ShieldCheck
            className={`h-4 w-4 ${currentUser.is2FAEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
          />
          <span>2FA: {currentUser.is2FAEnabled ? t.enabled : t.disabled}</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-lg object-cover"
            />
            <div className="hidden text-left md:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {currentUser.name}
              </div>
              <span
                className={`inline-block rounded border px-1.5 py-0.2 text-[10px] font-bold ${
                  roleColors[currentUser.role]
                }`}
              >
                {currentUser.role.toUpperCase()}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  {t.switchRole}
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Akses Hak Otentikasi
                </p>
              </div>
              <div className="mt-1 space-y-1">
                {(['admin', 'gudang', 'kasir', 'manager'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSwitchRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentUser.role === r
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{roleNames[r]}</span>
                    {currentUser.role === r && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
