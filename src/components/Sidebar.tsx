import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Building2,
  Code2,
  X,
  ShieldAlert,
  Globe,
} from 'lucide-react';
import { UserRole } from '../types';
import { Language, translations } from '../i18n/translations';

export type TabType =
  | 'dashboard'
  | 'inventory'
  | 'transactions'
  | 'reports'
  | 'users'
  | 'settings'
  | 'laravel'
  | 'hostinger';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
  lang: Language;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  criticalStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  lang,
  mobileOpen,
  onCloseMobile,
  criticalStockCount,
}) => {
  const t = translations[lang];

  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ['admin', 'gudang', 'kasir', 'manager'],
    },
    {
      id: 'inventory' as TabType,
      label: t.inventory,
      icon: Package,
      badge: criticalStockCount > 0 ? criticalStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['admin', 'gudang', 'manager'],
    },
    {
      id: 'transactions' as TabType,
      label: t.transactions,
      icon: ShoppingCart,
      roles: ['admin', 'kasir', 'manager'],
    },
    {
      id: 'reports' as TabType,
      label: t.reports,
      icon: FileText,
      roles: ['admin', 'manager'],
    },
    {
      id: 'users' as TabType,
      label: t.userManagement,
      icon: Users,
      roles: ['admin', 'manager'],
    },
    {
      id: 'settings' as TabType,
      label: t.companySettings,
      icon: Building2,
      roles: ['admin', 'manager'],
    },
    {
      id: 'laravel' as TabType,
      label: t.laravelCode,
      icon: Code2,
      badge: 'Laravel 11',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300',
      roles: ['admin', 'gudang', 'kasir', 'manager'],
    },
    {
      id: 'hostinger' as TabType,
      label: t.hostingerDeploy,
      icon: Globe,
      badge: 'Hostinger',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
      roles: ['admin', 'gudang', 'kasir', 'manager'],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Header section in sidebar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama ERP
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Role: <span className="text-indigo-600 dark:text-indigo-400">{userRole.toUpperCase()}</span>
            </p>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 dark:bg-indigo-600'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Low stock alert box at bottom of sidebar */}
      {criticalStockCount > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          <div className="flex items-center space-x-2 font-bold text-rose-700 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>Peringatan Stok!</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-800/90 dark:text-rose-300">
            Ada <strong className="font-bold underline">{criticalStockCount} produk</strong> mencapai level kritis.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transition-colors dark:bg-slate-900">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
