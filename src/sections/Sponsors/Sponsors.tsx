"use client";
import React, { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { gsap } from "../../utils/gsapSetup";
import attysLogo from "../../assets/logos/attys.webp";
import cubeLogo from "../../assets/logos/cube.webp";
import easyBitesLogo from "../../assets/logos/easybites.webp";
import herodyLogo from "../../assets/logos/herody.webp";
import justvendLogo from "../../assets/logos/justvend.webp";
import mercLogo from "../../assets/logos/merc.webp";
import mileLogo from "../../assets/logos/mile.webp";
import nokiaLogo from "../../assets/logos/nokia.webp";
import tvsLogo from "../../assets/logos/tvs.webp";
import waffleLogo from "../../assets/logos/waffle.svg";
import redbull from "../../assets/logos/redbull.webp";
import "./Sponsors.css";

export interface SponsorItem {
  id: string;
  name: string;
  logo: StaticImageData | string;
  logoKey?: string;
  tier?: "featured" | "core";
  row: number;
  url?: string;
}

const SPONSORS_CONSTELLATION: SponsorItem[] = [
  // Row 1: 2 items (North Pioneers)
  { id: "node-nokia", name: "Nokia", logo: nokiaLogo, logoKey: "nokia", tier: "featured", row: 1, url: "https://www.nokia.com/" },
  { id: "node-redbull", name: "Red Bull", logo: redbull, tier: "featured", row: 1, url: "https://www.redbull.com/" },

  // Row 2: 4 items (Mid-North Anchors)
  { id: "node-waffle", name: "The Belgian Waffle Co.", logo: waffleLogo, tier: "core", row: 2, url: "https://thebelgianwaffle.co/" },
  { id: "node-tvs", name: "TVS Prakruthi Bikes", logo: tvsLogo, tier: "core", row: 2, url: "https://tvsmotor.com" },
  { id: "node-herody", name: "Herody", logo: herodyLogo, logoKey: "herody", tier: "featured", row: 2, url: "https://herody.in" },
  { id: "node-merc", name: "Akshaya Motors", logo: mercLogo, tier: "featured", row: 2, url: "https://www.mercedes-benz.co.in/" },

  // Row 3: 3 items (Mid-South Growth Network)
  { id: "node-attys", name: "Atty's Bakery & Confectionery", logo: attysLogo, tier: "core", row: 3 },
  { id: "node-cube", name: "Cube", logo: cubeLogo, tier: "core", row: 3 },
  { id: "node-justvend", name: "Justvend", logo: justvendLogo, tier: "core", row: 3, url: "https://www.justvend.in" },

  // Row 4: 2 items (South Base Connectors)
  { id: "node-easybites", name: "EasyBites", logo: easyBitesLogo, tier: "core", row: 4, url: "https://easybites.in/" },
  { id: "node-mile", name: "mile", logo: mileLogo, tier: "core", row: 4, url: "https://www.mile.tech/" },
];

export default function Sponsors(): React.ReactElement {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sponsorsSectionRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const constellationRef = useRef<HTMLDivElement | null>(null);
  const wipeBarRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isConnected = (...nodes: string[]) => {
    if (!hoveredNode) return false;
    return nodes.includes(hoveredNode);
  };

  useEffect(() => {
    const section = sponsorsSectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
      if (constellationRef.current) gsap.set(constellationRef.current, { opacity: 1, y: 0 });
      if (glowRef.current) gsap.set(glowRef.current, { opacity: 0.35, scale: 1 });
      return;
    }

const wipeCtx = gsap.context(() => {
      // ── Luminous Wipe Bar Sweep (Scroll Scrub) ──
      if (wipeBarRef.current) {
        gsap.fromTo(
          wipeBarRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
        gsap.to(wipeBarRef.current, {
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      }
    }, section);

    const headerCtx = gsap.context(() => {
      // ── Kinetic Typography: Partners slides from left, & stays center, Sponsors from right ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "top 35%",
          scrub: 0.8,
        },
      });

      // Badge enters from top
      headerTl.fromTo(
        ".sponsors-badge-container",
        { y: -20, opacity: 0, scale: 0.92, filter: "blur(6px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", ease: "power3.out" },
        0
      );

      // "Partners" slides in with momentum from the left
      headerTl.fromTo(
        ".sponsors-word-left",
        { x: -110, opacity: 0, filter: "blur(10px)", letterSpacing: "0.08em" },
        { x: 0, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.03em", ease: "power3.out" },
        0.05
      );

      // "&" stays anchored in center, scaling from a luminous focal spark
      headerTl.fromTo(
        ".sponsors-headline-amp",
        { scale: 0, opacity: 0, filter: "blur(8px)" },
        { scale: 1, opacity: 0.65, filter: "blur(0px)", ease: "back.out(2.2)" },
        0.1
      );

      // "Sponsors" slides in with momentum from the right
      headerTl.fromTo(
        ".sponsors-word-right",
        { x: 110, opacity: 0, filter: "blur(10px)", letterSpacing: "0.08em" },
        { x: 0, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.03em", ease: "power3.out" },
        0.05
      );

      // Subtitle unmasks as the headline locks together
      headerTl.fromTo(
        ".sponsors-intro",
        { y: 22, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", ease: "power3.out" },
        0.2
      );
    }, section);

    const glowCtx = gsap.context(() => {
      // ── Ambient Radial Glow Expansion ──
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { scale: 0.3, opacity: 0 },
          {
            scale: 1.25,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 20%",
              scrub: 0.8,
            },
          }
        );
      }
    }, section);

    const storyCtx = gsap.context(() => {
      // ══════════════════════════════════════════════════════════════
      // ── AWWWARDS STORYTELLING TIMELINE: NODES → PATHS → CARDS → LOGOS ──
      // ══════════════════════════════════════════════════════════════
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: constellationRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      // Prepare SVG path lengths for clean line-drawing
      const pathElements = gsap.utils.toArray<SVGPathElement>(".constellation-line-path");
      pathElements.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 300;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      // ── PHASE 1: NODES (Seed Origin & Constellation Ignition) ──
      // 1.1 Origin seed beacon dots ignite with scale bounce & shockwave ripple
      const anchorNodes = gsap.utils.toArray<SVGElement>(".constellation-anchor-node");
      const junctionDots = gsap.utils.toArray<SVGElement>(".constellation-junction-dot");
      const pingRings = gsap.utils.toArray<SVGElement>(".node-ping-ring");
      const stars = gsap.utils.toArray<HTMLElement>(".constellation-star");

      // Stars in backdrop awaken
      if (stars.length > 0) {
        storyTl.fromTo(
          stars,
          { opacity: 0, scale: 0 },
          { opacity: 0.7, scale: 1, duration: 0.4, stagger: 0.04, ease: "power2.out" },
          0
        );
      }

      // Top anchor nodes & central hub ignite first
      if (anchorNodes.length > 0) {
        storyTl.fromTo(
          anchorNodes,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.9,
            duration: 0.45,
            stagger: {
              each: 0.05,
              from: "start",
            },
            ease: "back.out(2.4)",
          },
          0.05
        );
      }

      // Radar ping rings expand out from origin nodes
      if (pingRings.length > 0) {
        storyTl.fromTo(
          pingRings,
          { r: 2, opacity: 0.9, strokeWidth: 1.5 },
          {
            r: 18,
            opacity: 0,
            strokeWidth: 0.2,
            duration: 0.7,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.1
        );
      }

      // Junction points appear
      if (junctionDots.length > 0) {
        storyTl.fromTo(
          junctionDots,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.65,
            duration: 0.35,
            stagger: 0.04,
            ease: "back.out(2)",
          },
          0.2
        );
      }

      // ── PHASE 2: PATHS (Vector Circuit Propagation) ──
      // The paths draw in organized cascading waves down the network tree
      const branchTier1 = gsap.utils.toArray<SVGPathElement>(".path-tier-1");
      const branchTier2 = gsap.utils.toArray<SVGPathElement>(".path-tier-2");
      const branchTier3 = gsap.utils.toArray<SVGPathElement>(".path-tier-3");
      const branchTier4 = gsap.utils.toArray<SVGPathElement>(".path-tier-4");

      // Tier 1 branches (North anchors down/up: Nokia->Waffle, Herody->RedBull)
      if (branchTier1.length > 0) {
        storyTl.to(
          branchTier1,
          {
            strokeDashoffset: 0,
            opacity: 0.45,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.inOut",
          },
          0.3
        );
      }

      // Tier 2 branches (Horizontal bridge: Waffle->TVS, Herody->Mercedes)
      if (branchTier2.length > 0) {
        storyTl.to(
          branchTier2,
          {
            strokeDashoffset: 0,
            opacity: 0.45,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.inOut",
          },
          0.5
        );
      }

      // Tier 3 branches (Mid down to Core: TVS->Attys, Herody->Cube, Merc->Justvend)
      if (branchTier3.length > 0) {
        storyTl.to(
          branchTier3,
          {
            strokeDashoffset: 0,
            opacity: 0.45,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.inOut",
          },
          0.68
        );
      }

      // Tier 4 branches (Core down to Base: Attys->EasyBites, Justvend->Mile)
      if (branchTier4.length > 0) {
        storyTl.to(
          branchTier4,
          {
            strokeDashoffset: 0,
            opacity: 0.45,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.inOut",
          },
          0.88
        );
      }

      // ── PHASE 3: CARDS (Materializing Along The Network) ──
      // Once paths illuminate, cards blossom into existence row by row
      const row1Cards = gsap.utils.toArray<HTMLElement>(".row-1 .sponsor-card-inner");
      const row2Cards = gsap.utils.toArray<HTMLElement>(".row-2 .sponsor-card-inner");
      const row3Cards = gsap.utils.toArray<HTMLElement>(".row-3 .sponsor-card-inner");
      const row4Cards = gsap.utils.toArray<HTMLElement>(".row-4 .sponsor-card-inner");

      // Row 1 Cards (Pioneers) materialize
      if (row1Cards.length > 0) {
        storyTl.fromTo(
          row1Cards,
          {
            opacity: 0,
            scale: 0.84,
            y: 18,
            filter: "blur(8px)",
            borderColor: "rgba(255, 255, 255, 0.45)",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            borderColor: "rgba(244, 244, 242, 0.16)",
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.55
        );
      }

      // Row 2 Cards materialize
      if (row2Cards.length > 0) {
        storyTl.fromTo(
          row2Cards,
          {
            opacity: 0,
            scale: 0.86,
            y: 16,
            filter: "blur(6px)",
            borderColor: "rgba(255, 255, 255, 0.4)",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            borderColor: "rgba(244, 244, 242, 0.12)",
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.8
        );
      }

      // Row 3 Cards materialize
      if (row3Cards.length > 0) {
        storyTl.fromTo(
          row3Cards,
          {
            opacity: 0,
            scale: 0.88,
            y: 14,
            filter: "blur(6px)",
            borderColor: "rgba(255, 255, 255, 0.35)",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            borderColor: "rgba(244, 244, 242, 0.12)",
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          1.05
        );
      }

      // Row 4 Cards materialize
      if (row4Cards.length > 0) {
        storyTl.fromTo(
          row4Cards,
          {
            opacity: 0,
            scale: 0.88,
            y: 12,
            filter: "blur(6px)",
            borderColor: "rgba(255, 255, 255, 0.35)",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            borderColor: "rgba(244, 244, 242, 0.12)",
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          1.25
        );
      }

      // ══════════════════════════════════════════════════════════════
      // ── PHASE 4: LOGOS (Living Signal Lock-In) ──
      // Logos surge with exposure/contrast before settling into crisp clarity
      const logos = gsap.utils.toArray<HTMLElement>(".sponsor-logo");
      if (logos.length > 0) {
        storyTl.fromTo(
          logos,
          {
            opacity: 0,
            filter: "brightness(2) contrast(1.2)",
            scale: 0.94,
          },
          {
            opacity: 1,
            filter: "brightness(1) contrast(1.02)",
            scale: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
          },
          0.9
        );
      }
    }, section);

    const exitCtx = gsap.context(() => {
      // ═══════════════════════════════════════════════════════════════
      // ── MORPHIC TRANSITION: ONLY FIRES ON SECTION EXIT ──
      // ══════════════════════════════════════════════════════════════
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom 85%",
          end: "bottom 10%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 1. Left and right cards collapse towards center axis with blur & scale down
      exitTl.to(
        ".col-r1-left, .col-r2-1, .col-r2-2, .col-r3-1, .col-r4-1",
        {
          x: 140,
          scale: 0.2,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power2.in",
        },
        0
      );

      exitTl.to(
        ".col-r1-right, .col-r2-3, .col-r2-4, .col-r3-2, .col-r3-3, .col-r4-2",
        {
          x: -140,
          scale: 0.2,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power2.in",
        },
        0
      );

      // 2. Nodes and dots implode to center
      exitTl.to(
        ".constellation-anchor-node, .constellation-junction-dot, .node-ping-ring, .constellation-star",
        {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        0
      );

      // 3. Constellation network lines stretch and collapse into center vertical conduit
      exitTl.to(
        ".constellation-line-path",
        {
          scaleX: 0.02,
          transformOrigin: "50% 50%",
          opacity: 0.7,
          duration: 0.45,
          ease: "power2.inOut",
        },
        0.05
      );

      // 4. Central vertical spine ignites and shoots down rapidly into bottom boundary
      exitTl.fromTo(
        ".morphic-central-spine",
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          transformOrigin: "top center",
        },
        0.05
      );

      // 5. The spine strikes the bottom and immediately erupts horizontally into the horizon divider
      exitTl.fromTo(
        ".morphic-horizon-divider",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
          transformOrigin: "center center",
        },
        0.25
      );
    }, section);

    return () => {
      wipeCtx.revert();
      headerCtx.revert();
      glowCtx.revert();
      storyCtx.revert();
      exitCtx.revert();
    };
  }, []);

  return (
    <section ref={sponsorsSectionRef} className="sponsors-section" id="sponsors">
      {/* Constellation Emergence transition elements */}
      <div ref={wipeBarRef} className="section-wipe-bar" aria-hidden="true" />
      <div ref={glowRef} className="sponsors-glow" />
      <div className="sponsors-divider-line" />

      {/* Morphic Conduit Spine & Horizon Divider */}
      <div className="morphic-central-spine" aria-hidden="true" />
      <div className="morphic-horizon-divider" aria-hidden="true" />

      {/* Constellation Backdrop Star Field */}
      <div className="constellation-star-field" aria-hidden="true">
        <span className="constellation-star star-1" />
        <span className="constellation-star star-2" />
        <span className="constellation-star star-3" />
        <span className="constellation-star star-4" />
        <span className="constellation-star star-5" />
        <span className="constellation-star star-6" />
      </div>

      <div ref={headerRef} className="wrap sponsors-header">
        <div className="sponsors-badge-container">
          <span className="sponsors-kicker">SUPPORTED BY</span>
        </div>
        <h2 className="sponsors-headline" aria-label="Partners &amp; Sponsors">
          <span className="sponsors-headline-word sponsors-word-left">Partners</span>
          <span className="sponsors-headline-amp" aria-hidden="true">&amp;</span>
          <span className="sponsors-headline-word sponsors-word-right">Sponsors</span>
        </h2>
        <p className="sponsors-intro">
          The organisations helping us turn ideas into action.
        </p>
      </div>

      <div ref={constellationRef} className="wrap constellation-container">
        {/* Constellation Vector Network mapped across the grid */}
        <svg
          ref={svgRef}
          className="constellation-svg"
          viewBox="0 0 1000 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(244, 244, 242, 0.06)" />
              <stop offset="50%" stopColor="rgba(244, 244, 242, 0.35)" />
              <stop offset="100%" stopColor="rgba(244, 244, 242, 0.06)" />
            </linearGradient>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── PATH TIER 1: North connections ── */}
          {/* Nokia down to Belgian Waffle */}
          <path
            d="M 290 115 V 160 H 190"
            className={`constellation-line-path path-tier-1${isConnected("node-nokia", "node-waffle") ? " is-active" : ""}`}
          />

          {/* Center Hub (Herody) up to Red Bull */}
          <path
            d="M 625 185 V 70 H 685"
            className={`constellation-line-path path-tier-1${isConnected("node-herody", "node-redbull") ? " is-active" : ""}`}
          />

          {/* ── PATH TIER 2: Mid-North horizontal bridges ── */}
          {/* Belgian Waffle to TVS */}
          <path
            d="M 230 205 H 280"
            className={`constellation-line-path path-tier-2${isConnected("node-waffle", "node-tvs") ? " is-active" : ""}`}
          />

          {/* Herody to Mercedes */}
          <path
            d="M 720 205 H 770"
            className={`constellation-line-path path-tier-2${isConnected("node-herody", "node-merc") ? " is-active" : ""}`}
          />

          {/* ── PATH TIER 3: Mid-North down to Growth tier ── */}
          {/* TVS down to Atty's */}
          <path
            d="M 375 240 V 325 H 330"
            className={`constellation-line-path path-tier-3${isConnected("node-tvs", "node-attys") ? " is-active" : ""}`}
          />

          {/* Herody down to Cube */}
          <path
            d="M 625 240 V 325 H 580"
            className={`constellation-line-path path-tier-3${isConnected("node-herody", "node-cube") ? " is-active" : ""}`}
          />

          {/* Mercedes down to Justvend */}
          <path
            d="M 870 240 V 325 H 825"
            className={`constellation-line-path path-tier-3${isConnected("node-merc", "node-justvend") ? " is-active" : ""}`}
          />

          {/* ── PATH TIER 4: Growth down to Base anchors ── */}
          {/* Justvend down to Mile */}
          <path
            d="M 765 365 V 450 H 695"
            className={`constellation-line-path path-tier-4${isConnected("node-justvend", "node-mile") ? " is-active" : ""}`}
          />

          {/* Atty's down to EasyBites */}
          <path
            d="M 235 365 V 450 H 305"
            className={`constellation-line-path path-tier-4${isConnected("node-attys", "node-easybites") ? " is-active" : ""}`}
          />

          {/* ── SPONSOR ANCHOR NODES (Where cards dock) ── */}
          <g className="anchor-nodes-group">
            {/* Nokia Anchor */}
            <circle cx="290" cy="115" r="3" className="constellation-anchor-node" />
            <circle cx="290" cy="115" r="2" className="node-ping-ring" />

            {/* Red Bull Anchor */}
            <circle cx="685" cy="70" r="3" className="constellation-anchor-node" />
            <circle cx="685" cy="70" r="2" className="node-ping-ring" />

            {/* Waffle Anchor */}
            <circle cx="190" cy="160" r="3" className="constellation-anchor-node" />
            <circle cx="190" cy="160" r="2" className="node-ping-ring" />

            {/* TVS Anchor */}
            <circle cx="375" cy="240" r="3" className="constellation-anchor-node" />
            <circle cx="375" cy="240" r="2" className="node-ping-ring" />

            {/* Herody Hub Anchor */}
            <circle cx="625" cy="185" r="3.5" className="constellation-anchor-node anchor-hub" />
            <circle cx="625" cy="185" r="2" className="node-ping-ring" />

            {/* Mercedes Anchor */}
            <circle cx="870" cy="240" r="3" className="constellation-anchor-node" />
            <circle cx="870" cy="240" r="2" className="node-ping-ring" />

            {/* Atty's Anchor */}
            <circle cx="235" cy="365" r="3" className="constellation-anchor-node" />
            <circle cx="235" cy="365" r="2" className="node-ping-ring" />

            {/* Cube Anchor */}
            <circle cx="580" cy="325" r="3" className="constellation-anchor-node" />
            <circle cx="580" cy="325" r="2" className="node-ping-ring" />

            {/* Justvend Anchor */}
            <circle cx="765" cy="365" r="3" className="constellation-anchor-node" />
            <circle cx="765" cy="365" r="2" className="node-ping-ring" />

            {/* EasyBites Anchor */}
            <circle cx="305" cy="450" r="3" className="constellation-anchor-node" />
            <circle cx="305" cy="450" r="2" className="node-ping-ring" />

            {/* Mile Anchor */}
            <circle cx="695" cy="450" r="3" className="constellation-anchor-node" />
            <circle cx="695" cy="450" r="2" className="node-ping-ring" />
          </g>

          {/* ── JUNCTION INTERSECTION DOTS ── */}
          <circle
            cx="290"
            cy="160"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-nokia", "node-waffle") ? " is-active" : ""}`}
          />
          <circle
            cx="625"
            cy="70"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-herody", "node-redbull") ? " is-active" : ""}`}
          />
          <circle
            cx="625"
            cy="185"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-herody", "node-redbull", "node-merc") ? " is-active" : ""}`}
          />
          <circle
            cx="375"
            cy="325"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-tvs", "node-attys") ? " is-active" : ""}`}
          />
          <circle
            cx="625"
            cy="325"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-herody", "node-cube") ? " is-active" : ""}`}
          />
          <circle
            cx="870"
            cy="325"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-merc", "node-justvend") ? " is-active" : ""}`}
          />
          <circle
            cx="765"
            cy="450"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-justvend", "node-mile") ? " is-active" : ""}`}
          />
          <circle
            cx="235"
            cy="450"
            r="2.5"
            className={`constellation-junction-dot${isConnected("node-attys", "node-easybites") ? " is-active" : ""}`}
          />
        </svg>

        {/* Structured Constellation Grid Matrix */}
        <div className="constellation-grid">
          {/* Row 1: 2 items [ Nokia ] [ Red Bull ] */}
          <div className="constellation-row row-1">
            <div className="constellation-col col-r1-left">
              <div className="constellation-node node-nokia">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[0]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[0].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[0].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r1-right">
              <div className="constellation-node node-redbull">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[1]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[1].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[1].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
          </div>

          {/* Row 2: 4 items [ Belgian ] [ TVS ] [ Herody ] [ Mercedes ] */}
          <div className="constellation-row row-2">
            <div className="constellation-col col-r2-1">
              <div className="constellation-node node-waffle">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[2]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[2].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[2].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r2-2">
              <div className="constellation-node node-tvs">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[3]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[3].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[3].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r2-3">
              <div className="constellation-node node-herody">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[4]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[4].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[4].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r2-4">
              <div className="constellation-node node-merc">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[5]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[5].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[5].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
          </div>

          {/* Row 3: 3 items [ Atty's ] [ Cube ] [ Justvend ] */}
          <div className="constellation-row row-3">
            <div className="constellation-col col-r3-1">
              <div className="constellation-node node-attys">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[6]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[6].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[6].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r3-2">
              <div className="constellation-node node-cube">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[7]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[7].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[7].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r3-3">
              <div className="constellation-node node-justvend">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[8]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[8].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[8].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
          </div>

          {/* Row 4: 2 items [ EasyBites ] [ Mile ] */}
          <div className="constellation-row row-4">
            <div className="constellation-col col-r4-1">
              <div className="constellation-node node-easybites">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[9]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[9].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[9].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
            <div className="constellation-col col-r4-2">
              <div className="constellation-node node-mile">
                <SponsorCard
                  item={SPONSORS_CONSTELLATION[10]}
                  isHovered={hoveredNode === SPONSORS_CONSTELLATION[10].id}
                  onMouseEnter={() => setHoveredNode(SPONSORS_CONSTELLATION[10].id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SponsorCard({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  item: SponsorItem;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}): React.ReactElement {
  const cardContent = (
    <div
      className={`sponsor-card-inner tier-${item.tier || "core"}${isHovered ? " is-hovered" : ""}${item.url ? " has-link" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Subtle radial glow behind the logo on hover */}
      <span className="sponsor-logo-glow" aria-hidden="true" />

      {/* High-end corner constellation ticks */}
      <span className="card-corner corner-tl" aria-hidden="true" />
      <span className="card-corner corner-tr" aria-hidden="true" />
      <span className="card-corner corner-bl" aria-hidden="true" />
      <span className="card-corner corner-br" aria-hidden="true" />

      {/* Coordinate beacon */}
      <span className="card-beacon" aria-hidden="true" />

      <div className="sponsor-logo-frame">
        <Image
          className={`sponsor-logo${item.logoKey ? ` sponsor-logo--${item.logoKey}` : ""}`}
          src={item.logo}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 130px, 180px"
          style={{ objectFit: "contain" }}
          loading="lazy"
        />
      </div>
    </div>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="sponsor-card-link"
        aria-label={`Visit ${item.name} website`}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

