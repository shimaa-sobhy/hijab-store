import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal.js';
import useContinuousMotion from '../../hooks/useContinuousMotion.js';
import aboutImg1 from '../../assets/images/about-1.jpg';
import aboutImg2 from '../../assets/images/about-2.jpg';

export default function About() {
  const [heroRef, heroVis] = useScrollReveal();
  const [gridRef, gridVis] = useScrollReveal({ threshold: 0.15 });
  const [taglineRef, tagVis] = useScrollReveal();
  const [valuesRef, valsVis] = useScrollReveal({ threshold: 0.1 });

  const imgA = useContinuousMotion({ floatY: { amp: 6, period: 5.2 }, driftX: { amp: 3, period: 9.1 }, breathe: { min: 0.985, max: 1.015, period: 7.3 }, rotate: { amp: 0.5, period: 11 }, delay: 0.8 });
  const imgB = useContinuousMotion({ floatY: { amp: 5, period: 4.8 }, driftX: { amp: 2.5, period: 8.7 }, breathe: { min: 0.988, max: 1.012, period: 6.9 }, rotate: { amp: 0.4, period: 13 }, delay: 0.9 });

  const orn1 = useContinuousMotion({ floatY: { amp: 8, period: 7 }, driftX: { amp: 5, period: 11 }, rotate: { amp: 1, period: 15 }, delay: 0 });
  const orn2 = useContinuousMotion({ floatY: { amp: 6, period: 9 }, driftX: { amp: 4, period: 13 }, rotate: { amp: 0.8, period: 18 }, delay: 0.5 });
  const orn3 = useContinuousMotion({ floatY: { amp: 10, period: 12 }, driftX: { amp: 7, period: 15 }, rotate: { amp: 1.5, period: 20 }, delay: 0.3 });
  const orn4 = useContinuousMotion({ floatY: { amp: 3, period: 14 }, driftX: { amp: 2, period: 19 }, rotate: { amp: 2, period: 25 }, delay: 1.2 });
  const orn5 = useContinuousMotion({ floatY: { amp: 4, period: 8 }, driftX: { amp: 3, period: 12 }, rotate: { amp: 0.5, period: 22 }, delay: 0.7 });

  const card1 = useContinuousMotion({ floatY: { amp: 4, period: 4.5 }, driftX: { amp: 2, period: 7 }, breathe: { min: 0.993, max: 1.007, period: 5 }, rotate: { amp: 0.3, period: 14 }, delay: 0.8 });
  const card2 = useContinuousMotion({ floatY: { amp: 3.5, period: 5 }, driftX: { amp: 1.5, period: 8 }, breathe: { min: 0.995, max: 1.005, period: 6 }, rotate: { amp: 0.2, period: 16 }, delay: 0.9 });
  const card3 = useContinuousMotion({ floatY: { amp: 3, period: 5.5 }, driftX: { amp: 1, period: 9 }, breathe: { min: 0.99, max: 1.01, period: 4 }, rotate: { amp: 0.35, period: 12 }, delay: 1.0 });

  return (
    <div className="about-wrap">
      <div ref={orn1} className="about-ornament about-ornament--1" aria-hidden />
      <div ref={orn2} className="about-ornament about-ornament--2" aria-hidden />
      <div ref={orn3} className="about-ornament about-ornament--3" aria-hidden />
      <div ref={orn4} className="about-ornament about-ornament--4" aria-hidden />
      <div ref={orn5} className="about-ornament about-ornament--5" aria-hidden />

      <section ref={heroRef} className={`about-hero ${heroVis ? 'is-visible' : ''}`}>
        <p className="about-hero__sub">— About Us —</p>
        <h1 className="about-hero__title">Our Story</h1>
        <div className="about-hero__line" />
        <p className="about-hero__desc">
          At VEIL LUXE, the hijab is more than an accessory — it is an expression of faith, identity, and grace.
        </p>
      </section>

      <section ref={gridRef} className={`about-grid ${gridVis ? 'is-visible' : ''}`}>
        <div className="about-grid__item about-grid__item--a">
          <div ref={imgA} className="about-grid__img-wrap">
            <img src={aboutImg1} alt="Elegant draping" className="about-grid__img" />
          </div>
        </div>
        <div className="about-grid__item about-grid__item--b">
          <div ref={imgB} className="about-grid__img-wrap">
            <img src={aboutImg2} alt="Luxury hijab" className="about-grid__img" />
          </div>
        </div>
        <div className="about-grid__accent" aria-hidden />
      </section>

      <section ref={taglineRef} className={`about-tagline ${tagVis ? 'is-visible' : ''}`}>
        <p className="about-tagline__gold">— Timeless Elegance —</p>
        <h2 className="about-tagline__text">
          Every fold tells a story of grace, faith, and effortless beauty.
        </h2>
      </section>

      <section ref={valuesRef} className={`about-values ${valsVis ? 'is-visible' : ''}`}>
        <div ref={card1} className="about-values__item">
          <div className="about-values__icon"><i className="fas fa-feather-alt" /></div>
          <h3 className="about-values__title">Finest Fabrics</h3>
          <p className="about-values__desc">Sourced from the world's most respected mills for unparalleled softness and drape.</p>
        </div>
        <div ref={card2} className="about-values__item">
          <div className="about-values__icon"><i className="fas fa-gem" /></div>
          <h3 className="about-values__title">Artisan Craft</h3>
          <p className="about-values__desc">Every stitch reflects generations of skill and a deep commitment to quality.</p>
        </div>
        <div ref={card3} className="about-values__item">
          <div className="about-values__icon"><i className="fas fa-leaf" /></div>
          <h3 className="about-values__title">Mindful Luxury</h3>
          <p className="about-values__desc">Beauty that honours both people and planet, without compromise.</p>
        </div>
      </section>
    </div>
  );
}
