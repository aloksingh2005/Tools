import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clock3,
  Copy,
  Download,
  Image as ImageIcon,
  Lock,
  Moon,
  Shield,
  Sun,
  Trash2,
  UploadCloud,
} from "lucide-react";
import UploadWidget from "./components/UploadWidget";
import { TransferHistoryItem, TransferSession } from "./types";

const THEME_KEY = "snapshare_theme";

type RouteState =
  | { page: "home" }
  | { page: "share"; id: string }
  | { page: "expired" };

function parseRoute(pathname: string): RouteState {
  const match = pathname.match(/^\/share\/([^/]+)/);
  if (match) return { page: "share", id: match[1] };
  if (pathname === "/expired") return { page: "expired" };
  return { page: "home" };
}

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [route, setRoute] = useState<RouteState>(() => parseRoute(window.location.pathname));
  const [toast, setToast] = useState<string | null>(null);

  const [history, setHistory] = useState<TransferHistoryItem[]>([]);

  const [share, setShare] = useState<TransferSession | null>(null);
  const [loadingShare, setLoadingShare] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
  };

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.add("theme-ease");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const syncHistory = () => {
      const raw = localStorage.getItem("snapshare_history");
      if (!raw) return setHistory([]);
      try {
        const parsed = JSON.parse(raw) as TransferHistoryItem[];
        setHistory(parsed.filter((x) => x.expiresAt > Date.now()));
      } catch {
        setHistory([]);
      }
    };

    syncHistory();
    const timer = window.setInterval(syncHistory, 10000);
    return () => window.clearInterval(timer);
  }, [route.page]);

  const fetchShare = async (id: string) => {
    setLoadingShare(true);
    setPasswordError("");
    try {
      const res = await fetch(`/api/share/${id}`, { credentials: "include" });
      const data = await res.json();
      if (res.status === 401) {
        setPasswordRequired(true);
        setShare(null);
        return;
      }
      if (!res.ok) {
        navigateTo("/expired");
        return;
      }
      setPasswordRequired(false);
      setShare(data as TransferSession);
      setActiveImageIndex(0);
    } catch {
      navigateTo("/expired");
    } finally {
      setLoadingShare(false);
    }
  };

  useEffect(() => {
    if (route.page !== "share") {
      setShare(null);
      setPasswordRequired(false);
      setPasswordInput("");
      return;
    }
    fetchShare(route.id);
  }, [route.page === "share" ? route.id : route.page]);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (route.page !== "share") return;
    setPasswordError("");
    const res = await fetch(`/api/share/${route.id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password: passwordInput }),
    });

    if (!res.ok) {
      setPasswordError("Incorrect password. Please try again.");
      return;
    }

    await fetchShare(route.id);
  };

  const removeTransfer = async () => {
    if (route.page !== "share") return;
    if (!window.confirm("Delete this transfer now?")) return;

    const res = await fetch(`/api/share/${route.id}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput || undefined }),
      credentials: "include",
    });

    if (!res.ok) {
      showToast("Unable to delete this transfer");
      return;
    }

    showToast("Transfer deleted");
    navigateTo("/");
  };

  const remainingText = useMemo(() => {
    if (!share) return "";
    const ms = share.expiresAt - Date.now();
    if (ms <= 0) return "Expired";
    const minutes = Math.floor(ms / 60000);
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  }, [share, Date.now()]);

  return (
    <div className="min-h-screen gradient-hero">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={() => navigateTo("/")} className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">S</span>
            SnapShare
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => navigateTo("/")} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              New Upload
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {route.page === "home" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section className="premium-card p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Share sensitive files with confidence</h1>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">Password gates, expiry controls, one-time view, and polished recipient UX.</p>
                </div>
                <UploadCloud className="hidden h-10 w-10 text-blue-600 md:block" />
              </div>
              <UploadWidget onUploadSuccess={(id) => navigateTo(`/share/${id}`)} />
            </section>

            {!!history.length && (
              <section className="premium-card p-5">
                <h2 className="mb-4 font-display text-lg font-bold">Recent transfers</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {history.map((item) => (
                    <button key={item.id} onClick={() => navigateTo(`/share/${item.id}`)} className="rounded-xl border border-slate-200 bg-white/80 p-4 text-left hover:border-blue-400 dark:border-slate-800 dark:bg-slate-950/70">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">/share/{item.id}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.imagesCount} files • {item.passwordProtected ? "Password" : "No password"}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {route.page === "share" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {loadingShare && <div className="premium-card p-8 text-center text-sm">Loading transfer...</div>}

            {!loadingShare && passwordRequired && (
              <div className="mx-auto max-w-md premium-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600"><Lock className="h-5 w-5" /></div>
                <h2 className="font-display text-2xl font-bold">Password required</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">This transfer is protected. Enter the password to continue.</p>
                <form onSubmit={submitPassword} className="mt-4 space-y-3">
                  <input autoFocus type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-950" placeholder="Enter password" />
                  {!!passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                  <button type="submit" className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">Unlock transfer</button>
                </form>
              </div>
            )}

            {!loadingShare && share && (
              <div className="grid gap-6 lg:grid-cols-12">
                <section className="premium-card lg:col-span-8 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{share.images.length} assets</p>
                    <p className="text-xs text-slate-500">Expires in {remainingText}</p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80">
                    <img src={`/api/share/${share.id}/image/${share.images[activeImageIndex]?.id}`} alt={share.images[activeImageIndex]?.name} className="max-h-[70vh] w-full object-contain" />
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {share.images.map((img, index) => (
                      <button key={img.id} onClick={() => setActiveImageIndex(index)} className={`aspect-square overflow-hidden rounded-lg border ${index === activeImageIndex ? "border-blue-500" : "border-slate-200 dark:border-slate-800"}`}>
                        <img src={`/api/share/${share.id}/image/${img.id}`} alt={img.name} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </section>

                <aside className="space-y-4 lg:col-span-4">
                  <div className="premium-card p-4">
                    <h3 className="font-display text-lg font-bold">Actions</h3>
                    <div className="mt-3 space-y-2">
                      <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${share.id}`).then(() => showToast("Share link copied"))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950">
                        <Copy className="h-4 w-4" /> Copy share link
                      </button>
                      {share.allowDownload && (
                        <a href={`/api/share/${share.id}/image/${share.images[activeImageIndex]?.id}?download=true`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                          <Download className="h-4 w-4" /> Download current file
                        </a>
                      )}
                      <button onClick={removeTransfer} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">
                        <Trash2 className="h-4 w-4" /> Delete transfer
                      </button>
                    </div>
                  </div>

                  <div className="premium-card p-4 text-sm text-slate-600 dark:text-slate-300">
                    <h4 className="mb-2 font-display text-base font-bold text-slate-800 dark:text-slate-100">Security profile</h4>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-500" /> Password protected: {passwordRequired ? "Yes" : "Verified"}</p>
                      <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-500" /> Auto-expiry enabled</p>
                      <p className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-blue-500" /> One-time view: {share.oneTimeView ? "On" : "Off"}</p>
                      <p className="flex items-center gap-2"><Download className="h-4 w-4 text-blue-500" /> Downloads: {share.allowDownload ? "Allowed" : "Disabled"}</p>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        )}

        {route.page === "expired" && (
          <div className="mx-auto max-w-lg premium-card p-8 text-center">
            <h2 className="font-display text-3xl font-bold">Transfer expired</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">The link is no longer active or the transfer was deleted.</p>
            <button onClick={() => navigateTo("/")} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700">Create a new transfer</button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/70 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 md:flex-row">
          <p>SnapShare · Secure ephemeral transfer platform</p>
          <p className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> Launch-ready UX baseline</p>
        </div>
      </footer>
    </div>
  );
}
