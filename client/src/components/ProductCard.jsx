import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateSavings, formatCurrency } from "../lib/format";

export function ProductCard({ product }) {
  const variant =
    product.variants.find((item) => item.isDefault) ?? product.variants[0];
  const recommendedPlan =
    variant.emiPlans.find((plan) => plan.isRecommended) ?? variant.emiPlans[0];
  const savings = calculateSavings(variant.mrp, variant.sellingPrice);
  const storageCount = new Set(product.variants.map((item) => item.storage))
    .size;
  const colourCount = new Set(product.variants.map((item) => item.color)).size;
  const optionLabel = (count, singular, plural) =>
    `${count} ${count === 1 ? singular : plural}`;

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((item) => [item.color, item.colorHex]),
    ).entries(),
  ).map(([name, hex]) => ({ name, hex }));

  return (
    <article className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all">
      <Link
        className="relative h-[260px] sm:h-[250px] grid place-items-center m-2 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden"
        to={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        {product.isFeatured && (
          <span className="absolute top-2.5 left-2.5 py-[3px] px-2 border border-zinc-200 rounded-md bg-white text-zinc-950 text-[10.5px] font-semibold shadow-xs">
            Popular Choice
          </span>
        )}
        <img
          className="w-[78%] h-[78%] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          src={variant.imageUrl}
          alt={`${product.name} product`}
        />
      </Link>
      <div className="pt-2.5 px-4.5 pb-4.5 flex flex-col grow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-zinc-500 text-[11px] font-semibold tracking-wider uppercase">
            {product.brand}
          </span>
          <div
            className="flex items-center gap-1"
            title={`${colourCount} colors`}
          >
            {uniqueColors.map((col) => (
              <span
                key={col.name}
                className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="font-heading font-semibold text-[17px] text-zinc-950 mb-1 group-hover:text-zinc-900 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 text-zinc-500 text-xs">
          {optionLabel(storageCount, "storage option", "storage options")} ·{" "}
          {optionLabel(colourCount, "color", "colors")}
        </p>
        <div className="flex items-baseline flex-wrap gap-2">
          <strong className="font-heading font-bold text-lg leading-none text-zinc-950">
            {formatCurrency(variant.sellingPrice)}
          </strong>
          <s className="text-zinc-400 text-xs">
            {formatCurrency(variant.mrp)}
          </s>
          <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[11px] font-semibold leading-tight whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
            Save {formatCurrency(savings.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-3.5 p-2.5 sm:px-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="grid gap-0.5">
            <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wide">
              {recommendedPlan.tenureMonths}-Mo EMI
            </span>
            <strong className="font-heading font-bold text-sm text-zinc-950 leading-tight">
              {formatCurrency(recommendedPlan.monthlyAmount)}
              <small className="text-[10px] font-normal text-zinc-500">
                /mo
              </small>
            </strong>
          </div>
          <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[11px] font-semibold leading-tight whitespace-nowrap bg-zinc-100 text-zinc-900 border border-zinc-200">
            {recommendedPlan.isNoCost
              ? "0% Interest"
              : `${recommendedPlan.interestRate}%`}
          </span>
        </div>
        <div className="mt-3.5">
          <Link
            className="w-full min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap border border-zinc-200 bg-white text-zinc-900 shadow-xs hover:bg-zinc-100 hover:border-zinc-300 transition-all active:scale-[0.985]"
            to={`/products/${product.slug}`}
          >
            Configure Plan <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
