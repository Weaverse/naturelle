import type { Image as ShopifyImage } from "@shopify/hydrogen/storefront-api-types";
import {
	type ComponentLoaderArgs,
	createSchema,
	IMAGES_PLACEHOLDERS,
	type WeaverseCollection,
} from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { IconCaret } from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

interface CollectionsData {
	collections?: WeaverseCollection[];
	heading?: string;
	columns?: "3" | "4";
	cardGap?: number;
	imageAspectRatio?: "1/1" | "4/3" | "3/4";
	showArrow?: boolean;
	showCount?: boolean;
}

interface CollectionNode {
	id: string;
	title: string;
	handle: string;
	image: Partial<ShopifyImage> | null;
}

interface CollectionsProps
	extends SectionProps<CollectionsLoaderData>,
		CollectionsData {}

const COLLECTIONS_QUERY = `#graphql
  query collectionsByIds(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Collection {
        id
        title
        handle
        image {
          id
          altText
          width
          height
          url
        }
      }
    }
    allCollections: collections(first: 1) {
      totalCount
    }
  }
` as const;

export const loader = async ({
	data,
	weaverse,
}: ComponentLoaderArgs<CollectionsData>) => {
	const ids =
		data.collections?.map(
			(collection) => `gid://shopify/Collection/${collection.id}`,
		) ?? [];

	const { country, language } = weaverse.storefront.i18n;
	const { nodes, allCollections } = await weaverse.storefront.query<{
		nodes: Array<CollectionNode | null>;
		allCollections: { totalCount: number };
	}>(COLLECTIONS_QUERY, {
		variables: { country, language, ids },
	});

	return {
		collections: nodes.filter((node): node is CollectionNode => Boolean(node)),
		totalCount: Number(allCollections.totalCount),
	};
};

export type CollectionsLoaderData = Awaited<ReturnType<typeof loader>>;

const PLACEHOLDER_COLLECTION: CollectionNode = {
	id: "gid://shopify/Collection/placeholder",
	title: "Collection title",
	handle: "all",
	image: {
		id: "gid://shopify/CollectionImage/placeholder",
		altText: "Collection image",
		width: 1000,
		height: 1000,
		url: IMAGES_PLACEHOLDERS.collection_1,
	},
};

export default function Collections({
	ref,
	...props
}: CollectionsProps & { ref?: RefObject<HTMLElement | null> }) {
	const {
		loaderData,
		heading,
		columns,
		cardGap,
		imageAspectRatio,
		showArrow,
		showCount,
		children,
		containerClassName,
		...rest
	} = props;
	const collections = loaderData?.collections.length
		? loaderData.collections
		: Array.from({ length: Number(columns) || 4 }, (_, index) => ({
				...PLACEHOLDER_COLLECTION,
				id: `${PLACEHOLDER_COLLECTION.id}-${index}`,
			}));
	const sectionStyle = {
		"--collections-gap": `${cardGap ?? 24}px`,
	} as CSSProperties;

	return (
		<Section
			ref={ref}
			{...rest}
			style={sectionStyle}
			containerClassName={cn(
				"w-full px-5 lg:px-10 lg:py-20 bg-(--color-background-basic)",
				containerClassName,
			)}
		>
			<div className="mx-auto flex w-full max-w-lg flex-col items-start gap-16 self-stretch">
				<div className="flex w-full flex-col items-center justify-center">
					{heading && (
						<h3
							className="text-center font-normal text-text-primary"
							data-motion="fade-up"
						>
							{heading}
						</h3>
					)}
				</div>

				<div
					className={cn(
						"grid w-full grid-cols-2",
						columns === "3" ? "lg:grid-cols-3" : "lg:grid-cols-4",
					)}
					style={{ gap: "var(--collections-gap)" }}
				>
					{collections.map((collection, index) => (
						<Link
							key={`${collection.id}-${index}`}
							to={`/collections/${collection.handle}`}
							aria-label={`View ${collection.title} collection`}
							className={cn(
								"group block min-w-0 w-full overflow-hidden",
								"rounded-(--border-radius-xl,16px)",
								"bg-background-subtle-1 text-text-primary",
							)}
							data-motion="fade-up"
						>
							<div
								className={cn(
									"flex flex-1 flex-col items-center justify-center overflow-hidden",
									"bg-background-subtle-1",
								)}
								style={{ aspectRatio: imageAspectRatio ?? "1/1" }}
							>
								{collection.image && (
									<Image
										data={collection.image}
										sizes={
											columns === "3"
												? "(min-width: 90em) 33vw, 50vw"
												: "(min-width: 90em) 25vw, 50vw"
										}
										className="transition-transform duration-500 group-hover:scale-105"
									/>
								)}
							</div>

							<div className="flex min-h-20 items-center justify-between gap-2 px-4 py-4 lg:gap-4 lg:px-6">
								<p className="min-w-0 truncate text-center font-heading text-xl font-normal leading-normal tracking-[-0.01em] text-text-primary">
									{collection.title}
								</p>
								{showArrow && (
									<span className="flex size-6 shrink-0 items-center justify-center transition-transform group-hover:translate-x-1">
										<IconCaret direction="right" aria-hidden="true" />
									</span>
								)}
							</div>
						</Link>
					))}
				</div>
			</div>

			{showCount && collections.length > 0 && (
				<p className="text-center text-sm font-medium text-text-subtle">
					<span className="lg:hidden">
						{Math.min(2, collections.length)}
					</span>
					<span className="hidden lg:inline">
						{Math.min(Number(columns) || 4, collections.length)}
					</span>
					<span aria-hidden="true"> / </span>
					{loaderData?.totalCount ?? collections.length}
				</p>
			)}
			{children}
		</Section>
	);
}

export const schema = createSchema({
	type: "collections",
	title: "Collections",
	settings: [
		{
			group: "Content",
			inputs: [
				{
					type: "text",
					name: "heading",
					label: "Heading",
					defaultValue: "Trending now",
				},
				{
					type: "collection-list",
					name: "collections",
					label: "Collections",
					helpText: "Select and reorder the collections shown in this section.",
				},
				{
					type: "switch",
					name: "showArrow",
					label: "Show card arrow",
					defaultValue: true,
				},
				{
					type: "switch",
					name: "showCount",
					label: "Show collection count",
					defaultValue: true,
					helpText:
						"Shows visible collections over the total, for example 4 / 8.",
				},
			],
		},
		{
			group: "Collection cards",
			inputs: [
				{
					type: "toggle-group",
					name: "columns",
					label: "Columns on desktop",
					configs: {
						options: [
							{ value: "3", label: "3" },
							{ value: "4", label: "4" },
						],
					},
					defaultValue: "4",
				},
				{
					type: "select",
					name: "imageAspectRatio",
					label: "Image aspect ratio",
					configs: {
						options: [
							{ value: "1/1", label: "Square (1/1)" },
							{ value: "4/3", label: "Landscape (4/3)" },
							{ value: "3/4", label: "Portrait (3/4)" },
						],
					},
					defaultValue: "1/1",
				},
				{
					type: "range",
					name: "cardGap",
					label: "Cards spacing",
					configs: {
						min: 8,
						max: 40,
						step: 4,
						unit: "px",
					},
					defaultValue: 24,
				},
			],
		},
		{
			group: "Layout",
			inputs: layoutInputs,
		},
	],
	presets: {
		heading: "Trending now",
		columns: "4",
		cardGap: 24,
		imageAspectRatio: "1/1",
		showArrow: true,
		showCount: true,
		width: "full",
		verticalPadding: "medium",
		gap: 60,
	},
});
