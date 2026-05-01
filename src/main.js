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

const maps = [
  {
    name: "Foundry",
    sky: 0x56625d,
    fog: 0x68726c,
    floor: 0x4b514b,
    accent: 0xc85c34,
    light: 0xffd39b,
    props: [
      [-14, -14, 4, 2, 8], [8, -18, 11, 2, 3], [16, -2, 2, 2, 14],
      [-6, 8, 14, 2, 2], [-18, 14, 2, 2, 10], [5, 16, 8, 2, 3],
      [0, -3, 4, 3, 4], [14, 13, 5, 2, 5]
    ],
    spawn: new THREE.Vector3(0, 1.75, 22)
  },
  {
    name: "Dust Yard",
    sky: 0xa7afa6,
    fog: 0xbfb59a,
    floor: 0x837760,
    accent: 0x264f5c,
    light: 0xffdfab,
    props: [
      [-16, -7, 3, 2, 18], [16, 7, 3, 2, 18], [0, -18, 10, 2, 3],
      [-4, 6, 7, 2, 7], [8, -7, 8, 2, 3], [-12, 17, 10, 2, 3],
      [18, -18, 5, 3, 5], [-20, -20, 5, 3, 5]
    ],
    spawn: new THREE.Vector3(0, 1.75, 24)
  },
  {
    name: "Neon Deck",
    sky: 0x1c2430,
    fog: 0x222b35,
    floor: 0x242b32,
    accent: 0x2aa7c7,
    light: 0x7fbacc,
    props: [
      [-15, -16, 2, 2, 13], [15, 16, 2, 2, 13], [0, 0, 7, 2, 7],
      [-10, 10, 9, 2, 2], [10, -10, 9, 2, 2], [-19, 4, 4, 2, 10],
      [19, -4, 4, 2, 10], [0, 19, 14, 2, 2]
    ],
    spawn: new THREE.Vector3(0, 1.75, 24)
  }
];

const weapons = [
  { name: "Vector-9", level: 1, cost: 0, damage: 16, rpm: 520, range: 55, spread: 0.018, color: 0xffd166, mag: 30, reserve: 120, reload: 1.25, bass: 105 },
  { name: "Raptor AR", level: 2, cost: 120, damage: 23, rpm: 430, range: 70, spread: 0.012, color: 0xfff0a8, mag: 28, reserve: 112, reload: 1.55, bass: 86 },
  { name: "Vulcan LMG", level: 3, cost: 280, damage: 17, rpm: 780, range: 62, spread: 0.024, color: 0xffb04a, mag: 75, reserve: 225, reload: 2.6, bass: 72 },
  { name: "Phantom DMR", level: 4, cost: 520, damage: 42, rpm: 185, range: 96, spread: 0.006, color: 0x8ec8ff, mag: 12, reserve: 60, reload: 1.9, bass: 62 },
  { name: "Mamba SMG", level: 5, cost: 760, damage: 14, rpm: 920, range: 50, spread: 0.026, color: 0x80ffdb, mag: 42, reserve: 168, reload: 1.4, bass: 118 },
  { name: "Kodiak-12", level: 6, cost: 1040, damage: 68, rpm: 95, range: 42, spread: 0.038, color: 0xff8a5b, mag: 8, reserve: 48, reload: 2.2, bass: 48 },
  { name: "Aegis Burst", level: 7, cost: 1380, damage: 32, rpm: 560, range: 82, spread: 0.01, color: 0xb8f7ff, mag: 30, reserve: 150, reload: 1.7, bass: 78 },
  { name: "Titan Rail", level: 8, cost: 1900, damage: 92, rpm: 72, range: 120, spread: 0.002, color: 0xc8b6ff, mag: 5, reserve: 35, reload: 2.45, bass: 38 },
  { name: "Inferno MK2", level: 9, cost: 2600, damage: 26, rpm: 680, range: 74, spread: 0.015, color: 0xff6b35, mag: 48, reserve: 192, reload: 1.9, bass: 68 }
];

const difficulties = {
  easy: { label: "Easy", enemySlots: 4, damage: 0.7, health: 0.75, speed: 0.78, spawn: 1.35, waveKills: 10, waveGrowth: 0.65, ammo: 1.35, coins: 0.9, cooldown: 1.35, range: 0.82, damageGate: 1150 },
  normal: { label: "Normal", enemySlots: 6, damage: 1, health: 1, speed: 1, spawn: 1, waveKills: 8, waveGrowth: 1, ammo: 1.1, coins: 1, cooldown: 1, range: 1, damageGate: 850 },
  hard: { label: "Hard", enemySlots: 8, damage: 1.65, health: 1.32, speed: 1.28, spawn: 0.72, waveKills: 7, waveGrowth: 1.35, ammo: 0.95, coins: 1.2, cooldown: 0.66, range: 1.25, damageGate: 520 },
  extreme: { label: "Extreme", enemySlots: 10, damage: 3.4, health: 1.85, speed: 1.85, spawn: 0.36, waveKills: 5, waveGrowth: 1.95, ammo: 0.78, coins: 1.65, cooldown: 0.34, range: 1.7, damageGate: 220 }
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 180);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const tmpVec = new THREE.Vector3();

let selectedMap = 0;
let selectedDifficulty = "normal";
let currentWeapon = 0;
let gameHistoryActive = false;
let coins = 0;
let playerLevel = 1;
let health = 100;
let ammo = [];
let wave = 1;
let totalKills = 0;
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
let aimLockBlocked = false;
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

const keys = new Set();
const enemyStarts = [
  [-18, 1.1, -18], [-6, 1.1, -21], [9, 1.1, -18],
  [20, 1.1, -5], [-20, 1.1, 3], [5, 1.1, 10],
  [-26, 1.1, -2], [26, 1.1, 6], [-10, 1.1, 24], [18, 1.1, 22]
];
const enemyRespawnDelay = 2300;
const maxActiveTracers = 28;

scene.add(worldGroup);
camera.add(gunGroup);
camera.add(muzzleLight);
scene.add(camera);

function buildGun() {
  gunGroup.clear();
  gunGroup.add(muzzleLight);
  const weapon = weapons[currentWeapon];
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.18, 0.85),
    new THREE.MeshStandardMaterial({ color: weapon.color, metalness: 0.86, roughness: 0.18 })
  );
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.55, 18),
    new THREE.MeshStandardMaterial({ color: 0x14181c, metalness: 0.85, roughness: 0.22 })
  );
  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.34, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x0c0f12, roughness: 0.5 })
  );
  const sight = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.06, 0.26),
    new THREE.MeshStandardMaterial({ color: 0x050607, metalness: 0.7, roughness: 0.2 })
  );
  const magazine = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.36, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x0a0b0c, metalness: 0.6, roughness: 0.28 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.02, -0.01, -0.56);
  body.position.set(0.28, -0.22, -0.55);
  grip.position.set(0.23, -0.43, -0.25);
  sight.position.set(0.28, -0.1, -0.65);
  magazine.position.set(0.28, -0.45, -0.52);
  gunGroup.add(body, barrel, grip, sight, magazine);
  gunGroup.position.set(aiming ? 0.04 : 0.38, aiming ? -0.23 : -0.33, -0.45);
}

function blockMesh(x, z, w, h, d, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.74, metalness: 0.08 })
  );
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.radius = Math.max(w, d) * 0.55;
  return mesh;
}

function makeFloorTexture(base, accent) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 512;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");
  ctx.fillStyle = `#${base.toString(16).padStart(6, "0")}`;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  ctx.fillStyle = `#${accent.toString(16).padStart(6, "0")}`;
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 180; i += 1) {
    ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 18 + 4, 1);
  }
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = 8;
  return texture;
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
  scene.fog = new THREE.Fog(map.fog, index === 0 ? 72 : 52, index === 0 ? 150 : 128);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64, 40, 40),
    new THREE.MeshStandardMaterial({
      color: map.floor,
      map: makeFloorTexture(map.floor, map.accent),
      roughness: 0.72,
      metalness: index === 2 ? 0.18 : 0.05
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  worldGroup.add(floor);

  const grid = new THREE.GridHelper(64, 32, map.accent, 0x444c4d);
  grid.material.opacity = index === 0 ? 0.4 : 0.28;
  grid.material.transparent = true;
  worldGroup.add(grid);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x45413a, index === 0 ? 1.65 : 1.25);
  const sun = new THREE.DirectionalLight(map.light, index === 0 ? 4.8 : 3.4);
  sun.position.set(-12, 24, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 70;
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  worldGroup.add(hemi, sun);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2528, roughness: 0.62, metalness: 0.18 });
  const wallShapes = [
    [0, -32, 64, 5, 1], [0, 32, 64, 5, 1], [-32, 0, 1, 5, 64], [32, 0, 1, 5, 64]
  ];
  for (const shape of wallShapes) {
    const mesh = blockMesh(...shape, 0x202832);
    mesh.material = wallMaterial;
    worldGroup.add(mesh);
    cover.push(mesh);
  }

  const fillLight = new THREE.DirectionalLight(0xb8d8ff, index === 0 ? 1.35 : 0.72);
  fillLight.position.set(18, 12, -22);
  worldGroup.add(fillLight);

  map.props.forEach((shape, i) => {
    const mesh = blockMesh(...shape, i % 2 ? 0x3b454b : 0x29323a);
    worldGroup.add(mesh);
    cover.push(mesh);
    if (index === 2) addNeonStrip(mesh, map.accent);
  });

  addCombatSetDressing(index, map);
  spawnPickups(index);

  for (let i = 0; i < 18; i += 1) {
    const tower = blockMesh(-27 + (i % 6) * 10.5, -27 + Math.floor(i / 6) * 26, 0.22, 3.5, 0.22, map.accent);
    tower.material.emissive = new THREE.Color(map.accent);
    tower.material.emissiveIntensity = index === 2 ? 1.4 : 0.25;
    worldGroup.add(tower);
  }

  camera.position.copy(map.spawn);
  yaw = Math.PI;
  pitch = 0;
  spawnEnemies();
  mapText.textContent = map.name;
}

function addCombatSetDressing(index, map) {
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111416, metalness: 0.72, roughness: 0.34 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 0.78 });
  for (let i = 0; i < 10; i += 1) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.15, 18), darkMetal);
    barrel.position.set(-24 + (i % 5) * 12, 0.58, -24 + Math.floor(i / 5) * 48);
    barrel.castShadow = true;
    barrel.receiveShadow = true;
    worldGroup.add(barrel);
  }
  for (let i = 0; i < 8; i += 1) {
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.16, 10, 20), rubber);
    tire.rotation.x = Math.PI / 2;
    tire.position.set(-23 + (i % 4) * 15, 0.2, -8 + Math.floor(i / 4) * 16);
    tire.castShadow = true;
    worldGroup.add(tire);
  }
  const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x6a5e4e, roughness: 0.64, metalness: 0.08 });
  const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0x686f6b, roughness: 0.86, metalness: 0.02 });
  const containerMaterial = new THREE.MeshStandardMaterial({ color: index === 1 ? 0x9a6842 : 0x315c6b, roughness: 0.5, metalness: 0.22 });
  const realisticCover = [
    [-23, -13, 3.2, 1.5, 1.2, "crate"], [-22, -10.8, 2.3, 1.2, 1.2, "crate"],
    [22, 10, 4.8, 1.35, 1.2, "barrier"], [19, 10, 3.4, 1.1, 1.1, "barrier"],
    [-2, -22, 8.2, 2.6, 2.4, "container"], [22, -22, 5.8, 2.6, 2.4, "container"],
    [-23, 22, 5.8, 2.1, 2.0, "container"], [7, 22, 6.4, 1.5, 1.25, "crate"]
  ];
  realisticCover.forEach(([x, z, w, h, d, kind]) => {
    const mesh = blockMesh(x, z, w, h, d, 0xffffff);
    mesh.material = kind === "crate" ? crateMaterial : kind === "barrier" ? concreteMaterial : containerMaterial;
    mesh.userData.kind = kind;
    worldGroup.add(mesh);
    cover.push(mesh);
    addCoverDetails(mesh, kind, map.accent);
  });
  if (index !== 1) {
    const spot = new THREE.SpotLight(map.accent, index === 0 ? 12 : 8, 42, Math.PI / 5, 0.45, 1.2);
    spot.position.set(0, 8, -24);
    spot.target.position.set(0, 0, 0);
    worldGroup.add(spot, spot.target);
  }
}

function addCoverDetails(mesh, kind, accent) {
  if (kind === "container") {
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x0e1112, roughness: 0.42, metalness: 0.5 });
    for (let i = -2; i <= 2; i += 1) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.045, mesh.geometry.parameters.height + 0.04, mesh.geometry.parameters.depth + 0.05), lineMaterial);
      rib.position.set(mesh.position.x + i * mesh.geometry.parameters.width / 5, mesh.position.y, mesh.position.z);
      worldGroup.add(rib);
    }
  }
  if (kind === "barrier") {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(mesh.geometry.parameters.width + 0.04, 0.08, mesh.geometry.parameters.depth + 0.05),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.16 })
    );
    stripe.position.set(mesh.position.x, mesh.position.y + mesh.geometry.parameters.height / 2 + 0.03, mesh.position.z);
    worldGroup.add(stripe);
  }
}

function spawnPickups(index) {
  const healthMaterial = new THREE.MeshStandardMaterial({ color: 0xf3f6f2, emissive: 0x9fffae, emissiveIntensity: 0.34, roughness: 0.32 });
  const ammoMaterial = new THREE.MeshStandardMaterial({ color: 0x2e3434, emissive: 0xffc857, emissiveIntensity: 0.22, metalness: 0.5, roughness: 0.28 });
  const positions = [
    [-12, 0, "health"], [12, 0, "ammo"], [-24, 9, "ammo"], [24, -9, "health"], [0, -12, "ammo"], [0, 14, "health"]
  ];
  positions.forEach(([x, z, type], i) => {
    const group = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(type === "health" ? 1.0 : 1.2, 0.45, 0.72),
      type === "health" ? healthMaterial.clone() : ammoMaterial.clone()
    );
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);
    if (type === "health") {
      const red = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.05, 0.12), new THREE.MeshBasicMaterial({ color: 0xe31b35 }));
      const red2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.42), new THREE.MeshBasicMaterial({ color: 0xe31b35 }));
      red.position.y = 0.24;
      red2.position.y = 0.245;
      group.add(red, red2);
    } else {
      const rounds = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.52, 12), new THREE.MeshStandardMaterial({ color: 0xd3a13a, metalness: 0.62, roughness: 0.2 }));
      rounds.rotation.z = Math.PI / 2;
      rounds.position.y = 0.34;
      group.add(rounds);
    }
    group.position.set(x + (index - 1) * (i % 2 ? 1.5 : -1.5), 0.36, z);
    group.userData = { type, amount: type === "health" ? 35 : 45, bob: Math.random() * Math.PI * 2 };
    const glow = new THREE.PointLight(type === "health" ? 0x9fffae : 0xffcf5f, 1.6, 5);
    glow.position.y = 0.6;
    group.add(glow);
    worldGroup.add(group);
    pickups.push(group);
  });
}

function addNeonStrip(mesh, color) {
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(mesh.geometry.parameters.width + 0.05, 0.04, 0.06),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.6 })
  );
  strip.position.set(mesh.position.x, mesh.position.y + mesh.geometry.parameters.height / 2 + 0.05, mesh.position.z);
  worldGroup.add(strip);
}

function spawnEnemies() {
  const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3335, roughness: 0.46, metalness: 0.32 });
  const armorMaterial = new THREE.MeshStandardMaterial({ color: 0x0d1011, roughness: 0.34, metalness: 0.5 });
  const visorMaterial = new THREE.MeshStandardMaterial({ color: 0xff3864, emissive: 0xff1642, emissiveIntensity: 1.8 });
  enemyStarts.slice(0, difficulty().enemySlots).forEach((point, index) => {
    const group = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 5, 12), enemyMaterial.clone());
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 12), enemyMaterial.clone());
    const armor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.18), armorMaterial.clone());
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.08, 0.06), visorMaterial.clone());
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.72), armorMaterial.clone());
    const marker = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff315f, sizeAttenuation: false }));
    torso.castShadow = true;
    head.castShadow = true;
    torso.position.y = 0.6;
    head.position.y = 1.42;
    armor.position.set(0, 0.82, 0.25);
    visor.position.set(0, 1.45, 0.28);
    rifle.position.set(0.52, 0.86, 0.35);
    marker.position.y = 2.25;
    marker.scale.set(0.02, 0.02, 1);
    group.add(torso, head, armor, visor, rifle, marker);
    group.userData = { slot: index, alive: true };
    resetEnemy(group, point, index, true);
    worldGroup.add(group);
    enemies.push(group);
  });
}

function resetEnemy(enemy, point, index, instant = false) {
  const mode = difficulty();
  const waveScale = wave - 1;
  const healthScale = (1 + waveScale * 0.18 * mode.waveGrowth) * mode.health;
  const speedScale = (1 + waveScale * 0.065 * mode.waveGrowth) * mode.speed;
  const powerScale = (1 + waveScale * 0.075 * mode.waveGrowth) * mode.damage;
  enemy.position.set(...point);
  enemy.visible = true;
  enemy.scale.setScalar(1 + Math.min(waveScale, 10) * 0.018);
  enemy.userData.health = Math.round((185 + index * 28) * healthScale);
  enemy.userData.maxHealth = enemy.userData.health;
  enemy.userData.speed = (2.8 + index * 0.18) * speedScale;
  enemy.userData.attackDamage = (2.6 + index * 0.28) * powerScale;
  enemy.userData.attackCooldown = Math.max(170, (1450 - waveScale * 28 * mode.waveGrowth) * mode.cooldown);
  enemy.userData.attackRange = Math.min(30, (8.5 + waveScale * 0.38) * mode.range);
  enemy.userData.meleeRange = Math.min(2.7, 1.65 + waveScale * 0.05);
  enemy.userData.lastAttack = performance.now() + (instant ? 600 + index * 110 : 0);
  enemy.userData.lastStrafeChange = 0;
  enemy.userData.strafe = index % 2 ? 1 : -1;
  enemy.userData.reward = Math.round((35 + index * 12) * (1 + waveScale * 0.1) * mode.coins);
  enemy.userData.alive = true;
  enemy.userData.respawning = false;
}

function respawnEnemy(enemy) {
  if (!started) return;
  const index = enemy.userData.slot ?? 0;
  const spawn = pickEnemySpawn(index);
  resetEnemy(enemy, spawn, index);
  makeHitEffect(enemy.position.clone().add(new THREE.Vector3(0, 1, 0)), 0);
  showMessage(`Wave ${wave} reinforcement inbound`);
  updateHud();
}

function pickEnemySpawn(index) {
  const ordered = [...enemyStarts].sort((a, b) => {
    const da = new THREE.Vector3(...a).distanceTo(camera.position);
    const db = new THREE.Vector3(...b).distanceTo(camera.position);
    return db - da;
  });
  return ordered[index % Math.min(ordered.length, 3)];
}

function difficulty() {
  return difficulties[selectedDifficulty] || difficulties.normal;
}

function updateWeaponStrip() {
  weaponStrip.innerHTML = "";
  weapons.forEach((weapon, index) => {
    const owned = weapon.cost === 0 || weapon.unlocked;
    const available = playerLevel >= weapon.level;
    const element = document.createElement("div");
    element.className = `weapon ${index === currentWeapon ? "active" : ""}`;
    const status = weapon.unlocked || weapon.cost === 0
      ? `${index + 1} - owned`
      : available
        ? `${weapon.cost} coins`
        : `level ${weapon.level}`;
    const ammoState = ammo[index] || { clip: weapon.mag, reserve: weapon.reserve };
    element.innerHTML = `<span><b>${weapon.name}</b><small>${status}</small></span><small>${ammoState.clip}/${ammoState.reserve}</small>`;
    if ((owned || coins >= weapon.cost) && available) {
      element.style.cursor = "pointer";
      element.addEventListener("click", () => buyOrEquip(index));
    }
    weaponStrip.appendChild(element);
  });
}

function buyOrEquip(index) {
  const weapon = weapons[index];
  if (!weapon) return;
  if (playerLevel < weapon.level) {
    showMessage(`Level ${weapon.level} needed`);
    return;
  }
  if (!weapon.unlocked && weapon.cost > 0) {
    if (coins < weapon.cost) {
      showMessage(`${weapon.cost - coins} more coins needed`);
      return;
    }
    coins -= weapon.cost;
    weapon.unlocked = true;
  }
  currentWeapon = index;
  reloading = false;
  buildGun();
  updateHud();
  showMessage(`${weapon.name} ready`);
}

function updateHud() {
  const weapon = weapons[currentWeapon];
  const ammoState = ammo[currentWeapon] || { clip: weapon.mag, reserve: weapon.reserve };
  healthText.textContent = Math.max(0, Math.round(health));
  coinsText.textContent = coins;
  ammoText.textContent = `${ammoState.clip} / ${ammoState.reserve}`;
  opponentsText.textContent = `${enemies.filter((enemy) => enemy.userData.alive).length} / ${enemies.length || 6}`;
  waveText.textContent = wave;
  killText.textContent = totalKills;
  modeText.textContent = difficulty().label;
  updateWeaponStrip();
}

function showMessage(text) {
  message.textContent = text;
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    if (aimLockBlocked) {
      message.textContent = "Mouse lock blocked here | click shoots | WASD moves | Esc menu";
      return;
    }
    message.textContent = document.pointerLockElement === canvas ? "Left shoot | Right focus | Shift sprint | R reload | 1-9 guns | Esc menu" : "Click to lock aim";
  }, 1800);
}

function startGame() {
  const mode = difficulty();
  ensureAudio();
  started = true;
  health = 100;
  wave = 1;
  totalKills = 0;
  streak = 0;
  recoilPitch = 0;
  lastDamageTaken = 0;
  lastEnemyDamage = 0;
  passiveHealTimer = 0;
  ammo = weapons.map((weapon) => ({ clip: weapon.mag, reserve: Math.round(weapon.reserve * mode.ammo) }));
  reloading = false;
  firing = false;
  reloadMeter.classList.remove("active");
  velocity.set(0, 0, 0);
  startPanel.classList.add("hidden");
  gameOver.classList.add("hidden");
  hud.classList.remove("hidden");
  pushGameHistoryState();
  buildMap(selectedMap);
  buildGun();
  updateHud();
  showWaveBanner();
  requestAimLock();
}

function endGame(won) {
  started = false;
  document.exitPointerLock?.();
  resultTitle.textContent = won ? "Mission Cleared" : "Mission Failed";
  resultText.textContent = won
    ? `You survived ${wave} waves. Coins saved, stronger guns unlocked for the next arena.`
    : `You were eliminated on wave ${wave}. Spend coins on better guns and retry the arena.`;
  gameOver.classList.remove("hidden");
}

function shoot() {
  if (!started || reloading) return;
  const now = performance.now();
  const weapon = weapons[currentWeapon];
  const ammoState = ammo[currentWeapon];
  const shotDelay = 60000 / weapon.rpm;
  if (now - lastShot < shotDelay) return;
  if (ammoState.clip <= 0) {
    playDryFire();
    startReload();
    return;
  }
  lastShot = now;
  ammoState.clip -= 1;

  muzzleLight.intensity = 3.5;
  setTimeout(() => { muzzleLight.intensity = 0; }, 35);
  gunGroup.position.z += 0.04;
  recoilPitch = Math.min(0.055, recoilPitch + (aiming ? 0.008 : 0.018));
  pulseCrosshair();
  playGunshot(weapon);

  const spread = aiming ? weapon.spread * 0.35 : weapon.spread;
  const direction = new THREE.Vector3(
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
    -1
  ).unproject(camera).sub(camera.position).normalize();

  raycaster.set(camera.position, direction);
  raycaster.far = weapon.range;
  const targets = enemies.flatMap((enemy) => enemy.children.filter((child) => child.isMesh && enemy.userData.alive));
  const hits = raycaster.intersectObjects(targets, false);
  const end = camera.position.clone().add(direction.clone().multiplyScalar(weapon.range));
  if (hits.length) {
    const hit = hits[0];
    const enemy = enemies.find((item) => item.children.includes(hit.object));
    if (enemy?.userData.alive) {
      enemy.userData.health -= weapon.damage;
      end.copy(hit.point);
      flashEnemy(enemy, hit.point, weapon.damage);
      showHitMarker();
      playHit();
      if (enemy.userData.health <= 0) killEnemy(enemy);
    }
  }
  makeBeam(end, weapon.color, camera.position.clone().add(direction.clone().multiplyScalar(1.4)));
  updateHud();
  if (ammoState.clip === 0) startReload();
}

function startReload() {
  const weapon = weapons[currentWeapon];
  const ammoState = ammo[currentWeapon];
  if (reloading || ammoState.reserve <= 0 || ammoState.clip === weapon.mag) return;
  reloading = true;
  reloadStart = performance.now();
  reloadDuration = weapon.reload * 1000;
  reloadMeter.classList.add("active");
  playReload(weapon);
  showMessage("Reloading");
}

function finishReload() {
  const weapon = weapons[currentWeapon];
  const ammoState = ammo[currentWeapon];
  const needed = weapon.mag - ammoState.clip;
  const loaded = Math.min(needed, ammoState.reserve);
  ammoState.clip += loaded;
  ammoState.reserve -= loaded;
  reloading = false;
  reloadMeter.classList.remove("active");
  updateHud();
}

function makeBeam(end, color, start = camera.position.clone()) {
  const tracer = makeTracer(start, end, color, 0.12, 0.045, 18);
  worldGroup.add(tracer);
  bulletBeams.push(tracer);
  trimTracers();
}

function makeTracer(start, end, color, life, radius, maxLength = 18) {
  const fullDirection = end.clone().sub(start);
  const fullLength = fullDirection.length();
  const direction = fullDirection.normalize();
  const length = Math.min(fullLength, maxLength);
  const tracerEnd = start.clone().add(direction.clone().multiplyScalar(length));
  const midpoint = start.clone().add(tracerEnd).multiplyScalar(0.5);
  const geometry = new THREE.CylinderGeometry(radius, radius * 0.35, length, 5, 1, true);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
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

function flashEnemy(enemy, hitPoint, damage) {
  enemy.children.forEach((part) => {
    if (part.material?.emissive) part.material.emissive.set(0xff315f);
  });
  if (hitPoint) makeHitEffect(hitPoint, damage);
  setTimeout(() => {
    enemy.children.forEach((part) => {
      if (part.material?.emissive) part.material.emissive.set(part.geometry?.type === "BoxGeometry" ? 0xff1642 : 0x000000);
    });
  }, 80);
}

function makeHitEffect(position, damage) {
  const group = new THREE.Group();
  group.position.copy(position);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xfff4b0, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.018, 8, 28),
    new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  ring.lookAt(camera.position);
  const light = new THREE.PointLight(0xffd166, 4.5, 7);

  for (let i = 0; i < 9; i += 1) {
    const spark = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.004, 0.42, 6),
      new THREE.MeshBasicMaterial({ color: 0xfff8d0, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    spark.position.copy(randomUnitVector().multiplyScalar(0.12));
    spark.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spark.position.clone().normalize());
    spark.userData.velocity = spark.position.clone().normalize().multiplyScalar(4 + Math.random() * 3);
    group.add(spark);
  }

  if (damage > 0) {
    const label = makeDamageSprite(Math.round(damage));
    label.position.set(0, 0.62, 0);
    group.add(label);
  }
  group.add(core, ring, light);
  group.userData.life = 0.42;
  group.userData.maxLife = 0.42;
  worldGroup.add(group);
  hitEffects.push(group);
}

function randomUnitVector() {
  return new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.85, Math.random() - 0.5).normalize();
}

function makeDamageSprite(value) {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 128;
  labelCanvas.height = 64;
  const ctx = labelCanvas.getContext("2d");
  ctx.font = "900 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.strokeText(String(value), 64, 32);
  ctx.fillStyle = "#fff4a8";
  ctx.fillText(String(value), 64, 32);
  const texture = new THREE.CanvasTexture(labelCanvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(1.2, 0.6, 1);
  sprite.userData.texture = texture;
  return sprite;
}

function killEnemy(enemy) {
  const mode = difficulty();
  enemy.userData.alive = false;
  enemy.userData.respawning = true;
  coins += enemy.userData.reward;
  totalKills += 1;
  streak += 1;
  if (totalKills % mode.waveKills === 0) {
    wave += 1;
    restockPickups();
    showMessage(`Wave ${wave}: enemies upgraded`);
    showWaveBanner();
  }
  playerLevel = Math.min(9, 1 + Math.floor(coins / 240));
  enemy.visible = false;
  addKillAmmo();
  if (totalKills % mode.waveKills !== 0) showMessage(`+${enemy.userData.reward} coins`);
  showStreak();
  playEnemyDown();
  updateHud();
  setTimeout(() => respawnEnemy(enemy), Math.max(520, (enemyRespawnDelay - Math.min(wave, 14) * 72) * mode.spawn));
}

function updatePlayer(dt) {
  const sprinting = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const speed = aiming ? 4.2 : sprinting ? 8.7 : 6.8;
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
  next.x = THREE.MathUtils.clamp(next.x, -29, 29);
  next.z = THREE.MathUtils.clamp(next.z, -29, 29);
  if (!collides(next, 0.65)) camera.position.copy(next);
  collectPickups();
  if (move.lengthSq() > 0 && performance.now() - lastStep > (aiming ? 520 : 360)) {
    lastStep = performance.now();
    playFootstep();
  }
  camera.position.y = 1.75;
  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  recoilPitch = THREE.MathUtils.lerp(recoilPitch, 0, 1 - Math.pow(0.00001, dt));
  camera.rotation.x = pitch - recoilPitch;
  camera.fov = THREE.MathUtils.lerp(camera.fov, aiming ? 48 : sprinting ? 82 : 75, 1 - Math.pow(0.0008, dt));
  camera.updateProjectionMatrix();
  gunGroup.position.lerp(new THREE.Vector3(aiming ? 0.04 : 0.38, aiming ? -0.23 : -0.33, -0.45), 1 - Math.pow(0.0003, dt));
}

function collides(position, radius) {
  return cover.some((mesh) => {
    const w = mesh.geometry.parameters.width / 2 + radius;
    const d = mesh.geometry.parameters.depth / 2 + radius;
    return Math.abs(position.x - mesh.position.x) < w && Math.abs(position.z - mesh.position.z) < d;
  });
}

function updateEnemies(dt) {
  const now = performance.now();
  enemies.forEach((enemy) => {
    if (!enemy.userData.alive) return;
    const toPlayer = tmpVec.subVectors(camera.position, enemy.position);
    const distance = toPlayer.length();
    enemy.lookAt(camera.position.x, enemy.position.y, camera.position.z);
    if (now - enemy.userData.lastStrafeChange > 1500 + Math.random() * 900) {
      enemy.userData.lastStrafeChange = now;
      enemy.userData.strafe *= -1;
    }

    const canShoot = distance <= enemy.userData.attackRange && now - enemy.userData.lastAttack > enemy.userData.attackCooldown;
    if (canShoot) {
      enemy.userData.lastAttack = now;
      const blocked = raycasterIntersectsCover(enemy.position.clone().add(new THREE.Vector3(0, 1.2, 0)), camera.position);
      if (!blocked || selectedDifficulty === "extreme") {
        makeEnemyBeam(enemy.position.clone().add(new THREE.Vector3(0, 1.05, 0)), camera.position.clone());
        playEnemyShot();
        damagePlayer(enemy.userData.attackDamage);
      }
    }

    if (distance > enemy.userData.meleeRange) {
      const chase = toPlayer.normalize();
      const strafeWeight = distance < enemy.userData.attackRange ? (selectedDifficulty === "extreme" ? 0.08 : 0.18) : 0.58;
      const stepMultiplier = selectedDifficulty === "extreme" && distance < enemy.userData.attackRange ? 1.22 : 1;
      const strafe = new THREE.Vector3(-chase.z, 0, chase.x).multiplyScalar(enemy.userData.strafe * strafeWeight);
      const step = chase.add(strafe).normalize().multiplyScalar(enemy.userData.speed * stepMultiplier * dt);
      const next = findEnemyStep(enemy, step);
      if (next) enemy.position.copy(next);
    }

    const bob = Math.sin(now * 0.006 + enemy.position.x) * 0.035;
    enemy.children[0].position.y = 0.6 + bob;
    enemy.children[1].position.y = 1.42 + bob;
    const healthRatio = Math.max(0, enemy.userData.health / enemy.userData.maxHealth);
    enemy.children[5].material.color.setHSL(healthRatio * 0.32, 1, 0.58);
  });
}

function findEnemyStep(enemy, desiredStep) {
  const attempts = [
    desiredStep,
    new THREE.Vector3(-desiredStep.z, 0, desiredStep.x).multiplyScalar(0.9),
    new THREE.Vector3(desiredStep.z, 0, -desiredStep.x).multiplyScalar(0.9),
    desiredStep.clone().multiplyScalar(-0.45)
  ];
  for (const step of attempts) {
    const next = enemy.position.clone().add(step);
    next.x = THREE.MathUtils.clamp(next.x, -29, 29);
    next.z = THREE.MathUtils.clamp(next.z, -29, 29);
    if (!collides(next, 0.9) && !enemyCrowded(enemy, next)) return next;
  }
  enemy.userData.strafe *= -1;
  return null;
}

function enemyCrowded(enemy, next) {
  return enemies.some((other) => other !== enemy && other.userData.alive && other.position.distanceTo(next) < 1.15);
}

function makeEnemyBeam(start, end) {
  const tracer = makeTracer(start, end, 0xff284e, 0.14, 0.035, 14);
  worldGroup.add(tracer);
  bulletBeams.push(tracer);
  trimTracers();
}

function collectPickups() {
  const mode = difficulty();
  pickups.forEach((pickup) => {
    if (!pickup.visible || pickup.position.distanceTo(camera.position) > 1.45) return;
    pickup.visible = false;
    if (pickup.userData.type === "health") {
      health = Math.min(100, health + pickup.userData.amount);
      showMessage("+ Health");
    } else {
      ammo.forEach((ammoState, index) => {
        ammoState.reserve += Math.floor(pickup.userData.amount * mode.ammo * (index === 2 ? 1.8 : index === 3 || index === 7 ? 0.6 : 1));
      });
      showMessage("+ Ammo");
    }
    playHit();
    updateHud();
  });
}

function restockPickups() {
  const mode = difficulty();
  pickups.forEach((pickup) => {
    pickup.visible = true;
    pickup.userData.bob = Math.random() * Math.PI * 2;
  });
  ammo.forEach((ammoState, index) => {
    ammoState.reserve += Math.floor(36 * mode.ammo * (index === 2 ? 1.7 : index === 3 || index === 7 ? 0.55 : 1));
  });
  health = Math.min(100, health + 20);
}

function addKillAmmo() {
  const mode = difficulty();
  ammo.forEach((ammoState, index) => {
    const weapon = weapons[index];
    const amount = Math.max(1, Math.round(weapon.mag * 0.12 * mode.ammo));
    ammoState.reserve = Math.min(weapon.reserve * 4, ammoState.reserve + amount);
  });
}

function updatePickups(dt) {
  pickups.forEach((pickup) => {
    if (!pickup.visible) return;
    pickup.userData.bob += dt * 2.5;
    pickup.position.y = 0.36 + Math.sin(pickup.userData.bob) * 0.08;
    pickup.rotation.y += dt * 0.7;
  });
}

function raycasterIntersectsCover(from, to) {
  const direction = to.clone().sub(from);
  const distance = direction.length();
  raycaster.set(from, direction.normalize());
  raycaster.far = distance;
  return raycaster.intersectObjects(cover, false).length > 0;
}

function damagePlayer(amount) {
  const now = performance.now();
  if (now - lastEnemyDamage < difficulty().damageGate) return;
  lastEnemyDamage = now;
  const modeDamageCaps = { easy: 2.2, normal: 5.2, hard: 10.5, extreme: 22 };
  const modeDamageMins = { easy: 0.8, normal: 1.8, hard: 3.6, extreme: 7.5 };
  const finalDamage = Math.min(modeDamageCaps[selectedDifficulty] || 4.2, Math.max(modeDamageMins[selectedDifficulty] || 1.4, amount));
  health -= finalDamage;
  if (now - lastDamageTaken > 3200) streak = 0;
  lastDamageTaken = now;
  damageFlash.classList.add("hit");
  if (health < 35) damageFlash.classList.add("critical");
  setTimeout(() => damageFlash.classList.remove("hit"), 90);
  setTimeout(() => damageFlash.classList.remove("critical"), 170);
  updateHud();
  if (health <= 0) endGame(false);
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
  startPanel.classList.remove("hidden");
  gameHistoryActive = false;
  showMessage("Click to lock aim");
}

function pushGameHistoryState() {
  if (gameHistoryActive) return;
  gameHistoryActive = true;
  history.pushState({ strikeGrid: "playing" }, "", location.href);
}

function requestAimLock() {
  if (aimLockBlocked || document.pointerLockElement === canvas) return;
  try {
    const request = canvas.requestPointerLock?.();
    if (request?.catch) {
      request.catch(() => {
        aimLockBlocked = true;
        showMessage("Mouse lock blocked here | click shoots | WASD moves");
      });
    }
  } catch {
    aimLockBlocked = true;
    showMessage("Mouse lock blocked here | click shoots | WASD moves");
  }
}

function updatePassiveHealth(dt) {
  const now = performance.now();
  if (!started || health <= 0 || health >= 100 || now - lastDamageTaken < 4200) {
    passiveHealTimer = 0;
    return;
  }
  passiveHealTimer += dt;
  if (passiveHealTimer > 0.5) {
    passiveHealTimer = 0;
    health = Math.min(100, health + 1);
    updateHud();
  }
}

function showHitMarker() {
  hitMarker.classList.remove("show");
  void hitMarker.offsetWidth;
  hitMarker.classList.add("show");
}

function pulseCrosshair() {
  crosshair.classList.add("fire");
  window.clearTimeout(pulseCrosshair.timer);
  pulseCrosshair.timer = window.setTimeout(() => crosshair.classList.remove("fire"), 90);
}

function showWaveBanner() {
  waveBanner.textContent = `Wave ${wave}`;
  waveBanner.classList.remove("show");
  void waveBanner.offsetWidth;
  waveBanner.classList.add("show");
}

function showStreak() {
  if (streak < 2) return;
  streakText.textContent = `${streak} kill streak`;
  streakText.classList.remove("show");
  void streakText.offsetWidth;
  streakText.classList.add("show");
}

function updateBeams(dt) {
  bulletBeams = bulletBeams.filter((line) => {
    line.userData.life -= dt;
    line.material.opacity = Math.max(0, line.userData.life / (line.userData.maxLife || 0.1));
    if (line.userData.life <= 0) {
      worldGroup.remove(line);
      line.geometry.dispose();
      line.material.dispose();
      return false;
    }
    return true;
  });
}

function updateHitEffects(dt) {
  hitEffects = hitEffects.filter((effect) => {
    effect.userData.life -= dt;
    const ratio = Math.max(0, effect.userData.life / effect.userData.maxLife);
    effect.children.forEach((child) => {
      if (child.isMesh || child.isSprite) {
        child.material.opacity = ratio;
        if (child.userData.velocity) child.position.addScaledVector(child.userData.velocity, dt);
      }
      if (child.isPointLight) child.intensity = 4.5 * ratio;
      if (child.isSprite) child.position.y += dt * 1.8;
    });
    effect.scale.setScalar(1 + (1 - ratio) * 0.9);
    if (effect.userData.life > 0) return true;
    effect.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      if (child.userData.texture) child.userData.texture.dispose();
    });
    worldGroup.remove(effect);
    return false;
  });
}

function drawMiniMap() {
  const ctx = miniMap.getContext("2d");
  const width = miniMap.width;
  const height = miniMap.height;
  const scale = width / 64;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(4, 7, 10, 0.86)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.strokeRect(2, 2, width - 4, height - 4);

  ctx.fillStyle = "rgba(170,185,190,0.52)";
  cover.forEach((mesh) => {
    const w = mesh.geometry.parameters.width * scale;
    const d = mesh.geometry.parameters.depth * scale;
    ctx.fillRect((mesh.position.x + 32) * scale - w / 2, (mesh.position.z + 32) * scale - d / 2, w, d);
  });

  pickups.forEach((pickup) => {
    if (!pickup.visible) return;
    ctx.fillStyle = pickup.userData.type === "health" ? "#8dff9a" : "#ffcf5f";
    ctx.beginPath();
    ctx.arc((pickup.position.x + 32) * scale, (pickup.position.z + 32) * scale, 3.4, 0, Math.PI * 2);
    ctx.fill();
  });

  enemies.forEach((enemy) => {
    if (!enemy.userData.alive) return;
    ctx.fillStyle = "#ff315f";
    ctx.beginPath();
    ctx.arc((enemy.position.x + 32) * scale, (enemy.position.z + 32) * scale, 4.2, 0, Math.PI * 2);
    ctx.fill();
  });

  const px = (camera.position.x + 32) * scale;
  const pz = (camera.position.z + 32) * scale;
  ctx.save();
  ctx.translate(px, pz);
  ctx.rotate(-yaw);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.lineTo(5, 6);
  ctx.lineTo(0, 3);
  ctx.lineTo(-5, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function loop() {
  const dt = Math.min(clock.getDelta(), 0.04);
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
    updateHitEffects(dt);
    updatePassiveHealth(dt);
    drawMiniMap();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

document.querySelectorAll(".mapButton").forEach((button) => {
  button.addEventListener("click", () => {
    selectedMap = Number(button.dataset.map);
    document.querySelectorAll(".mapButton").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".modeButton").forEach((button) => {
  button.addEventListener("click", () => {
    selectedDifficulty = button.dataset.difficulty;
    document.querySelectorAll(".modeButton").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateHud();
  });
});

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
menuButton.addEventListener("click", returnToMenu);
canvas.addEventListener("click", () => {
  if (started && document.pointerLockElement !== canvas) requestAimLock();
});
document.addEventListener("pointerlockchange", () => {
  showMessage(document.pointerLockElement === canvas ? "Left shoot | Right focus | Shift sprint | R reload | 1-9 guns | Esc menu" : "Click to lock aim");
});
document.addEventListener("mousemove", (event) => {
  if (!started || document.pointerLockElement !== canvas) return;
  yaw -= event.movementX * 0.0023;
  pitch -= event.movementY * 0.0023;
  pitch = THREE.MathUtils.clamp(pitch, -1.25, 1.25);
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
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    returnToMenu();
    return;
  }
  keys.add(event.code);
  if (/^Digit[1-9]$/.test(event.code)) buyOrEquip(Number(event.code.slice(-1)) - 1);
  if (event.code === "KeyR") startReload();
});
document.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("resize", resize);
window.addEventListener("popstate", () => {
  if (started) {
    returnToMenu();
    history.pushState({ strikeGrid: "menu" }, "", location.href);
  }
});

weapons[0].unlocked = true;
ammo = weapons.map((weapon) => ({ clip: weapon.mag, reserve: weapon.reserve }));
resize();
buildMap(selectedMap);
buildGun();
updateHud();
loop();

function ensureAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") audioContext.resume();
}

function envelopeGain(start, peak, end, duration) {
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(start, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(peak, audioContext.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(end, audioContext.currentTime + duration);
  return gain;
}

function playGunshot(weapon) {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const noise = audioContext.createBufferSource();
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.12, audioContext.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const filter = audioContext.createBiquadFilter();
  const punch = envelopeGain(0.0001, 0.78, 0.0001, 0.18);
  const crack = envelopeGain(0.0001, 0.38, 0.0001, 0.09);
  osc.type = "triangle";
  osc.frequency.setValueAtTime(weapon.bass, now);
  osc.frequency.exponentialRampToValueAtTime(weapon.bass * 0.42, now + 0.1);
  noise.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.frequency.value = 1650;
  filter.Q.value = 0.9;
  osc.connect(punch).connect(audioContext.destination);
  noise.connect(filter).connect(crack).connect(audioContext.destination);
  osc.start(now);
  noise.start(now);
  osc.stop(now + 0.18);
  noise.stop(now + 0.12);
}

function playEnemyShot() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = envelopeGain(0.0001, 0.18, 0.0001, 0.12);
  osc.type = "square";
  osc.frequency.value = 210;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.12);
}

function playReload(weapon) {
  if (!audioContext) return;
  [0, 0.18, weapon.reload * 0.72].forEach((delay, index) => {
    const osc = audioContext.createOscillator();
    const gain = envelopeGain(0.0001, 0.14, 0.0001, 0.08);
    osc.type = "square";
    osc.frequency.value = index === 2 ? 280 : 130 + index * 45;
    osc.connect(gain).connect(audioContext.destination);
    osc.start(audioContext.currentTime + delay);
    osc.stop(audioContext.currentTime + delay + 0.08);
  });
}

function playDryFire() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = envelopeGain(0.0001, 0.08, 0.0001, 0.04);
  osc.type = "square";
  osc.frequency.value = 520;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.04);
}

function playHit() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = envelopeGain(0.0001, 0.08, 0.0001, 0.06);
  osc.type = "sawtooth";
  osc.frequency.value = 95;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.06);
}

function playEnemyDown() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = envelopeGain(0.0001, 0.16, 0.0001, 0.22);
  osc.type = "triangle";
  osc.frequency.setValueAtTime(160, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.22);
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.22);
}

function playFootstep() {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = envelopeGain(0.0001, 0.045, 0.0001, 0.08);
  osc.type = "triangle";
  osc.frequency.value = 74 + Math.random() * 16;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}
