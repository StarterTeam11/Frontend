/* ===== Login Page ====== */

function validation() {
  const loginBtn = document.querySelector(".login-btn");
  const userName = document.querySelector(".username input");
  const passWord = document.querySelector(".password input");
  loginBtn.addEventListener("click",async (e) => {
    e.preventDefault();
    showError("");
    try {
      if(userName.value === "" || passWord.value === "") {
        throw new Error("Enter Both Username And Password");
      }
      else {
        await checkData(userName.value,passWord.value);
      }
    }
    catch(err) {
      showError(err.message);
    }
  });
}

async function checkData(username,password) {
  username = username.trim();
  password = password.trim();
  try {
    let response = await fetch("https://reqres.in/api/login",{
      method:"post",
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      })
    });

    if(response.status === 400) {
      throw new Error("Invalid Username or Password");
    }
    
    if(!response.ok) {
      let errData = await response.json();
      throw new Error(errData.error || errData.message || "Login failed");
    }

    let data = await response.json();
    let token = data.token;

    window.localStorage.setItem("token",token);
    window.location.href = "../dashboard.html";
  }
  catch(err) {
    console.error(err);
    throw err;
  }
}


function showError(message) {
  const errMessage = document.querySelector(".error-message");
  errMessage.textContent = message;
}
validation();