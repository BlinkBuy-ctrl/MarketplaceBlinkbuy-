import { CreditCard, Smartphone, Banknote, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PaymentMethodsProps {
  onSelect?: (method: string) => void;
  selectedMethod?: string;
}

const PAYMENT_METHODS = [
  {
    id: "mobile_money",
    name: "Mobile Money",
    icon: Smartphone,
    providers: ["Airtel Money", "TNM Mpamba", "Malswitch"],
    description: "Instant & secure",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: CreditCard,
    providers: ["FNB", "Standard Bank", "Stanbic"],
    description: "Direct bank deposit",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "cash_on_delivery",
    name: "Cash on Delivery",
    icon: Banknote,
    providers: ["Lilongwe", "Blantyre", "Mzuzu"],
    description: "Pay when you receive",
    color: "from-green-500 to-green-600",
  },
];

export default function PaymentMethods({ onSelect, selectedMethod }: PaymentMethodsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
          <span className="text-pink-600 font-black text-sm">💳</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">Payment Methods</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-pink-500/20 hover:border-pink-500/40 bg-card"
              }`}
              onClick={() => {
                onSelect?.(method.id);
                setExpanded(expanded === method.id ? null : method.id);
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" strokeWidth={2} />
                  </div>
                  {isSelected && (
                    <CheckCircle size={18} className="text-pink-500 fill-pink-500" />
                  )}
                </div>
                <h4 className="font-bold text-sm mb-0.5">{method.name}</h4>
                <p className="text-xs text-muted-foreground">{method.description}</p>

                {expanded === method.id && (
                  <div className="mt-3 pt-3 border-t border-pink-500/20">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Available Providers:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {method.providers.map((provider) => (
                        <span
                          key={provider}
                          className="text-[10px] px-2 py-1 rounded-full bg-pink-500/10 text-pink-600 border border-pink-500/20 font-medium"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 flex gap-3">
        <span className="text-lg">🔒</span>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          All payments are secured. Buyers and sellers are protected with our escrow system.
        </p>
      </div>
    </div>
  );
}
