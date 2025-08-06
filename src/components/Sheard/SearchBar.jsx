import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

const SearchBar = ({
  placeholder,
  searchTerm,
  onSearchChange,
  onClearSearch,
  onSubmit,
  className,
  inputClassName,
  iconClassName,
  buttonClassName,
}) => {
  const handleClearSearch = () => {
    if (onClearSearch) {
      onClearSearch();
    } else if (onSearchChange) {
      onSearchChange("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm || ""}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className={`pl-10 pr-10 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClassName}`}
        />
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClassName}`}
          size={18}
        />
        {searchTerm && searchTerm.length > 0 && (
          <button
            type="button"
            onClick={handleClearSearch}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${buttonClassName}`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  onClearSearch: PropTypes.func,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default SearchBar;
