document.addEventListener('DOMContentLoaded', () => {
    const compassBody = document.getElementById('compassBody');
    const compassNeedle = document.getElementById('compassNeedle');
    const peggySong = document.getElementById('peggySong'); // Get the audio element

    let isOpen = false;
    let watchId; // For DeviceOrientationEvent watcher ID

    // Function to handle compass click
    compassBody.addEventListener('click', () => {
        isOpen = !isOpen; // Toggle state

        if (isOpen) {
            compassBody.classList.remove('closed');
            compassBody.classList.add('open');
            rotateNeedle(0); // Needle to North
            startCompassTracking(); // Start real compass tracking

            // Play the song when opening
            if (peggySong) {
                peggySong.currentTime = 0; // Rewind to start
                peggySong.play().catch(e => console.error("Error playing audio:", e)); // Play and catch potential errors
            }

        } else {
            compassBody.classList.remove('open');
            compassBody.classList.add('closed');
            rotateNeedle(0); // Needle to North when closing
            stopCompassTracking(); // Stop tracking

            // Pause and rewind the song when closing
            if (peggySong) {
                peggySong.pause();
                peggySong.currentTime = 0;
            }
        }
    });

    // --- Compass functionality (for the needle) ---

    function rotateNeedle(alpha) {
        const rotation = 360 - alpha; // Compensate for real North
        compassNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    function startCompassTracking() {
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            watchId = window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            console.warn('Permiso para DeviceOrientationEvent denegado.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al solicitar permiso para DeviceOrientationEvent:', error);
                    });
            } else {
                watchId = window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            console.warn("DeviceOrientationEvent no es compatible con este navegador.");
            compassNeedle.style.transform = `translateX(-50%) rotate(${Math.random() * 360}deg)`;
        }
    }

    function stopCompassTracking() {
        if (watchId) {
            window.removeEventListener('deviceorientation', handleOrientation);
            watchId = null;
        }
    }

    function handleOrientation(event) {
        const alpha = event.alpha;
        if (alpha !== null) {
            rotateNeedle(alpha);
        }
    }
});