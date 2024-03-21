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