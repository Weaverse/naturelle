import { createSchema } from "@weaverse/hydrogen";
import { schema as paragraphSchema } from "~/components/paragraph";

export { default } from "~/components/paragraph";

export const schema = createSchema({
  ...paragraphSchema,
  type: "slides-paragraph",
  title: "Paragraph",
  limit: 1,
});
