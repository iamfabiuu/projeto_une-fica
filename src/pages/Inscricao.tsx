import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useApp } from "../store/useApp";
import { ArtistCard } from "../components/ArtistCard";
import {
  CATEGORIES,
  COMMUNITIES,
  type Artist,
  type Category,
  type Community,
} from "../data/types";

const schema = z.object({
  name: z.string().min(3, "Informe seu nome ou nome artístico"),
  whatsapp: z.string().min(10, "WhatsApp com DDD"),
  community: z.enum(COMMUNITIES as [Community, ...Community[]]),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  spotify: z.string().url("URL inválida").optional().or(z.literal("")),
  bio: z.string().min(60, "Conte sua história em pelo menos 60 caracteres"),
  photoUrl: z.string().min(1, "Informe a URL de uma foto"),
  pixKey: z.string().min(4, "Informe sua chave PIX"),
});
type Form = z.infer<typeof schema>;

const STEPS = [
  "Dados & Comunidade",
  "Categoria & Portfólio",
  "Descrição & Fotos",
];

export default function Inscricao() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const addArtist = useApp((s) => s.addArtist);
  const nav = useNavigate();

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      whatsapp: "",
      community: "UR-2",
      category: "Cantor",
      instagram: "",
      spotify: "",
      bio: "",
      photoUrl: "/assets/a3.jpg",
      pixKey: "",
    },
  });
  const v = watch();

  const fields: (keyof Form)[][] = [
    ["name", "whatsapp", "community"],
    ["category", "instagram", "spotify"],
    ["bio", "photoUrl", "pixKey"],
  ];

  const next = async () => {
    if (await trigger(fields[step])) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = (d: Form) => {
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
    setDone(true);
    setTimeout(() => nav("/vitrine"), 2600);
  };

  const preview: Artist = {
    id: "preview",
    slug: "preview",
    name: v.name || "Seu nome artístico",
    category: v.category,
    community: v.community,
    photoUrl: v.photoUrl || "/assets/a3.jpg",
    bio: v.bio,
    gallery: [],
    socials: {},
    pixKey: "",
    status: "pendente",
    certified: false,
    createdAt: "",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Inscrição de Artistas
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />

      {/* Stepper */}
      <ol className="mt-10 flex flex-wrap gap-4">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`grid h-9 w-9 place-items-center rounded-full font-bold ${
                i < step
                  ? "bg-une text-white"
                  : i === step
                    ? "bg-sun text-night"
                    : "bg-night/10 text-night/50"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={`text-sm font-bold ${i === step ? "text-night" : "text-night/50"}`}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 0 && (
            <>
              <Field label="Nome / Nome artístico" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className="inp"
                  placeholder="Ex: Léa Sanfoneira"
                />
              </Field>
              <Field
                label="WhatsApp (com DDD)"
                error={errors.whatsapp?.message}
              >
                <input
                  {...register("whatsapp")}
                  className="inp"
                  placeholder="5581999990000"
                />
              </Field>
              <Field
                label="Comunidade do Ibura"
                error={errors.community?.message}
              >
                <select {...register("community")} className="inp">
                  {COMMUNITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Categoria" error={errors.category?.message}>
                <select {...register("category")} className="inp">
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Instagram (opcional)"
                error={errors.instagram?.message}
              >
                <input
                  {...register("instagram")}
                  className="inp"
                  placeholder="https://instagram.com/seuperfil"
                />
              </Field>
              <Field
                label="Spotify / YouTube (opcional)"
                error={errors.spotify?.message}
              >
                <input
                  {...register("spotify")}
                  className="inp"
                  placeholder="https://open.spotify.com/artist/..."
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="Sua história e sua arte"
                error={errors.bio?.message}
              >
                <textarea
                  {...register("bio")}
                  rows={5}
                  className="inp resize-none"
                  placeholder="Conte de onde você vem, o que faz e o que já realizou..."
                />
                <p className="mt-1 text-xs text-night/50">
                  {v.bio.length}/60 caracteres mínimos
                </p>
              </Field>
              <Field
                label="URL da foto principal"
                error={errors.photoUrl?.message}
              >
                <input
                  {...register("photoUrl")}
                  className="inp"
                  placeholder="/assets/minha-foto.jpg"
                />
              </Field>
              <Field
                label="Chave PIX para apoios"
                error={errors.pixKey?.message}
              >
                <input
                  {...register("pixKey")}
                  className="inp"
                  placeholder="email@ou-cpf-ou-telefone"
                />
              </Field>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn bg-night/10 text-night hover:bg-night/20"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
            )}
            {step < 2 ? (
              <button type="button" onClick={next} className="btn-une">
                Continuar <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" className="btn-sun">
                Enviar inscrição <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Live Preview */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-night/50">
            Pré-visualização na vitrine
          </p>
          <div className="max-w-[280px]">
            <ArtistCard artist={preview} />
          </div>
          <p className="mt-4 max-w-[280px] text-xs leading-relaxed text-night/60">
            Assim seu card aparecerá após a aprovação da organização.
          </p>
        </aside>
      </div>

      {done && (
        <div
          role="status"
          className="animate-rise fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-2xl bg-une px-6 py-4 text-white shadow-soft"
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-night">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-sm font-semibold text-heart">
          {error}
        </span>
      )}
    </label>
  );
}
