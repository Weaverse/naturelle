import {
  flattenConnection,
  getPaginationVariables,
  Image,
  Pagination,
} from "@shopify/hydrogen";
import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import type {
  CustomerFragment,
  CustomerOrdersFragment,
  OrderItemFragment,
} from "customer-account-api.generated";
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  type MetaFunction,
  data as response,
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "react-router";
import Addresses from "~/components/account/addresses";
import { Link } from "~/components/link";
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from "~/graphql/customer-account/customer-address-mutations";
import { CUSTOMER_ORDERS_QUERY } from "~/graphql/customer-account/customer-orders-query";
import { useRootLoaderData } from "~/root";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatDate } from "~/utils/locale";

export const meta: MetaFunction = () => {
  return [{ title: "Orders" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw new Error("Customer orders not found");
  }

  return response({ customer: data.customer });
}

export async function action({ request, context }: ActionFunctionArgs) {
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
      return response(
        { error: { [addressId]: "Unauthorized" } },
        { status: 401 },
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

          return response({
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return response(
              { error: { [addressId]: error.message } },
              { status: 400 },
            );
          }
          return response({ error: { [addressId]: error } }, { status: 400 });
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

          return response({
            error: null,
            updatedAddress: address,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return response(
              { error: { [addressId]: error.message } },
              { status: 400 },
            );
          }
          return response({ error: { [addressId]: error } }, { status: 400 });
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

          return response({ error: null, deletedAddress: addressId });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return response(
              { error: { [addressId]: error.message } },
              { status: 400 },
            );
          }
          return response({ error: { [addressId]: error } }, { status: 400 });
        }
      }

      default: {
        return response(
          { error: { [addressId]: "Method not allowed" } },
          { status: 405 },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return response({ error: error.message }, { status: 400 });
    }
    return response({ error }, { status: 400 });
  }
}

export default function Account() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { t } = useTranslation();
  const { orders } = customer;
  return (
    <div className="space-y-10">
      <div className="orders space-y-4">
        <h2 className="text-xl">{t("account.orders")}</h2>
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
  const { t } = useTranslation();
  return (
    <div className="acccount-orders grid grid-cols-1 gap-4 md:grid-cols-2">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? (
                    t("system.loading")
                  ) : (
                    <span>↑ {t("account.loadPrevious")}</span>
                  )}
                </PreviousLink>
                {nodes.map((order) => {
                  return <OrderItem key={order.id} order={order} />;
                })}
                <NextLink>
                  {isLoading ? (
                    t("system.loading")
                  ) : (
                    <span>{t("account.loadMore")} ↓</span>
                  )}
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
  const { t } = useTranslation();
  return (
    <div>
      <p>{t("account.noOrders")}</p>
      <br />
      <p>
        <Link to="/collections">{t("account.startShopping")} →</Link>
      </p>
    </div>
  );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  let item = order.lineItems.nodes[0];
  let length = order.lineItems.nodes.length;
  let image = item?.image;
  let title = item?.title;
  if (length > 1) {
    title = `${item?.title} + ${t("orders.moreItems", { count: length - 1 })}`;
  }
  return (
    <div className="flex gap-2 border border-bar-subtle p-5">
      <Image data={image} className="h-auto w-40" width={140} />
      <div className="space-y-2">
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <h4 className="font-medium">{title}</h4>
        </Link>
        <div className="space-y-1">
          <p>{t("orders.orderNumber", { number: order.number })}</p>
          <p>{formatDate(order.processedAt, locale)}</p>
        </div>

        <p className="w-fit rounded bg-label-soldout-background p-2 text-white">
          {order.financialStatus}
        </p>
        {/* <Money data={order.totalPrice} /> */}
        <p>
          <Link to={`/account/orders/${btoa(order.id)}`}>
            {t("account.viewDetails")}
          </Link>
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
  const { t } = useTranslation();
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const customer = actionData?.customer ?? account?.customer;

  return (
    <div className="account-profile">
      <h2 className="text-xl">{t("account.title")}</h2>
      <br />
      <div className="space-y-3 border border-bar-subtle p-5">
        <div className="space-y-1">
          <p>{t("account.firstName")}</p>
          <p className="font-medium">{customer.firstName}</p>
        </div>
        <div className="space-y-1">
          <p>{t("account.lastName")}</p>
          <p className="font-medium">{customer.lastName}</p>
        </div>
        <div className="space-y-1">
          <p>{t("account.email")}</p>
          <p className="font-medium">{customer.emailAddress?.emailAddress}</p>
        </div>
      </div>
      <div className="hidden">
        <Form method="PUT">
          <legend>{t("account.personalInformation")}</legend>
          <fieldset>
            <label htmlFor="firstName">{t("account.firstName")}</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={t("account.firstName")}
              aria-label={t("account.firstName")}
              defaultValue={customer.firstName ?? ""}
              minLength={2}
            />
            <label htmlFor="lastName">{t("account.lastName")}</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={t("account.lastName")}
              aria-label={t("account.lastName")}
              defaultValue={customer.lastName ?? ""}
              minLength={2}
            />
          </fieldset>
          {actionData?.error ? (
            <p>
              <mark>
                <small>{actionData.error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
          <button type="submit" disabled={state !== "idle"}>
            {state !== "idle" ? t("account.updating") : t("account.update")}
          </button>
        </Form>
      </div>
    </div>
  );
}
