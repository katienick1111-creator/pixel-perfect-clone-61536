import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, ArrowLeft, Sparkles, Share2 } from "lucide-react";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [{ title: "QR Code — Trovin'" }],
  }),
  component: QrPage,
});

function QrPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const url = typeof window !== "undefined" ? window.location.origin : "https://trovin.app";

  const download = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "trovin-qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(url);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Trovin'", url });
    } else {
      await copy();
    }
  };

  return (
    <div className="min-h-screen bg-cream text-navy">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-navy text-cream">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/85 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Trovin'
          </Link>
          <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-navy">
            share
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-script text-3xl text-teal leading-none">scan me —</p>
          <h1 className="mt-2 font-display text-3xl">Share Trovin'</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Point a camera at this code to open the site instantly.
          </p>
        </div>

        {/* QR Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-paper shadow-brand-lg p-6">
          {/* Decorative corners */}
          <div className="absolute -left-3 top-6 h-10 w-10 -rotate-12 rounded-sm bg-gold/30" />
          <div className="absolute -right-2 bottom-8 h-8 w-8 rotate-6 rounded-sm bg-teal/20" />

          <div className="relative flex flex-col items-center gap-5">
            {/* QR Code */}
            <div
              ref={qrRef}
              className="rounded-xl bg-cream p-5 border border-line shadow-brand-sm"
            >
              <QRCodeCanvas
                value={url}
                size={260}
                level="H"
                includeMargin={false}
                fgColor="#0c2340"
                bgColor="#fffaf2"
              />
            </div>

            {/* URL */}
            <div className="text-center">
              <p className="break-all text-xs text-ink-mute font-mono">{url}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-xs font-semibold hover:bg-cream-deep transition"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button
                onClick={share}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-xs font-semibold hover:bg-cream-deep transition"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button
                onClick={download}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy text-cream px-3 py-2.5 text-xs font-semibold hover:bg-navy-700 transition"
              >
                <Download className="h-3.5 w-3.5" /> Save
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 rounded-xl border border-line bg-paper p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">
            pro tips
          </p>
          <ul className="space-y-1.5 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              Save the PNG and print it on flyers, table tents, or stickers.
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              Most phone cameras scan QR codes automatically — no app needed.
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
              This code always points to the live site, even after updates.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
