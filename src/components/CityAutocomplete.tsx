import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface CityMatch {
  name: string;
  stateCode: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  label: string;
}

interface CityAutocompleteProps {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSelectCity: (city: { name: string; latitude: number; longitude: number; label: string }) => void;
  className?: string;
  inputClassName?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  id,
  value,
  placeholder = "Digite sua cidade de nascimento...",
  onChange,
  onSelectCity,
  className = "",
  inputClassName = ""
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CityMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with parent value updates
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch results when typing
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Don't search if query matches selected label perfectly (to avoid infinite search on click selection)
    const isSelected = results.some(r => r.label === query);
    if (isSelected) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Error searching cities:", e);
      } finally {
        setIsLoading(false);
      }
    }, 350); // Debounce lookup for performance

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: CityMatch) => {
    setQuery(city.label);
    onChange(city.label);
    onSelectCity({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      label: city.label
    });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-202 focus:outline-hidden focus:border-amber-500/50 ${inputClassName}`}
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500/80" />
          ) : (
            <Search className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 divide-y divide-slate-850/60 custom-scrollbar">
          {results.map((city, idx) => (
            <button
              key={`${city.label}-${idx}`}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 hover:bg-slate-850/60 text-xs text-slate-300 hover:text-white transition flex items-center gap-2.5 font-sans"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="truncate">
                <span className="font-bold">{city.name}</span>
                {city.stateCode && <span className="text-slate-400">, {city.stateCode}</span>}
                <span className="text-slate-500 text-[10px] ml-1.5 block sm:inline">({city.countryName})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
