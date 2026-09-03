import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeIndianRupee,
  Check,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";

export function HomePage() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });
  const [searchParams] = useSearchParams();
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("featured");
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const products = productsQuery.data ?? [];
  const brands = useMemo(
    () => ["All", ...new Set(products.map((product) => product.brand))],
    [products],
  );
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesBrand = brand === "All" || product.brand === brand;
      const matchesQuery =
        !query ||
        `${product.brand} ${product.name}`.toLowerCase().includes(query);
      return matchesBrand && matchesQuery;
    });

    return [...filtered].sort((first, second) => {
      const firstPrice = first.variants[0]?.sellingPrice ?? 0;
      const secondPrice = second.variants[0]?.sellingPrice ?? 0;
      if (sort === "price-low") return firstPrice - secondPrice;
      if (sort === "price-high") return secondPrice - firstPrice;
      return Number(second.isFeatured) - Number(first.isFeatured);
    });
  }, [brand, products, query, sort]);

  const featured =
    products.find((product) => product.isFeatured) ?? products[0];
  const featuredVariant =
    featured?.variants.find((variant) => variant.isDefault) ??
    featured?.variants[0];
  const featuredPlan =
    featuredVariant?.emiPlans.find((plan) => plan.isRecommended) ??
    featuredVariant?.emiPlans[0];

  return (
    <main>
      {featured && featuredVariant && featuredPlan && (
        <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
          <section className="min-h-[400px] grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center overflow-hidden mt-4 sm:mt-6 border border-zinc-200 rounded-2xl sm:rounded-[20px] bg-zinc-50 shadow-xs">
            <div className="flex flex-col items-start p-6 sm:p-9 lg:p-[44px_52px]">
              <span className="inline-flex items-center gap-1.5 mb-4 py-1 px-2.5 border border-zinc-200 rounded-full bg-white text-zinc-600 text-xs font-medium shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{" "}
                2026 Flagship Showcase
              </span>
              <h1 className="font-heading font-bold text-[clamp(28px,3.8vw,46px)] text-zinc-950 leading-[1.12] tracking-tight mb-3">
                Great phones.
                <br />
                Smarter ways to pay.
              </h1>
              <p className="max-w-[480px] mb-5.5 text-zinc-600 text-[13.5px] sm:text-[14.5px] leading-relaxed">
                Compare six transparent EMI plans across top smartphones. Enjoy
                five no-cost options and instant cashbacks with zero surprises.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3.5 mb-5.5">
                <Link
                  className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985]"
                  to={`/products/${featured.slug}`}
                >
                  Explore {featured.name} <ArrowRight size={15} />
                </Link>
                <div className="flex items-center gap-2 py-2 px-3 border border-zinc-200 rounded-lg bg-white text-xs text-zinc-600 shadow-xs">
                  <span>
                    From{" "}
                    <strong className="text-zinc-950 font-bold">
                      {formatCurrency(featuredPlan.monthlyAmount)}/mo
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-[11px] font-semibold leading-tight whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
                    0% No-Cost
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-zinc-600 text-[12.5px] font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" /> 0%
                  Interest
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" /> Upfront
                  Cashback
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 shrink-0" />{" "}
                  Paperless Approval
                </span>
              </div>
            </div>
            <div className="group relative h-full min-h-[280px] sm:min-h-[360px] grid place-items-center m-3 rounded-2xl bg-white border border-zinc-200 overflow-hidden">
              <span className="absolute top-3.5 right-3.5 py-1 px-2.5 rounded-full bg-zinc-900 text-zinc-50 text-[11px] font-semibold shadow-xs">
                5 No-Cost Plans
              </span>
              <img
                className="w-[76%] sm:w-[72%] h-[76%] sm:h-[72%] object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-[1.02]"
                src={featuredVariant.imageUrl}
                alt={`${featured.name} product`}
              />
            </div>
          </section>
        </div>
      )}

      <section
        className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-[52px] pb-16 sm:pb-20"
        aria-labelledby="catalogue-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-6 mb-5.5">
          <div>
            <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
              Curated Flagships
            </p>
            <h2
              id="catalogue-title"
              className="font-heading font-bold text-[clamp(24px,2.8vw,32px)] text-zinc-950 mb-1 leading-tight tracking-tight"
            >
              {query ? `Results for “${query}”` : "Explore Flagships"}
            </h2>
            <p className="text-zinc-500 text-sm mb-0">
              {visibleProducts.length} smartphones available · Compare
              transparent tenure & cashback
            </p>
          </div>
          <label className="flex items-center gap-2 text-zinc-600 text-[13px] font-medium max-sm:w-full max-sm:justify-between">
            <span>Sort by</span>
            <select
              className="h-[38px] border border-zinc-200 rounded-lg pr-8 pl-3 bg-white text-zinc-950 font-medium text-[13px] cursor-pointer shadow-xs outline-none focus:border-zinc-900"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div
          className="inline-flex gap-1 p-1 rounded-[10px] bg-zinc-100 border border-zinc-200 mb-6 overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Filter products by brand"
        >
          {brands.map((item) => (
            <button
              key={item}
              type="button"
              className={`min-h-8 border-0 rounded-[7px] px-3.5 text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all ${
                brand === item
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950"
              }`}
              onClick={() => setBrand(item)}
              aria-pressed={brand === item}
            >
              {item}
            </button>
          ))}
        </div>

        {productsQuery.isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Loading products"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="h-[480px] rounded-2xl bg-zinc-200 animate-pulse"
                key={index}
              />
            ))}
          </div>
        )}

        {productsQuery.isError && (
          <div className="py-16 px-6 text-center border border-zinc-200 rounded-2xl bg-white shadow-xs">
            <h2 className="font-heading font-bold text-xl text-zinc-950 mb-2">
              We couldn't load the store.
            </h2>
            <p className="text-zinc-600 text-sm mb-4">
              {productsQuery.error.message}
            </p>
            <button
              className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985]"
              type="button"
              onClick={() => productsQuery.refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {!productsQuery.isLoading &&
          !productsQuery.isError &&
          visibleProducts.length === 0 && (
            <div className="py-16 px-6 text-center border border-zinc-200 rounded-2xl bg-white shadow-xs">
              <h2 className="font-heading font-bold text-xl text-zinc-950 mb-2">
                No matching phones
              </h2>
              <p className="text-zinc-600 text-sm mb-4">
                Try another brand or a shorter search.
              </p>
              <button
                className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap border border-zinc-200 bg-white text-zinc-900 shadow-xs hover:bg-zinc-100 hover:border-zinc-300 transition-all active:scale-[0.985]"
                type="button"
                onClick={() => setBrand("All")}
              >
                Show all brands
              </button>
            </div>
          )}

        {visibleProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </section>

      <section
        className="py-12 sm:py-[72px] border-t border-zinc-200 bg-zinc-50"
        id="how-it-works"
      >
        <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[580px] mb-8">
            <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
              Built for clarity
            </p>
            <h2 className="font-heading font-bold text-[clamp(26px,3.2vw,36px)] text-zinc-950 leading-tight tracking-tight">
              Know the real cost before checkout.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="p-6 border border-zinc-200 rounded-[14px] bg-white shadow-xs">
              <span className="w-10 h-10 grid place-items-center mb-5 rounded-lg bg-zinc-100 text-zinc-950 border border-zinc-200">
                <BadgeIndianRupee size={20} />
              </span>
              <strong className="block mb-1.5 font-heading font-semibold text-base leading-snug text-zinc-950">
                Compare the monthlies
              </strong>
              <p className="mb-0 text-zinc-600 text-[13px] leading-relaxed">
                Six plans are attached to each variant, including five at 0%
                interest.
              </p>
            </article>
            <article className="p-6 border border-zinc-200 rounded-[14px] bg-white shadow-xs">
              <span className="w-10 h-10 grid place-items-center mb-5 rounded-lg bg-zinc-100 text-zinc-950 border border-zinc-200">
                <RefreshCcw size={20} />
              </span>
              <strong className="block mb-1.5 font-heading font-semibold text-base leading-snug text-zinc-950">
                See cashback separately
              </strong>
              <p className="mb-0 text-zinc-600 text-[13px] leading-relaxed">
                Your monthly payment stays honest while cashback lowers the
                effective cost.
              </p>
            </article>
            <article className="p-6 border border-zinc-200 rounded-[14px] bg-white shadow-xs">
              <span className="w-10 h-10 grid place-items-center mb-5 rounded-lg bg-zinc-100 text-zinc-950 border border-zinc-200">
                <ShieldCheck size={20} />
              </span>
              <strong className="block mb-1.5 font-heading font-semibold text-base leading-snug text-zinc-950">
                Choose with confidence
              </strong>
              <p className="mb-0 text-zinc-600 text-[13px] leading-relaxed">
                Total payable and effective cost are visible before you
                continue.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
