import type { FormEvent } from 'react'
import { ContactCard } from '../components/contact/ContactCard'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useToast } from '../context/ToastContext'
import { readSupportInfo, saveContactMessage } from '../utils/appStorage'

export function ContactPage() {
  const { showToast } = useToast()
  const supportInfo = readSupportInfo()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get('fullName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const subject = String(formData.get('subject') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!fullName || !email || !subject || !message) {
      const status = 'Please complete all required fields before sending.'
      showToast({ title: 'Message is incomplete', message: status, variant: 'error' })
      return
    }

    saveContactMessage({
      name: fullName,
      email,
      subject,
      message,
    })
    const status = 'Message sent successfully. Our concierge will contact you shortly.'
    showToast({ title: 'Message sent', message: status, variant: 'success' })
    event.currentTarget.reset()
  }

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow="Get in touch"
        title="Concierge Support"
        copy="Contact channels, quick help cards, message form, and common guest questions."
      />

      <section className="contact-grid">
        <aside className="contact-cards">
          <ContactCard icon="phone" title="Call Concierge" copy={supportInfo.hotline} />
          <ContactCard icon="mail" title="Email Reservations" copy={supportInfo.email} />
          <ContactCard icon="mapPin" title="Visit Us" copy={supportInfo.address} />
        </aside>

        <form className="form-panel contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          <div className="form-grid">
            <label>
              Full name
              <input defaultValue="Anh Nguyen" name="fullName" />
            </label>
            <label>
              Email
              <input defaultValue="anh.nguyen@example.com" name="email" type="email" />
            </label>
            <label className="span-2">
              Subject
              <select defaultValue="Booking Consultation" name="subject">
                <option>Booking Consultation</option>
                <option>Private Event</option>
                <option>Corporate Travel</option>
              </select>
            </label>
            <label className="span-2">
              Message
              <textarea
                defaultValue="I would like to arrange a suite with airport pickup."
                name="message"
                rows={6}
              />
            </label>
          </div>
          <button className="primary-button" type="submit">
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
