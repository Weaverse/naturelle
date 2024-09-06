import {
  Form,
  Link,
  type MetaFunction,
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import {
  Image,
  Pagination,
  flattenConnection,
  getPaginationVariables,
} from "@shopify/hydrogen";
import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@shopify/remix-oxygen";
import type {
  CustomerFragment,
  CustomerOrdersFragment,
  OrderItemFragment,
} from "customer-accountapi.generated";
import Addresses from "~/components/account/Addresses";
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from "~/graphql/customer-account/CustomerAddressMutations";
import { CUSTOMER_ORDERS_QUERY } from "~/graphql/customer-account/CustomerOrdersQuery";

export const meta: MetaFunction = () => {
  return [{ title: "Orders" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });
  let access = await context.customerAccount.getAccessToken();
  console.log(access);

  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error("Customer orders not found");
  }

  return json({ customer: data.customer });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has("addressId")
      ? String(form.get("addressId"))
      : null;
    if (!addressId) {
      throw new Error("You must provide an address id.");
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return json(
        { error: { [addressId]: "Unauthorized" } },
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has("defaultAddress")
      ? String(form.get("defaultAddress")) === "on"
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      "address1",
      "address2",
      "city",
      "company",
      "territoryCode",
      "firstName",
      "lastName",
      "phoneNumber",
      "zoneCode",
      "zip",
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === "string") {
        address[key] = value;
      }
    }

    switch (request.method) {
      case "POST": {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: { address, defaultAddress },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error("Customer address create failed.");
          }

          return json({
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case "PUT": {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress: defaultAddress || null,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error("Customer address update failed.");
          }
          // return redirect(params?.locale ? `${params.locale}/account` : '/account', {

          // });

          return json({
            error: null,
            updatedAddress: address,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case "DELETE": {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: { addressId: decodeURIComponent(addressId) },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error("Customer address delete failed.");
          }

          return json({ error: null, deletedAddress: addressId });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return json(
          { error: { [addressId]: "Method not allowed" } },
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json(
        { error: error.message },
        {
          status: 400,
        },
      );
    }
    return json(
      { error },
      {
        status: 400,
      },
    );
  }
}

export default function Account() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  console.log("🚀 ~ customer:", customer);
  const { orders } = customer;
  return (
    <div className="space-y-10">
      <div className="orders space-y-4">
        <h2 className="text-xl">Orders</h2>
        {orders.nodes.length ? (
          <OrdersTable orders={orders} />
        ) : (
          <EmptyOrders />
        )}
      </div>
      <AccountProfile />
      <Addresses />
    </div>
  );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, "orders">) {
  return (
    <div className="acccount-orders grid grid-cols-1 gap-4 md:grid-cols-2">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? "Loading..." : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((order) => {
                  return <OrderItem key={order.id} order={order} />;
                })}
                <NextLink>
                  {isLoading ? "Loading..." : <span>Load more ↓</span>}
                </NextLink>
              </>
            );
          }}
        </Pagination>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <p>You haven&apos;t placed any orders yet.</p>
      <br />
      <p>
        <Link to="/collections">Start Shopping →</Link>
      </p>
    </div>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  let item = order.lineItems.nodes[0];
  let length = order.lineItems.nodes.length;
  let image = item?.image;
  let title = item?.title;
  if (length > 1) {
    title = `${item?.title} + ${length - 1} more`;
  }
  return (
    <div className="flex gap-2 border border-bar-subtle p-5">
      <Image data={image} className="h-auto w-40" width={140} />
      <div className="space-y-2">
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <h4 className="font-medium">{title}</h4>
        </Link>
        <div className="space-y-1">
          <p>Order no. {order.number}</p>
          <p>{new Date(order.processedAt).toDateString()}</p>
        </div>

        <p className="w-fit rounded bg-label-soldout p-2 text-white">
          {order.financialStatus}
        </p>
        {/* <Money data={order.totalPrice} /> */}
        <p>
          <Link to={`/account/orders/${btoa(order.id)}`}>View Details</Link>
        </p>
      </div>
    </div>
  );
}

type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;
  console.log("🚀 ~ customer2:", customer);

  return (
    <div className="account-profile">
      <h2 className="text-xl">Account</h2>
      <br />
      <div className="space-y-3 border border-bar-subtle p-5">
        <div className="space-y-1">
          <p>First Name</p>
          <p className="font-medium">{customer.firstName}</p>
        </div>
        <div className="space-y-1">
          <p>Last Name</p>
          <p className="font-medium">{customer.lastName}</p>
        </div>
        <div className="space-y-1">
          <p>Email</p>
          <p className="font-medium">{customer.emailAddress?.emailAddress}</p>
        </div>
      </div>
      <div className="hidden">
        <Form method="PUT">
          <legend>Personal information</legend>
          <fieldset>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ""}
              minLength={2}
            />
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ""}
              minLength={2}
            />
          </fieldset>
          {action?.error ? (
            <p>
              <mark>
                <small>{action.error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
          <button type="submit" disabled={state !== "idle"}>
            {state !== "idle" ? "Updating" : "Update"}
          </button>
        </Form>
      </div>
    </div>
  );
}
