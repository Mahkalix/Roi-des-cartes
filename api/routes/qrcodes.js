import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Route pour enregistrer un QR code scanné par un utilisateur
router.post('/', async (req, res) => {
    const { userId, codeValue, location } = req.body;

    if (!userId || !codeValue || !location) {
        return res.status(400).json({ message: 'Les champs "userId", "codeValue" et "location" sont requis.' });
    }

    try {
        const [existingScan] = await db.query(
            'SELECT * FROM qr_codes WHERE user_id = ? AND code_value = ?',
            [userId, codeValue]
        );

        if (existingScan.length > 0) {
            return res.status(400).json({ message: 'Ce QR code a déjà été scanné par cet utilisateur.' });
        }

        await db.query(
            'INSERT INTO qr_codes (user_id, code_value, location) VALUES (?, ?, ?)',
            [userId, codeValue, location]
        );

        res.status(201).json({ message: 'QR Code scanné avec succès.' });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du QR Code :', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

// Route pour rediriger depuis "qr rush" vers "game2"
router.get('/qr-rush', (req, res) => {
    res.redirect('/game2');
});

// Route pour obtenir le classement des utilisateurs
router.get('/leaderboard', async (req, res) => {
    try {
        const [leaderboard] = await db.query(`
            SELECT u.id, u.name, u.username, COUNT(q.id) AS score
            FROM users u
            LEFT JOIN qr_codes q ON u.id = q.user_id
            GROUP BY u.id
            ORDER BY score DESC
        `);

        res.status(200).json(leaderboard);
    } catch (err) {
        console.error('Erreur lors de la récupération du classement :', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

export default router;
