import {useNavigate} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useThemeSettings} from '@weaverse/hydrogen';
import clsx from 'clsx';

export function Logo({className, showTransparent} : {className?: string, showTransparent?: boolean}) {
  let settings = useThemeSettings();
  let navigate = useNavigate();
  let {logoData, transparentLogoData} = settings || {};
  let redirectToHomepage = () => {
    navigate('/');
  };
  if (!logoData) {
    return null;
  }

  return (
    <div className={clsx(className)} role="button" onClick={redirectToHomepage}>
      <Image
        data={showTransparent ? transparentLogoData : logoData}
        sizes="auto"
        className="max-w-[120px] h-full object-contain"
      />
    </div>
  );
}
