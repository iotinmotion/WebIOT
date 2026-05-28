"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── types ─────────────────────────────────────────────── */
interface Cliente {
  _id: string;
  nombre: string;
  logoId: string | null;
  orden: number;
}

interface NewsItem {
  _id: string;
  titulo: { es: string; en: string };
  descripcion: { es: string; en: string };
  fecha: string | null;
  categoria: { es: string; en: string };
  catKey: string;
  imagenId: string | null;
  link: string | null;
}

interface NewsForm {
  _id?: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  category_es: string;
  category_en: string;
  date: string;
  imagenId: string | null;
  link: string;
}

/* ─── translations ───────────────────────────────────────── */
const uiText = {
  es: {
    backToSite: "← Volver al sitio",
    signOut: "Cerrar sesión",
    clients: "Clientes",
    news: "Novedades",
    addClient: "Agregar cliente",
    name: "Nombre",
    logo: "Logo",
    uploadLogo: "Subir logo",
    change: "Cambiar",
    uploading: "Subiendo…",
    dragHint: "Arrastrá las tarjetas para reordenar",
    delete: "Eliminar",
    newItem: "+ Nueva novedad",
    editItem: "Editar novedad",
    createItem: "Nueva novedad",
    title: "Título",
    summary: "Resumen",
    category: "Categoría",
    date: "Fecha",
    link: "Enlace",
    image: "Imagen",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    uploadImage: "Subir imagen",
    noLogo: "Sin logo",
    noImg: "Sin imagen",
    deleteClientConfirm: "¿Eliminar este cliente?",
    deleteNewsConfirm: "¿Eliminar esta novedad?",
  },
  en: {
    backToSite: "← Back to site",
    signOut: "Sign out",
    clients: "Clients",
    news: "News",
    addClient: "Add client",
    name: "Name",
    logo: "Logo",
    uploadLogo: "Upload logo",
    change: "Change",
    uploading: "Uploading…",
    dragHint: "Drag cards to reorder",
    delete: "Delete",
    newItem: "+ New item",
    editItem: "Edit item",
    createItem: "New item",
    title: "Title",
    summary: "Summary",
    category: "Category",
    date: "Date",
    link: "Link",
    image: "Image",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    uploadImage: "Upload image",
    noLogo: "No logo",
    noImg: "No img",
    deleteClientConfirm: "Delete this client?",
    deleteNewsConfirm: "Delete this news item?",
  },
} as const;
type Lang = keyof typeof uiText;

/* ─── helpers ────────────────────────────────────────────── */
function adminFetch(url: string, opts: RequestInit = {}) {
  const pw = sessionStorage.getItem("admin_pw") || "";
  return fetch(url, {
    ...opts,
    headers: { "x-admin-key": pw, "Content-Type": "application/json", ...opts.headers },
  });
}

/* ─── sub-components ─────────────────────────────────────── */
function ClientsTab({ pw, lang }: { pw: string; lang: Lang }) {
  const ui = uiText[lang];
  const [clients, setClients] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingLogoId, setPendingLogoId] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }
  useEffect(load, []);

  async function uploadLogo(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": pw },
      body: fd,
    });
    const data = await res.json();
    setPendingLogoId(data.id);
    setPendingPreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function addClient() {
    if (!nombre.trim()) return;
    await adminFetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({ nombre: nombre.trim(), logoId: pendingLogoId, orden: clients.length }),
    });
    setNombre("");
    setPendingLogoId(null);
    setPendingPreview(null);
    load();
  }

  async function deleteClient(id: string) {
    if (!confirm(ui.deleteClientConfirm)) return;
    await adminFetch(`/api/clients/${id}`, { method: "DELETE" });
    load();
  }

  async function saveOrder(ordered: Cliente[]) {
    await Promise.all(
      ordered.map((c, i) =>
        adminFetch(`/api/clients/${c._id}`, { method: "PUT", body: JSON.stringify({ orden: i }) })
      )
    );
  }

  function onDragStart(i: number) {
    dragIndex.current = i;
  }

  function onDragEnter(i: number) {
    setDragOver(i);
  }

  function onDragEnd() {
    const from = dragIndex.current;
    const to = dragOver;
    setDragOver(null);
    dragIndex.current = null;
    if (from === null || to === null || from === to) return;
    const reordered = [...clients];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setClients(reordered);
    saveOrder(reordered);
  }

  return (
    <div>
      {/* Add form */}
      <div style={formBox}>
        <h3 style={formTitle}>{ui.addClient}</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>{ui.name}</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={ui.name}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>{ui.logo}</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                {uploading ? ui.uploading : pendingPreview ? ui.change : ui.uploadLogo}
              </button>
              {pendingPreview && (
                <div style={{ width: 48, height: 30, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)" }}>
                  <Image src={pendingPreview} alt="" fill style={{ objectFit: "contain" }} />
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
              />
            </div>
          </div>
          <button onClick={addClient} style={primaryBtn} disabled={!nombre.trim()}>
            {ui.addClient}
          </button>
        </div>
      </div>

      {/* Drag hint pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        margin: "20px 0 14px",
        padding: "7px 14px 7px 10px",
        borderRadius: 999,
        background: "color-mix(in oklab, var(--brand-blue-deep) 7%, var(--bg-card))",
        border: "1px solid color-mix(in oklab, var(--brand-blue-deep) 22%, transparent)",
        fontSize: 12, fontWeight: 600,
        color: "var(--brand-blue-deep)",
        letterSpacing: "0.03em",
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          {[0, 4, 8].map((y) => [0, 4, 8].map((x) => (
            <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.1" fill="currentColor" />
          )))}
        </svg>
        {ui.dragHint}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {clients.map((c, i) => (
          <div
            key={c._id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={onDragEnd}
            style={{
              ...cardStyle,
              cursor: "grab",
              outline: dragOver === i ? "2px solid var(--brand-blue-deep)" : "none",
              opacity: dragIndex.current === i ? 0.4 : 1,
              transition: "opacity 0.15s, outline 0.15s",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg-soft)", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
              {c.logoId ? (
                <Image src={`/api/images/${c.logoId}`} alt={c.nombre} fill style={{ objectFit: "contain", padding: 8 }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 11, color: "var(--ink-faint)" }}>
                  {ui.noLogo}
                </div>
              )}
            </div>
            <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13, color: "var(--brand-blue-deep)" }}>{c.nombre}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-faint)", flexShrink: 0 }}>
                {[0, 5, 10].map((y) => [0, 5, 10].map((x) => (
                  <circle key={`${x}-${y}`} cx={3 + x} cy={3 + y} r="1.2" fill="currentColor" />
                )))}
              </svg>
              <button onClick={() => deleteClient(c._id)} style={{ ...arrowBtn, color: "#c0392b" }}>{ui.delete}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab({ pw, lang }: { pw: string; lang: Lang }) {
  const ui = uiText[lang];
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsForm | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    fetch("/api/news").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  function blankForm(): NewsForm {
    return {
      title_es: "", title_en: "",
      summary_es: "", summary_en: "",
      category_es: "Eventos", category_en: "Events",
      date: new Date().toISOString().split("T")[0],
      imagenId: null, link: "",
    };
  }

  function openEdit(n: NewsItem) {
    setForm({
      _id: n._id,
      title_es: n.titulo.es, title_en: n.titulo.en,
      summary_es: n.descripcion.es, summary_en: n.descripcion.en,
      category_es: n.categoria.es, category_en: n.categoria.en,
      date: n.fecha ? n.fecha.split("T")[0] : "",
      imagenId: n.imagenId,
      link: n.link || "",
    });
    setPreview(null);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": pw },
      body: fd,
    });
    const data = await res.json();
    setForm((f) => f ? { ...f, imagenId: data.id } : f);
    setPreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function save() {
    if (!form) return;
    const payload = { ...form };
    if (form._id) {
      await adminFetch(`/api/news/${form._id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await adminFetch("/api/news", { method: "POST", body: JSON.stringify(payload) });
    }
    setForm(null);
    setPreview(null);
    load();
  }

  async function del(id: string) {
    if (!confirm(ui.deleteNewsConfirm)) return;
    await adminFetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  }

  function patch(key: keyof NewsForm, val: string) {
    setForm((f) => f ? { ...f, [key]: val } : f);
  }

  return (
    <div>
      <button onClick={() => { setForm(blankForm()); setPreview(null); }} style={{ ...primaryBtn, marginBottom: 24 }}>
        {ui.newItem}
      </button>

      {/* Editor */}
      {form && (
        <div style={{ ...formBox, marginBottom: 24 }}>
          <h3 style={formTitle}>{form._id ? ui.editItem : ui.createItem}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {(["es", "en"] as const).map((l) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--brand-blue-deep)", textTransform: "uppercase" }}>{l.toUpperCase()}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>{ui.title}</label>
                  <input value={l === "es" ? form.title_es : form.title_en} onChange={(e) => patch(l === "es" ? "title_es" : "title_en", e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>{ui.summary}</label>
                  <textarea value={l === "es" ? form.summary_es : form.summary_en} onChange={(e) => patch(l === "es" ? "summary_es" : "summary_en", e.target.value)} style={{ ...inputStyle, height: 80, resize: "vertical" as const }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>{ui.category}</label>
                  <input value={l === "es" ? form.category_es : form.category_en} onChange={(e) => patch(l === "es" ? "category_es" : "category_en", e.target.value)} style={inputStyle} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>{ui.date}</label>
              <input type="date" value={form.date} onChange={(e) => patch("date", e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 200 }}>
              <label style={labelStyle}>{ui.link}</label>
              <input value={form.link} onChange={(e) => patch("link", e.target.value)} placeholder="https://..." style={{ ...inputStyle, width: "100%", boxSizing: "border-box" as const }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>{ui.image}</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                  {uploading ? ui.uploading : preview || form.imagenId ? ui.change : ui.uploadImage}
                </button>
                {(preview || form.imagenId) && (
                  <div style={{ width: 60, height: 38, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)" }}>
                    <Image src={preview || `/api/images/${form.imagenId}`} alt="" fill style={{ objectFit: "cover" }} />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={save} style={primaryBtn}>{ui.save}</button>
            <button onClick={() => { setForm(null); setPreview(null); }} style={secondaryBtn}>{ui.cancel}</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((n) => (
          <div key={n._id} style={{ ...cardStyle, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 80, height: 50, position: "relative", borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "var(--bg-soft)" }}>
              {n.imagenId
                ? <Image src={`/api/images/${n.imagenId}`} alt="" fill style={{ objectFit: "cover" }} />
                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 10, color: "var(--ink-faint)" }}>{ui.noImg}</div>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--brand-blue-deep)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {n.titulo[lang]}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-faint)" }}>
                {n.categoria[lang]} · {n.fecha ? new Date(n.fecha).toLocaleDateString(lang === "es" ? "es-AR" : "en-US") : "—"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => openEdit(n)} style={secondaryBtn}>{ui.edit}</button>
              <button onClick={() => del(n._id)} style={{ ...secondaryBtn, color: "#c0392b" }}>{ui.delete}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── shared styles ──────────────────────────────────────── */
const formBox: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: "24px 28px",
};
const formTitle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 15,
  fontWeight: 700,
  color: "var(--brand-blue-deep)",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};
const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  background: "var(--bg-soft)",
  fontSize: 14,
  color: "var(--brand-blue-deep)",
  outline: "none",
  minWidth: 180,
};
const primaryBtn: React.CSSProperties = {
  padding: "9px 20px",
  borderRadius: 8,
  background: "var(--brand-blue-deep)",
  color: "white",
  fontWeight: 700,
  fontSize: 13,
  border: "none",
  cursor: "pointer",
};
const secondaryBtn: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 8,
  background: "var(--bg-soft)",
  color: "var(--brand-blue-deep)",
  fontWeight: 600,
  fontSize: 13,
  border: "1px solid var(--line-strong)",
  cursor: "pointer",
};
const arrowBtn: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 6,
  background: "var(--bg-soft)",
  color: "var(--brand-blue-deep)",
  fontWeight: 600,
  fontSize: 12,
  border: "1px solid var(--line)",
  cursor: "pointer",
};
const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  padding: "14px",
};

/* ─── main page ──────────────────────────────────────────── */
export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"clients" | "news">("clients");
  const [lang, setLang] = useState<Lang>("es");
  const ui = uiText[lang];

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) setPw(stored);
  }, []);

  async function login() {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_pw", input);
      setPw(input);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!pw) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-soft)",
      }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--line)",
          borderRadius: 20, padding: "40px 48px", width: 360,
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--brand-blue-deep)" }}>
            Admin Panel
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>IOT in Motion</p>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
          />
          {error && <p style={{ margin: 0, fontSize: 13, color: "#c0392b" }}>Incorrect password</p>}
          <button onClick={login} style={{ ...primaryBtn, width: "100%" }}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-soft)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--brand-blue-deep)" }}>Admin Panel</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--ink-faint)" }}>IOT in Motion</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Language toggle */}
            <div style={{
              display: "flex", borderRadius: 8, overflow: "hidden",
              border: "1px solid var(--line-strong)",
            }}>
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: "8px 14px", border: "none", cursor: "pointer",
                    background: lang === l ? "var(--brand-blue-deep)" : "var(--bg-card)",
                    color: lang === l ? "white" : "var(--brand-blue-deep)",
                    fontWeight: 700, fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >{l}</button>
              ))}
            </div>
            <a href="/" style={{ ...secondaryBtn, textDecoration: "none" }}>{ui.backToSite}</a>
            <button onClick={() => { sessionStorage.removeItem("admin_pw"); setPw(""); }} style={secondaryBtn}>
              {ui.signOut}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {(["clients", "news"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 22px", borderRadius: 10,
                background: tab === t ? "var(--brand-blue-deep)" : "var(--bg-card)",
                color: tab === t ? "white" : "var(--brand-blue-deep)",
                fontWeight: 700, fontSize: 14, border: "1px solid var(--line-strong)",
                cursor: "pointer",
              }}
            >{t === "clients" ? ui.clients : ui.news}</button>
          ))}
        </div>

        {tab === "clients" ? <ClientsTab pw={pw} lang={lang} /> : <NewsTab pw={pw} lang={lang} />}
      </div>
    </div>
  );
}
