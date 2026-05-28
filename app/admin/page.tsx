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

type Bilingual = string | { es: string; en: string };

interface NewsItem {
  _id: string;
  titulo: Bilingual;
  descripcion: Bilingual;
  fecha: string | null;
  categoria: Bilingual;
  catKey: string;
  imagenId: string | null;
}

/* ─── helpers ────────────────────────────────────────────── */
function pick(val: Bilingual | undefined, lang: "es" | "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.es || val.en || "";
}

function adminFetch(url: string, opts: RequestInit = {}) {
  const pw = sessionStorage.getItem("admin_pw") || "";
  return fetch(url, {
    ...opts,
    headers: { "x-admin-key": pw, "Content-Type": "application/json", ...opts.headers },
  });
}

/* ─── sub-components ─────────────────────────────────────── */
function ClientsTab({ pw }: { pw: string }) {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingLogoId, setPendingLogoId] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
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
    if (!confirm("Delete this client?")) return;
    await adminFetch(`/api/clients/${id}`, { method: "DELETE" });
    load();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = clients.findIndex((c) => c._id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= clients.length) return;
    const a = clients[idx], b = clients[swapIdx];
    await Promise.all([
      adminFetch(`/api/clients/${a._id}`, { method: "PUT", body: JSON.stringify({ orden: b.orden }) }),
      adminFetch(`/api/clients/${b._id}`, { method: "PUT", body: JSON.stringify({ orden: a.orden }) }),
    ]);
    load();
  }

  return (
    <div>
      {/* Add form */}
      <div style={formBox}>
        <h3 style={formTitle}>Add client</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Name</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Client name"
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Logo</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                {uploading ? "Uploading…" : pendingPreview ? "Change" : "Upload logo"}
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
            Add client
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 24 }}>
        {clients.map((c, i) => (
          <div key={c._id} style={cardStyle}>
            <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--bg-soft)", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
              {c.logoId ? (
                <Image src={`/api/images/${c.logoId}`} alt={c.nombre} fill style={{ objectFit: "contain", padding: 8 }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 11, color: "var(--ink-faint)" }}>
                  No logo
                </div>
              )}
            </div>
            <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13, color: "var(--brand-blue-deep)" }}>{c.nombre}</p>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => move(c._id, -1)} disabled={i === 0} style={arrowBtn}>↑</button>
              <button onClick={() => move(c._id, 1)} disabled={i === clients.length - 1} style={arrowBtn}>↓</button>
              <button onClick={() => deleteClient(c._id)} style={{ ...arrowBtn, color: "#c0392b", marginLeft: "auto" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const catOptions = [
    { label: "Events", key: "events" },
    { label: "Exhibition", key: "exhibition" },
    { label: "Energy", key: "energy" },
    { label: "Health", key: "health" },
    { label: "Networks", key: "networks" },
    { label: "Case Study", key: "case" },
  ];

  function load() {
    fetch("/api/news").then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  function newItem() {
    setEditing({
      titulo: { es: "", en: "" },
      descripcion: { es: "", en: "" },
      fecha: new Date().toISOString().split("T")[0],
      categoria: { es: "Eventos", en: "Events" },
      catKey: "events",
      imagenId: null,
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
    setEditing((e) => e ? { ...e, imagenId: data.id } : e);
    setPreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function save() {
    if (!editing) return;
    if (editing._id) {
      await adminFetch(`/api/news/${editing._id}`, { method: "PUT", body: JSON.stringify(editing) });
    } else {
      await adminFetch("/api/news", { method: "POST", body: JSON.stringify(editing) });
    }
    setEditing(null);
    setPreview(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this news item?")) return;
    await adminFetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  }

  function patchBilingual(field: "titulo" | "descripcion" | "categoria", lang: "es" | "en", val: string) {
    setEditing((e) => {
      if (!e) return e;
      const cur = e[field];
      const obj = typeof cur === "string" ? { es: cur, en: cur } : { ...(cur || { es: "", en: "" }) };
      obj[lang] = val;
      return { ...e, [field]: obj };
    });
  }

  return (
    <div>
      <button onClick={newItem} style={{ ...primaryBtn, marginBottom: 24 }}>+ New item</button>

      {/* Editor */}
      {editing && (
        <div style={{ ...formBox, marginBottom: 24 }}>
          <h3 style={formTitle}>{editing._id ? "Edit item" : "New item"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {(["es", "en"] as const).map((l) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--brand-blue-deep)", textTransform: "uppercase" }}>{l.toUpperCase()}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>Title</label>
                  <input value={pick(editing.titulo, l)} onChange={(e) => patchBilingual("titulo", l, e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={pick(editing.descripcion, l)} onChange={(e) => patchBilingual("descripcion", l, e.target.value)} style={{ ...inputStyle, height: 80, resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={labelStyle}>Category label</label>
                  <input value={pick(editing.categoria, l)} onChange={(e) => patchBilingual("categoria", l, e.target.value)} style={inputStyle} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Category key</label>
              <select value={editing.catKey || ""} onChange={(e) => setEditing((ed) => ed ? { ...ed, catKey: e.target.value } : ed)} style={inputStyle}>
                {catOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" value={editing.fecha?.split("T")[0] || ""} onChange={(e) => setEditing((ed) => ed ? { ...ed, fecha: e.target.value } : ed)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Image</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => fileRef.current?.click()} style={secondaryBtn}>
                  {uploading ? "Uploading…" : preview || editing.imagenId ? "Change" : "Upload image"}
                </button>
                {(preview || editing.imagenId) && (
                  <div style={{ width: 60, height: 38, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)" }}>
                    <Image src={preview || `/api/images/${editing.imagenId}`} alt="" fill style={{ objectFit: "cover" }} />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={save} style={primaryBtn}>Save</button>
            <button onClick={() => { setEditing(null); setPreview(null); }} style={secondaryBtn}>Cancel</button>
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
                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 10, color: "var(--ink-faint)" }}>No img</div>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--brand-blue-deep)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {pick(n.titulo, "es")}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-faint)" }}>
                {n.catKey} · {n.fecha ? new Date(n.fecha).toLocaleDateString() : "—"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => { setEditing(n); setPreview(null); }} style={secondaryBtn}>Edit</button>
              <button onClick={() => del(n._id)} style={{ ...secondaryBtn, color: "#c0392b" }}>Delete</button>
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
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ ...secondaryBtn, textDecoration: "none" }}>← Back to site</a>
            <button onClick={() => { sessionStorage.removeItem("admin_pw"); setPw(""); }} style={secondaryBtn}>
              Sign out
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
                cursor: "pointer", textTransform: "capitalize",
              }}
            >{t === "clients" ? "Clients" : "News"}</button>
          ))}
        </div>

        {tab === "clients" ? <ClientsTab pw={pw} /> : <NewsTab pw={pw} />}
      </div>
    </div>
  );
}
