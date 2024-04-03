import clsx from 'clsx';

type IconProps = JSX.IntrinsicElements['svg'] & {
  direction?: 'up' | 'right' | 'down' | 'left';
};

function Icon({
  children,
  className,
  fill = 'currentColor',
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
      className={clsx('w-5 h-5', className)}
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
        fill="#3D490B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4998 12.2397C9.54548 12.2397 7.74079 12.6908 6.39973 13.4571C5.079 14.2118 4.07275 15.364 4.07275 16.7917C4.07275 18.2195 5.079 19.3717 6.39973 20.1264C7.74079 20.8927 9.54548 21.3438 11.4998 21.3438C13.4542 21.3438 15.2589 20.8927 16.5999 20.1264C17.9207 19.3717 18.9269 18.2195 18.9269 16.7917C18.9269 15.364 17.9207 14.2118 16.5999 13.4571C15.2589 12.6908 13.4542 12.2397 11.4998 12.2397ZM5.51025 16.7917C5.51025 16.1024 6.00572 15.3379 7.11293 14.7052C8.19981 14.0841 9.74929 13.6772 11.4998 13.6772C13.2504 13.6772 14.7999 14.0841 15.8867 14.7052C16.994 15.3379 17.4894 16.1024 17.4894 16.7917C17.4894 17.4811 16.994 18.2456 15.8867 18.8783C14.7999 19.4993 13.2504 19.9063 11.4998 19.9063C9.74929 19.9063 8.19981 19.4993 7.11293 18.8783C6.00572 18.2456 5.51025 17.4811 5.51025 16.7917Z"
        fill="#3D490B"
      />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z"
      />
    </Icon>
  );
}

export function IconLogin(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Login</title>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M8,10.6928545 C10.362615,10.6928545 12.4860225,11.7170237 13.9504747,13.3456144 C12.4860225,14.9758308 10.362615,16 8,16 C5.63738499,16 3.51397752,14.9758308 2.04952533,13.3472401 C3.51397752,11.7170237 5.63738499,10.6928545 8,10.6928545 Z"
          fill="currentColor"
        ></path>
        <path
          d="M8,3.5 C6.433,3.5 5.25,4.894 5.25,6.5 C5.25,8.106 6.433,9.5 8,9.5 C9.567,9.5 10.75,8.106 10.75,6.5 C10.75,4.894 9.567,3.5 8,3.5 Z"
          fill="currentColor"
          fillRule="nonzero"
        ></path>
      </g>
    </Icon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || 'currentColor'}>
      <path
        d="M5.5 16H27.5"
        stroke="#3D490B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18.5 7L27.5 16L18.5 25"
        stroke="#3D490B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Icon>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || 'currentColor'}>
      <path
        d="M27.5 16H5.5"
        stroke="#3D490B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.5 7L5.5 16L14.5 25"
        stroke="#3D490B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Icon>
  );
}

export function IconImageBlank(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || 'currentColor'}>
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
        stroke-width="0.125"
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
      <path d="M11.0625 6.00068L11.0625 6.00049C11.0619 5.8154 11.1161 5.63429 11.2183 5.47997C11.3204 5.32587 11.4657 5.20537 11.636 5.13362C11.8095 5.0661 11.9985 5.04902 12.1814 5.08433C12.3641 5.11964 12.5332 5.20587 12.669 5.33309L22.6681 15.3322C22.6681 15.3322 22.6682 15.3322 22.6682 15.3323C22.8443 15.5101 22.9431 15.7504 22.9431 16.0007C22.9431 16.251 22.8443 16.4912 22.6682 16.6691C22.6682 16.6691 22.6681 16.6692 22.6681 16.6692L12.6693 26.668C12.6691 26.6682 12.669 26.6683 12.6688 26.6685C12.4885 26.8405 12.2492 26.9371 12 26.9382C11.8754 26.9376 11.752 26.9137 11.6361 26.8678C11.4658 26.7961 11.3204 26.6755 11.2183 26.5214C11.1161 26.3671 11.0619 26.186 11.0625 26.0009V26.0007L11.0625 6.00068Z" stroke-width="0.125"/>
    </Icon>
  );
}

export function IconArrowSlideLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.3875 26.9257C20.5695 26.8492 20.7248 26.7205 20.8338 26.5559C20.9428 26.3913 21.0006 26.1981 21 26.0007V6.00068C21.0006 5.80326 20.9428 5.61007 20.8338 5.44546C20.7248 5.28085 20.5695 5.15219 20.3875 5.07568M20.3875 26.9257L20.3644 26.8676C20.3642 26.8677 20.3641 26.8677 20.3639 26.8678M20.3875 26.9257L20.3633 26.8681C20.3635 26.868 20.3637 26.8679 20.3639 26.8678M20.3875 26.9257C20.2642 26.9747 20.1327 27.0001 20 27.0007C19.7345 26.9996 19.4795 26.8967 19.2875 26.7132L19.331 5.33309M20.3639 26.8678C20.5342 26.7961 20.6796 26.6756 20.7817 26.5214C20.8839 26.3671 20.9381 26.186 20.9375 26.0009V26.0007V6.00068V6.00049C20.9381 5.8154 20.8839 5.63429 20.7817 5.47996C20.6796 5.32587 20.5343 5.20538 20.364 5.13362M20.3639 26.8678C20.248 26.9137 20.1246 26.9376 20 26.9382C19.7508 26.9371 19.5114 26.8405 19.3312 26.6685C19.331 26.6683 19.3309 26.6682 19.3307 26.668L9.33191 16.6692C9.33187 16.6692 9.33184 16.6691 9.33181 16.6691C9.15568 16.4912 9.05688 16.251 9.05688 16.0007C9.05688 15.7504 9.15568 15.5101 9.33181 15.3323C9.33184 15.3322 9.33187 15.3322 9.33191 15.3322L19.331 5.33309M20.364 5.13362C20.3643 5.13372 20.3645 5.13381 20.3648 5.13391L20.3875 5.07568M20.364 5.13362C20.1905 5.0661 20.0015 5.04902 19.8186 5.08433C19.6359 5.11964 19.4668 5.20587 19.331 5.33309M20.364 5.13362C20.3638 5.13351 20.3635 5.13341 20.3633 5.1333L20.3875 5.07568M20.3875 5.07568C20.2028 5.00364 20.0015 4.98536 19.8068 5.02297C19.6121 5.06057 19.4321 5.15252 19.2875 5.28818L19.331 5.33309" stroke-width="0.125"/>
    </Icon>
  );
}

export function IconFilledStar(props: IconProps) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      stroke={props.stroke || 'currentColor'}
      stroke-width="2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
        stroke-width="0"
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
      stroke={props.stroke || 'currentColor'}
      stroke-width="2"
      fill='none'
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
      stroke={props.stroke || 'currentColor'}
      stroke-width="2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 1a.993 .993 0 0 1 .823 .443l.067 .116l2.852 5.781l6.38 .925c.741 .108 1.08 .94 .703 1.526l-.07 .095l-.078 .086l-4.624 4.499l1.09 6.355a1.001 1.001 0 0 1 -1.249 1.135l-.101 -.035l-.101 -.046l-5.693 -3l-5.706 3c-.105 .055 -.212 .09 -.32 .106l-.106 .01a1.003 1.003 0 0 1 -1.038 -1.06l.013 -.11l1.09 -6.355l-4.623 -4.5a1.001 1.001 0 0 1 .328 -1.647l.113 -.036l.114 -.023l6.379 -.925l2.853 -5.78a.968 .968 0 0 1 .904 -.56zm0 3.274v12.476a1 1 0 0 1 .239 .029l.115 .036l.112 .05l4.363 2.299l-.836 -4.873a1 1 0 0 1 .136 -.696l.07 -.099l.082 -.09l3.546 -3.453l-4.891 -.708a1 1 0 0 1 -.62 -.344l-.073 -.097l-.06 -.106l-2.183 -4.424z"
        stroke-width="0"
        fill="currentColor"
      />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconFilters(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
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
  direction = 'down',
  stroke = 'currentColor',
  ...props
}: IconProps) {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`w-5 h-5 transition ${rotate}`}
      fill="transparent"
      stroke={stroke}
    >
      <title>Caret</title>
      <path d="M14 8L10 12L6 8" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconXMark({
  stroke = 'currentColor',
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
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
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

export function IconPinterest(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
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