import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Squamish Adventure Rentals — ATV rentals delivered to your trailhead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0d4f4a 0%, #0a3a37 50%, #1e293b 100%)",
          color: "#f8fafc",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(50% 50% at 90% 0%, rgba(234, 125, 44, 0.35) 0%, rgba(234, 125, 44, 0) 60%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              background: "rgba(248, 250, 252, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            S
          </div>
          Squamish Adventure Rentals
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 60,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "85%",
            }}
          >
            ATVs delivered to your trail.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#ea7d2c",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Throttle ready.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <div>Squamish · Whistler · Sea-to-Sky, BC</div>
          <div>squamishadventurerentals.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
