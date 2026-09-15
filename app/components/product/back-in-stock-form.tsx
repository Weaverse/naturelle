import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import { Button } from "~/components/button";
import type { RootLoader } from "~/root";
import { usePrefixPathWithLocale } from "~/utils/locale";

type BackInStockResponse = { ok: boolean; error?: string };

export function BackInStockForm({
  variantId,
  availableForSale,
  enabled = true,
}: {
  variantId?: string | null;
  availableForSale?: boolean | null;
  enabled?: boolean;
}) {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const action = usePrefixPathWithLocale("/api/back-in-stock");
  const fetcher = useFetcher<BackInStockResponse>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const showForm =
    enabled &&
    Boolean(rootData?.integrations?.klaviyo) &&
    Boolean(variantId) &&
    availableForSale === false;

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }
    if (fetcher.data.ok) {
      setError("");
      setMessage("We'll email you when this product is back in stock.");
    } else {
      setMessage("");
      setError(fetcher.data.error || "Something went wrong. Please try again.");
    }
  }, [fetcher.data]);

  if (!showForm) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div>
        <p className="font-heading text-lg">Notify me when available</p>
        <p className="mt-1 text-sm text-text-subtle">
          Enter your email and we'll let you know when this variant returns.
        </p>
      </div>
      <fetcher.Form
        method="POST"
        action={action}
        encType="multipart/form-data"
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={() => {
          setMessage("");
          setError("");
        }}
      >
        <input type="hidden" name="variantId" value={variantId ?? ""} />
        <input
          required
          type="email"
          name="email"
          aria-label="Email address"
          placeholder="Email address"
          className="min-h-12 min-w-0 flex-1 rounded-md border border-border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
        />
        <Button
          type="submit"
          className="h-12 shrink-0 px-5 py-0"
          loading={fetcher.state === "submitting"}
          disabled={fetcher.state !== "idle"}
        >
          Notify me
        </Button>
      </fetcher.Form>
      {error || message ? (
        <div className="text-sm" aria-live="polite">
          {error ? <p className="text-red-700">{error}</p> : null}
          {message ? <p>{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
