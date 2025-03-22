let post = document.querySelector('.js-post');
let heart = document.querySelector('.js-heart');

function showHeart() {
  heart.style.opacity = '1';
  heart.style.transition = "opacity 0.5s ease-in-out";
  heart.style.transform = 'scale(0.8)';
}

setInterval(() => {
  heart.style.opacity = '0';
  heart.style.transform = 'scale(1)';
},1000)
post.addEventListener('dblclick', () => {
  showHeart();
});