import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  Info,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckoutDialog } from "../components/CheckoutDialog";
import { api } from "../lib/api";
import { calculateSavings, formatCurrency } from "../lib/format";

export function ProductPage() {
  const { slug = "" } = useParams();
  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.getProduct(slug),
  });
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const product = productQuery.data;
  const selectedVariant = useMemo(
    () =>
      product?.variants.find((variant) => variant.id === selectedVariantId) ??
      product?.variants[0],
    [product, selectedVariantId],
  );
  const selectedPlan = useMemo(
    () =>
      selectedVariant?.emiPlans.find((plan) => plan.id === selectedPlanId) ??
      selectedVariant?.emiPlans.find((plan) => plan.isRecommended) ??
      selectedVariant?.emiPlans[0],
    [selectedPlanId, selectedVariant],
  );

  useEffect(() => {
    if (!product || selectedVariantId) return;
    const defaultVariant =
      product.variants.find((variant) => variant.isDefault) ??
      product.variants[0];
    setSelectedVariantId(defaultVariant.id);
  }, [product, selectedVariantId]);

  useEffect(() => {
    if (!selectedVariant) return;
    const recommended =
      selectedVariant.emiPlans.find((plan) => plan.isRecommended) ??
      selectedVariant.emiPlans[0];
    setSelectedPlanId(recommended.id);
  }, [selectedVariant]);

  if (productQuery.isLoading) {
    return (
      <main className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-11">
          <div className="min-h-[500px] rounded-2xl bg-zinc-200 animate-pulse" />
          <div className="min-h-[500px] rounded-2xl bg-zinc-200 animate-pulse" />
        </div>
      </main>
    );
  }

  if (productQuery.isError || !product || !selectedVariant || !selectedPlan) {
    return (
      <main className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[calc(100vh-108px)] flex flex-col items-start justify-center py-12">
        <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
          Product unavailable
        </p>
        <h1 className="font-heading font-bold text-[clamp(28px,4vw,42px)] text-zinc-950 mb-2 leading-tight tracking-tight">
          That phone isn’t on this shelf.
        </h1>
        <p className="text-zinc-600 mb-0">
          {productQuery.error?.message ??
            "Return to the store and choose another product."}
        </p>
        <Link
          className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985] mt-3.5"
          to="/"
        >
          <ArrowLeft size={17} /> Back to phones
        </Link>
      </main>
    );
  }

  const colours = [
    ...new Map(
      product.variants.map((variant) => [variant.color, variant]),
    ).values(),
  ];
  const storages = [
    ...new Set(product.variants.map((variant) => variant.storage)),
  ];
  const savings = calculateSavings(
    selectedVariant.mrp,
    selectedVariant.sellingPrice,
  );
  const lowestPrice = Math.min(
    ...product.variants.map((variant) => variant.sellingPrice),
  );

  const chooseColour = (colour) => {
    const matchingVariant =
      product.variants.find(
        (variant) =>
          variant.color === colour &&
          variant.storage === selectedVariant.storage,
      ) ?? product.variants.find((variant) => variant.color === colour);
    if (matchingVariant) setSelectedVariantId(matchingVariant.id);
  };

  const chooseStorage = (storage) => {
    const matchingVariant =
      product.variants.find(
        (variant) =>
          variant.storage === storage &&
          variant.color === selectedVariant.color,
      ) ?? product.variants.find((variant) => variant.storage === storage);
    if (matchingVariant) setSelectedVariantId(matchingVariant.id);
  };

  return (
    <main className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
      <nav
        className="min-h-[52px] flex items-center gap-1.5 text-zinc-500 text-xs font-medium overflow-hidden whitespace-nowrap"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-zinc-950 transition-colors">
          Phones
        </Link>
        <ChevronRight size={14} className="shrink-0" />
        <span>{product.brand}</span>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-zinc-900 font-semibold truncate">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)] items-start gap-6 lg:gap-11 pt-0 sm:pt-2 pb-24">
        <section
          className="static lg:sticky lg:top-[88px]"
          aria-label={`${product.name} gallery`}
        >
          <div className="relative min-h-[350px] sm:min-h-[480px] lg:min-h-[560px] grid place-items-center overflow-hidden border border-zinc-200 rounded-2xl lg:rounded-[20px] bg-zinc-50 shadow-xs">
            <img
              className="w-[84%] lg:w-[80%] h-[84%] lg:h-[80%] object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)]"
              src={selectedVariant.imageUrl}
              alt={`${product.name} in ${selectedVariant.color}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            <span className="min-h-11 flex items-center justify-center gap-2 border border-zinc-200 rounded-xl bg-white text-zinc-600 text-xs font-medium shadow-xs">
              <PackageCheck size={17} className="text-zinc-950" /> Genuine brand
              warranty
            </span>
            <span className="min-h-11 flex items-center justify-center gap-2 border border-zinc-200 rounded-xl bg-white text-zinc-600 text-xs font-medium shadow-xs">
              <ShieldCheck size={17} className="text-zinc-950" /> 100% paperless
              approval
            </span>
          </div>
        </section>

        <section className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[11px] font-semibold leading-tight whitespace-nowrap bg-zinc-100 text-zinc-900 border border-zinc-200">
              New arrival
            </span>
          </div>
          <p className="mb-1 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
            {product.brand}
          </p>
          <h1 className="font-heading font-bold text-[28px] sm:text-[clamp(30px,3.5vw,42px)] text-zinc-950 mb-2.5 leading-tight tracking-tight">
            {product.name}
          </h1>
          <p className="mb-5 text-zinc-600 text-[13px] sm:text-[14.5px] leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline flex-wrap gap-2.5 pb-5">
            <strong className="font-heading font-bold text-[26px] text-zinc-950 leading-none">
              {formatCurrency(selectedVariant.sellingPrice)}
            </strong>
            <s className="text-zinc-400 text-sm">
              {formatCurrency(selectedVariant.mrp)}
            </s>
            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[11px] font-semibold leading-tight whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
              Save {formatCurrency(savings.amount)}
            </span>
          </div>

          <section
            className="py-5 border-t border-zinc-200"
            aria-labelledby="color-heading"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 id="color-heading" className="font-semibold text-sm text-zinc-950 m-0">
                Color
              </h2>
              <span className="text-zinc-600 text-[13px] font-medium">
                {selectedVariant.color}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colours.map((variant) => {
                const isSelected = variant.color === selectedVariant.color;
                return (
                  <button
                    key={variant.color}
                    type="button"
                    className="min-w-[60px] grid justify-items-center gap-1.5 p-1 bg-transparent text-zinc-600 cursor-pointer"
                    onClick={() => chooseColour(variant.color)}
                    aria-label={`Choose ${variant.color}`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`w-8 h-8 rounded-full border border-black/15 transition-all ${
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 shadow-sm"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <small
                      className={`text-[11px] ${
                        isSelected
                          ? "text-zinc-950 font-semibold"
                          : "text-zinc-500 font-medium"
                      }`}
                    >
                      {variant.color}
                    </small>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="py-5 border-t border-zinc-200"
            aria-labelledby="storage-heading"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 id="storage-heading" className="font-semibold text-sm text-zinc-950 m-0">
                Storage
              </h2>
              <span className="text-zinc-600 text-[13px] font-medium">
                Choose the space you need
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {storages.map((storage) => {
                const variant =
                  product.variants.find(
                    (item) =>
                      item.storage === storage &&
                      item.color === selectedVariant.color,
                  ) ??
                  product.variants.find((item) => item.storage === storage);
                const difference = variant.sellingPrice - lowestPrice;
                const isSelected = storage === selectedVariant.storage;
                return (
                  <button
                    key={storage}
                    type="button"
                    className={`min-h-16 grid place-items-center gap-0.5 rounded-xl cursor-pointer shadow-xs transition-all ${
                      isSelected
                        ? "border-2 border-zinc-900 bg-zinc-50 p-[calc(1rem-1px)]"
                        : "border border-zinc-200 bg-white text-zinc-950 hover:border-zinc-300"
                    }`}
                    onClick={() => chooseStorage(storage)}
                    aria-pressed={isSelected}
                  >
                    <strong className="text-sm font-semibold">
                      {storage}
                    </strong>
                    <small
                      className={`text-[11px] ${
                        isSelected
                          ? "text-zinc-600 font-medium"
                          : "text-zinc-500"
                      }`}
                    >
                      {difference > 0
                        ? `+${formatCurrency(difference)}`
                        : "Included"}
                    </small>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="mt-3 p-3.5 sm:p-5 border border-zinc-200 rounded-[14px] sm:rounded-2xl bg-white shadow-xs"
            aria-labelledby="emi-heading"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4">
              <div>
                <h2 id="emi-heading" className="font-heading font-bold text-base text-zinc-950 mb-0.5">
                  Choose your EMI plan
                </h2>
                <p className="text-zinc-500 text-xs mb-0">
                  Cashback does not reduce the monthly shown.
                </p>
              </div>
              <span className="flex items-center gap-1 text-zinc-600 text-[11px] font-medium whitespace-nowrap">
                <ShieldCheck size={14} className="shrink-0" /> Secure selection
              </span>
            </div>

            <div
              className="grid gap-2"
              role="radiogroup"
              aria-label="EMI plans"
            >
              {selectedVariant.emiPlans.map((plan) => {
                const isSelected = plan.id === selectedPlan.id;
                return (
                  <label
                    className={`relative min-h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 sm:px-3.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-2 border-zinc-900 bg-white shadow-xs"
                        : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                    key={plan.id}
                  >
                    <input
                      type="radio"
                      name="emi-plan"
                      checked={isSelected}
                      onChange={() => setSelectedPlanId(plan.id)}
                      className="absolute opacity-0 pointer-events-none"
                    />
                    <span
                      className={`w-[18px] h-[18px] rounded-full transition-all ${
                        isSelected
                          ? "border-[5px] border-zinc-900"
                          : "border-[1.5px] border-zinc-300"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="grid gap-0.5">
                      <strong className="text-[13.5px] font-semibold text-zinc-950">
                        {plan.tenureMonths} months
                      </strong>
                      <small className="text-emerald-700 text-[11px] font-semibold">
                        {formatCurrency(plan.cashbackAmount)} cashback
                      </small>
                    </span>
                    <span className="grid gap-0.5 text-right">
                      <strong className="font-heading font-bold text-[15px] leading-tight text-zinc-950">
                        {formatCurrency(plan.monthlyAmount)}
                        <small className="font-sans font-medium text-[11px] text-zinc-500 ml-0.5">
                          /mo
                        </small>
                      </strong>
                      <small className="justify-self-end py-0.5 px-1.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-semibold">
                        {plan.isNoCost
                          ? "0% interest"
                          : `${plan.interestRate}% p.a.`}
                      </small>
                    </span>
                    {plan.isRecommended && (
                      <span className="absolute -top-2 left-9 sm:left-11 py-0.5 px-2 rounded-full bg-zinc-900 text-zinc-50 text-[9px] font-semibold tracking-wider uppercase shadow-xs">
                        Recommended
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="mt-3 p-3.5 border border-zinc-200 rounded-xl bg-zinc-50">
              <div className="flex items-center justify-between gap-4 py-1.5 text-zinc-600 text-[13px] font-medium">
                <span>Total payable</span>
                <strong className="text-zinc-950 text-[13.5px] font-semibold">
                  {formatCurrency(selectedPlan.totalPayable)}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4 py-1.5 text-zinc-600 text-[13px] font-medium">
                <span>Plan cashback</span>
                <strong className="text-emerald-700 text-[13.5px] font-semibold">
                  -{formatCurrency(selectedPlan.cashbackAmount)}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4 mt-1.5 pt-2.5 border-t border-zinc-200 text-zinc-950 font-medium text-[13px]">
                <span>Effective cost</span>
                <strong className="font-heading font-bold text-[17px] text-zinc-950">
                  {formatCurrency(selectedPlan.effectiveCost)}
                </strong>
              </div>
            </div>

            <button
              className="hidden sm:inline-flex mt-3.5 w-full h-[46px] items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-sm cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985]"
              type="button"
              onClick={() => setShowCheckout(true)}
            >
              Continue with {formatCurrency(selectedPlan.monthlyAmount)}/month{" "}
              <ChevronRight size={18} />
            </button>
            <p className="hidden sm:flex items-center justify-center gap-1.5 mt-2.5 text-zinc-500 text-[11px]">
              <Info size={13} className="shrink-0" /> Eligibility is checked
              before payment. No hidden amount is added here.
            </p>
          </section>
        </section>
      </div>

      <div className="fixed sm:hidden z-50 inset-x-0 bottom-0 min-h-[68px] flex items-center justify-between gap-3.5 px-4.5 py-2.5 border-t border-zinc-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="grid gap-0.5">
          <span className="text-zinc-500 text-[10px]">
            {selectedPlan.tenureMonths}-month plan
          </span>
          <strong className="font-heading font-bold text-[15px] leading-none text-zinc-950">
            {formatCurrency(selectedPlan.monthlyAmount)}/mo
          </strong>
        </div>
        <button
          type="button"
          className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-5 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985]"
          onClick={() => setShowCheckout(true)}
        >
          Continue
        </button>
      </div>

      {showCheckout && (
        <CheckoutDialog
          product={product}
          variant={selectedVariant}
          plan={selectedPlan}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
}
