// This runs on Netlify's servers, NOT the browser.
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    // 2. Prepare the payload for Google Apps Script
    // The SECRET and URL are pulled from Netlify Environment Variables
    const googlePayload = {
      ...body,
      secret: process.env.GOOGLE_SCRIPT_SECRET 
    };

    // 3. Forward the data to Google
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googlePayload)
    });

    const result = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(result)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};