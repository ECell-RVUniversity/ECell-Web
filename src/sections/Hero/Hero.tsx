"use client";
import React, { useEffect, useRef } from "react";
const heroVideo = "/assets/videos/hero2-optimized.mp4";
const heroMobileVideo = "/assets/videos/hero-mobile.mp4";
const heroPoster = "/assets/videos/hero-poster.webp";
import { setupHeroAnimations } from "./HeroAnimations";
import "./Hero.css";
import "./HeroLayout.css";
import "./HeroVideo.css";
import "./HeroMarquee.css";
import "./HeroTypography.css";
import "./HeroResponsive.css";

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.5;

    let isVisible = false;
    let disposed = false;

    const handleVisibilityChange = () => {
      if (disposed) return;
      if (document.hidden) {
        video.pause();
      } else if (isVisible) {
        video.playbackRate = 0.5;
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed) return;
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting && !document.hidden) {
            video.playbackRate = 0.5;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const cleanupAnimations = setupHeroAnimations({
      heroRef,
      videoRef,
      videoWrapRef,
      headingRef,
      marqueeRef,
      labelRef,
      scrollHintRef,
    });

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cleanupAnimations?.();
      video.pause();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div ref={stickyRef} className="hero__sticky">
        <div ref={marqueeRef} className="hero__marquee-group">
          <div className="hero__marquee-line hero__marquee-line--startups">
            <span>WHERE STARTUPS</span>
          </div>
          <div className="hero__marquee-line hero__marquee-line--shape">
            <span>TAKE SHAPE.</span>
          </div>
        </div>

        <div ref={labelRef} className="hero__label">
          <span className="hero__label-mark">ECell</span>
          <span className="hero__label-cap">A note from the team</span>
        </div>

        <div ref={videoWrapRef} className="hero__video-wrapper">
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={heroPoster}
            preload="metadata"
            suppressHydrationWarning
          >
            <source
              media="(max-width: 768px)"
              src={heroMobileVideo}
              type="video/mp4"
            />
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero__overlay" />
          <h1 ref={headingRef} className="hero__heading">
            <span className="hero__heading-sub">
              It all starts from an idea
            </span>
            <span className="hero__heading-main">ECell RV University</span>
          </h1>
        </div>

        <div ref={scrollHintRef} className="hero__scroll-hint" aria-hidden="true">
          <div className="hero__scroll-mouse">
            <span className="hero__scroll-wheel" />
          </div>
          <div className="hero__scroll-chevrons">
            <span />
            <span />
          </div>
          <span className="hero__scroll-label">Scroll to explore</span>
        </div>

        <div className="hero__bottom-marquee" aria-hidden="true">
          <div className="hero__bottom-marquee-track">
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
