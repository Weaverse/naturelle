import type { HydrogenComponent } from "@weaverse/hydrogen";
import * as AllProducts from "~/sections/all-products/index";
import { atoms } from "~/sections/atoms/atoms";
import * as BeforeAndAfter from "~/sections/before-and-after/index";
import * as BeforeAndAfterSlide from "~/sections/before-and-after/slider";
import * as BlogPost from "~/sections/blog-post/blog-post";
import * as Blogs from "~/sections/blogs/index";
import * as CollectionBanner from "~/sections/collection-banner/collection-banner";
import * as CollectionFilters from "~/sections/collection-filters/index";
import * as CollectionListItem from "~/sections/collection-list/collection-list";
import * as CollectionList from "~/sections/collection-list/index";
import * as ContactForm from "~/sections/contact-form/contact-form";
import * as Countdown from "~/sections/countdown/index";
import * as CountdownTimer from "~/sections/countdown/timer";
import * as FeaturedProducts from "~/sections/feature-product/index";
import * as FeaturedProductsList from "~/sections/feature-product/list-products";
import * as HighlightContent from "~/sections/hightlight/content-item";
import * as Highlights from "~/sections/hightlight/index";
import * as HightlightItem from "~/sections/hightlight/item";
import * as HeaderImage from "~/sections/image-banner/index";
import * as HotspotsItem from "~/sections/image-hotspots/hotspot-item";
import * as HotspotsImage from "~/sections/image-hotspots/image-item";
import * as Hotspots from "~/sections/image-hotspots/index";
import * as ImageWithTextContent from "~/sections/image-with-text/content";
import * as ImageWithTextImage from "~/sections/image-with-text/image";
import * as ImageWithText from "~/sections/image-with-text/index";
import * as Instagram from "~/sections/instagram";
import * as JudgemeReviewSection from "~/sections/judgeme-reviews/index";
import * as JudgemeReviewIndex from "~/sections/judgeme-reviews/review-index";
import * as Newsletter from "~/sections/newsletter/index";
import * as NewsletterInput from "~/sections/newsletter/input-email";
import * as NewsletterIcon from "~/sections/newsletter/newsletter-icon";
import * as Page from "~/sections/page/page";
import * as ProductInformation from "~/sections/product-information/index";
import * as ProductPlacement from "~/sections/product-placement/index";
import * as ProductPlacementItems from "~/sections/product-placement/items";
import * as ProductPlacementItem from "~/sections/product-placement/productItem";
import * as RelatedArticles from "~/sections/related-articles/related-articles";
import * as ScrollingText from "~/sections/scrolling-text/index";
import * as SingleProduct from "~/sections/single-product/index";
import * as Slides from "~/sections/slides/index";
import * as Slide from "~/sections/slides/slide";
import * as SlideShowBanner from "~/sections/slideshowbanner/index";
import * as SlideShowBannerItem from "~/sections/slideshowbanner/slideitems";
import * as Spacer from "~/sections/spacer";
import * as StyleGuide from "~/sections/style-guide";
import * as ContentReview from "~/sections/testimonials/content-item";
import * as Testimonials from "~/sections/testimonials/index";
import * as Review from "~/sections/testimonials/review";
import * as VideoBanner from "~/sections/video-banner";
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
  SingleProduct,
  HeaderImage,
  CollectionFilters,
  Page,
  RelatedArticles,
  BlogPost,
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
  HotspotsImage,
  Spacer,
  JudgemeReviewSection,
  JudgemeReviewIndex,
  StyleGuide,
];
