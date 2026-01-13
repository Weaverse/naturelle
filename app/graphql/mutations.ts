export const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        displayName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
