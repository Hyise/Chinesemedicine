const fs = require('fs');
const path = require('path');

const files = [
    'd:\\中药材\\src\\pages\\sales\\index.tsx',
    'd:\\中药材\\src\\pages\\iot\\index.tsx',
    'd:\\中药材\\src\\pages\\finance\\loans.tsx',
    'd:\\中药材\\src\\pages\\finance\\scf.tsx',
    'd:\\中药材\\src\\pages\\finance\\insurance.tsx',
    'd:\\中药材\\src\\pages\\finance\\escrow.tsx',
    'd:\\中药材\\src\\pages\\multi-code\\rules\\index.tsx',
    'd:\\中药材\\src\\pages\\multi-code\\tracking\\index.tsx',
    'd:\\中药材\\src\\pages\\multi-code\\generate\\index.tsx',
];

const salesOutputFile = 'C:\\Users\\24279\\.cursor\\projects\\d\\agent-tools\\0950b78e-d529-4954-87c3-c992f373e0c1.txt';

function findAllReturns(content) {
    const lines = content.split('\n');
    const returns = [];
    let currentReturn = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Start of a return
        if (line === 'return (' || line === 'return(') {
            currentReturn = { start: i, parenCount: 0 };
        }
        
        if (currentReturn) {
            for (const char of lines[i]) {
                if (char === '(') currentReturn.parenCount++;
                if (char === ')') currentReturn.parenCount--;
            }
            
            if (currentReturn.parenCount === 0 && lines[i].trim().endsWith(');')) {
                currentReturn.end = i;
                // Find component name (look back up to 20 lines)
                let compName = 'Unknown';
                for (let j = currentReturn.start - 1; j >= 0 && j > currentReturn.start - 20; j--) {
                    const match = lines[j].match(/const\s+(\w+)\s*=\s*\(\)\s*=>/);
                    if (match) {
                        compName = match[1];
                        break;
                    }
                }
                currentReturn.component = compName;
                currentReturn.size = currentReturn.end - currentReturn.start;
                returns.push(currentReturn);
                currentReturn = null;
            }
        }
    }
    
    return returns;
}

function analyzeDivBalance(content, filename) {
    const returns = findAllReturns(content);
    
    if (returns.length === 0) {
        return { error: 'No return statements found' };
    }
    
    // Find the main component return:
    // 1. Look for a return that contains PageHeading (indicates main page)
    // 2. Otherwise, use the largest return block
    let mainReturn = returns[returns.length - 1]; // default to last (usually main)
    
    for (const ret of returns) {
        // Check if this return block contains PageHeading
        const lines = content.split('\n');
        let hasPageHeading = false;
        for (let i = ret.start; i <= ret.end; i++) {
            if (lines[i].includes('PageHeading')) {
                hasPageHeading = true;
                break;
            }
        }
        if (hasPageHeading) {
            mainReturn = ret;
            break;
        }
    }
    
    // Count divs
    const lines = content.split('\n');
    let openDivs = 0;
    let closeDivs = 0;
    const last10Lines = [];
    
    for (let i = mainReturn.start; i <= mainReturn.end; i++) {
        const line = lines[i];
        
        if (i < mainReturn.end) {
            const openCount = (line.match(/<div/g) || []).length;
            const closeCount = (line.match(/<\/div>/g) || []).length;
            openDivs += openCount;
            closeDivs += closeCount;
        }
        
        if (i >= mainReturn.end - 10) {
            last10Lines.push({ line: i + 1, content: line.trim().substring(0, 100) });
        }
    }
    
    const balance = openDivs - closeDivs;
    
    return {
        component: mainReturn.component,
        returnStart: mainReturn.start + 1,
        returnEnd: mainReturn.end + 1,
        openDivs,
        closeDivs,
        balance,
        isBalanced: balance === 0,
        last10Lines: last10Lines.slice(-10),
        allReturnsCount: returns.length
    };
}

console.log('=== JSX Return Block Div Balance Analysis ===');
console.log('(Analyzing main page component - largest return or containing PageHeading)\n');

let fileNum = 1;

if (fs.existsSync(salesOutputFile)) {
    const content = fs.readFileSync(salesOutputFile, 'utf8');
    const result = analyzeDivBalance(content, 'sales/index.tsx');
    console.log(fileNum++ + '. src\\pages\\sales\\index.tsx');
    if (result.error) {
        console.log('   Error:', result.error);
    } else {
        console.log('   Component:', result.component);
        console.log('   Lines:', result.returnStart, '->', result.returnEnd, '(found', result.allReturnsCount, 'returns total)');
        console.log('   Balance:', result.balance, result.isBalanced ? '(OK)' : '(ISSUE!)');
        if (!result.isBalanced) {
            console.log('   Open divs:', result.openDivs, '| Close divs:', result.closeDivs);
        }
        console.log('   Last 10 lines before );');
        result.last10Lines.forEach(l => console.log('   ' + l.line + ': ' + l.content));
    }
    console.log('');
}

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log('File not found: ' + file);
        continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    const shortPath = file.replace('d:\\中药材\\src\\pages\\', '');
    const result = analyzeDivBalance(content, file);
    
    console.log(fileNum++ + '. ' + shortPath);
    
    if (result.error) {
        console.log('   Error:', result.error);
    } else {
        console.log('   Component:', result.component);
        console.log('   Lines:', result.returnStart, '->', result.returnEnd, '(found', result.allReturnsCount, 'returns total)');
        console.log('   Balance:', result.balance, result.isBalanced ? '(OK)' : '(ISSUE!)');
        if (!result.isBalanced) {
            console.log('   Open divs:', result.openDivs, '| Close divs:', result.closeDivs);
        }
        console.log('   Last 10 lines before );');
        result.last10Lines.forEach(l => console.log('   ' + l.line + ': ' + l.content));
    }
    console.log('');
}
