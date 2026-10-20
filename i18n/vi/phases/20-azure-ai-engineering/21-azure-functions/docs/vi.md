# Các chức năng Azure cho khối lượng công việc AI

> Sử dụng các chức năng dựa trên sự kiện cho các nhiệm vụ giới hạn, kích hoạt tiêu thụ và dàn xếp nhẹ.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Mục tiêu học tập

- Chọn các chức năng cho công việc giới hạn, dựa trên sự kiện.
- Định nghĩa hành vi kích hoạt, thử lại, thời gian nghỉ và tin độc.
- Giữ người xử lý vô hiệu và dễ quan sát.
- Tránh đặt các công việc mô hình dài trong một con đường yêu cầu ngắn.
- Thiết kế một giao hàng bền vững cho một công nhân.

## Thực hành

Sử dụng `code/main.py`để xác nhận một kế hoạch kích hoạt chức năng. Nó kiểm tra tính bất khả năng, thời gian, thử lại, và các quyết định chữ cái chết.
