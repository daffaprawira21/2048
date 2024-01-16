document.addEventListener('DOMContentLoaded', function () {
  var popupMenu = document.getElementById('popupMenu');
  var closePopupIcon = document.getElementById('closePopup');

  // Fungsi untuk menampilkan pop-up
  function showPopup() {
    popupMenu.style.display = 'block';
  }

  // Fungsi untuk menyembunyikan pop-up
  function hidePopup() {
    popupMenu.style.display = 'none';
  }

  // Event listener untuk tombol play pada halaman index
  document.getElementById('play-btn').addEventListener('click', showPopup);
  // Event listener untuk ikon tutup
  closePopupIcon.addEventListener('click', hidePopup);
});
