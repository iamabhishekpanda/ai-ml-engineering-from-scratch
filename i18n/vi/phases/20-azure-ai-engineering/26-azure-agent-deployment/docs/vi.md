# Việc triển khai nhân viên Azure

> Sử dụng các đại lý sử dụng công cụ với trạng thái rõ ràng, quyền, phê duyệt, thời gian ra và đường dẫn phục hồi.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Mục tiêu học tập

- Mô hình hóa một đại lý như một máy trạng thái với các chuyển tiếp giới hạn.
- Sử dụng quyền công cụ cho mỗi nhiệm vụ và ngữ cảnh người dùng.
- Thêm cửa phê duyệt cho các hành động không thể đảo ngược.
- Khôi phục từ thời gian dừng, các sự kiện trùng lặp và thất bại phần của công cụ.
- Theo dõi mọi quyết định mà không lưu trữ tải trọng hữu ích nhạy cảm.

## Thực hành

Sử dụng `code/main.py`để xác nhận kế hoạch triển khai đại lý. Mỗi cạnh công cụ cần sự cho phép, thời gian, thử lại, và kiểm toán hành vi.
