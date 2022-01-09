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
    cell.classList = `datepicker__date${cellClass}`;
    if (year) {
      cell.innerHTML = date;
      cell.dataset.selected = false;
      cell.dataset.year = year;
      cell.dataset.month = month;
      cell.dataset.date = date;
    }
  }

  function makeCalendar() {
    let lastDate = new Date(year, month + 1, 0).getDate();
    let insertDay = new Date(year, month, 1).getDay();

    calendarTitle.innerHTML = `${year}. ${month + 1}월`;
    while (calendar.rows.length > 0) {
      calendar.deleteRow(-1);
    }
    row = calendar.insertRow();
    for (let i = 0; i < insertDay; i++) {
      makeTableData(0, 0, 0, row, " date--blocked");
    }
    for (let i = 1; i <= lastDate; i++) {
      if (insertDay !== 7) {
        makeTableData(year, month, i, row, " date--btn");
        insertDay += 1;
      }
      else {
        row = calendar.insertRow();
        makeTableData(year, month, i, row, " date--btn");
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
    makeCalendar();
    if (currentYear === year && currentMonth === month) {
      blockTableData(pastArray);
    }
  }

  function blockTableData(blockArray) {
    let blockObj, blockSelector;
    const blockClass = "datepicker__date date--blocked";

    for (let i = 0; i < blockArray.length; i++) {
      blockObj = blockArray[i];
      if (blockObj.year !== year || blockObj.month !== month) {
        blockArray.splice(i, 1);
        i--
      }
    }
    for (let i = 0; i < blockArray.length; i++) {
      blockSelector = `.date--btn[data-date="${blockArray[i].date}"]`;
      document.querySelector(blockSelector).classList = blockClass;
    }
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  let year = today.getFullYear();
  let month = today.getMonth();
  makeCalendar();
  let pastArray = [];
  for (let i = 1; i < currentDate; i++) {
    pastArray[i - 1] = { year: currentYear, month: currentMonth, date: i };
  }
  blockTableData(pastArray);

  previousBtn.addEventListener('click', () => {
    moveMonthHandler(-1);
  });
  nextBtn.addEventListener('click', () => {
    moveMonthHandler(1);
  });
}