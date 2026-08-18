"use client";
import React from "react";
import "./PageTransition.css";

export interface PageTransitionProps {
  active?: boolean;
  targetView?: string;
}

export default function PageTransition({ active, targetView }: PageTransitionProps): React.ReactElement | null {
  if (!active) return null;

  const isEnteringEvents = targetView === "events";

  return (
    <div className={`page-transition-overlay ${active ? "active" : ""}`}>
      <div className="transition-shutter left"></div>
      <div className="transition-shutter right"></div>
      
      <div className="transition-content">
        <div className="transition-spinner">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>
        <div className="transition-title">
          {isEnteringEvents ? "OPENING EVENTS" : "RETURNING HOME"}
        </div>
        <div className="transition-subtitle">
          E-Cell RV University
        </div>
      </div>

      <div className="transition-beam"></div>
    </div>
  );
}
