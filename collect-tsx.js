const fs = require('fs');
const path = require('path');

// --- الإعدادات ---
const SOURCE_DIR = __dirname; // الفولدر الحالي
const DEST_DIR_NAME = '_Exported_TSX'; // اسم الفولدر الخارجي اللي هيتحط فيه النسخ
const DEST_DIR = path.join(__dirname, DEST_DIR_NAME);

// الفولدرات اللي مش محتاجين ندور فيها
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', DEST_DIR_NAME];

// مصفوفة عشان نخزن فيها هيكل الملفات للكتابة
let structureLog = [];

// دالة لإنشاء الفولدر لو مش موجود
if (fs.existsSync(DEST_DIR)) {
    fs.rmSync(DEST_DIR, { recursive: true, force: true }); // تنظيف الفولدر القديم لو موجود
}
fs.mkdirSync(DEST_DIR);

// --- الدالة الرئيسية للبحث والنسخ ---
function scanAndCopy(currentPath, relativePath = '') {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // لو فولدر، نتأكد إنه مش في قائمة التجاهل
            if (!IGNORE_DIRS.includes(item)) {
                scanAndCopy(fullPath, itemRelativePath);
            }
        } else if (stat.isFile()) {
            // لو ملف، نتأكد إنه .tsx
            if (path.extname(item) === '.tsx') {
                copyFile(fullPath, itemRelativePath);
            }
        }
    });
}

// --- دالة نسخ الملف ---
function copyFile(sourcePath, relPath) {
    const destPath = path.join(DEST_DIR, relPath);
    const destDir = path.dirname(destPath);

    // إنشاء الفولدرات الفرعية في الوجهة لو مش موجودة
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // نسخ الملف
    fs.copyFileSync(sourcePath, destPath);

    // تسجيل الملف في الهيكل
    structureLog.push(relPath);
    console.log(`✅ Copied: ${relPath}`);
}

// --- تشغيل الاسكربت ---
console.log('🚀 Starting TSX extraction...');
scanAndCopy(SOURCE_DIR);

// --- كتابة ملف الهيكل (File Structure) ---
const structureContent = `
PROJECT TSX STRUCTURE
=====================
Generated on: ${new Date().toLocaleString()}

${structureLog.map(f => `├── ${f}`).join('\n')}

Total Files: ${structureLog.length}
`;

fs.writeFileSync(path.join(DEST_DIR, '_Structure.txt'), structureContent);

console.log('------------------------------------------------');
console.log(`✨ Done! Files are in the folder: "${DEST_DIR_NAME}"`);
console.log(`📄 Structure map saved as: "_Structure.txt"`);