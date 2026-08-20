import { Button } from "~/components/button";

export function GenericError({
  error,
}: {
  error: { message: string; stack?: string } | unknown;
}) {
  const heading = "Something's wrong here.";
  let description = "We found an error while loading this page.";

  if (error && typeof error === "object" && "message" in error) {
    description += `\n${(error as { message: string }).message}`;
    console.error(error);
  }

  return (
    <div className="relative flex w-full items-center justify-center py-20">
      <div className="z-10 flex flex-col items-center gap-4 px-6 text-center">
        <h2 className="font-heading text-2xl font-medium">{heading}</h2>
        <span className="font-body font-normal whitespace-pre-line">
          {description}
        </span>
        <Button variant="primary" to="/">
          <span className="font-heading text-xl font-medium">
            Back to Homepage
          </span>
        </Button>
      </div>
    </div>
  );
}
