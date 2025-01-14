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
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/videos.json')
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

function deleteEPG(url) {
  fetch('https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/delete-epg.yml/dispatches', {
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
      console.log('EPG delete workflow dispatched successfully');
    } else {
      console.error('Error dispatching delete EPG workflow:', response.statusText);
    }
  })
  .catch(error => console.error('Error:', error));
}

function loadEPGs() {
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/epgs.json')
    .then(response => response.json())
    .then(epgs => {
      const epgList = document.getElementById('epg-list');
      epgList.innerHTML = ''; // Limpiar la lista antes de agregar los EPGs
      epgs.forEach(epg => addEPG(epg.channel, epg.url));
    });
}
