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
        d="M9.9998 12.625c-1.9141 0-3.6628.698-5.0435 1.8611C3.895 13.2935 3.25 11.7221 3.25 10c0-3.728 3.022-6.75 6.75-6.75 3.7279 0 6.75 3.022 6.75 6.75 0 1.7222-.645 3.2937-1.7065 4.4863-1.3807-1.1632-3.1295-1.8613-5.0437-1.8613ZM10 18c-2.3556 0-4.4734-1.0181-5.9374-2.6382C2.7806 13.9431 2 12.0627 2 10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8Zm0-12.5c-1.567 0-2.75 1.394-2.75 3s1.183 3 2.75 3 2.75-1.394 2.75-3-1.183-3-2.75-3Z"
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
      <path d="M5.5 16H27.5" stroke="#3D490B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M18.5 7L27.5 16L18.5 25" stroke="#3D490B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </Icon>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || 'currentColor'}>
        <path d="M27.5 16H5.5" stroke="#3D490B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14.5 7L5.5 16L14.5 25" stroke="#3D490B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </Icon>
  );
}

export function IconImageBlank(props: IconProps) {
  return (
    <Icon {...props} fill="none" stroke={props.stroke || 'currentColor'}>
      <path d="M325 212.7H203.5C201.9 212.7 200.7 214 200.7 215.5V308C200.7 309.6 202 310.8 203.5 310.8H325.1C326.7 310.8 327.9 309.5 327.9 308V215.5C327.9 213.9 326.6 212.7 325 212.7ZM326.1 308C326.1 308.6 325.6 309.1 325 309.1H203.5C202.9 309.1 202.4 308.6 202.4 308V215.5C202.4 214.9 202.9 214.4 203.5 214.4H325.1C325.7 214.4 326.2 214.9 326.2 215.5V308H326.1Z" fill="black" />
      <path d="M210.9 299.5H240.5V299.6C240.5 299.6 240.6 299.6 240.7 299.5H315.9V223.3H210.9V299.5ZM212.7 292.3L232.7 272.3C234.3 270.7 236.5 269.8 238.8 269.8C241.1 269.8 243.3 270.7 244.9 272.3L246.4 273.8L263.2 290.6C250.3 293.9 242.5 296.9 240.4 297.8H212.7V292.3ZM314.2 282.2C294.1 283.9 277.5 287 265.1 290.1L248.2 273.2L274.5 246.9C276.1 245.3 278.3 244.4 280.6 244.4C282.9 244.4 285.1 245.3 286.7 246.9L314.2 274.4V282.2ZM245.3 297.7C255 294.2 279.2 286.8 314.2 283.9V297.7H245.3ZM314.2 225V271.8L288 245.6C286.1 243.7 283.5 242.6 280.7 242.6C277.9 242.6 275.3 243.7 273.4 245.6L247.1 271.9L246.2 271C244.3 269.1 241.7 268 238.9 268C236.1 268 233.5 269.1 231.6 271L212.8 289.8V225H314.2Z" fill="black" />
      <path d="M233.3 254C237.9 254 241.6 250.3 241.6 245.7C241.6 241.1 237.9 237.4 233.3 237.4C228.7 237.4 225 241.1 225 245.7C225 250.3 228.7 254 233.3 254ZM233.3 239.1C236.9 239.1 239.9 242 239.9 245.7C239.9 249.4 237 252.3 233.3 252.3C229.6 252.3 226.7 249.4 226.7 245.7C226.7 242 229.7 239.1 233.3 239.1Z" fill="black" />
    </Icon>
  );
}