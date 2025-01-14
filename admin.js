const users = {
  admin: 'password123'
};

function login() {
  console.log('Login function called');
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
  console.log('Video form submitted');
  const title = document.getElementById('video-title').value;
  const url = document.getElementById('video-url').value;
  addVideo(title, url);
  saveVideo(title, url);
});

document.getElementById('epg-form').addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('EPG form submitted');
  const channel = document.getElementById('epg-channel').value;
  const url = document.getElementById('epg-url').value;
  addEPG(channel, url);
  saveEPG(channel, url);
});

function addVideo(title, url) {
  console.log('Adding video:', title, url);
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
  console.log('Saving video:', title, url);
  fetch('https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/update-videos.yml/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        title: title,
        url: url
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Video workflow dispatched successfully');
    } else {
      console.error('Error dispatching video workflow:', response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}

function deleteVideo(url) {
  console.log('Deleting video:', url);
  fetch('https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/delete-video.yml/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        url: url
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Video delete workflow dispatched successfully');
    } else {
      console.error('Error dispatching delete video workflow:', response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}

function loadVideos() {
  console.log('Loading videos');
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/videos.json')
    .then(response => response.json())
    .then(videos => {
      const videoList = document.getElementById('video-list');
      videoList.innerHTML = ''; // Limpiar la lista antes de agregar los videos
      videos.videos.forEach(video => addVideo(video.title, video.url));
    })
    .catch(error => console.error('Error cargando videos:', error));
}

function addEPG(channel, url) {
  console.log('Adding EPG:', channel, url);
  const epgList = document.getElementById('epg-list');
  const li = document.createElement('li');
  li.innerHTML = `${channel} <button onclick="removeEPG(this)">Eliminar</button>`;
  li.setAttribute('data-channel', channel);
  epgList.appendChild(li);
}

function removeEPG(button) {
  const li = button.parentElement;
  const channel = li.getAttribute('data-channel');
  li.remove();
  deleteEPG(channel);
}

function saveEPG(channel, url) {
  console.log('Saving EPG:', channel, url);
  fetch('https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/update-epgs.yml/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        channel: channel,
        url: url
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('EPG workflow dispatched successfully');
    } else {
      console.error('Error dispatching EPG workflow:', response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}

function deleteEPG(channel) {
  console.log('Deleting EPG:', channel);
  fetch('https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/delete-epg.yml/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        channel: channel
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('EPG delete workflow dispatched successfully');
    } else {
      console.error('Error dispatching delete EPG workflow:', response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}

function loadEPGs() {
  console.log('Loading EPGs');
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/epgs.json')
    .then(response => response.json())
    .then(epgs => {
      const epgList = document.getElementById('epg-list');
      epgList.innerHTML = ''; // Limpiar la lista antes de agregar los EPGs
      epgs.epgs.forEach(epg => addEPG(epg.channel, epg.url));
    })
    .catch(error => console.error('Error cargando EPGs:', error));
}
