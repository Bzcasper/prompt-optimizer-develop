// 预加载环境变量脚本 (CommonJS版本)
// 这个脚本会在 Node.js 启动时通过 -r 参数预加载
// 确保环境变量在任何模块导入之前就被加载到 process.env 中

const { config } = require('dotenv');
const { resolve } = require('path');

// Determine if running from global installation
const isGlobal = !__dirname.includes('node_modules') || __dirname.includes('global') || __dirname.includes('.npm-global');

const paths = [];

// 1. Current working directory (most important for global CLI)
paths.push(
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '.env')
);

// 2. If running from project context (not global), check project-relative paths
if (!isGlobal) {
  // Project root directory (from mcp-server directory向上一级)
  paths.push(
    resolve(process.cwd(), '../.env.local'),
    resolve(process.cwd(), '../.env')
  );
  
  // From mcp-server directory向上查找
  paths.push(
    resolve(__dirname, '../.env.local'),
    resolve(__dirname, '../.env'),
    resolve(__dirname, '../../.env.local'),
    resolve(__dirname, '../../.env')
  );
} else {
  // 3. For global installation, check user's home directory
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (homeDir) {
    paths.push(
      resolve(homeDir, '.prompt-optimizer.env'),
      resolve(homeDir, '.prompt-optimizer.env.local'),
      resolve(homeDir, '.config', 'prompt-optimizer', '.env'),
      resolve(homeDir, '.config', 'prompt-optimizer', '.env.local')
    );
  }
  
  // 4. Check common global config locations
  if (process.platform === 'win32') {
    paths.push(
      resolve(process.env.APPDATA || '', 'prompt-optimizer', '.env'),
      resolve(process.env.APPDATA || '', 'prompt-optimizer', '.env.local')
    );
  } else {
    paths.push(
      resolve(process.env.HOME || '', '.config', 'prompt-optimizer', '.env'),
      resolve(process.env.HOME || '', '.config', 'prompt-optimizer', '.env.local'),
      resolve('/etc', 'prompt-optimizer', '.env')
    );
  }
}

// 静默加载环境变量
paths.forEach(path => {
  try {
    config({ path });
  } catch (error) {
    // 忽略文件不存在的错误
  }
});

const envSource = isGlobal ? 'global installation' : 'local project';
console.log(`Environment variables loaded for MCP server (${envSource}, CommonJS)`);
