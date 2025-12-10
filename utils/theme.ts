
import { AppMode } from '../types';

export const getTheme = (mode: AppMode) => {
  switch (mode) {
    case 'restaurant':
      return {
        name: 'orange',
        bg: 'bg-orange-600',
        hover: 'hover:bg-orange-700',
        text: 'text-orange-600',
        darkText: 'text-orange-300',
        border: 'border-orange-200',
        darkBorder: 'border-orange-800',
        borderStrong: 'border-orange-600',
        lightBg: 'bg-orange-50',
        darkBgSubtle: 'bg-orange-500/20',
        lightText: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800',
        darkBadge: 'bg-orange-500/20 text-orange-200 border-orange-800',
        gradient: 'from-orange-600 to-red-600',
        ring: 'focus:ring-orange-500',
        ringVisible: 'focus-visible:ring-orange-500',
        hex: '#ea580c', // orange-600
        softHex: '#fff7ed', // orange-50
        activeBorder: 'border-orange-500',
        activeRing: 'ring-orange-500',
        activeBg: 'bg-orange-50',
        activeBgDark: 'dark:bg-orange-500/20',
        tabText: 'text-orange-600 dark:text-orange-400',
        tabBorder: 'border-orange-600'
      };
    case 'ecommerce':
      return {
        name: 'purple',
        bg: 'bg-purple-600',
        hover: 'hover:bg-purple-700',
        text: 'text-purple-600',
        darkText: 'text-purple-300', // Improved contrast
        border: 'border-purple-200',
        darkBorder: 'border-purple-800',
        borderStrong: 'border-purple-600',
        lightBg: 'bg-purple-50',
        darkBgSubtle: 'bg-purple-500/20',
        lightText: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-800',
        darkBadge: 'bg-purple-500/20 text-purple-200 border-purple-800',
        gradient: 'from-purple-600 to-pink-600',
        ring: 'focus:ring-purple-500',
        ringVisible: 'focus-visible:ring-purple-500',
        hex: '#9333ea',
        softHex: '#faf5ff',
        activeBorder: 'border-purple-500',
        activeRing: 'ring-purple-500',
        activeBg: 'bg-purple-50',
        activeBgDark: 'dark:bg-purple-500/20',
        tabText: 'text-purple-600 dark:text-purple-300',
        tabBorder: 'border-purple-600'
      };
    case 'service':
      return {
        name: 'cyan',
        bg: 'bg-cyan-600',
        hover: 'hover:bg-cyan-700',
        text: 'text-cyan-600',
        darkText: 'text-cyan-300',
        border: 'border-cyan-200',
        darkBorder: 'border-cyan-800',
        borderStrong: 'border-cyan-600',
        lightBg: 'bg-cyan-50',
        darkBgSubtle: 'bg-cyan-500/20',
        lightText: 'text-cyan-700',
        badge: 'bg-cyan-100 text-cyan-800',
        darkBadge: 'bg-cyan-500/20 text-cyan-200 border-cyan-800',
        gradient: 'from-cyan-600 to-teal-600',
        ring: 'focus:ring-cyan-500',
        ringVisible: 'focus-visible:ring-cyan-500',
        hex: '#0891b2',
        softHex: '#ecfeff',
        activeBorder: 'border-cyan-500',
        activeRing: 'ring-cyan-500',
        activeBg: 'bg-cyan-50',
        activeBgDark: 'dark:bg-cyan-500/20',
        tabText: 'text-cyan-600 dark:text-cyan-300',
        tabBorder: 'border-cyan-600'
      };
    case 'automotive':
      return {
        name: 'slate',
        bg: 'bg-slate-600',
        hover: 'hover:bg-slate-700',
        text: 'text-slate-600',
        darkText: 'text-slate-300',
        border: 'border-slate-200',
        darkBorder: 'border-slate-700',
        borderStrong: 'border-slate-600',
        lightBg: 'bg-slate-100',
        darkBgSubtle: 'bg-slate-500/20',
        lightText: 'text-slate-700',
        badge: 'bg-slate-200 text-slate-800',
        darkBadge: 'bg-slate-700/50 text-slate-200 border-slate-600',
        gradient: 'from-slate-600 to-zinc-600',
        ring: 'focus:ring-slate-500',
        ringVisible: 'focus-visible:ring-slate-500',
        hex: '#475569',
        softHex: '#f1f5f9',
        activeBorder: 'border-slate-500',
        activeRing: 'ring-slate-500',
        activeBg: 'bg-slate-200',
        activeBgDark: 'dark:bg-slate-700/30',
        tabText: 'text-slate-600 dark:text-slate-300',
        tabBorder: 'border-slate-600'
      };
    case 'event':
      return {
        name: 'rose',
        bg: 'bg-rose-600',
        hover: 'hover:bg-rose-700',
        text: 'text-rose-600',
        darkText: 'text-rose-300',
        border: 'border-rose-200',
        darkBorder: 'border-rose-800',
        borderStrong: 'border-rose-600',
        lightBg: 'bg-rose-50',
        darkBgSubtle: 'bg-rose-500/20',
        lightText: 'text-rose-700',
        badge: 'bg-rose-100 text-rose-800',
        darkBadge: 'bg-rose-500/20 text-rose-200 border-rose-800',
        gradient: 'from-rose-600 to-pink-600',
        ring: 'focus:ring-rose-500',
        ringVisible: 'focus-visible:ring-rose-500',
        hex: '#e11d48',
        softHex: '#fff1f2',
        activeBorder: 'border-rose-500',
        activeRing: 'ring-rose-500',
        activeBg: 'bg-rose-50',
        activeBgDark: 'dark:bg-rose-500/20',
        tabText: 'text-rose-600 dark:text-rose-300',
        tabBorder: 'border-rose-600'
      };
    case 'custom':
      return {
        name: 'teal',
        bg: 'bg-teal-600',
        hover: 'hover:bg-teal-700',
        text: 'text-teal-600',
        darkText: 'text-teal-300',
        border: 'border-teal-200',
        darkBorder: 'border-teal-800',
        borderStrong: 'border-teal-600',
        lightBg: 'bg-teal-50',
        darkBgSubtle: 'bg-teal-500/20',
        lightText: 'text-teal-700',
        badge: 'bg-teal-100 text-teal-800',
        darkBadge: 'bg-teal-500/20 text-teal-200 border-teal-800',
        gradient: 'from-teal-600 to-emerald-600',
        ring: 'focus:ring-teal-500',
        ringVisible: 'focus-visible:ring-teal-500',
        hex: '#0d9488',
        softHex: '#f0fdfa',
        activeBorder: 'border-teal-500',
        activeRing: 'ring-teal-500',
        activeBg: 'bg-teal-50',
        activeBgDark: 'dark:bg-teal-500/20',
        tabText: 'text-teal-600 dark:text-teal-300',
        tabBorder: 'border-teal-600'
      };
    case 'property':
    default:
      return {
        name: 'indigo',
        bg: 'bg-indigo-600',
        hover: 'hover:bg-indigo-700',
        text: 'text-indigo-600',
        darkText: 'text-indigo-300',
        border: 'border-indigo-200',
        darkBorder: 'border-indigo-800',
        borderStrong: 'border-indigo-600',
        lightBg: 'bg-indigo-50',
        darkBgSubtle: 'bg-indigo-500/20',
        lightText: 'text-indigo-700',
        badge: 'bg-indigo-100 text-indigo-800',
        darkBadge: 'bg-indigo-500/20 text-indigo-200 border-indigo-800',
        gradient: 'from-indigo-600 to-blue-600',
        ring: 'focus:ring-indigo-500',
        ringVisible: 'focus-visible:ring-indigo-500',
        hex: '#4f46e5',
        softHex: '#eef2ff',
        activeBorder: 'border-indigo-500',
        activeRing: 'ring-indigo-500',
        activeBg: 'bg-indigo-50',
        activeBgDark: 'dark:bg-indigo-500/20',
        tabText: 'text-indigo-600 dark:text-indigo-300',
        tabBorder: 'border-indigo-600'
      };
  }
};
