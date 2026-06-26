import React from 'react';
import { Link } from 'react-router-dom';
import dogsCategory from '../../assets/dogs_category.jpg';
import catsCategory from '../../assets/cats_category.jpg';
import birdsCategory from '../../assets/birds_category.jpg';

const CategoryBanners = () => {
  const categories = [
    {
      name: 'Dogs',
      image: dogsCategory,
      link: '/category/dogs',
      description: 'Find food, treats, toys, and grooming kits for your pup.',
      badge: 'Bestseller'
    },
    {
      name: 'Cats',
      image: catsCategory,
      link: '/category/cats',
      description: 'Discover premium cat food, litter, scratching posts, and accessories.',
      badge: 'Popular'
    },
    {
      name: 'Birds',
      image: birdsCategory,
      link: '/category/birds',
      description: 'Explore cages, high-quality seeds, vitamins, and interactive toys.',
      badge: 'New'
    }
  ];

  return (
    <section className="w-full py-16 bg-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-blue-950 sm:text-4xl tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-3 text-lg text-blue-900/60 font-light">
            Quality care starts with choosing the right premium products for your companions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <article key={cat.name} className="relative group rounded-2xl overflow-hidden shadow-lg shadow-blue-950/5 border border-blue-100 hover:shadow-xl transition-all duration-300">
              <Link to={cat.link} className="block relative aspect-4/3 sm:aspect-16/10 md:aspect-4/3 w-full h-full overflow-hidden" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={`${cat.name} Category`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-blue-950/90 via-blue-900/40 to-transparent group-hover:from-blue-950/95 transition-all duration-300" />

                {/* Top Badge */}
                <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/20 tracking-wider">
                  {cat.badge}
                </span>

                {/* Card Content (Pinned Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
                    {cat.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanners;
