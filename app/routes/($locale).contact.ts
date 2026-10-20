import { type ActionFunction, data } from "react-router";

export const action: ActionFunction = async ({ request, context }) => {
  let { env } = context;
  const formData = await request.formData();
  let url = `${env.WEAVERSE_HOST}/api/public/mail`;
  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.WEAVERSE_API_KEY,
      },
      body: JSON.stringify({
        // to: env.STORE_EMAIL,
        email: formData.get("email"),
        name: formData.get("name"),
        subject: `New message from ${formData.get("name")}`,
        message: formData.get("message"),
      }),
    });
    return data({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return data({ ok: false }, { status: 502 });
  }
};
