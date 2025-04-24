import clsx from "clsx";
import { useState } from "react";

interface MetaField {
  description: string | null;
  id: string;
  key: string;
  namespace: string;
  reference: {
    fields: Array<{
      key: string;
      value: string;
    }>;
  };
}

interface MetaFieldTableProps {
  data: MetaField;
}

export function MetaFieldTable({ data }: MetaFieldTableProps) {
  const validTabs = data.reference.fields.filter(
    (field) => field.value && field.value.trim() !== ""
  );

  const [activeTab, setActiveTab] = useState(validTabs[0]?.key ?? "");

  if (!data || !validTabs || validTabs.length === 0) {
    return null;
  }

  const getCurrentContent = () => {
    const field = validTabs.find((f) => f.key === activeTab);
    return field?.value || "";
  };

  return (
    <div className="w-full mt-6 border-2 border-border-subtle rounded overflow-hidden">
      {/* Tabs Header */}
      <div className={clsx("flex")}>
        {validTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex-1 py-4 px-6 text-sm font-medium uppercase text-center transition-colors",
              "border-r-2 last:border-r-0 border-border-subtle",
              activeTab === tab.key ? "border-b-0 bg-[#E0E5D6]" : "border-b-2"
            )}
          >
            {tab.key.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {getCurrentContent()}
        </p>
      </div>
    </div>
  );
}
