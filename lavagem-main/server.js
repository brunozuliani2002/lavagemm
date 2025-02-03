const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("lavagem.db");

app.use(express.json());
app.use(cors());

// Criar tabela se não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS carros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cor TEXT,
        placa TEXT,
        valor REAL,
        data TEXT,
        total REAL
    )`);
});

// Rota para adicionar um carro
app.post("/carros", (req, res) => {
    const { nome, cor, placa, valor,total } = req.body;
    const data = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD
    db.run("INSERT INTO carros (nome, cor, placa, valor, data,total) VALUES (?, ?, ?, ?, ?,?)",
        [nome, cor, placa, valor, data,total],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, nome, cor, placa, valor, data,total });
        }
    );
});

// Rota para buscar os carros do dia atual
app.get("/carros", (req, res) => {
    const data = new Date().toISOString().split("T")[0];
    db.all("SELECT * FROM carros WHERE data = ?", [data], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para buscar carros de um dia específico
app.get("/carros/:data", (req, res) => {
    const { data } = req.params;
    db.all("SELECT * FROM carros WHERE data = ?", [data], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);''
    });
});

// Rota para deletar um carro
app.delete("/carros/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM carros WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Carro deletado" });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});


