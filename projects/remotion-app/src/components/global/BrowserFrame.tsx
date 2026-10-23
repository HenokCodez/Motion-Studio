import React from "react";
import { Img, staticFile } from "remotion";

export interface BrowserFrameProps {
  url?: string;
  imageSrc?: string; // Path or staticFile relative path
  title?: string;
  theme?: "dark" | "light";
  accentColor?: string;
  children?: React.ReactNode;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url = "https://example.com",
  imageSrc,
  title = "Browser Preview",
  theme = "dark",
  accentColor = "#3B82F6",
  children,
}) => {
  const isDark = theme === "dark";
  const bg = isDark ? "#0F172A" : "#FFFFFF";
  const headerBg = isDark ? "#1E293B" : "#F1F5F9";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const mutedText = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "1400px",
        maxHeight: "820px",
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Browser Window Chrome */}
      <div
        style={{
          height: "52px",
          backgroundColor: headerBg,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: "16px",
          userSelect: "none",
        }}
      >
        {/* macOS Traffic Lights */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
        </div>

        {/* URL Pill Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            margin: "0 auto",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: isDark ? "rgba(2, 6, 23, 0.6)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: "8px",
            fontSize: "13px",
            fontFamily: "'JetBrains Mono', monospace",
            color: mutedText,
          }}
        >
          <span style={{ color: accentColor }}>🔒</span>
          <span style={{ color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {url}
          </span>
        </div>

        {/* Title Right */}
        <div style={{ fontSize: "12px", color: mutedText, fontWeight: 500 }}>
          {title}
        </div>
      </div>

      {/* Viewport Content */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          backgroundColor: isDark ? "#020617" : "#F8FAFC",
        }}
      >
        {imageSrc ? (
          <Img
            src={imageSrc.startsWith("http") || imageSrc.startsWith("/") ? imageSrc : staticFile(imageSrc)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
