import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connexion à la base de données réussie !");
        connection.release();
    } catch (err) {
        console.error("Erreur lors de la connexion initiale à la base de données :", err);
    }
})();


pool.on('connection', (connection) => {
    console.log('Nouvelle connexion à la base de données établie.');
    connection.on('error', (err) => {
        console.error('Erreur de connexion à la base de données:', err);
    });
    connection.on('close', () => {
        console.log('Connexion à la base de données fermée.');
    });
});
pool.getConnection()
    .then(conn => {
        console.log("Connexion réussie à la base de données !");
        conn.release();
    })
    .catch(err => {
        console.error("Erreur de connexion à la base de données :", err);
    });

export default pool;
