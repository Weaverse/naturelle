import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as RecommendedProducts from '~/sections/recommended-products';
import * as StyleGuide from '~/sections/style-guide';
import * as VideoBanner from '~/sections/video-banner';
import * as Highlights from '~/sections/hightlight/index';
import * as HightlightItem from '~/sections/hightlight/item';
import * as ImageWithText from '~/sections/image-with-text/index';
import * as ScrollingText from '~/sections/scrolling-text/index';
import * as Testimonials from '~/sections/testimonials/index';
import * as Review from '~/sections/testimonials/review';
import * as Slides from '~/sections/slides/index';
import * as Slide from '~/sections/slides/slide';
import * as Blogs from '~/sections/blogs/index';
import * as Instagram from '~/sections/instagram';
import * as BeforeAndAfter from '~/sections/before-and-after/index';
import * as BeforeAndAfterSlide from '~/sections/before-and-after/slider';
import { atoms } from '~/sections/atoms/atoms';
export const components: HydrogenComponent[] = [
    ...atoms,
    VideoBanner,
    Highlights,
    HightlightItem,
    ImageWithText,
    ScrollingText,
    Testimonials,
    Review,
    Slides,
    Slide,
    Blogs,
    Instagram,
    BeforeAndAfter,
    BeforeAndAfterSlide,
    StyleGuide
];
