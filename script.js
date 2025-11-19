// Giả sử tài khoản hợp lệ là:
const validUser = {
  username: "admin",
  password: "123456"
};

// Khi form được gửi
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (username === validUser.username && password === validUser.password) {
    // Lưu username vào localStorage để "ghi nhớ"
    localStorage.setItem("username", username);
    error.style.color = "green";
    error.textContent = "Đăng nhập thành công!";
  } else {
    error.textContent = "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại.";
  }
});

// Khi mở lại trang, nếu đã lưu username
window.onload = function() {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    document.getElementById("username").value = savedUser;
  }
};
