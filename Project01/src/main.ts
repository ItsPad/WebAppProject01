
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
//Catagory Slider
const sliderCat = document.getElementById("categorySlider") as HTMLElement;
const slidesCat = sliderCat.children;
const totalSlidesCat = slidesCat.length;
let indexCat = 0;

function showSlideCat(i: number) {
  const slideWidth = (slidesCat[0] as HTMLElement).offsetWidth + 16; // รวม gap-4 (16px)
  sliderCat.style.transform = `translateX(${-i * slideWidth}px)`;
}


function nextBtnCat() {
  indexCat = (indexCat + 1) % totalSlidesCat;
  showSlideCat(indexCat);
}

function prevBtnCat() {
  indexCat = (indexCat - 1 + totalSlidesCat) % totalSlidesCat;
  showSlideCat(indexCat);

}
 setInterval(() => {
    nextBtnCat();
  }, 3000);

document.getElementById('nextBtnCat')?.addEventListener('click', nextBtnCat);
document.getElementById('prevBtnCat')?.addEventListener('click', prevBtnCat);