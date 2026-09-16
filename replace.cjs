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
    'bg', 'text', 'border', 'from', 'to', 'via', 'ring', 'shadow', 'fill', 'stroke', 'divide', 'outline', '--color', 'decoration'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const prefix of tailwindPrefixes) {
        for (const [oldColor, newColor] of Object.entries(replacements)) {
            // Match exactly: prefix-oldColor followed by non-word char (like space, quote, slash) or end of string
            // but JS \b works nicely. 
            // Also need to support prefix-oldColor-hover, prefix-oldColor-light, prefix-oldColor-hover/20
            
            // Just replace prefix-oldColor with prefix-newColor
            // Example: text-coral -> text-primary
            // We just need to make sure we're matching the whole prefix.
            // E.g. we don't want to replace some-other-bg-coral if we are looking for bg-coral?
            // Actually, any -coral is likely the color. Let's just match prefix-color
            
            const regexStr = '(' + prefix + ')-' + oldColor + '(?![a-zA-Z])';
            const re = new RegExp(regexStr, 'g');
            content = content.replace(re, (match, p1) => {
                return p1 + '-' + newColor;
            });
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
