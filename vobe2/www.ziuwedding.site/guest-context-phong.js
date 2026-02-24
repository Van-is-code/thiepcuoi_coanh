(function () {
  function readContext() {
    const params = new URLSearchParams(window.location.search);

    const context = {
      guestId: params.get('gid') || localStorage.getItem('guest_id') || '',
      guestName: params.get('gname') || localStorage.getItem('guest_name') || '',
      invitationSlug: params.get('inv') || localStorage.getItem('invitation_slug') || '',
    };

    if (context.guestId) localStorage.setItem('guest_id', context.guestId);
    if (context.guestName) localStorage.setItem('guest_name', context.guestName);
    if (context.invitationSlug) localStorage.setItem('invitation_slug', context.invitationSlug);

    return context;
  }

  async function hydrateGuestName(context) {
    if (context.guestName || !context.guestId) return context;

    try {
      const response = await fetch(`/api/guests/${context.guestId}`);
      if (!response.ok) return context;

      const guest = await response.json();
      if (guest && guest.name) {
        context.guestName = guest.name;
        localStorage.setItem('guest_name', context.guestName);
      }
    } catch (_) {
      // Ignore hydrate failure for public invitation flow
    }

    return context;
  }

  function renderGuestOnPage(context) {
    const inviteHeadline = document.querySelector('#HEADLINE43 .ladi-headline');
    if (inviteHeadline && context.guestName) {
      inviteHeadline.innerHTML = `Trân trọng kính mời <strong>${context.guestName}</strong><br>tham dự bữa tiệc chung vui cùng gia đình chúng tôi<br>`;
    }

    const nameFormItem = document.getElementById('FORM_ITEM2');
    const nameInput = document.querySelector('input[name="name"]');

    if (context.guestId && context.guestName) {
      // Nếu có guest_id: tự động điền tên và ẩn dòng nhập
      if (nameInput) {
        nameInput.value = context.guestName;
        nameInput.readOnly = true;
      }
      if (nameFormItem) {
        nameFormItem.style.display = 'none';
      }
      console.log('Đã tự động điền tên:', context.guestName);
    } else {
      // Nếu không có guest_id: hiển thị dòng nhập tên
      if (nameFormItem) {
        nameFormItem.style.display = 'block';
      }
      if (nameInput) {
        nameInput.placeholder = 'Tên của bạn';
        nameInput.value = '';
        nameInput.readOnly = false;
      }
    }
  }

  function injectGuestIdField(context) {
    // không cần inject, submit sẽ sử dụng context.guestId trực tiếp
  }

  function wireCheckinSubmit(context) {
    const form = document.querySelector('#FORM2 form');
    if (!form) {
      console.error('Không tìm thấy form #FORM2');
      return;
    }

    console.log('Form được tìm thấy, đang gắn event submit');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      console.log('Form submit được kích hoạt');

      const messageInput = form.querySelector('textarea[name="message"]');
      const attendanceInput = form.querySelector('input[name="form_item6"]:checked');
      const nameInput = form.querySelector('input[name="name"]');

      // Lấy tên từ input field (đã được tự động điền sẵn nếu có guest_id)
      // Fallback về context.guestName nếu input không có giá trị
      let guestName = nameInput ? nameInput.value.trim() : '';
      if (!guestName && context.guestName) {
        guestName = context.guestName;
      }

      const payload = {
        guest_id: context.guestId || null,
        invitation_slug: context.invitationSlug || null,
        name_guest: guestName,
        messages: messageInput ? messageInput.value.trim() : null,
        confirm_attendance: attendanceInput ? attendanceInput.value : null,
        number_of_attendees: null,
        guests_type: context.guestId ? 'private' : 'public',
      };

      console.log('Payload chuẩn bị gửi:', payload);

      if (!payload.name_guest) {
        alert('Vui lòng nhập tên của bạn.');
        return;
      }

      try {
        console.log('Đang gửi request đến /api/messages-checkins...');
        const response = await fetch('/api/messages-checkins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorBody = await response.json().catch(function () {
            return { message: 'Không gửi được lời nhắn.' };
          });
          console.error('Lỗi từ server:', errorBody);
          throw new Error(errorBody.message || 'Không gửi được lời nhắn.');
        }

        const result = await response.json();
        console.log('Kết quả từ server:', result);

        alert('Cảm ơn bạn! Lời nhắn đã được ghi nhận.');
        form.reset();
      } catch (error) {
        console.error('Lỗi khi gửi form:', error);
        alert(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const context = readContext();
    await hydrateGuestName(context);
    renderGuestOnPage(context);
    wireCheckinSubmit(context);
  });
})();
