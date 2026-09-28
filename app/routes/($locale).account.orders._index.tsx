import {
  flattenConnection,
  getPaginationVariables,
  Image,
  Pagination,
} from "@shopify/hydrogen";
import { useTranslation } from "@weaverse/hydrogen";
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from "customer-account-api.generated";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  data as response,
  useLoaderData,
} from "react-router";
import { Link } from "~/components/link";
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

export default function Orders() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { orders } = customer;
  return (
    <div className="orders">
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, "orders">) {
  const { t } = useTranslation();
  return (
    <div className="acccount-orders grid grid-cols-1 md:grid-cols-2 gap-4">
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
    <div className="flex gap-2 p-5 border border-bar-subtle">
      <Image data={image} className="w-40 h-auto" width={140} />
      <div className="space-y-2">
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <h4 className="font-medium">{title}</h4>
        </Link>
        <div className="space-y-1">
          <p>{t("orders.orderNumber", { number: order.number })}</p>
          <p>{formatDate(order.processedAt, locale)}</p>
        </div>

        <p className="p-2 bg-label-soldout-background rounded w-fit text-white">
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
