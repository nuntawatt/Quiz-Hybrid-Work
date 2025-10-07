# 📱 CIS Hybrid Mobile Application (KKU)

แอปพลิเคชันสำหรับเชื่อมต่อกับระบบ **CIS (Classroom Information System)**  
พัฒนาโดยใช้ **Expo + React Native (TypeScript)**  
รองรับการใช้งาน API ของ CIS โดยตรง เช่น  
- ระบบล็อกอินเข้าสู่ระบบ  
- ดูสมาชิกตามชั้นปี  
- โพสต์สถานะ / แสดงโพสต์ / ลบโพสต์  
- คอมเมนต์สถานะ  
- กด Like / Unlike  
- ออกจากระบบ  

---

## 🧑‍💻 ผู้พัฒนา

| รายละเอียด | ข้อมูล |
|-------------|---------|
| 👤 **ชื่อ-นามสกุล** | นันทวัฒน์ แซ่ฮวม |
| 🆔 **รหัสนักศึกษา** | 653450510-0 |
| 🏫 **คณะ / สาขา** | สหวิทยาการ - วิทยาการคอมพิวเตอร์และสารสนเทศ |
| 🏛️ **มหาวิทยาลัย** | มหาวิทยาลัยขอนแก่น (Khon Kaen University) |
| 📅 **ภาคการศึกษา** | 1 / 2568 |

---

## ⚙️ เทคโนโลยีที่ใช้

| หมวด | รายละเอียด |
|-------|-------------|
| **Frontend Framework** | Expo (React Native + TypeScript) |
| **UI Components** | React Native Paper / Custom UI Components |
| **API Communication** | Axios + JWT Authentication |
| **State & Navigation** | React Navigation + useState / useEffect |
| **API Provider** | [CIS KKU REST API](https://cis.kku.ac.th/api/classroom) |

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### 1️⃣ ติดตั้ง Dependencies
```bash
npm install
```

### 2️⃣ ตั้งค่า .env
สร้างไฟล์ `.env` แล้วใส่ค่าตัวแปรดังนี้
```bash
CIS_BASE_URL= "KEY"
CIS_API_KEY= "KEY"
```

### 3️⃣ เริ่มรันโปรเจกต์
```bash
npx expo start
```

จากนั้นสแกน QR code ด้วย **Expo Go App** บนมือถือ (iOS / Android)

---

## 🧩 โครงสร้างโฟลเดอร์

```
src/
 ├── components/       # UI Components (Card, Button, Input, PostCard)
 ├── lib/              # ฟังก์ชันเชื่อมต่อ API (cis.ts, token.ts)
 ├── navigation/       # ระบบนำทาง (AppNavigator)
 ├── screens/          # หน้าจอหลัก (Login, Feed, MyStatus, Year, PostDetail)
 ├── assets/           # รูปภาพ / โลโก้
 └── App.tsx           # จุดเริ่มต้นของแอป
```

---

## 🧠 ฟีเจอร์หลัก

- ✅ **ล็อกอินเข้าสู่ระบบ**
- ✅ **โพสต์ข้อความ**
- ✅ **ดูโพสต์ทั้งหมด**
- ✅ **กดไลก์ / ยกเลิกไลก์**
- ✅ **คอมเมนต์ / ลบคอมเมนต์**
- ✅ **ดูโพสต์ของตนเอง**
- ✅ **ดูสมาชิกในชั้นปี**
- ✅ **ออกจากระบบ**

---
