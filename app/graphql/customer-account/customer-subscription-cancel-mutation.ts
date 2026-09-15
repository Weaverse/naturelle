export const CUSTOMER_SUBSCRIPTION_CANCEL_MUTATION = `#graphql
  mutation CustomerSubscriptionCancel($subscriptionContractId: ID!) {
    subscriptionContractCancel(subscriptionContractId: $subscriptionContractId) {
      contract {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
