import * as THREE from "three";
import "./styles.css";

const canvas = document.querySelector("#game");
const startPanel = document.querySelector("#startPanel");
const startButton = document.querySelector("#startButton");
const retryButton = document.querySelector("#retryButton");
const menuButton = document.querySelector("#menuButton");
const hud = document.querySelector("#hud");
const gameOver = document.querySelector("#gameOver");
const message = document.querySelector("#message");
const healthText = document.querySelector("#healthText");
const coinsText = document.querySelector("#coinsText");
const ammoText = document.querySelector("#ammoText");
const opponentsText = document.querySelector("#opponentsText");
const waveText = document.querySelector("#waveText");
const killText = document.querySelector("#killText");
const modeText = document.querySelector("#modeText");
const mapText = document.querySelector("#mapText");
const weaponStrip = document.querySelector("#weaponStrip");
const reloadMeter = document.querySelector("#reloadMeter");
const miniMap = document.querySelector("#miniMap");
const damageFlash = document.querySelector("#damageFlash");
const hitMarker = document.querySelector("#hitMarker");
const waveBanner = document.querySelector("#waveBanner");
const streakText = document.querySelector("#streakText");
const crosshair = document.querySelector("#crosshair");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");

// Map names and descriptions for home screen
const mapInfo = [
  { name: "Factory Area", desc: "Close quarters combat", emoji: "🏭" },
  { name: "Desert Town", desc: "Open lanes, long range", emoji: "🏜️" },
  { name: "Neon City", desc: "Fast action, verticality", emoji: "🌃" }
];

// PUBG/GTA V style guns with realistic stats
const allGuns = [
  // Pistols
  { id: "p92", name: "P92", type: "Pistol", damage: 22, rpm: 400, range: 100, spread: 0.03, mag: 60, reload: 1.2, cost: 0, level: 1, attachments: ["redDot", "extendedMag"] },
  { id: "p1911", name: "P1911", type: "Pistol", damage: 32, rpm: 350, range: 110, spread: 0.025, mag: 60, reload: 1.1, cost: 1500, level: 2, attachments: ["redDot", "suppressor"] },
  { id: "deagle", name: "Deagle", type: "Pistol", damage: 65, rpm: 200, range: 120, spread: 0.04, mag: 60, reload: 1.4, cost: 5000, level: 5, attachments: ["redDot", "extendedMag", "补偿器"] },

  // SMGs
  { id: "ump45", name: "UMP45", type: "SMG", damage: 38, rpm: 520, range: 140, spread: 0.035, mag: 60, reload: 1.8, cost: 8000, level: 8, attachments: ["redDot", "vertGrip", "extendedMag"] },
  { id: "uzi", name: "UZI", type: "SMG", damage: 30, rpm: 780, range: 120, spread: 0.04, mag: 60, reload: 1.5, cost: 10000, level: 10, attachments: ["redDot", "vertGrip"] },
  { id: "vector", name: "Vector", type: "SMG", damage: 34, rpm: 900, range: 130, spread: 0.03, mag: 60, reload: 1.6, cost: 15000, level: 12, attachments: ["redDot", "vertGrip", "extendedMag", "compensator"] },
  { id: "thompson", name: "Thompson", type: "SMG", damage: 45, rpm: 480, range: 140, spread: 0.032, mag: 60, reload: 2.0, cost: 18000, level: 15, attachments: ["vertGrip", "extendedMag", "redDot"] },

  // Rifles
  { id: "akm", name: "AKM", type: "Rifle", damage: 85, rpm: 320, range: 200, spread: 0.022, mag: 60, reload: 2.2, cost: 35000, level: 20, attachments: ["redDot", "vertGrip", "extendedMag", "compensator"] },
  { id: "m416", name: "M416", type: "Rifle", damage: 78, rpm: 450, range: 220, spread: 0.018, mag: 60, reload: 2.0, cost: 45000, level: 22, attachments: ["redDot", "vertGrip", "extendedMag", "lightGrip", "compensator"] },
  { id: "scar", name: "SCAR-L", type: "Rifle", damage: 82, rpm: 400, range: 210, spread: 0.019, mag: 60, reload: 2.1, cost: 50000, level: 25, attachments: ["redDot", "vertGrip", "extendedMag", "lightGrip"] },
  { id: "groza", name: "Groza", type: "Rifle", damage: 95, rpm: 380, range: 190, spread: 0.021, mag: 60, reload: 2.3, cost: 75000, level: 30, attachments: ["redDot", "extendedMag", "compensator"] },

  // DMRs
  { id: "sks", name: "SKS", type: "DMR", damage: 120, rpm: 180, range: 280, spread: 0.012, mag: 60, reload: 2.0, cost: 60000, level: 28, attachments: ["scope4x", "vertGrip", "extendedMag", "lightGrip"] },
  { id: "mini14", name: "Mini14", type: "DMR", damage: 110, rpm: 220, range: 300, spread: 0.01, mag: 60, reload: 1.8, cost: 65000, level: 32, attachments: ["scope4x", "extendedMag", "lightGrip"] },
  { id: "qbu", name: "QBU", type: "DMR", damage: 115, rpm: 200, range: 310, spread: 0.009, mag: 60, reload: 1.9, cost: 70000, level: 35, attachments: ["scope4x", "vertGrip", "extendedMag"] },

  // Snipers
  { id: "m24", name: "M24", type: "Sniper", damage: 280, rpm: 45, range: 450, spread: 0.003, mag: 60, reload: 2.8, cost: 120000, level: 40, attachments: ["scope8x", "extendedMag", "suppressor", "cheekPad"] },
  { id: "awp", name: "AWP", type: "Sniper", damage: 450, rpm: 40, range: 500, spread: 0.002, mag: 60, reload: 3.0, cost: 250000, level: 50, attachments: ["scope8x", "extendedMag", "suppressor"] },
  { id: "kar98", name: "Kar98", type: "Sniper", damage: 250, rpm: 55, range: 400, spread: 0.005, mag: 60, reload: 2.5, cost: 100000, level: 38, attachments: ["scope4x", "extendedMag", "cheekPad"] },

  // LMGs
  { id: "dp28", name: "DP-28", type: "LMG", damage: 90, rpm: 520, range: 180, spread: 0.035, mag: 60, reload: 2.8, cost: 80000, level: 35, attachments: ["scope4x", "vertGrip"] },
  { id: "m249", name: "M249", type: "LMG", damage: 100, rpm: 650, range: 200, spread: 0.04, mag: 600, reload: 3.5, cost: 150000, level: 45, attachments: ["scope4x", "vertGrip", "extendedMag"] },

  // Shotguns
  { id: "s1897", name: "S1897", type: "Shotgun", damage: 150, rpm: 80, range: 50, spread: 0.15, mag: 60, reload: 2.8, cost: 5000, level: 5, attachments: ["choke"] },
  { id: "s12k", name: "S12K", type: "Shotgun", damage: 130, rpm: 150, range: 60, spread: 0.12, mag: 60, reload: 2.0, cost: 12000, level: 12, attachments: ["extMag", "redDot"] },
  { id: "dbs", name: "DBS", type: "Shotgun", damage: 160, rpm: 120, range: 70, spread: 0.1, mag: 60, reload: 2.2, cost: 25000, level: 18, attachments: ["redDot", "extMag"] }
];

// All guns start locked except P92
allGuns.forEach((gun, i) => { gun.unlocked = i === 0; gun.upgrades = {}; });

// Attachment types
const attachments = {
  redDot: { name: "Red Dot", cost: 300, effect: { spread: -0.005 } },
  scope4x: { name: "4x Scope", cost: 600, effect: { range: 15, spread: -0.003 } },
  scope8x: { name: "8x Scope", cost: 1200, effect: { range: 25, spread: -0.005 } },
  vertGrip: { name: "Vertical Grip", cost: 400, effect: { spread: -0.008 } },
  lightGrip: { name: "Light Grip", cost: 350, effect: { spread: -0.006, recoil: -0.1 } },
  extendedMag: { name: "Extended Mag", cost: 500, effect: { mag: 10 } },
  suppressor: { name: "Suppressor", cost: 800, effect: { range: -5, sound: -0.5 } },
  compensator: { name: "Compensator", cost: 600, effect: { spread: -0.01, recoil: -0.15 } },
  choke: { name: "Choke", cost: 400, effect: { spread: -0.05 } },
  extMag: { name: "Extended Mag", cost: 450, effect: { mag: 5 } },
  cheekPad: { name: "Cheek Pad", cost: 500, effect: { recoil: -0.2 } }
};

// Map configurations with distinct locations
const maps = [
  {
    name: "Factory Area",
    spawn: new THREE.Vector3(-25, 1.75, -25),
    sky: 0x2a2a2a,
    fog: 0x1a1a1a,
    floor: 0x3a3a3a,
    accent: 0xff6600,
    light: 0xffaa55,
    props: [
      [0, 0, 15, 5, 15], [20, 0, 10, 4, 8], [-20, 0, 8, 4, 12],
      [10, 20, 12, 4, 6], [-10, -20, 10, 4, 8], [0, 40, 20, 4, 10],
      [-40, 0, 8, 4, 20], [40, 0, 8, 4, 20], [0, -40, 25, 4, 8],
      [30, 30, 6, 4, 6], [-30, -30, 6, 4, 6], [35, -20, 8, 4, 10],
      [-35, 20, 8, 4, 10], [15, -30, 10, 4, 5], [-15, 30, 10, 4, 5]
    ],
    enemyArea: { minX: -40, maxX: 40, minZ: -40, maxZ: 40 }
  },
  {
    name: "Desert Town",
    spawn: new THREE.Vector3(25, 1.75, 25),
    sky: 0x8b7355,
    fog: 0xa08060,
    floor: 0x9a8060,
    accent: 0x4a90c2,
    light: 0xffe4b5,
    props: [
      [0, 0, 20, 3, 20], [-25, 0, 12, 3, 8], [25, 0, 12, 3, 8],
      [0, 25, 15, 3, 6], [0, -25, 15, 3, 6], [-35, -35, 10, 3, 10],
      [35, 35, 10, 3, 10], [-35, 35, 8, 3, 12], [35, -35, 8, 3, 12],
      [20, 35, 12, 3, 8], [-20, -35, 12, 3, 8], [35, 0, 6, 3, 15],
      [-35, 0, 6, 3, 15]
    ],
    enemyArea: { minX: -35, maxX: 35, minZ: -35, maxZ: 35 }
  },
  {
    name: "Neon City",
    spawn: new THREE.Vector3(0, 1.75, 25),
    sky: 0x0a0a20,
    fog: 0x151530,
    floor: 0x202040,
    accent: 0x00ffff,
    light: 0x8080ff,
    props: [
      [0, 0, 10, 6, 10], [-20, 0, 8, 5, 8], [20, 0, 8, 5, 8],
      [0, 20, 8, 5, 8], [0, -20, 8, 5, 8], [-30, -30, 6, 4, 6],
      [30, 30, 6, 4, 6], [30, -30, 6, 4, 6], [-30, 30, 6, 4, 6],
      [15, 30, 12, 4, 6], [-15, -30, 12, 4, 6], [35, 0, 5, 5, 10],
      [-35, 0, 5, 5, 10], [0, 40, 18, 4, 5]
    ],
    enemyArea: { minX: -35, maxX: 35, minZ: -35, maxZ: 35 }
  }
];

const difficulties = {
  easy: { label: "Recruit", enemySlots: 4, damage: 0.6, health: 0.6, speed: 0.7, spawn: 1.5, waveKills: 12, waveGrowth: 0.6, coins: 1.0, cooldown: 1.8, range: 0.7 },
  normal: { label: "Soldier", enemySlots: 5, damage: 1, health: 1, speed: 1, spawn: 1, waveKills: 10, waveGrowth: 1, coins: 1, cooldown: 1.2, range: 1 },
  hard: { label: "Veteran", enemySlots: 8, damage: 1.6, health: 1.4, speed: 1.5, spawn: 0.7, waveKills: 8, waveGrowth: 1.5, coins: 1.5, cooldown: 0.5, range: 1.3 },
  extreme: { label: "Elite", enemySlots: 12, damage: 3.0, health: 2.0, speed: 2.2, spawn: 0.4, waveKills: 6, waveGrowth: 2.0, coins: 2.0, cooldown: 0.2, range: 1.6 }
};

// Game state
let currentLevel = 1;
let selectedMap = 0;
let selectedDifficulty = "normal";
let currentGunId = "p92";
let gameCoins = 0;
let totalKills = 0;
let health = 100;
let ammo = {};
let wave = 1;
let streak = 0;
let started = false;
let aiming = false;
let firing = false;
let reloading = false;
let reloadStart = 0;
let reloadDuration = 0;
let lastShot = 0;
let lastStep = 0;
let recoilPitch = 0;
let lastDamageTaken = 0;
let lastEnemyDamage = 0;
let passiveHealTimer = 0;
let yaw = 0;
let pitch = 0;
let velocity = new THREE.Vector3();
let cover = [];
let enemies = [];
let pickups = [];
let bulletBeams = [];
let hitEffects = [];
let worldGroup = new THREE.Group();
let gunGroup = new THREE.Group();
let muzzleLight = new THREE.PointLight(0xfff1a3, 0, 8);
let audioContext;
let enemyDeathAudios = [];
let equippedGuns = [allGuns[0], null, null];

const mapInfo = [
  { emoji: "🏭", desc: "Industrial factory with close quarters." },
  { emoji: "🏜️", desc: "Open desert field with long range lanes." },
  { emoji: "🌆", desc: "Neon city rooftop with fast verticality." }
];

function getEquippedGun(slot) {
  return equippedGuns[slot];
}

const keys = new Set();
const maxActiveTracers = 30;
let gameMode = "menu"; // menu, shop, playing

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 300);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const tmpVec = new THREE.Vector3();

scene.add(worldGroup);
camera.add(gunGroup);
camera.add(muzzleLight);
scene.add(camera);

// Create home screen HTML
function createHomeScreen() {
  const homeScreen = document.createElement("div");
  homeScreen.id = "homeScreen";
  homeScreen.innerHTML = `
    <div class="homeContainer">
      <div class="homeHeader">
        <h1>BATTLE ZONE</h1>
        <p class="homeSubtitle">50 Levels • 3 Maps • 20+ Weapons</p>
      </div>

      <div class="homeStats">
        <div class="statBox">
          <span>Coins</span>
          <strong id="homeCoins">${gameCoins}</strong>
        </div>
        <div class="statBox">
          <span>Level</span>
          <strong id="homeLevel">${currentLevel}</strong>
        </div>
        <div class="statBox">
          <span>Kills</span>
          <strong id="homeKills">${totalKills}</strong>
        </div>
      </div>

      <div class="homeSection">
        <h2>⚔️ SELECT MAP</h2>
        <div class="mapGrid">
          ${maps.map((m, i) => `
            <div class="mapCard ${selectedMap === i ? 'selected' : ''}" data-map="${i}">
              <div class="mapIcon">${mapInfo[i].emoji}</div>
              <div class="mapName">${m.name}</div>
              <div class="mapDesc">${mapInfo[i].desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="homeSection">
        <h2>🎯 SELECT DIFFICULTY</h2>
        <div class="diffGrid">
          ${Object.entries(difficulties).map(([key, d]) => `
            <div class="diffCard ${selectedDifficulty === key ? 'selected' : ''}" data-diff="${key}">
              <div class="diffName">${d.label}</div>
              <div class="diffDesc">Wave: ${d.waveKills} kills</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="homeSection">
        <h2>🔫 WEAPON LOADOUT</h2>
        <div class="weaponLoadout" id="weaponLoadout">
          ${createWeaponSlotsHTML()}
        </div>
      </div>

      <button class="startBtn" id="startGameBtn">START BATTLE</button>

      <div class="levelProgress">
        <div class="levelText">Level ${currentLevel} / 50</div>
        <div class="levelBar"><div class="levelFill" style="width: ${(currentLevel/50)*100}%"></div></div>
      </div>
    </div>
  `;
  document.getElementById("app").appendChild(homeScreen);

  // Event listeners
  document.querySelectorAll('.mapCard').forEach(card => {
    card.addEventListener('click', () => {
      selectedMap = parseInt(card.dataset.map);
      updateHomeSelection();
    });
  });

  document.querySelectorAll('.diffCard').forEach(card => {
    card.addEventListener('click', () => {
      selectedDifficulty = card.dataset.diff;
      updateHomeSelection();
    });
  });

  document.getElementById('startGameBtn').addEventListener('click', startGame);
}

function createWeaponSlotsHTML() {
  const slots = [0, 1, 2];
  return slots.map(slot => {
    const gun = getEquippedGun(slot);
    return `
      <div class="weaponSlot" data-slot="${slot}">
        <div class="slotNum">SLOT ${slot + 1}</div>
        ${gun ? `
          <div class="slotGun">${gun.name}</div>
          <div class="slotType">${gun.type}</div>
        ` : `
          <div class="slotEmpty">EMPTY</div>
        `}
        <button class="slotBtn" onclick="openWeaponShop(${slot})">${gun ? 'CHANGE' : 'SELECT'}</button>
      </div>
    `;
  }).join('');
}

let equippedGuns = [allGuns[0], null, null]; // 3 weapon slots

function getEquippedGun(slot) {
  return equippedGuns[slot];
}

function openWeaponShop(slot) {
  showShopForSlot(slot);
}

function showShopForSlot(slot) {
  const shop = document.createElement('div');
  shop.id = 'weaponShop';
  shop.innerHTML = `
    <div class="shopOverlay">
      <div class="shopModal">
        <h2>🔫 WEAPON SHOP - Slot ${slot + 1}</h2>
        <div class="shopCoins">Coins: ${gameCoins}</div>
        <div class="shopGrid">
          ${allGuns.map((gun, i) => {
            const owned = gun.unlocked;
            const equipped = equippedGuns[slot]?.id === gun.id;
            const canBuy = gameCoins >= gun.cost && currentLevel >= gun.level;
            return `
              <div class="shopGun ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''} ${!canBuy && !owned ? 'locked' : ''}" data-gun="${i}">
                <div class="gunName">${gun.name}</div>
                <div class="gunType">${gun.type}</div>
                <div class="gunStats">
                  <div>DMG: ${Math.round(gun.damage * (1 + (gun.upgrades?.damage || 0) * 0.2))}</div>
                  <div>MAG: ${Math.round(gun.mag + (gun.upgrades?.mag || 0) * 5)}</div>
                  <div>RPM: ${gun.rpm}</div>
                </div>
                <div class="gunLevel">Level ${gun.level}</div>
                ${owned ? `
                  <div class="upgradeSection">
                    <button class="upgradeBtn" onclick="upgradeGun(${i}, 'damage')">DMG+ (${Math.round(gun.cost * 0.2)}c)</button>
                    <button class="upgradeBtn" onclick="upgradeGun(${i}, 'mag')">MAG+ (${Math.round(gun.cost * 0.2)}c)</button>
                  </div>
                  ${equipped ? '<div class="gunStatus">EQUIPPED</div>' : `<button class="gunBtn" onclick="equipGun(${slot}, ${i})">EQUIP</button>`}
                ` : (canBuy ? `<button class="gunBtn buy" onclick="buyGun(${i})">BUY ${gun.cost} coins</button>` : `<div class="gunStatus">Level ${gun.level} Required</div>`)}
              </div>
            `;
          }).join('')}
        </div>
        <button class="shopClose" onclick="closeShop()">CLOSE</button>
      </div>
    </div>
  `;
  document.getElementById("app").appendChild(shop);
}

function upgradeGun(gunIndex, stat) {
  const gun = allGuns[gunIndex];
  const cost = Math.round(gun.cost * 0.2) || 500;
  if (gameCoins >= cost && gun.unlocked) {
    gameCoins -= cost;
    gun.upgrades[stat] = (gun.upgrades[stat] || 0) + 1;
    updateHomeScreen();
    closeShop();
    showShopForSlot(0); // Refresh shop
    showMessage(`Upgraded ${gun.name} ${stat}!`);
  } else {
    showMessage("Not enough coins!");
  }
}

function buyGun(gunIndex) {
  const gun = allGuns[gunIndex];
  if (gameCoins >= gun.cost && currentLevel >= gun.level && !gun.unlocked) {
    gameCoins -= gun.cost;
    gun.unlocked = true;
    equippedGuns[0] = gun;
    updateHomeScreen();
    closeShop();
    showMessage(`Purchased ${gun.name}!`);
  }
}

function equipGun(slot, gunIndex) {
  equippedGuns[slot] = allGuns[gunIndex];
  updateHomeScreen();
  closeShop();
}

function closeShop() {
  document.getElementById('weaponShop')?.remove();
}

function updateHomeSelection() {
  document.querySelectorAll('.mapCard').forEach((c, i) => {
    c.classList.toggle('selected', i === selectedMap);
  });
  document.querySelectorAll('.diffCard').forEach(c => {
    c.classList.toggle('selected', c.dataset.diff === selectedDifficulty);
  });
}

function updateHomeScreen() {
  const home = document.getElementById('homeScreen');
  if (home) {
    home.querySelector('#homeCoins').textContent = gameCoins;
    home.querySelector('#homeLevel').textContent = currentLevel;
    home.querySelector('#homeKills').textContent = totalKills;
    home.querySelector('.levelFill').style.width = `${(currentLevel/50)*100}%`;
    home.querySelector('#weaponLoadout').innerHTML = createWeaponSlotsHTML();
  }
}

function showShop() {
  showShopForSlot(0);
}

function updateHud() {
  const gun = getEquippedGun(0) || allGuns[0];
  const ammoState = ammo[gun.id] || { clip: gun.mag, reserve: gun.mag * 3 };
  healthText.textContent = Math.max(0, Math.round(health));
  coinsText.textContent = gameCoins;
  ammoText.textContent = `${ammoState.clip} / ${ammoState.reserve}`;
  opponentsText.textContent = `${enemies.filter(e => e.userData?.alive).length} / 5`;
  waveText.textContent = currentLevel;
  killText.textContent = totalKills;
  modeText.textContent = difficulties[selectedDifficulty].label;
  mapText.textContent = maps[selectedMap].name;
}

function showMessage(text) {
  message.textContent = text;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    message.textContent = "Click to lock aim | WASD move | Mouse aim";
  }, 2500);
}

function startGame() {
  document.getElementById('homeScreen')?.remove();
  ensureAudio();
  started = true;
  health = 100;
  wave = 0;
  totalKills = 0;
  streak = 0;
  recoilPitch = 0;
  lastDamageTaken = 0;
  lastEnemyDamage = 0;
  passiveHealTimer = 0;

  // Initialize ammo for equipped guns
  ammo = {};
  equippedGuns.forEach(gun => {
    if (gun) {
      ammo[gun.id] = { clip: gun.mag, reserve: gun.mag * 3 };
    }
  });

  const gun = getEquippedGun(0) || allGuns[0];
  ammo[gun.id] = { clip: gun.mag, reserve: gun.mag * 3 };

  reloading = false;
  firing = false;
  reloadMeter.classList.remove("active");
  velocity.set(0, 0, 0);

  startPanel.classList.add("hidden");
  gameOver.classList.add("hidden");
  hud.classList.remove("hidden");

  currentGunId = (getEquippedGun(0) || allGuns[0]).id;
  buildMap(selectedMap);
  buildGun();
  updateHud();
  showWaveBanner();
  requestAimLock();
}

function endGame(won) {
  started = false;
  document.exitPointerLock?.();

  // Update level based on kills
  if (totalKills > 0) {
    const newLevel = Math.min(50, Math.floor(totalKills / 3) + 1);
    if (newLevel > currentLevel) {
      currentLevel = newLevel;
      showMessage(`Level Up! Now Level ${currentLevel}`);
    }
  }

  resultTitle.textContent = won ? "VICTORY!" : "DEFEATED";
  resultText.textContent = won
    ? `Level ${currentLevel} completed! Kills: ${totalKills}, Coins earned: ${gameCoins}`
    : `Reached Level ${currentLevel}. Keep fighting!`;
  gameOver.classList.remove("hidden");
}

function buildMap(index) {
  const map = maps[index];
  worldGroup.clear();
  cover = [];
  enemies = [];
  pickups = [];
  bulletBeams = [];
  hitEffects = [];
  scene.background = new THREE.Color(map.sky);
  scene.fog = new THREE.Fog(map.fog, 60, 180);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshStandardMaterial({ color: map.floor, roughness: 0.8 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  worldGroup.add(floor);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  const sun = new THREE.DirectionalLight(map.light, 2.5);
  sun.position.set(-30, 50, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 200;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  worldGroup.add(hemi, sun);

  // Build walls
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7 });
  const wallShapes = [
    [0, -48, 100, 10, 2], [0, 48, 100, 10, 2], [-48, 0, 2, 10, 100], [48, 0, 2, 10, 100]
  ];
  wallShapes.forEach(shape => {
    const mesh = blockMesh(...shape, 0x2a2a2a);
    mesh.material = wallMat;
    worldGroup.add(mesh);
    cover.push(mesh);
  });

  // Build cover objects
  map.props.forEach((shape, i) => {
    const mesh = blockMesh(...shape, i % 2 ? 0x3a3a3a : 0x4a4a4a);
    worldGroup.add(mesh);
    cover.push(mesh);
  });

  // Spawn pickups
  spawnPickups();

  // Spawn enemies
  spawnEnemies();

  camera.position.copy(map.spawn);
  yaw = Math.PI;
  pitch = 0;
}

function blockMesh(x, z, w, h, d, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.radius = Math.max(w, d) * 0.5;
  mesh.userData.width = w;
  mesh.userData.depth = d;
  return mesh;
}

function spawnPickups() {
  const healthMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff0000, emissiveIntensity: 0.5 });
  const ammoMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.5 });

  for (let i = 0; i < 15; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 15 + Math.random() * 25;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const type = Math.random() > 0.3 ? "health" : "ammo";
    const mat = type === "health" ? healthMat.clone() : ammoMat.clone();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 0.7), mat);

    const group = new THREE.Group();
    group.add(mesh);
    const light = new THREE.PointLight(type === "health" ? 0xff0000 : 0xffaa00, 2, 5);
    group.add(light);
    group.position.set(x, 0.5, z);
    group.userData = { type, amount: type === "health" ? 30 : 40, bob: Math.random() * Math.PI * 2 };

    worldGroup.add(group);
    pickups.push(group);
  }
}

function spawnEnemies() {
  const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0x440000, roughness: 0.3 });
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0 });
 
  for (let i = 0; i < 5; i++) {
    const group = new THREE.Group();
 
    // Body (Taller and bigger)
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 2.0, 4, 8), enemyMat.clone());
    body.position.y = 1.3;
    body.castShadow = true;
 
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), enemyMat.clone());
    head.position.y = 2.8;
    head.castShadow = true;
 
    // Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), visorMat.clone());
    visor.position.set(0, 2.8, 0.4);
 
    // Arms
    const armMat = enemyMat.clone();
    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.9, 4, 6), armMat);
    leftArm.position.set(-0.8, 1.6, 0);
    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.9, 4, 6), armMat.clone());
    rightArm.position.set(0.8, 1.6, 0);
 
    group.add(body, head, visor, leftArm, rightArm);
 
    const spawnArea = maps[selectedMap].enemyArea;
    const x = spawnArea.minX + Math.random() * (spawnArea.maxX - spawnArea.minX);
    const z = spawnArea.minZ + Math.random() * (spawnArea.maxZ - spawnArea.minZ);
    group.position.set(x, 0, z);
 
    const diff = difficulties[selectedDifficulty];
    group.userData = {
      alive: true,
      health: 85 * diff.health,
      maxHealth: 85 * diff.health,
      speed: (2.5 + currentLevel * 0.08) * diff.speed,
      damage: (8 + currentLevel * 1.5) * diff.damage,
      attackCooldown: Math.max(400, (800 - currentLevel * 10) * diff.cooldown),
      attackRange: (25 + currentLevel * 0.5) * diff.range,
      lastAttack: 0,
      lastStrafe: 0,
      strafeDir: Math.random() > 0.5 ? 1 : -1,
      reward: (50 + currentLevel * 10) * diff.coins
    };
 
    worldGroup.add(group);
    enemies.push(group);
  }
}

function updateEnemies(dt) {
  const now = performance.now();
  const map = maps[selectedMap];
 
  enemies.forEach(enemy => {
    if (!enemy.userData.alive) return;
 
    const toPlayer = new THREE.Vector3().subVectors(camera.position, enemy.position);
    toPlayer.y = 0;
    const distToPlayer = toPlayer.length();
 
    // Look at player
    enemy.lookAt(camera.position.x, enemy.position.y, camera.position.z);
 
    // Line of Sight check
    let hasLoS = false;
    if (distToPlayer <= enemy.userData.attackRange) {
      const rayDir = toPlayer.clone().normalize();
      raycaster.set(enemy.position, rayDir);
      raycaster.far = enemy.userData.attackRange;
      const intersects = raycaster.intersectObjects(cover);
      if (intersects.length === 0 || intersects[0].distance > distToPlayer) {
        hasLoS = true;
      }
    }
 
    if (hasLoS && now - enemy.userData.lastAttack > enemy.userData.attackCooldown) {
      enemy.userData.lastAttack = now;
      const enemyEyePos = enemy.position.clone();
      enemyEyePos.y = 1.2;
      makeEnemyBeam(enemyEyePos, camera.position.clone());
      playGunshot("enemy");
      damagePlayer(enemy.userData.damage);
    }
 
    // Move towards player
    if (distToPlayer > 4) {
      const chaseDir = toPlayer.clone().normalize();
 
      // Strafe logic
      if (now - enemy.userData.lastStrafe > 2000) {
        enemy.userData.lastStrafe = now;
        enemy.userData.strafeDir *= -1;
      }
 
      const strafeDir = new THREE.Vector3(-chaseDir.z, 0, chaseDir.x);
      strafeDir.multiplyScalar(enemy.userData.strafeDir * 0.4);
 
      const moveDir = chaseDir.add(strafeDir).normalize();
      const speed = enemy.userData.speed * dt;
      const next = enemy.position.clone().add(moveDir.multiplyScalar(speed));
 
      // Clamp to map bounds
      next.x = Math.max(map.enemyArea.minX + 2, Math.min(map.enemyArea.maxX - 2, next.x));
      next.z = Math.max(map.enemyArea.minZ + 2, Math.min(map.enemyArea.maxZ - 2, next.z));
 
      // Check collision
      if (!collidesSimple(next, 0.8)) {
        enemy.position.copy(next);
      } else {
        // Try to slide along walls
        const slideNext = enemy.position.clone().add(strafeDir.normalize().multiplyScalar(speed * 1.5));
        if (!collidesSimple(slideNext, 0.8)) {
          enemy.position.copy(slideNext);
        }
      }
    }
 
    // Animation
    const bob = Math.sin(now * 0.005 + enemy.position.x) * 0.05;
    if (enemy.children[0]) enemy.children[0].position.y = 0.8 + bob;
    if (enemy.children[1]) enemy.children[1].position.y = 1.7 + bob;
  });
}

function collidesSimple(pos, radius) {
  for (const mesh of cover) {
    const w = mesh.userData.width / 2 + radius;
    const d = mesh.userData.depth / 2 + radius;
    if (Math.abs(pos.x - mesh.position.x) < w && Math.abs(pos.z - mesh.position.z) < d) {
      return true;
    }
  }
  return false;
}

function raycasterIntersectsCover(from, to) {
  const direction = to.clone().sub(from);
  const distance = direction.length();
  raycaster.set(from, direction.normalize());
  raycaster.far = distance;
  return raycaster.intersectObjects(cover, false).length > 0;
}

function shoot() {
  if (!started || reloading) return;
  const now = performance.now();
  const gun = allGuns.find(g => g.id === currentGunId) || allGuns[0];
  const ammoState = ammo[gun.id] || { clip: gun.mag, reserve: gun.mag * 3 };
  const shotDelay = 60000 / gun.rpm;

  if (now - lastShot < shotDelay) return;
  if (ammoState.clip <= 0) {
    playGunshot("empty");
    startReload();
    return;
  }

  lastShot = now;
  ammoState.clip -= 1;

  // Muzzle flash
  muzzleLight.intensity = 4;
  setTimeout(() => { muzzleLight.intensity = 0; }, 40);

  // Recoil
  recoilPitch = Math.min(0.08, recoilPitch + (aiming ? 0.01 : 0.025));
  pulseCrosshair();
  playGunshot(gun.id);

  // Spread
  const spread = aiming ? gun.spread * 0.3 : gun.spread;
  const direction = new THREE.Vector3(
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
    -1
  ).unproject(camera).sub(camera.position).normalize();

  raycaster.set(camera.position, direction);
  raycaster.far = gun.range;

  const targets = enemies.flatMap(enemy => enemy.children.filter(child => child.isMesh && enemy.userData.alive));
  const hits = raycaster.intersectObjects(targets, false);
  const end = camera.position.clone().add(direction.clone().multiplyScalar(gun.range));

  if (hits.length > 0) {
    const hit = hits[0];
    const enemy = enemies.find(e => e.children.includes(hit.object));
    if (enemy?.userData.alive) {
      const damage = gun.damage * (1 + currentLevel * 0.02);
      enemy.userData.health -= damage;
      end.copy(hit.point);
      flashEnemy(enemy);
      showHitMarker();
      playHit();
      if (enemy.userData.health <= 0) killEnemy(enemy);
    }
  }

  makeBeam(end, 0xffff00, camera.position.clone().add(direction.clone().multiplyScalar(1.5)));
  updateHud();

  if (ammoState.clip === 0) startReload();
}

function flashEnemy(enemy) {
  enemy.children.forEach(child => {
    if (child.material?.emissive) {
      child.material.emissive.set(0xff0000);
      child.material.emissiveIntensity = 2;
    }
  });
  setTimeout(() => {
    enemy.children.forEach(child => {
      if (child.material?.emissive) {
        child.material.emissive.set(0x000000);
        child.material.emissiveIntensity = 0;
      }
    });
  }, 100);
}

function killEnemy(enemy) {
  enemy.userData.alive = false;
  const reward = enemy.userData.reward;
  gameCoins += reward;
  totalKills += 1;
  streak += 1;

  // Check level up
  if (totalKills % 10 === 0 && currentLevel < 50) {
    currentLevel++;
    showMessage(`Level Up! Level ${currentLevel}`);
  }

  // Wave progression
  if (totalKills % difficulties[selectedDifficulty].waveKills === 0) {
    wave++;
    restockPickups();
    showMessage(`Wave ${wave} - Level ${currentLevel}`);
    showWaveBanner();
    respawnEnemies();
  }

  enemy.visible = false;
  playEnemyDeath();
  updateHud();

  // Respawn after delay
  setTimeout(() => {
    if (started) respawnEnemy(enemy);
  }, 3000);
}

function respawnEnemy(enemy) {
  const map = maps[selectedMap];
  const area = map.enemyArea;
  const x = area.minX + Math.random() * (area.maxX - area.minX);
  const z = area.minZ + Math.random() * (area.maxZ - area.minZ);

  enemy.position.set(x, 0, z);

  // Enemy health scales with level - dies in 10-12 shots at low levels
  const baseHealth = 200 + currentLevel * 30;
  const waveBonus = wave * 25;

  enemy.userData.alive = true;
  const diff = difficulties[selectedDifficulty];
  const scaledHealth = (85 + (totalKills * 5) + (wave * 10)) * diff.health;
  enemy.userData.health = scaledHealth;
  enemy.userData.maxHealth = scaledHealth;
 
  // Speed and damage increase with level and difficulty
  enemy.userData.speed = (2.5 + currentLevel * 0.08) * diff.speed;
  enemy.userData.damage = (8 + currentLevel * 1.5) * diff.damage;
  enemy.userData.attackCooldown = Math.max(400, (800 - currentLevel * 10) * diff.cooldown);

  enemy.visible = true;
}

function respawnEnemies() {
  enemies.forEach((enemy, i) => {
    respawnEnemy(enemy);
  });
}

function startReload() {
  const gun = allGuns.find(g => g.id === currentGunId) || allGuns[0];
  const ammoState = ammo[gun.id];
  if (reloading || !ammoState || ammoState.reserve <= 0 || ammoState.clip === gun.mag) return;

  reloading = true;
  reloadStart = performance.now();
  reloadDuration = gun.reload * 1000;
  reloadMeter.classList.add("active");
  playReload();
  showMessage("Reloading...");
}

function finishReload() {
  const gun = allGuns.find(g => g.id === currentGunId) || allGuns[0];
  const ammoState = ammo[gun.id];
  const needed = gun.mag - ammoState.clip;
  const loaded = Math.min(needed, ammoState.reserve);
  ammoState.clip += loaded;
  ammoState.reserve -= loaded;
  reloading = false;
  reloadMeter.classList.remove("active");
  updateHud();
}

function makeBeam(end, color, start = camera.position.clone()) {
  const tracer = makeTracer(start, end, color, 0.15, 0.05, 25);
  worldGroup.add(tracer);
  bulletBeams.push(tracer);
  trimTracers();
}

function makeTracer(start, end, color, life, radius, maxLength = 20) {
  const fullDirection = end.clone().sub(start);
  const fullLength = fullDirection.length();
  const direction = fullDirection.normalize();
  const length = Math.min(fullLength, maxLength);
  const tracerEnd = start.clone().add(direction.clone().multiplyScalar(length));
  const midpoint = start.clone().add(tracerEnd).multiplyScalar(0.5);
  const geometry = new THREE.CylinderGeometry(radius, radius * 0.3, length, 6, 1, true);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  mesh.userData.life = life;
  mesh.userData.maxLife = life;
  return mesh;
}

function trimTracers() {
  while (bulletBeams.length > maxActiveTracers) {
    const tracer = bulletBeams.shift();
    worldGroup.remove(tracer);
    tracer.geometry.dispose();
    tracer.material.dispose();
  }
}

function makeEnemyBeam(start, end) {
  const tracer = makeTracer(start, end, 0xff0000, 0.2, 0.1, 25);
  worldGroup.add(tracer);
  bulletBeams.push(tracer);
  trimTracers();
}

function damagePlayer(amount) {
  const now = performance.now();
  if (now - lastEnemyDamage < 300) return;
  lastEnemyDamage = now;

  const actualDamage = Math.min(20, amount);
  health -= actualDamage;
  streak = 0;
  lastDamageTaken = now;
  passiveHealTimer = now + 5000; // Delay healing for 5s after taking damage

  damageFlash.classList.add("hit");
  if (health < 40) damageFlash.classList.add("critical");
  setTimeout(() => damageFlash.classList.remove("hit"), 100);
  setTimeout(() => damageFlash.classList.remove("critical"), 200);

  updateHud();
  if (health <= 0) endGame(false);
}

function collectPickups() {
  pickups.forEach(pickup => {
    if (!pickup.visible) return;
    if (pickup.position.distanceTo(camera.position) < 1.5) {
      pickup.visible = false;
      if (pickup.userData.type === "health") {
        health = Math.min(100, health + pickup.userData.amount);
        showMessage("+ Health");
      } else {
        Object.values(ammo).forEach(a => { a.reserve += 20; });
        showMessage("+ Ammo");
      }
      playPickup();
      updateHud();
    }
  });
}

function restockPickups() {
  pickups.forEach(pickup => {
    pickup.visible = true;
    pickup.userData.bob = Math.random() * Math.PI * 2;
  });
}

function updatePickups(dt) {
  pickups.forEach(pickup => {
    if (!pickup.visible) return;
    pickup.userData.bob += dt * 2;
    pickup.position.y = 0.5 + Math.sin(pickup.userData.bob) * 0.1;
    pickup.rotation.y += dt * 0.5;
  });
}

function updatePlayer(dt) {
  const speed = aiming ? 6 : 15;
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const move = new THREE.Vector3();

  if (keys.has("KeyW")) move.add(forward);
  if (keys.has("KeyS")) move.sub(forward);
  if (keys.has("KeyD")) move.add(right);
  if (keys.has("KeyA")) move.sub(right);

  if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed);
  velocity.lerp(move, 1 - Math.pow(0.001, dt));

  const next = camera.position.clone().addScaledVector(velocity, dt);
  next.y = 1.7;

  if (!collidesSimple(next, 0.6)) {
    camera.position.copy(next);
  } else {
    // Try sliding
    const slideX = camera.position.clone();
    slideX.x = next.x;
    if (!collidesSimple(slideX, 0.6)) {
      camera.position.x = slideX.x;
    }
    const slideZ = camera.position.clone();
    slideZ.z = next.z;
    if (!collidesSimple(slideZ, 0.6)) {
      camera.position.z = slideZ.z;
    }
  }

  collectPickups();
  camera.position.y = 1.7;

  if (move.lengthSq() > 0 && performance.now() - lastStep > (aiming ? 500 : 350)) {
    lastStep = performance.now();
    playFootstep();
  }

  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  recoilPitch = THREE.MathUtils.lerp(recoilPitch, 0, 1 - Math.pow(0.00001, dt));
  camera.rotation.x = pitch - recoilPitch;
  camera.fov = THREE.MathUtils.lerp(camera.fov, aiming ? 50 : sprinting ? 80 : 72, 1 - Math.pow(0.001, dt));
  camera.updateProjectionMatrix();
  gunGroup.position.lerp(new THREE.Vector3(aiming ? 0.05 : 0.4, aiming ? -0.22 : -0.3, -0.4), 1 - Math.pow(0.001, dt));
  // Passive healing
  const now = performance.now();
  if (health < 100 && now > passiveHealTimer) {
    health = Math.min(100, health + dt * 5); // Heal 5 HP per second
    updateHud();
  }
}

function buildGun() {
  gunGroup.clear();
  const gun = allGuns.find(g => g.id === currentGunId) || allGuns[0];
  const color = gun.type === "Sniper" ? 0x444466 : gun.type === "LMG" ? 0x444444 : 0x555555;

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.08, 0.5),
    new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.2 })
  );
  body.position.set(0, 0, -0.3);

  // Barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.02, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.95 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, -0.6);

  // Grip
  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.12, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  grip.position.set(0, -0.08, -0.2);

  // Magazine
  const mag = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.1, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  mag.position.set(0, -0.1, -0.15);

  // Stock
  const stock = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.05, 0.2),
    new THREE.MeshStandardMaterial({ color, metalness: 0.8 })
  );
  stock.position.set(0, 0, 0.05);

  gunGroup.add(body, barrel, grip, mag, stock);
  gunGroup.position.set(aiming ? 0.05 : 0.35, aiming ? -0.22 : -0.28, -0.4);
  gunGroup.add(muzzleLight);
}

function drawMiniMap() {
  const ctx = miniMap.getContext("2d");
  const width = miniMap.width;
  const height = miniMap.height;
  const scale = width / 100;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(20, 20, 30, 0.9)";
  ctx.fillRect(0, 0, width, height);

  // Draw cover
  ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
  cover.forEach(mesh => {
    const w = (mesh.userData.width || 10) * scale;
    const d = (mesh.userData.depth || 10) * scale;
    ctx.fillRect((mesh.position.x + 50) * scale - w/2, (mesh.position.z + 50) * scale - d/2, w, d);
  });

  // Draw pickups
  pickups.forEach(pickup => {
    if (!pickup.visible) return;
    ctx.fillStyle = pickup.userData.type === "health" ? "#ff4444" : "#ffaa00";
    ctx.beginPath();
    ctx.arc((pickup.position.x + 50) * scale, (pickup.position.z + 50) * scale, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw enemies
  enemies.forEach(enemy => {
    if (!enemy.userData.alive) return;
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc((enemy.position.x + 50) * scale, (enemy.position.z + 50) * scale, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw player
  const px = (camera.position.x + 50) * scale;
  const pz = (camera.position.z + 50) * scale;
  ctx.save();
  ctx.translate(px, pz);
  ctx.rotate(-yaw + Math.PI);
  ctx.fillStyle = "#00ff00";
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(4, 5);
  ctx.lineTo(-4, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function showHitMarker() {
  hitMarker.classList.remove("show");
  void hitMarker.offsetWidth;
  hitMarker.classList.add("show");
}

function pulseCrosshair() {
  crosshair.classList.add("fire");
  window.clearTimeout(pulseCrosshair.timer);
  pulseCrosshair.timer = window.setTimeout(() => crosshair.classList.remove("fire"), 80);
}

function showWaveBanner() {
  waveBanner.textContent = `Level ${currentLevel}`;
  waveBanner.classList.remove("show");
  void waveBanner.offsetWidth;
  waveBanner.classList.add("show");
}

function showStreak() {
  if (streak < 2) return;
  streakText.textContent = `${streak} Kill Streak!`;
  streakText.classList.remove("show");
  void streakText.offsetWidth;
  streakText.classList.add("show");
}

function updateBeams(dt) {
  bulletBeams = bulletBeams.filter(line => {
    line.userData.life -= dt;
    line.material.opacity = Math.max(0, line.userData.life / line.userData.maxLife);
    if (line.userData.life <= 0) {
      worldGroup.remove(line);
      line.geometry.dispose();
      line.material.dispose();
      return false;
    }
    return true;
  });
}

function returnToMenu() {
  if (!started) return;
  started = false;
  firing = false;
  reloading = false;
  keys.clear();
  document.exitPointerLock?.();
  hud.classList.add("hidden");
  gameOver.classList.add("hidden");

  // Show home screen
  document.getElementById('homeScreen')?.remove();
  createHomeScreen();
  updateHomeScreen();
}

function requestAimLock() {
  if (document.pointerLockElement === canvas) return;
  try {
    canvas.requestPointerLock?.();
  } catch (e) {
    console.log("Pointer lock not available");
  }
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (started) {
    if (firing) shoot();
    if (reloading) {
      const progress = Math.min(1, (performance.now() - reloadStart) / reloadDuration);
      reloadMeter.firstElementChild.style.width = `${progress * 100}%`;
      if (progress >= 1) finishReload();
    }
    updatePlayer(dt);
    updateEnemies(dt);
    updatePickups(dt);
    updateBeams(dt);
    drawMiniMap();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// Event Listeners
document.querySelectorAll(".mapButton").forEach((button) => {
  button.addEventListener("click", () => {
    selectedMap = Number(button.dataset.map);
    document.querySelectorAll(".mapButton").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".modeButton").forEach((button) => {
  button.addEventListener("click", () => {
    selectedDifficulty = button.dataset.difficulty;
    document.querySelectorAll(".modeButton").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
  });
});

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
menuButton.addEventListener("click", returnToMenu);

canvas.addEventListener("click", () => {
  if (started && document.pointerLockElement !== canvas) requestAimLock();
});

document.addEventListener("pointerlockchange", () => {
  showMessage(document.pointerLockElement === canvas ? "WASD move | Mouse aim | LMB shoot | RMB aim | R reload" : "Click to lock aim");
});

document.addEventListener("mousemove", (event) => {
  if (!started || document.pointerLockElement !== canvas) return;
  yaw -= event.movementX * 0.002;
  pitch -= event.movementY * 0.002;
  pitch = THREE.MathUtils.clamp(pitch, -1.2, 1.2);
});

document.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    firing = true;
    shoot();
  }
  if (event.button === 2) aiming = true;
});

document.addEventListener("mouseup", (event) => {
  if (event.button === 0) firing = false;
  if (event.button === 2) aiming = false;
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    returnToMenu();
    return;
  }
  keys.add(event.code);
  if (event.code === "KeyR") startReload();
  if (event.code === "Tab") {
    event.preventDefault();
    showShop();
  }
});

document.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("resize", resize);

// Audio System
function ensureAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") audioContext.resume();
}

function createNoiseBuffer(duration) {
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playGunshot(gunId) {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  // Different sounds for different guns
  const isSniper = gunId === "m24" || gunId === "awp" || gunId === "kar98";
  const isShotgun = gunId === "s1897" || gunId === "s12k" || gunId === "dbs";

  // Bass thump
  const osc = audioContext.createOscillator();
  const oscGain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(isSniper ? 80 : isShotgun ? 100 : 150, now);
  osc.frequency.exponentialRampToValueAtTime(isSniper ? 30 : 60, now + (isSniper ? 0.3 : 0.15));
  oscGain.gain.setValueAtTime(0.6, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isSniper ? 0.4 : 0.2));
  osc.connect(oscGain).connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + (isSniper ? 0.4 : 0.2));

  // Noise crack
  const noise = audioContext.createBufferSource();
  noise.buffer = createNoiseBuffer(isSniper ? 0.4 : 0.15);
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = isShotgun ? 800 : isSniper ? 2000 : 3000;
  noiseFilter.Q.value = 0.5;
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(isShotgun ? 0.8 : 0.5, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isSniper ? 0.3 : 0.1));
  noise.connect(noiseFilter).connect(noiseGain).connect(audioContext.destination);
  noise.start(now);
  noise.stop(now + 0.15);

  // Echo
  if (isSniper) {
    const echo1 = audioContext.createOscillator();
    const echo1Gain = audioContext.createGain();
    echo1.type = "sine";
    echo1.frequency.setValueAtTime(40, now + 0.1);
    echo1Gain.gain.setValueAtTime(0.2, now + 0.1);
    echo1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    echo1.connect(echo1Gain).connect(audioContext.destination);
    echo1.start(now + 0.1);
    echo1.stop(now + 0.5);
  }
}

function playEnemyDeath() {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  // Body fall sound
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.5);

  // Impact thud
  const thud = audioContext.createOscillator();
  const thudGain = audioContext.createGain();
  thud.type = "sine";
  thud.frequency.setValueAtTime(60, now + 0.05);
  thud.frequency.exponentialRampToValueAtTime(20, now + 0.2);
  thudGain.gain.setValueAtTime(0.5, now + 0.05);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  thud.connect(thudGain).connect(audioContext.destination);
  thud.start(now + 0.05);
  thud.stop(now + 0.25);
}

function playHit() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

function playReload() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  [0, 0.15, 0.35].forEach((delay, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "square";
    osc.frequency.value = 200 + i * 100;
    gain.gain.setValueAtTime(0.1, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.05);
  });
}

function playFootstep() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "triangle";
  osc.frequency.value = 60 + Math.random() * 30;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

function playPickup() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.setValueAtTime(800, now + 0.1);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Initialize
resize();

// Show loading then home screen
function initGame() {
  createHomeScreen();
  updateHomeScreen();
  loop();
}

initGame();