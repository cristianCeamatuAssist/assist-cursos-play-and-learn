import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  defaultValue = '',
  placeholder = 'Search...',
  onSearch,
  className = '',
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set new timer
    timerRef.current = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);
  };

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 w-full"
      />
    </div>
  );
} 