import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import { type CSSProperties, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { useRootLoaderData } from "~/root";
import { usePrefixPathWithLocale } from "~/utils/locale";

type VariantStyle =
  | "primary"
  | "outline"
  | "secondary"
  | "link"
  | "decor"
  | null
  | undefined;
interface InputEmailProps extends HydrogenComponentProps {
  placeholder: string;
  buttonLabel: string;
  buttonStyle: VariantStyle;
}

type NewsletterResponse = {
  ok?: boolean;
  error?: string;
};

const NewsletterInput = ({
  ref,
  ...props
}: InputEmailProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { placeholder, buttonLabel, buttonStyle, ...rest } = props;
  let fetcher = useFetcher<NewsletterResponse>();
  const rootData = useRootLoaderData();
  const isStudio = useWeaverseStudioCheck();
  const klaviyoConfigured = Boolean(rootData?.integrations?.klaviyoNewsletter);
  const action = usePrefixPathWithLocale("/api/klaviyo");
  const emailInputRef = useRef<HTMLInputElement>(null);
  let isError = fetcher.state === "idle" && Boolean(fetcher.data?.error);
  let isSuccess = fetcher.state === "idle" && Boolean(fetcher.data?.ok);
  useEffect(() => {
    if (isSuccess && emailInputRef.current) {
      emailInputRef.current.value = "";
    }
  }, [isSuccess]);
  let alertMessage = "";
  let alertMessageClass = "";
  if (isError) {
    alertMessage =
      fetcher.data?.error || "Something went wrong. Please try again.";
    alertMessageClass = "text-red-700";
  } else if (isSuccess) {
    alertMessage = "Thanks! Your subscription request has been received.";
    alertMessageClass = "text-green-700";
  }
  let style: CSSProperties = {
    "--max-width-content": "600px",
  } as CSSProperties;

  if (!klaviyoConfigured) {
    if (isStudio) {
      return (
        <div
          ref={ref}
          {...rest}
          className="rounded-md border border-dashed border-border p-4 text-sm text-text-subtle"
        >
          Configure Klaviyo private token and newsletter list ID
        </div>
      );
    }
    return null;
  }

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="fade-up"
      style={style}
      className="flex h-full flex-col items-center justify-center gap-5 text-center"
    >
      <fetcher.Form
        method="POST"
        action={action}
        className="flex sm:w-[var(--max-width-content)] w-full items-center justify-center gap-2"
      >
        <Input
          className="w-2/3 bg-transparent"
          type="email"
          name="email"
          placeholder={placeholder}
          ref={emailInputRef}
          required
        />
        <Button
          loading={fetcher.state === "submitting"}
          variant={buttonStyle}
          type="submit"
        >
          {buttonLabel}
        </Button>
      </fetcher.Form>
      {alertMessage && (
        <p
          aria-live="polite"
          className={clsx("!mt-1 text-xs", alertMessageClass)}
        >
          {alertMessage}
        </p>
      )}
    </div>
  );
};

export default NewsletterInput;

export const schema = createSchema({
  type: "newsletter-input",
  title: "Input",
  limit: 1,
  settings: [
    {
      group: "Newsletter",
      inputs: [
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder",
          defaultValue: "Enter your email",
        },
        {
          type: "text",
          name: "buttonLabel",
          label: "Button label",
          defaultValue: "Send",
        },
        {
          type: "toggle-group",
          label: "Button style",
          name: "buttonStyle",
          configs: {
            options: [
              { label: "Primary", value: "primary" },
              { label: "Outline", value: "outline" },
              { label: "Secondary", value: "secondary" },
            ],
          },
          defaultValue: "primary",
        },
      ],
    },
  ],
});
