# Azure Ajanları Deployment

> Açık durum, izinler, onaylar, zaman çıkışları ve kurtarma yolları ile araç kullanan ajanları kullanın.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Öğrenme Hedefleri

- Bir ajanı sınırlı geçişlerle bir devlet makinesi olarak modelleyin.
- Uygulama izinlerini görev ve kullanıcı bağlamına göre uygulayın.
- Geri dönüşü olmayan eylemler için onay kapıları ekleyin.
- Zaman kesintilerinden, kopya olaylarından ve kısmi bir araç başarısızlığından kurtar.
- Hassas yükleri saklamadan her kararı takip et.

## Pratik

Kullanım`code/main.py`Her araç kenarında izin, zaman kesimi, tekrar deneme ve denetim davranışları gerekir.
