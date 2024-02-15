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