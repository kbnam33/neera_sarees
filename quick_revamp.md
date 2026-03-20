File: src/pages/Home.jsx — Update headline and subtitle
jsx
<p className="neera-hero__headline">
  Wear what the day<br />
  demands.
</p>

<p className="neera-hero__sub">
  Sarees that breathe with you from the first meeting<br />
  to the last.
</p>
File: src/styles/hero.css — Update these rules only
css
.neera-hero__content {
  max-width: 680px;
  right: 4vw;
  bottom: 10vh;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.neera-hero__headline {
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1rem;
  text-align: left;
}

/* "demands." — second line right-aligned */
.neera-hero__headline br + * ,
.neera-hero__headline {
  display: block;
}

.neera-hero__headline {
  text-align: right;         /* pushes "demands." to right */
}

.neera-hero__sub {
  width: 100%;
  font-size: clamp(0.82rem, 1.1vw, 0.92rem);
  line-height: 1.7;
  margin-bottom: 1.8rem;
  text-align: right;         /* pushes "to the last." to right edge */
}

.neera-hero__cta {
  align-self: flex-end;      /* CTA to right edge */
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.neera-hero__cta-line {
  width: 100%;
}