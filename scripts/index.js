window.addEventListener('DOMContentLoaded', () => {
    const linkZone = document.querySelector('.join-familia-zone');
    if (linkZone) {
      linkZone.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = 'form.html';
        }, 4000);
      });
    }
  });