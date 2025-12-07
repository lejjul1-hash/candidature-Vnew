const WEBHOOK = "https://discord.com/api/webhooks/1447005556635209899/tb29lQPMnF47DCR1w2BqQzXujui3qYhEVsY45GhJ9726gvlNfhTQ5cWSuwMXNZGHjgCy";
const ROLE_ID = "1446471808743243987";
const ADMIN_CODE = "Glastontop1234";
const WHITELIST_IP = "91.174.237.40";

// PAGE SYSTEM
function nextStep(){ step1.style.display="none"; step2.style.display="block"; }
function prevStep(){ step1.style.display="block"; step2.style.display="none"; }

// GET IP
async function getIP() {
  return await fetch("https://api.ipify.org").then(r=>r.text());
}

// SEND FORM
async function sendForm() {
    const ip = await getIP();

    // 24H
    if (ip !== WHITELIST_IP) {
        const last = localStorage.getItem("lastSubmit");
        if (last && Date.now() - last < 86400000) {
            status.innerHTML = "⛔ Vous devez attendre 24h avant de refaire une candidature.";
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
        extra: extra.value
    };

    const payload = {
        content: `<@&${ROLE_ID}>`,
        embeds: [{
            title: "📩 Nouvelle Candidature Staff",
            color: 0xff0000,
            fields: [
                { name:"Discord", value:data.discord },
                { name:"Catégorie", value:data.categorie },
                { name:"Présentation IRL", value:`${data.irl}` },
                { name:"Âge", value:data.age },
                { name:"Disponibilités", value:data.dispos },
                { name:"Motivations", value:data.motivations },
                { name:"Pourquoi lui ?", value:data.why },
                { name:"Qualités", value:data.qualites },
                { name:"Définition du rôle", value:data.definition },
                { name:"Expérience", value:data.experience },
                { name:"Ajouts", value:data.extra || "Aucun" }
            ]
        }]
    };

    await fetch(WEBHOOK, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
    });

    localStorage.setItem("lastSubmit", Date.now());

    // SAVE CANDIDATURE LOCAL
    let list = JSON.parse(localStorage.getItem("candidatures") || "[]");
    list.push({
        discord:data.discord,
        ip,
        categorie:data.categorie,
        motivations:data.motivations
    });
    localStorage.setItem("candidatures", JSON.stringify(list));

    status.innerHTML = "✅ Candidature envoyée !";
    setTimeout(()=>location.reload(),1400);
}

// ADMIN PANEL
function openAdmin() {
    let code = prompt("Code admin :");
    if (code !== ADMIN_CODE) return alert("Code invalide");

    let list = JSON.parse(localStorage.getItem("candidatures") || "[]");

    let html = `<h2>📂 Candidatures enregistrées</h2>
    <button class='admin-btn' onclick='clearAll()'>🗑 Supprimer toutes les candidatures</button><br><br>`;

    list.forEach(c=>{
        html += `
        <div class="admin-entry">
            <b>Pseudo Discord :</b> ${c.discord}<br>
            <b>IP :</b> ${c.ip}<br>
            <b>Catégorie :</b> ${c.categorie}<br>
            <b>Motivations :</b> ${c.motivations}
        </div>`;
    });

    adminPanel.innerHTML = html;
    adminPanel.style.display = "block";
}

function clearAll(){
    localStorage.removeItem("candidatures");
    adminPanel.innerHTML = "<p style='color:#ff4444;font-weight:700'>Toutes les candidatures ont été supprimées.</p>";
}
