import { createSchema, useTranslation } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";

const TestSection = ({
  ref,
  ...props
}: any & { ref?: RefObject<HTMLDivElement | null> }) => {
  const { t } = useTranslation();
  return (
    <div ref={ref} {...props}>
      <div className="w-full gap-4 bg-background-subtle-1 text-body flex flex-col items-center justify-center py-8">
        <h2 className="font-bold">{t("styleGuide.title")}</h2>
        <div className="space-y-6">
          <h3 className="text-center font-bold">
            {t("styleGuide.fontFamily")}
          </h3>
          <h1 className="text-center font-bold">Belleza</h1>
          <p className="text-center font-body font-bold">Montserrat</p>
        </div>
        <div className="flex gap-4">
          <div className="space-y-6">
            <h3 className="text-center font-bold">{t("styleGuide.colors")}</h3>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.background")}</span>
              <div className="border w-12 h-12 bg-background"></div>
              <div className="border w-12 h-12 bg-background-subtle-1"></div>
              <div className="border w-12 h-12 bg-background-subtle-2"></div>
              <div className="border w-12 h-12 bg-background-basic"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.foreground")}</span>
              <div className="border w-12 h-12 bg-foreground"></div>
              <div className="border w-12 h-12 bg-foreground-subtle"></div>
              <div className="border w-12 h-12 bg-foreground-basic"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.primary")}</span>
              <div className="border w-12 h-12 bg-primary"></div>
              <div className="border w-12 h-12 bg-primary-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.secondary")}</span>
              <div className="border w-12 h-12 bg-secondary"></div>
              <div className="border w-12 h-12 bg-secondary-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.outline")}</span>
              <div className="border w-12 h-12 bg-outline"></div>
              <div className="border w-12 h-12 bg-outline-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.border")}</span>
              <div className="border w-12 h-12 bg-bar"></div>
              <div className="border w-12 h-12 bg-bar-subtle"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>{t("styleGuide.label")}</span>
              <div className="border w-12 h-12 bg-label-save-background"></div>
              <div className="border w-12 h-12 bg-label-new-background"></div>
              <div className="border w-12 h-12 bg-label-soldout-background"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-center font-bold">
            {t("styleGuide.components")}
          </h3>
          <div className="flex gap-4">
            <div className="space-y-3 p-4 border">
              <h4 className="text-center font-bold">
                {t("styleGuide.button")}
              </h4>
              <div className="flex gap-2">
                <Button>{t("styleGuide.primary")}</Button>
                <Button variant="secondary">{t("styleGuide.secondary")}</Button>
                <Button variant="outline">{t("styleGuide.outline")}</Button>
                <Button variant="link">{t("styleGuide.link")}</Button>
              </div>
            </div>
            <div className="space-y-3 p-4 border">
              <h4 className="text-center font-bold">{t("styleGuide.input")}</h4>
              <div className="flex gap-2">
                <Input placeholder={t("styleGuide.inputPlaceholder")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const schema = createSchema({
  title: "Style guide",
  type: "test",
  settings: [
    {
      group: "Settings",
      inputs: [
        {
          type: "text",
          name: "value",
          label: "Text",
          defaultValue: "Test",
        },
      ],
    },
  ],
});

export default TestSection;
