import Hero from '@/components/Hero'

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact Us"
        subtitle="Get in Touch"
        description="Reach out to the Diocese of Baguio Schools office. We're happy to answer your questions."
        imagePlaceholder="School Office Photo"
      />

      <div className="page-wrapper">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="space-y-6">
            <div className="card">
              <h3 className="card-title mb-3">Office Address</h3>
              <p className="section-body">[ Diocese of Baguio Schools Office Address ]<br />Baguio City, Benguet, Philippines</p>
            </div>
            <div className="card">
              <h3 className="card-title mb-3">Contact Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium">Phone:</span> +63 (74) 000-0000</li>
                <li><span className="font-medium">Email:</span> info@dobsschools.edu.ph</li>
                <li><span className="font-medium">Office Hours:</span> Mon–Fri, 8:00 AM – 5:00 PM</li>
              </ul>
            </div>
            <div className="placeholder-block">[ Google Map embed ]</div>
          </div>

          <div>
            <h2 className="section-heading">Send a Message</h2>
            <form className="card space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="juan@email.com" />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="e.g. Enrollment Inquiry" />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={5} placeholder="Your message..." />
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>

        </div>

      </div>
    </>
  )
}
