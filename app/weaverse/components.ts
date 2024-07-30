import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as RecommendedProducts from '~/sections/recommended-products';
import * as StyleGuide from '~/sections/style-guide';
import * as VideoBanner from '~/sections/video-banner';
import * as Highlights from '~/sections/hightlight/index';
import * as HightlightItem from '~/sections/hightlight/item';
import * as HighlightContent from '~/sections/hightlight/content-item';
import * as ImageWithText from '~/sections/image-with-text/index';
import * as ImageWithTextImage from '~/sections/image-with-text/image';
import * as ImageWithTextContent from '~/sections/image-with-text/content';
import * as ScrollingText from '~/sections/scrolling-text/index';
import * as Testimonials from '~/sections/testimonials/index';
import * as ContentReview from '~/sections/testimonials/content-item';
import * as Review from '~/sections/testimonials/review';
import * as Slides from '~/sections/slides/index';
import * as Slide from '~/sections/slides/slide';
import * as Blogs from '~/sections/blogs/index';
import * as Instagram from '~/sections/instagram';
import * as BeforeAndAfter from '~/sections/before-and-after/index';
import * as BeforeAndAfterSlide from '~/sections/before-and-after/slider';
import * as FeaturedProducts from '~/sections/feature-product/index';
import * as FeaturedProductsList from '~/sections/feature-product/list-products';
import * as CollectionList from '~/sections/collection-list/index';
import * as CollectionListItem from '~/sections/collection-list/collection-list';
import * as AllProducts from '~/sections/all-products/index';
import * as ProductInformation from '~/sections/product-information/index';
import * as HeaderImage from '~/sections/image-banner/index';
import * as CollectionFilters from '~/sections/collection-filters/index';
import * as Page from '~/sections/page/page';
import * as RelatedArticles from '~/sections/related-articles/related-articles';
import * as BlogPost from '~/sections/blog-post/blog-post';
import * as RelatedProducts from '~/sections/related-products/related-products';
import * as CollectionBanner from '~/sections/collection-banner/collection-banner';
import * as Newsletter from '~/sections/newsletter/index';
import * as NewsletterInput from '~/sections/newsletter/input-email';
import * as NewsletterIcon from '~/sections/newsletter/newsletter-icon';
import * as SlideShowBanner from '~/sections/slideshowbanner/index';
import * as SlideShowBannerItem from '~/sections/slideshowbanner/slideitems';
import * as ContactForm from '~/sections/contact-form/contact-form';
import * as Countdown from '~/sections/countdown/index';
import * as CountdownTimer from '~/sections/countdown/timer';
import * as ProductPlacement from '~/sections/product-placement/index';
import * as ProductPlacementItems from '~/sections/product-placement/items';
import * as ProductPlacementItem from '~/sections/product-placement/productItem';
import * as Hotspots from '~/sections/image-hotspots/index';
import * as HotspotsItem from '~/sections/image-hotspots/item';
import { atoms } from '~/sections/atoms/atoms';
export const components: HydrogenComponent[] = [
    ...atoms,
    VideoBanner,
    Highlights,
    HightlightItem,
    HighlightContent,
    ImageWithText,
    ImageWithTextImage,
    ImageWithTextContent,
    ScrollingText,
    Testimonials,
    ContentReview,
    Review,
    Slides,
    Slide,
    Blogs,
    Instagram,
    BeforeAndAfter,
    BeforeAndAfterSlide,
    FeaturedProducts,
    FeaturedProductsList,
    CollectionList,
    CollectionListItem,
    AllProducts,
    ProductInformation,
    HeaderImage,
    CollectionFilters,
    Page,
    RelatedArticles,
    BlogPost,
    RelatedProducts,
    CollectionBanner,
    Newsletter,
    NewsletterInput,
    NewsletterIcon,
    SlideShowBanner,
    SlideShowBannerItem,
    ContactForm,
    Countdown,
    CountdownTimer,
    ProductPlacement,
    ProductPlacementItems,
    ProductPlacementItem,
    Hotspots,
    HotspotsItem,
    StyleGuide
];
