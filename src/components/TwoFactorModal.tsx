import React, { useState } from 'react';
import { ShieldCheck, X, QrCode, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../i18n/translations';

interface TwoFactorModalProps {
  user: User;
  onToggle2FA: (enable: boolean) => void;
  onClose: () => void;
  lang: Language;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  user,
  onToggle2FA,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const [pin, setPin] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      setVerified(true);
      setTimeout(() => {
        onToggle2FA(!user.is2FAEnabled);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Otentikasi Dua Faktor (2FA)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="rounded-xl bg-indigo-50 p-3.5 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            <p className="font-semibold">
              Tingkatkan Keamanan Akun Administrator & Pengelola Gudang.
            </p>
            <p className="mt-1 text-[11px] opacity-80">
              Gunakan aplikasi Google Authenticator atau Authy untuk memindai kode QR di bawah.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-800/50">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-900 text-white font-mono text-center p-2">
              <QrCode className="h-28 w-28 text-white" />
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-500">
              SECRET: JBSWY3DPEHPK3PXP
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Masukkan Kode OTP 6-Digit
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center font-mono text-lg font-bold tracking-widest text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {verified && (
              <div className="flex items-center justify-center space-x-1 text-emerald-600 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>2FA Berhasil Dikonfirmasi!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-2.5 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
            >
              {user.is2FAEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
