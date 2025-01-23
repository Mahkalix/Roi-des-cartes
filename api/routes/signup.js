import { connectToDatabase } from '../config/db.js';

export default async function signupHandler(req, res) {
    let db;
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Méthode non autorisée.' });
        }

        const { name, username } = req.body;

        if (!name || !username) {
            return res.status(400).json({ message: 'Les champs "name" et "username" sont requis.' });
        }

        db = await connectToDatabase();

        // Vérifier si le username est déjà utilisé
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
        }

        // Insérer l'utilisateur
        const [result] = await db.execute('INSERT INTO users (name, username) VALUES (?, ?)', [name, username]);
        res.status(201).json({ message: 'Utilisateur créé avec succès.', userId: result.insertId });

    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    } finally {
        if (db) {
            await db.end();
        }
    }
}
