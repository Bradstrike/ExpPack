// State Management
let state = {
  npm: { root: '', prefix: '', packages: [] },
  yarn: { root: '', bin: '', packages: [] },
  cliFiles: [],
  pathInfo: [],
  localProject: { info: null, packages: [], path: '' },
  activeTab: 'npm-panel',
  eventSource: null,
  currentLang: localStorage.getItem('exppack-lang') || 'tr'
};

const TRANSLATIONS = {
  tr: {
    app_title: "ExpPack - Global & Yerel Paket Kontrol Paneli",
    app_subtitle: "Global & Yerel Paket Yönetim İstasyonu",
    npm_cache: "NPM Önbelleği:",
    cache_calculating: "Hesaplanıyor...",
    btn_clear_cache_title: "Önbelleği Temizle",
    btn_lang_title: "Dil Seçeneği / Language Selection",
    lang_label: "Dil:",
    global_npm_packages: "Global NPM Paketleri",
    global_yarn_packages: "Global Yarn Paketleri",
    cli_commands: "CLI Komutları",
    path_dirs: "PATH Dizinleri",
    nav_npm_global: "NPM Global",
    nav_yarn_global: "Yarn Global",
    nav_local_project: "Yerel Proje",
    nav_installer: "Yükleyici",
    nav_system_path: "Sistem PATH",
    npm_panel_title: "NPM Global Paketleri",
    yarn_panel_title: "Yarn Global Paketleri",
    search_packages_placeholder: "Paketlerde ara...",
    scanning: "Taranıyor...",
    local_panel_title: "Yerel Proje Tarayıcı",
    project_path_label: "Proje Klasörü Yolu (Absolute Path):",
    project_path_placeholder: "Örn: C:\\projelerim\\yeni-proje",
    btn_scan_project: "Klasörü Tara",
    project_search_placeholder: "Proje paketlerinde ara...",
    project_empty_desc: "Taramak istediğiniz projenin tam klasör yolunu yukarıya girip \"Klasörü Tara\" butonuna basın.",
    installer_title: "Yeni Paket Yükleme İstasyonu",
    install_type_label: "Yükleme Tipi:",
    install_scope_global: "Global",
    install_scope_local: "Yerel Proje",
    package_manager_label: "Paket Yöneticisi:",
    target_project_path_label: "Hedef Proje Dizin Yolu:",
    target_project_path_placeholder: "Örn: C:\\projelerim\\yeni-proje",
    install_cmd_label: "Paket Adı veya Hazır Kurulum Komutu:",
    install_cmd_placeholder: "Örn: typescript veya npm i -g nodemon",
    btn_run_install: "Yüklemeyi Başlat",
    installer_hint: "İster sadece paket ismini yazın, isterseniz kopyaladığınız hazır terminal komutunu yapıştırın (ExpPack otomatik ayrıştırır).",
    path_title: "Sistem PATH Ortam Değişkenleri",
    add_path_label: "Kullanıcı PATH Değişkenine Yeni Klasör Ekle:",
    add_path_placeholder: "Örn: C:\\Users\\Kullanıcı\\node_modules\\.bin",
    btn_add_path: "PATH'e Ekle",
    current_paths_title: "Mevcut PATH Kayıtları",
    paths_desc: "Yeşil renkli olanlar Node.js / NPM / Yarn ile ilişkili yolları belirtir.",
    terminal_title: "Canlı İşlem Konsolu (SSE Terminal)",
    terminal_clear_title: "Konsolu Temizle",
    terminal_toggle_title: "Küçült/Büyüt",
    terminal_welcome: "> ExpPack konsoluna hoş geldiniz. Yapılan tüm yükleme/silme işlemleri burada anlık akar.",
    
    // Dynamic JS texts
    confirm_clear_cache: "NPM önbelleğini temizlemek istediğinize emin misiniz?",
    clearing: "Temizleniyor...",
    cache_cleared: "Önbellek temizlendi.",
    cache_clear_error: "Önbellek temizlenemedi",
    enter_valid_path: "Lütfen geçerli bir klasör yolu girin.",
    path_add_error: "Hata: ",
    request_error: "İstek gönderilirken hata oluştu: ",
    error_occurred: "Hata oluştu",
    scanning_project: "Klasör taranıyor...",
    project_name_prefix: "Proje Adı: ",
    project_version_prefix: "Sürüm: ",
    directory_label: "Dizin",
    search_no_results: "Aramanıza uygun paket bulunamadı.",
    author_label: "Yazar: ",
    size_label: "Boyut: ",
    calculate: "Hesapla",
    btn_reinstall: "Yeniden Yükle",
    btn_uninstall: "Kaldır",
    path_status_ok: "OK",
    path_status_missing: "KAYIP",
    action_started: "BAŞLATILIYOR",
    action_success: "Başarılı: {name} paketi için \"{action}\" işlemi tamamlandı.",
    action_failed: "Hata: {name} paketi için \"{action}\" işlemi başarısız oldu!",
    sse_ended: "[Bağlantı Sonlandı]: SSE akışı sonlandı veya bağlantı kesildi.",
    enter_package_or_cmd: "Lütfen bir paket adı veya komut girin.",
    cmd_parse_failed: "Komut ayrıştırılamadı. Lütfen geçerli bir paket ismi yazın.",
    enter_project_path_for_local: "Yerel yükleme yapabilmek için lütfen proje dizin yolunu girin.",
    calculating: "Hesaplanıyor...",
    retry: "Yeniden Dene",
    error: "Hata",
    system: "[Sistem]"
  },
  en: {
    app_title: "ExpPack - Global & Local Package Dashboard",
    app_subtitle: "Global & Local Package Management Station",
    npm_cache: "NPM Cache:",
    cache_calculating: "Calculating...",
    btn_clear_cache_title: "Clear Cache",
    btn_lang_title: "Dil Seçeneği / Language Selection",
    lang_label: "Language:",
    global_npm_packages: "Global NPM Packages",
    global_yarn_packages: "Global Yarn Packages",
    cli_commands: "CLI Commands",
    path_dirs: "PATH Directories",
    nav_npm_global: "NPM Global",
    nav_yarn_global: "Yarn Global",
    nav_local_project: "Local Project",
    nav_installer: "Installer",
    nav_system_path: "System PATH",
    npm_panel_title: "NPM Global Packages",
    yarn_panel_title: "Yarn Global Packages",
    search_packages_placeholder: "Search packages...",
    scanning: "Scanning...",
    local_panel_title: "Local Project Scanner",
    project_path_label: "Project Directory Path (Absolute Path):",
    project_path_placeholder: "E.g., C:\\myprojects\\new-project",
    btn_scan_project: "Scan Directory",
    project_search_placeholder: "Search project packages...",
    project_empty_desc: "Enter the absolute directory path of the project you want to scan above and click \"Scan Directory\".",
    installer_title: "New Package Installation Station",
    install_type_label: "Installation Type:",
    install_scope_global: "Global",
    install_scope_local: "Local Project",
    package_manager_label: "Package Manager:",
    target_project_path_label: "Target Project Directory Path:",
    target_project_path_placeholder: "E.g., C:\\myprojects\\new-project",
    install_cmd_label: "Package Name or Installation Command:",
    install_cmd_placeholder: "E.g., typescript or npm i -g nodemon",
    btn_run_install: "Start Installation",
    installer_hint: "Enter just the package name, or paste any copied command directly (ExpPack parses it automatically).",
    path_title: "System PATH Environment Variables",
    add_path_label: "Add New Folder to User PATH Variable:",
    add_path_placeholder: "E.g., C:\\Users\\User\\node_modules\\.bin",
    btn_add_path: "Add to PATH",
    current_paths_title: "Current PATH Records",
    paths_desc: "Green colored entries highlight paths related to Node.js / NPM / Yarn.",
    terminal_title: "Live Action Console (SSE Terminal)",
    terminal_clear_title: "Clear Console",
    terminal_toggle_title: "Minimize/Maximize",
    terminal_welcome: "> Welcome to ExpPack console. All installation/removal actions flow here in real-time.",
    
    // Dynamic JS texts
    confirm_clear_cache: "Are you sure you want to clear the NPM cache?",
    clearing: "Clearing...",
    cache_cleared: "Cache cleared.",
    cache_clear_error: "Failed to clear cache",
    enter_valid_path: "Please enter a valid folder path.",
    path_add_error: "Error: ",
    request_error: "Error sending request: ",
    error_occurred: "An error occurred",
    scanning_project: "Scanning folder...",
    project_name_prefix: "Project Name: ",
    project_version_prefix: "Version: ",
    directory_label: "Directory",
    search_no_results: "No matching packages found.",
    author_label: "Author: ",
    size_label: "Size: ",
    calculate: "Calculate",
    btn_reinstall: "Reinstall",
    btn_uninstall: "Uninstall",
    path_status_ok: "OK",
    path_status_missing: "MISSING",
    action_started: "STARTING",
    action_success: "Success: \"{action}\" operation completed for package {name}.",
    action_failed: "Error: \"{action}\" operation failed for package {name}!",
    sse_ended: "[Connection Terminated]: SSE stream ended or connection lost.",
    enter_package_or_cmd: "Please enter a package name or command.",
    cmd_parse_failed: "Command could not be parsed. Please enter a valid package name.",
    enter_project_path_for_local: "Please enter the project directory path to install locally.",
    calculating: "Calculating...",
    retry: "Retry",
    error: "Error",
    system: "[System]"
  }
};

function t(key, variables = {}) {
  const lang = state.currentLang || 'tr';
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['tr'];
  let text = dict[key] || TRANSLATIONS['tr'][key] || key;
  
  Object.keys(variables).forEach(varKey => {
    text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), variables[varKey]);
  });
  return text;
}

function applyLanguage(lang) {
  state.currentLang = lang;
  localStorage.setItem('exppack-lang', lang);
  
  document.title = t('app_title');
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) {
      el.innerHTML = translation;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation) {
      el.placeholder = translation;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation) {
      el.title = translation;
    }
  });
  
  const valEl = document.getElementById('lang-toggle-val');
  if (valEl) {
    valEl.textContent = lang.toUpperCase();
  }

  const termWelcomeMsg = document.getElementById('term-welcome-msg');
  if (termWelcomeMsg && (termWelcomeMsg.textContent.startsWith('>') || termWelcomeMsg.textContent.includes('ExpPack'))) {
    termWelcomeMsg.textContent = t('terminal_welcome');
  }

  // Check if elements exist and initial load is complete before re-rendering
  if (elements.npmList && state.npm.packages.length > 0) renderPackageList('npm');
  if (elements.yarnList && state.yarn.packages.length > 0) renderPackageList('yarn');
  if (elements.localList && state.localProject.packages.length > 0) renderPackageList('local');
  if (elements.pathItemsList && state.pathInfo.length > 0) renderPathInfo();
}


// Formatting helpers
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce helper to limit function execution rate
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// DOM Elements
const elements = {
  navButtons: document.querySelectorAll('.nav-item'),
  panels: document.querySelectorAll('.tab-panel'),
  npmList: document.getElementById('npm-list'),
  yarnList: document.getElementById('yarn-list'),
  localList: document.getElementById('local-list'),
  npmSearch: document.getElementById('npm-search'),
  yarnSearch: document.getElementById('yarn-search'),
  localSearch: document.getElementById('local-search'),
  npmCount: document.getElementById('stat-npm-count'),
  yarnCount: document.getElementById('stat-yarn-count'),
  cliCount: document.getElementById('stat-cli-count'),
  pathCount: document.getElementById('stat-path-count'),
  cacheVal: document.getElementById('npm-cache-val'),
  btnClearCache: document.getElementById('btn-clear-cache'),
  projectPathInput: document.getElementById('project-path-input'),
  btnScanProject: document.getElementById('btn-scan-project'),
  projectDetails: document.getElementById('project-details'),
  projectEmptyState: document.getElementById('project-empty-state'),
  projectTitle: document.getElementById('project-title'),
  projectMeta: document.getElementById('project-meta'),
  installScopeRadios: document.getElementsByName('install-scope'),
  installManagerRadios: document.getElementsByName('install-manager'),
  installLocalPathGroup: document.getElementById('install-local-path-group'),
  installLocalPath: document.getElementById('install-local-path'),
  installCmdInput: document.getElementById('install-cmd-input'),
  btnRunInstall: document.getElementById('btn-run-install'),
  addPathInput: document.getElementById('add-path-input'),
  btnAddPath: document.getElementById('btn-add-path'),
  pathItemsList: document.getElementById('path-items-list'),
  terminalFooter: document.getElementById('terminal-footer'),
  terminalBody: document.getElementById('terminal-body'),
  btnToggleTerm: document.getElementById('btn-toggle-term'),
  btnClearTerm: document.getElementById('btn-clear-term'),
  termHeaderToggle: document.getElementById('terminal-header-toggle')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadData();
  setupEventListeners();
  setupCommandParser();
  applyLanguage(state.currentLang);
});

// Setup Tab Navigation
function setupTabs() {
  elements.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      state.activeTab = target;

      elements.navButtons.forEach(b => b.classList.remove('active'));
      elements.panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

// Fetch all initial data
async function loadData() {
  await Promise.all([
    fetchPackages(),
    fetchCacheInfo(),
    fetchPathInfo()
  ]);
}

// Event Listeners setup
function setupEventListeners() {
  // Search Filters (debounced to avoid layout thrashing and input lag)
  elements.npmSearch.addEventListener('input', debounce(() => renderPackageList('npm'), 200));
  elements.yarnSearch.addEventListener('input', debounce(() => renderPackageList('yarn'), 200));
  elements.localSearch.addEventListener('input', debounce(() => renderPackageList('local'), 200));

  // Language Switcher
  const btnLangToggle = document.getElementById('btn-lang-toggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', () => {
      const newLang = state.currentLang === 'tr' ? 'en' : 'tr';
      applyLanguage(newLang);
    });
  }

  // Önbellek Temizleme
  elements.btnClearCache.addEventListener('click', async () => {
    if (!confirm(t('confirm_clear_cache'))) return;
    elements.cacheVal.textContent = t('clearing');
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' });
      const data = await res.json();
      appendLog(`${t('system')}: ${data.message || t('cache_cleared')}`, 'success-line');
      fetchCacheInfo();
    } catch (e) {
      appendLog(`${t('error')}: ${t('cache_clear_error')}: ${e.message}`, 'error-line');
      fetchCacheInfo();
    }
  });

  // Local Project Scan
  elements.btnScanProject.addEventListener('click', scanLocalProject);

  // PATH Ekleme
  elements.btnAddPath.addEventListener('click', async () => {
    const pathToAdd = elements.addPathInput.value.trim();
    if (!pathToAdd) return alert(t('enter_valid_path'));

    try {
      const res = await fetch('/api/path/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: pathToAdd })
      });
      const data = await res.json();
      if (data.error) {
        alert(t('error') + ': ' + data.error);
      } else {
        alert(data.message);
        elements.addPathInput.value = '';
        fetchPathInfo();
      }
    } catch (e) {
      alert(t('request_error') + e.message);
    }
  });

  // Terminal actions
  elements.termHeaderToggle.addEventListener('click', (e) => {
    // Avoid toggle if clicking action buttons inside header
    if (e.target.closest('.terminal-actions')) return;
    toggleTerminal();
  });
  elements.btnToggleTerm.addEventListener('click', toggleTerminal);
  elements.btnClearTerm.addEventListener('click', () => {
    elements.terminalBody.innerHTML = '';
  });

  // Scope Toggle in Install Form
  elements.installScopeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'local') {
        elements.installLocalPathGroup.classList.remove('hidden');
      } else {
        elements.installLocalPathGroup.classList.add('hidden');
      }
    });
  });

  // Run install button
  elements.btnRunInstall.addEventListener('click', runInstallFromForm);
}

// Command Parser for Installer tab
function setupCommandParser() {
  elements.installCmdInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const parsed = parseInstallCommand(val);
    if (!parsed) return;

    // Apply parsed values to form
    // Set scope
    const scopeRadio = document.querySelector(`input[name="install-scope"][value="${parsed.isGlobal ? 'global' : 'local'}"]`);
    if (scopeRadio) {
      scopeRadio.checked = true;
      scopeRadio.dispatchEvent(new Event('change'));
    }

    // Set manager
    const managerRadio = document.querySelector(`input[name="install-manager"][value="${parsed.manager}"]`);
    if (managerRadio) {
      managerRadio.checked = true;
    }

    // Fill package name clean field if it parsed something simpler
    // (We do not overwrite input immediately to let the user finish typing,
    // but we can parse the package name for the action)
  });
}

function parseInstallCommand(rawCmd) {
  const cleanCmd = rawCmd.trim();
  if (!cleanCmd) return null;

  let manager = 'npm';
  let isGlobal = false;
  let pkgName = '';

  const words = cleanCmd.split(/\s+/);

  if (words[0] === 'npm' || words[0] === 'npx') {
    manager = 'npm';
    const flags = ['install', 'i', 'add', '-g', '--global', '-D', '--save-dev', '--save', '-S', 'npx'];
    const filtered = words.filter(w => !flags.includes(w) && !w.startsWith('-'));
    if (filtered.length > 0) {
      pkgName = filtered.join(' ');
    }
    if (words.includes('-g') || words.includes('--global')) {
      isGlobal = true;
    }
  } else if (words[0] === 'yarn') {
    manager = 'yarn';
    const flags = ['global', 'add', 'yarn', '-D', '--dev'];
    const filtered = words.filter(w => !flags.includes(w) && !w.startsWith('-'));
    if (filtered.length > 0) {
      pkgName = filtered.join(' ');
    }
    if (words.includes('global')) {
      isGlobal = true;
    }
  } else {
    // Just a name
    pkgName = cleanCmd;
    // Guess global npm as default
    isGlobal = true;
  }

  return { manager, isGlobal, pkgName };
}

// Fetch Global Packages (optional type parameter: 'npm' or 'yarn')
async function fetchPackages(type = '') {
  try {
    const url = type ? `/api/packages?type=${type}` : '/api/packages';
    const res = await fetch(url);
    const data = await res.json();
    
    if (!type || type === 'npm') {
      state.npm = data.npm;
      elements.npmCount.textContent = state.npm.packages.length;
      renderPackageList('npm');
      
      state.cliFiles = data.cliFiles;
      elements.cliCount.textContent = state.cliFiles.length;
    }
    if (!type || type === 'yarn') {
      state.yarn = data.yarn;
      elements.yarnCount.textContent = state.yarn.packages.length;
      renderPackageList('yarn');
    }
  } catch (e) {
    if (!type || type === 'npm') {
      elements.npmList.innerHTML = `<div class="loader">${t('error_occurred')}: ${e.message}</div>`;
    }
    if (!type || type === 'yarn') {
      elements.yarnList.innerHTML = `<div class="loader">${t('error_occurred')}: ${e.message}</div>`;
    }
  }
}

// Fetch Cache Info
async function fetchCacheInfo() {
  try {
    const res = await fetch('/api/cache');
    const data = await res.json();
    elements.cacheVal.textContent = formatBytes(data.npmCacheSize);
  } catch (e) {
    elements.cacheVal.textContent = t('error');
  }
}

// Fetch PATH Info
async function fetchPathInfo() {
  try {
    const res = await fetch('/api/path-info');
    const data = await res.json();
    state.pathInfo = data.paths;

    elements.pathCount.textContent = state.pathInfo.length;
    renderPathInfo();
  } catch (e) {
    elements.pathItemsList.innerHTML = `<div class="loader">${t('error_occurred')}</div>`;
  }
}

// Scan Local Project
async function scanLocalProject() {
  const projectPath = elements.projectPathInput.value.trim();
  if (!projectPath) return alert(t('enter_valid_path'));

  elements.projectEmptyState.classList.add('hidden');
  elements.projectDetails.classList.remove('hidden');
  elements.localList.innerHTML = `<div class="loader">${t('scanning_project')}</div>`;

  try {
    const res = await fetch('/api/packages/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath })
    });
    const data = await res.json();

    if (data.error) {
      elements.localList.innerHTML = `<div class="loader">${data.error}</div>`;
      return;
    }

    state.localProject = {
      info: data.projectInfo,
      packages: data.packages,
      path: data.path
    };

    elements.projectTitle.textContent = `${t('project_name_prefix')}${state.localProject.info.name}`;
    elements.projectMeta.textContent = `${t('project_version_prefix')}${state.localProject.info.version} | ${t('directory_label')}: ${state.localProject.path}`;
    
    // Autofill local path for install form
    elements.installLocalPath.value = state.localProject.path;

    renderPackageList('local');
  } catch (e) {
    elements.localList.innerHTML = `<div class="loader">${t('request_error')}${e.message}</div>`;
  }
}

// Render Package Lists (NPM / Yarn / Local)
function renderPackageList(type) {
  let listEl, packages, searchVal, isGlobal, manager;

  if (type === 'npm') {
    listEl = elements.npmList;
    packages = state.npm.packages;
    searchVal = elements.npmSearch.value.toLowerCase();
    isGlobal = true;
    manager = 'npm';
  } else if (type === 'yarn') {
    listEl = elements.yarnList;
    packages = state.yarn.packages;
    searchVal = elements.yarnSearch.value.toLowerCase();
    isGlobal = true;
    manager = 'yarn';
  } else {
    listEl = elements.localList;
    packages = state.localProject.packages;
    searchVal = elements.localSearch.value.toLowerCase();
    isGlobal = false;
    manager = 'npm'; // Default local package manager is npm
  }

  // Filter packages by name / description
  const filtered = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchVal) || 
    pkg.description.toLowerCase().includes(searchVal)
  );

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <span class="emoji">🔍</span>
        <p>${t('search_no_results')}</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = '';
  filtered.forEach(pkg => {
    const card = document.createElement('div');
    card.className = 'pkg-card';

    // Find if package matches any globally registered CLI commands
    const matchingCLI = [];
    if (isGlobal && pkg.bin && pkg.bin.length > 0) {
      pkg.bin.forEach(b => {
        if (state.cliFiles.includes(b)) {
          matchingCLI.push(b);
        }
      });
    }

    card.innerHTML = `
      <div class="pkg-info">
        <div class="pkg-title-row">
          <span class="pkg-name">${pkg.name}</span>
          <span class="pkg-version">v${pkg.version}</span>
          <div class="pkg-bins">
            ${matchingCLI.map(c => `<span class="bin-tag" title="Terminal komutu: ${c}">cmd: ${c}</span>`).join('')}
          </div>
        </div>
        <p class="pkg-desc">${pkg.description}</p>
        <div class="pkg-meta-row">
          <div class="pkg-author">${t('author_label')}<span>${pkg.author}</span></div>
          <div class="pkg-size" id="size-${type}-${pkg.name.replace(/[@/]/g, '-')}" data-path="${pkg.path}">
            ${t('size_label')}${pkg.size !== undefined && pkg.size !== -1
              ? `<span>${formatBytes(pkg.size)}</span>`
              : `<button class="btn-calc-size" onclick="calculatePackageSize('${type}', '${pkg.name}', '${pkg.path.replace(/\\/g, '\\\\')}')">${t('calculate')}</button>`
            }
          </div>
        </div>
      </div>
      <div class="pkg-actions">
        <button class="btn btn-secondary" onclick="executeAction('reinstall', '${pkg.name}', '${manager}', ${isGlobal})">${t('btn_reinstall')}</button>
        <button class="btn btn-danger" onclick="executeAction('uninstall', '${pkg.name}', '${manager}', ${isGlobal})">${t('btn_uninstall')}</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

// Render PATH entries
function renderPathInfo() {
  elements.pathItemsList.innerHTML = '';
  state.pathInfo.forEach(p => {
    const row = document.createElement('div');
    row.className = `path-item-row ${p.isNodeRelated ? 'node-related' : ''} ${!p.exists ? 'broken' : ''}`;

    row.innerHTML = `
      <span class="path-status-badge ${p.exists ? 'ok' : 'err'}">${p.exists ? t('path_status_ok') : t('path_status_missing')}</span>
      <span class="path-text">${p.path}</span>
    `;
    elements.pathItemsList.appendChild(row);
  });
}

// SSE Execution handler (Install / Uninstall / Reinstall)
window.executeAction = function(action, name, manager, global) {
  if (state.eventSource) {
    state.eventSource.close();
  }

  // Auto-maximize terminal
  elements.terminalFooter.classList.remove('minimized');
  appendLog(`\n--- [${action.toUpperCase()}] ${t('action_started')}: ${name} ---`, 'system-line');

  const globalParam = global ? 'true' : 'false';
  const targetPath = !global ? state.localProject.path : '';
  
  const url = `/api/execute?action=${action}&name=${encodeURIComponent(name)}&manager=${manager}&global=${globalParam}&path=${encodeURIComponent(targetPath)}`;

  state.eventSource = new EventSource(url);

  state.eventSource.addEventListener('start', (e) => {
    const data = JSON.parse(e.data);
    appendLog(data.message, 'system-line');
  });

  state.eventSource.addEventListener('log', (e) => {
    const data = JSON.parse(e.data);
    // If text contains warnings or is from stderr, style it accordingly
    const logStyle = data.isError ? 'warning-line' : '';
    appendLog(data.text, logStyle);
  });

  state.eventSource.addEventListener('complete', (e) => {
    const data = JSON.parse(e.data);
    appendLog(data.message, 'success-line');
    state.eventSource.close();
    state.eventSource = null;
    
    // Notify user with a toast
    showToast(t('action_success', { name, action: t(`action_${action}`) }), 'success');
    
    // Reload only the specific list that was modified
    if (global) {
      fetchPackages(manager);
      if (manager === 'npm') {
        fetchCacheInfo();
      }
    } else {
      if (state.localProject.path) {
        scanLocalProject();
      }
    }
  });

  state.eventSource.addEventListener('failed', (e) => {
    const data = JSON.parse(e.data);
    appendLog(data.message, 'error-line');
    state.eventSource.close();
    state.eventSource = null;
    
    // Notify user with a toast
    showToast(t('action_failed', { name, action: t(`action_${action}`) }), 'error');
    
    // Reload only the specific list that was modified
    if (global) {
      fetchPackages(manager);
      if (manager === 'npm') {
        fetchCacheInfo();
      }
    } else {
      if (state.localProject.path) {
        scanLocalProject();
      }
    }
  });

  state.eventSource.onerror = (err) => {
    // Check if the stream finished before appending error
    if (state.eventSource) {
      appendLog(t('sse_ended'), 'system-line');
      state.eventSource.close();
      state.eventSource = null;
    }
  };
};

// Toast Notification System
function showToast(message, type = 'success') {
  // Remove existing toasts first to prevent overlap
  const existing = document.querySelectorAll('.toast');
  existing.forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Install Form Action
function runInstallFromForm() {
  const rawInput = elements.installCmdInput.value.trim();
  if (!rawInput) return alert(t('enter_package_or_cmd'));

  const parsed = parseInstallCommand(rawInput);
  if (!parsed || !parsed.pkgName) {
    return alert(t('cmd_parse_failed'));
  }

  const isGlobal = document.querySelector('input[name="install-scope"]:checked').value === 'global';
  const manager = document.querySelector('input[name="install-manager"]:checked').value;
  
  if (!isGlobal) {
    const pathVal = elements.installLocalPath.value.trim();
    if (!pathVal) {
      return alert(t('enter_project_path_for_local'));
    }
    state.localProject.path = pathVal; // cache it
  }

  executeAction('install', parsed.pkgName, manager, isGlobal);
}

// Log appending helper
function appendLog(text, className = '') {
  const line = document.createElement('div');
  line.className = `log-line ${className}`;
  line.textContent = text;
  elements.terminalBody.appendChild(line);
  elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
}

// Minimize / Maximize Terminal
function toggleTerminal() {
  elements.terminalFooter.classList.toggle('minimized');
}

// Lazy load package size on demand
window.calculatePackageSize = async function(type, name, packagePath) {
  const escapedId = `size-${type}-${name.replace(/[@/]/g, '-')}`;
  const container = document.getElementById(escapedId);
  if (!container) return;

  container.innerHTML = `${t('size_label')} <span class="calc-loading">${t('calculating')}</span>`;

  try {
    const res = await fetch('/api/packages/size', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packagePath })
    });
    const data = await res.json();
    if (data.success) {
      container.innerHTML = `${t('size_label')} <span>${formatBytes(data.size)}</span>`;

      // Update state so that rendering again preserves it
      let targetPkg;
      if (type === 'npm') {
        targetPkg = state.npm.packages.find(p => p.name === name);
      } else if (type === 'yarn') {
        targetPkg = state.yarn.packages.find(p => p.name === name);
      } else if (type === 'local') {
        targetPkg = state.localProject.packages.find(p => p.name === name);
      }
      if (targetPkg) {
        targetPkg.size = data.size;
      }
    } else {
      const escapedPath = packagePath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      container.innerHTML = `${t('size_label')} <button class="btn-calc-size err" onclick="calculatePackageSize('${type}', '${name}', '${escapedPath}')">${t('error')} (${t('retry')})</button>`;
    }
  } catch (e) {
    const escapedPath = packagePath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    container.innerHTML = `${t('size_label')} <button class="btn-calc-size err" onclick="calculatePackageSize('${type}', '${name}', '${escapedPath}')">${t('error')} (${t('retry')})</button>`;
  }
};
