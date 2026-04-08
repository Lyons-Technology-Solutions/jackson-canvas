exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  try {
    const params = new URLSearchParams(event.body || "");
    const firstName = params.get("firstName") || "";
    const lastName = params.get("lastName") || "";
    const email = params.get("email") || "";
    const interest = params.get("interest") || "";
    const message = params.get("message") || "";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Jackson Canvas <onboarding@resend.dev>",
        to: "marketing@techlts.com",
        subject: `New Contact Form: ${firstName} ${lastName}`,
        reply_to: email,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #78716c; padding-bottom: 12px;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px; vertical-align: top;">Name</td>
                <td style="padding: 12px 0; color: #1e293b;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748b; font-weight: 600; vertical-align: top;">Email</td>
                <td style="padding: 12px 0; color: #1e293b;"><a href="mailto:${email}" style="color: #78716c;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748b; font-weight: 600; vertical-align: top;">Interested In</td>
                <td style="padding: 12px 0; color: #1e293b;">${interest}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #1e293b;">${message}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 13px;">
              Sent from the Jackson Canvas website contact form
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Email delivery failed" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
