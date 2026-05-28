import { NextRequest, NextResponse } from "next/server";
import {
  escapeHtml, isValidEmail, createTransporter, mailConfig,
  resolveLogoAttachment, buildContactLeadHtml, buildClientContactHtml,
} from "@/lib/mailer";

const clientSubject = {
  es: "Recibimos tu mensaje - IOT In Motion",
  en: "We received your message - IOT In Motion",
};

export async function POST(req: NextRequest) {
  const { email, subject, interes, message, locale } = await req.json();

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
  const safeMessage = escapeHtml(message);
  const lang = (locale as "es" | "en") === "en" ? "en" : "es";

  try {
    await transporter.sendMail({
      from: cfg.from, to: cfg.to, replyTo: email,
      subject: `Nuevo contacto - ${safeSubject}`,
      html: buildContactLeadHtml({
        logoSrc: logoUrl,
        email: safeEmail,
        asunto: safeSubject,
        area: safeInteres,
        mensaje: safeMessage,
      }),
      attachments,
    });
    await transporter.sendMail({
      from: cfg.from, to: email, replyTo: cfg.replyTo,
      subject: clientSubject[lang],
      html: buildClientContactHtml({
        logoSrc: logoUrl,
        nombre: "",
        asunto: safeSubject,
        area: safeInteres,
        mensaje: safeMessage,
      }),
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
