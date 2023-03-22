class DatePicker {
  constructor($container) {
    this.$container = $container;

    this.init();

    this.$container.addEventListener("focusin", (e) => {
      if (!e.target.matches(".datePicker")) return;

      this.$datePicker.classList.add("active");
    });

    window.addEventListener("click", (e) => {
      
      if (
        this.$datePicker.contains(e.target) ||
        this.$calendar.contains(e.target)
      )
        return;
      
      this.$datePicker.classList.remove("active");
    });

    this.$container.addEventListener("dateSelect", (e) => {
      const dateTime = e.detail;

      this.$datePicker.value = dateTime;
      this.$datePicker.classList.remove("active");
    });
  }

  async init() {
    // this.render();
    
    this.$datePicker = this.$container.querySelector(".datePicker");
    this.$calendar = this.$container.querySelector(".calendar");

    new Calendar(this.$calendar);
  }
}
