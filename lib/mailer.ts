import nodemailer from "nodemailer";
import path from "path";
import { promises as fs } from "fs";

const getEnv = (key: string) => (process.env[key] || "").trim();

export const escapeHtml = (value: unknown) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const isValidEmail = (value: unknown) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export function createTransporter() {
  const port = Number(getEnv("SMTP_PORT") || "587");
  const tls = getEnv("SMTP_TLS");
  return nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port,
    secure: port === 465,
    requireTLS: tls ? tls.toLowerCase() === "true" : undefined,
    auth: { user: getEnv("SMTP_USER"), pass: getEnv("SMTP_PASS") },
  });
}

export function mailConfig() {
  const from = getEnv("MAIL_FROM");
  const to = getEnv("MAIL_TO");
  return {
    from,
    to,
    replyTo: getEnv("MAIL_REPLY_TO") || from,
    configured: !!getEnv("SMTP_HOST") && !!getEnv("SMTP_USER") && !!getEnv("SMTP_PASS") && !!from && !!to,
  };
}

export const buildEmailShell = ({ title, logoUrl, bodyHtml }: { title: string; logoUrl: string; bodyHtml: string }) => `
  <div style="background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;">
      ${logoUrl ? `<div style="text-align:center;margin-bottom:16px;"><img src="${logoUrl}" alt="IOT In Motion" style="max-width:140px;height:auto;" /></div>` : ""}
      <h1 style="text-align:center;font-size:20px;margin:0 0 16px 0;color:#0f172a;">${title}</h1>
      ${bodyHtml}
    </div>
  </div>
`;

export const buildNoticeBox = (content: string) => `
  <div style="margin-top:16px;padding:14px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a;font-size:13px;">${content}</div>
`;

const publicDir = path.join(process.cwd(), "public");

export async function resolveLogoAttachment() {
  const logoPath = path.join(publicDir, "logo.png");
  try {
    const data = await fs.readFile(logoPath);
    return { filename: "iot-logo.png", content: data, contentType: "image/png", cid: "iot-logo" };
  } catch {
    return null;
  }
}

export async function resolvePdfAttachment(pdfPath: string) {
  if (!pdfPath || !pdfPath.startsWith("/pdfs/")) return null;
  const normalized = path.normalize(pdfPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(publicDir, normalized);
  if (!fullPath.startsWith(publicDir)) return null;
  try {
    const data = await fs.readFile(fullPath);
    return { filename: path.basename(fullPath), content: data, contentType: "application/pdf" };
  } catch {
    return null;
  }
}
