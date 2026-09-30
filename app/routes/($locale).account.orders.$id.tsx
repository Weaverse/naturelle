import { flattenConnection, Image, Money } from "@shopify/hydrogen";
import { useTranslation } from "@weaverse/hydrogen";
import type { OrderLineItemFullFragment } from "customer-account-api.generated";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
  data as response,
  useLoaderData,
} from "react-router";
import { CUSTOMER_ORDER_QUERY } from "~/graphql/customer-account/customer-order-query";
import { useRootLoaderData } from "~/root";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatDate, formatNumber, prefixPathWithLocale } from "~/utils/locale";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Order ${data?.order?.name}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(
      prefixPathWithLocale(
        "/account/orders",
        context.localization.selectedLocale,
      ),
    );
  }

  const orderId = atob(params.id);
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: { orderId },
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error("Order not found");
  }

  const { order } = data;

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === "MoneyV2" && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === "PricingPercentageValue" &&
    firstDiscount?.percentage;

  return response({
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  });
}

export default function OrderRoute() {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  return (
    <div className="account-order">
      <h2>{t("orders.orderNumber", { number: order.name })}</h2>
      <p>
        {t("account.placedOn", {
          date: order.processedAt ? formatDate(order.processedAt, locale) : "",
        })}
      </p>
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">{t("account.product")}</th>
              <th scope="col">{t("product.price")}</th>
              <th scope="col">{t("account.quantity")}</th>
              <th scope="col">{t("account.total")}</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            {(discountValue?.amount || discountPercentage) && (
              <tr>
                <th scope="row" colSpan={3}>
                  <p>{t("account.discount")}</p>
                </th>
                <th scope="row">
                  <p>{t("account.discount")}</p>
                </th>
                <td>
                  {discountPercentage ? (
                    <span>
                      -
                      {t("orders.percentageOff", {
                        percentage: formatNumber(discountPercentage, locale),
                      })}
                    </span>
                  ) : (
                    discountValue && <Money data={discountValue} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={3}>
                <p>{t("account.subtotal")}</p>
              </th>
              <th scope="row">
                <p>{t("account.subtotal")}</p>
              </th>
              <td>{order.subtotal && <Money data={order.subtotal} />}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                {t("account.tax")}
              </th>
              <th scope="row">
                <p>{t("account.tax")}</p>
              </th>
              <td>{order.totalTax && <Money data={order.totalTax} />}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                {t("account.total")}
              </th>
              <th scope="row">
                <p>{t("account.total")}</p>
              </th>
              <td>{order.totalPrice && <Money data={order.totalPrice} />}</td>
            </tr>
          </tfoot>
        </table>
        <div>
          <h3>{t("account.shippingAddress")}</h3>
          {order?.shippingAddress ? (
            <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? (
                <p>{order.shippingAddress.formatted}</p>
              ) : (
                ""
              )}
              {order.shippingAddress.formattedArea ? (
                <p>{order.shippingAddress.formattedArea}</p>
              ) : (
                ""
              )}
            </address>
          ) : (
            <p>{t("account.noShippingAddress")}</p>
          )}
          <h3>{t("account.status")}</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </div>
      </div>
      <br />
      <p>
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          {t("account.viewOrderStatus")} →
        </a>
      </p>
    </div>
  );
}

function OrderLineRow({ lineItem }: { lineItem: OrderLineItemFullFragment }) {
  return (
    <tr key={lineItem.id}>
      <td>
        <div>
          {lineItem?.image && (
            <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
          <div>
            <p>{lineItem.title}</p>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>{lineItem.price && <Money data={lineItem.price} />}</td>
      <td>{lineItem.quantity}</td>
      <td>
        {lineItem.totalDiscount && <Money data={lineItem.totalDiscount} />}
      </td>
    </tr>
  );
}
