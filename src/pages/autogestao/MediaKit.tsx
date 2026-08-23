import { useState, useRef, useEffect } from "react";
import { Save, FileDown, Link2, Check } from "lucide-react";
import { StarBadge } from "../../brand/StarBadge";
import { useApp } from "../../store/useApp";
import { COMMUNITIES, CATEGORIES } from "../../data/types";

interface Kit {
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
const STEPS = ["Bio & Redes", "Galeria & Mídia", "Contato & Rider"];

export default function MediaKit() {
  const [step, setStep] = useState(0);
  const [kit, setKit] = useState<Kit>(EMPTY);
  const [toast, setToast] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const setKitProgress = useApp((s) => s.setKitProgress);

  const filled = Object.values(kit).filter((v) => v.trim()).length;
  const pct = Math.round((filled / Object.keys(kit).length) * 100);

  useEffect(() => {
    setKitProgress(pct);
  }, [pct, setKitProgress]);

  const set =
    (k: keyof Kit) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setKit((s) => ({ ...s, [k]: e.target.value }));

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  const exportPdf = () => window.print();

  const publicLink = () => {
    const slug = kit.instagram.split("/").filter(Boolean).pop() || "meu-perfil";
    navigator.clipboard.writeText(`${location.origin}/artista/${slug}`);
    flash("Link público copiado para a área de transferência!");
  };

  const images = kit.gallery
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="display text-3xl text-night sm:text-4xl">
        Gerador de Media Kit
      </h1>
      <div className="mt-4 h-1 w-24 bg-sun" />
      <p className="mt-4 text-night/70">
        Seu portfólio profissional pronto para enviar a contratantes e editais.
      </p>

      <div className="mt-6 max-w-md">
        <div className="flex justify-between text-sm font-bold">
          <span>Completude</span>
          <span className="text-une">{pct}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-night/10">
          <div
            className="h-full bg-gradient-to-r from-une to-sun transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

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

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        {/* Formulário */}
        <div className="space-y-5">
          {step === 0 && (
            <>
              <L label="Bio do artista">
                <textarea
                  rows={5}
                  value={kit.bio}
                  onChange={set("bio")}
                  className="inp resize-none"
                  placeholder="Quem você é, de onde vem e o que sua arte provoca..."
                />
              </L>
              <L label="Estilo artístico">
                <select
                  value={kit.style}
                  onChange={set("style")}
                  className="inp"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </L>
              <L label="Comunidade do Ibura">
                <select
                  value={kit.community}
                  onChange={set("community")}
                  className="inp"
                >
                  {COMMUNITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </L>
              <L label="Instagram / redes">
                <input
                  value={kit.instagram}
                  onChange={set("instagram")}
                  className="inp"
                  placeholder="https://instagram.com/seuperfil"
                />
              </L>
            </>
          )}
          {step === 1 && (
            <>
              <L label="Galeria (uma URL por linha)">
                <textarea
                  rows={5}
                  value={kit.gallery}
                  onChange={set("gallery")}
                  className="inp resize-none font-mono text-sm"
                  placeholder={"/assets/obra-1.jpg\n/assets/obra-2.jpg"}
                />
              </L>
              <L label="Vídeo ou áudio de apresentação">
                <input
                  value={kit.media}
                  onChange={set("media")}
                  className="inp"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </L>
            </>
          )}
          {step === 2 && (
            <>
              <L label="E-mail">
                <input
                  value={kit.email}
                  onChange={set("email")}
                  className="inp"
                  placeholder="contato@seudominio.com"
                />
              </L>
              <L label="WhatsApp">
                <input
                  value={kit.whatsapp}
                  onChange={set("whatsapp")}
                  className="inp"
                  placeholder="5581999990000"
                />
              </L>
              <L label="Faixa de cachê (opcional)">
                <input
                  value={kit.fee}
                  onChange={set("fee")}
                  className="inp"
                  placeholder="R$ 800 a R$ 2.500"
                />
              </L>
              <L label="Requisitos técnicos (rider)">
                <textarea
                  rows={4}
                  value={kit.rider}
                  onChange={set("rider")}
                  className="inp resize-none"
                  placeholder="2 microfones, 1 monitor de retorno, palco 4x3m..."
                />
              </L>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="btn bg-night/10 text-night"
              >
                Voltar
              </button>
            )}
            {step < 2 && (
              <button onClick={() => setStep((s) => s + 1)} className="btn-une">
                Continuar
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-night/10 pt-6">
            <button
              onClick={() => flash("Rascunho salvo localmente!")}
              className="btn bg-night/10 text-night text-sm"
            >
              <Save className="h-4 w-4" /> Salvar Rascunho
            </button>
            <button onClick={exportPdf} className="btn-une text-sm">
              <FileDown className="h-4 w-4" /> Exportar PDF
            </button>
            <button onClick={publicLink} className="btn-sun text-sm">
              <Link2 className="h-4 w-4" /> Gerar Link Público
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-night/50">
            Pré-visualização ao vivo
          </p>
          <div
            ref={printRef}
            id="kit-print"
            className="overflow-hidden rounded-2xl bg-night text-white shadow-soft"
          >
            <div className="flex items-center gap-4 p-7">
              <StarBadge size={72}>
                <span className="display text-[7px] text-fica">
                  UNE&
                  <br />
                  FICA
                </span>
              </StarBadge>
              <div>
                <p className="display text-xl">
                  {kit.instagram.split("/").filter(Boolean).pop() ||
                    "Seu nome artístico"}
                </p>
                <p className="text-sm text-fica">
                  {kit.style} · {kit.community}, Ibura
                </p>
              </div>
            </div>
            <div className="space-y-5 bg-white px-7 py-6 text-night">
              <Block title="Sobre">
                {kit.bio || "Sua bio aparecerá aqui."}
              </Block>
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-une">
                    Galeria
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="aspect-square rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              {kit.media && <Block title="Apresentação">{kit.media}</Block>}
              {kit.fee && <Block title="Faixa de cachê">{kit.fee}</Block>}
              {kit.rider && <Block title="Rider técnico">{kit.rider}</Block>}
              <Block title="Contato">
                {[kit.email, kit.whatsapp].filter(Boolean).join(" · ") ||
                  "Adicione seus contatos."}
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
          className="animate-rise fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-2xl bg-une px-6 py-4 font-bold text-white shadow-soft"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

const L = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-bold text-night">{label}</span>
    {children}
  </label>
);
const Block = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wider text-une">
      {title}
    </p>
    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-night/80">
      {children}
    </p>
  </div>
);
