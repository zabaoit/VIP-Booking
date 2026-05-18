import { ContactCard } from '../components/contact/ContactCard'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'

export function ContactPage() {
  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Get in touch"
        title="Concierge Support"
        copy="Contact channels, quick help cards, message form, and common guest questions."
      />

      <section className="contact-grid">
        <aside className="contact-cards">
          <ContactCard icon="phone" title="Call Concierge" copy="+84 901 123 456" />
          <ContactCard icon="mail" title="Email Reservations" copy="reservations@vipbooking.vn" />
          <ContactCard icon="mapPin" title="Visit Us" copy="Son Tra Coast, Da Nang, Viet Nam" />
        </aside>

        <form className="form-panel contact-form">
          <h2>Send a Message</h2>
          <div className="form-grid">
            <label>
              Full name
              <input defaultValue="Anh Nguyen" />
            </label>
            <label>
              Email
              <input defaultValue="anh.nguyen@example.com" type="email" />
            </label>
            <label className="span-2">
              Subject
              <select defaultValue="Booking Consultation">
                <option>Booking Consultation</option>
                <option>Private Event</option>
                <option>Corporate Travel</option>
              </select>
            </label>
            <label className="span-2">
              Message
              <textarea
                defaultValue="I would like to arrange a suite with airport pickup."
                rows={6}
              />
            </label>
          </div>
          <button className="primary-button" type="button">
            Send Message
          </button>
        </form>
      </section>

      <section className="section-shell faq-section">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        {[
          'What is the VIP flexible cancellation policy?',
          'Can concierge arrange airport pickup?',
          'Are corporate invoices available?',
          'Can I change my booking after payment?',
        ].map((question, index) => (
          <details className="faq-item" key={question} open={index === 2}>
            <summary>{question}</summary>
            <p>
              Yes. The booking team can update service requests, room preferences, and invoices
              according to the selected rate conditions.
            </p>
          </details>
        ))}
      </section>
    </main>
  )
}
