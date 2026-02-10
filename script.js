document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerText;

  // Visual feedback
  submitBtn.disabled = true;
  submitBtn.innerText = "Sending...";

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  try {
    /**
     * SECRETS HANDLING:
     * We do NOT put the Google Apps Script URL or Secret Key here.
     * We call our local Netlify Function endpoint. 
     * Netlify will inject the secrets on the server side.
     */
    const res = await fetch("/.netlify/functions/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Message sent successfully!");
      form.reset();
    } else {
      throw new Error(data.message || "Something went wrong.");
    }

  } catch (err) {
    console.error("Submission Error:", err);
    alert("Failed to send message: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
  }
});