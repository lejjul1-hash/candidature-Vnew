const WEBHOOK = "https://discord.com/api/webhooks/1447005556635209899/tb29lQPMnF47DCR1w2BqQzXujui3qYhEVsY45GhJ9726gvlNfhTQ5cWSuwMXNZGHjgCy";
const ADMIN_CODE = "Glastontop1234";
const WL_IP = "91.174.237.40";   // ignore 24h

// ---- Changer Page ----
function gotoPage2() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
}

function gotoPage1() {
    document.getElementById("page1").style.display = "block";
    document.getElementById("page2").style.display = "none";
}

// ---- SYSTEME ADMIN ----
function openAdmin() {
    let code = prompt("Code Admin :");

    if (code !== ADMIN_CODE) return alert("Code invalide");

    document.getElementById("adminPanel").style.display = "block";

    let list = JSON.parse(localStorage.getItem("candidatures") || "[]");
    let html = "";

    list.forEach(c => {
        html += `
        <div class="card" style="margin-top:10px;">
            <b>${c.discord}</b><br>
            IP : ${c.ip}<br>
            Catégorie : ${c.categorie}<br><br>
            <b>Motivations :</b><br>${c.motivations}<br><br>
        </div>`;
    });

    document.getElementById("adminList").innerHTML = html;
}

function clearCandidatures() {
    localStorage.removeItem("candidatures");
    alert("Toutes les candidatures ont été supprimées !");
    document.getElementById("adminList").innerHTML = "";
}

// ---- ENVOI ----
async function sendForm() {
    const ip = await fetch("https://api.ipify.org").then(r => r.text());

    // 24h limit
    const last = localStorage.getItem("lastSubmit");
    if (ip !== WL_IP) {
        if (last && Date.now() - last < 86400000) {
            document.getElementById("status").innerHTML = "⛔ Vous devez attendre 24h avant de refaire une candidature.";
            return;
        }
    }

    const data = {
        irl: irl.value,
        discord: discord.value,
        prenom: prenom.value,
        age: age.value,
        dispos: dispos.value,
        categorie: categorie.value,
        motivations: motivations.value,
        why: why.value,
        qualites: qualites.value,
        definition: definition.value,
        experience: experience.value,
        extra: extra.value,
        ip
    };

    // embed
    const payload = {
        content: "<@&1446471808743243987>",
        embeds: [{
            title: "📩 Nouvelle Candidature Staff",
            color: 16711680,
            fields: [
                { name: "Discord", value: data.discord },
                { name: "Présentation IRL", value: data.irl },
                { name: "Âge", value: data.age },
                { name: "Disponibilités", value: data.dispos },
                { name: "Catégorie", value: data.categorie },
                { name: "Motivations", value: data.motivations },
                { name: "Pourquoi lui ?", value: data.why },
                { name: "Qualités", value: data.qualites },
                { name: "Définition du rôle", value: data.definition },
                { name: "Expérience", value: data.experience },
                { name: "Ajouts", value: data.extra }
            ]
        }]
    };

    // Envoi webhook
    await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    // save local
    let list = JSON.parse(localStorage.getItem("candidatures") || "[]");
    list.push(data);
    localStorage.setItem("candidatures", JSON.stringify(list));

    localStorage.setItem("lastSubmit", Date.now());

    document.getElementById("status").innerHTML = "✅ Candidature envoyée ! Merci.";

    setTimeout(() => location.reload(), 1500);
}
