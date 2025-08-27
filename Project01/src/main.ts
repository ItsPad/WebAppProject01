
//ส่วนของการควบคุมสไลด์
const slider = document.getElementById("slider") as HTMLElement;
const slides = slider.children;
const totalSlides = slides.length;
let index = 0;

function showSlide(i: number) {
  slider.style.transform = `translateX(${-i * 100}%)`;
}

function nextBtn() {
  index = (index + 1) % totalSlides;
  showSlide(index);
}

function prevBtn() {
  index = (index - 1 + totalSlides) % totalSlides;
  showSlide(index);

}
 setInterval(() => {
    nextBtn();
  }, 3000);

document.getElementById('nextBtn')?.addEventListener('click', nextBtn);
document.getElementById('prevBtn')?.addEventListener('click', prevBtn);
//----------------------------------------------------------------