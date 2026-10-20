# AI Çalışma yükleri için Azure İşlevleri

> Sınırlı görevler, yedikleri tetikleyiciler ve hafif orkestrasyon için olay yönlendirilmiş fonksiyonları kullanın.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Öğrenme Hedefleri

- Sınırlı, olay odaklı çalışma için fonksiyonları seçin.
- Başlatıcı, tekrar deneme, zaman kesimi ve zehir mesajı davranışlarını tanımla.
- İşçilerin kontrolsüz ve gözlemlenebilir olmasını sağlayın.
- Uzun model işleri kısa bir talep yoluna yerleştirmekten kaçının.
- İşçiye dayanıklı bir teslimat tasarlayın.

## Pratik

Kullanım`code/main.py`Bu, idempotency, timeout, re-try ve dead-letter kararları kontrol eder.
