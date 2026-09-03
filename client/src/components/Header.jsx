import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/?q=${encodeURIComponent(trimmedQuery)}` : "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/92 backdrop-blur-md">
      <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[58px] sm:min-h-16 grid grid-cols-[auto_1fr] lg:grid-cols-[auto_minmax(260px,480px)_auto] items-center gap-3 sm:gap-7">
        <Link
          className="inline-flex items-center gap-2 font-heading font-bold text-lg leading-none tracking-tight text-zinc-950"
          to="/"
          aria-label="Cartyy home"
        >
          <span className="w-7 h-7 grid place-items-center rounded-[7px] bg-zinc-900 text-zinc-50 text-sm font-bold">
            C
          </span>
          <span className="hidden sm:inline text-zinc-950 font-bold">
            cartyy
          </span>
        </Link>

        <form
          className="h-9 sm:h-[38px] flex items-center gap-2 pl-3 pr-1 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-500 transition-all focus-within:border-zinc-900 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-900"
          role="search"
          onSubmit={submitSearch}
        >
          <Search size={18} aria-hidden="true" className="shrink-0" />
          <input
            className="w-full min-w-0 border-0 outline-none bg-transparent text-zinc-950 text-[13px] placeholder:text-zinc-400"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search iPhone, Galaxy, vivo, OnePlus…"
            aria-label="Search phones"
          />
          <button
            type="submit"
            className="hidden sm:inline-flex h-7 items-center border border-zinc-200 rounded-md px-2.5 bg-white text-zinc-950 text-xs font-medium shadow-xs hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <nav
          className="hidden lg:flex items-center justify-end gap-5 text-zinc-600 text-[13px] font-medium"
          aria-label="Main navigation"
        >
          <Link to="/" className="hover:text-zinc-950 transition-colors">
            Catalogue
          </Link>
          <Link
            to="/#how-it-works"
            className="hover:text-zinc-950 transition-colors"
          >
            How EMI Works
          </Link>
        </nav>
      </div>
    </header>
  );
}
