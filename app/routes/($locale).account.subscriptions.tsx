import { CircleNotchIcon } from "@phosphor-icons/react";
import { Image } from "@shopify/hydrogen";
import type { CustomerSubscriptionsQuery } from "customer-account-api.generated";
import {
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  data as response,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { Button } from "~/components/button";
import { CUSTOMER_SUBSCRIPTION_CANCEL_MUTATION } from "~/graphql/customer-account/customer-subscription-cancel-mutation";
import { CUSTOMER_SUBSCRIPTIONS_QUERY } from "~/graphql/customer-account/customer-subscriptions-query";

type SubscriptionContract = NonNullable<
  CustomerSubscriptionsQuery["customer"]
>["subscriptionContracts"]["nodes"][number];

export async function loader({ context }: LoaderFunctionArgs) {
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_SUBSCRIPTIONS_QUERY,
  );
  if (errors?.length) {
    throw new Response("Unable to load subscriptions", { status: 502 });
  }
  return response({
    subscriptions: data?.customer?.subscriptionContracts.nodes ?? [],
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (!(await context.customerAccount.isLoggedIn())) {
    return response({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const subscriptionContractId = formData.get("subscriptionContractId");
  if (
    typeof subscriptionContractId !== "string" ||
    !subscriptionContractId.startsWith("gid://shopify/SubscriptionContract/")
  ) {
    return response({ error: "Invalid subscription ID" }, { status: 400 });
  }

  const { data, errors } = await context.customerAccount.mutate(
    CUSTOMER_SUBSCRIPTION_CANCEL_MUTATION,
    { variables: { subscriptionContractId } },
  );
  const userError = data?.subscriptionContractCancel?.userErrors?.[0]?.message;
  if (errors?.length || userError) {
    return response(
      { error: userError ?? "Unable to cancel subscription" },
      { status: 400 },
    );
  }

  return response({ success: true });
}

function intervalLabel(interval: string, count: number) {
  const unit = interval.toLowerCase();
  return `${count} ${count === 1 ? unit : `${unit}s`}`;
}

function statusClass(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "PAUSED":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-background-subtle-2 text-text-subtle";
  }
}

export default function AccountSubscriptions() {
  const { subscriptions } = useLoaderData<typeof loader>();
  const actionData = useActionData<{
    error?: string;
    success?: boolean;
  }>();
  const navigation = useNavigation();
  const cancellingId = navigation.formData?.get("subscriptionContractId");

  return (
    <section className="space-y-8 py-6">
      <header className="space-y-2">
        <h2 className="font-heading text-3xl">My subscriptions</h2>
        <p className="text-text-subtle">
          Manage recurring deliveries and subscription contracts.
        </p>
      </header>

      {actionData?.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {actionData.error}
        </p>
      )}
      {actionData?.success && (
        <p className="rounded-lg bg-green-50 p-4 text-green-700">
          Subscription cancelled successfully.
        </p>
      )}

      {subscriptions.length === 0 ? (
        <div className="rounded-lg border border-border-subtle border-dashed px-6 py-16 text-center">
          <h3 className="font-heading text-xl">No subscriptions yet</h3>
          <p className="mt-2 text-text-subtle text-sm">
            Products purchased on a recurring plan will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {subscriptions.map((subscription) => (
            <article
              key={subscription.id}
              className="overflow-hidden rounded-lg border border-border-subtle bg-background-basic"
            >
              <header className="flex items-start justify-between gap-4 border-border-subtle border-b p-5">
                <span
                  className={`rounded-full px-2.5 py-1 font-semibold text-xs ${statusClass(subscription.status)}`}
                >
                  {subscription.status}
                </span>
                <span className="text-right text-text-subtle text-sm">
                  Every{" "}
                  {intervalLabel(
                    subscription.billingPolicy.interval,
                    subscription.billingPolicy.intervalCount.count,
                  )}
                </span>
              </header>

              <div className="space-y-5 p-5">
                <ul className="space-y-3">
                  {subscription.lines.nodes.map((line) => (
                    <li key={line.id} className="flex items-center gap-3">
                      {line.image && (
                        <Image
                          data={line.image}
                          sizes="48px"
                          className="size-12 rounded-md object-cover"
                        />
                      )}
                      <span className="font-medium text-sm">{line.name}</span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-2 border-border-subtle border-t pt-4 text-sm">
                  {subscription.nextBillingDate && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-subtle">Next billing</dt>
                      <dd>
                        {new Date(
                          subscription.nextBillingDate,
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-subtle">Started</dt>
                    <dd>
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>

                {subscription.discounts.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subscription.discounts.nodes.map((discount) => (
                      <span
                        key={discount.id}
                        className="rounded-full bg-green-50 px-2.5 py-1 text-green-700 text-xs"
                      >
                        {discount.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {subscription.status === "ACTIVE" && (
                <footer className="border-border-subtle border-t p-5">
                  <Form method="post">
                    <input
                      type="hidden"
                      name="subscriptionContractId"
                      value={subscription.id}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={navigation.state !== "idle"}
                    >
                      {cancellingId === subscription.id &&
                      navigation.state !== "idle" ? (
                        <CircleNotchIcon className="mr-2 size-4 animate-spin" />
                      ) : null}
                      Cancel subscription
                    </Button>
                  </Form>
                </footer>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
