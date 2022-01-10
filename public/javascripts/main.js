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
  const BLOCK_CLASS = "datepicker__date date--blocked";
  const BTN_CLASS = "datepicker__date date--btn";
  const SELECTED_CLASS = "datepicker__date date--btn date--selected";

  function makeTableData(year, month, date, row, cellClass) {
    cell = row.insertCell();
    cell.classList = `${cellClass}`;
    if (year) {
      cell.innerHTML = date;
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
      makeTableData(0, 0, 0, row, BLOCK_CLASS);
    }
    for (let i = 1; i <= lastDate; i++) {
      if (insertDay !== 7) {
        makeTableData(year, month, i, row, BTN_CLASS);
        insertDay += 1;
      }
      else {
        row = calendar.insertRow();
        makeTableData(year, month, i, row, BTN_CLASS);
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
    addClickEvent();
    addSelectedStyle();
  }

  function blockTableData(blockArray) {
    let blockObj, blockSelector;

    for (let i = 0; i < blockArray.length; i++) {
      blockObj = blockArray[i];
      if (blockObj.year !== year || blockObj.month !== month) {
        blockArray.splice(i, 1);
        i--
      }
    }
    for (let i = 0; i < blockArray.length; i++) {
      blockSelector = `.date--btn[data-date="${blockArray[i].date}"]`;
      document.querySelector(blockSelector).classList = BLOCK_CLASS;
    }
  }

  function addSelectedStyle() {
    let selectedBtn = document.querySelectorAll(".date--selected");
    let selectedDataset = calendar.dataset.selectedDate;
    let selectedDate = [];
    let selectedSelector;
    let lastDate = new Date(year, month + 1, 0).getDate();

    if (selectedDataset) {
      selectedDate = JSON.parse(selectedDataset);
      if (selectedDate.length === 1) {
        if (selectedDate[0].year == year && selectedDate[0].month == month) {
          selectedBtn.forEach((element) => {
            element.classList = BTN_CLASS;
          });
          selectedSelector = `.date--btn[data-date="${selectedDate[0].date}"]`;
          document.querySelector(selectedSelector).classList = SELECTED_CLASS;
        }
      }
      else if (selectedDate.length === 2) {
        let selectedDate1 = new Date(`${selectedDate[0].year}`, `${selectedDate[0].month}`, `${selectedDate[0].date}`);
        let selectedDate2 = new Date(`${selectedDate[1].year}`, `${selectedDate[1].month}`, `${selectedDate[1].date}`);
        if (selectedDate1 > selectedDate2) {
          selectedDate = [selectedDate[1], selectedDate[0]];
        }
        if (selectedDate[0].month === selectedDate[1].month) {
          if (selectedDate[0].year == year && selectedDate[0].month == month) {
            selectedSelector = `.date--btn[data-date="${selectedDate[0].date}"]`;
            document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected1`;
            for (let i = Number(selectedDate[0].date) + 1; i < selectedDate[1].date; i++) {
              selectedSelector = `.date--btn[data-date="${i}"]`;
              document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected2`;
            }
            selectedSelector = `.date--btn[data-date="${selectedDate[1].date}"]`;
            document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected3`;
          }
        }
        else {
          if (selectedDate[0].year == year && selectedDate[0].month == month) {
            selectedSelector = `.date--btn[data-date="${selectedDate[0].date}"]`;
            document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected1`;
            for (let i = Number(selectedDate[0].date) + 1; i <= lastDate; i++) {
              selectedSelector = `.date--btn[data-date="${i}"]`;
              document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected2`;
            }
          }
          else if (selectedDate[1].year == year && selectedDate[1].month == month) {
            for (let i = 1; i < selectedDate[1].date; i++) {
              selectedSelector = `.date--btn[data-date="${i}"]`;
              document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected2`;
            }
            selectedSelector = `.date--btn[data-date="${selectedDate[1].date}"]`;
            document.querySelector(selectedSelector).classList = `${SELECTED_CLASS} date--selected3`;
          }
        }
      }
    }
    else if (selectedBtn.length) selectedBtn[0].classList = BTN_CLASS;
  }

  function clickBtnHandler(event) {
    let targetDate = event.currentTarget;
    let selectedDataset = calendar.dataset.selectedDate;
    let selectedDate = [];

    if (selectedDataset) {
      selectedDate = JSON.parse(selectedDataset);
      if (selectedDate.length === 1) {
        if (JSON.stringify(selectedDate[0]) === JSON.stringify(targetDate.dataset)) {
          calendar.dataset.selectedDate = "";
          addSelectedStyle();
          return;
        }
      }
      else if (selectedDate.length > 1) {
        selectedDate = [targetDate.dataset];
        calendar.dataset.selectedDate = JSON.stringify(selectedDate);
        addSelectedStyle();
        return;
      }
    }
    selectedDate[selectedDate.length] = targetDate.dataset;
    calendar.dataset.selectedDate = JSON.stringify(selectedDate);
    addSelectedStyle();
  }

  function addClickEvent() {
    dateBtn = document.querySelectorAll(".date--btn");
    dateBtn.forEach((element) => {
      element.addEventListener('click', clickBtnHandler);
    });
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
  addClickEvent();

  previousBtn.addEventListener('click', () => moveMonthHandler(-1));
  nextBtn.addEventListener('click', () => moveMonthHandler(1));
}