document.addEventListener('DOMContentLoaded', function() {
  loadVideos();
  loadEPGs();
}); 

function loadVideos() {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  const menuContainer = document.getElementById('menu-container');
  videos.forEach(video => {
    const button = document.createElement('button');
    button.className = 'menu-button';
    button.textContent = video.title;
    button.onclick = () => selectVideo(video.url, video.title);
    menuContainer.appendChild(button);
  });
}

function loadEPGs() {
  const epgs = JSON.parse(localStorage.getItem('epgs')) || [];
  epgs.forEach(epg => loadEPG(epg.channel, epg.url));
}

function

