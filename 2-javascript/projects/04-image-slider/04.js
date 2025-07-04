// Get the DOM elements for the image carousel
const wrapper = document.querySelector(".wrapper"),
  carousel = document.querySelector(".carousel"),
  images = document.querySelectorAll(".img"),
  buttons = document.querySelectorAll(".button");

let imageIndex = 1, 
  intervalId;

  // Define function to start automatic image slider
  const autoSlide = () => {
    //Start the slideshow by calling slideImage() every 2 seconds
    intervalId = setInterval(() => slideImage(++imageIndex), 2000);
  };

  //Call autoSlide function on page load
  autoSlide();

  //A function that updates the carousel display to show the specified image
  const slideImage = () => {
    //calculate the updated image INdex
    imageIndex = imageIndex === images.length ? 0 : imageIndex < 0 ? images.length - 1: imageIndex;
    //update the carousel display to show the specified image
    carousel.style.transform = `translate(-${imageIndex * 100}%)`;
  };

  //A function that updates the carousel display to show the next or previous image
  const updateClick = (e) => {
    //Stop the automatic slideshow
    clearInterval(intervalId);
    //calculate the updated image index based on the button clicked
    imageIndex += e.target.id === "next" ? 1 : -1;
    slideImage(imageIndex);
    //Restart the automatic
    autoSlide();
  }

  //Add event listener to the navigation buttons
  buttons.forEach(button => button.addEventListener("click", updateClick));

 // Add mouseover event listener to wrapper element to stop auto sliding 
 wrapper.addEventListener("mouseover", () => clearInterval(intervalId));
 // Add mouseover event listener to wrapper element to stop auto sliding again
 wrapper.addEventListener("mouseleave", autoSlide);

 