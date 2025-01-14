const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { title, url, channel } = req.body;
    let workflowUrl = 'https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/';
    let inputs = {};

    if (title && url) {
      workflowUrl += 'update-videos.yml/dispatches';
      inputs = { title, url };
    } else if (channel && url) {
      workflowUrl += 'update-epgs.yml/dispatches';
      inputs = { channel, url };
    } else if (url) {
      workflowUrl += 'delete-video.yml/dispatches';
      inputs = { url };
    } else if (channel) {
      workflowUrl += 'delete-epg.yml/dispatches';
      inputs = { channel };
    }

    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MY_SECRET_TOKEN}` // Asegúrate de configurar tu token en las variables de entorno de Vercel
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: inputs
      })
    });

    if (response.ok) {
      res.status(200).json({ message: 'Workflow dispatched successfully' });
    } else {
      res.status(response.status).json({ error: 'Error dispatching workflow' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
