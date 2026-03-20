"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  required?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon,
  className = "",
  required,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen(true);
        setHighlightedIndex(options.findIndex((o) => o.value === value));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setHighlightedIndex(options.findIndex((o) => o.value === value));
          }
        }}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center gap-2 px-4 py-3 bg-white border rounded-xl text-sm text-left transition-all duration-200 ${
          isOpen
            ? "border-[#c2410c] ring-2 ring-[#c2410c]/10 shadow-sm"
            : "border-[#e2ddd5] hover:border-[#d4cfc7]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && <span className="text-[#a8a29e] shrink-0">{icon}</span>}
        <span className={`flex-1 truncate ${selectedOption ? "text-[#1c1917]" : "text-[#a8a29e]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#a8a29e] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-[#e2ddd5] rounded-xl shadow-lg shadow-stone-900/8 max-h-64 overflow-auto py-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{
            animation: "selectDropIn 0.15s ease-out",
          }}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                highlightedIndex === index
                  ? "bg-[#faf8f5]"
                  : ""
              } ${
                option.value === value
                  ? "text-[#c2410c] font-medium"
                  : "text-[#44403c]"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-[#c2410c] shrink-0 ml-2" />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden native select for form validation */}
      {required && (
        <select
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          aria-hidden="true"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
