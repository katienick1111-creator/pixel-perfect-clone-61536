import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useLoyalty } from "@/hooks/useLoyalty";

export const Route = createFileRoute("/loyalty/qr")({
  component: MyQrPage,
});

function MyQrPage() {
  const { state, mutate } = useLoyalty();
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(state.me.personalQrToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rotate = () => {
    if (!confirm("Rotate your personal QR? Old printouts won't work.")) return;
    mutate((s) => ({ ...s, me: { ...s.me, personalQrToken: crypto.randomUUID() } }));
  };

  return (
    <div>
      <div className="text-center">
        <p className="font-script text-2xl text-teal leading-none">show this —</p>
        <h1 className="mt-1 font-display text-3xl">My QR</h1>
        <p className="mt-1 text-sm text-ink-soft">A vendor scans this to check you in.</p>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-line bg-paper p-6 shadow-brand-lg">
        <div ref={ref} className="mx-auto w-fit rounded-xl bg-cream p-5 border border-line">
          <QRCodeCanvas value={state.me.personalQrToken} size={240} level="H" fgColor="#0c2340" bgColor="#fffaf2" />
        </div>
        <div className="mt-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">your token</p>
          <p className="mt-1 break-all font-mono text-xs text-ink-soft">{state.me.personalQrToken}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={copy} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-xs font-semibold hover:bg-cream-deep">
            {copied ? <Check className="h-3.5 w-3.5 text-teal" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy token"}
          </button>
          <button onClick={rotate} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-xs font-semibold hover:bg-cream-deep">
            <RefreshCw className="h-3.5 w-3.5" /> New token
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-mute">
        Try the loop: copy this token, open <b>Scan</b>, paste it in.
      </p>
    </div>
  );
}
