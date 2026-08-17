"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";
import "./HorizontalFlow.css";

interface HorizontalFlowProps {
  children: React.ReactNode;
}

export default function HorizontalFlow({ children }: HorizontalFlowProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const navigateToPanel = (event: Event) => {
        const targetId = (event as CustomEvent<{ targetId?: string }>).detail?.targetId;
        const target = targetId ? document.getElementById(targetId) : null;
        const panel = target?.closest<HTMLElement>(".horizontal-flow-panel");
        const scrollTrigger = horizontalTween.scrollTrigger;

        if (!panel || !container.contains(panel) || !scrollTrigger) return;

        const panels = Array.from(track.children);
        const panelIndex = panels.indexOf(panel);
        const lastPanelIndex = panels.length - 1;
        if (panelIndex < 0 || lastPanelIndex < 1) return;

        // A pinned horizontal track has one vertical scroll position for every
        // panel. Translate the requested panel into its ScrollTrigger progress.
        const progress = panelIndex / lastPanelIndex;
        const scrollPosition = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * progress;
        event.preventDefault();
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      };

      window.addEventListener("horizontal-flow:navigate", navigateToPanel);
      return () => window.removeEventListener("horizontal-flow:navigate", navigateToPanel);
    }, container);

    return () => ctx.revert();
  }, [children]);

  return (
    <div ref={containerRef} className="horizontal-flow-section" id="horizontal-flow">
      <div ref={trackRef} className="horizontal-flow-track">
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={`horizontal-flow-panel horizontal-flow-panel-${idx}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
