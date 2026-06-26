import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  return (
    <div className="relative w-full md:w-80">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-950 transition-all placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
