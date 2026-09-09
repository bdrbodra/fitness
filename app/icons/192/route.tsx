import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5980a6",
          color: "#f2f2f3",
          fontSize: 108,
          fontWeight: 700,
        }}
      >
        B
      </div>
    ),
    { width: 192, height: 192 }
  );
}
