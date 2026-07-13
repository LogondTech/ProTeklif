import { useEffect } from 'react';
import { getModalCloseLabel } from '../data/modal.js';
import { useI18n } from '../i18n.jsx';

export default function Modal({ title, children, onClose }) {
  const { language } = useI18n();

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-6" onMouseDown={onClose} role="presentation">
      <section
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h3 id="modal-title" className="text-xl font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
            aria-label={getModalCloseLabel(language)}
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
