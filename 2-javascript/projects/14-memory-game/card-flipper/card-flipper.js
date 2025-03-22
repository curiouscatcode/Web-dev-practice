card = document.querySelector('.js-card');

function flipCard(card) {
  card.classList.toggle('flipped');
}
card.addEventListener('click', function(){
  flipCard(this);
});