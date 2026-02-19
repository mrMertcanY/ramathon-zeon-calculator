# 🔴 Ramathon Zeon - Yayın Süresi Hesaplayıcı ⏱️

Bu proje, **Necati "Zeon" Akçay**'ın gerçekleştirdiği **Ramathon** etkinliği için özel olarak tasarlanmış dinamik ve kolay kullanımlı bir "Yayın Süresi Hesaplayıcısıdır". 

Ramathon süresince ne kadar bağış/abone vb. geldiğine oranla ne kadar yayın süresinin uzadığını hesaplamayı kolaylaştırmak, ayrıca geçilen toplam zamanı takip etmek amacıyla geliştirilmiştir.

---

## 🌟 Özellikler

### 1️⃣ Süre Hesaplayıcı (Süre Ekle)
İzleyicilerden gelen çeşitli destek türlerinin (Bağış, Abone vb.) yayına kaç saat, dakika veya saniye eklediğini hesaplayan pratik hesap makinesi.

- **Destek Türleri:** Bağış, Abone, Blerp, Kicks.
- **Hızlı Dönüşüm:** Girilen değer anında Saat, Dakika ve Saniye hesaplamalarına dönüştürülür.
- **Canlı Önizleme:** Sonucu tek tıklamayla *Saat (sa)*, *Dakika (dk)* veya *Saniye (sn)* formatında net bir şekilde ekranda görün.

### 2️⃣ Toplam Süre Takibi
Yayın başından bu yana geçen süreyi ve ekstra eklenecek olan yeni süreleri toplayarak, hedeflenen "Toplam Yayın Süresini" kolayca hesaplamanızı sağlayan ekran.

- **Canlı Yayın Süresi (Sayaç):** Yayının başlangıç saatinden itibaren ne kadar süre geçtiğini canlı olarak (Gün, Saat, Dakika, Saniye) gösterir.
- **Hedef Süre Ekleme:** Ekstra eklemek istediğiniz süreyi girerek "Toplam Ulaşılacak Süreyi" görebilirsiniz.

---

## 🎨 Tasarım Detayları & Kullanıcı Deneyimi (UX/UI)
- **Tema:** Zeon temasına uygun, kırmızı vurgulu (`#EF4444`) modern karanlık mod.
- **3D Etkileşim:** Arka plandaki grid yapı, fare imlecini takip eder. Tıpkı bir büyüteçle arka planı kaldırıyormuşçasına 3D bir "yakınlaşma (pop-up) etkisi" oluşturularak kullanıcının hissiyatı güçlendirilir.
- **Modern Arayüz:** Pürüzsüz geçişler, kırmızı seçim (highlight) renkleri, Material UI kart tasarımları ve interaktif elemanlarla geliştirildi.

---

## 🚀 Kurulum ve Çalıştırma

Proje **React** ve **Vite** altyapısıyla çalışmaktadır. Kendi yerel ortamınızda projeyi ayağa kaldırmak için aşağıdaki adımları kullanabilirsiniz:

### Gereksinimler
- Node.js (v16.14.0 veya üzeri)

### Adımlar

1. Projeyi bilgisayarınıza klonlayın ya da indirin.
2. Terminal üzerinden proje dizinine girin:
   ```bash
   cd ramathon-zeon-calculator
   ```
3. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
5. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı kullanmaya başlayın!

---

> *"Ne yapıyordu ya?"*  
> **- Zeon ❤️**
