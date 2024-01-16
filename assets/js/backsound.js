document.addEventListener('DOMContentLoaded', function () {
  var backgroundSound = document.getElementById('backgroundSound');
  var toggleSoundButton = document.getElementById('toggleSound');

  toggleSoundButton.addEventListener('click', function () {
    if (backgroundSound.paused) {
      backgroundSound.play();
      toggleSoundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      backgroundSound.pause();
      toggleSoundButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  });
});
