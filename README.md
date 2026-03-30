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

## 5) Video Streaming (HLS adaptive)

Trang `anh_ky_niem.html` da duoc nang cap de phat video theo HLS adaptive bitrate:
- Tu dong chon stream theo toc do mang (720p / 1080p / 2K(1440p) / 4K(2160p) neu nguon dat)
- ABR duoc tune theo loai mang (3G / 4G / Wi-Fi) de giam buffering
- Co fallback ve MP4 neu trinh duyet khong ho tro HLS.js
- Co poster preload + thumbnail timeline de tua video muot hon

### Cai FFmpeg tren Windows

Neu may chua co ffmpeg/ffprobe, cai bang `winget`:

```powershell
winget install -e --id Gyan.FFmpeg
```

Mo terminal moi sau khi cai de nhan PATH.

### Render HLS

Chay script:

```powershell
npm run build:hls -- -InputFile "vobe2/www.ziuwedding.site/images/WEDDING NGỌC ÁNH & TRẦN PHONG LOGO.mp4"
```

Tu dong tao them:

- `poster.webp` (anh dai dien video)
- `thumbs/thumb_0001.webp ...` (thumbnail timeline)
- `timeline.json` (metadata de hien thi preview khi tua)

Ket qua tao trong:

- `vobe2/www.ziuwedding.site/videos/wedding-logo-hls/master.m3u8`
- `vobe2/www.ziuwedding.site/videos/wedding-logo-hls/v0/...`
- `vobe2/www.ziuwedding.site/videos/wedding-logo-hls/v1/...`
- `vobe2/www.ziuwedding.site/videos/wedding-logo-hls/v2/...` (neu nguon dat dieu kien)

### Cau hinh player

`wedding-photos.json` su dung:

- `video.hls`: link master playlist `.m3u8` (uu tien)
- `video.src`: link MP4 fallback