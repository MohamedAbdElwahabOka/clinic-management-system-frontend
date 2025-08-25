const fs = require("fs");
const path = require("path");

const exts = [".js", ".ts", ".tsx"];
const outputFile = path.join(__dirname, "lines-report.txt");

let totalLines = 0;
const linesPerExt = {};
const linesPerFile = {};

exts.forEach(ext => linesPerExt[ext] = 0);

function countLinesInDir(dir, baseDir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && file !== "node_modules") {
            countLinesInDir(fullPath, baseDir);
        } else if (stat.isFile() && exts.includes(path.extname(file))) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const lineCount = content.split(/\r\n|\r|\n/).length;
            totalLines += lineCount;
            linesPerExt[path.extname(file)] += lineCount;


            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
            linesPerFile[relativePath] = lineCount;
        }
    });
}


const projectRoot = path.join(__dirname);
countLinesInDir(projectRoot, projectRoot);


const sortedFiles = Object.entries(linesPerFile).sort((a, b) => b[1] - a[1]);


const now = new Date();
const dateTime = now.toLocaleString();


let report = `تقرير عدد الأسطر - تم إنشاؤه بتاريخ: ${dateTime}\n\n`;

report += "عدد الأسطر لكل ملف (مرتبة من الأكبر للأصغر):\n";
sortedFiles.forEach(([file, lines]) => {
    report += `${file}: ${lines} سطر\n`;
});

report += "\nعدد الأسطر لكل نوع ملف:\n";
for (const ext of exts) {
    report += `${ext}: ${linesPerExt[ext]} سطر\n`;
}

report += `\nالإجمالي: ${totalLines} سطر\n`;


fs.writeFileSync(outputFile, report, "utf-8");

console.log(`تم إنشاء التقرير في الملف: ${outputFile}`);
