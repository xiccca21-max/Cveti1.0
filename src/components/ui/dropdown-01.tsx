import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

type DropdownOption = {
  id: string;
  label: string;
  description?: string;
};

type Dropdown01Props = {
  options?: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const defaultOptions: DropdownOption[] = [
  { id: "premium", label: "Premium Plan", description: "Advanced features" },
  { id: "pro", label: "Professional Plan", description: "For power users" },
  { id: "enterprise", label: "Enterprise Plan", description: "Unlimited access" },
  { id: "starter", label: "Starter Plan", description: "Get started free" },
];

export default function Dropdown01({
  options = defaultOptions,
  value,
  onChange,
  placeholder = "Выберите вариант",
  className = "",
}: Dropdown01Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(options[0]?.id ?? "");
  const currentValue = value ?? internalValue;

  const selectedOption = useMemo(
    () => options.find((o) => o.id === currentValue) ?? null,
    [options, currentValue],
  );

  const selectedLabel = selectedOption?.label ?? placeholder;

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2.5 text-left text-[13px] font-medium text-[#333231] transition-colors hover:border-black/20"
      >
        <span>{selectedLabel}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_16px_36px_-18px_rgba(0,0,0,0.26)]"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.14, delay: index * 0.03 }}
                onClick={() => {
                  if (onChange) onChange(option.id);
                  else setInternalValue(option.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-black hover:text-white"
              >
                <span className="text-[13px] font-medium">{option.label}</span>
                {currentValue === option.id ? <Check className="h-4 w-4" /> : null}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
