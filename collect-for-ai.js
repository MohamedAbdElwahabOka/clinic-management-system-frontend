const fs = require('fs');
const path = require('path');

// --- الإعدادات ---
const SOURCE_DIR = __dirname;
const OUTPUT_FILENAME = 'FULL_PROJECT_CONTEXT.txt';
const OUTPUT_PATH = path.join(__dirname, OUTPUT_FILENAME);

// الفولدرات اللي هنتجاهلها
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.vscode'];
// الامتدادات اللي عايز تنسخها (ممكن تزود .ts أو .css لو تحب)
const TARGET_EXTS = ['.tsx'];

let filesFound = [];

// 1. دالة البحث عن الملفات وتخزين مساراتها
function scanDirectory(currentPath) {
    let items;
    try {
        items = fs.readdirSync(currentPath);
    } catch (e) {
        return;
    }

    items.forEach(item => {
        // نتجاهل ملف الإخراج نفسه عشان ميعملش لوب
        if (item === OUTPUT_FILENAME || item === 'collect-for-ai.js') return;

        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(item)) {
                scanDirectory(fullPath);
            }
        } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (TARGET_EXTS.includes(ext)) {
                // بنخزن المسار النسبي (Relative Path)
                filesFound.push(path.relative(SOURCE_DIR, fullPath));
            }
        }
    });
}

// 2. تشغيل البحث
console.log('🔍 Scanning project files...');
scanDirectory(SOURCE_DIR);

if (filesFound.length === 0) {
    console.log('⚠️ No .tsx files found! Check your folder or extensions.');
} else {
    // 3. كتابة الملف النهائي
    console.log(`📝 Found ${filesFound.length} files. Generating context file...`);

    // مسح الملف القديم لو موجود وإنشاء جديد
    fs.writeFileSync(OUTPUT_PATH, '');

    // (أ) كتابة مقدمة وهيكل المشروع
    const header = `
PROJECT CONTEXT FOR AI ASSISTANT
================================
Total Files: ${filesFound.length}
Date: ${new Date().toLocaleString()}

FILE STRUCTURE:
---------------
${filesFound.map(f => `├── ${f}`).join('\n')}

================================
START OF CODE
================================
`;
    fs.appendFileSync(OUTPUT_PATH, header);

    // (ب) كتابة محتوى كل ملف
    filesFound.forEach(fileRelPath => {
        const fullPath = path.join(SOURCE_DIR, fileRelPath);
        const content = fs.readFileSync(fullPath, 'utf8');

        const fileSection = `

------------------------------------------------------------
FILE: ${fileRelPath}
------------------------------------------------------------
${content}
`;
        fs.appendFileSync(OUTPUT_PATH, fileSection);
        console.log(`✅ Added: ${fileRelPath}`);
    });

    console.log('------------------------------------------------');
    console.log(`✨ DONE! The file is ready at:`);
    console.log(`👉 ${OUTPUT_FILENAME}`);
}