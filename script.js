
const addBtn = document.getElementById('add-archive-btn');
const archiveForm = document.getElementById('archive-form');
const saveBtn = document.getElementById('save-archive');
const cancelBtn = document.getElementById('cancel-archive');
const artifactsGrid = document.querySelector('.artifacts-grid');

let editingCard = null;

addBtn.addEventListener('click', () => {
  archiveForm.style.display = 'block';
  editingCard = null;
});

cancelBtn.addEventListener('click', () => {
  archiveForm.style.display = 'none';
  archiveForm.reset();
});

saveBtn.addEventListener('click', () => {
  const title = document.getElementById('artifact-title').value.trim();
  const desc = document.getElementById('artifact-desc').value.trim();
  const imgFiles = Array.from(document.getElementById('artifact-img').files);

  if (!title || !desc || imgFiles.length === 0) {
    alert('Please fill in all fields and select at least one image.');
    return;
  }

  const imgPromises = imgFiles.map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(imgPromises).then(imgArray => {
    if (editingCard) {
      editingCard.querySelector('h3').textContent = title;
      editingCard.querySelector('p').textContent = desc;
      editingCard.setAttribute('data-images', JSON.stringify(imgArray));
      editingCard.setAttribute('data-full-desc', desc);
      editingCard.querySelector('img').src = imgArray[0];
    } else {
      const card = document.createElement('div');
      card.classList.add('artifact-card');
      card.setAttribute('data-images', JSON.stringify(imgArray));
      card.setAttribute('data-full-desc', desc);
      card.innerHTML = `
        <img src="${imgArray[0]}" alt="${title}">
        <h3>${title}</h3>
        <p>${desc}</p>
      `;
      artifactsGrid.appendChild(card);
      addCardClick(card);
    }

    archiveForm.reset();
    archiveForm.style.display = 'none';
  });
});

function addCardClick(card) {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent;
    const desc = card.getAttribute('data-full-desc') || card.querySelector('p').textContent;
    const images = JSON.parse(card.getAttribute('data-images'));
    let currentIndex = 0;

    const modal = document.getElementById('artifact-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const closeBtn = modal.querySelector('.close');

    modal.style.display = 'flex';
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalImg.src = images[currentIndex];

    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      modalImg.src = images[currentIndex];
    };

    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      modalImg.src = images[currentIndex];
    };

    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (e) => {
      if (e.target == modal) modal.style.display = 'none';
    };
  });
}

document.querySelectorAll('.artifact-card').forEach(card => addCardClick(card));
