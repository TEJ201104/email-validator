console.log("this is my script");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Clicked!");
    resultCont.innerHTML = `<img width="50" src="img/loading-7528_128.gif">`;
    let key = "ema_live_STtDlItoxsfbAvvcUzkNH1ZMwmvjIV7YUfHVK15r";
    let email = document.getElementById("username").value;
    // Validate email input
    if (!email) {
        resultCont.innerHTML = "<div>Please enter an email address.</div>";
        return;
    }
    let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;
    try {
        let res = await fetch(url);
        let apiResult = await res.json();
        // Check for response errors or invalid data
        if (res.ok && apiResult) {
            let str = '';
            // Check if SMTP is valid and show validity
            let validityMessage = checkEmailValidity(apiResult.smtp_check);
            str += `<div><strong>Email Validity:</strong> ${validityMessage}</div>`;
            // Add other results to the display
            for (let key of Object.keys(apiResult)) {
                if (apiResult[key] !== "" && apiResult[key] !== " ") {
                    str += `<div><strong>${key}:</strong> ${apiResult[key]}</div>`;
                }
            }
            // If no data is available
            if (str === '') {
                str = "<div>No information found for this email address.</div>";
            }
            resultCont.innerHTML = str;
        } else {
            resultCont.innerHTML = "<div>Failed to fetch email validation data.</div>";
        }
    } catch (error) {
        console.error("Error fetching email validation:", error);
        resultCont.innerHTML = "<div>There was an error with the email validation service. Please try again later.</div>";
    }
});

// Function to check if the email is valid based on SMTP check
function checkEmailValidity(smtpCheck) {
    if (smtpCheck) {
        return "Email is valid";
    } else {
        return "Email is not valid";
    }
}
