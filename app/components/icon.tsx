import { cn } from "~/utils/cn";

type IconProps = React.SVGProps<SVGSVGElement> & {
  direction?: "up" | "right" | "down" | "left";
};

export function IconHighlightPaw(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 48 48">
      <title>Paw</title>
      <circle cx="12" cy="16" r="5.25" />
      <circle cx="20" cy="7" r="5.25" />
      <circle cx="32" cy="7" r="5.25" />
      <circle cx="40" cy="16" r="5.25" />
      <path d="M37.09 29.91a8.21 8.21 0 0 1-3.16-4.84 8.25 8.25 0 0 0-15.86 0 8.21 8.21 0 0 1-3.16 4.84A7.5 7.5 0 0 0 22.41 42a9.58 9.58 0 0 1 7.18 0 7.5 7.5 0 0 0 7.5-12.09Z" />
    </Icon>
  );
}

export function IconHighlightLeaf(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 48 48">
      <title>Leaf</title>
      <path d="M42.9 5.51a2.25 2.25 0 0 0-2.12-2.12C26.5 2.55 15.07 6.85 10.2 14.91 6.82 20.42 7.1 27.1 10.39 33.07l-5.49 5.5a2.25 2.25 0 1 0 3.18 3.18l5.48-5.49c5.94 3.21 12.33 3.63 17.93.19C39.55 31.58 43.74 19.78 42.9 5.51ZM29.94 32.6c-4.27 2.58-9.32 2.62-14.39.14l16.62-16.62a2.25 2.25 0 0 0-3.18-3.18L12.37 29.56c-2.47-5.06-2.44-10.12.15-14.38 4.14-6.84 13.98-10.58 26.49-10.14.45 12.5-3.3 22.35-10.14 26.49l1.07 1.07Z" />
    </Icon>
  );
}

export function IconHighlightSparkle(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 48 48">
      <title>Sparkles</title>
      <path d="m36.04 20.64-9.68-3.56-3.56-9.69a2.99 2.99 0 0 0-5.6 0l-3.56 9.68-9.69 3.56a2.99 2.99 0 0 0 0 5.61l9.67 3.58 3.56 9.68a2.99 2.99 0 0 0 5.61 0l3.56-9.68 9.68-3.56a2.99 2.99 0 0 0 .01-5.62ZM24.99 26.99a3.26 3.26 0 0 0-1.77 1.77L20 37.55l-3.22-8.79A3.25 3.25 0 0 0 15 26.99L6.23 23.75 15 20.51a3.25 3.25 0 0 0 1.78-1.77L20 9.96l3.23 8.78A3.26 3.26 0 0 0 25 20.52l8.78 3.24-8.79 3.23ZM26 4.5A1.5 1.5 0 0 1 27.5 3H30V.5a1.5 1.5 0 0 1 3 0V3h2.5a1.5 1.5 0 0 1 0 3H33v2.5a1.5 1.5 0 0 1-3 0V6h-2.5A1.5 1.5 0 0 1 26 4.5ZM47 13.5a1.5 1.5 0 0 1-1.5 1.5H44v1.5a1.5 1.5 0 0 1-3 0V15h-1.5a1.5 1.5 0 0 1 0-3H41v-1.5a1.5 1.5 0 0 1 3 0V12h1.5a1.5 1.5 0 0 1 1.5 1.5Z" />
    </Icon>
  );
}

function Icon({
  children,
  className,
  fill = "currentColor",
  stroke,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
      fill={fill}
      stroke={stroke}
      className={cn("h-5 w-5", className)}
    >
      {children}
    </svg>
  );
}

export function IconAccount(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Account</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4998 1.698C8.98579 1.698 6.94775 3.73604 6.94775 6.25008C6.94775 8.76413 8.98579 10.8022 11.4998 10.8022C14.0139 10.8022 16.0519 8.76413 16.0519 6.25008C16.0519 3.73604 14.0139 1.698 11.4998 1.698ZM8.38525 6.25008C8.38525 4.52994 9.7797 3.1355 11.4998 3.1355C13.22 3.1355 14.6144 4.52994 14.6144 6.25008C14.6144 7.97022 13.22 9.36467 11.4998 9.36467C9.7797 9.36467 8.38525 7.97022 8.38525 6.25008Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4998 12.2397C9.54548 12.2397 7.74079 12.6908 6.39973 13.4571C5.079 14.2118 4.07275 15.364 4.07275 16.7917C4.07275 18.2195 5.079 19.3717 6.39973 20.1264C7.74079 20.8927 9.54548 21.3438 11.4998 21.3438C13.4542 21.3438 15.2589 20.8927 16.5999 20.1264C17.9207 19.3717 18.9269 18.2195 18.9269 16.7917C18.9269 15.364 17.9207 14.2118 16.5999 13.4571C15.2589 12.6908 13.4542 12.2397 11.4998 12.2397ZM5.51025 16.7917C5.51025 16.1024 6.00572 15.3379 7.11293 14.7052C8.19981 14.0841 9.74929 13.6772 11.4998 13.6772C13.2504 13.6772 14.7999 14.0841 15.8867 14.7052C16.994 15.3379 17.4894 16.1024 17.4894 16.7917C17.4894 17.4811 16.994 18.2456 15.8867 18.8783C14.7999 19.4993 13.2504 19.9063 11.4998 19.9063C9.74929 19.9063 8.19981 19.4993 7.11293 18.8783C6.00572 18.2456 5.51025 17.4811 5.51025 16.7917Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.stroke || "currentColor"}
    >
      <title>Search</title>
      <path d="M10.8751 18.75C15.2244 18.75 18.7501 15.2242 18.7501 10.875C18.7501 6.52576 15.2244 3 10.8751 3C6.52588 3 3.00012 6.52576 3.00012 10.875C3.00012 15.2242 6.52588 18.75 10.8751 18.75Z" />
      <path d="M16.4438 16.4438L21.0001 21.0001" />
    </Icon>
  );
}

export function IconLogin(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.stroke || "currentColor"}
    >
      <title>Login</title>
      <path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.90625 20.2501C3.82775 18.6537 5.15328 17.328 6.74958 16.4062C8.34588 15.4845 10.1567 14.9993 12 14.9993C13.8433 14.9993 15.6541 15.4845 17.2504 16.4062C18.8467 17.328 20.1722 18.6537 21.0938 20.2501"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Icon {...props} fill="none">
      <title>Bag</title>
      <path
        d="M20.25 4.5H3.75C3.33579 4.5 3 4.83579 3 5.25V18.75C3 19.1642 3.33579 19.5 3.75 19.5H20.25C20.6642 19.5 21 19.1642 21 18.75V5.25C21 4.83579 20.6642 4.5 20.25 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 8.25C15.75 9.24456 15.3549 10.1984 14.6517 10.9017C13.9484 11.6049 12.9946 12 12 12C11.0054 12 10.0516 11.6049 9.34835 10.9017C8.64509 10.1984 8.25 9.24456 8.25 8.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </Icon>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
    >
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </Icon>
  );
}

export function IconImageBlank(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || "currentColor"}>
      <path
        d="M325 212.7H203.5C201.9 212.7 200.7 214 200.7 215.5V308C200.7 309.6 202 310.8 203.5 310.8H325.1C326.7 310.8 327.9 309.5 327.9 308V215.5C327.9 213.9 326.6 212.7 325 212.7ZM326.1 308C326.1 308.6 325.6 309.1 325 309.1H203.5C202.9 309.1 202.4 308.6 202.4 308V215.5C202.4 214.9 202.9 214.4 203.5 214.4H325.1C325.7 214.4 326.2 214.9 326.2 215.5V308H326.1Z"
        fill="black"
      />
      <path
        d="M210.9 299.5H240.5V299.6C240.5 299.6 240.6 299.6 240.7 299.5H315.9V223.3H210.9V299.5ZM212.7 292.3L232.7 272.3C234.3 270.7 236.5 269.8 238.8 269.8C241.1 269.8 243.3 270.7 244.9 272.3L246.4 273.8L263.2 290.6C250.3 293.9 242.5 296.9 240.4 297.8H212.7V292.3ZM314.2 282.2C294.1 283.9 277.5 287 265.1 290.1L248.2 273.2L274.5 246.9C276.1 245.3 278.3 244.4 280.6 244.4C282.9 244.4 285.1 245.3 286.7 246.9L314.2 274.4V282.2ZM245.3 297.7C255 294.2 279.2 286.8 314.2 283.9V297.7H245.3ZM314.2 225V271.8L288 245.6C286.1 243.7 283.5 242.6 280.7 242.6C277.9 242.6 275.3 243.7 273.4 245.6L247.1 271.9L246.2 271C244.3 269.1 241.7 268 238.9 268C236.1 268 233.5 269.1 231.6 271L212.8 289.8V225H314.2Z"
        fill="black"
      />
      <path
        d="M233.3 254C237.9 254 241.6 250.3 241.6 245.7C241.6 241.1 237.9 237.4 233.3 237.4C228.7 237.4 225 241.1 225 245.7C225 250.3 228.7 254 233.3 254ZM233.3 239.1C236.9 239.1 239.9 242 239.9 245.7C239.9 249.4 237 252.3 233.3 252.3C229.6 252.3 226.7 249.4 226.7 245.7C226.7 242 229.7 239.1 233.3 239.1Z"
        fill="black"
      />
    </Icon>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M19.1281 7.62875L19.1279 7.62831C19.0535 7.3942 18.9101 7.18805 18.7165 7.03687C18.5229 6.88569 18.2881 6.79655 18.043 6.78113L18.0426 6.7811L13.4019 6.46079L13.3627 6.45808L13.3481 6.42147L11.6294 2.08553L11.6293 2.08537C11.5401 1.85826 11.3847 1.66319 11.1833 1.5254C10.982 1.38765 10.7439 1.31349 10.5 1.3125C10.2561 1.31349 10.018 1.38765 9.81672 1.5254C9.61533 1.66319 9.45994 1.85826 9.37067 2.08537L9.3705 2.08578L7.6205 6.44516L7.60582 6.48171L7.56651 6.48425L2.9573 6.78111C2.95726 6.78111 2.95722 6.78112 2.95717 6.78112C2.71228 6.79757 2.47796 6.88711 2.2845 7.03816C2.09101 7.18924 1.94731 7.39491 1.87198 7.62855L1.87192 7.62875C1.79449 7.86619 1.78997 8.12139 1.85893 8.36142C1.92789 8.60146 2.06718 8.81534 2.25882 8.97548L2.25911 8.97572L5.80598 11.9757L5.83583 12.001L5.8262 12.0388L4.77151 16.1873L4.77143 16.1876C4.70161 16.4561 4.71417 16.7394 4.80748 17.0007C4.90076 17.2619 5.07042 17.4889 5.29441 17.6525C5.51164 17.8083 5.77043 17.8958 6.03768 17.9038C6.30495 17.9118 6.56853 17.8399 6.79468 17.6972L19.1281 7.62875ZM19.1281 7.62875C19.2055 7.86619 19.21 8.12139 19.1411 8.36142C19.0721 8.60142 18.9329 8.81526 18.7413 8.97539L19.1281 7.62875ZM10.4587 15.3769L6.79477 17.6971L18.7412 8.97548L15.21 11.9129L15.18 11.9379L15.1893 11.9759L16.3065 16.5149L16.3065 16.5149L16.3068 16.5163C16.3557 16.6973 16.3624 16.8872 16.3265 17.0712C16.2905 17.2552 16.2128 17.4286 16.0994 17.5779C15.986 17.7272 15.8398 17.8486 15.6722 17.9326C15.5046 18.0165 15.3201 18.061 15.1328 18.0625C14.9035 18.0614 14.6794 17.9944 14.4872 17.8695L14.4865 17.869L10.5412 15.3768L10.5259 15.3672H10.5078H10.4922H10.4741L10.4587 15.3769Z"
        strokeWidth="0.125"
      />
    </Icon>
  );
}

export function IconRemove(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 256 256">
      <rect width="256" height="256" fill="none" />
      <line
        x1="216"
        y1="56"
        x2="40"
        y2="56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="104"
        y1="104"
        x2="104"
        y2="168"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="152"
        y1="104"
        x2="152"
        y2="168"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </Icon>
  );
}

export function IconArrowSlideRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M11.0625 6.00068L11.0625 6.00049C11.0619 5.8154 11.1161 5.63429 11.2183 5.47997C11.3204 5.32587 11.4657 5.20537 11.636 5.13362C11.8095 5.0661 11.9985 5.04902 12.1814 5.08433C12.3641 5.11964 12.5332 5.20587 12.669 5.33309L22.6681 15.3322C22.6681 15.3322 22.6682 15.3322 22.6682 15.3323C22.8443 15.5101 22.9431 15.7504 22.9431 16.0007C22.9431 16.251 22.8443 16.4912 22.6682 16.6691C22.6682 16.6691 22.6681 16.6692 22.6681 16.6692L12.6693 26.668C12.6691 26.6682 12.669 26.6683 12.6688 26.6685C12.4885 26.8405 12.2492 26.9371 12 26.9382C11.8754 26.9376 11.752 26.9137 11.6361 26.8678C11.4658 26.7961 11.3204 26.6755 11.2183 26.5214C11.1161 26.3671 11.0619 26.186 11.0625 26.0009V26.0007L11.0625 6.00068Z"
        strokeWidth="0.125"
      />
    </Icon>
  );
}

export function IconArrowSlideLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M20.3875 26.9257C20.5695 26.8492 20.7248 26.7205 20.8338 26.5559C20.9428 26.3913 21.0006 26.1981 21 26.0007V6.00068C21.0006 5.80326 20.9428 5.61007 20.8338 5.44546C20.7248 5.28085 20.5695 5.15219 20.3875 5.07568M20.3875 26.9257L20.3644 26.8676C20.3642 26.8677 20.3641 26.8677 20.3639 26.8678M20.3875 26.9257L20.3633 26.8681C20.3635 26.868 20.3637 26.8679 20.3639 26.8678M20.3875 26.9257C20.2642 26.9747 20.1327 27.0001 20 27.0007C19.7345 26.9996 19.4795 26.8967 19.2875 26.7132L19.331 5.33309M20.3639 26.8678C20.5342 26.7961 20.6796 26.6756 20.7817 26.5214C20.8839 26.3671 20.9381 26.186 20.9375 26.0009V26.0007V6.00068V6.00049C20.9381 5.8154 20.8839 5.63429 20.7817 5.47996C20.6796 5.32587 20.5343 5.20538 20.364 5.13362M20.3639 26.8678C20.248 26.9137 20.1246 26.9376 20 26.9382C19.7508 26.9371 19.5114 26.8405 19.3312 26.6685C19.331 26.6683 19.3309 26.6682 19.3307 26.668L9.33191 16.6692C9.33187 16.6692 9.33184 16.6691 9.33181 16.6691C9.15568 16.4912 9.05688 16.251 9.05688 16.0007C9.05688 15.7504 9.15568 15.5101 9.33181 15.3323C9.33184 15.3322 9.33187 15.3322 9.33191 15.3322L19.331 5.33309M20.364 5.13362C20.3643 5.13372 20.3645 5.13381 20.3648 5.13391L20.3875 5.07568M20.364 5.13362C20.1905 5.0661 20.0015 5.04902 19.8186 5.08433C19.6359 5.11964 19.4668 5.20587 19.331 5.33309M20.364 5.13362C20.3638 5.13351 20.3635 5.13341 20.3633 5.1333L20.3875 5.07568M20.3875 5.07568C20.2028 5.00364 20.0015 4.98536 19.8068 5.02297C19.6121 5.06057 19.4321 5.15252 19.2875 5.28818L19.331 5.33309"
        strokeWidth="0.125"
      />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || "currentColor"}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        strokeWidth={props.strokeWidth || "1.25"}
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        strokeWidth={props.strokeWidth || "1.25"}
      />
    </Icon>
  );
}

export function IconFilledStar(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      stroke={props.stroke || "currentColor"}
      strokeWidth="2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
        strokeWidth="0"
        fill="currentColor"
      />
    </Icon>
  );
}
export function IconStarReview(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      stroke={props.stroke || "currentColor"}
      strokeWidth="2"
      fill="none"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </Icon>
  );
}
export function IconHalfFilledStar(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      stroke={props.stroke || "currentColor"}
      strokeWidth="2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 1a.993 .993 0 0 1 .823 .443l.067 .116l2.852 5.781l6.38 .925c.741 .108 1.08 .94 .703 1.526l-.07 .095l-.078 .086l-4.624 4.499l1.09 6.355a1.001 1.001 0 0 1 -1.249 1.135l-.101 -.035l-.101 -.046l-5.693 -3l-5.706 3c-.105 .055 -.212 .09 -.32 .106l-.106 .01a1.003 1.003 0 0 1 -1.038 -1.06l.013 -.11l1.09 -6.355l-4.623 -4.5a1.001 1.001 0 0 1 .328 -1.647l.113 -.036l.114 -.023l6.379 -.925l2.853 -5.78a.968 .968 0 0 1 .904 -.56zm0 3.274v12.476a1 1 0 0 1 .239 .029l.115 .036l.112 .05l4.363 2.299l-.836 -4.873a1 1 0 0 1 .136 -.696l.07 -.099l.082 -.09l3.546 -3.453l-4.891 -.708a1 1 0 0 1 -.62 -.344l-.073 -.097l-.06 -.106l-2.183 -4.424z"
        strokeWidth="0"
        fill="currentColor"
      />
    </Icon>
  );
}

export function IconFilters(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || "currentColor"}>
      <title>Filters</title>
      <circle cx="4.5" cy="6.5" r="2" />
      <line x1="6" y1="6.5" x2="14" y2="6.5" />
      <line x1="4.37114e-08" y1="6.5" x2="3" y2="6.5" />
      <line x1="4.37114e-08" y1="13.5" x2="8" y2="13.5" />
      <line x1="11" y1="13.5" x2="14" y2="13.5" />
      <circle cx="9.5" cy="13.5" r="2" />
    </Icon>
  );
}

export function IconCaret({
  direction = "down",
  stroke = "currentColor",
  ...props
}: IconProps) {
  let rotate: string;

  switch (direction) {
    case "down":
      rotate = "rotate-90";
      break;
    case "up":
      rotate = "-rotate-90";
      break;
    case "left":
      rotate = "rotate-180";
      break;
    case "right":
      rotate = "rotate-0";
      break;
    default:
      rotate = "rotate-0";
  }

  return (
    <Icon
      {...props}
      className={`h-4 w-4 transition ${rotate}`}
      viewBox="0 0 16 16"
      fill="transparent"
      stroke={stroke}
    >
      <title>Caret</title>
      <path d="M6 3L11 8L6 13" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconXMark({
  stroke = "currentColor",
  ...props
}: React.ComponentProps<typeof Icon>) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Delete</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </Icon>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || "currentColor"}>
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 8.24999H14.25C13.9542 8.24875 13.6611 8.3061 13.3875 8.41873C13.114 8.53137 12.8654 8.69705 12.6563 8.90623C12.4471 9.11541 12.2814 9.36394 12.1688 9.63749C12.0561 9.91103 11.9988 10.2042 12 10.5V21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.5H15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconQuickViewFacebook(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="16" fill="white" />
      <path
        d="M16 25C20.9706 25 25 20.9706 25 16C25 11.0294 20.9706 7 16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25Z"
        stroke="#3B3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.75 12.25H18.25C17.9542 12.2488 17.6611 12.3061 17.3875 12.4188C17.114 12.5314 16.8654 12.6971 16.6563 12.9063C16.4471 13.1154 16.2814 13.364 16.1688 13.6375C16.0561 13.9111 15.9988 14.2042 16 14.5V25"
        stroke="#3B3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 17.5H19"
        stroke="#3B3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconQuickViewInstagram(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="16" fill="white" />
      <path
        d="M16 19.75C18.071 19.75 19.75 18.0711 19.75 16C19.75 13.9289 18.071 12.25 16 12.25C13.929 12.25 12.25 13.9289 12.25 16C12.25 18.0711 13.929 19.75 16 19.75Z"
        stroke="#3B3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.125 7.375H11.875C9.39 7.375 7.375 9.3897 7.375 11.875V20.125C7.375 22.6103 9.39 24.625 11.875 24.625H20.125C22.61 24.625 24.625 22.6103 24.625 20.125V11.875C24.625 9.3897 22.61 7.375 20.125 7.375Z"
        stroke="#3B3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20.875" cy="11.125" r="0.75" fill="#3B3333" />
    </Icon>
  );
}

export function IconQuickViewX(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 32.5833 32.5833" fill="none">
      <rect width="32.5833" height="32.5833" rx="16.2917" fill="white" />
      <path
        d="M15.248 16.9675L9.451 23.5825M22.048 9.0008L16.893 15.0708M9 9L20.433 23.5833H23.583L12.15 9H9Z"
        stroke="#3B3333"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconPinterest(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || "currentColor"}>
      <path
        d="M11.25 8.25L8.25 21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.76562 14.6813C5.1148 13.7081 4.70085 12.596 4.55691 11.4342C4.41296 10.2723 4.54302 9.09285 4.93667 7.99026C5.33031 6.88767 5.97662 5.89255 6.82385 5.08455C7.67108 4.27655 8.6957 3.67812 9.8157 3.33715C10.9357 2.99618 12.12 2.92215 13.2737 3.12097C14.4275 3.3198 15.5186 3.78597 16.4599 4.48216C17.4012 5.17836 18.1664 6.08524 18.6943 7.13022C19.2222 8.1752 19.4981 9.32925 19.5 10.5C19.5 14.6438 16.5 17.25 13.5 17.25C10.5 17.25 9.59999 15.2719 9.59999 15.2719"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconEllipse(props: IconProps) {
  return (
    <Icon
      {...props}
      fill={props.fill || "transparent"}
      stroke={props.stroke || "currentColor"}
    >
      <path d="M79.6774 5.47561C99.8959 9.77319 117.576 16.5012 129.814 23.8896C135.935 27.585 140.67 31.431 143.685 35.1995C146.703 38.9717 147.95 42.6023 147.248 45.9078C146.545 49.2133 143.929 52.0229 139.638 54.2414C135.351 56.4578 129.461 58.0452 122.365 58.9314C108.18 60.7033 89.2924 59.6587 69.0739 55.3611C48.8554 51.0636 31.1758 44.3355 18.9376 36.9472C12.8163 33.2517 8.08095 29.4058 5.06595 25.6373C2.04802 21.8651 0.801053 18.2345 1.50366 14.929C2.20628 11.6234 4.82214 8.81389 9.11343 6.59534C13.4006 4.37894 19.2908 2.79154 26.3859 1.90531C40.5712 0.133482 59.4589 1.17803 79.6774 5.47561Z" />
    </Icon>
  );
}

export function IconSpinner(props: IconProps) {
  return (
    <Icon
      {...props}
      fill={props.fill || "transparent"}
      viewBox="0 0 256 256"
      className="animate-spin"
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="128"
        y1="32"
        x2="128"
        y2="64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="224"
        y1="128"
        x2="192"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="195.88"
        y1="195.88"
        x2="173.25"
        y2="173.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="128"
        y1="224"
        x2="128"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="60.12"
        y1="195.88"
        x2="82.75"
        y2="173.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="32"
        y1="128"
        x2="64"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="60.12"
        y1="60.12"
        x2="82.75"
        y2="82.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </Icon>
  );
}

export function IconNewsletter(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || "currentColor"}>
      <mask
        id="mask0_1610_14828"
        maskUnits="userSpaceOnUse"
        x="6"
        y="4"
        width="53"
        height="56"
      >
        <path
          d="M28.5002 22.6668C39.6802 19.8401 52.0535 10.9867 56.5002 6.66675C56.5002 26.6668 51.4322 37.9628 48.5002 41.3334C35.1668 56.6668 20.5868 49.5468 17.8335 44.0001C11.3602 30.9641 20.5935 24.6668 28.5002 22.6668Z"
          fill="white"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 57.3335C9.04933 54.6668 11.684 48.5335 17.8333 45.3335"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_1610_14828)">
        <path d="M0.5 0H64.5V64H0.5V0Z" fill="currentColor" />
      </g>
    </Icon>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || "currentColor"}>
      <path
        d="M12.5 16.25C14.5711 16.25 16.25 14.5711 16.25 12.5C16.25 10.4289 14.5711 8.75 12.5 8.75C10.4289 8.75 8.75 10.4289 8.75 12.5C8.75 14.5711 10.4289 16.25 12.5 16.25Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.625 3.875H8.375C5.88972 3.875 3.875 5.88972 3.875 8.375V16.625C3.875 19.1103 5.88972 21.125 8.375 21.125H16.625C19.1103 21.125 21.125 19.1103 21.125 16.625V8.375C21.125 5.88972 19.1103 3.875 16.625 3.875Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.375 8.5625C17.8928 8.5625 18.3125 8.14277 18.3125 7.625C18.3125 7.10723 17.8928 6.6875 17.375 6.6875C16.8572 6.6875 16.4375 7.10723 16.4375 7.625C16.4375 8.14277 16.8572 8.5625 17.375 8.5625Z"
        fill="white"
      />
    </Icon>
  );
}

export function IconFooterInstagram(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 14 14" fill="none">
      <path
        d="M10.2084 3.7912H10.2142M4.0829 1.166H9.9167C11.5277 1.166 12.8336 2.472 12.8336 4.0829V9.9167C12.8336 11.5277 11.5277 12.8336 9.9167 12.8336H4.0829C2.472 12.8336 1.166 11.5277 1.166 9.9167V4.0829C1.166 2.472 2.472 1.166 4.0829 1.166ZM9.3332 6.6325C9.4052 7.118 9.3222 7.6138 9.0962 8.0495C8.8701 8.4852 8.5124 8.8385 8.074 9.0591C7.6356 9.2798 7.1388 9.3566 6.6542 9.2786C6.1696 9.2007 5.7219 8.9719 5.3748 8.6248C5.0278 8.2777 4.799 7.8301 4.721 7.3455C4.643 6.8609 4.7198 6.364 4.9405 5.9256C5.1612 5.4872 5.5145 5.1295 5.9501 4.9035C6.3858 4.6774 6.8817 4.5945 7.3672 4.6665C7.8624 4.7399 8.3209 4.9707 8.6749 5.3247C9.029 5.6787 9.2597 6.1372 9.3332 6.6325Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconFooterFacebook(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 14 14" fill="none">
      <path
        d="M8.75 1.166H10.5V3.4995H8.75C8.596 3.4995 8.447 3.561 8.338 3.6704C8.228 3.7798 8.167 3.9282 8.167 4.0829V5.8331H10.5L9.917 8.1666H8.167V12.8336H5.834V8.1666H4.084V5.8331H5.834V4.0829C5.834 3.3093 6.141 2.5674 6.688 2.0204C7.235 1.4733 7.977 1.166 8.75 1.166Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconFooterPinterest(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 14 14" fill="none">
      <path
        d="M8.75 5.2497L5.25 8.75M5.25 5.2497L8.75 8.75M12.834 6.9998C12.834 10.2217 10.222 12.8336 7 12.8336C3.778 12.8336 1.166 10.2217 1.166 6.9998C1.166 3.7779 3.778 1.166 7 1.166C10.222 1.166 12.834 3.7779 12.834 6.9998Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconFooterTikTok(props: IconProps) {
  return <IconFooterPinterest {...props} />;
}

export function IconFooterYouTube(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 14 14" fill="none">
      <path
        d="M1.458 4.0832C1.05 6.006 1.05 7.9929 1.458 9.9158C1.512 10.1111 1.615 10.289 1.758 10.4322C1.901 10.5754 2.079 10.6788 2.275 10.7324C5.403 11.2507 8.596 11.2507 11.724 10.7324C11.92 10.6788 12.098 10.5754 12.241 10.4322C12.384 10.289 12.487 10.1111 12.541 9.9158C12.948 7.9929 12.948 6.006 12.541 4.0832C12.487 3.8879 12.384 3.7099 12.241 3.5668C12.098 3.4236 11.92 3.3202 11.724 3.2666C8.596 2.7484 5.403 2.7484 2.275 3.2666C2.079 3.3202 1.901 3.4236 1.758 3.5668C1.615 3.7099 1.512 3.8879 1.458 4.0832Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconTrustLeaf(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 18 18" fill="none">
      <path
        d="M1.5 15.75C1.5 13.5 2.888 11.729 5.31 11.249C7.125 10.889 9 9.749 9.75 8.999M8.25 15C6.933 15.004 5.663 14.512 4.691 13.624C3.719 12.735 3.117 11.513 3.003 10.201C2.89 8.889 3.274 7.582 4.079 6.54C4.884 5.498 6.052 4.796 7.35 4.574C11.625 3.749 12.75 3.359 14.251 1.499C15.001 2.999 15.751 4.634 15.751 7.499C15.751 11.624 12.165 15 8.25 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconTrustHeart(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 18 18" fill="none">
      <path
        d="M2.226 4.788C1.753 5.476 1.5 6.291 1.5 7.125C1.5 8.85 2.625 10.125 3.75 11.25L7.881 15.25C8.023 15.408 8.197 15.535 8.392 15.621C8.586 15.708 8.797 15.752 9.01 15.75C9.223 15.749 9.433 15.702 9.626 15.613C9.82 15.525 9.992 15.396 10.132 15.235L14.251 11.25C15.376 10.125 16.501 8.843 16.501 7.125C16.505 6.289 16.254 5.471 15.782 4.781C15.31 4.09 14.638 3.56 13.857 3.261C13.076 2.962 12.222 2.907 11.409 3.105C10.597 3.303 9.863 3.744 9.307 4.368C9.268 4.41 9.221 4.444 9.168 4.467C9.115 4.49 9.058 4.502 9.001 4.502C8.943 4.502 8.886 4.49 8.833 4.467C8.781 4.444 8.733 4.41 8.694 4.368C8.136 3.748 7.403 3.311 6.591 3.115C5.78 2.92 4.928 2.975 4.149 3.274C3.37 3.572 2.699 4.1 2.226 4.788Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconTrustShield(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 18 18" fill="none">
      <path
        d="M6.75 8.999L8.249 10.499L11.249 7.499M14.999 9.75C14.999 13.5 12.374 15.375 9.254 16.462C9.091 16.518 8.914 16.515 8.752 16.455C5.625 15.375 3 13.5 3 9.75V4.499C3 4.301 3.079 4.11 3.22 3.969C3.36 3.828 3.551 3.749 3.75 3.749C5.25 3.749 7.125 2.849 8.429 1.709C8.588 1.574 8.79 1.499 8.999 1.499C9.208 1.499 9.41 1.574 9.569 1.709C10.882 2.857 12.749 3.749 14.249 3.749C14.448 3.749 14.639 3.828 14.779 3.969C14.92 4.11 14.999 4.301 14.999 4.499V9.75Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconArrowScrollRight(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || "currentColor"}>
      <path
        d="M16.9863 11.5136L16.9864 11.5136C17.0503 11.5774 17.101 11.6533 17.1356 11.7367C17.1702 11.8202 17.188 11.9097 17.188 12C17.188 12.0904 17.1702 12.1798 17.1356 12.2633C17.101 12.3467 17.0503 12.4226 16.9864 12.4864L16.9863 12.4864L9.48633 19.9864C9.35732 20.1154 9.18235 20.1879 8.9999 20.1879C8.81745 20.1879 8.64248 20.1154 8.51347 19.9864C8.38446 19.8574 8.31198 19.6824 8.31198 19.5C8.31198 19.3176 8.38446 19.1426 8.51347 19.0136L15.4838 12.0442L15.528 12L15.4838 11.9558L8.51347 4.98643C8.44959 4.92255 8.39892 4.84672 8.36435 4.76326C8.32977 4.67979 8.31198 4.59034 8.31198 4.5C8.31198 4.40966 8.32977 4.32021 8.36435 4.23675C8.39892 4.15328 8.44959 4.07745 8.51347 4.01357C8.57735 3.94969 8.65318 3.89902 8.73664 3.86445C8.82011 3.82988 8.90956 3.81208 8.9999 3.81208C9.09024 3.81208 9.17969 3.82988 9.26315 3.86445C9.34661 3.89902 9.42245 3.94969 9.48633 4.01357L16.9863 11.5136Z"
        fill="#1E1C1A"
        stroke="#696662"
        stroke-width="0.125"
      />
    </Icon>
  );
}

export function IconArrowScrollLeft(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || "currentColor"}>
      <path
        d="M7.01367 12.4864L7.01365 12.4864C6.94972 12.4226 6.89902 12.3467 6.86442 12.2633C6.82982 12.1798 6.81201 12.0903 6.81201 12C6.81201 11.9096 6.82982 11.8202 6.86442 11.7367C6.89902 11.6533 6.94972 11.5774 7.01365 11.5136L7.01367 11.5136L14.5137 4.01357C14.6427 3.88456 14.8177 3.81208 15.0001 3.81208C15.1825 3.81208 15.3575 3.88456 15.4865 4.01357C15.6155 4.14258 15.688 4.31755 15.688 4.5C15.688 4.68244 15.6155 4.85742 15.4865 4.98643L8.51622 11.9558L8.47202 12L8.51622 12.0442L15.4865 19.0136C15.5504 19.0774 15.6011 19.1533 15.6357 19.2367C15.6702 19.3202 15.688 19.4097 15.688 19.5C15.688 19.5903 15.6702 19.6798 15.6357 19.7633C15.6011 19.8467 15.5504 19.9226 15.4865 19.9864C15.4227 20.0503 15.3468 20.101 15.2634 20.1355C15.1799 20.1701 15.0904 20.1879 15.0001 20.1879C14.9098 20.1879 14.8203 20.1701 14.7368 20.1355C14.6534 20.101 14.5775 20.0503 14.5137 19.9864L7.01367 12.4864Z"
        fill="#1E1C1A"
        stroke="#696662"
        stroke-width="0.125"
      />
    </Icon>
  );
}

export function IconCircle(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
      width="32"
      height="32"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
      width="32"
      height="32"
    >
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
    </Icon>
  );
}

export function IconHandBag(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
      width="32"
      height="32"
    >
      <path d="M239.89,198.12l-14.26-120a16,16,0,0,0-16-14.12H176a48,48,0,0,0-96,0H46.33a16,16,0,0,0-16,14.12l-14.26,120A16,16,0,0,0,20,210.6a16.13,16.13,0,0,0,12,5.4H223.92A16.13,16.13,0,0,0,236,210.6,16,16,0,0,0,239.89,198.12ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32ZM32,200,46.33,80H80v24a8,8,0,0,0,16,0V80h64v24a8,8,0,0,0,16,0V80h33.75l14.17,120Z"></path>
    </Icon>
  );
}

export function IconTag(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 256 256"
      width="32"
      height="32"
    >
      <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
    </Icon>
  );
}

export function IconListMenu(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12ZM3.75 6.75H20.25C20.4489 6.75 20.6397 6.67098 20.7803 6.53033C20.921 6.38968 21 6.19891 21 6C21 5.80109 20.921 5.61032 20.7803 5.46967C20.6397 5.32902 20.4489 5.25 20.25 5.25H3.75C3.55109 5.25 3.36032 5.32902 3.21967 5.46967C3.07902 5.61032 3 5.80109 3 6C3 6.19891 3.07902 6.38968 3.21967 6.53033C3.36032 6.67098 3.55109 6.75 3.75 6.75ZM20.25 17.25H3.75C3.55109 17.25 3.36032 17.329 3.21967 17.4697C3.07902 17.6103 3 17.8011 3 18C3 18.1989 3.07902 18.3897 3.21967 18.5303C3.36032 18.671 3.55109 18.75 3.75 18.75H20.25C20.4489 18.75 20.6397 18.671 20.7803 18.5303C20.921 18.3897 21 18.1989 21 18C21 17.8011 20.921 17.6103 20.7803 17.4697C20.6397 17.329 20.4489 17.25 20.25 17.25Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function IconPlusLinkFooter({
  open,
  ...props
}: IconProps & { open?: boolean }) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke={props.stroke || "currentColor"}
      viewBox="0 0 20 21"
    >
      {!open && (
        <path
          d="M3.125 10.3301H16.875"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <path
        d="M10 3.45508V17.2051"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || "currentColor"}>
      <title>Check</title>
      <circle cx="10" cy="10" r="7.25" strokeWidth="1.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.04 10.37 2.42 2.41 3.5-5.56"
      />
    </Icon>
  );
}

export function IconAnnouncementChevron({
  direction = "right",
  ...props
}: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 8 12" fill="none">
      <title>{direction === "left" ? "Previous" : "Next"}</title>
      <path
        d={direction === "left" ? "M6 10 2 6l4-4" : "M2 10l4-4-4-4"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}
export function IconAnnouncementSparkle(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 20 20" fill="none">
      <title>Sparkle</title>
      <path
        d="M10.086 12.4 8.586 16.47a.5.5 0 0 1-.922 0L6.164 12.4a.5.5 0 0 0-.275-.275L1.82 10.625a.5.5 0 0 1 0-.922l4.07-1.5a.5.5 0 0 0 .274-.275L7.664 3.86a.5.5 0 0 1 .922 0l1.5 4.07a.5.5 0 0 0 .275.274l4.07 1.5a.5.5 0 0 1 0 .922l-4.07 1.5a.5.5 0 0 0-.275.274Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 3.25v3.75M16.125 5.125h-3.75M18 7.625v2.5M19.25 8.875h-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconAnnouncementTicket(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 20 16" fill="none">
      <title>Ticket</title>
      <path
        d="M1.875 12.062a1.062 1.062 0 0 1 0-2.124V7.937a1.062 1.062 0 0 1 0-2.124V4a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v1.813a1.062 1.062 0 0 1 0 2.124v1.999a1.062 1.062 0 0 1 0 2.124V12a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-.938Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2.375v11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconAnnouncementStar(props: IconProps) {
  return (
    <Icon {...props} viewBox="0 0 10 10" fill="none">
      <title>Star</title>
      <path
        d="M4.883.033a.22.22 0 0 1 .314.09l.963 1.95a.88.88 0 0 0 .664.484l2.153.315a.22.22 0 0 1 .122.377L7.543 4.765a.88.88 0 0 0-.255.783l.368 2.14a.22.22 0 0 1-.322.235L5.41 6.91a.88.88 0 0 0-.822 0L2.664 7.923a.22.22 0 0 1-.32-.234l.367-2.141a.88.88 0 0 0-.255-.783L.899 3.25a.22.22 0 0 1 .123-.377l2.152-.314a.88.88 0 0 0 .665-.484l.963-1.95a.22.22 0 0 1 .181-.091Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconAnnouncementTree(props: IconProps) {
  return (
    <Icon {...props} viewBox="1060 34 20 20" fill="none">
      <title>Tree</title>
      <path
        d="M1070 52.125V40.875"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1070 45.875L1066.25 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1070 44L1073.75 42.125"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1070.35 48.1562C1070.93 48.5468 1071.57 48.8137 1072.26 48.9401C1072.94 49.0664 1073.64 49.0494 1074.31 48.8902C1074.99 48.7309 1075.62 48.4328 1076.18 48.015C1076.73 47.5971 1077.19 47.0685 1077.53 46.4629C1077.87 45.8573 1078.08 45.1878 1078.14 44.4971C1078.21 43.8065 1078.13 43.1097 1077.91 42.4511C1077.69 41.7925 1077.34 41.1866 1076.88 40.6718C1076.41 40.157 1075.84 39.7446 1075.21 39.4609C1075.07 39.391 1074.96 39.275 1074.9 39.1328C1074.49 38.1679 1073.81 37.3441 1072.94 36.7648C1072.07 36.1855 1071.05 35.8765 1070 35.8765C1068.95 35.8765 1067.93 36.1855 1067.06 36.7648C1066.19 37.3441 1065.51 38.1679 1065.1 39.1328C1065.04 39.275 1064.93 39.391 1064.79 39.4609C1064.16 39.7446 1063.59 40.157 1063.12 40.6718C1062.66 41.1866 1062.31 41.7925 1062.09 42.4511C1061.87 43.1097 1061.79 43.8065 1061.86 44.4971C1061.92 45.1878 1062.13 45.8573 1062.47 46.4629C1062.81 47.0685 1063.27 47.5971 1063.82 48.015C1064.38 48.4328 1065.01 48.7309 1065.69 48.8902C1066.36 49.0494 1067.06 49.0664 1067.74 48.9401C1068.43 48.8137 1069.08 48.5468 1069.65 48.1562C1069.75 48.0876 1069.88 48.0511 1070 48.0511C1070.13 48.0511 1070.25 48.0876 1070.35 48.1562Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
