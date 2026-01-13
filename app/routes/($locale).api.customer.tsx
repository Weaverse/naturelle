import type { ActionFunction, ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import type { CustomerCreateMutation } from "storefront-api.generated";
import { CUSTOMER_CREATE_MUTATION } from "~/graphql/mutations";

export const action: ActionFunction = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  let formData = await request.formData();
  let email = formData.get("email");
  let { storefront } = context;

  let { customerCreate, errors: queryError } =
    await storefront.mutate<CustomerCreateMutation>(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          password: "123456",
          acceptsMarketing: true,
        },
      },
    });
  let customer = customerCreate?.customer;
  let errors = customerCreate?.customerUserErrors || queryError;
  if (errors?.length) {
    return data(
      { errors },
      {
        status: 200,
      },
    );
  }
  return data(
    { customer },
    {
      status: 201,
    },
  );
};
