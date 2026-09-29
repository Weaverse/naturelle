import { useTranslation } from "@weaverse/hydrogen";
import {
  Form,
  type LoaderFunctionArgs,
  NavLink,
  Outlet,
  data as response,
  useLoaderData,
} from "react-router";
import { CUSTOMER_DETAILS_QUERY } from "~/graphql/customer-account/customer-details-query";
import { usePrefixPathWithLocale } from "~/utils/locale";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const shouldRevalidate = skipRevalidationForCartActions;

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
  const { t } = useTranslation();
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? t("account.welcome", { name: customer.firstName })
      : t("account.welcomeGeneric")
    : t("account.details");

  return (
    <div className="account container p-6 space-y-3">
      <h1>{heading}</h1>
      <Logout />
      <AccountMenu />
      <Outlet context={{ customer }} />
    </div>
  );
}

function AccountMenu() {
  const { t } = useTranslation();
  const ordersPath = usePrefixPathWithLocale("/account/orders");
  const profilePath = usePrefixPathWithLocale("/account/profile");
  const addressesPath = usePrefixPathWithLocale("/account/addresses");
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
      <NavLink to={ordersPath} style={isActiveStyle}>
        {t("account.orders")} &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to={profilePath} style={isActiveStyle}>
        &nbsp; {t("account.profile")} &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to={addressesPath} style={isActiveStyle}>
        &nbsp; {t("account.addresses")} &nbsp;
      </NavLink>
    </nav>
  );
}

function Logout() {
  const { t } = useTranslation();
  const logoutPath = usePrefixPathWithLocale("/account/logout");
  return (
    <Form className="account-logout" method="POST" action={logoutPath}>
      &nbsp;<button type="submit">{t("account.signOut")}</button>
    </Form>
  );
}
