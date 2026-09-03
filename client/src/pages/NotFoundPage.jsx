import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[calc(100vh-108px)] flex flex-col items-start justify-center py-12">
      <p className="inline-flex items-center gap-1.5 mb-2 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
        404
      </p>
      <h1 className="font-heading font-bold text-[clamp(28px,4vw,42px)] text-zinc-950 mb-2 leading-tight tracking-tight">
        This page is out of stock.
      </h1>
      <p className="text-zinc-600 mb-0">The phone store is still open.</p>
      <Link
        className="min-h-10 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 font-semibold text-[13.5px] cursor-pointer whitespace-nowrap bg-zinc-900 text-zinc-50 border border-zinc-900 shadow-xs hover:bg-zinc-800 transition-all active:scale-[0.985] mt-3.5"
        to="/"
      >
        <ArrowLeft size={17} /> Back to phones
      </Link>
    </main>
  );
}
