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
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos.push({ title, url });
  localStorage.setItem('videos', JSON.stringify(videos));
}

function deleteVideo(url) {
  let videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos = videos.filter(video => video.url !== url);
  localStorage.setItem('videos', JSON.stringify(videos));
}

function loadVideos() {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos.forEach(video => addVideo(video.title, video.url));
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
  const epgs = JSON.parse(localStorage.getItem('epgs')) || [];
  epgs.push({ channel, url });
  localStorage.setItem('epgs', JSON.stringify(epgs));
}

function deleteEPG(url) {
  let epgs = JSON.parse(localStorage.getItem('epgs')) || [];
  epgs = epgs.filter(epg => epg.url !== url);
  localStorage.setItem('epgs', JSON.stringify(epgs));
}

function loadEPGs() {
  const epgs = JSON.parse(localStorage.getItem('epgs')) || [];
  epgs.forEach(epg => addEPG(epg.channel, epg.url));
}
