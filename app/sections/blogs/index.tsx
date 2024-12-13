import { cn } from "~/lib/utils";
import { Image } from "@shopify/hydrogen";
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseBlog,
} from "@weaverse/hydrogen";
import { IconImageBlank } from "~/components/Icon";
import { Link } from "~/components/Link";
import { BLOG_QUERY } from "~/data/queries";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { CSSProperties, forwardRef } from "react";
import { useMotion } from "~/hooks/use-animation";

let fontSizeVariants = cva("", {
  variants: {
    mobileSize: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
      "8xl": "text-8xl",
      "9xl": "text-9xl",
    },
    desktopSize: {
      xs: "md:text-xs",
      sm: "md:text-sm",
      base: "md:text-base",
      lg: "md:text-lg",
      xl: "md:text-xl",
      "2xl": "md:text-2xl",
      "3xl": "md:text-3xl",
      "4xl": "md:text-4xl",
      "5xl": "md:text-5xl",
      "6xl": "md:text-6xl",
      "7xl": "md:text-7xl",
      "8xl": "md:text-8xl",
      "9xl": "md:text-9xl",
    },
  },
});

let variants = cva("heading", {
  variants: {
    size: {
      default: "",
      custom: "",
      scale: "text-scale",
    },
    weight: {
      "100": "font-thin",
      "200": "font-extralight",
      "300": "font-light",
      "400": "font-normal",
      "500": "font-medium",
      "600": "font-semibold",
      "700": "font-bold",
      "800": "font-extrabold",
      "900": "font-black",
    },
  },
  defaultVariants: {
    size: "default",
    weight: "400",
  },
});

type BlogData = {
  blogs: WeaverseBlog;
  backgroundColor: string;
  articlePerRow: number;
  gapRow: number;
  showSeperator: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  minSize?: number;
  maxSize?: number;
};

export interface BlogProps
  extends HydrogenComponentProps<Awaited<ReturnType<typeof loader>>>,
    BlogData,
    VariantProps<typeof variants>,
    VariantProps<typeof fontSizeVariants> {}

let articlesPerRowClasses: { [item: number]: string } = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const Blogs = forwardRef<HTMLElement, BlogProps>((props, ref) => {
  const [scope] = useMotion(ref);
  let {
    blogs,
    backgroundColor,
    articlePerRow,
    gapRow,
    showSeperator,
    as: Tag = "h4",
    size,
    mobileSize,
    desktopSize,
    weight,
    minSize,
    maxSize,
    loaderData,
    children,
    ...rest
  } = props;

  const calculateColor = (hex: string) =>
    `#${[...Array(3)]
      .map((_, i) =>
        Math.max(
          0,
          parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) - [19, 18, 28][i]
        )
          .toString(16)
          .padStart(2, "0")
      )
      .join("")}`;

  let sectionStyle: CSSProperties = {
    "--background-color": backgroundColor,
    "--calculate-color": calculateColor(backgroundColor),
    "--min-size-px": `${minSize}px`,
    "--min-size": minSize,
    "--max-size": maxSize,
    "--gap-row": `${gapRow}px`,
  } as CSSProperties;

  const defaultArticles = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    title: "Trendy items for this Winter Fall 2025 season",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: null,
    handle: null,
  }));

  const res = loaderData?.blog?.articles.nodes ?? defaultArticles;

  return (
    <section
      ref={scope}
      {...rest}
      className="flex h-full w-full justify-center bg-[var(--background-color)]"
      style={sectionStyle}
    >
      <div className="container flex flex-col gap-6 px-4 py-12 sm:px-6 sm:py-20">
        {children}
        <div
          className={clsx(
            "flex flex-col gap-[var(--gap-row)] sm:grid sm:gap-0 sm:justify-self-center sm:gap-y-[var(--gap-row)]",
            articlesPerRowClasses[Math.min(articlePerRow, res?.length || 1)]
          )}
        >
          {res?.map((idx, i) => (
            <Link
              key={i}
              to={idx.handle ? `/blogs/${blogs.handle}/${idx.handle}` : "#"}
              data-motion="slide-in"
              className={"group"}
            >
              <div
                key={idx.id}
                className="flex w-full h-full cursor-pointer flex-col items-center gap-4 rounded p-0 transition-colors duration-500 group-hover:bg-[var(--calculate-color)] sm:p-6"
              >
                {idx.image ? (
                  <Image
                    data={idx.image}
                    sizes="auto"
                    className="!aspect-square !w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-[var(--calculate-color)]">
                    <IconImageBlank
                      viewBox="0 0 526 526"
                      className="h-full w-full opacity-80"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <Tag
                    className={cn(
                      size === "custom" &&
                        fontSizeVariants({ mobileSize, desktopSize }),
                      variants({ size, weight })
                    )}
                  >
                    {idx.title}
                  </Tag>
                  {showSeperator && (
                    <div className="w-full border-b border-border-subtle"></div>
                  )}
                  <p className="line-clamp-3">{idx.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Blogs;

export let loader = async (args: ComponentLoaderArgs<BlogData>) => {
  let { weaverse, data } = args;
  let { storefront, request } = weaverse;
  if (data.blogs) {
    const res = await storefront.query(BLOG_QUERY, {
      variables: {
        blogHandle: data.blogs.handle,
      },
    });
    return res;
  }
};

export const schema: HydrogenComponentSchema = {
  type: "blogs",
  title: "Blogs",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: [
    {
      group: "Blog",
      inputs: [
        {
          type: "blog",
          name: "blogs",
          label: "Blog",
        },
        {
          type: "color",
          label: "Background color",
          name: "backgroundColor",
          defaultValue: "#F8F8F0",
        },
        {
          type: "range",
          name: "articlePerRow",
          label: "Articles per row",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: "range",
          label: "Spacing between rows",
          name: "gapRow",
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "px",
          },
          defaultValue: 20,
        },
        {
          type: "switch",
          name: "showSeperator",
          label: "Seperator",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Heading title (optional)",
      inputs: [
        {
          type: "select",
          name: "as",
          label: "HTML tag",
          configs: {
            options: [
              { value: "h1", label: "<h1> (Heading 1)" },
              { value: "h2", label: "<h2> (Heading 2)" },
              { value: "h3", label: "<h3> (Heading 3)" },
              { value: "h4", label: "<h4> (Heading 4)" },
              { value: "h5", label: "<h5> (Heading 5)" },
              { value: "h6", label: "<h6> (Heading 6)" },
            ],
          },
          defaultValue: "h4",
        },
        {
          type: "select",
          name: "size",
          label: "Text size",
          configs: {
            options: [
              { value: "default", label: "Default" },
              { value: "scale", label: "Auto scale" },
              { value: "custom", label: "Custom" },
            ],
          },
          defaultValue: "default",
        },
        {
          type: "range",
          name: "minSize",
          label: "Minimum scale size",
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
          defaultValue: 16,
          condition: "size.eq.scale",
        },
        {
          type: "range",
          name: "maxSize",
          label: "Maximum scale size",
          configs: {
            min: 40,
            max: 96,
            step: 1,
            unit: "px",
          },
          defaultValue: 64,
          condition: "size.eq.scale",
          helpText:
            'See how scale text works <a href="https://css-tricks.com/snippets/css/fluid-typography/" target="_blank" rel="noreferrer">here</a>.',
        },
        {
          type: "select",
          name: "mobileSize",
          label: "Mobile text size",
          condition: "size.eq.custom",
          configs: {
            options: [
              { value: "xs", label: "Extra small (text-xs)" },
              { value: "sm", label: "Small (text-sm)" },
              { value: "base", label: "Base (text-base)" },
              { value: "lg", label: "Large (text-lg)" },
              { value: "xl", label: "Extra large (text-xl)" },
              { value: "2xl", label: "2x large (text-2xl)" },
              { value: "3xl", label: "3x large (text-3xl)" },
              { value: "4xl", label: "4x large (text-4xl)" },
              { value: "5xl", label: "5x large (text-5xl)" },
              { value: "6xl", label: "6x large (text-6xl)" },
              { value: "7xl", label: "7x large (text-7xl)" },
              { value: "8xl", label: "8x large (text-8xl)" },
              { value: "9xl", label: "9x large (text-9xl)" },
            ],
          },
          defaultValue: "3xl",
        },
        {
          type: "select",
          name: "desktopSize",
          label: "Desktop text size",
          condition: "size.eq.custom",
          configs: {
            options: [
              { value: "xs", label: "Extra small (text-xs)" },
              { value: "sm", label: "Small (text-sm)" },
              { value: "base", label: "Base (text-base)" },
              { value: "lg", label: "Large (text-lg)" },
              { value: "xl", label: "Extra large (text-xl)" },
              { value: "2xl", label: "2x large (text-2xl)" },
              { value: "3xl", label: "3x large (text-3xl)" },
              { value: "4xl", label: "4x large (text-4xl)" },
              { value: "5xl", label: "5x large (text-5xl)" },
              { value: "6xl", label: "6x large (text-6xl)" },
              { value: "7xl", label: "7x large (text-7xl)" },
              { value: "8xl", label: "8x large (text-8xl)" },
              { value: "9xl", label: "9x large (text-9xl)" },
            ],
          },
          defaultValue: "5xl",
        },
        {
          type: "select",
          name: "weight",
          label: "Weight",
          configs: {
            options: [
              { value: "100", label: "100 - Thin" },
              { value: "200", label: "200 - Extra Light" },
              { value: "300", label: "300 - Light" },
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semi Bold" },
              { value: "700", label: "700 - Bold" },
              { value: "800", label: "800 - Extra Bold" },
              { value: "900", label: "900 - Black" },
            ],
          },
          defaultValue: "400",
        },
      ],
    },
  ],
  childTypes: ["heading"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Blogs",
      },
    ],
  },
};
