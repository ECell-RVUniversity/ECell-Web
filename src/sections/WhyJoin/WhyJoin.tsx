"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsapSetup";
import { acquireLenis } from "../../utils/lenis";
import "./WhyJoin.css";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/J0MfKUwIZ6J8WfemIBbdlJ";

interface JoinReason {
  number: string;
  title: string;
  description: string;
  background: string;
  text: string;
  iconBackground: string;
  iconColor: string;
  icon: string;
  cta?: string;
  middleLabel: string;
}

const reasons: JoinReason[] = [
  {
    number: "01",
    title: "Build what matters",
    description:
      "Take an idea beyond the whiteboard. Build, test and ship it with people who actually want to make things happen.",
    background: "#edf0f5",
    text: "#2d91e5",
    iconBackground: "#2d91e5",
    iconColor: "#ffffff",
    icon: "✦",
    middleLabel: "Make it real",
  },
  {
    number: "02",
    title: "Find your people",
    description:
      "Meet builders, designers, founders and problem-solvers who are just as crazy about creating something of their own.",
    background: "#8bce5d",
    text: "#ffffff",
    iconBackground: "#ffffff",
    iconColor: "#78bd4e",
    icon: "◎",
    middleLabel: "Build together",
  },
  {
    number: "03",
    title: "Learn by doing",
    description:
      "Run events. Lead teams. Pitch ideas. Make mistakes. Learn the things no classroom can teach.",
    background: "#fa6959",
    text: "#ffffff",
    iconBackground: "#ffffff",
    iconColor: "#fa6959",
    icon: "↗",
    middleLabel: "Try. Learn. Repeat.",
  },
  {
    number: "04",
    title: "Create real impact",
    description:
      "Shape the entrepreneurial culture on campus and turn your ideas into experiences other students remember.",
    background: "#238894",
    text: "#ffffff",
    iconBackground: "#ffffff",
    iconColor: "#238894",
    icon: "⚡",
    middleLabel: "Leave a mark",
  },
  {
    number: "05",
    title: "Start something",
    description:
      "You don't need a perfect idea. You just need the willingness to take the first step.",
    background: "#252525",
    text: "#ffffff",
    iconBackground: "#ffffff",
    iconColor: "#252525",
    icon: "→",
    cta: "Join now",
    middleLabel: "Your seat is waiting",
  },
];

export default function WhyJoin(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const dragInfoRef = useRef<{
    isDragging: boolean;
    hasMoved: boolean;
    startY: number;
    startX: number;
    startScroll: number;
    startProgress: number;
    lastTime: number;
    velocityY: number;
  }>({
    isDragging: false,
    hasMoved: false,
    startY: 0,
    startX: 0,
    startScroll: 0,
    startProgress: 0,
    lastTime: 0,
    velocityY: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    const cards = cardRefs.current.filter(
      (card): card is HTMLElement => card !== null
    );
    if (!section || !stack || cards.length !== reasons.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      cards.forEach((card, index) => {
        gsap.set(card, { y: index * 22, scale: 1 - index * 0.025, rotate: 0 });
      });
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const lenisHandle = isMobile ? null : acquireLenis();
    const lenis = lenisHandle?.instance ?? null;

    let cleanupDrag: (() => void) | null = null;

    const context = gsap.context(() => {
      const stackOffset = isMobile ? 18 : 24;

      cards.forEach((card, index) => {
        gsap.set(card, {
          y: index * stackOffset,
          scale: 1 - index * 0.035,
          rotate: index % 2 === 0 ? -1.4 : 1.4,
          transformOrigin: "50% 100%",
          zIndex: cards.length - index,
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${isMobile ? 450 : 520}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCards = cards.slice(index + 1);
        const at = index;

        timeline
          .to(
            card,
            {
              y: isMobile ? -window.innerHeight * 0.8 : -window.innerHeight * 0.95,
              rotate: index % 2 === 0 ? -7 : 7,
              scale: 0.93,
              opacity: 0,
              duration: 0.82,
              ease: "power2.inOut",
            },
            at
          )
          .to(
            nextCards,
            {
              y: (cardIndex: number) => cardIndex * stackOffset,
              scale: (cardIndex: number) => 1 - cardIndex * 0.035,
              rotate: (cardIndex: number) => (cardIndex % 2 === 0 ? -1.4 : 1.4),
              duration: 0.82,
              ease: "power2.inOut",
            },
            at
          );
      });

      // --- Interactive Left-Mouse Drag Navigation ---
      const handlePointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;

        const st = timeline.scrollTrigger;
        if (!st) return;

        let effectiveScroll = window.scrollY;
        if (effectiveScroll < st.start) {
          effectiveScroll = st.start;
        } else if (effectiveScroll > st.end) {
          effectiveScroll = st.end;
        }

        dragInfoRef.current = {
          isDragging: true,
          hasMoved: false,
          startY: e.clientY,
          startX: e.clientX,
          startScroll: effectiveScroll,
          startProgress: st.progress,
          lastTime: performance.now(),
          velocityY: 0,
        };

        stack.classList.add("is-dragging");
        try {
          stack.setPointerCapture(e.pointerId);
        } catch {}
      };

      const handlePointerMove = (e: PointerEvent) => {
        const info = dragInfoRef.current;
        if (!info.isDragging) return;

        const st = timeline.scrollTrigger;
        if (!st) return;

        const deltaY = info.startY - e.clientY;
        const deltaX = info.startX - e.clientX;
        const distance = deltaY + deltaX * 0.45;

        if (!info.hasMoved && Math.abs(distance) > 5) {
          info.hasMoved = true;
        }

        if (!info.hasMoved) return;

        const now = performance.now();
        const dt = Math.max(1, now - info.lastTime);
        info.velocityY = deltaY / dt;
        info.lastTime = now;

        const pinDistance = st.end - st.start;
        const pixelsPerCard = isMobile ? 180 : 230;
        const scrollPerDragPixel = pinDistance / (reasons.length - 1) / pixelsPerCard;

        const targetScroll = Math.max(
          st.start,
          Math.min(st.end, info.startScroll + distance * scrollPerDragPixel)
        );

        if (lenis) {
          lenis.scrollTo(targetScroll, { immediate: true });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "instant" as ScrollBehavior });
        }
        st.scroll(targetScroll);
        st.update();
      };

      const handlePointerUp = (e: PointerEvent) => {
        const info = dragInfoRef.current;
        if (!info.isDragging) return;

        info.isDragging = false;
        stack.classList.remove("is-dragging");

        try {
          if (stack.hasPointerCapture(e.pointerId)) {
            stack.releasePointerCapture(e.pointerId);
          }
        } catch {}

        if (!info.hasMoved) return;

        const st = timeline.scrollTrigger;
        if (!st) return;

        const currentProgress = st.progress;
        const totalCards = reasons.length - 1;
        const exactIndex = currentProgress * totalCards;

        let targetIndex: number;
        const deltaY = info.startY - e.clientY;

        if (Math.abs(deltaY) > 28 || Math.abs(info.velocityY) > 0.3) {
          if (deltaY > 0 || info.velocityY > 0.15) {
            targetIndex = Math.min(totalCards, Math.ceil(exactIndex));
            if (targetIndex <= Math.floor(info.startProgress * totalCards)) {
              targetIndex = Math.min(totalCards, targetIndex + 1);
            }
          } else {
            targetIndex = Math.max(0, Math.floor(exactIndex));
            if (targetIndex >= Math.ceil(info.startProgress * totalCards)) {
              targetIndex = Math.max(0, targetIndex - 1);
            }
          }
        } else {
          targetIndex = Math.round(exactIndex);
        }

        const targetScroll = st.start + (targetIndex / totalCards) * (st.end - st.start);

        if (lenis) {
          lenis.scrollTo(targetScroll, {
            duration: 0.65,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          gsap.to(window, {
            scrollTo: targetScroll,
            duration: 0.55,
            ease: "power2.out",
          });
        }
      };

      const handleClickCapture = (e: MouseEvent) => {
        if (dragInfoRef.current.hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      stack.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      stack.addEventListener("click", handleClickCapture, true);

      cleanupDrag = () => {
        stack.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
        stack.removeEventListener("click", handleClickCapture, true);
      };
    }, section);

    return () => {
      cleanupDrag?.();
      context.revert();
      lenisHandle?.release();
    };
  }, []);

  return (
    <section ref={sectionRef} className="why-join" id="why-join">
      <div className="why-join__intro wrap">
        <p className="why-join__eyebrow">Why join ECell</p>
        <h2>Make your college years count.</h2>
        <p className="why-join__hint">Scroll or drag cards to explore</p>
      </div>

      <div ref={stackRef} className="why-join__stack" aria-label="Reasons to join ECell">
        {reasons.map((reason, index) => (
          <article
            key={reason.number}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className={`why-card${reason.cta ? " why-card--cta" : ""}`}
            style={
              {
                "--card-bg": reason.background,
                "--card-text": reason.text,
                "--card-icon-bg": reason.iconBackground,
                "--card-icon-fg": reason.iconColor,
              } as React.CSSProperties
            }
          >
            <div className="why-card__topline">
              <span className="why-card__number">{reason.number}</span>
              <span className="why-card__icon" aria-hidden="true">{reason.icon}</span>
            </div>
            <div className="why-card__middle" aria-hidden="true">
              <span>{reason.middleLabel}</span>
              <i />
              {reason.cta && <b>ECELL</b>}
            </div>
            <div className="why-card__content">
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
              {reason.cta && (
                <a
                  className="why-card__cta"
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {reason.cta} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
