import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Save, FileDown, Link2, Check, AlertCircle, Trash2, Sparkles } from "lucide-react";
import { StarBadge } from "../../brand/StarBadge";
import { useApp } from "../../store/useApp";
import { COMMUNITIES, CATEGORIES } from "../../data/types";

/* ─────────── Modelo ─────────── */

interface Kit {
  name: string;
  bio: string;
  style: string;
  community: string;
  instagram: string;
  gallery: string;
  media: string;
  email: string;
  whatsapp: string;
  fee: string;
  rider: string;
}

const EMPTY: Kit = {
  name: "",
  bio: "",
  style: CATEGORIES[0],
  community: COMMUNITIES[0],
  instagram: "",
  gallery: "",
  media: "",
  email: "",
  whatsapp: "",
  fee: "",
  rider: "",
};

/** Só estes contam pra completude (selects já vêm preenchidos; fee/rider são opcionais) */
const SCORED: (keyof Kit)[] = [
  "name", "bio", "instagram", "gallery", "media", "email", "whatsapp",
];

const STEPS = [
  { label: "Bio & Redes", fields: ["name", "bio", "style", "community", "instagram"] },
  { label: "Galeria & Mídia", fields: ["gallery", "media"] },
  { label: "Contato & Rider", fields: ["email", "whatsapp", "fee", "rider"] },
] as const;

const STORE_KEY = "unefica:mediakit:v1";
const MIN_BIO = 80;

/* ─────────── Validação ─────────── */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
const isPhone = (v: string) => /^\d{12,13}$/.test(v.replace(/\D/g, ""));
const isUrl = (v: string) => /^https?:\/\/.+\..+/i.test(v.trim());

function validate(kit: Kit): Partial<Record<keyof Kit, string>> {
  const e: Partial<Record<keyof Kit, string>> = {};
  if (kit.name.trim() && kit.name.trim().length < 2) e.name = "Nome muito curto.";
  if (kit.bio.trim() && kit.bio.trim().length < MIN_BIO)
    e.bio = `Escreva ao menos ${MIN_BIO} caracteres (faltam ${MIN_BIO - kit.bio.trim().length}).`;
  if (kit.instagram.trim() && !isUrl(kit.instagram)) e.instagram = "Use o link completo (https://...).";
  if (kit.media.trim() && !isUrl(kit.media)) e.media = "Use o link completo (https://...).";
  if (kit.email.trim() && !isEmail(kit.email)) e.email = "E-mail inválido.";
  if (kit.whatsapp.trim() && !isPhone(kit.whatsapp))
    e.whatsapp = "Use DDI + DDD + número: 5581999990000.";
  return e;
}

const slugify = (v: string) =>
  v.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ─────────── Persistência ─────────── */

function loadDraft(): { kit: Kit; savedAt: string | null } {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { kit: EMPTY, savedAt: null };
    const p = JSON.parse(raw);
    return { kit: { ...EMPTY, ...p.kit }, savedAt: p.savedAt ?? null };
  } catch {
    return { kit: EMPTY, savedAt: null };
  }
}

/* ─────────── Componente ─────────── */

export default function MediaKit() {
  const initial = useRef(loadDraft()).current;
  const [step, setStep] = useState(0);
  const [kit, setKit] = useState<Kit>(initial.kit);
  const [touched, setTouched] = useState<Partial<Record<keyof Kit, boolean>>>({});
  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const setKitProgress = useApp((s) => s.setKitProgress);

  const errors = useMemo(() => validate(kit), [kit]);
  const pct = useMemo(
    () => Math.round((SCORED.filter((k) => kit[k].trim() && !errors[k]).length / SCORED.length) * 100),
    [kit, errors],
  );

  useEffect(() => setKitProgress(pct), [pct, setKitProgress]);

  /* Autosave com debounce — nunca mais perder rascunho */
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        localStorage.setItem(STORE_KEY, JSON.stringify({ kit, savedAt }));
        setSavedAt(savedAt);
        setDirty(false);
      } catch {
        /* modo privado */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [kit, dirty]);

  /* Avisa antes de sair com alterações pendentes */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback(
    (k: keyof Kit) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setKit((s) => ({ ...s, [k]: e.target.value }));
        setDirty(true);
      },
    [],
  );

  const blur = (k: keyof Kit) => () => setTouched((s) => ({ ...s, [k]: true }));
  const err = (k: keyof Kit) => (touched[k] ? errors[k] : undefined);

  const flash = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const saveNow = () => {
    try {
      const at = new Date().toISOString();
      localStorage.setItem(STORE_KEY, JSON.stringify({ kit, savedAt: at }));
      setSavedAt(at);
      setDirty(false);
      flash("Rascunho salvo neste navegador!");
    } catch {
      flash("Não foi possível salvar (modo privado?).", "err");
    }
  };

  const reset = () => {
    if (!confirm("Apagar todo o rascunho? Isso não pode ser desfeito.")) return;
    localStorage.removeItem(STORE_KEY);
    setKit(EMPTY);
    setTouched({});
    setSavedAt(null);
    setStep(0);
    flash("Rascunho apagado.");
  };

  /* Imprime só o card (a tela toda virava PDF antes) */
  const exportPdf = () => {
    document.body.classList.add("printing-kit");
    const done = () => document.body.classList.remove("printing-kit");
    window.addEventListener("afterprint", done, { once: true });
    window.print();
    setTimeout(done, 1500); // fallback p/ Safari
  };

  const slug = slugify(kit.name) || "meu-perfil";

  const publicLink = async () => {
    const url = `${location.origin}/artista/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Link público copiado!");
    } catch {
      flash(url, "err");
    }
  };

  const images = useMemo(
    () => kit.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
    [kit.gallery],
  );

  const stepDone = (i: number) =>
    STEPS[i].fields.some((f) => kit[f as keyof Kit].trim()) &&
    !STEPS[i].fields.some((f) => errors[f as keyof Kit]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <style>{`
        @media print {
          body.printing-kit > *:not(:has(#kit-print)) { display: none !important; }
          body.printing-kit #kit-print { position: fixed; inset: 0; margin: 0; border-radius: 0; box-shadow: none; }
          body.printing-kit .no-print { display: none !important; }
        }
      `}</style>

      <h1 className="display text-3xl text-night sm:text-4xl">Gerador de Media Kit</h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />
      <p className="mt-4 max-w-2xl text-night/70">
        Seu portfólio profissional pronto para enviar a contratantes e editais.
      </p>

      {/* Progresso + status de salvamento */}
      <div className="mt-6 max-w-md">
        <div className="flex justify-between text-sm font-bold">
          <span>Completude</span>
          <span className={pct === 100 ? "text-emerald-600" : "text-une"}>{pct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completude do Media Kit"
          className="mt-2 h-3 overflow-hidden rounded-full bg-night/10"
        >
          <div
            className={`h-full transition-[width] duration-500 ${
              pct === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-une to-sun"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-night/50" aria-live="polite">
          {dirty
            ? "Salvando…"
            : savedAt
              ? `Rascunho salvo às ${new Date(savedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : "Nada salvo ainda — comece a escrever."}
        </p>
        {pct === 100 && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Selo Perfil PRO liberado!
          </p>
        )}
      </div>

      {/* Steps clicáveis */}
      <ol className="no-print mt-10 flex flex-wrap gap-4">
        {STEPS.map((s, i) => {
          const done = i !== step && stepDone(i);
          return (
            <li key={s.label}>
              <button
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className="flex items-center gap-2 rounded-full pr-3 transition-opacity hover:opacity-80"
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full font-bold ${
                    done ? "bg-une text-white" : i === step ? "bg-sun text-night" : "bg-night/10 text-night/50"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
                </span>
                <span className={`text-sm font-bold ${i === step ? "text-night" : "text-night/50"}`}>
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* ── Formulário ── */}
        <div className="no-print space-y-5">
          {step === 0 && (
            <>
              <F label="Nome artístico" error={err("name")} required>
                <input
                  value={kit.name}
                  onChange={set("name")}
                  onBlur={blur("name")}
                  className="inp"
                  placeholder="Ex.: MC Vitória do Ibura"
                  autoComplete="name"
                />
              </F>
              <F
                label="Bio do artista"
                error={err("bio")}
                required
                hint={`${kit.bio.trim().length}/${MIN_BIO} caracteres mínimos`}
              >
                <textarea
                  rows={5}
                  value={kit.bio}
                  onChange={set("bio")}
                  onBlur={blur("bio")}
                  className="inp resize-none"
                  placeholder="Quem você é, de onde vem e o que sua arte provoca..."
                />
              </F>
              <F label="Estilo artístico">
                <select value={kit.style} onChange={set("style")} className="inp">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </F>
              <F label="Comunidade do Ibura">
                <select value={kit.community} onChange={set("community")} className="inp">
                  {COMMUNITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </F>
              <F label="Instagram / redes" error={err("instagram")}>
                <input
                  type="url"
                  inputMode="url"
                  value={kit.instagram}
                  onChange={set("instagram")}
                  onBlur={blur("instagram")}
                  className="inp"
                  placeholder="https://instagram.com/seuperfil"
                />
              </F>
            </>
          )}

          {step === 1 && (
            <>
              <F
                label="Galeria (uma URL por linha)"
                hint={images.length ? `${images.length} imagem(ns) · 6 aparecem no kit` : "Cole os links das suas obras"}
              >
                <textarea
                  rows={5}
                  value={kit.gallery}
                  onChange={set("gallery")}
                  className="inp resize-none font-mono text-sm"
                  placeholder={"/assets/obra-1.jpg\n/assets/obra-2.jpg"}
                  spellCheck={false}
                />
              </F>
              <F label="Vídeo ou áudio de apresentação" error={err("media")}>
                <input
                  type="url"
                  inputMode="url"
                  value={kit.media}
                  onChange={set("media")}
                  onBlur={blur("media")}
                  className="inp"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </F>
            </>
          )}

          {step === 2 && (
            <>
              <F label="E-mail" error={err("email")} required>
                <input
                  type="email"
                  inputMode="email"
                  value={kit.email}
                  onChange={set("email")}
                  onBlur={blur("email")}
                  className="inp"
                  placeholder="contato@seudominio.com"
                  autoComplete="email"
                />
              </F>
              <F label="WhatsApp" error={err("whatsapp")} required hint="Só números, com DDI 55">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={kit.whatsapp}
                  onChange={set("whatsapp")}
                  onBlur={blur("whatsapp")}
                  className="inp"
                  placeholder="5581999990000"
                  autoComplete="tel"
                />
              </F>
              <F label="Faixa de cachê (opcional)" hint="Transparência acelera a negociação">
                <input value={kit.fee} onChange={set("fee")} className="inp" placeholder="R$ 800 a R$ 2.500" />
              </F>
              <F label="Requisitos técnicos (rider)">
                <textarea
                  rows={4}
                  value={kit.rider}
                  onChange={set("rider")}
                  className="inp resize-none"
                  placeholder="2 microfones, 1 monitor de retorno, palco 4x3m..."
                />
              </F>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn bg-night/10 text-night">
                Voltar
              </button>
            )}
            {step < STEPS.length - 1 && (
              <button onClick={() => setStep((s) => s + 1)} className="btn-une">
                Continuar
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-night/10 pt-6">
            <button onClick={saveNow} disabled={!dirty} className="btn bg-night/10 text-sm text-night disabled:opacity-40">
              <Save className="h-4 w-4" aria-hidden="true" /> {dirty ? "Salvar Rascunho" : "Salvo"}
            </button>
            <button onClick={exportPdf} className="btn-une text-sm">
              <FileDown className="h-4 w-4" aria-hidden="true" /> Exportar PDF
            </button>
            <button onClick={publicLink} disabled={!kit.name.trim()} className="btn-sun text-sm disabled:opacity-40">
              <Link2 className="h-4 w-4" aria-hidden="true" /> Gerar Link Público
            </button>
            {savedAt && (
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-night/40 hover:text-heart"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Limpar
              </button>
            )}
          </div>
          {kit.name.trim() && (
            <p className="text-xs text-night/50">
              Seu link: <code className="font-bold">/artista/{slug}</code>
            </p>
          )}
        </div>

        {/* ── Preview ── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="no-print mb-4 text-xs font-bold uppercase tracking-widest text-night/50">
            Pré-visualização ao vivo
          </p>
          <div ref={printRef} id="kit-print" className="overflow-hidden rounded-2xl bg-night text-white shadow-soft">
            <div className="flex items-center gap-4 p-7">
              <StarBadge size={72}>
                <span className="display text-[7px] text-fica">UNE&<br />FICA</span>
              </StarBadge>
              <div className="min-w-0">
                <p className="display truncate text-xl">{kit.name.trim() || "Seu nome artístico"}</p>
                <p className="text-sm text-fica">{kit.style} · {kit.community}, Ibura</p>
                {kit.instagram && isUrl(kit.instagram) && (
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    @{kit.instagram.split("/").filter(Boolean).pop()}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-5 bg-white px-7 py-6 text-night">
              <Block title="Sobre">{kit.bio.trim() || "Sua bio aparecerá aqui."}</Block>
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-une">Galeria</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((src, i) => (
                      <img
                        key={`${src}-${i}`}
                        src={src}
                        alt=""
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.opacity = "0.15")}
                        className="aspect-square rounded-lg bg-night/10 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              {kit.media && <Block title="Apresentação">{kit.media}</Block>}
              {kit.fee && <Block title="Faixa de cachê">{kit.fee}</Block>}
              {kit.rider && <Block title="Rider técnico">{kit.rider}</Block>}
              <Block title="Contato">
                {[kit.email, kit.whatsapp].filter(Boolean).join(" · ") || "Adicione seus contatos."}
              </Block>
            </div>
            <p className="bg-sun py-2 text-center text-xs font-bold text-night">
              UNE&FICA · UneHUB · Ibura, Recife/PE
            </p>
          </div>
        </aside>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`animate-rise no-print fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-2xl px-6 py-4 font-bold text-white shadow-soft ${
            toast.kind === "ok" ? "bg-une" : "bg-heart"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─────────── Field com erro e dica ─────────── */

function F({
  label, children, error, hint, required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-night">
        {label}
        {required && <span className="ml-1 text-heart" aria-label="obrigatório">*</span>}
      </span>
      <div className={error ? "[&_.inp]:border-heart" : ""}>{children}</div>
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-heart">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-night/50">{hint}</span>
      ) : null}
    </label>
  );
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wider text-une">{title}</p>
    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-night/80">{children}</p>
  </div>
);
