const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(dir);

const replacements = {
    'coral': 'primary',
    'blue': 'secondary',
    'lime': 'accent',
    'purple': 'highlight'
};

const tailwindPrefixes = [
    'accent' // missed this one
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const prefix of tailwindPrefixes) {
        for (const [oldColor, newColor] of Object.entries(replacements)) {
            const regexStr = '(' + prefix + ')-' + oldColor + '(?![a-zA-Z])';
            const re = new RegExp(regexStr, 'g');
            content = content.replace(re, (match, p1) => {
                return p1 + '-' + newColor;
            });
        }
    }
    
    // Replace standalone string literals and keys for these colors in TS/TSX
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        for (const [oldColor, newColor] of Object.entries(replacements)) {
            // Match oldColor: (object key) or "oldColor" or 'oldColor'
            
            // Object key coral: -> primary:
            const reKey = new RegExp('\\\\b' + oldColor + '\\\\s*:', 'g');
            content = content.replace(reKey, newColor + ':');
            
            // Strings "coral", 'coral' -> "primary", 'primary'
            const reStr1 = new RegExp('"' + oldColor + '"', 'g');
            content = content.replace(reStr1, '"' + newColor + '"');
            
            const reStr2 = new RegExp("'" + oldColor + "'", 'g');
            content = content.replace(reStr2, "'" + newColor + "'");
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
