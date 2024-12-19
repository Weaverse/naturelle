import clsx from "clsx";
import { Input } from "~/components/input";

interface QuantityProps {
  value: number;
  isDisabled?: boolean;
  onChange: (value: number) => void;
}
export function Quantity(props: QuantityProps) {
  let {value, onChange, isDisabled} = props;
  let handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the user from entering non-numeric characters
    if (
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      isNaN(Number(e.key))
    ) {
      e.preventDefault();
    }
  };
  return (
    <div className="space-y-3">
      <legend className="whitespace-pre-wrap max-w-prose text-base font-body font-semibold leading-snug">
        Quantity
      </legend>
      <div className={clsx("w-fit flex gap-2", isDisabled && "opacity-50 cursor-not-allowed")}>
        <button
          name="decrease-quantity"
          aria-label="Decrease quantity"
          className="transition py-2.5 px-5 border-2 rounded border-border-subtle"
          disabled={ isDisabled || value <= 1}
          onClick={() => onChange(value - 1)}
        >
          <span>&#8722;</span>
        </button>
        <Input
          className="py-2.5 w-24 text-center border-2 rounded bg-background"
          value={value}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          disabled={isDisabled}
        />
        <button
          className="transition py-2.5 px-5 border-2 rounded border-border-subtle"
          name="increase-quantity"
          aria-label="Increase quantity"
          onClick={() => onChange(value + 1)}
          disabled={isDisabled}
        >
          <span>&#43;</span>
        </button>
      </div>
    </div>
  );
}
