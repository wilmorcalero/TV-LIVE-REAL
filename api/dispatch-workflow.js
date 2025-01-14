import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { action, type, title, url, channel } = req.body;
        console.log('Datos recibidos:', { action, type, title, url, channel });

        let workflowFile;
        if (action === 'add' && type === 'video') {
            workflowFile = 'update-video.yml';
        } else if (action === 'add' && type === 'epg') {
            workflowFile = 'update-epgs.yml';
        } else if (action === 'delete' && type === 'video') {
            workflowFile = 'delete-video.yml';
        } else if (action === 'delete' && type === 'epg') {
            workflowFile = 'delete-epg.yml';
        } else {
            res.status(400).json({ error: 'Acción o tipo no válidos' });
            return;
        }

        try {
            const response = await fetch(`https://api.github.com/repos/wilmorcalero/TV-LIVE-REAL/actions/workflows/${workflowFile}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: 'main',
                    inputs: {
                        title: title,
                        url: url,
                        channel: channel
                    }
                })
            });

            if (response.ok) {
                res.status(200).json({ message: 'Workflow despachado correctamente' });
            } else {
                const errorData = await response.json();
                res.status(response.status).json({ error: errorData.message });
            }
        } catch (error) {
            console.error('Error al despachar el workflow:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
