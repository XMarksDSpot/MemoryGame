const container = document.querySelector('.container');
const form = document.getElementById('meme-form');
const imageUrlInput = document.getElementById('image-url-input');
const topTextInput = document.getElementById('top-text-input');
const bottomTextInput = document.getElementById('bottom-text-input');
const memesContainer = document.getElementById('memes');
const textColorInput = document.getElementById('text-color-input');
let memeCounter = 0;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const memeDiv = document.createElement('div');
    memeDiv.classList.add('meme');
    memeDiv.dataset.id = memeCounter;
  
    const memeImg = new Image();
    memeImg.onload = function() {
      console.log('Image has loaded');
    };
    memeImg.onerror = function() {
      console.log("Failed to load image");
    };
    
    memeImg.src = imageUrlInput.value;
    memeDiv.appendChild(memeImg);

  const topText = document.createElement('div');
  topText.classList.add('text', 'top');
  topText.style.color = textColorInput.value;
  topText.textContent = topTextInput.value;
  memeDiv.appendChild(topText);

  const bottomText = document.createElement('div');
  bottomText.classList.add('text', 'bottom');
  bottomText.textContent = bottomTextInput.value;
  bottomText.style.color = textColorInput.value;
  memeDiv.appendChild(bottomText);

  memesContainer.appendChild(memeDiv);

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.textContent = 'Remove';
  removeButton.dataset.id = memeCounter;

  removeButton.addEventListener('click', function() {
    const memeToRemove = document.querySelector(`.meme[data-id="${this.dataset.id}"]`);
    memesContainer.removeChild(memeToRemove);
    container.removeChild(removeButton);
    container.removeChild(downloadButton);
  });
  
  container.appendChild(removeButton);

  const downloadButton = document.createElement('a');
  downloadButton.classList.add('download-button');
  downloadButton.textContent = 'Download';
  downloadButton.dataset.id = memeCounter;
  downloadButton.setAttribute('download', 'meme.png');
  
  downloadButton.addEventListener('click', function() {
    try {
    const memeToDownload = document.querySelector(`.meme[data-id="${this.dataset.id}"]`);  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = memeImg.width;
    canvas.height = memeImg.height;
    ctx.drawImage(memeImg, 0, 0);
    ctx.font = '30px Arial';
    ctx.fillText(topTextInput.value, canvas.width / 2, 30);
    ctx.fillText(bottomTextInput.value, canvas.width / 2, canvas.height - 10);
    downloadButton.href = canvas.toDataURL();
    downloadButton.download = 'meme.png';
    downloadButton.target = '_blank';
    } catch (error) {
      alert('Download failed due to copyright');
    }
  });
  container.appendChild(downloadButton);
  imageUrlInput.value = '';
  topTextInput.value = '';
  bottomTextInput.value = '';
  memeCounter++;
});