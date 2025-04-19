import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";

const TestSection = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <div className="w-full gap-4 bg-background-subtle-1 text-body flex flex-col items-center justify-center py-8">
        <h2 className="font-bold">Style Guide</h2>
        <div className="space-y-6">
          <h3 className="text-center font-bold">Font family</h3>
          <h1 className="text-center font-bold">Cormorant</h1>
          <h2 className="text-center font-bold">Cormorant</h2>
        </div>
        <div className="flex gap-4"></div>
        <div className="flex gap-4">
          <div className="space-y-6">
            <h3 className="text-center font-bold">Colors</h3>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Background</span>
              <div className="border w-12 h-12 bg-background"></div>
              <div className="border w-12 h-12 bg-background-subtle-1"></div>
              <div className="border w-12 h-12 bg-background-subtle-2"></div>
              <div className="border w-12 h-12 bg-background-basic"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Foreground</span>
              <div className="border w-12 h-12 bg-foreground"></div>
              <div className="border w-12 h-12 bg-foreground-subtle"></div>
              <div className="border w-12 h-12 bg-foreground-basic"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Primary</span>
              <div className="border w-12 h-12 bg-primary"></div>
              <div className="border w-12 h-12 bg-primary-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Secondary</span>
              <div className="border w-12 h-12 bg-secondary"></div>
              <div className="border w-12 h-12 bg-secondary-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Outline</span>
              <div className="border w-12 h-12 bg-outline"></div>
              <div className="border w-12 h-12 bg-outline-foreground"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Border</span>
              <div className="border w-12 h-12 bg-bar"></div>
              <div className="border w-12 h-12 bg-bar-subtle"></div>
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <span>Label</span>
              <div className="border w-12 h-12 bg-label-sale-background"></div>
              <div className="border w-12 h-12 bg-label-new-background"></div>
              <div className="border w-12 h-12 bg-label-soldout-background"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-center font-bold">Components</h3>
          <div className="flex gap-4">
            <div className="space-y-3 p-4 border">
              <h4 className="text-center font-bold">Button</h4>
              <div className="flex gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div className="space-y-3 p-4 border">
              <h4 className="text-center font-bold">Input</h4>
              <div className="flex gap-2">
                <Input placeholder="Input placeholder" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const schema: HydrogenComponentSchema = {
  title: "Style guide",
  type: "test",
  inspector: [
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
};

export default TestSection;
