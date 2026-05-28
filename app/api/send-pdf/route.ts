import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  escapeHtml, isValidEmail, createTransporter, mailConfig,
  buildEmailShell, buildNoticeBox, resolveLogoAttachment, resolvePdfAttachment,
} from "@/lib/mailer";

const copy = {
  es: {
    subject: "Tu PDF solicitado - IOT In Motion",
    title: "&iexcl;Nos alegra tu inter&eacute;s en nuestras soluciones!",
    intro: "Adjuntamos en el correo más información acerca de la solución que desarrollamos.",
    callout: "Estamos atentos a tus consultas o, si preferís, agendamos una reunión para conocer tus necesidades.",
    notice: (url: string) => `Si no podés abrirlo, te adjuntamos el link aquí: <a href="${url}" style="color:#2563eb;text-decoration:none;font-weight:600;">${url}</a>`,
  },
  en: {
    subject: "Your requested PDF - IOT In Motion",
    title: "We&rsquo;re glad you&rsquo;re interested in our solutions!",
    intro: "We've attached more information about the solution we developed.",
    callout: "We're happy to answer any questions, or we can schedule a meeting to learn more about your needs.",
    notice: (url: string) => `If you can't open the attachment, here's the direct link: <a href="${url}" style="color:#2563eb;text-decoration:none;font-weight:600;">${url}</a>`,
  },
};

export async function POST(req: NextRequest) {
  const {
    nombre_apellido, email, empresa, celular, pais_localidad,
    desea_contacto, pdf, solucion, categoria, locale, origen,
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
  const safeEmpresa = escapeHtml(empresa || "-");
  const safeCelular = escapeHtml(celular || "-");
  const safePaisLocalidad = escapeHtml(pais_localidad || "-");
  const safeSolucion = escapeHtml(solucion || "PDF solicitado");
  const safeCategoria = escapeHtml(categoria || "-");
  const safeOrigen = escapeHtml(origen || "Descarga PDF");
  const safePdfName = escapeHtml(path.basename(pdf));

  const leadBody = `
    <ul style="margin:0;padding-left:16px;color:#0f172a;font-size:13px;line-height:1.5;">
      <li style="margin-bottom:8px;"><strong>Nombre y apellido:</strong> ${safeNombre}</li>
      <li style="margin-bottom:8px;"><strong>Email:</strong> ${safeEmail}</li>
      <li style="margin-bottom:8px;"><strong>Empresa:</strong> ${safeEmpresa}</li>
      <li style="margin-bottom:8px;"><strong>Celular:</strong> ${safeCelular}</li>
      <li style="margin-bottom:8px;"><strong>País/Localidad:</strong> ${safePaisLocalidad}</li>
      <li style="margin-bottom:8px;"><strong>Desea ser contactado:</strong> ${deseaContactoBool ? "Sí" : "No"}</li>
      <li style="margin-bottom:8px;"><strong>Categoría:</strong> ${safeCategoria}</li>
      <li style="margin-bottom:8px;"><strong>Solución:</strong> ${safeSolucion}</li>
      <li style="margin-bottom:0;"><strong>PDF:</strong> ${safePdfName}</li>
    </ul>
    <p style="margin:8px 0 0;color:#64748b;font-size:12px;">Origen: ${safeOrigen}</p>
  `;

  const t = copy[locale as "es" | "en"] ?? copy.es;

  const clientBody = `
    <p style="margin:0 0 10px 0;color:#0f172a;font-size:14px;text-align:center;">${t.intro}</p>
    <p style="margin:0 0 6px 0;color:#0f172a;font-size:14px;text-align:center;"><strong>${t.callout}</strong></p>
    ${buildNoticeBox(t.notice(pdfPublicUrl))}
  `;

  try {
    await transporter.sendMail({
      from: cfg.from, to: cfg.to, replyTo: safeEmail,
      subject: "Nuevo lead - Descarga PDF",
      html: buildEmailShell({ title: "Se solicitó un PDF desde \"Soluciones\"", logoUrl, bodyHtml: leadBody }),
      attachments: logoAtt ? [logoAtt] : [],
    });
    await transporter.sendMail({
      from: cfg.from, to: email, replyTo: cfg.replyTo,
      subject: t.subject,
      html: buildEmailShell({ title: t.title, logoUrl, bodyHtml: clientBody }),
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
