document.addEventListener('DOMContentLoaded', function() {
  loadVideos();
  loadEPGs();
});

function loadVideos() {
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/videos.json')
    .then(response => response.json())
    .then(data => {
      const menuContainer = document.getElementById('menu-container');
      menuContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los botones
      data.videos.forEach(video => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = video.title;
        button.onclick = () => selectVideo(video.url, video.title);
        menuContainer.appendChild(button);
      });
    })
    .catch(error => console.error('Error cargando videos:', error));
}

function selectVideo(url, title) {
  const videoPlayer = document.getElementById('video-player');
  pauseAllVideos();
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(videoPlayer);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      videoPlayer.play();
    });
  } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.src = url;
    videoPlayer.addEventListener('loadedmetadata', function() {
      videoPlayer.play();
    });
  }
  videoPlayer.style.display = 'block';
  document.getElementById('epg-toggle').style.display = 'block';
  document.getElementById('epg-toggle').setAttribute('data-title', title);
}

function pauseAllVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.style.display = 'none';
  });
}

function toggleEPG() {
  const title = document.getElementById('epg-toggle').getAttribute('data-title');
  const epgContainer = document.getElementById('epg-container');
  if (epgContainer.style.display === 'none') {
    epgContainer.style.display = 'block';
    document.getElementById('epg-toggle').textContent = 'Ocultar EPG';
  } else {
    epgContainer.style.display = 'none';
    document.getElementById('epg-toggle').textContent = 'Mostrar EPG';
  }
}

function loadEPGs() {
  fetch('https://raw.githubusercontent.com/wilmorcalero/TV-LIVE-REAL/main/epgs.json')
    .then(response => response.json())
    .then(data => {
      data.epgs.forEach(epg => loadEPG(epg.channel, epg.url));
    })
    .catch(error => console.error('Error cargando EPGs:', error));
}

function loadEPG(channel, url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const epgContainer = document.getElementById('epg-container');
      const programs = xmlDoc.querySelectorAll(`programme[channel="${channel}"]`);
      programs.forEach(program => {
        const title = program.querySelector("title").textContent;
        const start = formatDateTime(program.getAttribute("start"));
        const end = formatDateTime(program.getAttribute("stop"));
        const programElement = document.createElement("div");
        programElement.className = "epg-item";
        programElement.innerHTML = `<strong>${title}</strong> <br> ${start} - ${end}`;
        epgContainer.appendChild(programElement);
      });
    })
    .catch(error => console.error('Error cargando EPG:', error));
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime.slice(0, 4) + '-' + dateTime.slice(4, 6) + '-' + dateTime.slice(6, 8) + 'T' + dateTime.slice(8, 10) + ':' + dateTime.slice(10, 12) + ':' + dateTime.slice(12, 14));
  return date.toLocaleString();
}
