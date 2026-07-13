import { useEffect, useMemo, useRef, useState } from 'react';

const labelFor = (customer) => customer.company ? `${customer.company} — ${customer.name}` : customer.name;

export default function CustomerCombobox({ customers, value, onChange, placeholder, emptyText, className }) {
  const selected = customers.find((customer) => String(customer.id) === String(value));
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);

  useEffect(() => setQuery(selected ? labelFor(selected) : ''), [selected?.id]);
  useEffect(() => {
    const close = (event) => !root.current?.contains(event.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term || selected) return [];
    return customers.filter((customer) => labelFor(customer).toLocaleLowerCase().includes(term));
  }, [customers, query, selected]);

  const choose = (customer) => {
    onChange(String(customer.id));
    setQuery(labelFor(customer));
    setOpen(false);
  };

  return <div ref={root} className="relative">
    <input required role="combobox" aria-expanded={open} aria-autocomplete="list" autoComplete="off" value={query}
      placeholder={customers.length ? placeholder : emptyText} className={className}
      onChange={(event) => { const nextQuery = event.target.value; setQuery(nextQuery); onChange(''); setActive(0); setOpen(Boolean(nextQuery.trim())); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && matches.length) { event.preventDefault(); setOpen(true); setActive((index) => Math.min(index + 1, matches.length - 1)); }
        if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
        if (event.key === 'Enter' && open && matches[active]) { event.preventDefault(); choose(matches[active]); }
        if (event.key === 'Escape') setOpen(false);
      }} />
    {open && query.trim() && <div role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
      {matches.length ? matches.map((customer, index) => <button type="button" role="option" aria-selected={String(customer.id) === String(value)} key={customer.id}
        onMouseEnter={() => setActive(index)} onClick={() => choose(customer)}
        className={`block w-full px-3 py-2 text-start text-sm ${index === active ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'}`}>
        {labelFor(customer)}
      </button>) : <div className="px-3 py-2 text-sm text-slate-500">{emptyText}</div>}
    </div>}
  </div>;
}
