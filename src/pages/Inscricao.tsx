import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useWatch, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../store/useApp";
import { ArtistCard } from "../components/ArtistCard";
import { PhotoUpload } from "../components/PhotoUpload";
import {
  CATEGORIES,
  COMMUNITIES,
  type Artist,
  type Category,
  type Community,
} from "../data/types";

const DRAFT_KEY = "unefica:inscricao:draft";
const BIO_MIN = 60;
const BIO_MAX = 600;
const PLACEHOLDER = "/assets/a3.jpg";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

/** Aceita "@perfil", "instagram.com/perfil" ou URL completa */
const socialUrl = (host: string) =>
  z
    .string()
    .trim()
    .transform((s) => {
      if (!s) return "";
      if (s.startsWith("@")) return `https://${host}/${s.slice(1)}`;
      if (!/^https?:\/\//i.test(s)) return `https://${s}`;
      return s;
    })
    .refine((s) => !s || z.string().url().safeParse(s).success, "Link inválido")
    .optional();

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome ou nome artístico")
    .max(60, "Máximo de 60 caracteres"),
  whatsapp: z
    .string()
    .transform(onlyDigits)
    .refine(
      (d) => d.length === 10 || d.length === 11,
      "Use DDD + número (10 ou 11 dígitos)",
    ),
  community: z.enum(COMMUNITIES as [Community, ...Community[]]),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  instagram: socialUrl("instagram.com"),
  spotify: socialUrl("open.spotify.com"),
  bio: z
    .string()
    .trim()
    .min(BIO_MIN, `Conte sua história em pelo menos ${BIO_MIN} caracteres`)
    .max(BIO_MAX, `Máximo de ${BIO_MAX} caracteres`),
  photoUrl: z
    .string()
    .trim()
    .min(1, "Envie uma foto principal")
    .refine(
      (s) =>
        s.startsWith("data:image/") ||
        s.startsWith("/") ||
        /^https?:\/\//.test(s),
      "Formato de imagem inválido",
    ),
  pixKey: z.string().trim().min(4, "Informe sua chave PIX"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o uso dos dados" }),
  }),
});
type Form = z.input<typeof schema>;
type Data = z.output<typeof schema>;

const STEPS = [
  { title: "Dados & Comunidade", fields: ["name", "whatsapp", "community"] },
  {
    title: "Categoria & Portfólio",
    fields: ["category", "instagram", "spotify"],
  },
  {
    title: "Descrição & Fotos",
    fields: ["bio", "photoUrl", "pixKey", "consent"],
  },
] as const;

/** Campos que não são focáveis via setFocus (input file é sr-only) */
const UNFOCUSABLE = new Set<keyof Form>(["photoUrl", "consent"]);

const DEFAULTS: Form = {
  name: "",
  whatsapp: "",
  community: "UR-2",
  category: "Cantor",
  instagram: "",
  spotify: "",
  bio: "",
  photoUrl: "",
  pixKey: "",
  consent: false as unknown as true,
};

function loadDraft(): Form {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return DEFAULTS;
    return {
      ...DEFAULTS,
      ...JSON.parse(raw),
      // nunca restauramos foto nem consentimento
      photoUrl: "",
      consent: false as unknown as true,
    };
  } catch {
    return DEFAULTS;
  }
}

export default function Inscricao() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const addArtist = useApp((s) => s.addArtist);
  const nav = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: loadDraft(),
  });

  // Rascunho: salva a cada 800ms sem travar a digitação
  const draftValues = useWatch({ control });
  useEffect(() => {
    const t = setTimeout(() => {
      const { consent, photoUrl, ...rest } = draftValues as Form;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
      } catch {
        /* cota cheia — segue o baile */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draftValues]);

  // Foco na etapa nova (acessibilidade) — sem disparar no 1º render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    const first = STEPS[step].fields[0] as keyof Form;
    if (!UNFOCUSABLE.has(first)) setFocus(first);
  }, [step, setFocus]);

  const next = useCallback(async () => {
    const ok = await trigger(STEPS[step].fields as unknown as (keyof Form)[]);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, trigger]);

  // Enter não deve enviar antes da última etapa
  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && step < STEPS.length - 1) {
      const el = e.target as HTMLElement;
      if (el.tagName !== "TEXTAREA") {
        e.preventDefault();
        void next();
      }
    }
  };

  const onSubmit = async (d: Data) => {
    addArtist({
      name: d.name,
      category: d.category,
      community: d.community,
      photoUrl: d.photoUrl,
      bio: d.bio,
      gallery: [d.photoUrl],
      pixKey: d.pixKey,
      socials: {
        instagram: d.instagram || undefined,
        spotify: d.spotify || undefined,
        whatsapp: d.whatsapp,
      },
    });
    localStorage.removeItem(DRAFT_KEY);
    setDone(true);
  };

  // Redirect com cleanup — sem leak se o usuário sair antes
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => nav("/vitrine"), 2600);
    return () => clearTimeout(t);
  }, [done, nav]);

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Inscrição de Artistas
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" aria-hidden="true" />

      {/* Stepper + barra de progresso */}
      <nav aria-label="Etapas da inscrição" className="mt-10">
        <ol className="flex flex-wrap gap-x-6 gap-y-3">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={s.title} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold transition-colors ${
                    state === "done"
                      ? "bg-une text-white"
                      : state === "current"
                        ? "bg-sun text-night ring-4 ring-sun/25"
                        : "bg-night/10 text-night/50"
                  }`}
                >
                  {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-sm font-bold ${
                    state === "todo" ? "text-night/50" : "text-night"
                  }`}
                >
                  {s.title}
                  {state === "current" && (
                    <span className="sr-only"> (etapa atual)</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <div
          className="mt-5 h-1.5 overflow-hidden rounded-full bg-night/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Etapa ${step + 1} de ${STEPS.length}`}
        >
          <div
            className="h-full rounded-full bg-une transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={onKeyDown}
          noValidate
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="display text-xl text-night outline-none"
          >
            {STEPS[step].title}
          </h2>

          <div className="mt-6 space-y-5">
            {step === 0 && (
              <>
                <Field
                  id="name"
                  label="Nome / Nome artístico"
                  error={errors.name?.message}
                >
                  {(p) => (
                    <input
                      {...p}
                      {...register("name")}
                      autoComplete="name"
                      className="inp"
                      placeholder="Ex: Léa Sanfoneira"
                    />
                  )}
                </Field>

                <Field
                  id="whatsapp"
                  label="WhatsApp (com DDD)"
                  hint="Só números. Ex: 81999990000"
                  error={errors.whatsapp?.message}
                >
                  {(p) => (
                    <input
                      {...p}
                      {...register("whatsapp")}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={11}
                      className="inp"
                      placeholder="81999990000"
                    />
                  )}
                </Field>

                <Field
                  id="community"
                  label="Comunidade do Ibura"
                  error={errors.community?.message}
                >
                  {(p) => (
                    <select {...p} {...register("community")} className="inp">
                      {COMMUNITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <Field
                  id="category"
                  label="Categoria"
                  error={errors.category?.message}
                >
                  {(p) => (
                    <select {...p} {...register("category")} className="inp">
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                <Field
                  id="instagram"
                  label="Instagram"
                  hint="Opcional — pode colar só o @"
                  error={errors.instagram?.message}
                >
                  {(p) => (
                    <input
                      {...p}
                      {...register("instagram")}
                      className="inp"
                      placeholder="@seuperfil"
                    />
                  )}
                </Field>

                <Field
                  id="spotify"
                  label="Spotify / YouTube"
                  hint="Opcional"
                  error={errors.spotify?.message}
                >
                  {(p) => (
                    <input
                      {...p}
                      {...register("spotify")}
                      className="inp"
                      placeholder="https://open.spotify.com/artist/..."
                    />
                  )}
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  id="bio"
                  label="Sua história e sua arte"
                  hint={`Entre ${BIO_MIN} e ${BIO_MAX} caracteres`}
                  error={errors.bio?.message}
                >
                  {(p) => (
                    <textarea
                      {...p}
                      {...register("bio")}
                      rows={5}
                      maxLength={BIO_MAX}
                      aria-describedby={`${p["aria-describedby"] ?? ""} bio-count`.trim()}
                      className="inp resize-y"
                      placeholder="Conte de onde você vem, o que faz e o que já realizou..."
                    />
                  )}
                </Field>
                <BioCounter control={control} />

                <Controller
                  control={control}
                  name="photoUrl"
                  render={({ field, fieldState }) => (
                    <PhotoUpload
                      label="Foto principal"
                      hint="É a imagem que aparece no seu card da vitrine"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Field
                  id="pixKey"
                  label="Chave PIX para apoios"
                  hint="Fica visível no seu perfil público"
                  error={errors.pixKey?.message}
                >
                  {(p) => (
                    <input
                      {...p}
                      {...register("pixKey")}
                      className="inp"
                      placeholder="email, CPF ou telefone"
                    />
                  )}
                </Field>

                <div>
                  <label
                    htmlFor="consent"
                    className="flex cursor-pointer items-start gap-3 text-sm text-night"
                  >
                    <input
                      {...register("consent")}
                      id="consent"
                      type="checkbox"
                      aria-invalid={!!errors.consent}
                      aria-describedby={
                        errors.consent ? "consent-error" : undefined
                      }
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-une focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-une/25"
                    />
                    <span>
                      Autorizo o UNE&amp;FICA a divulgar meu nome, foto e
                      trabalho nos canais do projeto.
                    </span>
                  </label>
                  {errors.consent?.message && (
                    <span id="consent-error" className="block">
                      <ErrorText>{errors.consent.message}</ErrorText>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn bg-night/10 text-night hover:bg-night/20"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-une">
                Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || done}
                aria-label="Enviar inscrição"
                className="btn-sun disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    Enviando{" "}
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    Enviar inscrição{" "}
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>

          <p className="pt-4 text-xs text-night/50">
            Seu progresso é salvo automaticamente neste navegador (exceto a
            foto).
          </p>
        </form>

        <LivePreview control={control} />
      </div>

      {done && (
        <div
          role="status"
          aria-live="assertive"
          className="animate-rise fixed bottom-6 left-1/2 z-[80] w-[min(90vw,26rem)] -translate-x-1/2 rounded-2xl bg-une px-6 py-4 text-white shadow-soft"
        >
          <p className="font-bold">Inscrição enviada! 🎉</p>
          <p className="text-sm text-white/80">
            Seu perfil está em análise. Redirecionando para a Vitrine...
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponentes isolados: só eles re-renderizam ---------- */

function BioCounter({ control }: { control: Control<Form> }) {
  const bio = useWatch({ control, name: "bio" }) ?? "";
  const len = bio.trim().length;
  const ok = len >= BIO_MIN;
  return (
    <p
      id="bio-count"
      aria-live="polite"
      className={`-mt-3 text-xs font-semibold ${
        ok ? "text-une" : "text-night/50"
      }`}
    >
      {ok
        ? `✓ ${len} de ${BIO_MAX} caracteres`
        : `${len} de ${BIO_MIN} caracteres mínimos`}
    </p>
  );
}

function LivePreview({ control }: { control: Control<Form> }) {
  const v = useWatch({ control });
  const preview: Artist = {
    id: "preview",
    slug: "preview",
    name: v.name?.trim() || "Seu nome artístico",
    category: (v.category ?? "Cantor") as Category,
    community: (v.community ?? "UR-2") as Community,
    photoUrl: v.photoUrl?.trim() || PLACEHOLDER,
    bio: v.bio ?? "",
    gallery: [],
    socials: {},
    pixKey: "",
    status: "pendente",
    certified: false,
    createdAt: new Date().toISOString(),
  };

  return (
    <aside
      aria-label="Pré-visualização do seu card"
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-night/50">
        Pré-visualização na vitrine
      </p>
      <div className="max-w-[280px]" aria-live="polite" aria-atomic="true">
        <ArtistCard artist={preview} />
      </div>
      <p className="mt-4 max-w-[280px] text-xs leading-relaxed text-night/60">
        Assim seu card aparecerá após a aprovação da organização.
      </p>
    </aside>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-heart"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Render-prop entrega id/aria-* corretos ao controle — HTML válido */
function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-night">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-xs text-night/55">
          {hint}
        </p>
      )}
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
      })}
      {error && (
        <span id={errId} className="block">
          <ErrorText>{error}</ErrorText>
        </span>
      )}
    </div>
  );
}
