import type { Payment } from "@/data/trovin";
import { paymentLabel } from "@/data/trovin";

export { paymentLabel };

const brandBg: Record<Payment, string> = {
  Card: "#1f2937",
  Cash: "#0f7a4a",
  Venmo: "#008CFF",
  CashApp: "#00C244",
  ApplePay: "#000000",
  GooglePay: "#ffffff",
  PayPal: "#003087",
  Zelle: "#6D1ED4",
};

const brandFg: Record<Payment, string> = {
  Card: "#ffffff",
  Cash: "#ffffff",
  Venmo: "#ffffff",
  CashApp: "#ffffff",
  ApplePay: "#ffffff",
  GooglePay: "#1f2937",
  PayPal: "#ffffff",
  Zelle: "#ffffff",
};

function Glyph({ brand, size }: { brand: Payment; size: number }) {
  const s = size;
  switch (brand) {
    case "Card":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "Cash":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "Venmo":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor">
          <path d="M19.2 4.5c.5.9.8 1.8.8 2.9 0 3.6-3.1 8.3-5.6 11.6H8.7L6.4 5.7l5-.5 1.2 9.8c1.1-1.8 2.5-4.6 2.5-6.5 0-1-.2-1.8-.5-2.4l4.6-1.6Z" />
        </svg>
      );
    case "CashApp":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor">
          <path d="M15.6 9.3c-.8-.8-2-1.3-3.1-1.3-.7 0-1.5.3-1.5 1 0 .8 1 1.1 2.3 1.6 2.2.8 4 1.9 4 4.1 0 2.4-1.9 4.1-5 4.4l-.3 1.3c0 .3-.3.5-.6.5H9.6c-.4 0-.6-.3-.5-.7l.3-1.4c-1.2-.3-2.3-.9-3.1-1.6-.3-.3-.3-.7 0-1l1.2-1.2c.3-.3.7-.3 1 0 .9.8 2.1 1.3 3.4 1.3 1 0 1.7-.4 1.7-1.1 0-.7-.7-.9-2.2-1.5-1.9-.7-3.9-1.7-3.9-4.1 0-2.5 2-3.9 4.7-4.2l.3-1.4c.1-.3.3-.5.6-.5h1.7c.4 0 .6.3.6.7l-.3 1.5c1 .3 1.8.8 2.5 1.4.3.3.3.7 0 1l-1.2 1.2c-.3.3-.6.3-.9 0Z" />
        </svg>
      );
    case "ApplePay":
      return (
        <svg viewBox="0 0 32 24" width={s * 1.3} height={s} fill="currentColor">
          <path d="M6.6 6.4c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7 0 1.3-.3 1.7-.8Zm.6.9c-.9 0-1.7.5-2.2.5s-1.1-.5-1.9-.5c-1 0-1.9.6-2.4 1.5-1 1.8-.3 4.4.7 5.9.5.7 1.1 1.5 1.9 1.5.7 0 1-.5 1.9-.5s1.2.5 1.9.5c.8 0 1.3-.7 1.8-1.4.6-.8.8-1.6.8-1.6s-1.6-.6-1.6-2.4c0-1.5 1.2-2.2 1.3-2.2-.7-1-1.8-1.3-2.2-1.3ZM13 5.5h3.1c1.6 0 2.7 1.1 2.7 2.7s-1.1 2.7-2.7 2.7H14v3.7h-1V5.5Zm1 4.5h1.9c1.1 0 1.7-.6 1.7-1.6S17 6.8 16 6.8h-2v3.2Zm5.4 2.8c0-1.1.8-1.7 2.4-1.8l1.6-.1v-.4c0-.7-.4-1.1-1.3-1.1-.7 0-1.2.3-1.4.9h-1c.1-1.1 1.1-1.8 2.5-1.8 1.5 0 2.3.8 2.3 2.1v4h-1v-1h-.1c-.4.7-1 1.1-1.9 1.1-1.1 0-2-.7-2-1.9Zm4-.5v-.4l-1.4.1c-.9.1-1.4.4-1.4 1 0 .6.5.9 1.2.9 1 0 1.7-.7 1.7-1.6ZM26.7 15.3l.2-.8c.1 0 .3.1.5.1.5 0 .8-.2 1-.7l.1-.3-1.9-5h1.1l1.3 4.2 1.3-4.2h1.1l-1.9 5.3c-.4 1.2-1 1.6-2 1.6-.2 0-.6 0-.8-.2Z" />
        </svg>
      );
    case "GooglePay":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s}>
          <path fill="#4285F4" d="M12 10.2v3.7h5.2c-.2 1.2-1.5 3.5-5.2 3.5-3.1 0-5.7-2.6-5.7-5.7s2.6-5.7 5.7-5.7c1.8 0 3 .8 3.6 1.4l2.5-2.4C16.5 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.5H12Z" />
        </svg>
      );
    case "PayPal":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor">
          <path d="M7.4 21.5H4.8c-.3 0-.5-.2-.4-.5L7.2 2.9c.1-.3.3-.5.6-.5h6.4c3.1 0 5.1 1.6 4.6 4.6-.5 3-2.7 4.6-5.9 4.6h-2c-.3 0-.6.2-.6.5l-.9 5.7c0 .3-.3.5-.6.5l-1.4 3.2Zm3.2-12.9h1.6c1.8 0 2.9-.8 3.1-2.4.2-1.4-.6-2-2.3-2h-1.5l-.9 4.4Z" opacity=".7" />
          <path d="M19.6 8.4c-.5 3.4-3 5.2-6.5 5.2h-1.5c-.3 0-.6.2-.6.5l-.9 5.7c0 .2-.2.4-.4.4H7.2c-.3 0-.5-.2-.4-.5l.3-1.7c.1-.3.3-.5.6-.5h1.4c.3 0 .6-.2.6-.5l.9-5.7c.1-.3.3-.5.6-.5h2c3.2 0 5.4-1.6 5.9-4.6 0-.1.1-.3.1-.4 1 .6 1.6 1.6 1.4 3.1.5-.3.7-.3 1-.5Z" />
        </svg>
      );
    case "Zelle":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor">
          <path d="M13.5 2v2.2h4.1L7.5 17.6v2.2h-4v-2.2L13.6 4.4H10V2.2h3.5V2h0Zm-3 18.4v1.6h3v-1.6h-3Zm-1.1-7.5h7.1v-2H9.4v2Z" />
        </svg>
      );
  }
}

export function PaymentBrand({
  brand,
  size = 14,
  className = "",
}: {
  brand: Payment;
  size?: number;
  className?: string;
}) {
  return (
    <span
      title={paymentLabel[brand]}
      aria-label={paymentLabel[brand]}
      className={`inline-flex items-center justify-center rounded-md ${className}`}
      style={{
        background: brandBg[brand],
        color: brandFg[brand],
        width: size + 14,
        height: size + 14,
        border: brand === "GooglePay" ? "1px solid #e5e7eb" : undefined,
      }}
    >
      <Glyph brand={brand} size={size} />
    </span>
  );
}
