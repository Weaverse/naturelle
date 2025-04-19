export const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate ($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        email
        firstName
        lastName
      }
      customerUserErrors {
        code,
        message,
        field
    }
    }
  }
` as const;
