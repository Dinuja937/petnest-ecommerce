import { Award, Headphones, HeartHandshake, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import birdsImage from '../assets/birds_category.jpg';
import catsImage from '../assets/cats_category.jpg';
import dogsImage from '../assets/dogs_category.jpg';
import bannerImage from '../assets/banner.jpg';

const highlights = [
  {
    icon: PackageCheck,
    title: 'Pet essentials in one place',
    description:
      'Shop food, treats, toys, grooming items, accessories, and daily care products for dogs, cats, and birds.',
  },
  {
    icon: Award,
    title: 'Quality you can trust',
    description:
      'We focus on dependable products with clear details so pet parents can choose with confidence.',
  },
  {
    icon: Truck,
    title: 'Convenient delivery',
    description:
      'Order online and get your pet supplies delivered without interrupting your busy day.',
  },
  {
    icon: Headphones,
    title: 'Helpful support',
    description:
      'Need help choosing a product or checking an order? Our team is ready to guide you.',
  },
];

const productGroups = [
  {
    image: dogsImage,
    title: 'For Dogs',
    description: 'Food, treats, toys, collars, beds, bowls, and grooming essentials.',
  },
  {
    image: catsImage,
    title: 'For Cats',
    description: 'Food, litter, treats, scratching products, toys, and accessories.',
  },
  {
    image: birdsImage,
    title: 'For Birds',
    description: 'Food, cages, perches, feeders, and everyday care items.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const About = () => {
  return (
    <main className="w-full min-h-screen bg-linear-to-b from-brand-secondary/50 via-white to-white">
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary rounded-full border border-brand-border">
            <HeartHandshake className="w-3.5 h-3.5" />
            About PetNest
          </span>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl font-black text-brand-text-primary tracking-tight leading-tight">
              Sri Lanka&apos;s friendly online pet store for everyday pet care.
            </h1>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              PetNest brings pet food, supplies, and care essentials into one simple shopping
              experience for pet parents who want reliable products without the extra hassle.
            </p>
            <p className="text-base text-brand-text-secondary leading-relaxed">
              Inspired by the best local pet stores, we are building PetNest around practical
              product choices, clear information, convenient delivery, and service that treats
              every pet like family.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Shop Pet Products
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-brand-secondary text-brand-primary font-bold rounded-brand-md border border-brand-border hover:border-brand-primary transition-all cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="relative rounded-brand-lg overflow-hidden border border-brand-border shadow-brand-soft bg-brand-text-primary min-h-[430px]"
        >
          <img
            src={bannerImage}
            alt="Happy pets with PetNest supplies"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-text-primary via-brand-text-primary/60 to-transparent" />

          <div className="relative z-10 p-8 sm:p-10 text-white flex flex-col h-full justify-end">
            <div className="w-12 h-12 rounded-brand-md bg-white/15 backdrop-blur-sm flex items-center justify-center text-blue-100 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Our Promise</h2>
            <p className="text-white/75 leading-relaxed text-sm mb-6">
              To make pet shopping easier, more dependable, and more caring — from the first
              product search to the moment your order reaches your door.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {['Trusted Supplies', 'Clear Choices', 'Pet-Parent Support'].map((item) => (
                <div key={item} className="rounded-brand-md bg-white/15 backdrop-blur-sm border border-white/15 p-3">
                  <p className="text-xs font-bold text-blue-50 leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Highlights Grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Why PetNest</span>
          <h2 className="mt-2 text-3xl font-black text-brand-text-primary tracking-tight">
            Everything your pet needs, all in one place.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <motion.article
              key={h.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={i}
              viewport={{ once: true }}
              className="bg-brand-card-background p-7 rounded-brand-lg border border-brand-border shadow-brand-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-secondary rounded-brand-md flex items-center justify-center text-brand-primary mb-5 border border-brand-border">
                <h.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-brand-text-primary mb-2 tracking-tight">{h.title}</h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">{h.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── What We Offer ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-brand-secondary border border-brand-border rounded-brand-lg p-8 sm:p-10 flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">What We Offer</span>
          <h2 className="text-3xl font-black text-brand-text-primary tracking-tight mb-4">
            Built for real pet-parent routines.
          </h2>
          <p className="text-brand-text-secondary leading-relaxed text-sm">
            Whether you are restocking food, buying treats, replacing accessories, or browsing
            care products, PetNest is designed to help you find the right item faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {productGroups.map((group, i) => (
            <motion.article
              key={group.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={i}
              viewport={{ once: true }}
              className="bg-brand-card-background border border-brand-border rounded-brand-lg overflow-hidden shadow-brand-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="overflow-hidden h-44">
                <img
                  src={group.image}
                  alt={`${group.title} pet supplies`}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-brand-text-primary text-sm tracking-tight">{group.title}</h3>
                <p className="mt-2 text-xs text-brand-text-secondary leading-relaxed">
                  {group.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Mission Section ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-brand-card-background border border-brand-border rounded-brand-lg p-8 sm:p-10 lg:p-12 shadow-brand-soft"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Our Mission</span>
              <h2 className="mt-3 text-3xl font-black text-brand-text-primary tracking-tight leading-snug">
                Better shopping for healthier, happier pets.
              </h2>
            </div>
            <div className="space-y-5 text-brand-text-secondary leading-relaxed text-sm md:text-base">
              <p>
                We want PetNest to feel like a dependable local pet shop online: easy to browse,
                helpful when you need guidance, and focused on products that support pets through
                every stage of life.
              </p>
              <p>
                As we grow, our goal is to expand our catalogue, improve delivery convenience, and
                keep building a service pet families in Sri Lanka can return to with confidence.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;
