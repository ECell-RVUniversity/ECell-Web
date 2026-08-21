"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../../utils/gsapSetup";
import { acquireLenis } from "../../utils/lenis";
import storyBackground from "../../assets/story/lib.webp";
import "./Story.css";

export interface StoryProps {
  eyebrow?: string;
  headlineMain?: string;
  headlineAccent?: string;
}

function renderJigglyText(text: string, keyPrefix: string): React.ReactNode {
  if (!text) return null;
  const words = text.split(" ");
  return words.map((word, wordIdx) => (
    <span
      key={`${keyPrefix}-w-${wordIdx}`}
      className="jiggle-word"
      style={{ display: "inline-block", whiteSpace: "nowrap" }}
    >
      {word.split("").map((char, charIdx) => (
        <span
          key={`${keyPrefix}-c-${charIdx}`}
          className="jiggle-char"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char}
        </span>
      ))}
      {wordIdx < words.length - 1 && (
        <span className="jiggle-space" style={{ display: "inline-block" }}>
          &nbsp;
        </span>
      )}
    </span>
  ));
}

export default function Story({
  eyebrow = "ECELL",
  headlineMain = "IT'S THE MIND",
  headlineAccent = "THAT MAKES THE DIFFERENCE",
}: StoryProps): React.ReactElement {
  const revealRef = useRef<HTMLElement | null>(null);
  const imagePanelRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const revealTextInnerRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reveal = revealRef.current;
    const imagePanel = imagePanelRef.current;
    const image = imageRef.current;
    const revealTextInner = revealTextInnerRef.current;
    const eyebrowEl = eyebrowRef.current;

    if (!reveal || !imagePanel || !revealTextInner) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      gsap.set(imagePanel, {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      });
      if (image) gsap.set(image, { scale: 1 });
      gsap.set(".story-reveal-text", { opacity: 0 });
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // --- Shared Lenis smooth scroll (desktop only) ---
    const lenisHandle = isMobile ? null : acquireLenis();
    const lenis = lenisHandle?.instance ?? null;
    let disposed = false;
    let tickerCallback: ((time: number, deltaTime: number) => void) | null = null;

    const scrollUpdateHandler = () => {
      ScrollTrigger.update();
    };

    if (lenis) {
      lenis.on("scroll", scrollUpdateHandler);
    }

    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
      (context) => {
        const isMobileCond = context.conditions?.isMobile ?? false;
        const containerWidth = reveal.offsetWidth || window.innerWidth;
        const textWidth = revealTextInner.scrollWidth;

        gsap.set(revealTextInner, { x: containerWidth });
        gsap.set(".story-reveal-text", { opacity: 0 });

        gsap.set(imagePanel, {
          x: "100%",
          y: "0%",
          scale: isMobileCond ? 0.84 : 0.88,
          rotate: -3,
          rotateY: -8,
          borderRadius: isMobileCond ? "24px" : "36px",
          filter: "blur(6px) brightness(0.78)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          opacity: 0.9,
        });

        if (image) {
          gsap.set(image, {
            scale: 1.12,
            x: "-3%",
          });
        }

        // --- JIGGLY TEXT ANIMATION SETUP ---
        const chars = revealTextInner.querySelectorAll(".jiggle-char");
        const eyebrowChars = eyebrowEl ? eyebrowEl.querySelectorAll(".jiggle-char") : [];

        let targetVel = 0;
        let currentVel = 0;
        let wobbleTime = 0;

        tickerCallback = (time, deltaTime) => {
          if (disposed) return;

          const dtSec = Math.min(deltaTime / 1000, 0.05);
          const lerpFactor = 1 - Math.pow(0.0001, dtSec);
          currentVel += (targetVel - currentVel) * lerpFactor;

          targetVel *= Math.pow(0.90, dtSec * 60);

          const velMag = Math.abs(currentVel);
          const isMoving = velMag > 0.5;

          if (isMoving || Math.abs(targetVel) > 0.5) {
            wobbleTime += (0.016 + velMag * 0.00012) * (dtSec * 60);
          }

          const normVel = gsap.utils.clamp(-1400, 1400, currentVel) / 1400;
          const absNorm = Math.abs(normVel);

          if (absNorm > 0.0005 || isMoving) {
            chars.forEach((char, idx) => {
              const phase = idx * 0.42 + wobbleTime * 4.5;
              const sinWave = Math.sin(phase);
              const cosWave = Math.cos(phase);

              const yOffset = sinWave * absNorm * 8 + normVel * 5;
              const skewX = normVel * 6 + cosWave * absNorm * 4;
              const rotation = sinWave * absNorm * 3 + normVel * 2;
              const scaleY = 1 - absNorm * 0.05 + sinWave * absNorm * 0.04;
              const scaleX = 1 + absNorm * 0.05 - sinWave * absNorm * 0.04;

              gsap.set(char, {
                y: yOffset,
                skewX: skewX,
                rotation: rotation,
                scaleY: scaleY,
                scaleX: scaleX,
                transformOrigin: "50% 100%",
              });
            });

            eyebrowChars.forEach((char, idx) => {
              const phase = idx * 0.5 + wobbleTime * 5;
              const sinWave = Math.sin(phase);
              const yOffset = sinWave * absNorm * 3.5 + normVel * 2.2;
              const skewX = normVel * 3 + sinWave * absNorm * 2;
              const rotation = sinWave * absNorm * 1.2 + normVel * 1;

              gsap.set(char, {
                y: yOffset,
                skewX: skewX,
                rotation: rotation,
                transformOrigin: "50% 100%",
              });
            });
          } else {
            chars.forEach((char) => {
              gsap.set(char, {
                y: 0,
                skewX: 0,
                rotation: 0,
                scaleY: 1,
                scaleX: 1,
              });
            });
            eyebrowChars.forEach((char) => {
              gsap.set(char, {
                y: 0,
                skewX: 0,
                rotation: 0,
              });
            });
          }
        };

        gsap.ticker.add(tickerCallback);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: reveal,
            start: "top top",
            end: isMobileCond ? "+=250%" : "+=300%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              targetVel = self.getVelocity();
            },
          },
        });

        tl.to(
          imagePanel,
          {
            x: "0%",
            y: "0%",
            scale: 1,
            rotate: 0,
            rotateY: 0,
            borderRadius: "0px",
            filter: "blur(0px) brightness(1)",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0), inset 0 0 0 rgba(255, 255, 255, 0)",
            opacity: 1,
            duration: 0.62,
            ease: "power3.out",
          },
          0.04
        );

        if (image) {
          tl.to(
            image,
            {
              scale: 1,
              x: "0%",
              duration: 0.62,
              ease: "power3.out",
            },
            0.04
          );
        }

        tl.to(
          ".story-reveal-text",
          { opacity: 1, duration: 0.15, ease: "power1.out" },
          0.6
        )
          .to(
            revealTextInner,
            {
              x: -(textWidth + 250),
              duration: 1.6,
              ease: "none",
            },
            0.6
          )
          .fromTo(
            eyebrowEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.2, ease: "power1.out" },
            0.7
          )
          .to(
            eyebrowEl,
            { opacity: 0, y: -10, duration: 0.2, ease: "power1.in" },
            1.95
          )
          .to(
            ".story-reveal-text",
            { opacity: 0, duration: 0.15, ease: "power1.in" },
            2.08
          );

        tl.to(
          imagePanel,
          {
            x: "-100%",
            y: "0%",
            scale: isMobileCond ? 0.78 : 0.82,
            rotate: 3,
            rotateY: 8,
            borderRadius: isMobileCond ? "24px" : "36px",
            filter: "blur(12px) brightness(0.38)",
            opacity: 0,
            duration: 0.45,
            ease: "power3.in",
          },
          2.06
        );

        return () => {
          if (tickerCallback) gsap.ticker.remove(tickerCallback);
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
        };
      }
    );

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    }

    return () => {
      disposed = true;

      mm.revert();

      if (lenis) {
        lenis.off("scroll", scrollUpdateHandler);
      }
      lenisHandle?.release();
    };
  }, [eyebrow, headlineMain, headlineAccent]);

  return (
    <section className="story-reveal" ref={revealRef} id="storyReveal">
      <div className="story-image-panel" ref={imagePanelRef} id="imagePanel">
        <div ref={imageRef} className="story-image-inner">
          <Image src={storyBackground} alt="Story background" fill sizes="100vw" quality={100} style={{ objectFit: "cover" }} />
        </div>
        <div className="grain"></div>
      </div>

      <div className="story-reveal-text">
        <div className="eyebrow" ref={eyebrowRef}>
          {renderJigglyText(eyebrow, "eyebrow")}
        </div>
        <div className="story-reveal-text-inner" ref={revealTextInnerRef}>
          <h2>
            {renderJigglyText(headlineMain, "main")}{" "}
            <em>{renderJigglyText(headlineAccent, "accent")}</em>
          </h2>
        </div>
      </div>
    </section>
  );
}
