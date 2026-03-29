'use client';

/**
 * AboutStory.tsx — Hotel Rustikal
 *
 * ACT I   — Asymmetric split (Historie)
 * ACT 1.5 — Transition Heading (Zažijte Moravu)
 * ACT II  — Cinematic Framed Snap Scroll (Zážitky, Cimbálka, Degustace)
 * ACT III — Stat strip (Statistiky)
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ─── Image sources ──────────────────────────────────────────── */
const IMG_PORTRAIT = '/portrait-pour.webp';
const IMG_ACCENT =
'/spooky.png';
/* Background images for the Snap Slides */
const IMG_CELLAR   = '/slide-sklipek.webp';
const IMG_MUSIC    = '/dalsi-obrazek.png';
const IMG_VINEYARD = '/slide-degustace.webp';

/* ─── Stat strip data ────────────────────────────────────────── */
interface StatData {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatData[] = [
  { value: 2007,  suffix: '',    label: 'Rok založení'  },
  { value: 12,    suffix: ' ha', label: 'Rozloha vinic' },
  { value: 40000, suffix: '+',   label: 'Lahví ročně'   },
];

/* ─── Soundwave bar heights ─────────────────────────────────── */
const WAVE_H: number[] = [38,58,82,96,68,84,100,72,88,62,98,52,74,44];

/* ─── Counter hook ───────────────────────────────────────────── */
function useCounter(ref: React.RefObject<HTMLSpanElement | null>, target: number, suffix: string, trigger: Element | null): void {
  useEffect(() => {
    if (!ref.current || !trigger) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger, start: 'top 75%', once: true },
      onUpdate: () => {
        if (ref.current)
          ref.current.textContent =
            Math.round(obj.val).toLocaleString('cs-CZ') + suffix;
      },
    });
  }, [ref, target, suffix, trigger]);
}

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

function StatItem({ value, suffix, label, triggerRef }: StatItemProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  useCounter(numRef, value, suffix, triggerRef?.current);
  return (
    <div className="flex flex-col items-start gap-2">
      <span ref={numRef} className="font-display"
        style={{ fontSize: 'clamp(38px,5.5vw,80px)', color: 'var(--color-gold)',
          lineHeight: 1, letterSpacing: '-0.01em', fontWeight: 400 }}>0</span>
      <span className="font-body text-xs uppercase"
        style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.22em' }}>{label}</span>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function AboutStory() {

  /* ACT I */
  const sectionRef    = useRef<HTMLElement>(null);
  const ghostYearRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const para1Ref      = useRef<HTMLParagraphElement>(null);
  const para2Ref      = useRef<HTMLParagraphElement>(null);
  const signatureRef  = useRef<HTMLDivElement>(null);
  const imgWrapRef    = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLImageElement>(null);
  const accentImgRef  = useRef<HTMLImageElement>(null);
  const accentWrapRef = useRef<HTMLDivElement>(null);

  /* ACT 1.5 - Transition Heading */
  const transitionHeadingRef = useRef<HTMLDivElement>(null);

  /* ACT II - Fullpage Snap Refs */
  const expSecRef = useRef<HTMLDivElement>(null);

  const bg1 = useRef<HTMLDivElement>(null);
  const bg2 = useRef<HTMLDivElement>(null);
  const bg3 = useRef<HTMLDivElement>(null);

  const imgInner1 = useRef<HTMLImageElement>(null);
  const imgInner2 = useRef<HTMLImageElement>(null);
  const imgInner3 = useRef<HTMLImageElement>(null);

  const text1 = useRef<HTMLDivElement>(null);
  const text2 = useRef<HTMLDivElement>(null);
  const text3 = useRef<HTMLDivElement>(null);

  const pill1 = useRef<HTMLDivElement>(null);
  const pill2 = useRef<HTMLDivElement>(null);
  const pill3 = useRef<HTMLDivElement>(null);

  /* ACT II — state refs (přístupné z JSX i useEffect) */
  const currentSlideRef = useRef<number>(0);
  const goToSlideRef = useRef<(index: number) => void>(() => {});

  /* ACT III */
  const statsSecRef  = useRef<HTMLDivElement>(null);
  const statsRuleRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    /* ── Inject keyframes + mobile overrides ───────────────── */
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rWave {
        from { transform: scaleY(0.12); opacity: 0.5; }
        to   { transform: scaleY(1);    opacity: 1;   }
      }
      .exp-cta-link:hover { border-color: rgba(201,168,76,0.9) !important; }

      /* ── MOBILNÍ OPTIMALIZACE ──────────────────────────────
         Desktop/laptop layout je beze změny.
         Vše níže platí jen pro breakpointy < 1024 px.
         ───────────────────────────────────────────────────── */

      /* ACT I – obrázek: zarovnání na střed + širší zobrazení */
      @media (max-width: 1023px) {
        .about-img-flex {
          justify-content: center !important;
          padding-left: 0 !important;
        }
        .about-img-wrap {
          width: min(82vw, 400px) !important;
          height: min(115vw, 560px) !important;
        }
        /* Odstranit přetečení ghost roku na mobilu */
        .about-ghost-year {
          overflow: hidden !important;
          max-width: 100vw !important;
        }
      }

      /* ACT I – text sloupec: plná šířka + symetrické odsazení */
      @media (max-width: 1023px) {
        .about-text-col {
          padding-top: 0 !important;
        }
      }

      /* ACT II – snap slide nadpisy: menší minimum na úzkých displejích */
      @media (max-width: 639px) {
        .snap-slide-heading {
          font-size: clamp(30px, 9.5vw, 62px) !important;
          line-height: 0.88 !important;
        }
        .snap-eyebrow {
          font-size: 9px !important;
          letter-spacing: 0.22em !important;
        }
        /* Více prostoru pro obsah snímků na mobilu */
        .snap-slide-text {
          padding-left: clamp(20px, 5vw, 40px) !important;
          padding-right: clamp(20px, 5vw, 40px) !important;
        }
        /* Transition heading – menší nadpis na malých telefonech */
        .transition-heading-h2 {
          font-size: clamp(34px, 10vw, 110px) !important;
        }
      }

      /* ACT II – šipky: menší na mobilních zařízeních */
      @media (max-width: 639px) {
        .about-exp-arrow {
          width: 44px !important;
          height: 44px !important;
        }
        .about-exp-arrow svg {
          width: 28px !important;
          height: 14px !important;
        }
      }

      /* ACT III – stats: jemnější gap na malých obrazovkách */
      @media (max-width: 479px) {
        .stats-grid {
          gap: 2rem !important;
        }
      }
    `;
    document.head.appendChild(style);

    /* ── Lenis bridge ───────────────────────────────────────── */
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop: () => lenis.scroll,
        getBoundingClientRect: () => ({
          top: 0, left: 0,
          width: window.innerWidth, height: window.innerHeight,
        }),
      });
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ══════════════════════════════════════
         ACT I — entrance (všechna zařízení)
         ══════════════════════════════════════ */

      /* Ghost rok — parallax jen na desktopu */
      mm.add('(min-width: 768px)', () => {
        gsap.to(ghostYearRef.current, {
          yPercent: -22, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      gsap.fromTo(eyebrowRef.current, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 82%' },
      });

      const headingLines = headingRef.current?.querySelectorAll('.reveal-line') || [];
      headingLines.forEach((line, i) => {
        gsap.fromTo(line, { yPercent: 110, skewY: 1 }, {
          yPercent: 0, skewY: 0, duration: 1.05, ease: 'power4.out', delay: i * 0.12,
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        });
      });

      [para1Ref, para2Ref, signatureRef].forEach((ref, i) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
          scrollTrigger: { trigger: para1Ref.current, start: 'top 78%' },
        });
      });

      gsap.fromTo(imgWrapRef.current, { clipPath: 'inset(100% 0 0 0 round 16px)' }, {
        clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: imgWrapRef.current, start: 'top 82%' },
      });

      /* Parallax portrétu — jen na desktopu */
      mm.add('(min-width: 768px)', () => {
        gsap.to(imgRef.current, {
          yPercent: -12, ease: 'none',
          scrollTrigger: { trigger: imgWrapRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      gsap.fromTo(accentWrapRef.current, { clipPath: 'inset(100% 0 0 0 round 16px)' }, {
        clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: accentWrapRef.current, start: 'top 80%' },
      });

      /* ══════════════════════════════════════
         ACT 1.5 — Transition Heading Reveal
         ══════════════════════════════════════ */
      gsap.fromTo(transitionHeadingRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: transitionHeadingRef.current, start: 'top 85%' },
      });

   /* ══════════════════════════════════════
         ACT II — BEZŠVÉ ZACYKLENÍ (SEAMLESS LOOP)
         ══════════════════════════════════════ */
      const slides = [
        { bg: bg1.current, img: imgInner1.current, text: text1.current, pill: pill1.current },
        { bg: bg2.current, img: imgInner2.current, text: text2.current, pill: pill2.current },
        { bg: bg3.current, img: imgInner3.current, text: text3.current, pill: pill3.current },
      ];

      // Reset vrstev a příprava pozic
      gsap.set([bg1.current, bg2.current, bg3.current], { zIndex: 1, clipPath: 'inset(100% 0 0 0)' });
      gsap.set(bg1.current, { zIndex: 5, clipPath: 'inset(0% 0% 0% 0%)' }); // První zobrazený

      gsap.set([imgInner1.current, imgInner2.current, imgInner3.current], { scale: 1.1, yPercent: 0 });
      gsap.set(imgInner1.current, { scale: 1 });

      gsap.set([text2.current, text3.current], { opacity: 0, y: 60 });
      gsap.set([pill2.current, pill3.current], { scaleX: 0 });

      let isAnimating = false;

      const goToSlide = (index: number) => {
        if (isAnimating) return;
        const next = (index + 3) % 3;
        const prev = currentSlideRef.current;
        if (next === prev) return;

        isAnimating = true;
        currentSlideRef.current = next;

        // Vypočítá směr pohybu – zajistí, že 3. na 1. snímek pojede dopředu
        const isForward = (next === prev + 1) || (prev === 2 && next === 0);

        const prevObj = slides[prev];
        const nextObj = slides[next];

        // Skládání z-indexů: nový snímek jde nahoru (3), starý těsně pod něj (2)
        slides.forEach((s, i) => gsap.set(s.bg, { zIndex: i === prev ? 2 : (i === next ? 3 : 1) }));

        // Startovní pozice pro novou fotku
        gsap.set(nextObj.bg, { clipPath: isForward ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' });
        gsap.set(nextObj.img, { scale: 1.1, yPercent: isForward ? 5 : -5 });

        const dur = 0.8;

        // Odtlačení aktuální (staré) vrstvy
        gsap.to(prevObj.img, { yPercent: isForward ? -15 : 15, duration: dur, ease: 'power3.inOut' });
        gsap.to(prevObj.text, { y: isForward ? -80 : 80, opacity: 0, duration: 0.5, ease: 'power2.in' });
        gsap.to(prevObj.pill, { scaleX: 0, duration: 0.5, ease: 'power2.in' });

        // Natažení nové (další) vrstvy
        gsap.to(nextObj.bg, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'power3.inOut' });
        gsap.to(nextObj.img, { scale: 1, yPercent: 0, duration: dur, ease: 'power3.inOut' });

        gsap.fromTo(nextObj.text,
          { y: isForward ? 60 : -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.3 }
        );
        gsap.fromTo(nextObj.pill,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: 'power2.out', delay: 0.3, onComplete: () => { isAnimating = false; } }
        );
      };

      goToSlideRef.current = goToSlide;

      /* Swipe navigace — všechna zařízení (touch i touchpad) */
      const el = expSecRef.current;
      if (el) {
        let startX = 0;
        let startY = 0;

        const onStart = (e: TouchEvent) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        };
        const onEnd = (e: TouchEvent) => {
          const dx = e.changedTouches[0].clientX - startX;
          const dy = e.changedTouches[0].clientY - startY;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
            goToSlide(currentSlideRef.current + (dx < 0 ? 1 : -1));
          }
        };

        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchend', onEnd, { passive: true });
      }

      /* ══════════════════════════════════════
         ACT III
         ══════════════════════════════════════ */
      gsap.fromTo(statsRuleRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: statsSecRef.current, start: 'top 80%' },
        }
      );

    }, sectionRef);

    /* Klávesová navigace — ArrowLeft / ArrowRight (mimo gsap.context pro přístup v cleanup) */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToSlideRef.current(currentSlideRef.current + 1);
      if (e.key === 'ArrowLeft')  goToSlideRef.current(currentSlideRef.current - 1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, [lenis]);

  /* ── Shared micro-helpers ─────────────────────────────────── */
  const pip: React.CSSProperties       = { width: '24px', height: '1px', background: 'var(--color-gold)', flexShrink: 0 };
  const ebStyle: React.CSSProperties   = { fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold)' };
  const ruleMuted: React.CSSProperties = { width: '60px', height: '1px', background: 'var(--color-gold-muted)' };

  const slideOverlay =
    'linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.04) 65%), ' +
    'linear-gradient(to top,   rgba(0,0,0,0.42) 0%, transparent 45%)';

  return (
    <section
      ref={sectionRef}
      id="sklep"
      className="relative"
      /* overflowX: hidden zabraňuje horizontálnímu přetečení ghost roku na mobilu.
         Na desktopu je obsah uvnitř viewportu, takže vizuálně nic nemění. */
      style={{ background: '#4A0404', overflowX: 'hidden' }}
    >

      {/* ACT I — HISTORIE A RODINA */}
      <div className="relative"
        style={{ paddingTop: 'clamp(80px,12vw,160px)', paddingBottom: 'clamp(20px,4vw,60px)' }}>

        {/* Ghost rok — třída about-ghost-year omezuje přetečení na mobilu */}
        <div ref={ghostYearRef}
          className="about-ghost-year absolute left-0 top-0 select-none pointer-events-none overflow-hidden"
          aria-hidden="true" style={{ zIndex: 0, top: '-2%' }}>
          <span className="font-display font-bold leading-none" style={{
            fontSize: 'clamp(160px,28vw,440px)', color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.07)',
            letterSpacing: '-0.03em', whiteSpace: 'nowrap', willChange: 'transform',
          }}>2007</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0"
          style={{ paddingLeft: 'clamp(24px,8vw,120px)', paddingRight: 'clamp(24px,6vw,80px)' }}>

          {/* Text sloupec — třída about-text-col nuluje paddingTop na mobilu */}
          <div className="about-text-col lg:col-span-5 flex flex-col justify-center"
            style={{ paddingTop: 'clamp(0px,6vw,80px)' }}>

            <div ref={eyebrowRef} className="flex items-center gap-3 mb-8" style={{ opacity: 0 }}>
              <div className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
              <span className="font-body text-[10px] tracking-widest3 uppercase"
                style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>Náš příběh</span>
            </div>

            <div ref={headingRef} className="mb-8" style={{ lineHeight: 0.92 }}>
              {['Poctivá práce.', 'z lásky k zemi', 'a vínu.'].map((line) => (
                <div key={line} className="overflow-hidden">
                  <div className="reveal-line font-display" style={{
                    fontSize: 'clamp(32px,4.8vw,68px)', color: 'var(--color-cream)',
                    letterSpacing: '0.01em', fontWeight: 400, paddingBottom: '0.08em',
                    willChange: 'transform',
                  }}>{line}</div>
                </div>
              ))}
            </div>

            <div className="mb-8" style={{ height: '1px', width: '48px', background: 'var(--color-gold-muted)' }} />

            <p ref={para1Ref} className="font-body font-light mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--color-cream-muted)',
                maxWidth: '42ch', opacity: 0 }}>
              Vinařství Rustikal zapustilo své první kořeny v roce 2007, tehdy ještě jako
              společný sen a čistá radost party přátel. Tato neutuchající vášeň pro řemeslo
              nás v roce 2010 dovedla k vysazení vlastních vinic, čímž jsme uzavřeli kruh
              poctivé výroby. Od té chvíle provázíme každou bobuli na její cestě od prvního
              jarního pupenu až po konečné plnění do lahví.
            </p>
            <p ref={para2Ref} className="font-body font-light leading-relaxed"
              style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--color-cream-muted)',
                maxWidth: '42ch', opacity: 0 }}>
              Dnes na dvanácti hektarech prosluněných tratí s pokorou opečováváme deset
              ušlechtilých odrůd. Naše práce je tichým dialogem s přírodou, kde nespěcháme
              a ctíme přirozený rytmus zrání. Každá lahev v sobě nese otisk trpělivosti
              a poctivého ručního sběru, díky kterému může víno ve vaší sklenici
              vyprávět svůj nefalšovaný příběh o slunci a zemi.
            </p>

            <div ref={signatureRef} className="flex items-center gap-4 mt-10" style={{ opacity: 0 }}>
              <div className="h-px flex-1 max-w-[40px]" style={{ background: 'var(--color-cream-faint)' }} />
              <span className="font-display italic"
                style={{ color: 'var(--color-cream-muted)', fontSize: '16px' }}>Vinařství Rustikal</span>
            </div>
          </div>

          {/* ── ZMĚNA 1 & 2: justify-center místo justify-end, odstraněn paddingLeft ── */}
          <div className="about-img-flex lg:col-span-7 relative flex items-center justify-center lg:justify-center gap-5 mt-16 lg:mt-0"
            style={{ paddingTop: '48px' }}>

            {/* ── ZMĚNA 3: větší fotka — width clamp(200px,32vw,460px), height clamp(280px,48vw,640px) ── */}
            <div ref={imgWrapRef} className="about-img-wrap relative overflow-hidden flex-shrink-0"
              style={{ width: 'clamp(200px,32vw,460px)', height: 'clamp(280px,48vw,640px)',
                clipPath: 'inset(100% 0 0 0 round 16px)',
                borderRadius: '16px' }}>
              <img ref={imgRef} src={IMG_PORTRAIT}
                alt="Vinice Sklep u Dvořáků — Hustopeče"
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.14)', transformOrigin: 'center', willChange: 'transform' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(18,8,4,0.55) 0%, transparent 50%)' }} />
            </div>

          </div>
        </div>
      </div>

      {/* ACT 1.5 — TRANSITION HEADING */}
      <div ref={transitionHeadingRef} className="flex flex-col items-center justify-center text-center relative"
           style={{ padding: 'clamp(60px,10vw,120px) 24px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={pip} />
          <span className="font-body" style={ebStyle}>Nezapomenutelné chvíle</span>
          <div style={pip} />
        </div>
        {/* transition-heading-h2: menší font na úzkých obrazovkách přes media query */}
        <h2 className="transition-heading-h2 font-display uppercase italic" style={{
          fontSize: 'clamp(42px, 7.5vw, 110px)', color: 'var(--color-cream)',
          lineHeight: 0.85, letterSpacing: '-0.02em',
        }}>
          Zažijte Moravu<br/>všemi smysly
        </h2>
      </div>

      {/* ACT II — FRAMED CINEMATIC WIPE SCROLL */}
      <div
        ref={expSecRef}
        style={{
          height: 'clamp(600px, 80vh, 900px)',
          position: 'relative',
          width: 'calc(100% - clamp(32px, 6vw, 160px))',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}
      >

        {/* SLIDE 1 */}
        <div ref={bg1} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            ref={imgInner1}
            src={IMG_CELLAR}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transformOrigin: 'center',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 2 — Cimbálka */}
        <div ref={bg2} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <img
            ref={imgInner2}
            src={IMG_MUSIC}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center top',
              transformOrigin: 'center top',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 3 */}
        <div ref={bg3} style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          <img
            ref={imgInner3}
            src={IMG_VINEYARD}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transformOrigin: 'center',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 1: Zážitek ve vinném sklípku
            snap-slide-text + snap-slide-heading + snap-eyebrow: media query ladiče */}
        <div ref={text1} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={pip} />
              <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>01 · Zážitek ve sklípku</span>
            </div>

            <h2 className="snap-slide-heading font-display uppercase italic" style={{
              fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
              lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}>
              Kouzlo<br/>sklípku
            </h2>

            <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

            <p className="font-body font-light" style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8,
            }}>
              Vstupte do prostor, kde voní dubové sudy a ožívá historie. Tradiční vinný sklípek
              nabízí unikátní atmosféru pro večerní posezení. Místo, kde starosti necháte před
              prahem a naplno vnímáte kouzlo jižní Moravy.
            </p>
          </div>
        </div>

        {/* SLIDE 2: Cimbálka */}
        <div ref={text2} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, opacity: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div style={{ maxWidth: '540px' }}>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '30px', marginBottom: '24px', opacity: 0.9 }}>
              {WAVE_H.map((h, i) => (
                <div key={i} style={{
                  width: '3px', height: `${h}%`, background: 'var(--color-gold)',
                  transformOrigin: 'bottom',
                  animationName: 'rWave',
                  animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                  animationDelay: `${i * 0.05}s`,
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate',
                }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={pip} />
              <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>02 · Živá Cimbálka</span>
            </div>

            <h2 className="snap-slide-heading font-display uppercase italic" style={{
              fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
              lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}>
              Roztančené<br/>srdce
            </h2>

            <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

            <p className="font-body font-light" style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8,
            }}>
              K dobrému vínu patří pravá moravská hudba. Melodie cimbálu, nespoutaný zpěv
              a cinkání sklenic se postarají o to, že z cizinců se u stolu stávají přátelé.
              Zažijte večer plný nefalšované radosti a folkloru.
            </p>
          </div>
        </div>

        {/* SLIDE 3: Víno & Degustace */}
        <div ref={text3} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, opacity: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 w-full items-center">

            <div style={{ maxWidth: '540px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={pip} />
                <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>03 · Řízená Degustace</span>
              </div>

              <h2 className="snap-slide-heading font-display uppercase italic" style={{
                fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
                lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}>
                Chuť<br/>naší země
              </h2>

              <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

              <p className="font-body font-light" style={{
                fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8, marginBottom: '32px',
              }}>
                Připravíme pro vás degustaci těch nejlepších ročníků s odborným výkladem
                našeho someliéra. Ochutnejte Moravu v její nejčistší podobě. Každá kapka
                vypráví příběh slunce a pečlivé rodinné práce.
              </p>

              <a href="tel:+420775545760" className="exp-cta-link font-body"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '16px',
                  color: 'var(--color-gold)', textDecoration: 'none',
                  borderBottom: '1px solid rgba(201,168,76,0.40)',
                  paddingBottom: '8px', transition: 'border-color 0.3s ease',
                }}>

              </a>
            </div>

            {/* Right side stats — skryté na mobilu, beze změny na md+ */}
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="font-display uppercase" style={{
                fontSize: 'clamp(40px,7vw,100px)', color: 'var(--color-gold)',
                fontWeight: 400, lineHeight: 0.85, letterSpacing: '-0.03em',
                textShadow: '0 5px 15px rgba(0,0,0,0.6)',
              }}>

              </div>
              <div className="font-body text-[10px] tracking-widest3 uppercase mt-4 mb-12"
                style={{ color: 'rgba(255,255,255,0.9)' }}>

              </div>

              <div className="font-display uppercase" style={{
                fontSize: 'clamp(30px,5vw,70px)', color: 'rgba(201,168,76,0.8)',
                fontWeight: 400, lineHeight: 0.85, letterSpacing: '-0.02em',
                textShadow: '0 5px 15px rgba(0,0,0,0.6)',
              }}>

              </div>
              <div className="font-body text-[10px] tracking-widest3 uppercase mt-4"
                style={{ color: 'rgba(255,255,255,0.9)' }}>

              </div>
            </div>

          </div>
        </div>

        {/* ── NAVIGAČNÍ ŠIPKY — robustní, bez boxíku ── */}
        {(['left', 'right'] as const).map(side => {
          const d = side === 'left' ? -1 : 1;
          return (
            <button
              key={side}
              className="about-exp-arrow"
              onClick={() => goToSlideRef.current(currentSlideRef.current + d)}
              aria-label={d === -1 ? 'Předchozí snímek' : 'Další snímek'}
              style={{
                position: 'absolute',
                top: '50%', [side]: 'clamp(12px,2vw,32px)',
                transform: 'translateY(-50%)', zIndex: 30,
                background: 'none',
                border: 'none',
                width: 64, height: 64, padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.28s ease, opacity 0.28s ease',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.opacity = '0.85';
              }}
            >
              <svg width="44" height="22" viewBox="0 0 44 22" fill="none" aria-hidden>
                {d === -1 ? (
                  <>
                    <line x1="42" y1="11" x2="6" y2="11" stroke="rgba(245,241,231,0.85)" strokeWidth="1.5"/>
                    <path d="M14 3L4 11L14 19" stroke="rgba(245,241,231,0.95)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                ) : (
                  <>
                    <line x1="2" y1="11" x2="38" y2="11" stroke="rgba(245,241,231,0.85)" strokeWidth="1.5"/>
                    <path d="M30 3L40 11L30 19" stroke="rgba(245,241,231,0.95)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </button>
          );
        })}

        {/* ── PROGRESS PILLS ── */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '12px', alignItems: 'center', zIndex: 40,
        }}>
          {[pill1, pill2, pill3].map((ref, i) => (
            <div key={i} style={{
              width: '40px', height: '2px', borderRadius: '1px',
              background: 'rgba(255,255,255,0.2)', overflow: 'hidden',
            }}>
              <div ref={ref} style={{
                width: '100%', height: '100%', background: 'var(--color-gold)',
                transformOrigin: 'left',
                transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)',
              }} />
            </div>
          ))}
        </div>

      </div>

      {/* ACT III — stats-grid: jemnější gap na xs displejích */}
      <div ref={statsSecRef} className="relative" style={{
        paddingTop: 'clamp(80px,8vw,140px)', paddingBottom: 'clamp(60px,8vw,120px)',
        paddingLeft: 'clamp(24px,8vw,120px)', paddingRight: 'clamp(24px,6vw,80px)',
        background: '#4A0404',
      }}>
        <div ref={statsRuleRef} className="mb-16" style={{
          height: '1px',
          background:
            'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-muted) 40%, transparent 100%)',
          transformOrigin: 'left center', willChange: 'transform',
        }} />

        <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-14 sm:gap-8">
          {STATS.map((stat) => (
            <StatItem key={stat.label} value={stat.value} suffix={stat.suffix}
              label={stat.label} triggerRef={statsSecRef} />
          ))}
        </div>

        <div className="mt-16">
          <span className="font-body text-[10px] tracking-widest3 uppercase"
            style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.3em' }}>
            Hustopeče · Jihomoravský kraj · Česká republika
          </span>
        </div>
      </div>

    </section>
  );
}