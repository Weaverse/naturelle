import { Disclosure } from "@headlessui/react";
import { useTranslation } from "@weaverse/hydrogen";
import { IconPlusLinkFooter } from "~/components/icon";
import { Link } from "~/components/link";
import { Text } from "~/components/text";

export function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  const { t } = useTranslation();
  return (
    <Disclosure as="div" className="grid w-full gap-2" defaultOpen={true}>
      {({ open }) => (
        <div className="contents">
          <Disclosure.Button className="text-left">
            <div className="flex justify-between items-center bg-[#e0e5d6] py-3 px-4">
              <Text as="span" className="font-normal text-base uppercase">
                {title}
              </Text>
              <IconPlusLinkFooter
                open={open}
                className={`transition-transform h-5 w-5 duration-300 ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel
            className={
              "pt-4 lg:px-6 px-1.5 flex flex-col justify-center items-center gap-6"
            }
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <p className="font-semibold text-base w-full lg:w-1/3">{title}</p>
              <p
                className="lg:w-2/3 w-full"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            {learnMore && (
              <div>
                <Link
                  className="pb-px border-b border-border/30 text-body/50"
                  to={learnMore}
                >
                  {t("product.learnMore")}
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
