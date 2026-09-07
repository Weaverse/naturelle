import { useThemeSettings } from "@weaverse/hydrogen";

export function PopularKeywords({
  onKeywordClick,
}: {
  onKeywordClick?: (keyword: string) => void;
}) {
  const { popularSearchKeywords } = useThemeSettings();
  if (!popularSearchKeywords?.length) {
    return null;
  }

  const keywords = [
    ...new Set(
      String(popularSearchKeywords)
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  ];

  if (!keywords.length) {
    return null;
  }

  return (
    <section aria-labelledby="popular-search-keywords">
      <div
        id="popular-search-keywords"
        className="mb-4 font-heading text-sm uppercase leading-normal text-text-subtle"
      >
        Popular keywords
      </div>
      <ul className="space-y-2 text-sm text-text">
        {keywords.map((keyword) => (
          <li key={keyword}>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onKeywordClick?.(keyword)}
              className="font-sans text-base font-normal leading-[1.6] tracking-[-0.16px] text-text"
            >
              {keyword}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
