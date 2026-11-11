# tradist.co.uk — web sitesi

Yayına hazır site `dist/` klasöründedir. Bu klasörün içindekiler doğrudan herhangi bir statik barındırmaya yüklenebilir.

## Klasörler

| Yol | Ne işe yarar |
|---|---|
| `dist/` | Yayınlanacak site (bunu yükleyin) |
| `src/content.js` | Tüm metinler, hizmetler, rakamlar, adres ve telefon |
| `src/assets/` | Stil dosyası, yazı tipleri, görseller |
| `src/public/` | Favicon ve paylaşım ikonları |
| `Dockerfile`, `nginx.conf` | Coolify / Docker ile yayın için sunucu ayarları |
| `build.js` | `dist/` klasörünü yeniden üretir |

Metin değiştirmek için `src/content.js` dosyasını düzenleyip şunu çalıştırın:

```bash
node build.js
```

## Yayınlama: Coolify (DigitalOcean sunucusu üzerinde)

Proje bir `Dockerfile` içerir: Coolify siteyi kendisi derler ve nginx ile sunar.

1. Bu klasörü GitHub'da bir depoya (örn. `tradist-website`) gönderin.
2. Coolify → **+ New → Application → Public/Private Repository** ile depoyu seçin.
3. **Build Pack: Dockerfile** seçin. Port: **80**.
4. **Domains** alanına `https://tradist.co.uk,https://www.tradist.co.uk` yazın. Coolify SSL sertifikasını otomatik alır.
5. Alan adı sağlayıcınızda `tradist.co.uk` ve `www` için **A kaydını** DigitalOcean sunucunuzun IP adresine yönlendirin.
6. **Deploy**'a basın. Sonraki değişikliklerde GitHub'a gönderdiğiniz her güncelleme otomatik yayına alınabilir (Coolify'da "Auto Deploy").

### İletişim formu

Form, Formspree (formspree.io) ile çalışır:

1. Formspree'de ücretsiz hesap açıp yeni bir form oluşturun, bildirim adresi `info@tradist.co.uk` olsun.
2. Verilen adresteki form kimliğini (`https://formspree.io/f/xxxxxxx`) `src/content.js` içindeki `formEndpoint` alanına yazın.
3. GitHub'a gönderin; Coolify yeniden yayınlar.

## Sayfalar

- `/` ana sayfa
- `/services/…/` yedi hizmet sayfası
- `/about/`, `/contact/`, `/privacy/`
- `/thanks/` form sonrası teşekkür sayfası, `404.html` bulunamadı sayfası
- `sitemap.xml`, `robots.txt` arama motorları için
