import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
    try {
        const [leaderboard] = await db.query(`
            SELECT u.username, COUNT(q.id) AS score
            FROM users u
                     LEFT JOIN qr_codes q ON u.id = q.user_id
            GROUP BY u.id
            ORDER BY score DESC
        `);

        res.status(200).json(leaderboard);  // Assurez-vous que la clé 'score' est bien renvoyée
    } catch (err) {
        console.error('Erreur lors de la récupération du classement:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

export default router;
