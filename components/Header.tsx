'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  highlight?: boolean;
  dropdown?: DropdownItem[];
}

interface HeaderProps {
  brand?: string;
  links: NavLink[];
  showNotification?: boolean;
  notificationTokenKey?: string;
}

export default function Header({
  brand = 'EventPro',
  links,
  showNotification = false,
  notificationTokenKey = 'clientToken',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hlStyle = {
    background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
  };

  const renderDesktopLink = (link: NavLink, i: number) => {
    if (link.dropdown) {
      const isOpen = dropdownOpen === i;
      return (
        <div key={i} className="relative group">
          <button
            onClick={() => setDropdownOpen(isOpen ? null : i)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all text-slate-400 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {link.label}
            <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl z-50"
              style={{ background: 'rgba(10,22,40,0.98)', border: '1px solid rgba(14,165,233,0.2)', backdropFilter: 'blur(20px)' }}
            >
              {link.dropdown.map((item, j) =>
                item.href ? (
                  <Link
                    key={j}
                    href={item.href}
                    onClick={() => setDropdownOpen(null)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-all ${
                      item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={j}
                    onClick={() => {
                      setDropdownOpen(null);
                      item.onClick?.();
                    }}
                    className={`w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-all ${
                      item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return link.href ? (
      <Link
        key={i}
        href={link.href}
        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
          link.highlight ? 'text-white hover:-translate-y-0.5' : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        style={link.highlight ? hlStyle : {}}
      >
        {link.label}
      </Link>
    ) : (
      <button
        key={i}
        onClick={link.onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
          link.highlight ? 'text-white hover:-translate-y-0.5' : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        style={link.highlight ? hlStyle : {}}
      >
        {link.label}
      </button>
    );
  };

  const renderMobileLink = (link: NavLink, i: number) => {
    if (link.dropdown) {
      const isOpen = dropdownOpen === i;
      return (
        <div key={i} className="border-t border-slate-700">
          <button
            onClick={() => setDropdownOpen(isOpen ? null : i)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            {link.label}
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="bg-white/5 border-t border-slate-700">
              {link.dropdown.map((item, j) =>
                item.href ? (
                  <Link
                    key={j}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDropdownOpen(null);
                    }}
                    className={`flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium transition-all block ${
                      item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={j}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDropdownOpen(null);
                      item.onClick?.();
                    }}
                    className={`w-full text-left flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium transition-all ${
                      item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return link.href ? (
      <Link
        key={i}
        href={link.href}
        onClick={() => setMobileMenuOpen(false)}
        className={`block px-4 py-3 text-sm font-semibold border-t border-slate-700 transition-all ${
          link.highlight ? 'text-white hover:bg-sky-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
        style={link.highlight ? { borderColor: 'rgba(14,165,233,0.3)' } : {}}
      >
        {link.label}
      </Link>
    ) : (
      <button
        key={i}
        onClick={() => {
          setMobileMenuOpen(false);
          link.onClick?.();
        }}
        className={`w-full text-left block px-4 py-3 text-sm font-semibold border-t border-slate-700 transition-all ${
          link.highlight ? 'text-white hover:bg-sky-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
        style={link.highlight ? { borderColor: 'rgba(14,165,233,0.3)' } : {}}
      >
        {link.label}
      </button>
    );
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      ref={navRef}
      style={{ background: 'rgba(10,22,40,0.96)', borderColor: 'rgba(14,165,233,0.15)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
          >
            E
          </div>
          <span className="text-lg font-black text-white hidden sm:inline">{brand}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link, i) => renderDesktopLink(link, i))}
          {showNotification && <NotificationBell tokenKey={notificationTokenKey} />}
        </div>

        {/* Mobile: Hamburger + Notification */}
        <div className="flex md:hidden items-center gap-3">
          {showNotification && <NotificationBell tokenKey={notificationTokenKey} />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-all text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t overflow-hidden"
          style={{ borderColor: 'rgba(14,165,233,0.15)' }}
        >
          <div className="max-w-7xl mx-auto px-0">
            {links.map((link, i) => renderMobileLink(link, i))}
          </div>
        </div>
      )}
    </header>
  );
}
