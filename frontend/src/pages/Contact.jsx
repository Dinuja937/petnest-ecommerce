import { useState } from 'react';
import {
  Clock,
  Headphones,
  MailCheck,
  MapPinned,
  MessagesSquare,
  PhoneCall,
  SendHorizontal,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const contactCards = [
  {
    icon: PhoneCall,
    title: 'Customer Care Hotline',
    description: 'Fast help for orders, delivery updates, and product questions.',
    detail: '+94 77 123 4567',
    href: 'tel:+94771234567',
    sub: 'Mon–Sat, 9:00 AM – 6:00 PM',
  },
  {
    icon: MailCheck,
    title: 'Email Support',
    description: 'Best for order numbers, product availability, and detailed requests.',
    detail: 'support@petnest.lk',
    href: 'mailto:support@petnest.lk',
    sub: null,
  },
  {
    icon: MapPinned,
    title: 'Service Area',
    description: 'Online pet supplies with convenient support for Sri Lankan pet parents.',
    detail: 'Colombo, Sri Lanka',
    href: null,
    sub: null,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07 },
  }),
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="w-full min-h-screen bg-linear-to-b from-brand-secondary/50 via-white to-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto space-y-5 mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary rounded-full border border-brand-border">
            <Headphones className="w-3.5 h-3.5" />
            PetNest Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-text-primary tracking-tight leading-tight">
            Get in Touch with{' '}
            <span className="text-brand-primary">PetNest</span>
          </h1>
          <p className="text-lg text-brand-text-secondary font-light leading-relaxed">
            Need help with pet food, accessories, delivery, payments, or an existing order? Reach
            out to our customer-care team and we will guide you with clear, friendly support.
          </p>
        </motion.section>

        {/* ── Content Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Info cards */}
          <div className="space-y-5 lg:col-span-1">
            {contactCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 1}
                className="bg-brand-card-background p-6 rounded-brand-lg border border-brand-border shadow-brand-soft flex gap-4 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-brand-secondary rounded-brand-md flex items-center justify-center text-brand-primary shrink-0 border border-brand-border">
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-text-primary text-sm tracking-tight">{card.title}</h3>
                  <p className="text-brand-text-secondary text-xs mt-1 leading-relaxed font-light">
                    {card.description}
                  </p>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="text-brand-primary font-bold text-sm mt-2 block hover:underline"
                    >
                      {card.detail}
                    </a>
                  ) : (
                    <p className="text-brand-text-primary font-bold text-sm mt-2">{card.detail}</p>
                  )}
                  {card.sub && (
                    <p className="inline-flex items-center gap-1.5 text-brand-text-secondary text-xs mt-1.5">
                      <Clock className="w-3 h-3" />
                      {card.sub}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="bg-brand-card-background p-8 sm:p-10 rounded-brand-lg border border-brand-border shadow-brand-soft lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-secondary rounded-brand-md flex items-center justify-center text-brand-primary border border-brand-border">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Send Us a Message</h2>
                <p className="text-xs text-brand-text-secondary font-light mt-0.5">We reply within 24 hours on business days.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-brand-text-primary">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm text-brand-text-primary bg-gray-50/40 hover:bg-gray-50/70 focus:bg-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-brand-text-primary">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm text-brand-text-primary bg-gray-50/40 hover:bg-gray-50/70 focus:bg-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-semibold text-brand-text-primary">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm text-brand-text-primary bg-gray-50/40 hover:bg-gray-50/70 focus:bg-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-brand-text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more about your query..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm text-brand-text-primary bg-gray-50/40 hover:bg-gray-50/70 focus:bg-white placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <SendHorizontal className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
