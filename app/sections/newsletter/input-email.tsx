import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import { type CSSProperties, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import { Input } from "~/components/input";

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

const NewsletterInput = ({
  ref,
  ...props
}: InputEmailProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { placeholder, buttonLabel, buttonStyle, ...rest } = props;
  let fetcher = useFetcher<any>();
  const emailInputRef = useRef<HTMLInputElement>(null);
  let isError = fetcher.state === "idle" && fetcher.data?.errors;
  let isSuccess = fetcher.state === "idle" && fetcher.data?.customer;
  let alertMessage = "";
  let alertMessageClass = "";
  if (isError && fetcher.data?.errors) {
    const firstError = fetcher.data?.errors[0];
    alertMessage =
      firstError.code === "TAKEN"
        ? firstError.message
        : "Some things went wrong!";
    alertMessageClass = "text-red-700";
  } else if (isSuccess && fetcher.data?.customer && emailInputRef.current) {
    alertMessage = "Subscribe successfully!";
    emailInputRef.current.value = "";
    alertMessageClass = "text-green-700";
  }
  let style: CSSProperties = {
    "--max-width-content": "600px",
  } as CSSProperties;

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
        action="/api/customer"
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
        <p className={clsx("!mt-1 text-xs", alertMessageClass)}>
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
