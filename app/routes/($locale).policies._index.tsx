import { FileTextIcon } from "@phosphor-icons/react";
import { useTranslation } from "@weaverse/hydrogen";
import { data, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { BreadCrumb } from "~/components/breadcrumb";
import { Link } from "~/components/link";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const shouldRevalidate = skipRevalidationForCartActions;

export async function loader({ context }: LoaderFunctionArgs) {
  const policiesData = await context.storefront.query(POLICIES_QUERY);
  const policies = Object.values(policiesData.shop || {});

  if (!policies.length) {
    throw new Response("No policies found", { status: 404 });
  }

  return data({ policies });
}

export default function Policies() {
  const { t } = useTranslation();
  const { policies } = useLoaderData<typeof loader>();

  return (
    <section className="px-5 md:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-page py-20">
        <BreadCrumb page={t("system.policies")} className="mb-4" />
        <h1 className="h4 mb-8 font-medium lg:mb-20">{t("system.policies")}</h1>
        <div className="flex flex-col gap-3">
          {policies.map((policy: any) => {
            if (!policy) {
              return null;
            }
            return (
              <Link
                key={policy.id}
                className="flex w-fit items-center gap-2 underline underline-offset-4"
                to={`/policies/${policy.handle}`}
              >
                <FileTextIcon className="h-5 w-5" />
                <span>{policy.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
