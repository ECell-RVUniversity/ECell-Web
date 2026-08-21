"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsapSetup";
import talkStartupWithMe from "../../assets/events/events_photo/TalkStartupWithMe.webp";
import winterTechTalk from "../../assets/events/events_photo/WinterTechTalk.webp";
import argonyx from "../../assets/events/events_photo/argonyx.webp";
import argonyx2 from "../../assets/events/events_photo/argoynx2.webp";
import desktopTeamBg from "../../assets/events/background/pcTeam.webp";
import mobileTeamBg from "../../assets/events/background/phone.webp";
import "./Events.css";
import Image, { StaticImageData } from "next/image";

export interface GalleryItem {
  caption: string;
  src: StaticImageData | string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    caption: "Argonyx Hackathon - September 2025",
    src: argonyx,
    alt: "Workshop",
  },
  {
    caption: "Winter Tech Talk - Winter 2025",
    src: winterTechTalk,
    alt: "Founders Panel",
  },
  {
    caption: "Talk Startup With Me - Spring 2026",
    src: talkStartupWithMe,
    alt: "Hackathon",
  },
  {
    caption: "Argonyx 2.0 - September 2025",
    src: argonyx2,
    alt: "Argonyx 2.0 event",
  },
];

export default function Events(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const exitGlowRef = useRef<HTMLDivElement | null>(null);
  const bgPanelRef = useRef<HTMLDivElement | null>(null);
  const bgInnerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter((item): item is HTMLDivElement => Boolean(item));
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const caption = captionRef.current;
    const intro = introRef.current;
    const gallery = galleryRef.current;
    const transition = transitionRef.current;
    const exitGlow = exitGlowRef.current;
    const bgPanel = bgPanelRef.current;
    const bgInner = bgInnerRef.current;
    if (!section || !scene || !caption || !items.length) return undefined;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      caption.textContent = GALLERY_ITEMS[0].caption;
      if (bgPanel) gsap.set(bgPanel, { x: 0, y: 0, scale: 1, rotate: 0 });
      if (intro) gsap.set(intro, { autoAlpha: 1 });
      return undefined;
    }

    const zSpacing = 1500;
    const exitStart = 5;
    const exitDuration = 0.7;

    // Cache z-offsets as numbers — avoids parsing dataset.z on every frame
    const zValues: number[] = [];
    // Create quick setters — batches DOM writes, avoids style recalc per item
    const opacitySetters = items.map((item) => gsap.quickSetter(item, "opacity"));
    const sceneZSetter = gsap.quickSetter(scene, "z", "px");

    items.forEach((item, index) => {
      const isRightSide = index % 2 === 0;
      const xOffset = isRightSide
        ? (isMobile ? "20%" : "35%")
        : (isMobile ? "-20%" : "-35%");
      const zOffset = -(index * zSpacing);

      zValues[index] = zOffset;
      item.style.transform = `translate3d(${xOffset}, 0px, ${zOffset}px)`;
    });

    const camera = { z: 0 };
    let activeIndex = -1;
    const updateScene = () => {
      sceneZSetter(camera.z);
      let nearest = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < items.length; i++) {
        const relativeZ = zValues[i] + camera.z;

        // Asymmetric alpha curve:
        // - Deep background (<-3500px): invisible
        // - Approach (-3500px to -1500px): smooth ramp in
        // - Hero view (-1500px to 150px): 100% crisp solid opacity
        // - Passing camera (150px to 550px): smooth rapid fade out BEFORE hitting 800px singularity
        // - Past viewer (>=550px): hidden (prevents Chrome 3D singularity & GPU texture dropping)
        let alpha = 0;
        if (relativeZ < -3500) {
          alpha = 0;
        } else if (relativeZ < -1500) {
          alpha = (relativeZ + 3500) / 2000;
        } else if (relativeZ <= 150) {
          alpha = 1;
        } else if (relativeZ < 550) {
          alpha = 1 - (relativeZ - 150) / 400;
        } else {
          alpha = 0;
        }

        opacitySetters[i](alpha);
        items[i].style.visibility = alpha > 0 ? "visible" : "hidden";

        const absZ = Math.abs(relativeZ);
        if (relativeZ <= 300 && absZ < nearestDistance) {
          nearest = i;
          nearestDistance = absZ;
        }
      }

      if (nearest !== activeIndex) {
        activeIndex = nearest;
        caption.textContent = GALLERY_ITEMS[nearest].caption;
      }
    };

    // Initialize items and scene position immediately
    updateScene();

    const ctx = gsap.context(() => {
      /* Phase 0: Transition wipe from previous section */
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          end: "top 28%",
          scrub: 0.7,
        },
      });

      entrance.fromTo(
        transition,
        { autoAlpha: 1, scaleY: 1, transformOrigin: "top center" },
        { autoAlpha: 0, scaleY: 0, ease: "power4.inOut" },
        0
      );

      /* Main pinned timeline */
      const journey = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=420%" : "+=520%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Phase 1: Background image flies in from top-right to center */
      if (bgPanel) {
        gsap.set(bgPanel, {
          xPercent: 100,
          yPercent: -100,
          scale: 0.88,
          rotate: -8,
          borderRadius: "36px",
          opacity: 0,
        });

        if (bgInner) {
          gsap.set(bgInner, {
            scale: 1.12,
            x: "-4%",
            y: "4%",
          });
        }

        journey.to(
          bgPanel,
          {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            rotate: 0,
            borderRadius: "0px",
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          },
          0
        );

        if (bgInner) {
          journey.to(
            bgInner,
            {
              scale: 1.02,
              x: "0%",
              y: "0%",
              duration: 1.0,
              ease: "power3.out",
            },
            0
          );
        }
      }

      /* Phase 2: Intro text reveals */
      if (intro) {
        journey.fromTo(
          intro,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.8
        );
      }

      /* Phase 2b: Gallery fades in */
      if (gallery) {
        journey.fromTo(
          gallery,
          { autoAlpha: 0, scale: 0.82, yPercent: 12 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
          0.9
        );
      }

      /* Phase 3: 3D gallery camera flythrough */
      journey.to(camera, {
        z: (GALLERY_ITEMS.length - 1) * zSpacing + 800,
        duration: 4,
        ease: "none",
        onUpdate: updateScene,
      }, 1.4);

      /* Exit animations */
      journey.to(
        gallery,
        {
          autoAlpha: 0,
          scale: 0.92,
          yPercent: -8,
          duration: exitDuration,
          ease: "power2.inOut",
        },
        exitStart
      );

      journey.to(
        intro,
        {
          autoAlpha: 0,
          yPercent: -20,
          duration: 0.5,
          ease: "power2.inOut",
        },
        exitStart - 0.1
      );

      journey.to(
        caption,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.inOut",
        },
        exitStart - 0.1
      );

      if (bgInner) {
        journey.to(
          bgInner,
          {
            scale: 1.06,
            duration: 1.0,
            ease: "power1.inOut",
          },
          exitStart - 0.15
        );
      }

      if (exitGlow) {
        journey.fromTo(
          exitGlow,
          { autoAlpha: 0, scaleX: 0.7 },
          { autoAlpha: 1, scaleX: 1.2, duration: 0.8, ease: "power1.out" },
          exitStart
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="events-section" ref={sectionRef} id="eventsSection">
      {/* Background image panel — flies in from top-right */}
      <div className="events-bg-panel" ref={bgPanelRef}>
        <div className="events-bg-inner" ref={bgInnerRef}>
          <Image
            className="events-bg-desktop"
            src={desktopTeamBg}
            alt="ECell team background"
            fill
            sizes="(max-width: 768px) 0px, 100vw"
            quality={85}
            priority
          />
          <Image
            className="events-bg-mobile"
            src={mobileTeamBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 0px"
            quality={85}
            priority
          />
        </div>
        <div className="grain" />
      </div>

      <div className="events-transition-wipe" ref={transitionRef} aria-hidden="true" />
      <div className="events-intro" ref={introRef} aria-hidden="true">
        <span>ECELL</span>
        <h2>Our Legacy</h2>
      </div>
      <div className="events-3d-wrapper" ref={galleryRef}>
        <div className="events-caption-container">
          <div className="events-caption-text" ref={captionRef} id="active-caption">
            Scroll Down to Explore
          </div>
        </div>

        <div className="events-scene" ref={sceneRef} id="scene">
          {GALLERY_ITEMS.map((item, idx) => {
            return (
              <div
                key={idx}
                className="events-gallery-item"
                data-caption={item.caption}
                ref={(el) => {
                  itemsRef.current[idx] = el;
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 78vw, 32vw"
                  quality={85}
                  priority
                  loading="eager"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="events-exit-glow" ref={exitGlowRef} aria-hidden="true" />
    </section>
  );
}
