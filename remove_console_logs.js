const fs = require('fs');
const path = require('path');

function removeConsoleLogs(directory) {
    let count = 0;
    const pattern = /^\s*console\.log\s*\(.*?\)\s*;?\s*$/gm;

    if (!fs.existsSync(directory)) return 0;

    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === 'build') continue;
        
        const filepath = path.join(directory, file);
        const stat = fs.statSync(filepath);
        
        if (stat.isDirectory()) {
            count += removeConsoleLogs(filepath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            try {
                let content = fs.readFileSync(filepath, 'utf-8');
                const matches = content.match(pattern);
                if (matches && matches.length > 0) {
                    count += matches.length;
                    content = content.replace(pattern, '');
                    fs.writeFileSync(filepath, content, 'utf-8');
                }
            } catch (e) {}
        }
    }
    return count;
}

const webCount = removeConsoleLogs(path.join(__dirname, 'web_portal'));
const backendCount = removeConsoleLogs(path.join(__dirname, 'backend'));
console.info(`Removed ${webCount + backendCount} console.log statements.`);
