import type React from "react";
import {
  AmexIcon,
  DinersClubIcon,
  MastercardIcon,
  PaypalIcon,
  VisaIcon,
} from "./payment-icons";

const PAYMENT_ICON_MAP = {
  visa: VisaIcon,
  mastercard: MastercardIcon,
  "american-express": AmexIcon,
  paypal: PaypalIcon,
  diners: DinersClubIcon,
} satisfies Record<string, React.ComponentType>;

type PaymentMethod = keyof typeof PAYMENT_ICON_MAP;

interface PaymentMethodsProps {
  paymentMethods?: string;
}

export function PaymentMethods({ paymentMethods }: PaymentMethodsProps) {
  const paymentIconKeys = Array.from(
    new Set(
      paymentMethods
        ?.split(",")
        .map((key) => key.trim().toLowerCase())
        .filter((key): key is PaymentMethod => key in PAYMENT_ICON_MAP) ?? [],
    ),
  );

  if (paymentIconKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex items-start gap-1.5 py-4 md:p-0">
      {paymentIconKeys.map((key) => {
        const Icon = PAYMENT_ICON_MAP[key];
        return Icon ? <Icon key={key} /> : null;
      })}
    </div>
  );
}
