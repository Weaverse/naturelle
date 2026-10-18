import type { Shop } from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import {
  data,
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from "react-router";
import { BreadCrumb } from "~/components/breadcrumb";
import { Link } from "~/components/link";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const shouldRevalidate = skipRevalidationForCartActions;

type SelectedPolicies = keyof Pick<
  Shop,
  | "privacyPolicy"
  | "shippingPolicy"
  | "termsOfService"
  | "refundPolicy"
  | "subscriptionPolicy"
>;

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return [{ title: `Hydrogen | ${loaderData?.policy.title ?? ""}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response("No handle was passed in", { status: 404 });
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const policyData = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      subscriptionPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = policyData.shop?.[policyName];

  if (!policy) {
    throw new Response("Could not find the policy", { status: 404 });
  }

  return data({ policy });
}

export default function Policy() {
  const { t } = useTranslation();
  const { policy } = useLoaderData<typeof loader>();

  return (
    <section className="px-5 md:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-page py-20">
        <BreadCrumb page={policy.title} className="mb-4" />
        <h1 className="h4 mb-4 font-medium">{policy.title}</h1>
        <Link className="underline underline-offset-4" to="/policies">
          &larr; {t("system.backToPolicies")}
        </Link>
        <div className="mt-8 lg:mt-20">
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: policy.body }}
            className="prose"
          />
        </div>
      </div>
    </section>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $subscriptionPolicy: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
      subscriptionPolicy @include(if: $subscriptionPolicy) {
        body
        handle
        id
        title
        url
      }
    }
  }
` as const;
