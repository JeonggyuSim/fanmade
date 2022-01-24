const backBtn = document.querySelectorAll('.back-btn');
const modal = document.querySelector('.modal');
const calendar = document.querySelector('.calendar__datepicker tbody');
const placeBook = document.querySelector('.place-book .btn');
const eventAttend = document.querySelector('.event-attend .btn');
const inputPersonalImg = document.querySelector('#input-personal-img');
const contentPaging = document.querySelectorAll('.multi-step__tab');
const dropDownBtn = document.querySelectorAll('button.drop-down__btn');
const tagInput = document.querySelector('#create-event__tag-input');
const imageMutiInput = document.querySelector('#create-event__main-image');
const descImageInput = document.querySelector('#create-event__desc-image');

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
    const modalBackBtn = document.querySelector('.modal__back-btn');
    const detailBtn = document.querySelectorAll('.detail-bar__button-wrapper .btn');
    const optionBtn = detailBtn[0];
    const completeBtn = detailBtn[1];
    const eventOptionBtn = document.querySelector('.event-detail .option__btn');
    const placeOptionBtn = document.querySelector('.place-detail .option__btn');
    const createOptionBtn = document.querySelector('.create-event .option__btn');
    const imageModalBtn = document.querySelector('.image-modal-btn');


    function modalOpenHandler() {
      body.classList.add('overflow--hidden');
      modal.classList.remove('hidden');
    }

    function modalCloseHandler() {
      body.classList.remove('overflow--hidden');
      modal.classList.add('hidden');
    }

    modalBackground.addEventListener('click', modalCloseHandler);

    if (optionBtn) optionBtn.addEventListener('click', modalOpenHandler);

    if (eventOptionBtn) {
      (function () {
        const eventOption = document.querySelectorAll('.event-detail .detail-bar__option span');
        const optionTitle = eventOption[0];
        const optionCost = eventOption[1];

        optionBtn.addEventListener('click', () => {
          let confirmedOption = optionTitle.dataset.selectedOption;
          if (!confirmedOption) {
            let checkedRadio = document.querySelector('input[name="event-option"]:checked');
            if (checkedRadio) checkedRadio.checked = false;
            return;
          }
          let checkedSelector = `input#${confirmedOption}`;
          document.querySelector(checkedSelector).checked = true;
        });
        eventOptionBtn.addEventListener('click', () => {
          let checkedRadio = document.querySelector('input[name="event-option"]:checked');
          if (!checkedRadio) return modalCloseHandler();
          optionTitle.dataset.selectedOption = checkedRadio.id;
          let checkedSelector = `label[for="${checkedRadio.id}"] .option__label-wrapper div`;
          let checkedLabel = document.querySelector(checkedSelector).children;
          optionTitle.innerHTML = checkedLabel[0].innerHTML;
          optionCost.innerHTML = checkedLabel[1].innerHTML;
          modalCloseHandler();
        });
        completeBtn.addEventListener('click', () => {
          let checkedRadio = document.querySelector('input[name="event-option"]:checked');
          if (!checkedRadio) return alert("옵션을 선택해주세요.");
          location.href = "./event_attend.html";
        });
      })();
    }

    if (placeOptionBtn) {
      (function () {
        const placeOption = document.querySelectorAll('.place-detail .detail-bar__option span');
        const optionDate = placeOption[0];
        const optionPeriod = placeOption[1];
        let selectedArray = [];

        optionBtn.addEventListener('click', () => {
          let confirmedOption = optionDate.dataset.selectedOption;
          if (!confirmedOption) return calendar.dataset.selectedDate = "";
          calendar.dataset.selectedDate = confirmedOption;
        });

        placeOptionBtn.addEventListener('click', () => {
          let selectedDataset = calendar.dataset.selectedDate;
          if (!selectedDataset) {
            optionDate.innerHTML = "선택 없음";
            optionPeriod.innerHTML = "";
            optionDate.dataset.selectedOption = "";
            modalCloseHandler();
            return;
          }

          selectedArray = JSON.parse(selectedDataset);
          let selected1 = selectedArray[0];
          let selectedMonth1 = Number(selected1.month);
          let selectedDate1 = Number(selected1.date);
          if (selectedArray.length === 1) {
            optionDate.innerHTML = `${selectedMonth1 + 1}월 ${selectedDate1}일`;
            optionPeriod.innerHTML = "(1일)";
            optionDate.dataset.selectedOption = selectedDataset;
            modalCloseHandler();
            return;
          }
          else if (selectedArray.length === 2) {
            let selected2 = selectedArray[1];
            let selectedMonth2 = Number(selected2.month);
            let selectedDate2 = Number(selected2.date);
            let selectedFullDate1 = new Date(selected1.year, selectedMonth1, selectedDate1);
            let selectedFullDate2 = new Date(selected2.year, selectedMonth2, selectedDate2);
            let diff = selectedFullDate2.getTime() - selectedFullDate1.getTime();
            let period = (diff / (1000 * 3600 * 24)) + 1;

            optionDate.innerHTML = `${selectedMonth1 + 1}월 ${selectedDate1}일 ~ ${selectedMonth2 + 1}월 ${selectedDate2}일`;
            optionPeriod.innerHTML = `(${period}일)`;
            optionDate.dataset.selectedOption = selectedDataset;
            modalCloseHandler();
            return;
          }
        });
        completeBtn.addEventListener('click', () => {
          let selectedDataset = calendar.dataset.selectedDate;
          if (!selectedDataset) return alert("날짜를 선택해주세요.");
          location.href = "./place_book.html";
        });
      })();
    }

    if (createOptionBtn) {
      (function () {
        const datePickerBtn = document.querySelector('.create-event .calendar-btn');
        const eventPeriodInput = document.querySelector('#create-event__period');
        const datePickerInput = datePickerBtn.previousElementSibling;
        eventPeriodInput.value = JSON.stringify([{ year: 2022, month: 3, date: 6 }, { year: 2022, month: 3, date: 10 }]);
        let dateArray = [];
        const eventPeriod = eventPeriodInput.value;

        if (!eventPeriod) location.href = "./404.html";
        dateArray = JSON.parse(eventPeriod);
        const eventDate1 = dateArray[0];
        if (dateArray.length > 1) {
          const eventDate2 = dateArray[1];
          eventPeriodInput.nextElementSibling.innerText = `${eventDate1.year}년 ${eventDate1.month + 1}월 ${eventDate1.date}일 - ${eventDate2.year}년 ${eventDate2.month + 1}월 ${eventDate2.date}일`;
        }
        else eventPeriodInput.nextElementSibling.innerText = `${eventDate1.year}년 ${eventDate1.month + 1}월 ${eventDate1.date}일`;

        calendar.dataset.maxDate = JSON.stringify(eventDate1);

        datePickerBtn.addEventListener('click', () => {
          body.classList.add('overflow--hidden');
          modal.classList.remove('hidden');
        });
        createOptionBtn.addEventListener('click', () => {
          let selectedDataset = calendar.dataset.selectedDate;
          if (!selectedDataset) {
            datePickerBtn.innerText = "YY.MM.DD - YY.MM.DD";
            datePickerInput.value = "";
            modalCloseHandler();
            return;
          }

          dateArray = JSON.parse(selectedDataset);
          let selected1 = dateArray[0];
          let selectedYear1 = Number(selected1.year);
          let selectedMonth1 = Number(selected1.month);
          let selectedDate1 = Number(selected1.date);
          if (dateArray.length === 1) {
            datePickerBtn.innerText = `${selectedYear1}년 ${selectedMonth1 + 1}월 ${selectedDate1}일`;
            datePickerInput.value = selectedDataset;
            modalCloseHandler();
            return;
          }
          else if (dateArray.length === 2) {
            let selected2 = dateArray[1];
            let selectedYear2 = Number(selected2.year);
            let selectedMonth2 = Number(selected2.month);
            let selectedDate2 = Number(selected2.date);

            datePickerBtn.innerText = `${selectedYear1}년 ${selectedMonth1 + 1}월 ${selectedDate1}일 - ${selectedYear2}년 ${selectedMonth2 + 1}월 ${selectedDate2}일`;
            datePickerInput.value = selectedDataset;
            modalCloseHandler();
            return;
          }

        });
      })();
    }

    if (imageModalBtn) {
      (function () {
        const imageModal = document.querySelector('.image-modal');


        modalBackBtn.addEventListener('click', () => {
          body.classList.remove('overflow--hidden');
          imageModal.classList.add('hidden');
        });

        imageModalBtn.addEventListener('click', () => {
          body.classList.add('overflow--hidden');
          imageModal.classList.remove('hidden');
        });
      })();
    }

  })();
}

// 이벤트 참가 
if (eventAttend) {
  (function () {
    eventAttend.addEventListener('click', () => {
      location.href = "./attend_complete.html";
    });
  })();

}

// 장소 예약 
if (placeBook) {
  (function () {
    placeBook.addEventListener('click', () => {
      location.href = "./book_complete.html";
    });
  })();
}

// 이미지 업로드
if (inputPersonalImg) {
  (function () {
    inputPersonalImg.addEventListener('change', () => {
      if (!inputPersonalImg.files[0]) return;
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const personalImage = document.querySelector('.personal-img img');
        personalImage.src = e.target.result;
      });
      reader.readAsDataURL(inputPersonalImg.files[0]);
    });
  })();
}

if (descImageInput) {
  (function () {
    const imageBtnWrapper = document.querySelectorAll('.desc-image__btn-wrapper > *');
    const modalView = document.querySelector('.image-modal .modal__image');
    const imageLabel = imageBtnWrapper[0];
    const imageBtn = imageBtnWrapper[1];
    const viewBtn = imageBtnWrapper[2];

    descImageInput.addEventListener('change', () => {
      if (!descImageInput.files[0]) return;
      imageLabel.classList.add('hidden');
      imageBtn.classList.remove('hidden');
      imageBtn.children[0].innerHTML = descImageInput.files[0].name;

      const reader = new FileReader();
      const image = document.createElement('img');

      reader.addEventListener('load', (event) => {
        image.src = event.target.result;
      });
      modalView.appendChild(image);
      reader.readAsDataURL(descImageInput.files[0]);
      viewBtn.classList.remove('btn--block');
    });
    imageBtn.addEventListener('click', () => {
      descImageInput.value = "";
      imageLabel.classList.remove('hidden');
      imageBtn.classList.add('hidden');
      viewBtn.classList.add('btn--block');
    })
  })();
}

// 이미지 여러개 
if (imageMutiInput) {
  (function () {
    imageMutiInput.addEventListener('change', () => {
      if (!imageMutiInput.files) return;
      const imageArr = Array.from(imageMutiInput.files);
      const imageView = document.querySelector('.main-image__list');
      const imageViewList = document.querySelectorAll('.main-image__list li');
      const inputImage = document.querySelectorAll('.main-image__list li img');

      if ((inputImage.length + imageArr.length) > 5) return alert("5개 초과");
      imageArr.forEach((file, index) => {
        const reader = new FileReader();
        const image = document.createElement('img');
        const button = document.createElement('button');
        button.type = "button";
        button.classList = "sprite x-icon";

        image.addEventListener('click', (event) => {
          event.preventDefault();
        });
        button.addEventListener('click', function (event) {
          event.preventDefault();
          this.parentNode.remove();
          const li = document.createElement('li');
          imageView.appendChild(li);
        });
        reader.addEventListener('load', (event) => {
          image.src = event.target.result;
        });
        imageViewList[inputImage.length + index].appendChild(image);
        imageViewList[inputImage.length + index].appendChild(button);
        reader.readAsDataURL(file);
      });
    });
  })();
}

// 드롭 다운 버튼
if (dropDownBtn) {
  (function () {
    const dropDownList = document.querySelectorAll('.drop-down__menu li');
    const dropDownInput = document.querySelector('#create-event__location');

    dropDownBtn.forEach((element) => {
      element.addEventListener('click', function () {
        const dropDownMenu = this.nextElementSibling;
        dropDownMenu.classList.toggle('hidden');
      });
    });
    window.addEventListener('click', (event) => {
      if (!event.target.matches('.drop-down__btn')) {
        const dropDownMenus = document.querySelectorAll('.drop-down__menu');
        dropDownMenus.forEach((element) => {
          element.classList.add('hidden');
        })
      }
    });
    dropDownList.forEach((element) => {
      element.addEventListener('click', function () {
        const selectedList = this.innerHTML;
        this.parentNode.previousElementSibling.children[0].innerHTML = selectedList;
        if (dropDownInput) dropDownInput.value = selectedList;
      })
    })
  })();
}

// 태그 입력
if (tagInput) {
  (function () {
    const tagList = document.querySelector('.tag__list');
    const tagValue = document.querySelector('#create-event__tag');
    const tag = tagList.childNodes;
    const tagArray = [];

    tagInput.addEventListener('change', function () {
      if (tag.length > 4) return alert("5개 초과");
      tag.forEach((element) => {
        if (element.innerText === tagInput.value) {
          tagInput.value = "";
          alert("중복");
        }
      });
      if (!tagInput.value) return;

      let li = document.createElement('li');
      li.innerHTML = `<span>${tagInput.value}</span><span class="sprite x-icon"></span>`;
      li.addEventListener('click', function () {
        tagArray.forEach((element, index) => {
          if (element === this.innerText) {
            tagArray.splice(index, 1);
            index--;
          }
        });
        this.remove();
        tagValue.value = JSON.stringify(tagArray);
      });
      tagList.appendChild(li);
      tagArray.push(tagInput.value);
      tagInput.value = "";
      tagValue.value = JSON.stringify(tagArray);
    })

  })();
}

// 페이징
if (contentPaging.length) {
  (function () {
    const pageTitle = document.querySelectorAll('.multi-step-form__btn p span');
    const pageBtn = document.querySelectorAll('.multi-step-form__btn div .btn');
    const currentPage = pageTitle[0];
    const maxPage = pageTitle[1];
    const previousPage = pageBtn[0];
    const nextPage = pageBtn[1];
    const completePage = pageBtn[2];
    const maxPageNum = contentPaging.length;
    maxPage.innerHTML = maxPageNum;
    let pageNum = 0;

    function validateForm() {
      const requiredInput = contentPaging[pageNum].querySelectorAll(':required, input[type="hidden"]');
      const radioInput = contentPaging[pageNum].querySelectorAll('input[type="radio"]');
      let valid = true;

      if (radioInput.length) {
        const radioChecked = contentPaging[pageNum].querySelector('input[type="radio"]:checked');
        if (!radioChecked) valid = false;
      }
      requiredInput.forEach((element) => {
        if (!element.value) valid = false;
      })
      return valid;
    }

    function pageHandler(n) {
      if (pageNum + n < 0) return;
      else if (pageNum + n >= maxPageNum) return;

      if (n > 0) {
        if (!validateForm()) return alert("입력 필수");
      }

      if (pageNum === maxPageNum - 1 && n === -1) {
        nextPage.classList.remove('hidden');
        completePage.classList.add('hidden');
      }
      contentPaging[pageNum].classList.toggle('hidden');
      pageNum += n;
      currentPage.innerHTML = pageNum + 1;
      contentPaging[pageNum].classList.toggle('hidden');
      if (pageNum === maxPageNum - 1) {
        nextPage.classList.add('hidden');
        completePage.classList.remove('hidden');
      }
    }

    previousPage.addEventListener('click', () => pageHandler(-1));
    nextPage.addEventListener('click', () => pageHandler(1));
  })();
}

// 달력
if (calendar) {
  (function () {
    const optionBtn = document.querySelector('.calendar-btn');
    const calendarTitle = document.querySelector('.calendar__title h3');
    const previousBtn = document.querySelector('.calendar__title .sprite.left-arrow');
    const nextBtn = document.querySelector('.calendar__title .sprite.right-arrow');
    const BLOCK_CLASS = "datepicker__date date--blocked";
    const BTN_CLASS = "datepicker__date date--btn";
    const SELECTED_CLASS = "datepicker__date date--btn date--selected";
    const MAX_BLOCK_CLASS = "datepicker__date date--max-blocked";
    const MAX_PERIOD = Number(calendar.dataset.maxPeriod);

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
      const lastDate = new Date(year, month + 1, 0).getDate();
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
      const calendarDate = new Date(year, month + n + 1, 1);

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
      const lastDate = new Date(year, month + 1, 0).getDate();
      makeCalendar();
      if (currentYear === year && currentMonth === month) {
        blockTableData(pastArray);
      }
      else if (maxCalendarYear === year && maxCalendarMonth === month) {
        const blockArray = [];

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
      const dateBtn = document.querySelectorAll(".date--btn");
      const selectedBtn = document.querySelectorAll(".date--selected");
      const maxBlockedBtn = document.querySelectorAll(".date--max-blocked");
      const selectedDataset = calendar.dataset.selectedDate;
      let selectedArray = [];
      let dateSelector, checkBtn;
      const lastDate = new Date(year, month + 1, 0).getDate();

      if (selectedDataset) {
        selectedArray = JSON.parse(selectedDataset);
        const selectedFullDate1 = selectedArray[0];
        const selectedYear1 = Number(selectedFullDate1.year);
        const selectedMonth1 = Number(selectedFullDate1.month);
        const selectedDate1 = Number(selectedFullDate1.date);

        if (selectedArray.length === 1) {
          if (selectedYear1 == year && selectedMonth1 == month) {
            selectedBtn.forEach((element) => {
              element.classList = BTN_CLASS;
            });
            if (MAX_PERIOD) {
              for (i = selectedDate1 + MAX_PERIOD; i <= lastDate; i++) {
                if (i <= lastDate) {
                  dateSelector = `.date--btn[data-date="${i}"]`;
                  checkBtn = document.querySelector(dateSelector);
                  if (checkBtn) checkBtn.classList = MAX_BLOCK_CLASS;
                }
              }
            }
            dateSelector = `.date--btn[data-date="${selectedDate1}"]`;
            document.querySelector(dateSelector).classList = SELECTED_CLASS;
          }
          else if (MAX_PERIOD && new Date(year, month, 1) > new Date(selectedYear1, selectedMonth1, 1)) {
            dateBtn.forEach((element) => {
              element.classList = MAX_BLOCK_CLASS;
            });
            const selectedLastDate = new Date(selectedYear1, selectedMonth1 + 1, 0).getDate();
            const selectedNext = new Date(selectedYear1, selectedMonth1 + 1, 1);

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
          const selectedFullDate2 = selectedArray[1];
          const selectedYear2 = Number(selectedFullDate2.year);
          const selectedMonth2 = Number(selectedFullDate2.month);
          let selectedDate2 = Number(selectedFullDate2.date);

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
      const targetDate = event.currentTarget;
      const selectedDataset = calendar.dataset.selectedDate;
      let selectedArray = [];

      if (selectedDataset) {
        selectedArray = JSON.parse(selectedDataset);
        if (selectedArray.length === 1) {
          const selectedDate = selectedArray[0];

          if (JSON.stringify(selectedDate) === JSON.stringify(targetDate.dataset)) {
            calendar.dataset.selectedDate = "";
            addSelectedStyle();
            return;
          }
          const selectedDate1 = new Date(selectedDate.year, selectedDate.month, selectedDate.date);
          const selectedDate2 = new Date(targetDate.dataset.year, targetDate.dataset.month, targetDate.dataset.date);
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
      const dateBtn = document.querySelectorAll(".date--btn");
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
    let maxCalendarFullDate;
    const maxDataset = calendar.dataset.maxDate;

    if (maxDataset) {
      const maxDate = JSON.parse(maxDataset);
      maxCalendarFullDate = new Date(maxDate.year, maxDate.month, maxDate.date);

    }
    else {
      maxCalendarFullDate = new Date(currentYear, currentMonth, currentDate + 90);
    }
    const maxCalendarYear = maxCalendarFullDate.getFullYear();
    const maxCalendarMonth = maxCalendarFullDate.getMonth();
    const maxCalendarDate = maxCalendarFullDate.getDate();
    const maxCalendar = new Date(maxCalendarYear, maxCalendarMonth + 1, 1);


    makeCalendar();
    const pastArray = [];
    for (let i = 1; i < currentDate; i++) {
      pastArray[i - 1] = { year: currentYear, month: currentMonth, date: i };
    }
    blockTableData(pastArray);
    addClickEvent();

    optionBtn.addEventListener('click', () => moveMonthHandler(0));
    previousBtn.addEventListener('click', () => moveMonthHandler(-1));
    nextBtn.addEventListener('click', () => moveMonthHandler(1));
  })();
}