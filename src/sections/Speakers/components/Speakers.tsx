"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import { gsap } from "../../../utils/gsapSetup";
import ambikaPhoto from "../../../assets/prevSpeakers/ambika.webp";
import arshdeepPhoto from "../../../assets/prevSpeakers/arshdeep.webp";
import guhaPhoto from "../../../assets/prevSpeakers/guha.webp";
import harpreetPhoto from "../../../assets/prevSpeakers/harpreet.webp";
import shariffPhoto from "../../../assets/prevSpeakers/shariff.webp";
import "../styles/Speakers.base.css";
import "../styles/Speakers.controls.css";
import "../styles/Speakers.spotlight.css";
import "../styles/Speakers.responsive.css";

export interface Speaker {
  id: number;
  name: string;
  role: string;
  company: string;
  tag: string;
  edition: string;
  highlights: string[];
  quote: string;
  linkedin?: string;
  photo: StaticImageData | string;
  photoPosition?: string;
  accentColor?: string;
}

const SPEAKERS_LIST: Speaker[] = [
  {
    id: 1,
    name: "Harpreet Sohan",
    role: "Creative Designer",
    company: "Wand",
    tag: "Designer",
    edition: "Argonyx '25",
    highlights: ["Product Design", "User-Centric Design", "Creative Design"],
    quote: "Building enduring tech products requires obsessing over the user's unarticulated needs before writing a single line of code.",
    linkedin: "https://www.linkedin.com/in/harpsquatch/",
    photo: harpreetPhoto,
    photoPosition: "82% center",
    accentColor: "rgba(142, 220, 255, 0.85)",
  },
  {
    id: 2,
    name: "Mustafa Shariff",
    role: "Founder",
    company: "Bengaluru Health Community",
    tag: "Entrepreneurship",
    edition: "Argonyx '25",
    highlights: ["HealthTech", "Community Systems", "Social Impact"],
    quote: "True entrepreneurship in healthcare isn't about disruption—it's about creating compassionate systems that scale.",
    linkedin: "https://www.linkedin.com/in/mustafa-shariff-0a0577162/?skipRedirect=true",
    photo: shariffPhoto,
    accentColor: "rgba(130, 240, 190, 0.85)",
  },
  {
    id: 4,
    name: "Arshdeep Singh",
    role: "Founder & CEO",
    company: "Edock, Decodes",
    tag: "Leadership",
    edition: "Argonyx '25",
    highlights: ["Startup Leadership", "Venture Velocity", "Team Culture"],
    quote: "Leadership in early-stage ventures is measured by how fast your team turns ambiguity into executable clarity.",
    linkedin: "https://www.linkedin.com/in/065rsh/?skipRedirect=true",
    photo: arshdeepPhoto,
    photoPosition: "78% center",
    accentColor: "rgba(255, 196, 120, 0.85)",
  },
  {
    id: 6,
    name: "Ambika J",
    role: "Director of Artifical Intelligence & IEEE Senior Member",
    company: "Finastra",
    tag: "Technology",
    edition: "Argonyx",
    highlights: ["FinTech", "Enterprise Systems", "R&D"],
    quote: "Scalable enterprise architecture is the foundation upon which global financial innovation is securely built.",
    linkedin: "https://www.linkedin.com/in/ambikaj/",
    photo: ambikaPhoto,
    accentColor: "rgba(180, 160, 255, 0.85)",
  },
  {
    id: 7,
    name: "Biplab Guha",
    role: "Venture Architect & Entrepreneur",
    company: "Stealth Mode",
    tag: "Entrepreneurship",
    edition: "Founder Series",
    highlights: ["Stealth Strategy", "Competitive Moats", "DeepTech"],
    quote: "The quiet phase of stealth mode is where your core competitive moat is built away from market noise.",
    linkedin: "https://www.linkedin.com/in/biplab-guha/?skipRedirect=true",
    photo: guhaPhoto,
    accentColor: "rgba(255, 150, 180, 0.85)",
  },
];

const CATEGORIES = ["All", "Product", "Entrepreneurship", "Leadership", "Technology"];

export default function Speakers(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const speakersSectionRef = useRef<HTMLElement | null>(null);
  const speakersPanelRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const transitionLightRef = useRef<HTMLDivElement | null>(null);
  const headerBlockRef = useRef<HTMLDivElement | null>(null);

  // Touch swipe support coordinates
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const filteredSpeakers = useMemo(() => {
    if (selectedCategory === "All") return SPEAKERS_LIST;
    return SPEAKERS_LIST.filter((s) => s.tag === selectedCategory);
  }, [selectedCategory]);

  // Ensure activeIndex is always valid for current filtered list
  const safeActiveIndex = activeIndex >= filteredSpeakers.length ? 0 : activeIndex;
  const currentSpeaker = filteredSpeakers[safeActiveIndex] || SPEAKERS_LIST[0];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + filteredSpeakers.length) % filteredSpeakers.length);
  }, [filteredSpeakers.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % filteredSpeakers.length);
  }, [filteredSpeakers.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (isTyping) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe handling on the showcase card
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartXRef.current - touchEndX;
    const diffY = touchStartYRef.current - touchEndY;

    // Only swipe if horizontal swipe is significantly stronger than vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Copy Quote Handler with feedback
  const handleCopyQuote = () => {
    if (!currentSpeaker.quote) return;
    navigator.clipboard.writeText(`"${currentSpeaker.quote}" — ${currentSpeaker.name}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2400);
  };

  // GSAP scroll trigger entry animation
  useEffect(() => {
    const section = speakersSectionRef.current;
    const panel = speakersPanelRef.current;
    if (!section || !panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      // ── Transition Light ──
      if (transitionLightRef.current) {
        gsap.to(transitionLightRef.current, {
          opacity: 0.9,
          scale: 1.2,
          duration: 1,
          ease: "power2.out",
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Animate spotlight transitions when active index or category changes
  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const photo = spotlight.querySelector(".spotlight-photo");
    const identity = spotlight.querySelectorAll(
      ".spotlight-role-badge, .spotlight-meta-separator, .spotlight-company-chip"
    );
    const name = spotlight.querySelector(".spotlight-speaker-name");
    const highlights = spotlight.querySelectorAll(".highlight-pill");
    const quote = spotlight.querySelector(".spotlight-quote-box");
    const eventBadge = spotlight.querySelector(".spotlight-edition-badge");
    const tagBadge = spotlight.querySelector(".spotlight-tag-badge");
    const actions = spotlight.querySelector(".spotlight-actions-row");

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (photo) {
      timeline.fromTo(
        photo,
        { opacity: 0, x: 24, scale: 1.025 },
        { opacity: 1, x: 0, scale: 1, duration: 0.65 },
        0
      );
    }

    if (eventBadge || tagBadge) {
      timeline.fromTo(
        [eventBadge, tagBadge].filter(Boolean),
        { opacity: 0, y: -7 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.08
      );
    }

    if (identity.length) {
      timeline.fromTo(
        identity,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.035 },
        0.12
      );
    }

    if (name) {
      timeline.fromTo(
        name,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.16
      );
    }

    if (highlights.length) {
      timeline.fromTo(
        highlights,
        { opacity: 0, y: 9 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.045 },
        0.28
      );
    }

    if (quote) {
      timeline.fromTo(
        quote,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45 },
        0.38
      );
    }

    if (actions) {
      timeline.fromTo(
        actions,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.48
      );
    }

    return () => {
      timeline.kill();
    };
  }, [safeActiveIndex, selectedCategory]);

  const pad2 = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={speakersSectionRef}
      className="speakers-section"
      id="speakers"
      aria-labelledby="speakers-heading"
    >
      <div ref={speakersPanelRef} className="speakers-reveal-panel">
        {/* Ambient Light Bloom */}
        <div ref={transitionLightRef} className="speakers-transition-light" aria-hidden="true" />

        {/* Morphic Conduit Spine & Horizon Divider */}
        <div className="speakers-morphic-spine" aria-hidden="true" />
        <div className="speakers-morphic-divider" aria-hidden="true" />

        <div className="wrap">
        {/* Header Block — parallax depth offset */}
        <div ref={headerBlockRef} className="speakers-header">
          <div className="speakers-header-main">
            <div className="speakers-kicker-row">
              <span className="speakers-kicker-text">VOICES OF INNOVATION</span>
            </div>
            <h2 id="speakers-heading" className="speakers-headline" aria-label="Previous Speakers">
              <span className="speakers-typo-word speakers-typo-top">Previous</span>{" "}
              <span className="speakers-typo-word speakers-typo-bottom">Speakers</span>
            </h2>
            <p className="speakers-subheading">
              Founders, tech leaders, and entrepreneurs who have shared hard-earned lessons with the next generation of builders.
            </p>
          </div>

          <div className="speakers-header-actions">
            {/* Category Filter Pills */}
            <div className="speakers-categories" role="tablist" aria-label="Filter speakers by domain">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={cat}
                    type="button"
                    className={`speakers-cat-pill ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveIndex(0);
                    }}
                  >
                    {cat === "Technology" ? "Tech" : cat}
                  </button>
                );
              })}
            </div>

            {/* Nav Arrows & Progress Counter */}
            <div className="speakers-nav-controls">
              <div className="speakers-counter-wrapper">
                <span className="speakers-counter">
                  <strong className="counter-number-window" aria-live="polite">
                    <span key={`${selectedCategory}-${safeActiveIndex}`} className="counter-number">
                      {pad2(safeActiveIndex + 1)}
                    </span>
                  </strong>
                  <span className="counter-divider">/</span>
                  {pad2(filteredSpeakers.length)}
                </span>
                {/* Step indicator dots */}
                <div className="speakers-dots-bar" role="tablist" aria-label="Speaker slide indicator">
                  {filteredSpeakers.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === safeActiveIndex}
                      aria-label={`Jump to speaker ${s.name}`}
                      className={`speaker-dot ${idx === safeActiveIndex ? "active" : ""}`}
                      onClick={() => setActiveIndex(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className="speakers-arrow-group">
                <button
                  onClick={handlePrev}
                  className="speakers-arrow-btn"
                  aria-label="Previous speaker"
                  type="button"
                >
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <path
                      d="M12.5 15L7.5 10L12.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="speakers-arrow-btn"
                  aria-label="Next speaker"
                  type="button"
                >
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Double-Bezel Spotlight Stage */}
        <div
          className="speakers-showcase-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Featured Spotlight Card */}
          <div ref={spotlightRef} className="speaker-spotlight-shell">
            <div
              className="speaker-spotlight-core"
              style={{
                "--speaker-card-accent": currentSpeaker.accentColor || "rgba(142, 220, 255, 0.85)",
              } as React.CSSProperties}
            >
              {/* Left Column: Portrait & Live Badges */}
              <div className="spotlight-left-column">
                <div className="spotlight-photo-frame">
                  <Image
                    className="spotlight-photo"
                    src={currentSpeaker.photo}
                    alt={currentSpeaker.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    priority
                    style={{ objectPosition: currentSpeaker.photoPosition || "center" }}
                  />
                  <div className="spotlight-photo-overlay" />
                  
                  {/* Floating Badges */}
                  <div className="spotlight-badge-top-row">
                    <span className="spotlight-tag-badge">
                      <span className="badge-bullet" />
                      {currentSpeaker.tag}
                    </span>
                    <span className="spotlight-edition-badge">{currentSpeaker.edition}</span>
                  </div>

                </div>
              </div>

              {/* Right Column: Speaker Intel & Keynote Quote */}
              <div className="spotlight-right-column">
                {/* Role & Company Header */}
                <div className="spotlight-meta-header">
                  <span className="spotlight-role-badge">{currentSpeaker.role}</span>
                  <span className="spotlight-meta-separator" aria-hidden="true">•</span>
                  <div className="spotlight-company-chip">
                    <svg viewBox="0 0 16 16" fill="none" width="13" height="13" className="company-icon">
                      <path d="M2.5 14V3.5C2.5 2.67 3.17 2 4 2H12C12.83 2 13.5 2.67 13.5 3.5V14M1 14H15M5.5 5.5H6.5M9.5 5.5H10.5M5.5 8.5H6.5M9.5 8.5H10.5M5.5 11.5H6.5M9.5 11.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{currentSpeaker.company}</span>
                  </div>
                </div>

                <h3 className="spotlight-speaker-name">{currentSpeaker.name}</h3>

                {/* Highlights / Domain Tags */}
                <div className="spotlight-highlights-row">
                  {currentSpeaker.highlights.map((h, i) => (
                    <span key={i} className="highlight-pill">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Keynote Quote */}
                <blockquote className="spotlight-quote-box">
                  <span className="spotlight-quote-mark" aria-hidden="true">
                    “
                  </span>
                  <p className="spotlight-quote-text">{currentSpeaker.quote}</p>
                </blockquote>

                {/* Actions Row */}
                <div className="spotlight-actions-row">
                  {currentSpeaker.linkedin && (
                    <a
                      href={currentSpeaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="speaker-island-btn"
                      aria-label={`Connect with ${currentSpeaker.name} on LinkedIn`}
                    >
                      <span className="island-btn-label">Connect on LinkedIn</span>
                      <span className="island-btn-icon" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                          <path
                            d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  )}

                  {/* Copy Quote Button */}
                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className={`speaker-secondary-btn ${copiedQuote ? "copied" : ""}`}
                    aria-label="Copy speaker quote"
                  >
                    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                      {copiedQuote ? (
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <path d="M5.5 3.5H11.5C12.33 3.5 13 4.17 13 5V11C13 11.83 12.33 12.5 11.5 12.5H5.5C4.67 12.5 4 11.83 4 11V5C4 4.17 4.67 3.5 5.5 3.5ZM2.5 7.5V13C2.5 13.83 3.17 14.5 4 14.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                    <span>{copiedQuote ? "Quote Copied!" : "Copy Quote"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      </div>
    </section>
  );
}
