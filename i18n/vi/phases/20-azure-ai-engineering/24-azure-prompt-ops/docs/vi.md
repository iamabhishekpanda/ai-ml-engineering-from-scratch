# Azure Prompt Operations

> Chế độ xử lý các thông báo, cài đặt mô hình, quy tắc an toàn và kết quả đánh giá như các đầu vào sản xuất phiên bản.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI, Azure AI Foundry
**Time:** ~60 minutes

## Mục tiêu học tập

- Các yêu cầu phiên bản và các tham số mô hình cùng nhau.
- Xây dựng một bộ dữ liệu hồi quy nhỏ trước khi thay đổi một lời nhắc.
- So sánh chất lượng, thời gian trễ, từ chối, và hiệu ứng chi phí token.
- yêu cầu phê duyệt cho các thay đổi sản xuất nhanh chóng.
- Giữ metadata quay lại bên cạnh mỗi phát hành.

## Thực hành

Sử dụng `code/main.py`để xác nhận bản ghi bản phát hành nhanh. Một bản phát hành cần một bộ dữ liệu, ngưỡng, chủ sở hữu và phiên bản quay lại.
