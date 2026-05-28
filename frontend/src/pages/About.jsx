import { Award, Headphones, HeartHandshake, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    title: 'For dogs',
    description: 'Food, treats, toys, collars, beds, bowls, and grooming essentials.',
  },
  {
    image: catsImage,
    title: 'For cats',
    description: 'Food, litter, treats, scratching products, toys, and accessories.',
  },
  {
    image: birdsImage,
    title: 'For birds',
    description: 'Food, cages, perches, feeders, and everyday care items.',
  },
];

const About = () => {
  return (
    <main className="w-full min-h-screen bg-linear-to-b from-blue-50/40 via-white to-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center mb-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100 rounded-full">
              <HeartHandshake className="w-3.5 h-3.5" />
              About PetNest
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950 tracking-tight leading-tight">
                Sri Lanka&apos;s friendly online pet store for everyday pet care.
              </h1>
              <p className="text-lg text-blue-900/70 leading-relaxed">
                PetNest brings pet food, supplies, and care essentials into one simple shopping
                experience for pet parents who want reliable products without the extra hassle.
              </p>
              <p className="text-base text-blue-900/65 leading-relaxed">
                Inspired by the best local pet stores, we are building PetNest around practical
                product choices, clear information, convenient delivery, and service that treats
                every pet like family.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
              >
                Shop pet products
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-xl border border-blue-100 transition-colors"
              >
                Contact support
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-blue-950 min-h-107.5">
            <img
              src={bannerImage}
              alt="Happy pets with PetNest supplies"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-950/70 to-blue-950/10" />

            <div className="relative z-10 p-7 sm:p-9 text-white max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-blue-100 mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight">Our promise</h2>
                <p className="text-blue-100/80 leading-relaxed">
                  To make pet shopping easier, more dependable, and more caring, from the first
                  product search to the moment your order reaches your door.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {['Trusted supplies', 'Clear choices', 'Pet-parent support'].map((item) => (
                  <div key={item} className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/15 p-4">
                    <p className="text-sm font-semibold text-blue-50 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="bg-white p-7 rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-5">
                <highlight.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-3">{highlight.title}</h3>
              <p className="text-blue-900/60 text-sm leading-relaxed">{highlight.description}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-10 mb-16">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What we offer
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 tracking-tight">
              Built for real pet-parent routines.
            </h2>
            <p className="mt-4 text-blue-900/65 leading-relaxed">
              Whether you are restocking food, buying treats, replacing accessories, or browsing
              care products, PetNest is designed to help you find the right item faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {productGroups.map((group) => (
                <article
                  key={group.title}
                  className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm"
                >
                  <img
                    src={group.image}
                    alt={`${group.title} pet supplies`}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-blue-950">{group.title}</h3>
                    <p className="mt-2 text-sm text-blue-900/65 leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <section className="bg-white border border-blue-100 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Our mission
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-blue-950 tracking-tight">
                Better shopping for healthier, happier pets.
              </h2>
            </div>

            <div className="space-y-5 text-blue-900/70 leading-relaxed">
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
        </section>
      </div>
    </main>
  );
};

export default About;
