const DAYS_PER_WEEK = 7;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

class Calendar {
  constructor($container) {
    this.$container = $container;

    const date = new Date();

    this.today = `${date.getFullYear()}-${Calendar.changeDateFormat(
      date.getMonth() + 1
    )}-${Calendar.changeDateFormat(date.getDate())}`; // => YYYY-MM-DD

    this.init();

    this.$container.addEventListener("click", (e) => {
      if (!e.target.closest(".calendarBtn")) return;
      e.stopPropagation();

      this.currentMonth += e.target.closest(".prev") ? -1 : 1;

      this.setDate();
    });

    this.$container.addEventListener("click", (e) => {
      if (!e.target.matches(".date")) return;

      this.selectedDate = e.target.dateTime;

      const dateSelectEvent = new CustomEvent("dateSelect", {
        detail: this.selectedDate,
        bubbles: true,
      });

      this.$container.dispatchEvent(dateSelectEvent);

      this.$container.querySelector(".selected")?.classList.remove("selected");
      e.target.classList.add("selected");
    });
  }

  static changeDateFormat(num) {
    return num.toString().padStart(2, "0");
  }

  render() {
    this.$container.innerHTML = `
      <nav class="calendarNav">
        <div>
          <time datetime="${this.currentMonth + 1}" class="month">${
      monthNames[this.currentMonth]
    }</time>
          <time datetime="${this.currentYear}-${Calendar.changeDateFormat(
      this.currentMonth + 1
    )}" class="year">${this.currentYear}</time>
        </div>
        <button type="button" class="calendarBtn prev">
          <i class="bx bxs-left-arrow"></i>
        </button>
        <button type="button" class="calendarBtn next">
          <i class="bx bxs-right-arrow"></i>
        </button>
      </nav>
      <div class="calendarGrid">
        ${dayNames.map((name) => `<div class="day">${name}</div>`).join("")}

        ${new Array(this.totalDates)
          .fill(null)
          .map((_, index) => this.getDate(index))
          .join("")}
      </div>
    `;
  }

  // prettier-ignore
  setDate() {
    const date = new Date(this.currentYear, this.currentMonth);

    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    this.firstDay = date.getDay();
    this.lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.prevMonthlastDate = new Date(this.currentYear, this.currentMonth, 0).getDate();

    // 달력에 표시될 총 일수: 5~6주 * 7일
    this.totalDates = Math.ceil((this.firstDay + this.lastDate) / DAYS_PER_WEEK) * DAYS_PER_WEEK;

    this.render();
  }

  async init() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    await this.setDate();
  }

  getDate(index) {
    let date = 0;
    let datetime = ""; // => YYYY-MM-DD
    let isCurrent = false;

    if (index - this.firstDay + 1 > this.lastDate) {
      // 다음 달
      date = index - this.lastDate - this.firstDay + 1;
      datetime = `${this.currentYear}-${Calendar.changeDateFormat(
        this.currentMonth + 2
      )}-${Calendar.changeDateFormat(date)}`;
    } else if (index >= this.firstDay) {
      // 이번 달
      date = index - this.firstDay + 1;
      datetime = `${this.currentYear}-${Calendar.changeDateFormat(
        this.currentMonth + 1
      )}-${Calendar.changeDateFormat(date)}`;
      isCurrent = true;
    } else if (index < this.firstDay) {
      // 이전 달
      date = this.prevMonthlastDate - (this.firstDay - index - 1);
      datetime = `${this.currentYear}-${Calendar.changeDateFormat(
        this.currentMonth
      )}-${Calendar.changeDateFormat(date)}`;
    }

    return `
      <time datetime="${datetime}" 
        class="
          date
          ${isCurrent ? "thisMonth" : "anotherMonth"}
          ${datetime === this.today ? "today" : ""}
          ${datetime === this.selectedDate ? "selected" : ""}
          ${new Date(datetime) < new Date(this.today) ? 'pastDay' : '' }
        ">${date}</time>
    `;
  }
}
