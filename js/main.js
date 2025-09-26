/**
 * Validate Username and Password.
 * @param {null}
 * @returns {null}
 */
function validation() {
  const loginBtn = document.querySelector(".login-btn");
  const userName = document.querySelector(".username input");
  const passWord = document.querySelector(".password input");
  const googleBtn = document.querySelector(".google-btn");
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    showError("");
    try {
      if (userName.value === "" || passWord.value === "") {
        throw new Error("Enter Both Username And Password");
      } else {
        await checkData(userName.value, passWord.value);
      }
    } catch (err) {
      showError(err.message);
    }
  });

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await externalLogin();
    } catch (err) {
      showError(err.message);
    }
  });
}

/**
 * Check Username and Password on Server.
 * @param {string} username
 * @param {string} password
 * @returns {null}
 */
async function checkData(username, password) {
  username = username.trim();
  password = password.trim();
  try {
    let response = await fetch(
      "https://user-management-hyaqdwead7fmd4f9.uaenorth-01.azurewebsites.net/api/Auth/login",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    if (response.status === 400) {
      throw new Error("Invalid Username or Password");
    }

    if (!response.ok) {
      let errData = await response.json();
      throw new Error(errData.error || errData.message || "Login failed");
    }

    let data = await response.json();
    let token = data.token;
    console.log(response, data);

    window.localStorage.setItem("token", token);
    // window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function externalLogin() {
  document.querySelector(".google-btn").addEventListener("click", function (e) {
    e.preventDefault();
    // Redirect to Google login through your backend
    window.location.href =
      "https://user-management-hyaqdwead7fmd4f9.uaenorth-01.azurewebsites.net/api/Auth/external-login?returnUrl=" +
      encodeURIComponent(window.location.origin + "/auth-callback.html");
  });
}

/**
 * Shows Error Message if login failed.
 * @param {string} message
 * @returns {null}
 */
function showError(message) {
  const errMessage = document.querySelector(".error-message");
  errMessage.textContent = message;
}
validation();
