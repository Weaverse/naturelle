import { data } from "react-router";

import { CACHE_LONG } from "~/utils/cache";
import { COUNTRIES } from "~/utils/const";

export async function loader() {
  return data(
    {
      ...COUNTRIES,
    },
    {
      headers: {
        "cache-control": CACHE_LONG,
      },
    },
  );
}

// no-op
export default function CountriesApiRoute() {
  return null;
}
