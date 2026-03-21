import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FareRent — Know the Real Fare Before You Sign the Lease";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #faf9f7 0%, #f5f0eb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #c2410c, #ea580c, #0d9488)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#c2410c",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            F
          </div>
          <div style={{ fontSize: "42px", fontWeight: 800, color: "#1c1917" }}>
            Fare<span style={{ color: "#c2410c" }}>Rent?</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "800px",
            marginBottom: "20px",
          }}
        >
          Know the Real Fare
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "24px",
            color: "#57534e",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          Free rent comparison tool for US renters. Powered by government data.
        </div>

        {/* Bottom stats bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#c2410c" }}>20+</div>
            <div style={{ fontSize: "14px", color: "#a8a29e" }}>Cities</div>
          </div>
          <div style={{ width: "1px", height: "40px", background: "#e2ddd5" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#0d9488" }}>100%</div>
            <div style={{ fontSize: "14px", color: "#a8a29e" }}>Free</div>
          </div>
          <div style={{ width: "1px", height: "40px", background: "#e2ddd5" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#16a34a" }}>Gov</div>
            <div style={{ fontSize: "14px", color: "#a8a29e" }}>Data Source</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
