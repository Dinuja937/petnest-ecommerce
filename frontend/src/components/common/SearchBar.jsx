import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  return (
    <div className="relative w-full md:w-80">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-brand-md text-sm text-brand-text-primary placeholder-brand-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 shadow-sm"
      />
    </div>
  );
};

export default SearchBar;
