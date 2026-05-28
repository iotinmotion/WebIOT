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

/* ─── Simple shell for client-facing confirmation emails ─── */
export const buildEmailShell = ({ title, logoUrl, bodyHtml }: { title: string; logoUrl: string; bodyHtml: string }) => `
  <div style="background:#f4f6fb;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a2233;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e6e9f0;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -28px rgba(43,71,134,0.28);">
      <div style="height:4px;background:linear-gradient(90deg,#2B4786 0%,#82C2C9 60%,#E34C2C 100%);"></div>
      <div style="padding:28px 40px;">
        ${logoUrl ? `<div style="margin-bottom:20px;"><img src="${logoUrl}" alt="IoT in Motion" style="height:44px;width:auto;display:block;" /></div>` : ""}
        <h1 style="font-size:22px;margin:0 0 16px;color:#2B4786;font-weight:600;letter-spacing:-0.01em;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="background:#2B4786;padding:18px 40px;">
        <p style="margin:0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);text-align:center;">IoT in Motion · Soluciones IoT</p>
      </div>
    </div>
  </div>
`;

export const buildNoticeBox = (content: string) => `
  <div style="margin-top:16px;padding:14px;border-radius:12px;background:#eef4f5;border:1px solid #d8e6e8;color:#2B4786;font-size:13px;">${content}</div>
`;

/* ─── Attachment helpers ─────────────────────────────────── */
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

/* ─── Branded internal lead email templates ─────────────── */

export function buildContactLeadHtml({
  logoSrc,
  email,
  asunto,
  area,
  mensaje,
}: {
  logoSrc: string;
  email: string;
  asunto: string;
  area: string;
  mensaje: string;
}) {
  const logoTag = logoSrc
    ? `<img src="${logoSrc}" width="110" height="54" alt="IoT in Motion" style="height:54px;width:auto;display:block;" />`
    : `<strong style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.1em;color:#2B4786;">IOT IN MOTION</strong>`;

  const areaRow = area ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #eef0f5;">
                <tr>
                  <td style="padding: 14px 0;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;margin-bottom:8px;">Área de interés</div>
                    <span style="display:inline-block;background:#eef4f5;color:#2B4786;font-size:12px;font-weight:600;padding:6px 12px;border-radius:999px;letter-spacing:0.01em;border:1px solid #d8e6e8;">${area}</span>
                  </td>
                </tr>
              </table>` : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Nuevo contacto desde la web — IoT in Motion</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;display:block;}
  body{margin:0!important;padding:0!important;width:100%!important;}
  a{color:#2B4786;}
  @media screen and (max-width:620px){
    .card{width:100%!important;border-radius:0!important;}
    .pad-x{padding-left:24px!important;padding-right:24px!important;}
    .title{font-size:22px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a2233;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">
    Nuevo mensaje recibido desde el formulario de contacto de iotinmotion.com
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -28px rgba(43,71,134,0.28);border:1px solid #e6e9f0;">

          <tr><td style="height:4px;background:linear-gradient(90deg,#2B4786 0%,#82C2C9 60%,#E34C2C 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 22px 40px;border-bottom:1px solid #eef0f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">${logoTag}</td>
                  <td align="right" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;">Notificación · interna</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:32px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E34C2C;box-shadow:0 0 0 4px rgba(227,76,44,0.18);">&nbsp;</span></td>
                  <td valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.20em;text-transform:uppercase;color:#E34C2C;font-weight:600;">Nuevo contacto recibido</td>
                </tr>
              </table>
              <h1 class="title" style="margin:14px 0 6px 0;font-size:26px;line-height:1.2;letter-spacing:-0.02em;color:#2B4786;font-weight:600;">Nuevo contacto desde la web</h1>
              <p style="margin:0;font-size:14px;line-height:1.55;color:#5b6577;">Un visitante completó el formulario en <span style="color:#2B4786;font-weight:500;">iotinmotion.com</span>. Detalles a continuación.</p>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 8px 40px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #eef0f5;">
                <tr>
                  <td style="padding:0 0 14px 0;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;margin-bottom:6px;">Email</div>
                    <a href="mailto:${email}" style="font-size:15px;font-weight:600;color:#2B4786;text-decoration:none;border-bottom:1px solid rgba(43,71,134,0.25);padding-bottom:1px;">${email}</a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #eef0f5;">
                <tr>
                  <td style="padding:14px 0;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;margin-bottom:6px;">Asunto</div>
                    <div style="font-size:15px;font-weight:600;color:#1a2233;">${asunto}</div>
                  </td>
                </tr>
              </table>

              ${areaRow}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:18px 0 4px 0;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;margin-bottom:10px;">Mensaje</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#f1f7f8;border-left:3px solid #82C2C9;border-radius:10px;padding:18px 20px;font-size:14.5px;line-height:1.6;color:#1a2233;white-space:pre-wrap;">${mensaje}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:22px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#2B4786" style="border-radius:999px;">
                    <a href="mailto:${email}?subject=Re%3A%20${encodeURIComponent(asunto)}" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.005em;">Responder a ${email} &nbsp;→</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#2B4786;padding:22px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Origen · Formulario de contacto</td>
                  <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.45);">iotinmotion.com</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin-top:18px;">
          <tr>
            <td align="center" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a1aabb;padding:0 24px;">IoT in Motion · Soluciones IoT</td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ─── Branded client-facing confirmation email templates ─── */

export function buildClientContactHtml({
  logoSrc,
  nombre,
  asunto,
  area,
  mensaje,
}: {
  logoSrc: string;
  nombre: string;
  asunto: string;
  area: string;
  mensaje: string;
}) {
  const logoTag = logoSrc
    ? `<img src="${logoSrc}" width="110" height="54" alt="IoT in Motion" style="height:54px;width:auto;display:block;" />`
    : `<strong style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.1em;color:#2B4786;">IOT IN MOTION</strong>`;

  const greeting = nombre
    ? `Hola <strong style="color:#1a2233;">${nombre}</strong>, recibimos tu mensaje y nos contactaremos a la brevedad.`
    : `Hola, recibimos tu mensaje y nos contactaremos a la brevedad.`;

  const areaBlock = area
    ? `<div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;margin-bottom:6px;">Área de interés</div>
                    <div style="margin-bottom:16px;"><span style="display:inline-block;background:#ffffff;color:#2B4786;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;letter-spacing:0.01em;border:1px solid #d8e6e8;">${area}</span></div>`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Gracias por tu mensaje — IoT in Motion</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;display:block;}
  body{margin:0!important;padding:0!important;width:100%!important;}
  a{color:#2B4786;}
  @media screen and (max-width:620px){
    .card{width:100%!important;border-radius:0!important;}
    .pad-x{padding-left:24px!important;padding-right:24px!important;}
    .title{font-size:24px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a2233;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">
    Recibimos tu mensaje y nos contactaremos a la brevedad.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -28px rgba(43,71,134,0.28);border:1px solid #e6e9f0;">

          <tr><td style="height:4px;background:linear-gradient(90deg,#2B4786 0%,#82C2C9 60%,#E34C2C 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 22px 40px;border-bottom:1px solid #eef0f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">${logoTag}</td>
                  <td align="right" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;">Confirmación</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:36px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#82C2C9;box-shadow:0 0 0 4px rgba(130,194,201,0.22);">&nbsp;</span></td>
                  <td valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.20em;text-transform:uppercase;color:#2B4786;font-weight:600;">Mensaje recibido</td>
                </tr>
              </table>
              <h1 class="title" style="margin:14px 0 10px 0;font-size:28px;line-height:1.18;letter-spacing:-0.02em;color:#2B4786;font-weight:600;">Gracias por tu <span style="color:#82C2C9;font-style:italic;font-weight:500;">mensaje</span></h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6577;">${greeting}</p>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f7f8;border:1px solid #d8e6e8;border-radius:14px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5b8a91;margin-bottom:14px;">Tu mensaje</div>
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;margin-bottom:4px;">Asunto</div>
                    <div style="font-size:15px;font-weight:600;color:#1a2233;margin-bottom:14px;">${asunto}</div>
                    ${areaBlock}
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;margin-bottom:6px;">Mensaje</div>
                    <div style="background:#ffffff;border-left:3px solid #82C2C9;border-radius:8px;padding:14px 16px;font-size:14.5px;line-height:1.6;color:#1a2233;white-space:pre-wrap;">${mensaje}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:16px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef4fb;border:1px solid #dde6f3;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13.5px;line-height:1.55;color:#5b6577;">
                    Si necesitás agregar algo más, respondé a este correo o escribinos a
                    <a href="mailto:marketing@iotinmotion.com.ar" style="color:#2B4786;font-weight:600;text-decoration:underline;text-underline-offset:2px;">marketing@iotinmotion.com.ar</a>.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:22px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#2B4786" style="border-radius:999px;">
                    <a href="https://iotinmotion.com.ar/#soluciones" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.005em;">Explorar soluciones &nbsp;→</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:4px 40px 32px 40px;border-top:1px solid #eef0f5;">
              <p style="margin:22px 0 4px 0;font-size:14px;color:#5b6577;line-height:1.55;">Un saludo,</p>
              <p style="margin:0;font-size:15px;color:#2B4786;font-weight:600;letter-spacing:-0.01em;">Equipo IoT in Motion</p>
              <p style="margin:2px 0 0 0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;color:#8a93a8;letter-spacing:0.06em;">marketing@iotinmotion.com.ar &nbsp;·&nbsp; iotinmotion.com.ar</p>
            </td>
          </tr>

          <tr>
            <td style="background:#2B4786;padding:22px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">IoT in Motion · Soluciones IoT</td>
                  <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.45);">iotinmotion.com.ar</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin-top:18px;">
          <tr>
            <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.55;color:#a1aabb;padding:0 24px;">
              Recibís este correo porque completaste el formulario de contacto en nuestro sitio.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildClientPdfHtml({
  logoSrc,
  nombre,
  categoria,
  solucion,
  pdfFilename,
  pdfUrl,
}: {
  logoSrc: string;
  nombre: string;
  categoria: string;
  solucion: string;
  pdfFilename: string;
  pdfUrl: string;
}) {
  const logoTag = logoSrc
    ? `<img src="${logoSrc}" width="110" height="54" alt="IoT in Motion" style="height:54px;width:auto;display:block;" />`
    : `<strong style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.1em;color:#2B4786;">IOT IN MOTION</strong>`;

  const safePdfUrl = escapeHtml(pdfUrl);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Gracias por tu interés — IoT in Motion</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;display:block;}
  body{margin:0!important;padding:0!important;width:100%!important;}
  a{color:#2B4786;}
  @media screen and (max-width:620px){
    .card{width:100%!important;border-radius:0!important;}
    .pad-x{padding-left:24px!important;padding-right:24px!important;}
    .title{font-size:24px!important;}
    .stack-mobile td{display:block!important;width:100%!important;text-align:left!important;}
    .stack-mobile .btn-cell{padding-top:10px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a2233;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">
    Adjuntamos la información de ${solucion} y estamos atentos a tus consultas.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -28px rgba(43,71,134,0.28);border:1px solid #e6e9f0;">

          <tr><td style="height:4px;background:linear-gradient(90deg,#2B4786 0%,#82C2C9 60%,#E34C2C 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 22px 40px;border-bottom:1px solid #eef0f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">${logoTag}</td>
                  <td align="right" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;">Confirmación</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:36px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#82C2C9;box-shadow:0 0 0 4px rgba(130,194,201,0.22);">&nbsp;</span></td>
                  <td valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.20em;text-transform:uppercase;color:#2B4786;font-weight:600;">Gracias por tu interés</td>
                </tr>
              </table>
              <h1 class="title" style="margin:14px 0 12px 0;font-size:28px;line-height:1.18;letter-spacing:-0.02em;color:#2B4786;font-weight:600;">¡Nos alegra tu interés en <span style="color:#82C2C9;font-style:italic;font-weight:500;">nuestras soluciones</span>!</h1>
              <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:#5b6577;">Hola <strong style="color:#1a2233;">${nombre}</strong>, adjuntamos en el correo más información acerca de la solución que desarrollamos.</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#1a2233;font-weight:600;">Estamos atentos a tus consultas o, si preferís, agendamos una reunión para conocer tus necesidades.</p>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f7f8;border:1px solid #d8e6e8;border-radius:14px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" class="stack-mobile" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle">
                          <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5b8a91;margin-bottom:6px;">
                            <span style="background:#2B4786;color:#fff;padding:3px 8px;border-radius:4px;font-weight:600;margin-right:8px;">${categoria}</span>Ficha técnica
                          </div>
                          <div style="font-size:16px;font-weight:600;color:#2B4786;line-height:1.3;letter-spacing:-0.01em;margin-bottom:4px;">${solucion}</div>
                          <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;color:#8a93a8;">${pdfFilename}</div>
                        </td>
                        <td valign="middle" align="right" class="btn-cell">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td bgcolor="#E34C2C" style="border-radius:999px;">
                                <a href="${safePdfUrl}" style="display:inline-block;padding:12px 20px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.005em;">Descargar PDF &nbsp;↓</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:14px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef4fb;border:1px solid #dde6f3;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;line-height:1.55;color:#5b6577;">
                    Si no podés abrirlo, te adjuntamos el link aquí:
                    <a href="${safePdfUrl}" style="color:#2B4786;font-weight:600;word-break:break-all;">${safePdfUrl}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:24px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#2B4786" style="border-radius:999px;padding-right:10px;">
                    <a href="mailto:marketing@iotinmotion.com.ar?subject=Quiero%20agendar%20una%20reuni%C3%B3n%20%E2%80%94%20${encodeURIComponent(solucion)}" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.005em;">Agendar una reunión &nbsp;→</a>
                  </td>
                  <td style="padding-left:10px;">
                    <a href="mailto:marketing@iotinmotion.com.ar" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:600;color:#2B4786;text-decoration:none;letter-spacing:-0.005em;border:1px solid #d8dde8;border-radius:999px;">Responder este correo</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:4px 40px 32px 40px;border-top:1px solid #eef0f5;">
              <p style="margin:22px 0 4px 0;font-size:14px;color:#5b6577;line-height:1.55;">Un saludo,</p>
              <p style="margin:0;font-size:15px;color:#2B4786;font-weight:600;letter-spacing:-0.01em;">Equipo IoT in Motion</p>
              <p style="margin:2px 0 0 0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;color:#8a93a8;letter-spacing:0.06em;">marketing@iotinmotion.com.ar &nbsp;·&nbsp; iotinmotion.com.ar</p>
            </td>
          </tr>

          <tr>
            <td style="background:#2B4786;padding:22px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">IoT in Motion · Soluciones IoT</td>
                  <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.45);">iotinmotion.com.ar</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin-top:18px;">
          <tr>
            <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.55;color:#a1aabb;padding:0 24px;">
              Recibís este correo porque descargaste una ficha desde nuestro sitio.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ─── Branded internal lead email templates ─────────────── */

export function buildPdfLeadHtml({
  logoSrc,
  nombre,
  email,
  empresa,
  celular,
  paisLocalidad,
  deseaContacto,
  categoria,
  solucion,
  pdfFilename,
}: {
  logoSrc: string;
  nombre: string;
  email: string;
  empresa: string;
  celular: string;
  paisLocalidad: string;
  deseaContacto: boolean;
  categoria: string;
  solucion: string;
  pdfFilename: string;
}) {
  const logoTag = logoSrc
    ? `<img src="${logoSrc}" width="110" height="54" alt="IoT in Motion" style="height:54px;width:auto;display:block;" />`
    : `<strong style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.1em;color:#2B4786;">IOT IN MOTION</strong>`;

  const contactarPill = deseaContacto
    ? `<span style="display:inline-block;background:#edfaf3;color:#1a7a4a;border:1px solid #b7e5cc;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">● Sí</span>`
    : `<span style="display:inline-block;background:#fff1ed;color:#E34C2C;border:1px solid #fcd5c8;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">● No</span>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>Descarga PDF solicitada — IoT in Motion</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;display:block;}
  body{margin:0!important;padding:0!important;width:100%!important;}
  a{color:#2B4786;}
  @media screen and (max-width:620px){
    .card{width:100%!important;border-radius:0!important;}
    .pad-x{padding-left:24px!important;padding-right:24px!important;}
    .title{font-size:22px!important;}
    .kv-label,.kv-value{display:block!important;width:100%!important;padding-left:0!important;}
    .kv-label{padding-top:14px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a2233;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">
    ${nombre} descargó &quot;${solucion}&quot; desde la sección Soluciones de iotinmotion.com
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -28px rgba(43,71,134,0.28);border:1px solid #e6e9f0;">

          <tr><td style="height:4px;background:linear-gradient(90deg,#2B4786 0%,#82C2C9 60%,#E34C2C 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td class="pad-x" style="padding:28px 40px 22px 40px;border-bottom:1px solid #eef0f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">${logoTag}</td>
                  <td align="right" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;">Notificación · descarga</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:32px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E34C2C;box-shadow:0 0 0 4px rgba(227,76,44,0.18);">&nbsp;</span></td>
                  <td valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.20em;text-transform:uppercase;color:#E34C2C;font-weight:600;">Descarga solicitada</td>
                </tr>
              </table>
              <h1 class="title" style="margin:14px 0 6px 0;font-size:26px;line-height:1.2;letter-spacing:-0.02em;color:#2B4786;font-weight:600;">Se solicitó un PDF desde <span style="color:#82C2C9;font-style:italic;font-weight:500;">Soluciones</span></h1>
              <p style="margin:0;font-size:14px;line-height:1.55;color:#5b6577;">Un visitante descargó la ficha técnica desde <span style="color:#2B4786;font-weight:500;">iotinmotion.com</span>.</p>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:24px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f7f8;border:1px solid #d8e6e8;border-radius:14px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5b8a91;margin-bottom:8px;">
                      <span style="background:#2B4786;color:#fff;padding:3px 8px;border-radius:4px;font-weight:600;margin-right:8px;">${categoria}</span>Solución
                    </div>
                    <div style="font-size:17px;font-weight:600;color:#2B4786;line-height:1.3;letter-spacing:-0.01em;">${solucion}</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td valign="middle" style="padding-right:8px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="28" height="28" align="center" valign="middle" bgcolor="#E34C2C" style="border-radius:6px;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:9px;font-weight:700;color:#ffffff;letter-spacing:0.06em;">PDF</td>
                            </tr>
                          </table>
                        </td>
                        <td valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:12px;color:#1a2233;letter-spacing:-0.01em;">${pdfFilename}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:24px 40px 8px 40px;">
              <div style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#8a93a8;margin-bottom:14px;">Datos del visitante</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;border-bottom:1px solid #eef0f5;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">Nombre y apellido</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f5;font-size:14.5px;color:#1a2233;font-weight:600;">${nombre}</td>
                </tr>
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;border-bottom:1px solid #eef0f5;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">Email</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f5;font-size:14.5px;">
                    <a href="mailto:${email}" style="color:#2B4786;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(43,71,134,0.25);">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;border-bottom:1px solid #eef0f5;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">Empresa</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f5;font-size:14.5px;color:#1a2233;font-weight:500;">${empresa}</td>
                </tr>
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;border-bottom:1px solid #eef0f5;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">Celular</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f5;font-size:14.5px;color:#1a2233;font-weight:500;">${celular}</td>
                </tr>
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;border-bottom:1px solid #eef0f5;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">País / Localidad</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;border-bottom:1px solid #eef0f5;font-size:14.5px;color:#1a2233;font-weight:500;">${paisLocalidad}</td>
                </tr>
                <tr>
                  <td class="kv-label" width="170" valign="top" style="padding:10px 0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a93a8;">Desea ser contactado</td>
                  <td class="kv-value" valign="top" style="padding:10px 0 10px 16px;font-size:14.5px;">${contactarPill}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="pad-x" style="padding:24px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#2B4786" style="border-radius:999px;">
                    <a href="mailto:${email}?subject=Sobre%20${encodeURIComponent(solucion)}" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.005em;">Contactar a ${nombre} &nbsp;→</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#2B4786;padding:22px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Origen · Descarga PDF</td>
                  <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.45);">iotinmotion.com</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin-top:18px;">
          <tr>
            <td align="center" style="font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a1aabb;padding:0 24px;">IoT in Motion · Soluciones IoT</td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
