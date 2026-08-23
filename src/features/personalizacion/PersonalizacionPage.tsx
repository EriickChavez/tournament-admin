import { useState, useRef, useCallback } from "react";
import { useThemeStore, type ThemeColors, type FontFamily, type BorderRadius, type AnimationSpeed } from "../../shared/store/theme-store";

// ─── Icons ───────────────────────────────────────────────────────────────────

const PaletteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const TypeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const LayoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.1" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "identidad" | "colores" | "tipografia" | "layout" | "comportamiento";

// ─── Helper Components ────────────────────────────────────────────────────────

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white hover:border-gray-300 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-200 cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-1 w-8 h-8 cursor-pointer opacity-0"
          />
          <div className="w-full h-full rounded-full" style={{ backgroundColor: value }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm font-mono text-gray-700 outline-none bg-transparent"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-primary" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function ImageUploadCard({ label, description, url, onUpload, aspectRatio = "landscape" }: {
  label: string;
  description: string;
  url: string | null;
  onUpload: (url: string) => void;
  aspectRatio?: "square" | "landscape" | "wide";
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onUpload(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const heightClass = aspectRatio === "square" ? "h-28" : aspectRatio === "landscape" ? "h-24" : "h-20";

  return (
    <div
      className={`relative ${heightClass} rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group cursor-pointer hover:border-primary hover:bg-blue-50/40 transition-all duration-200`}
      onClick={() => fileRef.current?.click()}
    >
      {url ? (
        <>
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">Cambiar imagen</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 group-hover:text-primary transition-colors">
          <UploadIcon />
          <div className="text-center">
            <p className="text-xs font-medium">{label}</p>
            <p className="text-xs opacity-70">{description}</p>
          </div>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function LivePreview({ colors, appName, fontFamily }: { colors: ThemeColors; appName: string; fontFamily: FontFamily }) {
  const fontMap: Record<FontFamily, string> = {
    inter: "'Inter', sans-serif",
    outfit: "'Outfit', sans-serif",
    roboto: "'Roboto', sans-serif",
    poppins: "'Poppins', sans-serif",
    "dm-sans": "'DM Sans', sans-serif",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon />
          <span className="font-semibold text-gray-900 text-sm">Vista Previa</span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-50">ACTIVO</span>
      </div>

      <div className="p-4">
        <div
          className="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
          style={{ fontFamily: fontMap[fontFamily], fontSize: "11px" }}
        >
          <div className="flex" style={{ height: "220px" }}>
            {/* Mini Sidebar */}
            <div className="w-20 border-r border-gray-100 flex flex-col bg-white">
              <div className="p-2 flex items-center gap-1.5 border-b border-gray-50">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="4" /></svg>
                </div>
                <span className="font-bold text-gray-800 truncate" style={{ fontSize: "8px" }}>{appName}</span>
              </div>
              <div className="flex-1 p-1.5 flex flex-col gap-0.5">
                <div className="px-1.5 py-0.5 rounded text-white text-center" style={{ backgroundColor: colors.primary, fontSize: "7px" }}>Panel</div>
                <div className="px-1.5 py-0.5 rounded text-gray-500 text-center" style={{ fontSize: "7px" }}>Equipos</div>
                <div className="px-1.5 py-0.5 rounded text-gray-500 text-center" style={{ fontSize: "7px" }}>Jugadores</div>
              </div>
            </div>

            {/* Mini Main */}
            <div className="flex-1 flex flex-col" style={{ backgroundColor: colors.background }}>
              <div className="border-b border-gray-100 px-2 py-1.5 flex items-center justify-between bg-white">
                <span className="font-semibold text-gray-800" style={{ fontSize: "8px" }}>Panel</span>
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: colors.primary, fontSize: "6px" }}>EC</div>
              </div>

              <div className="flex-1 p-2 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {[{ label: "Equipos", val: "8" }, { label: "Jugadores", val: "96" }].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg p-2 border border-gray-100 shadow-sm">
                      <p style={{ fontSize: "7px", color: "#9CA3AF" }}>{s.label}</p>
                      <p className="font-bold" style={{ fontSize: "11px", color: colors.primary }}>{s.val}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full rounded-lg py-1 text-white font-semibold" style={{ backgroundColor: colors.accent, fontSize: "8px" }}>
                  + Inscribir Equipo
                </button>
                <div className="flex gap-1 items-center">
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: colors.accent }} />
                  <div className="h-1 w-4 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          Este mock muestra una aproximación de los colores asignados en los controles de la izquierda.
        </p>
      </div>
    </div>
  );
}

// ─── Tab: Identidad Visual ────────────────────────────────────────────────────

function TabIdentidad() {
  const { appName, logoUrl, bannerUrl, setAppName, setLogoUrl, setBannerUrl } = useThemeStore();

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Nombre de la Aplicación" description="Este nombre aparece en el sidebar y en las pestañas del navegador.">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Nombre del torneo / app</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Nova"
            maxLength={30}
          />
          <p className="text-xs text-gray-400">{appName.length}/30 caracteres</p>
        </div>
      </SectionCard>

      <SectionCard title="Logotipo del Torneo" description="Sube tu logo oficial en formato PNG o SVG (Recomendado: 512x512px).">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Logo Principal</p>
            <ImageUploadCard label="Subir logotipo" description="PNG o SVG · 512×512px" url={logoUrl} onUpload={setLogoUrl} aspectRatio="square" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Banner de Portada</p>
            <ImageUploadCard label="Subir banner" description="PNG o JPG · 1920×480px" url={bannerUrl} onUpload={setBannerUrl} aspectRatio="landscape" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Colores ─────────────────────────────────────────────────────────────

const PRESET_PALETTES = [
  { name: "Azul Clásico", primary: "#2563eb", secondary: "#1E293B", accent: "#10B981", background: "#FAFAFA", text: "#171717" },
  { name: "Violeta Pro", primary: "#7C3AED", secondary: "#1E1B4B", accent: "#EC4899", background: "#F5F3FF", text: "#1E1B2E" },
  { name: "Esmeralda", primary: "#059669", secondary: "#064E3B", accent: "#F59E0B", background: "#F0FDF4", text: "#1A1A1A" },
  { name: "Naranja Fuego", primary: "#EA580C", secondary: "#1C1917", accent: "#EAB308", background: "#FFF7ED", text: "#1C1917" },
  { name: "Rosa Moderno", primary: "#DB2777", secondary: "#1E1B2E", accent: "#6366F1", background: "#FDF2F8", text: "#1E1B2E" },
  { name: "Oscuro Neon", primary: "#22D3EE", secondary: "#0F172A", accent: "#A78BFA", background: "#0F172A", text: "#E2E8F0" },
];

function TabColores() {
  const { colors, setColors } = useThemeStore();

  const handleColorChange = (key: keyof ThemeColors) => (value: string) => {
    setColors({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Paletas Predefinidas" description="Elige una paleta completa con un clic o personaliza manualmente.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_PALETTES.map((palette) => {
            const isActive = colors.primary === palette.primary && colors.accent === palette.accent;
            return (
              <button
                key={palette.name}
                onClick={() => setColors(palette)}
                className={`relative rounded-xl p-3 border-2 text-left transition-all duration-200 hover:shadow-md ${isActive ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-300"}`}
              >
                {isActive && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow">
                    <CheckIcon />
                  </span>
                )}
                <div className="flex gap-1.5 mb-2">
                  <div className="w-6 h-6 rounded-full border border-white/50 shadow" style={{ backgroundColor: palette.primary }} />
                  <div className="w-6 h-6 rounded-full border border-white/50 shadow" style={{ backgroundColor: palette.accent }} />
                  <div className="w-6 h-6 rounded-full border border-white/50 shadow" style={{ backgroundColor: palette.secondary }} />
                </div>
                <p className="text-xs font-semibold text-gray-700">{palette.name}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Colores Personalizados" description="Ajusta cada color individualmente con precisión.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorInput label="Color Primario" value={colors.primary} onChange={handleColorChange("primary")} />
          <ColorInput label="Color Secundario" value={colors.secondary} onChange={handleColorChange("secondary")} />
          <ColorInput label="Color de Acento" value={colors.accent} onChange={handleColorChange("accent")} />
          <ColorInput label="Fondo General" value={colors.background} onChange={handleColorChange("background")} />
          <ColorInput label="Color de Texto" value={colors.text} onChange={handleColorChange("text")} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Tipografía ──────────────────────────────────────────────────────────

const FONTS: { id: FontFamily; name: string; preview: string; category: string }[] = [
  { id: "inter", name: "Inter", preview: "Aa", category: "Sin serifas · Moderno" },
  { id: "outfit", name: "Outfit", preview: "Aa", category: "Sin serifas · Geométrico" },
  { id: "roboto", name: "Roboto", preview: "Aa", category: "Sin serifas · Google" },
  { id: "poppins", name: "Poppins", preview: "Aa", category: "Sin serifas · Redondo" },
  { id: "dm-sans", name: "DM Sans", preview: "Aa", category: "Sin serifas · Editorial" },
];

const FONT_STYLE_MAP: Record<FontFamily, React.CSSProperties> = {
  inter: { fontFamily: "'Inter', sans-serif" },
  outfit: { fontFamily: "'Outfit', sans-serif" },
  roboto: { fontFamily: "'Roboto', sans-serif" },
  poppins: { fontFamily: "'Poppins', sans-serif" },
  "dm-sans": { fontFamily: "'DM Sans', sans-serif" },
};

function TabTipografia() {
  const { fontFamily, fontSize, setFontFamily, setFontSize } = useThemeStore();

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Familia Tipográfica" description="Elige la fuente principal de la interfaz.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => {
            const isActive = fontFamily === font.id;
            return (
              <button
                key={font.id}
                onClick={() => setFontFamily(font.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-sm ${isActive ? "border-primary bg-blue-50/50 shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 transition-colors ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
                  style={FONT_STYLE_MAP[font.id]}
                >
                  {font.preview}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900" style={FONT_STYLE_MAP[font.id]}>{font.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{font.category}</p>
                  {isActive && <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1"><CheckIcon /> Activa</span>}
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Tamaño de Fuente Base" description="Ajusta el tamaño de texto general de la interfaz.">
        <div className="grid grid-cols-3 gap-3">
          {([["sm", "Pequeño", "13px"], ["md", "Normal", "15px"], ["lg", "Grande", "17px"]] as const).map(([val, label, size]) => (
            <button
              key={val}
              onClick={() => setFontSize(val)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${fontSize === val ? "border-primary bg-blue-50/50 shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
            >
              <span className={`font-semibold text-gray-800 ${val === "sm" ? "text-sm" : val === "md" ? "text-base" : "text-lg"}`}>Aa</span>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{size}</p>
              </div>
              {fontSize === val && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Layout ──────────────────────────────────────────────────────────────

const RADIUS_OPTIONS: { id: BorderRadius; label: string; preview: string }[] = [
  { id: "none", label: "Sin bordes", preview: "0px" },
  { id: "sm", label: "Sutil", preview: "4px" },
  { id: "md", label: "Moderado", preview: "8px" },
  { id: "lg", label: "Suave", preview: "12px" },
  { id: "xl", label: "Redondeado", preview: "16px" },
  { id: "2xl", label: "Muy redondo", preview: "24px" },
];

const RADIUS_PX: Record<BorderRadius, string> = {
  none: "0px", sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px"
};

const ANIMATION_OPTIONS: { id: AnimationSpeed; label: string; desc: string }[] = [
  { id: "none", label: "Sin animaciones", desc: "Máximo rendimiento" },
  { id: "slow", label: "Lento", desc: "400ms de duración" },
  { id: "normal", label: "Normal", desc: "200ms de duración" },
  { id: "fast", label: "Rápido", desc: "100ms de duración" },
];

function TabLayout() {
  const { borderRadius, animationSpeed, compactMode, showBreadcrumbs, colors, setBorderRadius, setAnimationSpeed, setCompactMode, setShowBreadcrumbs } = useThemeStore();

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Radio de Bordes" description="Define el nivel de redondeo de los elementos de la interfaz.">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {RADIUS_OPTIONS.map((opt) => {
            const isActive = borderRadius === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setBorderRadius(opt.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${isActive ? "border-primary bg-blue-50/50" : "border-gray-100 hover:border-gray-300"}`}
              >
                <div
                  className="w-10 h-10 border-2 transition-all"
                  style={{
                    borderRadius: RADIUS_PX[opt.id],
                    borderColor: isActive ? colors.primary : "#D1D5DB",
                    backgroundColor: isActive ? colors.primary + "20" : "#F3F4F6"
                  }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.preview}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Velocidad de Animaciones" description="Controla qué tan rápido se animan los elementos de la interfaz.">
        <div className="grid grid-cols-2 gap-3">
          {ANIMATION_OPTIONS.map((opt) => {
            const isActive = animationSpeed === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAnimationSpeed(opt.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${isActive ? "border-primary bg-blue-50/50" : "border-gray-100 hover:border-gray-300"}`}
              >
                <div className={`w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${isActive ? "border-primary bg-primary" : "border-gray-300"}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Opciones de Layout" description="Ajustes de densidad y navegación.">
        <div className="divide-y divide-gray-50">
          <ToggleSwitch checked={compactMode} onChange={setCompactMode} label="Modo Compacto" description="Reduce el padding y espaciado para mostrar más contenido" />
          <ToggleSwitch checked={showBreadcrumbs} onChange={setShowBreadcrumbs} label="Mostrar Breadcrumbs" description="Muestra la ruta de navegación en la barra superior" />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Comportamiento ──────────────────────────────────────────────────────

function TabComportamiento() {
  const { loginBgUrl, dashboardBgUrl, showToasts, toastPosition, setLoginBgUrl, setDashboardBgUrl, setShowToasts, setToastPosition } = useThemeStore();

  const positions = [
    { id: "top-right" as const, label: "Arriba derecha" },
    { id: "top-left" as const, label: "Arriba izquierda" },
    { id: "bottom-right" as const, label: "Abajo derecha" },
    { id: "bottom-left" as const, label: "Abajo izquierda" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Imágenes de Fondo" description="Personaliza los fondos de las pantallas principales.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Fondo Login</p>
            <p className="text-xs text-gray-400 mb-2">Imagen de inicio de sesión (1920×1080px)</p>
            <ImageUploadCard label="Subir fondo login" description="PNG o JPG · 1920×1080px" url={loginBgUrl} onUpload={setLoginBgUrl} aspectRatio="wide" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Fondo Dashboard</p>
            <p className="text-xs text-gray-400 mb-2">Imagen para área administrativa</p>
            <ImageUploadCard label="Subir fondo dashboard" description="PNG o JPG · 1920×1080px" url={dashboardBgUrl} onUpload={setDashboardBgUrl} aspectRatio="wide" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notificaciones Toast" description="Configura cómo se muestran las notificaciones de la aplicación.">
        <div className="divide-y divide-gray-50 mb-4">
          <ToggleSwitch checked={showToasts} onChange={setShowToasts} label="Mostrar Notificaciones" description="Habilita o deshabilita los toasts de confirmación y error" />
        </div>
        {showToasts && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">Posición de las notificaciones</p>
            <div className="grid grid-cols-2 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setToastPosition(pos.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${toastPosition === pos.id ? "border-primary bg-blue-50/50 text-primary" : "border-gray-100 text-gray-600 hover:border-gray-300"}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${toastPosition === pos.id ? "bg-primary" : "bg-gray-300"}`} />
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PersonalizacionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("identidad");
  const [saved, setSaved] = useState(false);
  const { colors, appName, fontFamily, resetToDefaults, mode, primaryColor } = useThemeStore();

  const effectiveColors: ThemeColors = {
    primary: colors?.primary || primaryColor,
    secondary: colors?.secondary || "#1E293B",
    accent: colors?.accent || "#10B981",
    background: colors?.background || "#FAFAFA",
    text: colors?.text || "#171717",
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "identidad", label: "Identidad", icon: <ImageIcon /> },
    { id: "colores", label: "Colores", icon: <PaletteIcon /> },
    { id: "tipografia", label: "Tipografía", icon: <TypeIcon /> },
    { id: "layout", label: "Layout", icon: <LayoutIcon /> },
    { id: "comportamiento", label: "Comportamiento", icon: <SettingsIcon /> },
  ];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (confirm("¿Restaurar todos los valores por defecto? Esta acción no se puede deshacer.")) {
      resetToDefaults();
    }
  }

  return (
    <div className={`min-h-full ${mode === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Page Header */}
      <div className={`px-6 py-6 lg:px-8 border-b ${mode === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <div className="max-w-6xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold mt-1 ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                Identidad de Marca &amp; Diseño
              </h1>
              <p className={`text-sm mt-1 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Configura los logotipos, colores principales y estilos tipográficos de la aplicación del torneo.
              </p>
            </div>
            <button
              onClick={handleSave}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm ${saved ? "bg-green-500 text-white scale-95" : "bg-primary text-white hover:opacity-90 active:scale-95"}`}
            >
              <SaveIcon />
              {saved ? "¡Guardado!" : "Guardar Cambios"}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : mode === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8">
        <div className="max-w-6xl">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              {activeTab === "identidad" && <TabIdentidad />}
              {activeTab === "colores" && <TabColores />}
              {activeTab === "tipografia" && <TabTipografia />}
              {activeTab === "layout" && <TabLayout />}
              {activeTab === "comportamiento" && <TabComportamiento />}
            </div>
            <div className="xl:col-span-1">
              <LivePreview colors={effectiveColors} appName={appName} fontFamily={fontFamily} />
            </div>
          </div>

          {/* Bottom actions */}
          <div className={`mt-8 flex items-center justify-between gap-4 pt-5 border-t ${mode === "dark" ? "border-gray-800" : "border-gray-200"}`}>
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${mode === "dark" ? "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800"}`}
            >
              <RefreshIcon />
              Restaurar Valores por Defecto
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 shadow-sm ${saved ? "bg-green-500 scale-95" : "bg-primary hover:opacity-90 active:scale-95"}`}
            >
              <SaveIcon />
              {saved ? "¡Cambios Guardados!" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
