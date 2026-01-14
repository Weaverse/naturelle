import {
  Form,
  type LoaderFunctionArgs,
  NavLink,
  Outlet,
  data as response,
  useLoaderData,
} from "react-router";
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from "~/graphql/customer-account/customer-address-mutations";
import { CUSTOMER_DETAILS_QUERY } from "~/graphql/customer-account/customer-details-query";

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error("Customer not found");
  }

  return response(
    { customer: data.customer },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  );
}

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : "Account Details";

  return (
    <div className="account container p-6 space-y-3">
      <h1>{heading}</h1>
      <Logout />
      {/* <AccountMenu /> */}
      <Outlet context={{ customer }} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? "bold" : undefined,
      color: isPending ? "grey" : "black",
    };
  }

  return (
    <nav>
      <NavLink to="/account/orders" style={isActiveStyle}>
        Orders &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/profile" style={isActiveStyle}>
        &nbsp; Profile &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/addresses" style={isActiveStyle}>
        &nbsp; Addresses &nbsp;
      </NavLink>
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      &nbsp;<button type="submit">Sign out</button>
    </Form>
  );
}
