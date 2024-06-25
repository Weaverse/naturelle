import {useNavigate} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useThemeSettings} from '@weaverse/hydrogen';

export function Logo() {
  let settings = useThemeSettings();
  let navigate = useNavigate();
  let {logoData} = settings || {};
  let redirectToHomepage = () => {
    navigate('/');
  };
  if (!logoData) {
    return null;
  }

  return (
    <div className="w-full flex justify-center" role="button" onClick={redirectToHomepage}>
      <Image
        data={logoData}
        sizes="auto"
        className="max-w-[120px] h-full object-contain"
      />
    </div>
  );
}
