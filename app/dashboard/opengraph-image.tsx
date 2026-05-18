import { ImageResponse } from "next/og";
import { getGitHubStats } from "@/lib/github";

export const runtime = "nodejs";
export const revalidate = 3600;

export const alt = "Muhammad Akmal Iskandar — Live Analytics Dashboard";
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

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export default async function OG() {
  const [stats, regular, bold, black] = await Promise.all([
    getGitHubStats(),
    loadInter(400),
    loadInter(700),
    loadInter(900),
  ]);

  const { profile, totals } = stats;

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
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "Inter",
          position: "relative",
          padding: 56,
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.35) 0%, rgba(0,240,255,0) 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.30) 0%, rgba(167,139,250,0) 70%)",
            filter: "blur(50px)",
            display: "flex",
          }}
        />

        {/* Top row: live badge + avatar + handle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              border: "1px solid rgba(52,211,153,0.4)",
              background: "rgba(52,211,153,0.12)",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#6ee7b7",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#34d399",
                display: "flex",
              }}
            />
            Live Dashboard
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "Inter",
                color: "#9ca3af",
                letterSpacing: 1,
                display: "flex",
              }}
            >
              @{profile.login}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar_url}
              width={64}
              height={64}
              alt=""
              style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
        </div>

        {/* Center: name + headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#00f0ff",
              textTransform: "uppercase",
              fontFamily: "Inter",
              display: "flex",
            }}
          >
            // /dashboard
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ display: "flex" }}>{profile.name || "Muhammad Akmal Iskandar"}</span>
            <span style={{ display: "flex", color: "#9ca3af", fontWeight: 700, marginTop: 6 }}>
              Live Analytics.
            </span>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 22,
              color: "#d1d5db",
              fontWeight: 400,
              maxWidth: 980,
              display: "flex",
            }}
          >
            Real‑time view of GitHub activity, coding time, and portfolio traffic.
          </div>
        </div>

        {/* Bottom stat row */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Repos", value: compact(totals.repos), color: "#00f0ff" },
            { label: "Stars", value: compact(totals.stars), color: "#fbbf24" },
            { label: "Forks", value: compact(totals.forks), color: "#a78bfa" },
            { label: "Contribs / Year", value: compact(totals.commits_year), color: "#34d399" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "16px 20px",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#6b7280",
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: stat.color,
                  letterSpacing: -2,
                  display: "flex",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
