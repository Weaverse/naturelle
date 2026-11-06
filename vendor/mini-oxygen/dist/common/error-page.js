function getErrorPage(options) {
  const html = String.raw;
  return html`<html>
    <head>
      <title>MiniOxygen: ${options.title ?? "Unknown error"}</title>
    </head>
    <body
      style="display: flex; flex-direction: column; align-items: center; padding-top: 20px; font-family: Arial"
    >
      <h2>${options.header}</h2>
      <p>${options.message}</p>
      <pre>${options.code}</pre>
    </body>
  </html>`;
}
export {
  getErrorPage
};
