const btn = document.querySelector('.generate-btn');
const finalText = document.getElementById('FinalText');

btn.addEventListener('click', () => {
  getConcept();
});

async function getConcept() {
  const response = await fetch('./concept');
  const data = await response.json();
  console.log(data);
  finalText.innerText = `
    Topic: ${data.topic}
    Explanation: ${data.explanation}
  `;
}