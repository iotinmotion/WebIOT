import { NextRequest, NextResponse } from "next/server";
import {
  escapeHtml, isValidEmail, createTransporter, mailConfig,
  buildEmailShell, buildNoticeBox, resolveLogoAttachment,
} from "@/lib/mailer";

const copy = {
  es: {
    subject: "Recibimos tu mensaje - IOT In Motion",
    title: "Gracias por tu mensaje",
    intro: "Recibimos tu mensaje y nos contactaremos a la brevedad.",
    labelSubject: "Asunto",
    labelInteres: "Área de interés",
    labelMessage: "Mensaje",
    notice: (r: string) => `Si necesitás agregar algo más, respondé a este correo o escribinos a ${escapeHtml(r)}.`,
  },
  en: {
    subject: "We received your message - IOT In Motion",
    title: "Thank you for your message",
    intro: "We received your message and will get back to you shortly.",
    labelSubject: "Subject",
    labelInteres: "Area of interest",
    labelMessage: "Message",
    notice: (r: string) => `If you need to add anything else, reply to this email or write to us at ${escapeHtml(r)}.`,
  },
};

export async function POST(req: NextRequest) {
  const { email, subject, interes, message, locale, origen } = await req.json();

  if (!email || !subject || !message)
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  if (!isValidEmail(email))
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });

  const cfg = mailConfig();
  if (!cfg.configured)
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 500 });

  const transporter = createTransporter();
  const logoAtt = await resolveLogoAttachment();
  const logoUrl = logoAtt ? "cid:iot-logo" : "";
  const attachments = logoAtt ? [logoAtt] : [];

  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeInteres = escapeHtml(interes || "");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeOrigen = escapeHtml(origen || "Formulario de contacto");

  const leadBody = `
    <p style="margin:0 0 4px 0;color:#475569;font-size:13px;">Email:</p>
    <p style="margin:0 0 12px 0;color:#0f172a;font-size:14px;font-weight:600;">${safeEmail}</p>
    <p style="margin:0 0 4px 0;color:#475569;font-size:13px;">Asunto:</p>
    <p style="margin:0 0 12px 0;color:#0f172a;font-size:14px;font-weight:600;">${safeSubject}</p>
    ${safeInteres ? `<p style="margin:0 0 4px 0;color:#475569;font-size:13px;">Área de interés:</p><p style="margin:0 0 12px 0;color:#0f172a;font-size:14px;font-weight:600;">${safeInteres}</p>` : ""}
    <p style="margin:0 0 4px 0;color:#475569;font-size:13px;">Mensaje:</p>
    <div style="padding:12px;border-radius:12px;background:#f1f5f9;color:#0f172a;font-size:13px;border:1px solid #e2e8f0;margin-bottom:12px;">${safeMessage}</div>
    <p style="margin:0;color:#64748b;font-size:12px;">Origen: ${safeOrigen}</p>
  `;

  const t = copy[locale as "es" | "en"] ?? copy.es;

  const clientBody = `
    <p style="margin:0 0 16px 0;color:#0f172a;font-size:14px;text-align:center;">${t.intro}</p>
    <div style="padding:14px;border-radius:12px;background:#f1f5f9;border:1px solid #e2e8f0;margin-bottom:4px;">
      <p style="margin:0 0 4px 0;color:#475569;font-size:13px;">${t.labelSubject}:</p>
      <p style="margin:0 0 12px 0;color:#0f172a;font-size:14px;font-weight:600;">${safeSubject}</p>
      ${safeInteres ? `<p style="margin:0 0 4px 0;color:#475569;font-size:13px;">${t.labelInteres}:</p><p style="margin:0 0 12px 0;color:#0f172a;font-size:14px;font-weight:600;">${safeInteres}</p>` : ""}
      <p style="margin:0 0 4px 0;color:#475569;font-size:13px;">${t.labelMessage}:</p>
      <p style="margin:0;color:#0f172a;font-size:13px;">${safeMessage}</p>
    </div>
    ${buildNoticeBox(t.notice(cfg.replyTo))}
  `;

  try {
    await transporter.sendMail({
      from: cfg.from, to: cfg.to, replyTo: safeEmail,
      subject: `Nuevo contacto - ${safeSubject}`,
      html: buildEmailShell({ title: "Nuevo contacto desde la web", logoUrl, bodyHtml: leadBody }),
      attachments,
    });
    await transporter.sendMail({
      from: cfg.from, to: email, replyTo: cfg.replyTo,
      subject: t.subject,
      html: buildEmailShell({ title: t.title, logoUrl, bodyHtml: clientBody }),
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
