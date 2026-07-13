import { useEffect, useRef, useState } from "react";
import { PDF_PREVIEW_SIZE } from "../../data/offers.js";

export default function PdfPreview({ html, loading, message, title }) {
  const hostRef = useRef(null);
  const [hostWidth, setHostWidth] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const updateWidth = () => setHostWidth(host.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(host);
    return () => observer.disconnect();
  }, [html]);

  if (loading || !html) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-slate-100 p-6 text-center text-sm text-slate-500">
        {message}
      </div>
    );
  }

  const scale = Math.min(Math.max((hostWidth - 24) / PDF_PREVIEW_SIZE.width, 0.25), 1);

  return (
    <div ref={hostRef} className="overflow-hidden bg-slate-100 p-3">
      <div
        className="relative mx-auto overflow-hidden bg-white shadow-lg"
        style={{ width: PDF_PREVIEW_SIZE.width * scale, height: PDF_PREVIEW_SIZE.height * scale }}
      >
        <iframe
          title={title}
          srcDoc={html}
          sandbox=""
          referrerPolicy="no-referrer"
          scrolling="no"
          className="absolute start-0 top-0 border-0 bg-white"
          style={{
            width: PDF_PREVIEW_SIZE.width,
            height: PDF_PREVIEW_SIZE.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}
