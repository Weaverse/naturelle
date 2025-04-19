import { Form } from "@remix-run/react";
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { type CSSProperties, forwardRef } from "react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { useMotion } from "~/hooks/use-animation";

interface ContactFormProps extends HydrogenComponentProps {
  backgroundColor: string;
  contentAlignment: string;
  heading: string;
  subHeading: string;
  buttonLabel: string;
  variant:
    | "custom"
    | "outline"
    | "link"
    | "primary"
    | "secondary"
    | "decor"
    | null
    | undefined;
  topPadding: number;
  bottomPadding: number;
}

let ContactForm = forwardRef<HTMLDivElement, ContactFormProps>((props, ref) => {
  const [scope] = useMotion(ref);
  let {
    backgroundColor,
    contentAlignment,
    heading,
    subHeading,
    buttonLabel,
    variant,
    topPadding,
    bottomPadding,
  } = props;
  let sectionStyle: CSSProperties = {
    justifyContent: `${contentAlignment}`,
    backgroundColor: `${backgroundColor}`,
    "--top-padding": `${topPadding}px`,
    "--bottom-padding": `${bottomPadding}px`,
  } as CSSProperties;
  return (
    <div
      ref={scope}
      {...props}
      style={sectionStyle}
      className="flex justify-center px-0 md:px-10"
    >
      <Form
        action="/contact"
        method="POST"
        encType="multipart/form-data"
        navigate={false}
        className="w-80 pt-[var(--top-padding)] pb-[var(--bottom-padding)] text-center"
      >
        <div className="space-y-2 flex flex-col gap-5">
          <label
            htmlFor="contact-us"
            data-motion="fade-up"
            className="text-5xl font-medium !font-heading"
          >
            {heading}
          </label>
          <p data-motion="fade-up" className="font-body font-normal">
            {subHeading}
          </p>
        </div>
        <div className="space-y-2 mt-8 mb-5">
          <Input
            data-motion="fade-up"
            type="text"
            name="name"
            placeholder="Name"
            className="placeholder-foreground-subtle"
          />
          <Input
            data-motion="fade-up"
            type="email"
            name="email"
            placeholder="Email"
            className="placeholder-foreground-subtle"
          />
          <Input
            data-motion="fade-up"
            type="text"
            name="subject"
            placeholder="Subject"
            className="placeholder-foreground-subtle"
          />
          <textarea
            data-motion="fade-up"
            className="resize-none w-full p-2.5 border-2 border-bar-subtle rounded focus-visible:outline-none focus-visible:border-bar hover:border-bar placeholder-foreground-subtle"
            rows={4}
            name="message"
            placeholder="Message"
          />
        </div>
        {buttonLabel && (
          <Button data-motion="fade-up" type="submit" variant={variant}>
            {buttonLabel}
          </Button>
        )}
      </Form>
    </div>
  );
});

export default ContactForm;

export let schema: HydrogenComponentSchema = {
  type: "contact-us",
  title: "Contact us",
  limit: 1,
  enabledOn: {
    pages: ["INDEX"],
  },
  inspector: [
    {
      group: "Contact form",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background color",
          defaultValue: "#F8F8F0",
        },
        {
          type: "toggle-group",
          label: "Content alignment",
          name: "contentAlignment",
          configs: {
            options: [
              { label: "Left", value: "flex-start" },
              { label: "Center", value: "center" },
              { label: "Right", value: "flex-end" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Contact us",
        },
        {
          type: "text",
          name: "subHeading",
          label: "Subheading",
          defaultValue: "Let us know if you have any question",
        },
        {
          type: "text",
          name: "buttonLabel",
          label: "Button label",
          defaultValue: "Send",
        },
        {
          type: "select",
          name: "variant",
          label: "Button style",
          defaultValue: "outline",
          configs: {
            options: [
              { label: "Outline", value: "outline" },
              { label: "Secondary", value: "secondary" },
              { label: "Primary", value: "primary" },
            ],
          },
        },
        {
          type: "range",
          name: "topPadding",
          label: "Top padding",
          defaultValue: 64,
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "bottomPadding",
          label: "Bottom padding",
          defaultValue: 64,
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
};
