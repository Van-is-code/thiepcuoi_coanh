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
- Người dùng mở link riêng `GET /thiepmoi/:slug` sẽ được redirect sang `vobe2.html?gid=...&gname=...`
- Khi bấm vào phong bì ở `vobe2.html`, trang sẽ chuyển tiếp sang `phongbibe2.html` và giữ nguyên `gid/gname`

## 3) API chính

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