const backBtn = document.querySelectorAll('.back-btn');
const modal = document.querySelector('.modal');
const calendar = document.querySelector('.datepicker tbody');

// 뒤로가기
if (backBtn) {
  (function () {
    backBtn.forEach((element) => {
      element.addEventListener('click', () => {
        if (document.referrer) window.history.back();
        else location.href = "./index.html";
      });
    });
  })();
}

// modal 열기
if (modal) {
  (function () {
    const body = document.body;
    const modalBackground = document.querySelector('.modal__background');
    const optionModal = document.querySelector('.modal__option');
    const modalBtn = document.querySelectorAll('.detail-bar__button-wrapper .btn');
    const optionBtn = modalBtn[0];
    const eventOptionBtn = document.querySelector('.event-detail .option__btn');
    const placeOptionBtn = document.querySelector('.place-detail .option__btn');

    function modalOpenHandler() {
      body.classList.add('overflow--hidden');
      modal.classList.remove('hidden');
    }

    function modalCloseHandler() {
      body.classList.remove('overflow--hidden');
      modal.classList.add('hidden');
      optionModal.classList.add('hidden');
    }

    optionBtn.addEventListener('click', modalOpenHandler);
    modalBackground.addEventListener('click', modalCloseHandler);
    optionBtn.addEventListener('click', () => {
      optionModal.classList.remove('hidden');
    });

    if (eventOptionBtn) {
      (function () {
        const eventOption = document.querySelector('.event-detail .detail-bar-wrapper .heading4');
        const completeBtn = modalBtn[1];

        eventOptionBtn.addEventListener('click', () => {
          let checkedRadio = document.querySelector('input[name="event-option"]:checked');
          if (!checkedRadio) {
            modalCloseHandler();
            return;
          }
          let checkedSelector = `label[for="${checkedRadio.id}"] h3`;
          let checkedLabel = document.querySelector(checkedSelector).innerHTML;
          eventOption.innerHTML = checkedLabel;
          modalCloseHandler();
        });
        completeBtn.addEventListener('click', () => {
          let checkedRadio = document.querySelector('input[name="event-option"]:checked');
          if (!checkedRadio) {
            alert("옵션을 선택해주세요.");
            return;
          }
          modalOpenHandler();
        });
      })();
    }
  })();
}

// 이벤트 옵션


// 달력
if (calendar) {
  (function () {
    const calendarTitle = document.querySelector('.datepicker__title h3');
    const previousBtn = document.querySelector('.datepicker__title .sprite.left-arrow');
    const nextBtn = document.querySelector('.datepicker__title .sprite.right-arrow');
    const BLOCK_CLASS = "datepicker__date date--blocked";
    const BTN_CLASS = "datepicker__date date--btn";
    const SELECTED_CLASS = "datepicker__date date--btn date--selected";
    const MAX_BLOCK_CLASS = "datepicker__date date--max-blocked";
    const MAX_PERIOD = 14;

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
      let calendarDate = new Date(year, month + n + 1, 1);
      let maxCalendarFullDate = new Date(currentYear, currentMonth, currentDate + 90);
      let maxCalendarYear = maxCalendarFullDate.getFullYear();
      let maxCalendarMonth = maxCalendarFullDate.getMonth();
      let maxCalendarDate = maxCalendarFullDate.getDate();
      let maxCalendar = new Date(maxCalendarYear, maxCalendarMonth + 1, 1);

      if (today > calendarDate) return;
      else if (calendarDate > maxCalendar) return;
      month = month + n;
      if (month === -1) {
        year -= 1;
        month += 12;
      } else if (month === 12) {
        year += 1;
        month -= 12;
      }
      let lastDate = new Date(year, month + 1, 0).getDate();
      makeCalendar();
      if (currentYear === year && currentMonth === month) {
        blockTableData(pastArray);
      }
      else if (maxCalendarYear === year && maxCalendarMonth === month) {
        let blockArray = [];

        for (let i = maxCalendarDate; i <= lastDate; i++) {
          blockArray[i - maxCalendarDate] = { year: maxCalendarYear, month: maxCalendarMonth, date: i };
        }
        blockTableData(blockArray);
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
      let dateBtn = document.querySelectorAll(".date--btn");
      let selectedBtn = document.querySelectorAll(".date--selected");
      let maxBlockedBtn = document.querySelectorAll(".date--max-blocked");
      let selectedDataset = calendar.dataset.selectedDate;
      let selectedArray = [];
      let dateSelector, checkBtn;
      let lastDate = new Date(year, month + 1, 0).getDate();

      if (selectedDataset) {
        selectedArray = JSON.parse(selectedDataset);
        let selectedYear1 = Number(selectedArray[0].year);
        let selectedMonth1 = Number(selectedArray[0].month);
        let selectedDate1 = Number(selectedArray[0].date);

        if (selectedArray.length === 1) {
          if (selectedYear1 == year && selectedMonth1 == month) {
            selectedBtn.forEach((element) => {
              element.classList = BTN_CLASS;
            });
            for (i = selectedDate1 + MAX_PERIOD; i <= lastDate; i++) {
              if (i <= lastDate) {
                dateSelector = `.date--btn[data-date="${i}"]`;
                checkBtn = document.querySelector(dateSelector);
                if (checkBtn) checkBtn.classList = MAX_BLOCK_CLASS;
              }
            }
            dateSelector = `.date--btn[data-date="${selectedDate1}"]`;
            document.querySelector(dateSelector).classList = SELECTED_CLASS;
          }
          else if (new Date(year, month, 1) > new Date(selectedYear1, selectedMonth1, 1)) {
            dateBtn.forEach((element) => {
              element.classList = MAX_BLOCK_CLASS;
            });
            let selectedLastDate = new Date(selectedYear1, selectedMonth1 + 1, 0).getDate();
            let selectedNext = new Date(selectedYear1, selectedMonth1 + 1, 1);

            if (selectedNext.getFullYear() === year && selectedNext.getMonth() === month && selectedDate1 + MAX_PERIOD > selectedLastDate) {
              for (i = 1; i < selectedDate1 + MAX_PERIOD - selectedLastDate; i++) {
                if (i <= lastDate) {
                  dateSelector = `.date--max-blocked[data-date="${i}"]`;
                  checkBtn = document.querySelector(dateSelector);
                  if (checkBtn) checkBtn.classList = BTN_CLASS;
                }
              }

            }
          }
        }
        else if (selectedArray.length === 2) {
          let selectedYear2 = Number(selectedArray[1].year);
          let selectedMonth2 = Number(selectedArray[1].month);
          let selectedDate2 = Number(selectedArray[1].date);

          if (selectedYear1 === year && selectedMonth1 === month) {
            if (selectedMonth1 !== selectedMonth2) selectedDate2 += lastDate;
            dateSelector = `.date--btn[data-date="${selectedDate1}"]`;
            document.querySelector(dateSelector).classList = `${SELECTED_CLASS} date--selected1`;
            for (let i = selectedDate1 + 1; i < selectedDate2; i++) {
              if (i <= lastDate) {
                dateSelector = `.date--btn[data-date="${i}"]`;
                document.querySelector(dateSelector).classList = `${SELECTED_CLASS} date--selected2`;
              }
            }
            if (selectedDate2 <= lastDate) {
              dateSelector = `.date--btn[data-date="${selectedDate2}"]`;
              document.querySelector(dateSelector).classList = `${SELECTED_CLASS} date--selected3`;
            }
          }
          else if (selectedYear2 === year && selectedMonth2 === month) {
            for (let i = 1; i < selectedDate2; i++) {
              dateSelector = `.date--btn[data-date="${i}"]`;
              document.querySelector(dateSelector).classList = `${SELECTED_CLASS} date--selected2`;
            }
            dateSelector = `.date--btn[data-date="${selectedDate2}"]`;
            document.querySelector(dateSelector).classList = `${SELECTED_CLASS} date--selected3`;
          }
          if (maxBlockedBtn.length) {
            maxBlockedBtn.forEach((element) => {
              element.classList = BTN_CLASS;
            });
          }
        }
      }
      else {
        if (selectedBtn.length) selectedBtn[0].classList = BTN_CLASS;
        maxBlockedBtn.forEach((element) => {
          element.classList = BTN_CLASS;
        });
      }
    }

    function clickBtnHandler(event) {
      let targetDate = event.currentTarget;
      let selectedDataset = calendar.dataset.selectedDate;
      let selectedArray = [];

      if (selectedDataset) {
        selectedArray = JSON.parse(selectedDataset);
        if (selectedArray.length === 1) {
          let selectedDate = selectedArray[0];

          if (JSON.stringify(selectedDate) === JSON.stringify(targetDate.dataset)) {
            calendar.dataset.selectedDate = "";
            addSelectedStyle();
            return;
          }
          let selectedDate1 = new Date(selectedDate.year, selectedDate.month, selectedDate.date);
          let selectedDate2 = new Date(targetDate.dataset.year, targetDate.dataset.month, targetDate.dataset.date);
          if (selectedDate1 > selectedDate2) {
            selectedArray = [targetDate.dataset];
            calendar.dataset.selectedDate = JSON.stringify(selectedArray);
            addSelectedStyle();
            return;
          }
        }
        else if (selectedArray.length > 1) {
          selectedArray = [targetDate.dataset];
          calendar.dataset.selectedDate = JSON.stringify(selectedArray);
          addSelectedStyle();
          return;
        }
      }
      selectedArray[selectedArray.length] = targetDate.dataset;
      calendar.dataset.selectedDate = JSON.stringify(selectedArray);
      addSelectedStyle();
    }

    function addClickEvent() {
      let dateBtn = document.querySelectorAll(".date--btn");
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
  })();
}