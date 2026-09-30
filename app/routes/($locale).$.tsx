import type { LoaderFunctionArgs } from "react-router";
import { skipRevalidationForCartActions } from "~/utils/revalidation";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";

export const shouldRevalidate = skipRevalidationForCartActions;

export async function loader({ context }: LoaderFunctionArgs) {
  let weaverseData = await context.weaverse.loadPage({
    type: "CUSTOM",
  });

  validateWeaverseData(weaverseData);

  return {
    weaverseData,
  };
}

export default function Component() {
  return <WeaverseContent />;
}
