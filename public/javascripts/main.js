const backBtn = document.querySelectorAll('.back-btn');
const modal = document.querySelector('.modal');
const calendar = document.querySelector('.datepicker tbody');

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

// 달력
if (calendar) {
  const calendarTitle = document.querySelector('.datepicker__title h3');
  const previousBtn = document.querySelector('.datepicker__title .sprite.left-arrow');
  const nextBtn = document.querySelector('.datepicker__title .sprite.right-arrow');

  function makeTableData(year, month, date, row, cellClass) {
    cell = row.insertCell();
    if (cellClass) cell.classList = `datepicker__date${cellClass}`;
    else {
      cell.classList = "datepicker__date";
      cell.innerHTML = date;
    }
  }
  function makeCalendar(year, month) {
    let firstDate = new Date(year, month, 1).getDate();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let insertDay = new Date(year, month, 1).getDay();

    calendarTitle.innerHTML = `${year}. ${month + 1}월`;
    while (calendar.rows.length > 0) {
      calendar.deleteRow(-1);
    }
    row = calendar.insertRow();
    for (i = 0; i < insertDay; i++) {
      makeTableData(0, 0, 0, row, " date--blocked");
    }
    for (i = 1; i <= lastDate; i++) {
      if (insertDay !== 7) {
        makeTableData(year, month, i, row);
        insertDay += 1;
      }
      else {
        row = calendar.insertRow();
        makeTableData(year, month, i, row);
        insertDay -= 6;
      }
    }
  }
  function moveMonthHandler(n) {
    if (currentYear === year && currentMonth > month + n) return;
    month = month + n;
    if (month === -1) {
      year -= 1;
      month += 12;
    } else if (month === 12) {
      year += 1;
      month -= 12;
    }
    makeCalendar(year, month);
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  let year = today.getFullYear();
  let month = today.getMonth();
  makeCalendar(year, month);

  previousBtn.addEventListener('click', () => {
    moveMonthHandler(-1);
  });
  nextBtn.addEventListener('click', () => {
    moveMonthHandler(1);
  });
}