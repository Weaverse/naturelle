declare function getErrorPage(options: {
    title: string;
    header: string;
    message: string;
    code: string;
}): string;

export { getErrorPage };
