export const CUSTOMER_SUBSCRIPTIONS_QUERY = `#graphql
  query CustomerSubscriptions {
    customer {
      subscriptionContracts(first: 100) {
        nodes {
          id
          status
          createdAt
          nextBillingDate
          billingPolicy {
            interval
            intervalCount {
              count
              precision
            }
          }
          discounts(first: 20) {
            nodes {
              id
              title
              value {
                __typename
                ... on SubscriptionDiscountFixedAmountValue {
                  amount {
                    amount
                    currencyCode
                  }
                }
                ... on SubscriptionDiscountPercentageValue {
                  percentage
                }
              }
            }
          }
          lines(first: 100) {
            nodes {
              id
              name
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;
