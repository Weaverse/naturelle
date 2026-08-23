import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import {
	type CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	IconAnnouncementChevron,
	IconAnnouncementSparkle,
	IconAnnouncementStar,
	IconAnnouncementTicket,
	IconAnnouncementTree,
} from "~/components/icon";

type AnnouncementSegment = {
	id: string;
	text: string;
	icon: "sparkle" | "ticket" | "tree";
};

const ICONS: AnnouncementSegment["icon"][] = ["sparkle", "ticket", "tree"];

function parseSegments(content: string | undefined): AnnouncementSegment[] {
	const lines = (content ?? "")
		.split(/\n|\|/)
		.map((line) => line.trim())
		.filter(Boolean);

	if (lines.length === 0) {
		return [
			{
				id: "fallback",
				text: "FREE SHIPPING OVER $100",
				icon: "sparkle",
			},
		];
	}

	return lines.map((text, index) => ({
		id: `${index}-${text.slice(0, 16)}`,
		text,
		icon: ICONS[index % ICONS.length],
	}));
}

function SegmentIcon({
	icon,
	className,
}: {
	icon: AnnouncementSegment["icon"];
	className?: string;
}) {
	if (icon === "ticket") {
		return <IconAnnouncementTicket className={className} />;
	}
	if (icon === "tree") {
		return <IconAnnouncementTree className={className} />;
	}
	return <IconAnnouncementSparkle className={className} />;
}

function AnnouncementItem({
	segment,
	index,
	className,
}: {
	segment: AnnouncementSegment;
	index: number;
	className?: string;
}) {
	return (
		<span className={clsx("flex items-center whitespace-nowrap", className)}>
			<SegmentIcon
				icon={segment.icon}
				className={clsx(
					"shrink-0 text-[#DEDEDE]",
					segment.icon === "sparkle" && "size-5",
					segment.icon === "ticket" && "h-4 w-5",
					segment.icon === "tree" && "size-5",
				)}
			/>

			<span
				className={clsx(
					"font-sans text-xs leading-normal tracking-[0.96px] text-(--color-topbar-text) uppercase",
					index === 0 && "font-semibold",
					index === 1 && "font-normal",
					index === 2 && "font-medium",
				)}
			>
				{segment.text}
			</span>
			{index === 1 && (
				<IconAnnouncementStar className="size-2.5 shrink-0 text-(--color-topbar-text) opacity-60" />
			)}
			{index === 2 && (
				<span className="font-sans text-xs font-bold leading-normal tracking-[0.96px] text-[#F5EDEA] uppercase">
					→ JOIN NOW
				</span>
			)}
		</span>
	);
}

export function ScrollingAnnouncement() {
	const settings = useThemeSettings();
	const {
		content,
		textSize,
		announcementBarHeight,
		speed,
		enableScrollingText,
	} = settings;

	const segments = useMemo(() => parseSegments(content), [content]);
	const [activeIndex, setActiveIndex] = useState(0);

	const goPrev = useCallback(() => {
		setActiveIndex((current) =>
			current === 0 ? segments.length - 1 : current - 1,
		);
	}, [segments.length]);

	const goNext = useCallback(() => {
		setActiveIndex((current) => (current + 1) % segments.length);
	}, [segments.length]);

	useEffect(() => {
		if (!enableScrollingText || segments.length <= 1) return;
		const intervalMs = Math.max(Number(speed) || 9, 2) * 1000;
		const timer = window.setInterval(goNext, intervalMs);
		return () => window.clearInterval(timer);
	}, [enableScrollingText, goNext, segments.length, speed]);

	const visibleSegments = useMemo(() => {
		if (segments.length === 0) return [];
		const count = Math.min(3, segments.length);
		return Array.from({ length: count }, (_, offset) => {
			return segments[(activeIndex + offset) % segments.length];
		});
	}, [activeIndex, segments]);

	const style = {
		"--height-bar": `${announcementBarHeight || 48}px`,
		fontSize: `${textSize || 12}px`,
	} as CSSProperties;

	const canNavigate = segments.length > 1;

	return (
		<div
			id="announcement-bar"
			style={style}
			className={clsx(
				"relative z-40 flex h-(--height-bar) items-center justify-center overflow-hidden",
				"bg-(--color-topbar-bg) text-(--color-topbar-text)",
				"border-b border-(--color-topbar-border)",
			)}
		>
			<div className="mx-auto flex w-97.5 md:w-208.5 lg:w-370 px-8 py-2.5 items-center justify-center gap-6 shrink-0 border-b-[#443E40]">
				<button
					type="button"
					onClick={goPrev}
					disabled={!canNavigate}
					aria-label="Previous announcement"
					className={clsx(
						"flex h-full w-2 shrink-0 items-center justify-center",
						"text-(--color-topbar-text)/80 transition-opacity",
						canNavigate
							? "cursor-pointer hover:opacity-100"
							: "cursor-default opacity-40",
					)}
				>
					<IconAnnouncementChevron
						direction="left"
						className="h-3 w-2 shrink-0"
					/>
				</button>

				{visibleSegments.map((segment, index) => (
					<AnnouncementItem
						key={`${segment.id}-${index}`}
						segment={segment}
						index={index}
						className={clsx(
							"min-w-0 overflow-hidden font-body leading-none",
							index === 0 && "flex-[1_0_0] gap-2",
							index === 1 && "hidden flex-[1_0_0] gap-2 md:flex",
							index === 2 && "hidden gap-1.5 lg:flex",
						)}
					/>
				))}

				<button
					type="button"
					onClick={goNext}
					disabled={!canNavigate}
					aria-label="Next announcement"
					className={clsx(
						"flex h-full w-2 shrink-0 items-center justify-center",
						"text-(--color-topbar-text)/80 transition-opacity",
						canNavigate
							? "cursor-pointer hover:opacity-100"
							: "cursor-default opacity-40",
					)}
				>
					<IconAnnouncementChevron
						direction="right"
						className="h-3 w-2 shrink-0"
					/>
				</button>
			</div>
		</div>
	);
}
