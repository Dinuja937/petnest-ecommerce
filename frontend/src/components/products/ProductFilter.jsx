const ProductFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeCategory === cat
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
              : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;
