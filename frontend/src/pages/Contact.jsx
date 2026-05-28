import { useState } from 'react';
import {
  Clock,
  Headphones,
  MailCheck,
  MapPinned,
  MessagesSquare,
  PhoneCall,
  SendHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Thanks for contacting PetNest. Our support team will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-blue-50/20 via-white to-blue-50/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100 rounded-full">
            <Headphones className="w-3.5 h-3.5" />
            PetNest Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950 tracking-tight leading-tight">
            Contact{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">
              PetNest
            </span>
          </h1>
          <p className="text-lg text-blue-900/70 font-light leading-relaxed">
            Need help with pet food, accessories, delivery, payments, or an existing order? Reach
            out to our customer-care team and we will guide you with clear, friendly support.
          </p>
        </section>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          {/* Info cards (1/3 width) */}
          <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm flex gap-5 items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">Customer Care Hotline</h3>
                <p className="text-blue-900/60 font-light text-sm mt-1">
                  Fast help for orders, delivery updates, and product questions.
                </p>
                <a
                  href="tel:+94771234567"
                  className="text-blue-600 font-semibold text-base mt-2 block hover:underline"
                >
                  +94 77 123 4567
                </a>
                <p className="inline-flex items-center gap-1.5 text-blue-900/50 text-xs mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  Mon-Sat, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm flex gap-5 items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <MailCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">Email Support</h3>
                <p className="text-blue-900/60 font-light text-sm mt-1">
                  Best for order numbers, product availability, and detailed requests.
                </p>
                <a
                  href="mailto:support@petnest.lk"
                  className="text-blue-600 font-semibold text-base mt-2 block hover:underline"
                >
                  support@petnest.lk
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm flex gap-5 items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <MapPinned className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">Service Area</h3>
                <p className="text-blue-900/60 font-light text-sm mt-1">
                  Online pet supplies with convenient support for Sri Lankan pet parents.
                </p>
                <p className="text-blue-950 font-semibold text-sm mt-2">
                  Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form (2/3 width) */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-blue-100 shadow-md lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <MessagesSquare className="text-blue-600 w-6 h-6" />
              <h2 className="text-2xl font-extrabold text-blue-950">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-blue-950">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-light text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-blue-950">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-light text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-blue-950">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-light text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-blue-950">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-light text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-55 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <SendHorizontal className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Contact;
