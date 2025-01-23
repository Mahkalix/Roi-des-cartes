
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import db from './config/db.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 30001;
const JWT_SECRET = "roi_des_cartes";

// Middlewares
// app.use(helmet());
// const allowedOrigins = ['http://localhost:5173/', 'http://localhost:5174/'];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'], // Ajoute 'Authorization' ici
// }));


function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Récupère le token depuis l'en-tête

    if (!token) {
        return res.status(403).json({ message: "Accès refusé, token manquant." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Vérifie le token avec la clé secrète
        req.userId = decoded.userId; // Ajoute l'ID de l'utilisateur à la requête
        next(); // Passe au prochain middleware ou à la logique de la route
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
}

app.use(express.json());

// Gestion du favicon
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

app.post('/api/update-scores', async (req, res) => {
    const { userId, teamId, score } = req.body;

    if (!userId || score === undefined) {
        return res.status(400).json({ success: false, message: 'userId et score sont requis' });
    }

    try {
        // Insertion ou mise à jour du score dans la table scores
        const [results] = await db.query(
            'INSERT INTO scores (user_id, team_id, score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score = ?',
            [userId, teamId, score, score]
        );

        res.status(200).json({ success: true, message: 'Score mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du score :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.get('/api/users-scores', async (req, res) => {
    try {
        // Requête SQL avec une jointure entre scores et users
        const [results] = await db.query(`
            SELECT 
                scores.user_id, 
                scores.team_id, 
                scores.score, 
                users.username 
            FROM scores
            JOIN users ON scores.user_id = users.id
        `);

        res.status(200).json(results); // Retourner les données au format JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des scores :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.get('/api/team-progress/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const [progress] = await db.query(`
            SELECT tp.current_step, p.name AS puzzle_name
            FROM team_progress tp
                     JOIN puzzles p ON tp.current_step = p.id
            WHERE tp.team_id = ?
        `, [teamId]);

        if (!progress.length) {
            return res.status(404).json({ message: "Aucune progression trouvée pour cette équipe." });
        }

        res.status(200).json(progress[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression de l'équipe :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

app.post('/api/validate-team-answer', async (req, res) => {
    const { teamId, answer } = req.body;

    try {
        const [currentPuzzle] = await db.query(`
            SELECT tp.current_step, p.correct_answer
            FROM team_progress tp
                     JOIN puzzles p ON tp.current_step = p.id
            WHERE tp.team_id = ?
        `, [teamId]);

        if (!currentPuzzle.length) {
            return res.status(404).json({ message: "Aucune progression trouvée pour cette équipe." });
        }

        const { current_step, correct_answer } = currentPuzzle[0];

        if (answer.trim().toLowerCase() !== correct_answer.trim().toLowerCase()) {
            return res.status(400).json({ correct: false, message: "Réponse incorrecte." });
        }

        // Avancer l'équipe à l'étape suivante
        const [nextPuzzle] = await db.query(`
            SELECT id FROM puzzles
            WHERE step > (SELECT step FROM puzzles WHERE id = ?)
            ORDER BY step ASC
                LIMIT 1
        `, [current_step]);

        if (!nextPuzzle.length) {
            await db.query(`
                UPDATE team_progress
                SET completed = 1
                WHERE team_id = ?
            `, [teamId]);

            return res.status(200).json({ correct: true, message: "Puzzle terminé, équipe gagnante !" });
        }

        await db.query(`
            UPDATE team_progress
            SET current_step = ?
            WHERE team_id = ?
        `, [nextPuzzle[0].id, teamId]);

        res.status(200).json({ correct: true, message: "Réponse correcte. Puzzle suivant débloqué." });
    } catch (error) {
        console.error("Erreur lors de la validation de la réponse :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

app.post('/api/activate-player', async (req, res) => {
    const { teamId, userId } = req.body;

    try {
        await db.query(`
            UPDATE player_progress
            SET status = 'active'
            WHERE team_id = ? AND user_id = ?
        `, [teamId, userId]);

        res.status(200).json({ message: "Joueur activé." });
    } catch (error) {
        console.error("Erreur lors de l'activation du joueur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

//Récupérer l'énigme d'un joueur actif
app.get('/api/current-puzzle/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {

        const [player] = await db.query(`
            SELECT pp.player_id, u.name, pp.current_step, a.correct_answer
            FROM player_progress pp
            JOIN users u ON pp.player_id = u.id
            JOIN answers a ON pp.current_step = a.step
            WHERE pp.team_id = ? AND pp.status = 'pending'
            LIMIT 1
        `, [teamId]);

        if (player.length === 0) {
            return res.status(200).json({ message: "Toutes les énigmes sont terminées." });
        }

        res.status(200).json(player[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'énigme." });
    }
});

//Valider la réponse d'un joueur

app.post('/api/validate-answer', async (req, res) => {
    const { playerId, answer } = req.body;

    if (!playerId || !answer) {
        return res.status(400).json({ error: "Le joueur et la réponse sont requis." });
    }

    try {
        // Vérifie la réponse
        const [correctAnswer] = await db.query(`
            SELECT a.correct_answer
            FROM answers a
                     JOIN player_progress pp ON pp.current_step = a.step
            WHERE pp.user_id = ?  // Remplacer 'player_id' par 'user_id'
        `, [playerId]);

        if (!correctAnswer || correctAnswer.correct_answer !== answer.toUpperCase()) {
            return res.status(200).json({ correct: false, message: "Réponse incorrecte." });
        }

        // Passe le joueur actuel à "completed"
        await db.query(`
            UPDATE player_progress
            SET status = 'completed'
            WHERE player_id = ?
        `, [playerId]);

        // Met à jour la progression de l'équipe
        await db.query(`
            UPDATE team_progress
            SET current_step = current_step + 1
            WHERE team_id = (
                SELECT team_id FROM player_progress WHERE user_id = ?
            )
        `, [playerId]);

        // Active le joueur suivant
        await db.query(`
            UPDATE player_progress
            SET status = 'active'
            WHERE team_id = (
                SELECT team_id FROM player_progress WHERE user_id = ?
            )
              AND status = 'waiting'
                ORDER BY id ASC
            LIMIT 1
        `, [playerId]);

        res.status(200).json({ correct: true, message: "Réponse correcte. Prochain joueur activé." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la validation de la réponse." });
    }
});

// Exemple de contrôleur d'API pour check progress
app.post('/api/check-progress', async (req, res) => {
    const { userId, puzzleId } = req.body;

    if (!userId || !puzzleId) {
        return res.status(400).json({ error: "L'utilisateur et l'ID de l'énigme sont requis." });
    }

    try {
        const [progress] = await db.query(`
            SELECT pp.status, tp.current_step
            FROM player_progress pp
                     JOIN team_progress tp ON pp.team_id = tp.team_id
            WHERE pp.user_id = ?
        `, [userId]);

        if (!progress || progress.status !== 'active' || progress.current_step !== puzzleId) {
            return res.json({ unlocked: false });
        }

        res.json({ unlocked: true });
    } catch (err) {
        console.error('Erreur lors de la vérification du progrès:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/generate-teams', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE status = "in-game"');

        if (users.length === 0) {
            return res.status(400).json({ message: "Aucun joueur n'est en jeu." });
        }

        // Mélanger les utilisateurs pour randomiser la répartition
        const shuffledUsers = shuffleArray(users);

        const totalPlayers = shuffledUsers.length;
        const numTeams = Math.ceil(Math.sqrt(totalPlayers)); // Déterminer un nombre d'équipes équilibré
        const teams = Array.from({ length: numTeams }, (_, i) => ({
            team_id: i + 1,
            team_name: `Team ${i + 1}`,
            players: []
        }));

        // Répartir les joueurs de manière équitable dans les équipes
        shuffledUsers.forEach((user, index) => {
            const teamIndex = index % numTeams; // Distribuer les joueurs en boucle
            teams[teamIndex].players.push({ id: user.id, name: user.name });
        });

        // Insérer les équipes et générer les jeux
        for (const team of teams) {
            const [result] = await db.query('INSERT INTO teams (name) VALUES (?)', [team.team_name]);
            const dbTeamId = result.insertId;

            // Insérer les joueurs dans l'équipe
            for (const player of team.players) {
                await db.query('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', [dbTeamId, player.id]);
            }

            // Générer les jeux pour cette équipe
            const puzzles = [1, 2, 3, 4, 5]; // ID des puzzles disponibles
            const assignedPlayers = shuffleArray(team.players); // Mélanger les joueurs
            for (let i = 0; i < puzzles.length; i++) {
                const player = assignedPlayers[i % assignedPlayers.length]; // Alternance entre les joueurs
                await db.query(
                    'INSERT INTO games (team_id, puzzle_id, player_id, step) VALUES (?, ?, ?, ?)',
                    [dbTeamId, puzzles[i], player.id, i + 1]
                );
            }
        }

        res.status(200).json({ message: "Équipes et jeux générés avec succès.", teams });
    } catch (err) {
        console.error('Erreur lors de la génération des équipes:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

// Fonction pour mélanger un tableau de manière aléatoire
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


app.get('/api/check-team-finished/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        // Vérifier si tous les joueurs de l'équipe ont terminé
        const [games] = await db.query(
            `SELECT * FROM games WHERE team_id = ?`,
            [teamId]
        );

        // Vérifier si tous les jeux sont terminés
        const allFinished = games.every(game => game.finished);

        res.status(200).json({ allFinished });
    } catch (error) {
        console.error("Erreur lors de la vérification de l'état des autres joueurs:", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

app.get('/api/game-status/:teamId/:playerId', async (req, res) => {
    const { teamId, playerId } = req.params;

    try {
        // Récupérer toutes les énigmes de l'équipe avec les informations des joueurs
        const [games] = await db.query(
            `SELECT g.*, u.name AS player_name
             FROM games g
                      LEFT JOIN users u ON g.player_id = u.id
             WHERE g.team_id = ?
             ORDER BY g.step`,
            [teamId]
        );

        if (games.length === 0) {
            return res.status(404).json({ message: "Aucun jeu trouvé pour cette équipe." });
        }

        // Trouver l'énigme en cours
        let currentGame = games.find((game) => game.in_play);

        // Si aucune énigme n'est en cours, démarrer la première non terminée
        if (!currentGame) {
            const nextGame = games.find((game) => !game.finished);

            if (nextGame) {
                await db.query(
                    'UPDATE games SET in_play = TRUE WHERE id = ?',
                    [nextGame.id]
                );
                currentGame = nextGame;
            }
        }

        // Vérifier si c'est le tour du joueur connecté
        const isPlayerTurn = currentGame && currentGame.player_id == playerId;

        res.status(200).json({
            currentGame: currentGame || null,
            isPlayerTurn: isPlayerTurn,
            games: games,
            message: currentGame
                ? `Le joueur ${currentGame.player_name} est en train de résoudre l'énigme ${currentGame.step} sur ${games.length}.`
                : "Aucun jeu en cours.",
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'état du jeu:", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

//jeu multijoueur
app.post('/api/start-game', async (req, res) => {
    const { playerId, teamId } = req.body;

    try {
        // Vérifier s'il y a déjà une énigme en cours
        const [currentGame] = await db.query(
            'SELECT * FROM games WHERE team_id = ? AND in_play = TRUE',
            [teamId]
        );

        if (currentGame.length > 0) {
            return res.status(400).json({ message: "Une énigme est déjà en cours." });
        }

        // Activer la première énigme si aucune n'est en cours
        const [nextGame] = await db.query(
            'SELECT * FROM games WHERE team_id = ? AND finished = FALSE AND in_play = FALSE ORDER BY step LIMIT 1',
            [teamId]
        );

        if (nextGame.length === 0) {
            return res.status(400).json({ message: "Toutes les énigmes sont terminées pour cette équipe." });
        }

        // Démarrer la prochaine énigme
        await db.query(
            'UPDATE games SET in_play = TRUE WHERE id = ?',
            [nextGame[0].id]
        );

        res.status(200).json({ message: "Énigme activée.", game: nextGame[0] });
    } catch (error) {
        console.error("Erreur lors de l'activation de l'énigme:", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

//finish multijoueur
app.post('/api/finish-game', async (req, res) => {
    const { playerId, teamId } = req.body;

    try {
        // Marquer l'énigme actuelle comme terminée
        const [updateResult] = await db.query(
            'UPDATE games SET in_play = FALSE, finished = TRUE WHERE team_id = ? AND in_play = TRUE',
            [teamId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(400).json({ message: "Aucune énigme en cours à terminer." });
        }

        // Activer la prochaine énigme pour le joueur suivant
        const [nextGame] = await db.query(
            'SELECT * FROM games WHERE team_id = ? AND finished = FALSE ORDER BY step LIMIT 1',
            [teamId]
        );

        if (nextGame.length > 0) {
            await db.query(
                'UPDATE games SET in_play = TRUE WHERE id = ?',
                [nextGame[0].id]
            );
        }

        res.status(200).json({
            message: "Énigme terminée. Prochaine énigme activée.",
            nextGame: nextGame[0] || null
        });
    } catch (error) {
        console.error("Erreur lors de la validation de l'énigme:", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});


// pour verifier les reponses des enigmes
app.post('/api/verify-answer', async (req, res) => {
    const { answer, currentStep } = req.body;
    console.log(`Vérification : Réponse = ${answer}, Étape = ${currentStep}`); // Ajout du log

    try {
        const [result] = await db.query(
            'SELECT * FROM answers WHERE step = ?',
            [currentStep]
        );
        console.log(result);

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucune énigme trouvée pour cette étape." });
        }

        const correctAnswer = result[0].correct_answer;
        if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
            return res.status(200).json({ correct: true });
        } else {
            return res.status(200).json({ correct: false });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la réponse:", error);
        return res.status(500).json({ error: "Erreur de serveur." });
    }
});

// routes pour recuperer les equipes
app.get('/api/teams', async (req, res) => {
    try {
        const [teams] = await db.query(`
            SELECT
                t.id AS team_id,
                t.name AS team_name,
                u.id AS user_id,  -- Récupérer l'ID de l'utilisateur
                u.name AS player_name
            FROM
                teams t
                    JOIN
                team_members tm ON t.id = tm.team_id
                    JOIN
                users u ON tm.user_id = u.id
            ORDER BY
                t.id, u.name
        `);

        // Formater les données pour regrouper les joueurs par équipe
        const formattedTeams = [];
        let currentTeamId = null;
        let currentTeam = null;

        teams.forEach(team => {
            if (team.team_id !== currentTeamId) {
                if (currentTeam) formattedTeams.push(currentTeam);
                currentTeam = {
                    team_id: team.team_id,
                    team_name: team.team_name,
                    players: []
                };
                currentTeamId = team.team_id;
            }
            currentTeam.players.push({ id: team.user_id, name: team.player_name }); // Inclure l'ID et le nom
        });

        if (currentTeam) formattedTeams.push(currentTeam);

        res.status(200).json(formattedTeams);
    } catch (err) {
        console.error('Erreur lors de la récupération des équipes:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

// route pour les reponses des enigmes
app.get('/api/answers', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM answers');
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});


app.post('/api/update-scans', verifyToken, async (req, res) => {
    const { scanCount } = req.body;
    const userId = req.userId; // Utilise l'ID de l'utilisateur récupéré du token

    console.log("Données reçues : ", { userId, scanCount }); // Debugging

    if (!userId || scanCount === undefined) {
        return res.status(400).json({ message: "'userId' et 'scanCount' sont requis." });
    }

    try {
        // Vérifier si cet utilisateur a déjà un scan enregistré
        const [existingScan] = await db.query(
            'SELECT * FROM scans WHERE user_id = ?',
            [userId]
        );

        if (existingScan.length > 0) {
            // Mettre à jour le nombre de scans si l'utilisateur a déjà un enregistrement
            await db.query(
                'UPDATE scans SET scan_count = ? WHERE user_id = ?',
                [scanCount, userId]
            );
        } else {
            // Sinon, insérer un nouvel enregistrement dans la table scans
            await db.query(
                'INSERT INTO scans (user_id, scan_count, scanned_at) VALUES (?, ?, NOW())',
                [userId, scanCount]
            );
        }

        res.status(200).json({ message: "Nombre de scans mis à jour avec succès." });
    } catch (err) {
        console.error('Erreur lors de la mise à jour des scans:', err);
        res.status(500).json({ error: "Erreur de base de données" });
    }
});

// Ajout d'un scan de QR code
app.post('/api/scan', verifyToken, async (req, res) => {
    const { qrCodeValue } = req.body;
    const userId = req.userId; // Récupère l'ID de l'utilisateur depuis le token

    if (!userId || !qrCodeValue) {
        return res.status(400).json({ message: "Les champs 'userId' et 'qrCodeValue' sont requis." });
    }

    try {
        // Vérifier si le QR code existe
        const [qrCode] = await db.query('SELECT id FROM qr_codes WHERE code_value = ?', [qrCodeValue]);

        if (qrCode.length === 0) {
            return res.status(404).json({ message: "QR code introuvable." });
        }

        const qrCodeId = qrCode[0].id;

        // Vérifier si ce QR code a déjà été scanné par cet utilisateur
        const [existingScan] = await db.query(
            'SELECT * FROM scans WHERE user_id = ? AND qr_code_id = ?',
            [userId, qrCodeId]
        );

        if (existingScan.length > 0) {
            return res.status(400).json({ message: "Scan déjà effectué pour cet utilisateur." });
        }

        // Si pas d'enregistrement, ajouter un scan avec un scan_count = 1
        await db.query(
            'INSERT INTO scans (user_id, qr_code_id, scanned_at, scan_count) VALUES (?, ?, NOW(), 1)',
            [userId, qrCodeId]
        );

        res.status(201).json({ message: "Scan enregistré avec succès." });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement du scan:', err);
        res.status(500).json({ error: "Erreur de base de données" });
    }
});

// route api afficher scores
app.get('/api/scores', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                u.id AS user_id,
                u.username,
                COALESCE(SUM(s.scan_count), 0) AS score
            FROM users u
                     LEFT JOIN scans s ON u.id = s.user_id
            GROUP BY u.id
            ORDER BY score DESC;
        `);

        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des scores:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users');
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});



// Route pour la connexion de l'utilisateur
app.post('/api/login', async (req, res) => {
    // let data = req.body;
    const { username } = req.body;
    console.log(username);

    if (!username) {
        return res.status(400).json({ message: 'Le champ "username" est requis.' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length === 0) {
            return res.status(400).json({ message: 'Nom d\'utilisateur introuvable.' });
        }

        const user = existingUser[0];
        const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Utilisateur connecté avec succès',
            token,
            userId: user.id, // Inclure l'ID utilisateur
        });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

// Route pour l'inscription
app.post('/api/signup', async (req, res) => {
    const { name, username } = req.body;

    if (!name || !username) {
        return res.status(400).json({ message: 'Les champs "name" et "username" sont requis.' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
        }

        const [result] = await db.query('INSERT INTO users (name, username) VALUES (?, ?)', [name, username]);
        const token = jwt.sign({ userId: result.insertId, username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            token,
            userId: result.insertId, // Inclure l'ID utilisateur
        });
    } catch (err) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

// Route pour attribuer les signes
app.post("/api/player-sign", async (req, res) => {
    const { userId, sign } = req.body;

    if (!userId || !sign) {
        return res.status(400).json({ error: "userId et sign sont requis." });
    }

    try {
        // Vérifier si un signe existe déjà pour ce joueur
        const [existingSign] = await db.query(
            "SELECT sign FROM player_sign WHERE users_id = ?",
            [userId]
        );

        if (existingSign.length > 0) {
            // Si un signe existe déjà, retourner ce signe
            return res.status(200).json({ message: "Signe déjà attribué.", sign: existingSign[0].sign });
        }

        // Insérer un nouveau signe si aucun n'existe
        await db.query("INSERT INTO player_sign (users_id, sign) VALUES (?, ?)", [userId, sign]);

        res.status(201).json({ message: "Signe attribué avec succès.", sign });
    } catch (err) {
        console.error("Erreur lors de l'attribution du signe :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// Route pour récupérer le signe d'un joueur
app.get("/api/player-sign/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query("SELECT sign FROM player_sign WHERE users_id = ?", [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Aucun signe trouvé pour ce joueur." });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Erreur lors de la récupération du signe :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});


// Route pour mettre à jour le statut d'un joueur
app.patch("/api/users/:userId", async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: "Le statut est requis." });
    }
    try {
        await db.query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
        res.status(200).json({ message: "Statut mis à jour." });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du statut :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});
// Route pour récupérer tous les signes attribués
app.get("/api/player-signs", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT users_id AS userId, sign FROM player_sign");
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des signes attribués :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
});
