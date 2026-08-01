import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FloatingLogo.css";

gsap.registerPlugin(ScrollTrigger);

function smoothstep(edge0, edge1, x) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* Ease-out cubic for a more natural deceleration feel */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function FloatingLogo() {
  const logoRef = useRef(null);
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const waves = [wave1Ref.current, wave2Ref.current, wave3Ref.current].filter(Boolean);
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!logo) return;

    // --- Measure the nav logo target position & label ---
    const iconTargetEl = document.querySelector(".nav__logo-icon-target");
    const navLabelEl = document.querySelector(".nav__logo-label");

    // --- Prepare SVG strokes ---
    const waveLengths = waves.map((path) => {
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        fillOpacity: 0,
        strokeOpacity: 1,
      });
      return len;
    });

    // --- Initial state ---
    gsap.set(logo, { opacity: 0 });
    gsap.set([title, subtitle], { opacity: 0 });

    // --- Hero scroll phase ---
    const heroEl = document.querySelector(".hero");
    if (!heroEl) return;

    let heroTarget = 0;
    let heroSmoothed = 0;
    let mobileFrame = null;
    let updateLogo = () => {};
    let targetX = 54;
    let targetY = 46;

    const updateNavTarget = () => {
      if (!iconTargetEl) return;
      const navRect = iconTargetEl.getBoundingClientRect();
      targetX = navRect.left + navRect.width / 2;
      targetY = navRect.top + navRect.height / 2 + 3.5;
    };

    updateNavTarget();
    window.addEventListener("resize", updateNavTarget, { passive: true });

    const requestMobileUpdate = () => {
      if (!isMobile || mobileFrame !== null) return;
      mobileFrame = window.requestAnimationFrame(() => {
        mobileFrame = null;
        updateLogo();
      });
    };

    const heroTrigger = ScrollTrigger.create({
      trigger: heroEl,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        heroTarget = self.progress;
        requestMobileUpdate();
      },
    });

    // --- About transition scroll phase ---
    const aboutEl = document.querySelector(".about");
    let transTarget = 0;
    let transSmoothed = 0;

    let aboutTrigger = null;
    if (aboutEl) {
      aboutTrigger = ScrollTrigger.create({
        trigger: aboutEl,
        start: "top bottom",
        end: "top 10%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          transTarget = self.progress;
          requestMobileUpdate();
        },
      });
    }

    // --- Animation loop ---
    updateLogo = () => {
      heroSmoothed = isMobile ? heroTarget : lerp(heroSmoothed, heroTarget, 0.1);
      transSmoothed = isMobile ? transTarget : lerp(transSmoothed, transTarget, 0.05);

      const p = heroSmoothed;
      const rawT = transSmoothed;
      // Apply ease-out for a natural deceleration as logo settles into nav.
      const t = easeOutCubic(rawT);

      // ====== HERO PHASE (stroke draw + reveal) ======
      const logoReveal = smoothstep(0.15, 0.35, p);
      const wordmarkP = smoothstep(0.72, 0.92, p);
      const fillP = smoothstep(0.50, 0.72, p);

      // Stroke draw animation
      waves.forEach((path, i) => {
        const winStart = 0.18 + i * 0.10;
        const dp = smoothstep(winStart, winStart + 0.30, p);
        gsap.set(path, {
          strokeDashoffset: waveLengths[i] * (1 - dp),
          fillOpacity: fillP,
          strokeOpacity: 1 - fillP,
        });
      });

      // Title/subtitle fade out as transition begins
      const wordOpacity = wordmarkP * (1 - smoothstep(0, 0.25, rawT));
      gsap.set(title, { opacity: wordOpacity });
      gsap.set(subtitle, { opacity: wordOpacity });

      // ====== TRANSITION PHASE (Hero center → Nav top-left) ======
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // --- Starting position (center of viewport) ---
      const centerX = vw / 2;
      const centerY = vh / 2;

      // --- Target position (nav logo icon target) ---
      // --- Size interpolation (proportionate logo in nav header: 64px) ---
      const startSize = Math.min(340, vw * 0.8);
      const endSize = 80;
      // A tiny overshoot at the end gives the logo a satisfying, physical settle.
      const settle = Math.sin(Math.min(rawT, 1) * Math.PI) * 0.055;
      const currentSize = lerp(startSize, endSize, t) * (1 + settle);

      // --- Position interpolation with slight arc (add a curve via Y offset) ---
      const arcOffset = Math.sin(t * Math.PI) * -44;
      const currentX = lerp(centerX, targetX, t);
      const currentY = lerp(centerY, targetY, t) + arcOffset;

      // --- Opacity: visible once hero reveals it, stays visible ---
      const baseOpacity = logoReveal;
      logo.style.opacity = baseOpacity;

      // --- Apply position and size ---
      logo.style.width = `${currentSize}px`;
      logo.style.left = `${currentX}px`;
      logo.style.top = `${currentY}px`;
      const rotation = Math.sin(rawT * Math.PI) * -4;
      logo.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

      // --- Subtle glow when logo is settling into nav ---
      const glowIntensity = smoothstep(0.7, 0.95, rawT) * (1 - smoothstep(0.95, 1, rawT));
      logo.style.filter = glowIntensity > 0.01
        ? `drop-shadow(0 0 ${glowIntensity * 14}px rgba(255,255,255,${glowIntensity * 0.7}))`
        : "none";

      // --- Fade in "ECELL" label text right after the logo icon as it arrives ---
      if (navLabelEl) {
        navLabelEl.style.opacity = smoothstep(0.35, 0.85, rawT);
      }
    };

    if (isMobile) {
      updateLogo();
    } else {
      gsap.ticker.add(updateLogo);
    }

    return () => {
      if (mobileFrame !== null) window.cancelAnimationFrame(mobileFrame);
      window.removeEventListener("resize", updateNavTarget);
      if (!isMobile) gsap.ticker.remove(updateLogo);
      heroTrigger.kill();
      if (aboutTrigger) aboutTrigger.kill();
      if (navLabelEl) navLabelEl.style.opacity = 0;
    };
  }, []);

  return (
    <svg ref={logoRef} className="floating-logo" viewBox="0 0 806 920">
      <g transform="translate(0,808) scale(0.1,-0.1)">
        <path
          ref={wave1Ref}
          className="floating-logo__stroke"
          d="M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z"
        />
        <path
          ref={wave2Ref}
          className="floating-logo__stroke"
          d="M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z"
        />
        <path
          ref={wave3Ref}
          className="floating-logo__stroke"
          d="M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z"
        />
      </g>
      <text
        ref={titleRef}
        className="floating-logo__title"
        x="403"
        y="720"
        textAnchor="middle"
      >
        Entrepreneurship Cell
      </text>
      <text
        ref={subtitleRef}
        className="floating-logo__sub"
        x="403"
        y="770"
        textAnchor="middle"
      >
        RV University
      </text>
    </svg>
  );
}
