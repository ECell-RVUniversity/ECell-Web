import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  ['01', 'Start curious', 'A first question can become a company.'],
  ['02', 'Build together', 'The best ideas get sharper in the open.'],
  ['03', 'Leave a mark', 'Create work that reaches beyond campus.'],
];

export default function About() {
  const aboutSectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const statementRef = useRef(null);
  const lineRefs = useRef([]);
  const principleRefs = useRef([]);
  const signalRef = useRef(null);

  useEffect(() => {
    const section = aboutSectionRef.current;
    const eyebrow = eyebrowRef.current;
    const statement = statementRef.current;
    const lines = lineRefs.current;
    const principlesEls = principleRefs.current;
    const signal = signalRef.current;

    if (!section || !statement) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      [eyebrow, statement, signal, ...lines, ...principlesEls].filter(Boolean).forEach((element) => {
        element.style.transform = 'none';
        element.style.opacity = '1';
      });
      return undefined;
    }

    const context = gsap.context(() => {
      // Keep the CSS readable as a no-JS fallback; GSAP owns the hidden state
      // only after the scroll scene has been successfully created.
      gsap.set(statement, { autoAlpha: 0 });
      gsap.set(lines, { autoAlpha: 0, yPercent: 68 });
      gsap.set('.about__intro', { autoAlpha: 0, y: 42 });
      gsap.set(principlesEls, { autoAlpha: 0, y: 44 });

      // The signal starts to wake up as the logo completes its move. Once the
      // section reaches the viewport, it becomes a pinned, scroll-led scene.
      const arrival = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          end: 'top top',
          scrub: 0.6,
        },
      });

      arrival
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 1, ease: 'none' }, 0)
        .to(signal, { autoAlpha: 0.9, y: 0, scale: 1, duration: 1, ease: 'none' }, 0);

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: window.matchMedia('(max-width: 768px)').matches ? '+=250%' : '+=330%',
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      story
        .to(statement, { autoAlpha: 1, duration: 0.18, ease: 'none' }, 0)
        .to(lines, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.68,
          stagger: 0.3,
          ease: 'power2.out',
        }, 0.12)
        .to('.about__intro', { autoAlpha: 1, y: 0, duration: 0.56, ease: 'power2.out' }, 1.8)
        .to(principlesEls, {
          autoAlpha: 1,
          y: 0,
          duration: 0.56,
          stagger: 0.22,
          ease: 'power2.out',
        }, 1.95);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={aboutSectionRef} className="about" id="aboutSection">
      <div className="about__signal" ref={signalRef} aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="about__inner wrap">
        <div ref={eyebrowRef} className="about__eyebrow">
          <span>01 / About ECell</span>
          <i />
          <span>RV University</span>
        </div>

        <div ref={statementRef} className="about__statement">
          <span className="about__line-mask">
            <span ref={(element) => { lineRefs.current[0] = element; }} className="about__line">
              <strong>Building ideas,</strong> <em>chasing outcomes.</em>
            </span>
          </span>
          <span className="about__line-mask">
            <span ref={(element) => { lineRefs.current[1] = element; }} className="about__line">
              <strong>Backing founders</strong> <em>who go all in.</em>
            </span>
          </span>
          <span className="about__line-mask">
            <span ref={(element) => { lineRefs.current[2] = element; }} className="about__line">
              <em>Defining a legacy</em> <strong>of builders—</strong>
            </span>
          </span>
          <span className="about__line-mask">
            <span ref={(element) => { lineRefs.current[3] = element; }} className="about__line">
              <strong>on campus</strong> <em>and beyond.</em>
            </span>
          </span>
        </div>

        <div className="about__footer">
          <p className="about__intro">ECell is a place for the restless, the resourceful, and everyone ready to make an idea real.</p>
          <div className="about__principles">
            {principles.map(([number, title, copy], index) => (
              <article
                className="about__principle"
                key={number}
                ref={(element) => { principleRefs.current[index] = element; }}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
