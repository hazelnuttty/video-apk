# 📹 Video Logger with IP Tracking

## 📌 Overview
This project records video from a user's webcam every 30 seconds and automatically sends it to a Discord webhook. Along with the video, it also logs:
- **IP Address**
- **Country**
- **Local Time of the Target**

## 📂 Project Structure
```
📁 YourRepo
 ├── 📄 index.html       # Main HTML file (loads the script)
 ├── 📄 script.js        # JavaScript logic for recording and sending video
```

## 🚀 How It Works
1. The browser requests camera access.
2. The script records 30-second video clips.
3. After recording, the script fetches the target's IP, country, and local time.
4. The video (if under 25MB) and data are sent to a Discord webhook.
5. The process repeats every 30 seconds.

## 📌 Notes
- The script ensures videos are below **25MB**.
- The recording automatically **restarts every 30 seconds**.
- The target’s **IP and country are fetched using** `ipwho.is`.
- If the browser denies camera access, the script **won't function**.

## ⚠️ Disclaimer
This project is for **educational purposes only**. Unauthorized surveillance is illegal and violates privacy policies.

