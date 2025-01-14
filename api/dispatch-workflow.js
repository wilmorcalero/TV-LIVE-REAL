// api/dispatch-workflow.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { title, url, channel } = req.body;
        console.log('Datos recibidos:', { title, url, channel });

        // Aquí puedes agregar la lógica para despachar el workflow
        res.status(200).json({ message: 'Workflow despachado correctamente' });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
