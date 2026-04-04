import { useEffect, useState } from 'react';
import AuthButtons from './AuthButtons.jsx';
import { getUser } from '../lib/api/http';

export default function Header() {
  const [role, setRole] = useState(getUser()?.role ?? '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setRole(getUser()?.role ?? ''), 500);
    return () => clearInterval(interval);
  }, []);

  // Cerrar menú móvil al cambiar de hash (opcional)
  useEffect(() => {
    const handleHashChange = () => setMobileMenuOpen(false);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinks = () => {
    if (role === 'admin') {
      return (
        <>
          <a href="#admin-usuarios" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Usuarios</a>
          <a href="#admin-citas" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Citas</a>
          <a href="#admin-mascotas" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Mascotas</a>
          <a href="#admin-solicitudes" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Solicitudes</a>
          <a href="#admin-mensajes" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Mensajes</a>
        </>
      );
    } else if (role === 'veterinario') {
      return (
        <>
          <a href="#vet-disponibilidad" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Disponibilidad</a>
          <a href="#mis-citas" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Mis citas</a>
        </>
      );
    } else {
      return (
        <>
          <a href="#inicio" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Inicio</a>
          <a href="#adopcion" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Adopción</a>
          <a href="#citas" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Citas</a>
          <a href="#nosotros" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Nosotros</a>
          <a href="#contacto" className="block lg:inline-block px-3 py-2 text-gray-300 hover:text-white transition-colors">Contacto</a>
        </>
      );
    }
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-lg hidden sm:inline">Latidos & Patitas</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks()}
          </nav>

          {/* Auth buttons (siempre visible) */}
          <div className="flex items-center gap-2">
            <AuthButtons />

            {/* Botón menú móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="sr-only">Abrir menú</span>
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-800 space-y-1">
            {navLinks()}
          </nav>
        )}
      </div>
    </header>
  );
}