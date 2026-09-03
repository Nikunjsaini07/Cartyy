import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/format";

export function CheckoutDialog({ product, variant, plan, onClose }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-zinc-950/40 backdrop-blur-xs"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="relative w-full max-w-[440px] p-7 rounded-2xl bg-white shadow-2xl border border-zinc-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 grid place-items-center border border-zinc-200 rounded-lg bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {confirmed ? (
          <div className="text-center py-2">
            <span className="w-12 h-12 grid place-items-center mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-700">
              <Check size={26} />
            </span>
            <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-600 text-xs font-semibold tracking-wider uppercase">
              Selection saved
            </p>
            <h2
              id="checkout-title"
              className="font-heading font-bold text-[22px] text-zinc-950 mb-2 leading-tight"
            >
              Your EMI plan is ready.
            </h2>
            <p className="text-zinc-600 leading-relaxed text-[13.5px] mb-4">
              This assignment demo stops before payment. The {plan.tenureMonths}
              -month plan for {product.name} was selected successfully.
            </p>
            <button
              className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-5 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985] mt-3"
              type="button"
              onClick={onClose}
            >
              Back to product
            </button>
          </div>
        ) : (
          <>
            <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-600 text-xs font-semibold tracking-wider uppercase">
              Review selection
            </p>
            <h2
              id="checkout-title"
              className="font-heading font-bold text-[22px] text-zinc-950 mb-0 leading-tight"
            >
              Continue with this plan?
            </h2>
            <div className="flex items-center gap-3.5 my-4.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <img
                className="w-14 h-14 object-contain shrink-0"
                src={variant.imageUrl}
                alt=""
              />
              <div>
                <strong className="block text-sm font-semibold text-zinc-950">
                  {product.name}
                </strong>
                <span className="block mt-0.5 text-zinc-500 text-xs">
                  {variant.storage} · {variant.color}
                </span>
              </div>
            </div>
            <dl className="mb-5">
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200 text-[13px]">
                <dt className="text-zinc-600">Monthly payment</dt>
                <dd className="font-semibold text-zinc-950">
                  {formatCurrency(plan.monthlyAmount)}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200 text-[13px]">
                <dt className="text-zinc-600">Tenure</dt>
                <dd className="font-semibold text-zinc-950">
                  {plan.tenureMonths} months
                </dd>
              </div>
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200 text-[13px]">
                <dt className="text-zinc-600">Cashback</dt>
                <dd className="font-semibold text-emerald-700">
                  -{formatCurrency(plan.cashbackAmount)}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-4 pt-3 text-[15px]">
                <dt className="text-zinc-600">Effective cost</dt>
                <dd className="text-[17px] font-bold text-zinc-950">
                  {formatCurrency(plan.effectiveCost)}
                </dd>
              </div>
            </dl>
            <button
              className="w-full min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985]"
              type="button"
              onClick={() => setConfirmed(true)}
            >
              Confirm selection
            </button>
            <p className="mt-2.5 text-center text-zinc-500 text-[11px]">
              No payment or personal information is collected.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
