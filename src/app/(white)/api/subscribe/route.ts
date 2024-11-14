export const runtime = "edge";
import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

class ZohoCampaigns {
  email: string;
  accountsUrl: string;
  subApiUrl: string;
  addApiUrl: string;
  #clientId: string;
  #clientSecret: string;
  #refreshToken: string;
  #puppificationsListKey: string;
  #webSourceListKey: string;

  constructor(email: string, env: CloudflareEnv) {
    this.email = email;
    this.accountsUrl = "https://accounts.zoho.com";
    this.subApiUrl = "https://campaigns.zoho.com/api/v1.1/json/listsubscribe";
    this.addApiUrl =
      "https://campaigns.zoho.com/api/v1.1/addlistsubscribersinbulk";
    this.#clientId = env.ZOHO_CLIENT_ID;
    this.#clientSecret = env.ZOHO_CLIENT_SECRET;
    this.#refreshToken = env.ZOHO_REFRESH_TOKEN;
    this.#puppificationsListKey =
      "3z913333f0e4deed81cef77129cbfa3ba3b534354df032669bb6ca911ff8a7a288";
    this.#webSourceListKey =
      "3z2706ef555abf70b3c170dcacb145d0bb4dbcf3d39d4629ca009924bd2dd2a7f3";
  }
  // Helper function to refresh access token
  async refreshAccessToken() {
    const url = `${
      this.accountsUrl
    }/oauth/v2/token?grant_type=refresh_token&client_id=${
      this.#clientId
    }&client_secret=${this.#clientSecret}&refresh_token=${this.#refreshToken}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      console.error("Failed to refresh access token");
      throw new Error("Failed to refresh access token");
    }

    const data = (await response.json()) as {
      access_token: string;
      api_domain: string;
      token_type: string;
      expires_in: number;
    };
    return data.access_token; // return new access token
  }
  // Helper function to subscribe the user
  async subscribeUser(accessToken: string, email: string) {
    const addResponse = await fetch(this.addApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        listkey: this.#webSourceListKey,
        emailids: email, // Contact information with email
        resfmt: "JSON", // Response format JSON
      }),
    });
    const subResponse = await fetch(this.subApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        listkey: this.#puppificationsListKey,
        contactinfo: JSON.stringify({ "Contact Email": email }), // Contact information with email
        resfmt: "JSON", // Response format JSON
      }),
    });

    if (!addResponse.ok) {
      console.error(`Failed to subscribe user: ${email}`);
      throw new Error("Failed to subscribe user");
    }

    return subResponse.json();
  }
}

export async function POST(request: Request) {
  try {
    const email = (await request.json()as { email: string; }).email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const env = getRequestContext().env;

    const zohoCampaigns = new ZohoCampaigns(email, env);

    // Step 1: Refresh the access token
    const accessToken = await zohoCampaigns.refreshAccessToken();

    // Step 2: Subscribe the user to the mailing list
    const result = await zohoCampaigns.subscribeUser(accessToken, email);

    // Return success response
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    /**@ts-expect-error Error messages must be 'any' type*/
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
