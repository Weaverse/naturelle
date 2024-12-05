export function Spinner(props: {size?: number}) {
  const {size = 20} = props;
  return (
    <>
      <style>
        {`
          .lds-ring {
            display: inline-block;
            position: relative;
          }
          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid currentColor;
            border-radius: 50%;
            animation: lds-ring 1s cubic-bezier(0.3, 0, 0.3, 1) infinite;
            border-color: currentColor transparent transparent transparent;
          }
          .lds-ring div:nth-child(1) {
            animation-delay: -0.3s;
          }
          .lds-ring div:nth-child(2) {
            animation-delay: -0.2s;
          }
          .lds-ring div:nth-child(3) {
            animation-delay: -0.1s;
          }
          @keyframes lds-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className={`lds-ring`} style={{
        width: size,
        height: size,
      }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}
