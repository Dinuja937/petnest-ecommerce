const ProductFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-5 py-2 rounded-brand-md text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              isActive
                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25 scale-[1.02]'
                : 'bg-white text-brand-text-secondary border-brand-border hover:border-brand-primary hover:text-brand-primary hover:bg-brand-secondary'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default ProductFilter;

