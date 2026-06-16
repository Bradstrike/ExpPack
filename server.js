import express from 'express';
import cors from 'cors';
import open from 'open';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const port = 4200;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper: Run command and return promise
function runCmd(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Helper: Calculate directory size recursively
function getDirSize(dirPath) {
  let size = 0;
  try {
    if (!fs.existsSync(dirPath)) return 0;
    const stats = fs.statSync(dirPath);
    if (stats.isFile()) return stats.size;
    
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      size += getDirSize(path.join(dirPath, file));
    }
  } catch (e) {
    // Ignore errors for locked files
  }
  return size;
}

// Helper: Calculate directory size recursively and asynchronously (non-blocking)
async function getDirSizeAsync(dirPath) {
  let size = 0;
  try {
    if (!fs.existsSync(dirPath)) return 0;
    const stats = await fs.promises.stat(dirPath);
    if (stats.isFile()) return stats.size;
    
    const files = await fs.promises.readdir(dirPath);
    const promises = files.map(file => getDirSizeAsync(path.join(dirPath, file)));
    const sizes = await Promise.all(promises);
    size = sizes.reduce((acc, curr) => acc + curr, 0);
  } catch (e) {
    // Ignore errors for locked files
  }
  return size;
}

// Get global directory locations dynamically
let npmGlobalPrefix = '';
let npmGlobalRoot = '';
let yarnGlobalDir = '';
let yarnGlobalBin = '';
let npmCacheDir = '';
let pathsInitialized = false;

async function initPaths() {
  if (pathsInitialized) return;

  try {
    npmGlobalPrefix = await runCmd('npm prefix -g');
    npmGlobalRoot = path.join(npmGlobalPrefix, 'node_modules');
  } catch (e) {
    npmGlobalPrefix = path.join(os.homedir(), 'AppData/Roaming/npm');
    npmGlobalRoot = path.join(npmGlobalPrefix, 'node_modules');
  }

  try {
    yarnGlobalDir = await runCmd('yarn global dir');
  } catch (e) {
    yarnGlobalDir = path.join(os.homedir(), 'AppData/Local/Yarn/Data/global');
  }

  try {
    yarnGlobalBin = await runCmd('yarn global bin');
  } catch (e) {
    yarnGlobalBin = path.join(npmGlobalPrefix, 'bin');
  }

  try {
    npmCacheDir = await runCmd('npm config get cache');
  } catch (e) {
    npmCacheDir = path.join(os.homedir(), 'AppData/Roaming/npm-cache');
  }

  pathsInitialized = true;
}

// Scan package.json files from a given node_modules root asynchronously (non-blocking)
async function scanNodeModulesAsync(rootPath) {
  const packages = [];
  try {
    const exists = await fs.promises.access(rootPath).then(() => true).catch(() => false);
    if (!exists) return packages;

    const folders = await fs.promises.readdir(rootPath);
    const promises = folders.map(async (folder) => {
      const folderPath = path.join(rootPath, folder);
      try {
        const stats = await fs.promises.stat(folderPath);
        if (!stats.isDirectory()) return;

        if (folder.startsWith('@')) {
          // Scoped packages
          const subfolders = await fs.promises.readdir(folderPath);
          const subPromises = subfolders.map(async (subfolder) => {
            const subfolderPath = path.join(folderPath, subfolder);
            try {
              const subStats = await fs.promises.stat(subfolderPath);
              if (subStats.isDirectory()) {
                const pkg = await readPkgJsonAsync(subfolderPath, `${folder}/${subfolder}`);
                if (pkg) packages.push(pkg);
              }
            } catch (e) {}
          });
          await Promise.all(subPromises);
        } else {
          const pkg = await readPkgJsonAsync(folderPath, folder);
          if (pkg) packages.push(pkg);
        }
      } catch (e) {}
    });
    await Promise.all(promises);
  } catch (e) {
    console.error('Error scanning node_modules at', rootPath, e);
  }
  return packages;
}

async function readPkgJsonAsync(packagePath, relativeName) {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  try {
    const exists = await fs.promises.access(pkgJsonPath).then(() => true).catch(() => false);
    if (!exists) return null;

    const content = await fs.promises.readFile(pkgJsonPath, 'utf8');
    const pkg = JSON.parse(content);
    
    return {
      name: pkg.name || relativeName,
      version: pkg.version || '0.0.0',
      description: pkg.description || 'Açıklama bulunamadı.',
      author: typeof pkg.author === 'object' ? pkg.author.name : pkg.author || 'Bilinmiyor',
      homepage: pkg.homepage || '',
      bin: pkg.bin ? Object.keys(pkg.bin) : [],
      path: packagePath,
      size: -1
    };
  } catch (e) {
    return null;
  }
}

// API: Get global packages (NPM & Yarn)
app.get('/api/packages', async (req, res) => {
  await initPaths();
  const { type } = req.query;
  
  let npmPackages = [];
  let yarnPackages = [];
  let cliFiles = [];

  const promises = [];

  if (!type || type === 'npm') {
    promises.push(
      scanNodeModulesAsync(npmGlobalRoot).then(pkgs => {
        npmPackages = pkgs;
      })
    );
    // Scan CLI Commands in global prefix asynchronously
    promises.push(
      (async () => {
        try {
          const exists = await fs.promises.access(npmGlobalPrefix).then(() => true).catch(() => false);
          if (exists) {
            const files = await fs.promises.readdir(npmGlobalPrefix);
            const subPromises = files.map(async (file) => {
              const filePath = path.join(npmGlobalPrefix, file);
              try {
                const stats = await fs.promises.stat(filePath);
                if (stats.isFile() && (file.endsWith('.cmd') || file.endsWith('.ps1') || !file.includes('.'))) {
                  const baseName = file.replace(/\.(cmd|ps1)$/, '');
                  if (!cliFiles.includes(baseName)) {
                    cliFiles.push(baseName);
                  }
                }
              } catch (e) {}
            });
            await Promise.all(subPromises);
          }
        } catch (e) {
          console.error(e);
        }
      })()
    );
  }

  if (!type || type === 'yarn') {
    promises.push(
      scanNodeModulesAsync(path.join(yarnGlobalDir, 'node_modules')).then(pkgs => {
        yarnPackages = pkgs;
      })
    );
  }

  await Promise.all(promises);

  const response = {};
  if (!type || type === 'npm') {
    response.npm = {
      root: npmGlobalRoot,
      prefix: npmGlobalPrefix,
      packages: npmPackages
    };
    response.cliFiles = cliFiles;
  }
  if (!type || type === 'yarn') {
    response.yarn = {
      root: path.join(yarnGlobalDir, 'node_modules'),
      bin: yarnGlobalBin,
      packages: yarnPackages
    };
  }

  res.json(response);
});

// API: Get local packages for a project
app.post('/api/packages/local', async (req, res) => {
  const { projectPath } = req.body;
  if (!projectPath || !fs.existsSync(projectPath)) {
    return res.status(400).json({ error: 'Geçersiz veya bulunamayan proje dizini.' });
  }

  const pkgJsonPath = path.join(projectPath, 'package.json');
  const nodeModulesPath = path.join(projectPath, 'node_modules');

  let projectInfo = { name: path.basename(projectPath), version: '1.0.0', dependencies: {}, devDependencies: {} };
  
  try {
    const exists = await fs.promises.access(pkgJsonPath).then(() => true).catch(() => false);
    if (exists) {
      const content = await fs.promises.readFile(pkgJsonPath, 'utf8');
      projectInfo = JSON.parse(content);
    }
  } catch (e) {}

  const installedPackages = await scanNodeModulesAsync(nodeModulesPath);

  res.json({
    projectInfo: {
      name: projectInfo.name || path.basename(projectPath),
      version: projectInfo.version || '1.0.0',
      dependencies: projectInfo.dependencies || {},
      devDependencies: projectInfo.devDependencies || {}
    },
    packages: installedPackages,
    path: projectPath
  });
});

// API: Calculate specific package size asynchronously on-demand
app.post('/api/packages/size', async (req, res) => {
  const { packagePath } = req.body;
  if (!packagePath || !fs.existsSync(packagePath)) {
    return res.status(400).json({ error: 'Geçersiz veya bulunamayan paket dizini.' });
  }

  try {
    const size = await getDirSizeAsync(packagePath);
    res.json({ success: true, size });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Boyut hesaplanırken hata oluştu.' });
  }
});

// API: Cache Info & Clear
app.get('/api/cache', async (req, res) => {
  await initPaths();
  const npmCacheSize = await getDirSizeAsync(npmCacheDir);
  res.json({
    npmCachePath: npmCacheDir,
    npmCacheSize: npmCacheSize
  });
});

app.post('/api/cache/clear', async (req, res) => {
  try {
    await runCmd('npm cache clean --force');
    res.json({ success: true, message: 'NPM Önbelleği temizlendi.' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Önbellek temizlenirken hata oluştu.' });
  }
});

// API: System PATH Info
app.get('/api/path-info', (req, res) => {
  const pathEnv = process.env.PATH || '';
  const paths = pathEnv.split(path.delimiter).map(p => p.trim()).filter(Boolean);
  
  // Identify path items related to node, npm, yarn, appdata
  const analysedPaths = paths.map(p => {
    const lower = p.toLowerCase();
    return {
      path: p,
      exists: fs.existsSync(p),
      isNodeRelated: lower.includes('npm') || lower.includes('yarn') || lower.includes('node') || lower.includes('nvm')
    };
  });

  res.json({ paths: analysedPaths });
});

// API: Add folder to PATH
app.post('/api/path/add', async (req, res) => {
  const { folderPath } = req.body;
  if (!folderPath || !fs.existsSync(folderPath)) {
    return res.status(400).json({ error: 'Eklenecek geçerli bir klasör yolu bulunamadı.' });
  }

  try {
    // Read current USER PATH registry value using PowerShell
    const getCmd = `[Environment]::GetEnvironmentVariable("PATH", "User")`;
    const currentPath = await runCmd(`powershell -Command "${getCmd}"`);
    
    if (currentPath.split(';').includes(folderPath)) {
      return res.json({ success: true, message: 'Klasör zaten PATH içerisinde mevcut.' });
    }

    const newPath = `${currentPath};${folderPath}`;
    const setCmd = `[Environment]::SetEnvironmentVariable("PATH", "${newPath}", "User")`;
    await runCmd(`powershell -Command "${setCmd}"`);

    res.json({ success: true, message: 'Klasör Kullanıcı PATH değişkenine başarıyla eklendi. Etkin olması için terminali veya uygulamayı yeniden başlatmanız gerekebilir.' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'PATH güncellenirken hata oluştu.' });
  }
});

// SSE Helper: Run command with live log output
function runCommandSSE(cmd, cwd, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('start', { message: `Komut başlatılıyor: ${cmd}` });

  // Use shell: true directly to avoid double wrapping which buffers stdout/stderr
  const proc = spawn(cmd, [], { cwd, shell: true });

  proc.stdout.on('data', (data) => {
    const text = data.toString();
    sendEvent('log', { text, isError: false });
  });

  proc.stderr.on('data', (data) => {
    const text = data.toString();
    // Send stderr as 'log' event with isError: true to prevent client EventSource connection errors
    sendEvent('log', { text, isError: true });
  });

  proc.on('close', (code) => {
    if (code === 0) {
      sendEvent('complete', { message: 'Komut başarıyla tamamlandı.' });
    } else {
      sendEvent('failed', { message: `Komut ${code} kodu ile başarısız oldu.` });
    }
    res.end();
  });

  proc.on('error', (err) => {
    sendEvent('failed', { message: `İşlem hatası: ${err.message}` });
    res.end();
  });
}

// API Endpoint for package operations (Install / Uninstall / Reinstall) with SSE
app.get('/api/execute', (req, res) => {
  const { action, name, manager, global, path: targetPath } = req.query;
  const isGlobal = global === 'true';

  let cmd = '';
  let cwd = process.cwd();

  if (targetPath && fs.existsSync(targetPath)) {
    cwd = targetPath;
  }

  if (action === 'install') {
    if (manager === 'yarn') {
      cmd = isGlobal ? `yarn global add ${name}` : `yarn add ${name}`;
    } else {
      cmd = isGlobal ? `npm install -g ${name}` : `npm install ${name}`;
    }
  } else if (action === 'uninstall') {
    if (manager === 'yarn') {
      cmd = isGlobal ? `yarn global remove ${name}` : `yarn remove ${name}`;
    } else {
      cmd = isGlobal ? `npm uninstall -g ${name}` : `npm uninstall ${name}`;
    }
  } else if (action === 'reinstall') {
    if (manager === 'yarn') {
      cmd = isGlobal 
        ? `yarn global remove ${name} ; yarn global add ${name}` 
        : `yarn remove ${name} ; yarn add ${name}`;
    } else {
      cmd = isGlobal 
        ? `npm uninstall -g ${name} && npm install -g ${name}` 
        : `npm uninstall ${name} && npm install ${name}`;
    }
  }

  if (!cmd) {
    res.status(400).json({ error: 'Geçersiz komut parametreleri.' });
    return;
  }

  runCommandSSE(cmd, cwd, res);
});

// Start server
app.listen(port, async () => {
  console.log(`ExpPack sunucusu çalışıyor: http://localhost:${port}`);
  await initPaths();
  // Open the dashboard in browser automatically (if not running in Electron)
  if (!process.env.ELECTRON) {
    try {
      await open(`http://localhost:${port}`);
    } catch (e) {
      console.log('Tarayıcı otomatik açılamadı.');
    }
  }
});
