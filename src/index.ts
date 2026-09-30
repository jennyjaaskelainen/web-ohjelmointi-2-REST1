import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/sanakirja/:sana", (req, res) => {
    const haettavaSana = req.params.sana;

    const data = fs.readFileSync("src/sanakirja.txt", "utf8");
    const rivit = data.split("\n");

    for (const rivi of rivit) {
        const [suomi, englanti] = rivi.trim().split(" ");

        if (suomi === haettavaSana) {
            return res.json({
                suomi: suomi,
                englanti: englanti
            });
        }
    }

    return res.status(404).json({
        virhe: "Sanaa ei löytynyt"
    });
});

app.post("/sanakirja", (req, res) => {
    const { suomi, englanti } = req.body;

    if (!suomi || !englanti) {
        return res.status(400).json({
            virhe: "Suomenkielinen ja englanninkielinen sana vaaditaan"
        });
    }

    fs.appendFileSync(
        "src/sanakirja.txt",
        `\n${suomi} ${englanti}`
    );

    return res.status(201).json({
        viesti: "Sana lisätty",
        suomi: suomi,
        englanti: englanti
    });
});

app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});
