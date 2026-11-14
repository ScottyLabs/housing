import { useState, useRef, useEffect, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export default function DropdownButton({
  options,
  placeholder = "Select an option",
  onChangeAction,
  value,
  subtitle,
  maxHeight = "max-h-38",
  searchable = false,
  compact = false,
}: {
  options: SelectOption[];
  placeholder?: string;
  onChangeAction: (value: string) => void;
  value: string;
  subtitle?: string;
  maxHeight?: string;
  searchable?: boolean;
  compact?: boolean;
}) {
  const triggerSize = compact ? "h-[44px] px-3 rounded-xl" : "h-[68px] px-4 rounded-2xl";
  const innerSize = compact ? "h-[32px] gap-[2px]" : "h-[37px] gap-[4px]";
  const labelSize = compact ? "text-[14px]" : "text-[18px]";
  const subtitleSize = compact ? "text-[11px]" : "text-[12px]";
  const arrowSize = compact ? "w-[10px] h-[6px]" : "w-[14px] h-[8px]";
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [filtering, setFiltering] = useState(false);
  const listId = useId();
  const selectedOption = options.find((opt) => opt.value === value);
  const query = value.trim().toLowerCase();
  const visibleOptions =
    searchable && filtering
      ? options.filter((opt) => opt.label.toLowerCase().includes(query))
      : options;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (option: SelectOption) => {
    onChangeAction(option.value);
    setIsOpen(false);
    setActiveIndex(-1);
    setFiltering(false);
  };

  const handleTriggerClick = () => {
    if (!searchable) {
      setIsOpen(!isOpen);
      return;
    }
    if (!isOpen) setFiltering(false);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const count = visibleOptions.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      if (count === 0) return;
      const down = event.key === "ArrowDown";
      setActiveIndex((i) => (down ? (i + 1) % count : i <= 0 ? count - 1 : i - 1));
    } else if (event.key === "Enter" && isOpen && visibleOptions[activeIndex]) {
      event.preventDefault();
      handleSelect(visibleOptions[activeIndex]);
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside or hitting escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target;
      if (dropdownRef.current && target instanceof Node && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={handleTriggerClick}
        className={`${triggerSize} bg-brand-buttongray border border-black/10 w-full flex items-center justify-between select-none cursor-pointer focus-within:border-brand-primary`}
      >
        <div className={`flex flex-col justify-center ${innerSize} ${searchable ? "flex-1" : ""}`}>
          {searchable ? (
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
              autoComplete="off"
              placeholder={placeholder}
              value={value}
              onChange={(event) => {
                onChangeAction(event.target.value);
                setActiveIndex(-1);
                setFiltering(true);
                setIsOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              className={`w-full bg-transparent outline-none select-text font-semibold ${labelSize} leading-none placeholder:text-black`}
            />
          ) : (
            <span className={`font-semibold ${labelSize} leading-none`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          {subtitle && (
            <span className={`${subtitleSize} text-gray-500 leading-none`}>{subtitle}</span>
          )}
        </div>
        <img src="/dropdown-closed.svg" alt="dropdown closed" className={arrowSize} />
      </div>
      {isOpen && visibleOptions.length > 0 && (
        <div
          id={listId}
          role="listbox"
          className={`absolute w-full mt-2 z-10 bg-brand-menugray border border-black/10 rounded-xl shadow-lg ${maxHeight} overflow-y-auto`}
        >
          {visibleOptions.map((option, index) => (
            <div
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              ref={
                index === activeIndex ? (el) => el?.scrollIntoView({ block: "nearest" }) : undefined
              }
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 hover:bg-brand-buttongray first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-black/5 select-none text-[14px] cursor-pointer ${index === activeIndex ? "bg-brand-buttongray" : ""}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
