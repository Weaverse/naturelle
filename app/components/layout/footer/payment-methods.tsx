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
  showVisa?: boolean;
  showMastercard?: boolean;
  showAmericanExpress?: boolean;
  showPayPal?: boolean;
  showDiners?: boolean;
}

export function PaymentMethods({
  showVisa = true,
  showMastercard = true,
  showAmericanExpress = true,
  showPayPal = true,
  showDiners = false,
}: PaymentMethodsProps) {
  const paymentIconKeys: PaymentMethod[] = [
    ...(showVisa ? (["visa"] as const) : []),
    ...(showMastercard ? (["mastercard"] as const) : []),
    ...(showAmericanExpress ? (["american-express"] as const) : []),
    ...(showPayPal ? (["paypal"] as const) : []),
    ...(showDiners ? (["diners"] as const) : []),
  ];

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
