window.addEventListener('DOMContentLoaded', () => {
  const joinBtn = document.getElementById('joinButton');
  const overlay = document.getElementById('transitionOverlay');

  joinBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.style.opacity = '1';
    setTimeout(() => {
      window.location.href = 'form.html';
    }, 400); // Match transition timing
  });
});
