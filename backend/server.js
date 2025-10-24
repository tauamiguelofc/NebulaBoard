import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models.js";

// Se estiver usando secrets do Codespace, dotenv não é necessário
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Caminhos absolutos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

console.log("🧱 Servindo arquivos estáticos de:", publicPath);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

// Conexão MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI não definida. Adicione como secret no Codespace.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Erro no MongoDB:", err);
    process.exit(1);
  });

// Rotas de API
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.json({ success: false, message: "Preencha todos os campos." });

  try {
    // Checa se já existe usuário
    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email já cadastrado." });

    const user = new User({ username, email, password });
    await user.save();
    res.json({ success: true, message: "Usuário criado com sucesso!" });
  } catch (e) {
    console.error("Erro no registro:", e);
    res.json({ success: false, message: "Erro ao criar usuário." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Preencha todos os campos." });

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.json({ success: false, message: "Credenciais inválidas." });

    res.json({ success: true, username: user.username });
  } catch (e) {
    console.error("Erro no login:", e);
    res.json({ success: false, message: "Erro ao fazer login." });
  }
});

// Rotas para servir páginas
["/", "/login", "/register", "/dashboard"].forEach((route) => {
  const file = route === "/" ? "index.html" : route.slice(1) + ".html";
  app.get(route, (req, res) => res.sendFile(path.join(publicPath, file)));
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Rodando em http://localhost:${PORT}`);
});
