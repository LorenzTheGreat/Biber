// Game State
const gameState = {
    currentScene: 0,
    playerName: '',
    playerGender: '', // 'male' or 'female'
    totalScenes: 13,
    history: [],
    moonExplosionType: '', // 'fire' or 'laser'
    finalOutcome: '' // 'win' or 'lose'
};

// Get pronouns based on gender
function getPronoun(type = 'nominative') {
    if (gameState.playerGender === 'male') {
        if (type === 'nominative') return 'er';
        if (type === 'accusative') return 'ihn';
        if (type === 'dative') return 'ihm';
        if (type === 'possessive') return 'sein';
    } else {
        if (type === 'nominative') return 'sie';
        if (type === 'accusative') return 'sie';
        if (type === 'dative') return 'ihr';
        if (type === 'possessive') return 'ihr';
    }
}

function getTitle() {
    return gameState.playerGender === 'male' ? 'Held' : 'Heldin';
}

// Scene Definitions
const scenes = [
    // Scene 0: Charakterisierung (wird von UI gehandhabt)
    {
        id: 0,
        title: 'Charakterisierung',
        text: 'Warte auf Charakterisierung...',
        choices: []
    },
    // Scene 1: Aufwachen
    {
        id: 1,
        title: 'Aufwachen',
        getText: () => `Du wachst in deinem gemütlichen Bett auf. Morgenliche Sonnenstrahlen dringen durch die Fenster. 
Als du dich umsiehst, entdeckst du einen glänzenden, roten Schalter an der Wand neben deinem Bett, den du vorher noch nie bemerkt hast. 
Es ist sehr merkwürdig. Ein Gefühl von Neugier überkommt dich...`,
        choices: [
            { text: 'Den Schalter neugierig drücken', nextScene: 2, action: null },
            { text: 'Erst nochmal überlegen - das sieht verdächtig aus', nextScene: 1, action: 'reconsider' }
        ]
    },
    // Scene 2: Schalter drücken
    {
        id: 2,
        title: 'Der Schalter',
        getText: () => `Du steckst deine Hand aus und drückst den roten Schalter. 
Sofort ertönt ein lautes SUMMEN. Dein Bett beginnt zu vibrieren und elektrische Funken sprühen um dich herum!
"Oh Nein!" schreist du auf, während dein Bett vom Boden abhebt!`,
        choices: [
            { text: 'Festhalten und für das Beste beten', nextScene: 3, action: null },
            { text: 'Versuchen, aus dem Bett zu springen', nextScene: 3, action: 'jump' }
        ]
    },
    // Scene 3: Ins Weltall
    {
        id: 3,
        title: 'Der Flug beginnt',
        getText: () => `Dein Bett durchbricht das Dach und rast ins Weltall! Du siehst die Erde unter dir immer kleiner werden.
Der Wind pfeift um dich herum und du klammmerst dich ans Bett. 
Vor dir am Horizont siehst du den Mond - riesig und bedrohlich!
Das Bett fliegt schneller und schneller auf den Mond zu...`,
        choices: [
            { text: 'Versuchen, das Bett zu bremsen', nextScene: 4, action: 'brake' },
            { text: 'Dich dem Schicksal ergeben und durchhalten', nextScene: 4, action: null }
        ]
    },
    // Scene 4: Erste Weltraum-Gefahr
    {
        id: 4,
        title: 'Gefahr im All',
        getText: () => `Während du auf den Mond zufliegst, merkst du plötzlich: der Kurs des Bettes wird instabil!
Meteore schießen an dir vorbei! Ein großer Felsbrocken kommt direkt auf dich zu!
Du musst schnell ausweichen!`,
        choices: [
            { text: 'Nach oben ausweichen', nextScene: 5, action: 'up' },
            { text: 'Nach unten ausweichen', nextScene: 5, action: 'down' },
            { text: 'Geradeaus durchfahren', nextScene: 5, action: 'straight' }
        ]
    },
    // Scene 5: Nähe zum Mond
    {
        id: 5,
        title: 'Mond in Sichtweite',
        getText: () => `Du schaffst es, den Meteoren auszuweichen! Der Mond ist jetzt riesig vor dir!
Du kannst die Krater und Berge deutlich sehen. Das Bett wird immer schneller!
Du versuchst zu schreien, aber der Sound wird von der Weltraum-Stille geschluckt.
Dann... siehst du etwas Unerwartetes: Eine fremdländische Basis auf der Mondoberfläche!
Sie sendet dir ein Signal. Eine Stimme ertönt: "Willkommen, Besucher! Du hast zwei Optionen!"`,
        choices: [
            { text: 'Die Basis kontaktieren', nextScene: 6, action: 'contact' },
            { text: 'Weiterfliegen und ignorieren', nextScene: 7, action: 'ignore' }
        ]
    },
    // Scene 6: Mit Außerirdischen sprechen
    {
        id: 6,
        title: 'Außerirdischer Kontakt',
        getText: () => `Die Stimme sagt: "Wir sind die Hüter des Mondes. Du fliegst auf Kollisionskurs mit unserem Planeten!
Wir können dir zwei Wege zeigen: Du kannst mit uns an Bord kommen und sicher landen, oder du kannst versuchen, 
den Mond zu zerstören und dein Abenteuer fortsetzen!"
Das ist eine schwere Entscheidung...`,
        choices: [
            { text: 'Mit den Außerirdischen an Bord gehen', nextScene: 12, action: 'safe' },
            { text: 'Nein danke! Ich zerstöre den Mond lieber', nextScene: 8, action: null }
        ]
    },
    // Scene 7: Kein Signal heachten
    {
        id: 7,
        title: 'Mond-Kollisionskurs',
        getText: () => `Du ignorierst das Signal und fliegst weiter! Das Bett rast immer schneller auf den Mond zu!
Die Oberfläche kommt näher... näher... DU SCHAFFST ES NICHT ZU BREMSEN!
Der Aufprall ist unmittelbar - aber in diesem Moment aktiviert sich eine geheime Energieschild-Funktion deines magischen Bettes!
Der Schild hält gerade noch und dein Bett umrundet den Mond in einer großen Schleife...`,
        choices: [
            { text: 'Zum Mond zurückkehren und ihn zerstören', nextScene: 8, action: null },
            { text: 'Weiterfliegen ins Weltall', nextScene: 9, action: 'continue' }
        ]
    },
    // Scene 8: Mond-Zerstörung
    {
        id: 8,
        title: 'Die Mond-Explosion',
        getText: () => `Du lenkst dein Bett zurück zum Mond. Mit einer riesigen Energiewelle von deinem magischen Bett
triffst du den Mond direkt! "Es ist Zeit! Wie soll der Mond explodieren?" fragst du dich...
Die Energie baut sich auf - das ist deine letzte Chance, die Art der Explosion zu wählen!`,
        choices: [
            { text: 'FEUER-EXPLOSION!', nextScene: 9, action: 'fire', setExplosion: 'fire' },
            { text: 'LASER-EXPLOSION!', nextScene: 9, action: 'laser', setExplosion: 'laser' }
        ]
    },
    // Scene 9: Nach der Mond-Explosion
    {
        id: 9,
        title: 'Mond zerstört!',
        getText: () => {
            const explosionType = gameState.moonExplosionType === 'fire' ? 'riesige Feuer-Explosion' : 'blendende Laser-Explosion';
            return `Mit deinem Befehl entfesselt sich eine ${explosionType}! Der Mond zerfällt in tausend Bruchstücke!
Überall um dich herum fliegen Mondtrümmer. Dein Bett wird durchgeschüttelt!
Du merkst, dass die Auswirkungen der Explosion dich langsam zurück zur Erde saugen...
Jetzt musst du dich entscheiden: Willst du noch tiefer ins Weltall fliegen oder zurück nach Hause?`;
        },
        choices: [
            { text: 'Tiefer ins Weltall fliegen - das Abenteuer geht weiter!', nextScene: 10, action: 'deeper' },
            { text: 'Zurück nach Hause! Mir reicht es!', nextScene: 11, action: 'home' }
        ]
    },
    // Scene 10: Tieferes Weltall - Alternative Route
    {
        id: 10,
        title: 'Das tiefe Weltall',
        getText: () => `Du fliegst weiter ins dunkle Weltall! Vorbei an Schwarzen Löchern, Sternen und kosmischen Phänomenen.
Es ist unglaublich schön und furchteinflößend zugleich. Plötzlich wirst du von einer unsichtbaren Kraft durchgerüttelt!
Dein Bett schlingert wild herum! "Was ist das?!" schreist du. Die Welt dreht sich... und dann...
Alles wird schwarz. Du wachst auf und merkst... es war ein Traum! Oder war es?`,
        choices: [
            { text: 'Das war ein Traum! Weitermakin zu Szene 12', nextScene: 12, action: null }
        ]
    },
    // Scene 11: Nach Hause zurück
    {
        id: 11,
        title: 'Heimkehr',
        getText: () => `Du lenkst dein magisches Bett zurück zur Erde! Es wird immer schneller, als es in die Atmosphäre eintritt.
Du siehst dein Haus unter dir! Mit einem letzten großen Ruck durchbrichst du die Decke und...
BUMM! Du landest wieder in deinem Bett! Alles ist ruhig. Der Traum... oder die Realität?
Du fragst dich: War das alles echt? Dein Körper schmerzt... Vielleicht?
Dann schläfst du ein...`,
        choices: [
            { text: 'Weitergehen zu Szene 12', nextScene: 12, action: null }
        ]
    },
    // Scene 12: Aufwachen und Realisation
    {
        id: 12,
        title: 'Die Rückkehr zur Realität',
        getText: () => `Du wachst in deinem Bett auf. Die Morgen-Sonne scheint. Aber etwas ist anders...
Dein Bett hat Kratzer. Die Decke hat ein großes Loch! Deine Kleidung ist zerrissen!
Langsam wird dir bewusst: All das war real! Du hast wirklich den Mond zerstört!
Du merkst, dass du anfängst zu leuchten... eine Aura umgibt dich... dir werden Superkräfte verliehen!
Da hörst du eine Stimme von unten: "Was ist denn hier oben los?!" Es ist deine MUTTER!
Sie kommt die Treppe herauf...`,
        choices: [
            { text: 'Mutters Reaktion abwarten', nextScene: 13, action: null }
        ]
    },
    // Scene 13: Finale
    {
        id: 13,
        title: 'Das Finale',
        getText: () => {
            const pronoun1 = getPronoun('nominative');
            const pronoun2 = getPronoun('possessive');
            return `Deine Mutter öffnet die Türe und sieht die Zerstörung. Sie sieht dich mit deinen glühenden Superkräften!
Ihre Augen werden riesig groß. "Was... Was ist passiert hier?!" schreit sie!
In diesem Moment erinnert sie sich: Sie hat früher auch solche Kräfte gehabt!
Sie lächelt verwirrt: "Das erklärt manche Dinge... Du hast ${pronoun2} Potenzial geerbt!"
Die Mutter umarmt dich. "Willkommen in der Welt der Superkräftigen, mein Kind!"
${pronoun1.toUpperCase()} hast es geschafft!`;
        },
        choices: [
            { text: 'Spiel neustarten', nextScene: -1, action: 'restart' }
        ]
    }
];

// Handle Form Submission
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('playerName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});

function startGame() {
    const name = document.getElementById('playerName').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const errorElement = document.getElementById('formError');

    errorElement.textContent = '';

    if (!name) {
        errorElement.textContent = 'Bitte gib deinen Namen ein!';
        return;
    }

    if (!gender) {
        errorElement.textContent = 'Bitte wähle dein Geschlecht!';
        return;
    }

    gameState.playerName = name;
    gameState.playerGender = gender;
    gameState.currentScene = 1;

    document.getElementById('charForm').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';

    showScene(1);
}

function showScene(sceneId) {
    gameState.currentScene = sceneId;
    const scene = scenes[sceneId];

    if (!scene) {
        endGame();
        return;
    }

    // Update Progress Bar
    const progress = (sceneId / gameState.totalScenes) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('sceneNumber').textContent = `Szene ${sceneId} von ${gameState.totalScenes}`;

    // Get story text
    const storyText = typeof scene.getText === 'function' ? scene.getText() : scene.text;
    document.getElementById('storyText').textContent = storyText;

    // Render Choices
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    scene.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'btn btn-choice';
        button.textContent = choice.text;
        button.addEventListener('click', () => {
            if (choice.setExplosion) {
                gameState.moonExplosionType = choice.setExplosion;
            }
            showScene(choice.nextScene);
        });
        choicesContainer.appendChild(button);
    });

    // Scroll to top
    document.querySelector('.story-container').scrollTop = 0;
}

function endGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div style="text-align: center; padding: 40px; animation: fadeIn 0.8s ease-in;">
            <h2 style="color: #00d4ff; font-size: 2em; margin-bottom: 20px;">🎉 HERZLICHEN GLÜCKWUNSCH! 🎉</h2>
            <p style="font-size: 1.2em; margin-bottom: 20px; color: #eee;">
                <strong>${gameState.playerName}</strong>, du hast das epische Abenteuer bestanden!
            </p>
            <p style="font-size: 1.1em; margin-bottom: 30px; color: #00ff88;">
                Du hast den Mond zerstört, ins tiefe Weltall gereist, und erhältst nun Superkräfte!<br>
                Die Welt wird sich niemals wieder gleich anfühlen...
            </p>
            <button class="btn btn-primary" onclick="location.reload()" style="max-width: 300px; margin: 0 auto;">
                Nochmal spielen?
            </button>
        </div>
    `;
}

// Initialize
console.log('Weltall Abenteuer Spiel geladen!');
