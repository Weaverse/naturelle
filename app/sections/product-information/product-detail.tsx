import { Disclosure } from "@headlessui/react";
import { IconPlusLinkFooter } from "~/components/Icon";
import { Text } from "~/components/Text";
import { Link } from "~/components/Link";

export function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2" defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between items-center bg-background-subtle-1 py-3 px-4">
              <Text as="span" className="font-normal text-base uppercase">
                {title}
              </Text>
              <IconPlusLinkFooter
                open={open}
                className={`trasition-transform h-5 w-5 duration-300 ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={"pt-4 lg:px-6 px-1.5 flex flex-col lg:flex-row gap-6"}>
            <p className="font-semibold text-base w-full lg:w-1/3">About this product</p>
            <div
              className="lg:w-2/3 w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-bar/30 text-body/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
