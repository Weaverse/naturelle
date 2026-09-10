import { createSchema } from "@weaverse/hydrogen";
import { schema as headingSchema } from "~/components/heading";

export { default } from "~/components/heading";

export const schema = createSchema({
  ...headingSchema,
  type: "slides-heading",
  title: "Heading",
  limit: 1,
});
