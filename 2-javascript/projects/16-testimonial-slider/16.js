const testimonials = [
{
  name: 'David Bumble',
  photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww',
  text: 'He has the best projects out there. Great guy to work with.'
}, {
  name: 'Ian',
  photoUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww',
  text: 'Great experience of working and enjoying with him. Highly recommend.'
}, {
  name: 'Jones',
  photoUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww',
  text: 'Very smart and helpful to work with'
}, {
  name: 'Robert',
  photoUrl: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfHx8MA%3D%3D',
  text: 'Good. Highly recommend'
}]

const imgEl = document.querySelector('.js-img');
const textEl = document.querySelector('.js-text');
const usernameEl = document.querySelector('.js-username');

let idx = 0;

updateTestimonial();

function updateTestimonial() {
  const { name, photoUrl, text } = testimonials[idx];

  imgEl.src = photoUrl;
  textEl.innerHTML = text;
  usernameEl.innerHTML = name;
  idx++;

  if(idx === testimonials.length){
    idx = 0;
  }
  
  setTimeout(() => {
    updateTestimonial();
  }, 5000);
}