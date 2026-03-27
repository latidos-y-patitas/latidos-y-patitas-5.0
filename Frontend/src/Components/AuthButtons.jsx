import { useEffect, useRef, useState } from 'react';
import { getToken, getUser } from '../lib/api/http';
import { logout } from '../lib/api/auth';

export default function AuthButtons() {
  const [authed, setAuthed] = useState(!!getToken());
  const [userName, setUserName] = useState(getUser()?.name ?? '');
  const [role, setRole] = useState(getUser()?.role ?? '');
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAuthed(!!getToken());
      setUserName(getUser()?.name ?? '');
      setRole(getUser()?.role ?? '');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!authed) {
    return (
      <div className="flex items-center gap-3">
        <a
          href="#registro"
          className="px-5 py-2.5 text-sm font-medium text-white border border-emerald-600 rounded-full hover:bg-emerald-600/10 transition-colors"
        >
          Registrarme
        </a>
        <a
          href="#login"
          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-md"
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full border border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <span className="text-sm font-medium">{userName || 'Perfil'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden">
          {/* Admin section */}
          {role === 'admin' && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-900/50">
                Administración
              </div>
              <a href="#admin-usuarios" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Usuarios</a>
              <a href="#admin-citas" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Citas</a>
              <a href="#admin-mascotas" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Mascotas</a>
              <a href="#admin-mensajes" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Mensajes</a>
              <a href="#admin-solicitudes" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Solicitudes</a>
              <div className="border-t border-gray-700 my-1"></div>
            </>
          )}

          {/* Veterinario section */}
          {role === 'veterinario' && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-900/50">
                Veterinario
              </div>
              <a href="#vet-disponibilidad" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Disponibilidad</a>
              <a href="#mis-citas" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Mis citas</a>
              <a href="#vet-solicitudes" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Pendientes</a>
              <div className="border-t border-gray-700 my-1"></div>
            </>
          )}

          {/* Opciones comunes */}
          <a href="#mis-mascotas" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Mascotas en posesión</a>
          <a href="#mis-citas" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Citas pedidas</a>
          <a href="#editar-perfil" className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors" onClick={() => setOpen(false)}>Editar perfil</a>

          {/* Cerrar sesión */}
          <button
            onClick={async () => {
              try {
                await logout();
              } catch {}
              setAuthed(false);
              setOpen(false);
              window.location.hash = 'inicio';
            }}
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}