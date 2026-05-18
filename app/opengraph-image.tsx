import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Muhammad Akmal Iskandar — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadInter(weight: 400 | 700 | 900): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OG() {
  const [regular, bold, black] = await Promise.all([
    loadInter(400),
    loadInter(700),
    loadInter(900),
  ]);

  const fonts = [
    regular && { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    black && { name: "Inter", data: black, weight: 900 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "Inter",
          position: "relative",
          padding: 80,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.35) 0%, rgba(0,240,255,0) 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -240,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.30) 0%, rgba(167,139,250,0) 70%)",
            filter: "blur(50px)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 700,
            color: "#00f0ff",
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 28,
          }}
        >
          <div style={{ width: 40, height: 3, background: "#00f0ff", display: "flex" }} />
          Hello, World!
        </div>

        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex" }}>Muhammad Akmal</span>
          <span style={{ display: "flex" }}>Iskandar.</span>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            fontWeight: 400,
            color: "#d1d5db",
            maxWidth: 1000,
            display: "flex",
          }}
        >
          <span style={{ color: "#00f0ff", marginRight: 12, display: "flex" }}>{">"}</span>
          Full Stack Developer · Laravel · React · TypeScript
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#6b7280",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          maliskandar.dev
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            border: "1px solid rgba(0,240,255,0.4)",
            background: "rgba(0,240,255,0.10)",
            borderRadius: 999,
            color: "#67e8f9",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#00f0ff", display: "flex" }} />
          Open to Work
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
