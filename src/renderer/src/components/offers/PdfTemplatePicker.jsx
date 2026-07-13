import { PDF_TEMPLATES } from "../../data/offers.js";

function TemplateThumbnail({ variant }) {
  if (variant === "sidebar") {
    return (
      <span className="flex h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
        <span className="w-3 bg-emerald-700" />
        <span className="flex-1 p-1">
          <span className="mb-1 block h-1 w-5 bg-slate-700" />
          <span className="mb-2 block h-0.5 w-full bg-slate-200" />
          <span className="mb-1 block h-1.5 w-full bg-emerald-100" />
          <span className="mb-1 block h-1.5 w-full bg-slate-100" />
          <span className="block h-1.5 w-full bg-slate-100" />
        </span>
      </span>
    );
  }

  if (variant === "centered") {
    return (
      <span className="h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-300 bg-[#fffdfa] p-1 shadow-sm">
        <span className="mx-auto mt-1 block h-1 w-5 bg-violet-700" />
        <span className="mx-auto mt-1 block h-0.5 w-7 bg-amber-400" />
        <span className="mt-2 grid grid-cols-2 gap-1 border-y border-violet-200 py-1">
          <span className="h-2 bg-violet-50" />
          <span className="h-2 bg-violet-50" />
        </span>
        <span className="mt-1 block h-0.5 w-full bg-slate-200" />
        <span className="mt-1 block h-0.5 w-full bg-slate-200" />
        <span className="mt-1 block h-0.5 w-full bg-slate-200" />
      </span>
    );
  }

  if (variant === "lines") {
    return (
      <span className="h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-300 bg-white p-1.5 shadow-sm">
        <span className="block h-1 w-7 bg-slate-900" />
        <span className="mt-1 block h-px w-full bg-slate-400" />
        <span className="mt-3 block h-px w-full bg-slate-300" />
        <span className="mt-2 block h-px w-full bg-slate-300" />
        <span className="mt-2 block h-px w-full bg-slate-300" />
        <span className="ms-auto mt-2 block h-1 w-5 bg-slate-900" />
      </span>
    );
  }

  if (variant === "cards") {
    return (
      <span className="h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-300 bg-orange-50 p-1 shadow-sm">
        <span className="block h-3 rounded-sm bg-orange-700" />
        <span className="mt-1 grid grid-cols-2 gap-1">
          <span className="h-2 rounded-sm bg-white" />
          <span className="h-2 rounded-sm bg-amber-200" />
        </span>
        <span className="mt-1 block h-2 rounded-sm bg-white" />
        <span className="mt-1 block h-2 rounded-sm bg-white" />
        <span className="ms-auto mt-1 block h-2 w-5 rounded-sm bg-orange-200" />
      </span>
    );
  }

  return (
    <span className="h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
      <span className="block h-3 bg-blue-700" />
      <span className="block p-1">
        <span className="mb-1 block h-1 w-6 bg-slate-700" />
        <span className="mb-1 grid grid-cols-2 gap-1">
          <span className="h-2 rounded-sm bg-blue-50" />
          <span className="h-2 rounded-sm bg-blue-100" />
        </span>
        <span className="mb-1 block h-1.5 w-full bg-slate-100" />
        <span className="mb-1 block h-1.5 w-full bg-slate-100" />
        <span className="ms-auto block h-2 w-5 rounded-sm bg-blue-600" />
      </span>
    </span>
  );
}

export default function PdfTemplatePicker({ value, onChange, texts }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      {PDF_TEMPLATES.map((template) => {
        const active = value === template.id;
        return (
          <button
            type="button"
            key={template.id}
            aria-pressed={active}
            onClick={() => onChange(template.id)}
            className={`flex min-w-0 items-center gap-2 rounded-lg border bg-white p-2 text-start transition ${
              active
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <TemplateThumbnail variant={template.preview} />
            <span className="min-w-0">
              <strong className="block truncate text-sm text-slate-800">
                {texts.templates[template.id]}
              </strong>
              <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                {texts.templateDescriptions[template.id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
