'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Sliders,
  Palette,
  CheckCircle2,
  Save,
  Download,
  RotateCcw,
  User,
  Globe,
  Languages,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ThemeMode } from '@/context/AppContext';
import { Language, SUPPORTED_LANGUAGES } from '@/lib/translations';

export function SettingsView() {
  const {
    settings,
    updateSettings,
    profile,
    updateProfile,
    resetAllData,
    language,
    setLanguage,
    theme,
    setTheme,
    t,
  } = useApp();

  const [orgName, setOrgName] = useState(settings.orgName);
  const [adminName, setAdminName] = useState(profile.name);
  const [adminEmail, setAdminEmail] = useState(profile.email);
  const [targetSlaDays, setTargetSlaDays] = useState(String(settings.targetSlaDays));
  const [warningSlaDays, setWarningSlaDays] = useState(String(settings.warningSlaDays));
  const [bottleneckDropThreshold, setBottleneckDropThreshold] = useState(
    String(settings.bottleneckDropThreshold)
  );
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(theme);
  const [activeLanguage, setActiveLanguage] = useState<Language>(language || 'vi');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setOrgName(settings.orgName);
    setAdminName(profile.name);
    setAdminEmail(profile.email);
    setTargetSlaDays(String(settings.targetSlaDays));
    setWarningSlaDays(String(settings.warningSlaDays));
    setBottleneckDropThreshold(String(settings.bottleneckDropThreshold));
    setActiveTheme(theme);
    setActiveLanguage(language || settings.language || 'vi');
  }, [settings, profile, language, theme]);

  const handleLanguageChange = (lang: Language) => {
    setActiveLanguage(lang);
    setLanguage(lang);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      orgName: orgName.trim() || 'Acme Corporation',
      targetSlaDays: Number(targetSlaDays) || 30,
      warningSlaDays: Number(warningSlaDays) || 7,
      bottleneckDropThreshold: Number(bottleneckDropThreshold) || 45,
      activeTheme: activeTheme as any,
      language: activeLanguage,
    });
    setTheme(activeTheme);
    updateProfile({
      name: adminName.trim() || 'System Admin',
      email: adminEmail.trim() || 'admin@aplucke.hr',
      avatarInitials: adminName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'SA',
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      organization: orgName,
      profile: { name: adminName, email: adminEmail },
      settings: {
        targetSlaDays,
        warningSlaDays,
        bottleneckDropThreshold,
        activeTheme,
        language: activeLanguage,
      },
      telemetryStatus: 'OPTIMAL',
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ap_luc_ke_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm(t('settings.reset_confirm', 'Are you sure you want to reset all data and settings to factory defaults?'))) {
      resetAllData();
      alert(t('settings.reset_success', 'All data has been reset to defaults.'));
    }
  };

  return (
    <div className="flex-1 bg-[var(--background)] p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--outline-variant)]/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] border border-[var(--primary-container)]/50 flex items-center justify-center text-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/10">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                {t('settings.title', 'System Settings & Telemetry')}
              </h2>
              <p className="text-xs font-mono text-[var(--outline)] mt-0.5">
                {t('settings.subtitle', 'Saved permanently in browser storage (survives page refresh F5)')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--foreground)] text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--outline)]" />
              <span>{t('settings.export_backup', 'Export Backup')}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-container)] hover:bg-[var(--severity-critical-bg)] border border-[var(--outline-variant)] hover:border-[var(--severity-critical-muted)]/50 text-[var(--outline)] hover:text-[var(--severity-critical-muted)] text-xs font-mono transition-colors cursor-pointer"
              title={t('settings.reset_defaults', 'Reset all settings to default')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('settings.reset_defaults', 'Reset Defaults')}</span>
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section: Language & Localization (Đa ngôn ngữ) */}
          <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/50 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--outline-variant)]/30">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[var(--primary)] uppercase tracking-wider">
                <Languages className="w-4 h-4 text-[var(--primary-container)]" />
                <span>{t('settings.section_language', 'Language & Localization')}</span>
              </div>
              <span className="text-[11px] font-mono text-[var(--outline)] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[var(--severity-healthy)]" />
                <span className="text-[var(--foreground)] font-bold uppercase">{activeLanguage}</span>
              </span>
            </div>

            <p className="text-xs text-[var(--outline)] font-sans">
              {t('settings.language_desc', 'Select your preferred display language for dashboards, reports, and settings.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SUPPORTED_LANGUAGES.map((langOption) => {
                const isSelected = activeLanguage === langOption.code;
                return (
                  <div
                    key={langOption.code}
                    onClick={() => handleLanguageChange(langOption.code)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--surface-container)] border-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/15 ring-1 ring-[var(--primary-container)]/30'
                        : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none" role="img" aria-label={langOption.label}>
                          {langOption.flag}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-[var(--foreground)] font-sans flex items-center gap-1.5">
                            {langOption.nativeLabel}
                            {langOption.code === 'vi' && (
                              <span className="text-[10px] text-[var(--outline)] font-normal font-mono">
                                (VI)
                              </span>
                            )}
                            {langOption.code === 'en' && (
                              <span className="text-[10px] text-[var(--outline)] font-normal font-mono">
                                (EN)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--outline)] font-mono">
                            {langOption.label}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--primary-container)]/20 border border-[var(--primary-container)]/50 text-[var(--primary-container)] text-[10px] font-mono font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {t('settings.active_badge', 'Active')}
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-[var(--outline-variant)] shrink-0 mt-1"></span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--on-surface-variant)] font-sans mt-1">
                      {langOption.code === 'vi'
                        ? t('settings.lang_vi_desc', langOption.description)
                        : t('settings.lang_en_desc', langOption.description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: General & Personal Account */}
          <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/50 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-[var(--primary)] uppercase tracking-wider pb-2 border-b border-[var(--outline-variant)]/30">
              <User className="w-4 h-4 text-[var(--primary-container)]" />
              <span>{t('settings.section_account', 'Personal Account & Organization')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.admin_name', 'ADMIN NAME')}
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder={t('settings.admin_name_placeholder', 'Admin Name')}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-container)] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.admin_email', 'ADMIN EMAIL')}
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder={t('settings.admin_email_placeholder', 'admin@aplucke.hr')}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--primary-container)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.org_name', 'ORGANIZATION')}
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder={t('settings.org_name_placeholder', 'Acme Corporation')}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-container)] font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pipeline Thresholds & Diagnostics */}
          <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/50 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-[var(--primary)] uppercase tracking-wider pb-2 border-b border-[var(--outline-variant)]/30">
              <Sliders className="w-4 h-4 text-[var(--severity-warning)]" />
              <span>{t('settings.section_thresholds', 'Funnel Diagnostic Thresholds')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.target_sla', 'DEFAULT TARGET SLA (DAYS)')}
                </label>
                <input
                  type="number"
                  value={targetSlaDays}
                  onChange={(e) => setTargetSlaDays(e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--primary-container)]"
                />
                <p className="text-[10px] text-[var(--outline)] mt-1 font-mono">
                  {t('settings.target_sla_hint', 'Standard time to fill target')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.warning_sla', 'STAGE SLA WARNING (DAYS)')}
                </label>
                <input
                  type="number"
                  value={warningSlaDays}
                  onChange={(e) => setWarningSlaDays(e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--primary-container)]"
                />
                <p className="text-[10px] text-[var(--outline)] mt-1 font-mono">
                  {t('settings.warning_sla_hint', 'Trigger warning when stage exceeds this')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] mb-1.5">
                  {t('settings.bottleneck_trigger', 'BOTTLENECK TRIGGER (%)')}
                </label>
                <input
                  type="number"
                  value={bottleneckDropThreshold}
                  onChange={(e) => setBottleneckDropThreshold(e.target.value)}
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--primary-container)]"
                />
                <p className="text-[10px] text-[var(--outline)] mt-1 font-mono">
                  {t('settings.bottleneck_trigger_hint', 'Flag stage as bottleneck if drop > %')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Theme & Display */}
          <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/50 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-[var(--primary)] uppercase tracking-wider pb-2 border-b border-[var(--outline-variant)]/30">
              <Palette className="w-4 h-4 text-[var(--severity-healthy)]" />
              <span>{t('settings.section_theme', 'Theme & Visual Aesthetics')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dark Theme */}
              <div
                onClick={() => setActiveTheme('dark')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTheme === 'dark'
                    ? 'bg-[var(--surface-container)] border-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/15 ring-1 ring-[var(--primary-container)]/30'
                    : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--foreground)] font-sans">
                    {t('settings.theme_dark_title', 'Dark Theme')}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#38bdf8]"></span>
                </div>
                <p className="text-[11px] text-[var(--outline)] font-mono">
                  {t('settings.theme_pressure_desc', 'Deep Navy (#0B1326) with Cyan & Amber accents.')}
                </p>
              </div>

              {/* Light Theme */}
              <div
                onClick={() => setActiveTheme('light')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTheme === 'light'
                    ? 'bg-[var(--surface-container)] border-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/15 ring-1 ring-[var(--primary-container)]/30'
                    : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--foreground)] font-sans">
                    {t('settings.theme_light_title', 'Light Theme')}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span>
                </div>
                <p className="text-[11px] text-[var(--outline)] font-mono">
                  {t('settings.theme_light_desc', 'Clean white surface with Blue & Emerald accents.')}
                </p>
              </div>

              {/* High Contrast Theme */}
              <div
                onClick={() => setActiveTheme('high-contrast')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTheme === 'high-contrast'
                    ? 'bg-[var(--surface-container)] border-[var(--secondary)] shadow-md shadow-[var(--secondary)]/15 ring-1 ring-[var(--secondary)]/30'
                    : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]/50 hover:bg-[var(--surface-container-low)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--foreground)] font-sans">
                    {t('settings.theme_hc_title', 'High Contrast')}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#ff8c00]"></span>
                </div>
                <p className="text-[11px] text-[var(--outline)] font-mono">
                  {t('settings.theme_kinetic_desc', 'Pure black with maximum contrast for accessibility.')}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--severity-healthy)] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('settings.saved_success', 'Settings Saved to Local Storage!')}</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary-container)] hover:brightness-110 text-[var(--on-primary)] font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-md shadow-[var(--primary-container)]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('common.save', 'Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
