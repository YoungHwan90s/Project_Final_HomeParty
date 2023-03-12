class Carousel {
  constructor(container) {
    this.$container = container;
    this.$carousel = this.$container.querySelector(".carouselList");
    this.DURATION = 300;
    this.currentSlide = 0;
    this.isMoving = false;

    this.$carousel.style.setProperty("--duration", this.DURATION);

    // 이동 버튼 클릭시
    this.$container.addEventListener("click", (e) => {
      if (e.target.closest(".carouselButton") && !this.isMoving)
        this.moveSlide(e);
    });

    // 이동 버튼 -> (중복 클릭 방지) 애니메이션 duration 끝나고 클릭되게
    this.$carousel.addEventListener("transitionend", () => {
      this.isMoving = false;
    });
  }

  moveSlide(e) {
    if (e.target.closest(".next")) {
      if (this.currentSlide === this.$carousel.children.length - 1) return;
      this.currentSlide += 1;
    } else {
      if (this.currentSlide === 0) return;
      this.currentSlide -= 1;
    }

    this.isMoving = true;
    this.$carousel.style.setProperty("--currentSlide", this.currentSlide);
  }
}
