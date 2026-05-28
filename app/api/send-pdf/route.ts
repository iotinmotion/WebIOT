import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  escapeHtml, isValidEmail, createTransporter, mailConfig,
  resolveLogoAttachment, resolvePdfAttachment, buildPdfLeadHtml, buildClientPdfHtml,
} from "@/lib/mailer";

const clientSubject = {
  es: "Tu PDF solicitado - IOT In Motion",
  en: "Your requested PDF - IOT In Motion",
};

export async function POST(req: NextRequest) {
  const {
    nombre_apellido, email, empresa, celular, pais_localidad,
    desea_contacto, pdf, solucion, categoria, locale,
  } = await req.json();

  if (!nombre_apellido || !email || !pdf)
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  if (!isValidEmail(email))
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });

  const cfg = mailConfig();
  if (!cfg.configured)
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 500 });

  const transporter = createTransporter();
  const logoAtt = await resolveLogoAttachment();
  const pdfAtt = await resolvePdfAttachment(pdf);
  const logoUrl = logoAtt ? "cid:iot-logo" : "";

  const deseaContactoBool = ["true", "on", "1", "yes", "si", "sí"].includes(
    String(desea_contacto || "").trim().toLowerCase()
  );
  const baseUrl = (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const pdfPublicUrl = `${baseUrl}${pdf}`;

  const safeNombre = escapeHtml(nombre_apellido);
  const safeEmail = escapeHtml(email);
  const safeEmpresa = escapeHtml(empresa || "—");
  const safeCelular = escapeHtml(celular || "—");
  const safePaisLocalidad = escapeHtml(pais_localidad || "—");
  const safeSolucion = escapeHtml(solucion || "PDF solicitado");
  const safeCategoria = escapeHtml(categoria || "—");
  const safePdfName = escapeHtml(path.basename(pdf));

  const lang = (locale as "es" | "en") === "en" ? "en" : "es";

  try {
    await transporter.sendMail({
      from: cfg.from, to: cfg.to, replyTo: email,
      subject: `Nuevo lead - Descarga PDF — ${safeSolucion}`,
      html: buildPdfLeadHtml({
        logoSrc: logoUrl,
        nombre: safeNombre,
        email: safeEmail,
        empresa: safeEmpresa,
        celular: safeCelular,
        paisLocalidad: safePaisLocalidad,
        deseaContacto: deseaContactoBool,
        categoria: safeCategoria,
        solucion: safeSolucion,
        pdfFilename: safePdfName,
      }),
      attachments: logoAtt ? [logoAtt] : [],
    });
    await transporter.sendMail({
      from: cfg.from, to: email, replyTo: cfg.replyTo,
      subject: clientSubject[lang],
      html: buildClientPdfHtml({
        logoSrc: logoUrl,
        nombre: safeNombre,
        categoria: safeCategoria,
        solucion: safeSolucion,
        pdfFilename: safePdfName,
        pdfUrl: pdfPublicUrl,
      }),
      attachments: [
        ...(logoAtt ? [logoAtt] : []),
        ...(pdfAtt ? [pdfAtt] : []),
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PDF email error:", err);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
