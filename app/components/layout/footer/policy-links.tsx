import { NavLink } from "react-router";

const policyLinks = [
  { label: "Privacy Policy", to: "/policies/privacy-policy" },
  { label: "Terms of Service", to: "/policies/terms-of-service" },
  { label: "Cookie Policy", to: "/policies/privacy-policy" },
  { label: "Accessibility", to: "/pages/accessibility" },
];

export function PolicyLinks() {
  return (
    <nav
      aria-label="Legal"
      className="flex flex-wrap items-center gap-x-8 gap-y-2"
    >
      {policyLinks.map(({ label, to }) => (
        <NavLink
          key={label}
          to={to}
          prefetch="intent"
          className="text-sm opacity-70 transition-opacity hover:opacity-100"
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
