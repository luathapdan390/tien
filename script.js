document.addEventListener('DOMContentLoaded', () => {
    // Hidden word reveal functionality
    const goldenWords = document.querySelectorAll('.golden-word');

    goldenWords.forEach(word => {
        word.addEventListener('click', () => {
            const hiddenText = word.getAttribute('data-hidden-text');
            word.textContent = hiddenText;
            word.classList.add('revealed');
        });
    });

    // Voice recorder functionality
    const startButton = document.getElementById('start-record');
    const stopButton = document.getElementById('stop-record');
    const audioPlayback = document.getElementById('audio-playback');
    const downloadLink = document.getElementById('download-link');
    let mediaRecorder;
    let audioChunks = [];

    // Get access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { 'type' : 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;

                downloadLink.href = audioUrl;
                downloadLink.download = 'thugui-bantien-ghiam.webm';
                downloadLink.style.display = 'block';

                audioChunks = [];
            };

            startButton.addEventListener('click', () => {
                audioChunks = [];
                mediaRecorder.start();
                startButton.disabled = true;
                stopButton.disabled = false;
                downloadLink.style.display = 'none';
            });

            stopButton.addEventListener('click', () => {
                mediaRecorder.stop();
                startButton.disabled = false;
                stopButton.disabled = true;
            });

        })
        .catch(err => {
            console.error('Không thể truy cập microphone:', err);
            // Hide the recorder if microphone access is denied
            document.querySelector('.voice-recorder').style.display = 'none';
        });
});