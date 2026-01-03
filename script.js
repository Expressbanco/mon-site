// script.js

// 1. MOTEUR 3D - PLUIE DE PIÈCES D'OR
let scene, camera, renderer, coins = [];

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Création des pièces
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xbf953f, 
        metalness: 1, 
        roughness: 0.3 
    });

    for (let i = 0; i < 60; i++) {
        const coin = new THREE.Mesh(geometry, material);
        coin.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5);
        coin.rotation.x = Math.random() * Math.PI;
        coins.push(coin);
        scene.add(coin);
    }
    camera.position.z = 8;
}

function animate() {
    requestAnimationFrame(animate);
    coins.forEach(c => {
        c.rotation.y += 0.02;
        c.position.y -= 0.02; // Chute
        if (c.position.y < -10) c.position.y = 10; // Reset en haut
    });
    renderer.render(scene, camera);
}

// 2. LOGIQUE DES ÉTAPES (4S et 5S)
const input = document.getElementById('adminCode');

input.addEventListener('input', (e) => {
    if (e.target.value === '5793') {
        document.getElementById('loader4s').classList.remove('hidden');
        input.disabled = true;

        // ÉTAPE 1 -> ÉTAPE 2 (Attente 4 secondes)
        setTimeout(() => {
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            runTransfer();
        }, 4000);
    }
});

function runTransfer() {
    const bar = document.getElementById('main-progress');
    const text = document.getElementById('percentText');
    let width = 0;

    // ÉTAPE 2 -> ÉTAPE 3 (Chargement 5 secondes)
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('step2').classList.add('hidden');
                document.getElementById('step3').classList.remove('hidden');
                setFinalData();
            }, 500);
        } else {
            width++;
            bar.style.width = width + '%';
            text.innerText = width + '%';
        }
    }, 50); // 100 pas * 50ms = 5000ms (5 secondes)
}

function setFinalData() {
    const now = new Date();
    document.getElementById('finalDate').innerText = now.toLocaleDateString();
    document.getElementById('finalTime').innerText = now.toLocaleTimeString();
}

// 3. GÉNÉRATION DU PDF PRO
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = document.getElementById('finalDate').innerText;

    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(191, 149, 63);
    doc.setFontSize(22);
    doc.text("PICHINCHA BANK - TRANSFER ADVICE", 105, 40, { align: "center" });

    doc.setDrawColor(191, 149, 63);
    doc.line(20, 50, 190, 50);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Beneficiary: HENIDTT XIMENA COSTALES PALTAN`, 20, 70);
    doc.text(`Account Number: 3373167204`, 20, 80);
    doc.text(`Bank ID: 2211435131`, 20, 90);
    doc.text(`Date: ${date}`, 20, 100);

    doc.setFontSize(20);
    doc.text(`TOTAL AMOUNT: $ 13,600.00 USD`, 20, 130);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Digitally signed and verified by PICHINCHA 3D-PRO System", 105, 280, { align: "center" });

    doc.save(`Transfer_Pichincha_${date}.pdf`);
}

// 4. LOGIQUE MENU MODAL
const modal = document.getElementById('infoModal');
const modalText = document.getElementById('modalContent');

function openModal(type) {
    const info = {
        about: "PICHINCHA est une institution financière majeure spécialisée dans les transferts de haute sécurité.",
        portfolio: "Portefeuille Actif : $ 13,600.00 en attente de confirmation finale.",
        contact: "Support Premium : vip@pichincha.com | +221 143 51 31"
    };
    modalText.innerText = info[type];
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// Init
init3D();
animate();