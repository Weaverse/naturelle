import type {HydrogenComponent} from '@weaverse/hydrogen';
import * as RecommendedProducts from '~/sections/recommended-products';
import * as HeaderImage from '~/sections/HeaderImage/HeaderImage';
import { atoms } from '~/sections/atoms/atoms';
export const components: HydrogenComponent[] = [
    ...atoms,
    HeaderImage,
];
