import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as RecommendedProducts from '~/sections/recommended-products';
import * as StyleGuide from '~/sections/style-guide';
import * as HeaderImage from '~/sections/Image-banner/Image-banner';
import * as Highlights from '~/sections/hightlight/index';
import * as HightlightItem from '~/sections/hightlight/item';
import * as ImageWithText from '~/sections/image-with-text/index';
import * as Testimonials from '~/sections/testimonials/index';
import * as Review from '~/sections/testimonials/review';
import { atoms } from '~/sections/atoms/atoms';
export const components: HydrogenComponent[] = [
    ...atoms,
    HeaderImage,
    Highlights,
    HightlightItem,
    ImageWithText,
    Testimonials,
    Review,
    StyleGuide
];
