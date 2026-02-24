// ======= STYLE =======
const style = document.createElement("style");
style.innerHTML = `
#floatingBox {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  width: 180px;
  z-index: 999999;
  cursor: move;
  font-family: 'Jost', sans-serif;
}

#floatingBox h4 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
}

#floatingBox a {
  display: block;
  margin: 6px 0;
  font-size: 13px;
  text-decoration: none;
  color: #5c4033;
}

#closeFloating {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff5b5b;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

#floatingOpenBtn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #c9a96e;
  color: white;
  padding: 12px 16px;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  z-index: 999998;
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
  font-size: 18px;
}
`;
document.head.appendChild(style);

// ======= HTML =======
const box = document.createElement("div");
box.id = "floatingBox";
box.innerHTML = `
   <div id="closeFloating">✕</div>
   <h4>Điều hướng</h4>
   <a href="/dashboard">🏠 Trang chính</a>
   <a href="/guest-list">📖 Danh sách khách</a>
   <a href="/wedding">💍 Thiệp cưới</a>
   <a href="/setting">⚙️ Cài đặt</a>
`;
document.body.appendChild(box);

// Nút mở lại
const openBtn = document.createElement("div");
openBtn.id = "floatingOpenBtn";
openBtn.textContent = "☰";
document.body.appendChild(openBtn);

// ======= Drag Feature =======
let isDown = false;
let offset = [0, 0];

box.addEventListener('mousedown', function(e) {
  isDown = true;
  offset = [
    box.offsetLeft - e.clientX,
    box.offsetTop - e.clientY
  ];
});

document.addEventListener('mouseup', function() { isDown = false; });

document.addEventListener('mousemove', function(e) {
  if (isDown) {
    e.preventDefault();
    box.style.left = e.clientX + offset[0] + "px";
    box.style.top = e.clientY + offset[1] + "px";
  }
});

// ======= Close / Open =======
document.getElementById("closeFloating").onclick = () => {
  box.style.display = "none";
  openBtn.style.display = "block";
};

openBtn.onclick = () => {
  box.style.display = "block";
  openBtn.style.display = "none";
};