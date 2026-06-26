import React from 'react';
import { Truck, ShieldCheck, Headphones, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import CategoryBanners from '../components/home/CategoryBanners';

const features = [
  {
    icon: Truck,
    title: 'Same-Day Delivery',
    description: 'Available for all Negombo & Colombo orders placed before 2 PM.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% secure checkout — we accept cards and direct bank transfers.',
  },
  {
    icon: Headphones,
    title: '24/7 Premium Support',
    description: 'Dedicated helpline for all your pet care questions and queries.',
  },
  {
    icon: Leaf,
    title: '100% Organic Products',
    description: 'Sourced from certified natural, eco-friendly, and pet-safe brands.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Home = () => {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <Hero />

      {/* Category Section */}
      <CategoryBanners />

      {/* Features / Trust Strip */}
      <section className="w-full py-20 bg-brand-secondary/40 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-primary bg-white border border-brand-primary/20 px-4 py-1.5 rounded-full mb-4">
              Why PetNest?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-primary tracking-tight">
              Built for Pet Lovers, by Pet Lovers
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.article
                key={title}
                variants={itemVariants}
                className="flex flex-col items-start gap-4 p-6 bg-white rounded-brand-lg border border-brand-border shadow-brand-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-brand-md bg-brand-secondary flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-text-primary text-base leading-snug">{title}</h4>
                  <p className="text-sm text-brand-text-secondary font-light mt-1.5 leading-relaxed">{description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
