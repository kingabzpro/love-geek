import type { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#00d4ff',
    colorBackground: '#111d2e',
    colorInputBackground: '#0d1520',
    colorInputText: '#e2e8f0',
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorNeutral: '#1e3a55',
    colorDanger: '#ef4444',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    borderRadius: '0.75rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '0.875rem',
    spacingUnit: '1rem',
  },
  elements: {
    // Root card
    card: 'bg-[#111d2e] border border-[#1e3a55] shadow-2xl shadow-black/60',
    cardBox: 'bg-[#111d2e]',

    // Header
    headerTitle: 'text-[#e2e8f0] font-bold',
    headerSubtitle: 'text-[#94a3b8]',

    // Form fields
    formFieldLabel: 'text-[#94a3b8] text-xs font-medium tracking-wide',
    formFieldInput:
      'bg-[#0d1520] border-[#1e3a55] text-[#e2e8f0] placeholder-[#475569] focus:border-[#00d4ff] focus:ring-[#00d4ff]/20 rounded-xl',
    formFieldInputShowPasswordButton: 'text-[#94a3b8] hover:text-[#00d4ff]',

    // Primary button
    formButtonPrimary:
      'bg-[#00d4ff] text-[#050b14] font-semibold hover:bg-[#0099bb] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all rounded-xl',

    // Social buttons
    socialButtonsBlockButton:
      'bg-[#0d1520] border-[#1e3a55] hover:bg-[#162033] hover:border-[#00d4ff]/40 transition-all rounded-xl',
    socialButtonsBlockButtonText: '!text-[#e2e8f0] text-sm font-medium',
    socialButtonsBlockButtonArrow: 'text-[#94a3b8]',

    // Divider
    dividerLine: 'bg-[#1e3a55]',
    dividerText: 'text-[#475569] font-mono text-xs',

    // Footer links
    footerActionLink: 'text-[#00d4ff] hover:text-[#0099bb] font-mono',
    footerActionText: 'text-[#94a3b8]',
    footer: 'bg-[#0d1520] border-t border-[#1e3048]',

    // Internal navigation links
    identityPreviewText: 'text-[#e2e8f0]',
    identityPreviewEditButtonIcon: 'text-[#00d4ff]',

    // Alert / error
    formFieldErrorText: 'text-[#ef4444] font-mono text-xs',
    alertText: 'text-[#ef4444]',
    alert: 'bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl',

    // OTP / verification
    otpCodeFieldInput:
      'bg-[#0d1520] border-[#1e3a55] text-[#e2e8f0] focus:border-[#00d4ff] rounded-xl',

    // User button popup
    userButtonPopoverCard: 'bg-[#111d2e] border border-[#1e3a55] shadow-2xl shadow-black/60',
    userButtonPopoverActionButton:
      'text-[#94a3b8] hover:bg-[#162033] hover:text-[#e2e8f0] rounded-lg transition-colors',
    userButtonPopoverActionButtonText: 'text-[#94a3b8] hover:text-[#e2e8f0]',
    userButtonPopoverActionButtonIcon: 'text-[#94a3b8]',
    userButtonPopoverFooter: 'border-t border-[#1e3048]',
    userPreviewMainIdentifier: 'text-[#e2e8f0] font-bold',
    userPreviewSecondaryIdentifier: 'text-[#94a3b8] font-mono text-xs',

    // Avatar
    avatarBox: 'border-2 border-[#1e3a55]',
  },
};
