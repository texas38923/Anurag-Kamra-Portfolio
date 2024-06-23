export default function (element) {
  element.style.overflow = 'hidden';
  // if (!element.classList.contains('intro-text')) {
  //   element.style.opacity = 0;
  // }
  element.innerHTML = element.innerText
    .split('')
    .map((char) => {
      if (char === ' ') {
        return `<span>&nbsp;</span>`;
      }
      return `<span class='animatedis'>${char}</span>`;
    })
    .join('');

  return element;
}
