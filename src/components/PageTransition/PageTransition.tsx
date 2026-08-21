"use client";
import React, { useLayoutEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { gsap } from "../../utils/gsapSetup";
import heroPoster from "../../assets/videos/hero-poster.webp";
import eventsBackground from "../../assets/events/background/pcTeam.webp";
import "./PageTransition.css";

export interface PageTransitionProps {
  active?: boolean;
  targetView?: string;
}

export default function PageTransition({ active, targetView }: PageTransitionProps): React.ReactElement | null {
  const visualRef = useRef<HTMLDivElement | null>(null);
  const outgoingRef = useRef<HTMLDivElement | null>(null);
  const liquidRef = useRef<HTMLDivElement | null>(null);
  const incomingRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!active || !visualRef.current || !outgoingRef.current || !liquidRef.current || !incomingRef.current || !titleRef.current) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      gsap.set(visualRef.current, { scale: 1.04 });
      gsap.set(outgoingRef.current, { borderRadius: "0%", scale: 1, rotation: 0, filter: "blur(0px)" });
      gsap.set(liquidRef.current, { clipPath: "circle(0% at 50% 50%)", borderRadius: "50%" });
      gsap.set(incomingRef.current, { scale: 1.1, rotation: 1.5 });
      gsap.set(titleRef.current, { opacity: 0, y: 18 });

      timeline
        .to(visualRef.current, { scale: 1, duration: 0.72, ease: "power3.out" }, 0)
        .to(outgoingRef.current, { scale: 1.08, rotation: -1.5, borderRadius: "48% 52% 60% 40% / 42% 58% 42% 58%", duration: 0.34 }, 0)
        .to(outgoingRef.current, { scale: 1.16, rotation: 1, borderRadius: "64% 36% 42% 58% / 58% 40% 60% 42%", filter: "blur(2px)", opacity: 0.32, duration: 0.38 }, 0.3)
        .to(liquidRef.current, { clipPath: "circle(155% at 50% 50%)", borderRadius: "38% 62% 54% 46% / 58% 44% 56% 42%", duration: 0.68, ease: "power2.inOut" }, 0.12)
        .to(incomingRef.current, { scale: 1, rotation: 0, duration: 0.66, ease: "power3.out" }, 0.12)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }, 0.18)
        .to(titleRef.current, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, 0.54);

      return () => timeline.kill();
    }, visualRef);

    return () => context.revert();
  }, [active]);

  if (!active) return null;

  const isEnteringEvents = targetView === "events";
  const outgoingImage: StaticImageData = isEnteringEvents ? heroPoster : eventsBackground;
  const incomingImage: StaticImageData = isEnteringEvents ? eventsBackground : heroPoster;

  return (
    <div className={`page-transition-overlay ${active ? "active" : ""}`} role="status" aria-live="polite">
      <div className="transition-visual" ref={visualRef} aria-hidden="true">
        <div className="transition-image transition-image-out" ref={outgoingRef}><Image src={outgoingImage} alt="" fill sizes="100vw" priority /></div>
        <div className="transition-liquid" ref={liquidRef}><div className="transition-image transition-image-in" ref={incomingRef}><Image src={incomingImage} alt="" fill sizes="100vw" priority /></div></div>
        <div className="transition-visual-grain" />
      </div>

      <div className="transition-content">
        <div className="transition-topline">
          <span>ECELL / RVU</span>
          <span>EST. 2023</span>
        </div>
        <div className="transition-index">
          <span>0{isEnteringEvents ? "2" : "1"}</span><i /><span>04</span>
        </div>
        <div className="transition-kicker">{isEnteringEvents ? "A NEW CHAPTER" : "THE HOMEPAGE"}</div>
        <div className="transition-title" ref={titleRef}>{isEnteringEvents ? "EVENTS" : "HOME"}</div>
        <div className="transition-subtitle">{isEnteringEvents ? "Ideas in motion" : "E-Cell RV University"}</div>
        <div className="transition-progress" aria-hidden="true"><span /></div>
        <div className="transition-footer">
          <span>{isEnteringEvents ? "OPENING THE ARCHIVE" : "RETURNING TO ORIGIN"}</span>
          <span>PLEASE WAIT <b>↗</b></span>
        </div>
      </div>

      <div className="transition-beam" aria-hidden="true"></div>
    </div>
  );
}
