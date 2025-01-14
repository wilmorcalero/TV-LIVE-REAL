const users = {
  admin: 'password123'
};

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (users[username] && users[username] === password) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'block';
    loadVideos();
    loadEPGs();
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

document.getElementById('video-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const title = document.getElementById('video-title').value;
  const url = document.getElementById('video-url').value;
  addVideo(title, url);
  saveVideo(title, url);
});

document.getElementById('epg-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const channel = document.getElementById('epg-channel').value;
  const url = document.getElementById('epg-url').value;
  addEPG(channel, url);
  saveEPG(channel, url);
});

function addVideo(title, url) {
  const videoList = document.getElementById('video-list');
  const li = document.createElement('li');
  li.innerHTML = `${title} <button onclick="removeVideo(this)">Eliminar</button>`;
  li.setAttribute('data-url', url);
  videoList.appendChild(li);
}

function removeVideo(button) {
  const li = button.parentElement;
  li.remove();
  deleteVideo(li.getAttribute('data-url'));
}

function saveVideo(title, url) {
  // Aquí puedes hacer una solicitud a tu servidor backend o ejecutar el workflow de GitHub Actions
}

function deleteVideo(url) {
  // Aquí puedes hacer una solicitud a tu servidor backend o ejecutar el workflow de GitHub Actions
}

function loadVideos() {
  fetch('https://raw.githubusercontent.com/tu_usuario/tu_repositorio/main/videos.json')
    .then(response => response.json())
    .then(videos => {
      const videoList = document.getElementById('video-list');
      videoList.innerHTML = ''; // Limpiar la lista antes de agregar los videos
      videos.forEach(video => addVideo(video.title, video.url));
    });
}

function addEPG(channel, url) {
  const epgList = document.getElementById('epg-list');
  const li = document.createElement('li');
  li.innerHTML = `${channel} <button onclick="removeEPG(this)">Eliminar</button>`;
  li.setAttribute('data-url', url);
  epgList.appendChild(li);
}

function removeEPG(button) {
  const li = button.parentElement;
  li.remove();
  deleteEPG(li.getAttribute('data-url'));
}

function saveEPG(channel, url) {
  // Aquí puedes hacer una solicitud a tu servidor backend o ejecutar el workflow de GitHub Actions
}

function deleteEPG(url) {
  // Aquí puedes hacer una solicitud a tu servidor backend o ejecutar el workflow de GitHub Actions
}

function loadEPGs() {
  fetch('https://raw.githubusercontent.com/tu_usuario/tu_repositorio/main/epgs.json')
    .then(response => response.json())
    .then(epgs => {
      const epgList = document.getElementById('epg-list');
      epgList.innerHTML = ''; // Limpiar la lista antes de agregar los EPGs
      epgs.forEach(epg => addEPG(epg.channel, epg.url));
    });
}
