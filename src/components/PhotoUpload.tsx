import { useId, useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { compressImage, ACCEPTED } from "../lib/image";

type Props = {
  value: string;
  onChange: (dataUrl: string) => void;
  label: string;
  hint?: string;
  error?: string;
};

export function PhotoUpload({ value, onChange, label, hint, error }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState<string>();

  const handle = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setLocalErr(undefined);
    try {
      onChange(await compressImage(file));
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Falha ao carregar imagem.");
    } finally {
      setBusy(false);
    }
  };

  const msg = localErr ?? error;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-night">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-night/55">{hint}</p>}

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="grid h-28 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-night/20 bg-night/5">
          {value ? (
            <img
              src={value}
              alt="Pré-visualização da foto enviada"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-7 w-7 text-night/25" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            aria-invalid={!!msg}
            aria-describedby={msg ? `${id}-error` : undefined}
            onChange={(e) => void handle(e.target.files?.[0])}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="btn bg-night/10 text-night hover:bg-night/20 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />{" "}
                  Processando
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" aria-hidden="true" />{" "}
                  {value ? "Trocar foto" : "Escolher foto"}
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="btn text-heart hover:bg-heart/10"
              >
                <X className="h-4 w-4" aria-hidden="true" /> Remover
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-night/50">
            JPG, PNG ou WebP · até 8MB · retrato vertical fica melhor no card
          </p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {busy ? "Processando imagem" : value ? "Foto carregada" : ""}
      </p>

      {msg && (
        <span
          id={`${id}-error`}
          className="mt-2 block text-sm font-semibold text-heart"
          role="alert"
        >
          {msg}
        </span>
      )}
    </div>
  );
}
