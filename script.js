const apiKey = "ema_live_STtDlItoxsfbAvvcUzkNH1ZMwmvjIV7YUfHVK15r";

// Function to check SMTP validity of an email
async function checkSMTP(email) {
  const url = `https://api.emailvalidation.io/v1/info?apikey=${apiKey}&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok && typeof data.smtp_check === "boolean") {
      return { smtp: data.smtp_check, data }; // return both validity and full data
    }
    return { smtp: false, data: null };
  } catch (err) {
    console.error(`SMTP check failed for ${email}:`, err);
    return { smtp: false, data: null };
  }
}

// Event: Validate Emails
document.getElementById("submitBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const resultCont = document.getElementById("resultCont");
  const raw = document.getElementById("emailInput").value;
  const emails = raw
    .split(/\r?\n/)
    .map(e => e.trim())
    .filter(Boolean);

  if (emails.length === 0) {
    resultCont.innerHTML = "<div class='invalid result'>Please enter at least one email.</div>";
    return;
  }

  resultCont.innerHTML = `<img width="50" src="img/loading-7528_128.gif" alt="Loading...">`;
  let resultsHTML = '';

  for (const email of emails) {
    const { smtp, data } = await checkSMTP(email);

    if (!data) {
      resultsHTML += `<div class="invalid result"><strong>${email}</strong>: Error fetching data.</div>`;
      continue;
    }

    resultsHTML += `
      <div class="${smtp ? 'valid' : 'invalid'} result">
        <strong>${email}</strong>: ${smtp ? '✅ Valid' : '❌ Invalid'}
        <br><strong>SMTP Check:</strong> ${smtp}
        <br><strong>Disposable:</strong> ${data.disposable ? 'Yes' : 'No'}
        <br><strong>Free Provider:</strong> ${data.free ? 'Yes' : 'No'}
        <br><strong>Domain:</strong> ${data.domain}
      </div>`;
  }

  resultCont.innerHTML = resultsHTML;
});

// 🌙 Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});
