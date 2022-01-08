const backBtn = document.querySelectorAll('.back-btn');
const modal = document.querySelector('.modal');

// 뒤로가기
if (backBtn) {
  backBtn.forEach((element) => {
    element.addEventListener('click', () => {
      if (document.referrer) window.history.back();
      else location.href = "./index.html";
    });
  });
}

// modal 열기
if (modal) {
  const body = document.body;
  const modalBackground = document.querySelector('.modal__background');
  const modalBtn = document.querySelector('.detail-bar__button-wrapper .btn:first-child');

  function modalCloseHandler() {
    body.classList.toggle('overflow--hidden')
    modal.classList.toggle('hidden')
  }

  modalBtn.addEventListener('click', modalCloseHandler);
  modalBackground.addEventListener('click', modalCloseHandler);
}