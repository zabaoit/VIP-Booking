import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'
import { images } from '../data/images'

export function AboutPage() {
  return (
    <main className="page-shell about-page">
      <PageIntro
        eyebrow="About us"
        title="A hospitality brand for precise luxury"
        copy="Story, imagery, leadership, and awards laid out with the same dark premium language as the demo."
      />

      <section className="about-hero">
        <img src={images.exterior} alt="VIP Booking hotel exterior" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2>Built around calm arrivals and exacting guest care.</h2>
          <p>
            VIP Booking combines room inventory, concierge services, booking review, payment, and
            admin operations into a single front-end experience for premium hotel teams.
          </p>
        </div>
      </section>

      <section className="image-strip">
        <img src={images.lobby} alt="Hotel lobby" loading="lazy" />
        <img src={images.pool} alt="Pool view" loading="lazy" />
        <img src={images.dining} alt="Restaurant table" loading="lazy" />
      </section>

      <section className="section-shell leadership-section">
        <SectionHeading eyebrow="Leadership" title="Executive leadership" />
        <div className="leader-grid">
          {[
            ['Jonathan Sterling', 'Chief Executive Officer', images.portraitOne],
            ['Elena Moore', 'Head of Guest Experience', images.portraitTwo],
            ['Marcus Tran', 'Director of Operations', images.portraitThree],
          ].map(([name, role, image]) => (
            <article className="leader-card" key={name}>
              <img src={image} alt={name} loading="lazy" />
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="award-grid">
        {[
          'Luxury Travel Award',
          'Five Star Guest Care',
          'Design Excellence',
          'Green Hotel Leader',
        ].map((award) => (
          <article className="award-card" key={award}>
            <Icon name="award" />
            <span>{award}</span>
          </article>
        ))}
      </section>
    </main>
  )
}
