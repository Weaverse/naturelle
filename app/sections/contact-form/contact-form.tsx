import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  useTranslation,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import { type CSSProperties, type RefObject, useState } from "react";
import { useFetcher } from "react-router";
import { Button, buttonVariants } from "~/components/button";
import Heading from "~/components/heading";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { usePrefixPathWithLocale } from "~/utils/locale";

interface ContactFormProps extends HydrogenComponentProps {
  backgroundColor?: string;
  contactImage?: WeaverseImage | string;
  showImage?: boolean;
  imageEyebrow: string;
  imageHeading: string;
  imageButtonLabel: string;
  heading: string;
  subHeading: string;
  buttonLabel: string;
  verticalPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  contentAlignment?: string;
  variant?: string;
}

function hasConfiguredImage(image?: WeaverseImage | string) {
  const imageUrl =
    typeof image === "string" ? image.trim() : image?.url?.trim();
  return Boolean(imageUrl && imageUrl !== IMAGES_PLACEHOLDERS.image);
}

const fieldClassName =
  "w-full rounded-xl border border-border-subtle bg-background px-3 py-3.5 tracking-[-0.16px] text-text outline-none placeholder:text-text-subtle transition-colors hover:border-border focus-visible:border-border";

const labelClassName =
  "text-sm leading-normal font-semibold tracking-[0.7px] text-text uppercase";

let ContactForm = ({
  ref,
  ...props
}: ContactFormProps & { ref?: RefObject<HTMLElement | null> }) => {
  const contactAction = usePrefixPathWithLocale("/contact");
  const fetcher = useFetcher<{ ok: boolean }>();
  const { t } = useTranslation();
  const [scope] = useAnimation(ref);
  const isDesignMode = useWeaverseStudioCheck();
  let {
    backgroundColor,
    contactImage,
    showImage,
    imageEyebrow,
    imageHeading,
    imageButtonLabel,
    heading,
    subHeading,
    buttonLabel,
    verticalPadding,
    topPadding,
    bottomPadding,
    contentAlignment: _contentAlignment,
    variant: _variant,
    ...rest
  } = props;
  const isSubmitting = fetcher.state === "submitting";
  const resolvedTopPadding = verticalPadding ?? topPadding ?? 64;
  const resolvedBottomPadding = verticalPadding ?? bottomPadding ?? 64;
  const configuredImageUrl =
    typeof contactImage === "string"
      ? contactImage.trim()
      : contactImage?.url?.trim();
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const imageLoadFailed =
    Boolean(configuredImageUrl) && failedImageUrl === configuredImageUrl;
  const configuredImage =
    typeof contactImage === "string"
      ? { url: contactImage, altText: imageHeading || t("contact.imageAlt") }
      : contactImage;
  const imageData =
    showImage !== false
      ? hasConfiguredImage(contactImage) && !imageLoadFailed
        ? configuredImage
        : isDesignMode
          ? {
              url: IMAGES_PLACEHOLDERS.image,
              altText: t("contact.imagePlaceholderAlt"),
            }
          : undefined
      : undefined;
  const hasImage = Boolean(imageData?.url);
  let sectionStyle: CSSProperties = {
    backgroundColor: backgroundColor || "var(--color-background)",
    "--contact-top-padding": `${resolvedTopPadding}px`,
    "--contact-bottom-padding": `${resolvedBottomPadding}px`,
  } as CSSProperties;

  return (
    <section
      ref={scope}
      {...rest}
      style={sectionStyle}
      className="w-full px-5 pt-[var(--contact-top-padding)] pb-[var(--contact-bottom-padding)] md:px-6 lg:px-10"
    >
      <div
        className={clsx(
          "mx-auto w-full max-w-page",
          hasImage
            ? "grid items-start gap-12 desktop:grid-cols-2"
            : "flex justify-center",
        )}
      >
        {hasImage && imageData && (
          <div
            data-motion="fade-up"
            className="relative order-2 min-h-[460px] overflow-hidden rounded-2xl desktop:order-1 desktop:h-[586px]"
          >
            <Image
              data={imageData}
              className="absolute inset-0"
              imageClassName="rounded-none object-cover"
              sizes="(min-width: 1440px) 656px, (min-width: 960px) calc(50vw - 64px), 100vw"
              onError={() => {
                if (configuredImageUrl) {
                  setFailedImageUrl(configuredImageUrl);
                }
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center text-text-inverse">
              {(imageEyebrow || imageHeading) && (
                <div className="flex w-full flex-col items-center gap-1 font-heading">
                  {imageEyebrow && (
                    <p className="text-xl leading-[150%] tracking-[-0.2px]">
                      {imageEyebrow}
                    </p>
                  )}
                  {imageHeading && (
                    <Heading
                      as="h3"
                      content={imageHeading}
                      alignment="center"
                    />
                  )}
                </div>
              )}
              {imageButtonLabel && (
                <a
                  href="#contact-us-form"
                  className={buttonVariants({
                    variant: "secondary",
                    shape: "default",
                    className:
                      "h-auto min-h-13.5 rounded-xl py-3.5 font-semibold tracking-[-0.16px]",
                  })}
                >
                  {imageButtonLabel}
                </a>
              )}
            </div>
          </div>
        )}

        <div
          className={clsx(
            "order-1 flex w-full flex-col items-center gap-12 desktop:order-2",
            !hasImage && "max-w-[600px]",
          )}
        >
          {(heading || subHeading) && (
            <div
              data-motion="fade-up"
              className="flex w-full flex-col items-center gap-4 text-center"
            >
              {heading && (
                <Heading
                  as="h3"
                  content={heading}
                  alignment="center"
                  className="text-text"
                />
              )}
              {subHeading && (
                <p className="max-w-[520px] text-lg leading-[160%] tracking-[-0.18px] text-text-subtle">
                  {subHeading}
                </p>
              )}
            </div>
          )}

          <fetcher.Form
            id="contact-us-form"
            action={contactAction}
            method="POST"
            className="flex w-full max-w-[480px] flex-col items-center gap-6"
          >
            <div className="flex w-full flex-col gap-4">
              <div data-motion="fade-up" className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="contact-email">
                  {t("contact.email")} *
                </label>
                <input
                  id="contact-email"
                  className={fieldClassName}
                  type="email"
                  name="email"
                  placeholder={t("contact.emailPlaceholder")}
                  autoComplete="email"
                  required
                />
              </div>

              <div data-motion="fade-up" className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="contact-name">
                  {t("contact.name")} *
                </label>
                <input
                  id="contact-name"
                  className={fieldClassName}
                  type="text"
                  name="name"
                  placeholder={t("contact.namePlaceholder")}
                  autoComplete="name"
                  required
                />
              </div>

              <div data-motion="fade-up" className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="contact-message">
                  {t("contact.message")} *
                </label>
                <textarea
                  id="contact-message"
                  className={clsx(fieldClassName, "min-h-28 resize-y")}
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  required
                />
              </div>
            </div>

            {buttonLabel && (
              <Button
                data-motion="fade-up"
                className="h-auto min-h-13.5 w-full rounded-xl py-3.5 font-semibold tracking-[-0.16px]"
                loading={isSubmitting}
                type="submit"
                variant="primary"
              >
                {buttonLabel}
              </Button>
            )}
            {fetcher.state === "idle" && fetcher.data && (
              <p role="status" className="text-center text-text">
                {t(
                  fetcher.data.ok
                    ? "contact.submitSuccess"
                    : "contact.submitError",
                )}
              </p>
            )}
          </fetcher.Form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

export const schema = createSchema({
  type: "contact-us",
  title: "Contact Us",
  limit: 1,
  enabledOn: {
    pages: ["INDEX", "PAGE"],
  },
  settings: [
    {
      group: "Image",
      inputs: [
        {
          type: "switch",
          name: "showImage",
          label: "Show image",
          defaultValue: true,
        },
        {
          type: "image",
          name: "contactImage",
          label: "Image",
          condition: (data: ContactFormProps) => data.showImage !== false,
        },
        {
          type: "text",
          name: "imageEyebrow",
          label: "Eyebrow",
          defaultValue: "Customer Service",
          condition: (data: ContactFormProps) =>
            data.showImage !== false && hasConfiguredImage(data.contactImage),
        },
        {
          type: "text",
          name: "imageHeading",
          label: "Heading",
          defaultValue: "How Can We Help?",
          condition: (data: ContactFormProps) =>
            data.showImage !== false && hasConfiguredImage(data.contactImage),
        },
        {
          type: "text",
          name: "imageButtonLabel",
          label: "Button label",
          defaultValue: "Contact Us",
          condition: (data: ContactFormProps) =>
            data.showImage !== false && hasConfiguredImage(data.contactImage),
        },
      ],
    },
    {
      group: "Contact form",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Contact Us",
        },
        {
          type: "text",
          name: "subHeading",
          label: "Subheading",
          defaultValue:
            "Let us know if you have any questions. We're here to help.",
        },
        {
          type: "text",
          name: "buttonLabel",
          label: "Button label",
          defaultValue: "Send Message",
        },
      ],
    },
    {
      group: "Section",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background color",
          defaultValue: "#D7D6E9",
        },
        {
          type: "range",
          name: "verticalPadding",
          label: "Vertical padding",
          configs: {
            min: 0,
            max: 160,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    showImage: true,
    imageEyebrow: "Customer Service",
    imageHeading: "How Can We Help?",
    imageButtonLabel: "Contact Us",
    heading: "Contact Us",
    subHeading: "Let us know if you have any questions. We're here to help.",
    buttonLabel: "Send Message",
    backgroundColor: "#D7D6E9",
    verticalPadding: 80,
  },
});
