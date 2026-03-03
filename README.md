# Wedding Invitation Backend

## 1) Cài đặt

1. Tạo file `.env` từ `.env.example`
2. Cập nhật `DATABASE_URL` đúng PostgreSQL của bạn
3. Chạy lệnh:

```bash
npm install
npm run dev
```

Khi server chạy, hệ thống sẽ tự tạo extension + bảng nếu chưa có.

## 2) Luồng URL riêng

- Khi tạo guest (`POST /api/guests`), backend tự tạo `private_invitation.url` dạng `/thiepmoi/ten-khach-xxxx`
- Người dùng mở link riêng `GET /thiepmoi/:slug` sẽ được redirect sang `/vanphong-ngocanh?gid=...&gname=...`
- Khi bấm vào phong bì ở `vobe2.html`, trang sẽ chuyển tiếp sang `phongbibe2.html` và giữ nguyên `gid/gname`

## 3) Migration route `/ngoc-anh` -> `/vanphong-ngocanh`

Để giữ tương thích link cũ, project đang có lớp chuyển hướng tạm:

- Route cũ trong backend vẫn được giữ ở `src/server.js`:
	- `GET /ngoc-anh` và `GET /ngoc-anh/` trả về `vobe2.html`
- File redirect riêng ở frontend:
	- `vobe2/www.ziuwedding.site/legacy-ngoc-anh-redirect.js`
	- Chức năng: nếu user vào `/ngoc-anh` thì tự chuyển sang `/vanphong-ngocanh` và giữ nguyên query/hash
- Script redirect tạm được nhúng trong:
	- `vobe2/www.ziuwedding.site/vobe2.html`

### Cách xóa migration này sau này (khi không cần hỗ trợ link cũ)

1. Xóa file `vobe2/www.ziuwedding.site/legacy-ngoc-anh-redirect.js`.
2. Mở `vobe2/www.ziuwedding.site/vobe2.html`, xóa dòng:
	 - `<script src="legacy-ngoc-anh-redirect.js" type="text/javascript"></script>`
3. Mở `src/server.js`, xóa route cũ:
	 - `app.get(['/ngoc-anh', '/ngoc-anh/'], ...)`
4. Kiểm tra lại không còn `/ngoc-anh` bằng tìm kiếm toàn project.
5. Commit + deploy lại.

## 4) API chính

### Guest CRUD
- `POST /api/guests`
- `GET /api/guests`
- `GET /api/guests/:guestId`
- `PUT /api/guests/:guestId`
- `DELETE /api/guests/:guestId`

### Hàm lấy info theo yêu cầu
- `GET /api/private-invitations/by-guest/:guestId`

Trả về:
- `name_guest`
- `description_guest`
- `url_private_invitation`

### Resolve link riêng
- `GET /api/private-invitations/resolve/:slug`

### Messages checkins CRUD
- `POST /api/messages-checkins`
- `GET /api/messages-checkins`
- `GET /api/messages-checkins/:id`
- `PUT /api/messages-checkins/:id`
- `DELETE /api/messages-checkins/:id`

`guest_id` trong `messages_checkins` có thể `null` (thiệp chung) hoặc có giá trị (thiệp riêng).