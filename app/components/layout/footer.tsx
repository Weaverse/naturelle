import { Disclosure } from "@headlessui/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import type React from "react";
import { NavLink, useFetcher } from "react-router";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { useShopMenu } from "~/hooks/use-menu-shop";
import {
	type EnhancedMenu,
	getMaxDepth,
	type SingleMenuItem,
} from "~/types/menu";
import { cn } from "~/utils/cn";
import { IconPlusLinkFooter } from "../icon";
import { FooterCountrySelector } from "./country-selector/footer-country-selector";
import { PaymentMethods } from "./footer/payment-methods";
import { PolicyLinks } from "./footer/policy-links";
import { SocialLinks } from "./footer/social-links";
import { TrustBadges } from "./footer/trust-badges";

let variants = cva("", {
	variants: {
		width: {
			full: "w-full h-full",
			stretch: "w-full h-full",
			fixed: "w-full h-full container mx-auto",
		},
		padding: {
			full: "md:pt-10 md:pb-5 lg:px-20 lg:pt-20 lg:pb-10",
			stretch: "md:pt-10 md:pb-5 lg:px-20 lg:pt-20 lg:pb-10",
			fixed: "md:pt-10 md:pb-5 lg:px-20 lg:pt-20 lg:pb-10 mx-auto",
		},
	},
});

export function Footer() {
	let { footerMenu } = useShopMenu();
	let fetcher = useFetcher<any>();
	let isError = fetcher.state === "idle" && fetcher.data?.errors;
	const settings = useThemeSettings();
	let {
		footerWidth,
		footerTextCopyright,
		newsletterTitle,
		newsletterDescription,
		newsletterPlaceholder,
		newsletterButtonText,
		showPaymentMethods,
		showAmazonPay,
		showPayPal,
		showKlarna,
		showGooglePay,
		showApplePay,
		showJCB,
		showAmericanExpress,
		showVisa,
		showMastercard,
		showDiners,
		showDiscover,
		showAlipay,
		tagNameTitle: Tag = "h6",
	} = settings;
	return (
		<footer
			className={cn(
				"footer w-full bg-(--color-footer-bg) text-(--color-footer-text) border-t border-(--color-footer-text)",
			)}
			style={
				{
					"--underline-color": "var(--color-footer-text)",
				} as React.CSSProperties
			}
		>
			{/* Newsletter bannder */}
			<div className="flex w-full items-start justify-center px-6 lg:px-20 py-16 bg-(--color-footer-text)">
				<div className="flex w-full max-w-lg flex-[1_0_0] flex-col items-center gap-10 md:flex-row md:items-start lg:px-20">
					<div className="flex flex-1 flex-col items-start gap-3">
						{newsletterTitle && (
							<Tag className="font-normal text-(--color-footer-bg)">
								{newsletterTitle}
							</Tag>
						)}
						{newsletterDescription && (
							<p className="text-(--color-footer-bg)">
								{newsletterDescription}
							</p>
						)}
					</div>
					<div className="flex flex-1 items-center justify-end self-stretch">
						{newsletterButtonText && (
							<fetcher.Form
								method="POST"
								action="/api/customer"
								className="flex w-full max-w-[497px] items-stretch"
							>
								<Input
									variant="custom"
									className="min-w-0 max-w-90 flex-1 rounded-l-xl rounded-r-none border border-(--color-footer-bg) bg-white/8 px-5 py-3.5 text-(--color-footer-bg) placeholder:text-(--color-footer-bg) placeholder:opacity-70"
									type="email"
									name="email"
									placeholder={newsletterPlaceholder}
									required
								/>

								<Button
									variant="custom"
									loading={fetcher.state === "submitting"}
									type="submit"
									shape="default"
									className="h-auto shrink-0 rounded-l-none rounded-r-xl bg-(--color-footer-bg) px-7 py-3.5 text-(--color-footer-text)"
								>
									{newsletterButtonText}
								</Button>
							</fetcher.Form>
						)}
						{isError && (
							<p className="!mt-1 text-xs text-red-700">
								{fetcher.data.errors[0].message}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 px-4 py-6 md:px-6 md:py-0 lg:contents">
				{/* Main navigation */}
				<div
					className={cn(
						"flex self-stretch flex-col items-center gap-6 md:gap-10 lg:gap-16",
						variants({ width: footerWidth, padding: footerWidth }),
					)}
				>
					<div className="flex flex-col items-center gap-3 self-stretch">
						<h1 className="font-normal leading-none text-(--color-footer-text)">
							NATURÉLLE
						</h1>
						<p className="text-xs font-normal uppercase text-(--color-footer-text)">
							Pure Botanical Alchemy
						</p>
					</div>

					<hr className="w-full border-0 border-t border-[#443E40]/50" />

					<div className="mx-auto w-full max-w-[1440px] self-stretch">
						{footerMenu && <FooterMenu menu={footerMenu} />}
					</div>
				</div>

				{/* Trust badges and payment methods */}
				<div className="w-full flex flex-col md:gap-5 justify-between items-center self-stretch lg:px-20 lg:h-43 lg:py-12">
					<div className="w-full border-t border-[#DEDEDE] opacity-50" />
					<div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:justify-between lg:items-center">
						<TrustBadges />
						<PaymentMethods
							showPaymentMethods={showPaymentMethods}
							showAmazonPay={showAmazonPay}
							showPayPal={showPayPal}
							showKlarna={showKlarna}
							showGooglePay={showGooglePay}
							showApplePay={showApplePay}
							showJCB={showJCB}
							showAmericanExpress={showAmericanExpress}
							showVisa={showVisa}
							showMastercard={showMastercard}
							showDiners={showDiners}
							showDiscover={showDiscover}
							showAlipay={showAlipay}
						/>
					</div>
				</div>

				<div className="w-full gap-8 flex flex-col lg:justify-between items-center md:py-6 lg:pt-8 lg:px-20 lg:pb-12 lg:h-40">
					<div className="hidden md:flex w-full border-t border-[#DEDEDE]/50" />
					<div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-center gap-4 lg:flex-row lg:justify-between lg:items-center">
						<p className="text-sm opacity-70">{footerTextCopyright}</p>
						<PolicyLinks />
						<FooterCountrySelector />
					</div>
				</div>
			</div>
		</footer>
	);
}

function FooterMenu({ menu }: { menu: EnhancedMenu | undefined | null }) {
	let items = menu?.items as unknown as SingleMenuItem[];
	const {
		socialInstagram,
		socialFacebook,
		socialPinterest,
		socialTikTok,
		socialYouTube,
	} = useThemeSettings();
	if (!items) return null;
	return (
		<nav
			className="flex w-full flex-col items-start justify-center md:gap-10 lg:flex-row lg:flex-nowrap"
			role="navigation"
		>
			<div className="flex w-full flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-10 lg:contents">
				{items.map((item, id) => {
					let { title, ...rest } = item;
					let level = getMaxDepth(item);
					let Comp: React.FC<SingleMenuItem>;
					if (level === 2) {
						Comp = MenuLink;
					} else if (level === 1) {
						Comp = HeaderText;
					} else {
						return null;
					}
					return <Comp key={id} {...rest} title={title} />;
				})}
			</div>
			<SocialLinks
				socialInstagram={socialInstagram}
				socialFacebook={socialFacebook}
				socialPinterest={socialPinterest}
				socialTikTok={socialTikTok}
				socialYouTube={socialYouTube}
			/>
		</nav>
	);
}

function MenuLink(props: SingleMenuItem) {
	let { title, items, to } = props;
	return (
		<>
			<div className="hidden grow-0 shrink-0 flex-col items-start gap-5 md:flex md:basis-[calc((100%-5rem)/3)] lg:grow lg:basis-0">
				<h6 className="text-base font-semibold leading-[1.6] tracking-[-0.16px] text-(--color-footer-text)">
					{title}
				</h6>
				<ul className="flex flex-col items-start gap-3">
					{items.map((subItem, ind) => (
						<li key={ind}>
							<NavLink to={subItem.to} prefetch="intent">
								<span className="text-animation text-base font-normal opacity-80">
									{subItem.title}
								</span>
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<div className="block w-full border-b border-foreground/50 pt-2 pb-4 md:hidden">
				<Disclosure>
					{({ open }) => (
						<>
							<Disclosure.Button className="w-full text-left">
								<h6 className="flex justify-between font-body text-[16px] font-semibold leading-[1.6] tracking-[-0.16px] text-(--color-footer-text)">
									{title}
									<span>
										<IconPlusLinkFooter
											open={open}
											className={`trasition-transform h-5 w-5 duration-300 ${
												open ? "rotate-90" : "rotate-0"
											}`}
										/>
									</span>
								</h6>
							</Disclosure.Button>
							<div
								className={`${
									open ? `h-fit max-h-48` : `max-h-0`
								} overflow-hidden transition-all duration-300`}
							>
								<Disclosure.Panel static>
									<ul className="space-y-3 pb-3 pt-2">
										{items.map((subItem, ind) => (
											<li key={ind} className="leading-6">
												<NavLink key={ind} to={subItem.to} prefetch="intent">
													<span className="font-body font-normal">
														{subItem.title}
													</span>
												</NavLink>
											</li>
										))}
									</ul>
								</Disclosure.Panel>
							</div>
						</>
					)}
				</Disclosure>
			</div>
		</>
	);
}

function HeaderText({ title, to }: { title: string; to: string }) {
	return (
		<h6 className="font-body text-[16px] font-semibold leading-[1.6] tracking-[-0.16px] text-(--color-footer-text)">
			{title}
		</h6>
	);
}
