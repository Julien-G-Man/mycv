// No require('node-fetch') needed! Node 18+ has fetch globally.

exports.handler = async (event) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    const body = JSON.parse(event.body);

    // 2. Prepare the payload for Google Apps Script
    const googlePayload = {
      ...body,
      secret: process.env.GOOGLE_SCRIPT_SECRET 
    };

    // 3. Forward the data to Google using global fetch
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googlePayload)
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};