import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import dogsCategory from '../../assets/dogs_category.jpg';
import catsCategory from '../../assets/cats_category.jpg';
import birdsCategory from '../../assets/birds_category.jpg';

const categories = [
  {
    name: 'Dogs',
    image: dogsCategory,
    link: '/category/dogs',
    description: 'Food, treats, toys, and grooming kits for your beloved pup.',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500',
  },
  {
    name: 'Cats',
    image: catsCategory,
    link: '/category/cats',
    description: 'Premium cat food, litter, scratching posts, and accessories.',
    badge: 'Popular',
    badgeColor: 'bg-purple-500',
  },
  {
    name: 'Birds',
    image: birdsCategory,
    link: '/category/birds',
    description: 'Cages, quality seeds, vitamins, and interactive toys for birds.',
    badge: 'New Arrivals',
    badgeColor: 'bg-sky-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const CategoryBanners = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary px-4 py-1.5 rounded-full mb-4">
            Our Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text-primary tracking-tight leading-tight">
            Shop by Category
          </h2>
          <p className="mt-4 text-base text-brand-text-secondary leading-relaxed">
            Quality care starts with the right products. Browse our curated collections for your companions.
          </p>
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {categories.map((cat) => (
            <motion.article
              key={cat.name}
              variants={cardVariants}
              className="group relative rounded-brand-lg overflow-hidden shadow-brand-soft border border-brand-border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-350"
            >
              <Link
                to={cat.link}
                className="block relative aspect-4/3 w-full overflow-hidden"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={`${cat.name} Category`}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-600 ease-out"
                  loading="lazy"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-blue-950/92 via-blue-900/45 to-transparent" />

                {/* Top badge */}
                <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide shadow-sm ${cat.badgeColor}`}>
                  {cat.badge}
                </span>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold tracking-tight">{cat.name}</h3>
                    <span className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-250" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-blue-100/90 leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryBanners;
