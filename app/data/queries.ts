import {
  COLLECTION_CONTENT_FRAGMENT,
  MEDIA_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from '~/data/fragments';

export const BLOG_QUERY = `#graphql
query BlogSingle(
    $language: LanguageCode
    $blogHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articles(first: 8) {
        nodes {
            author: authorV2 {
                name
              }
              contentHtml
              excerpt
              excerptHtml
              handle
              id
              image {
                id
                altText
                url
                width
                height
              }
              publishedAt
              title
              blog {
                handle
              }
        }
      }
    }
  }
` as const;

export const FEATURED_PRODUCTS_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: 24){
        nodes{
          id
          handle
          title
          vendor
          compareAtPriceRange{
            maxVariantPrice{
              currencyCode
              amount
            }
            minVariantPrice{
              currencyCode
              amount
            }
          }
          priceRange{
            maxVariantPrice{
              currencyCode
              amount
            }
            minVariantPrice{
              currencyCode
              amount
            }
          }
          featuredImage {
            id
            altText
            url
            width
            height
          }
        }
      }      
    }
  }
`;

export let ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;