#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class NextJSTechAnalyzer {
    constructor(projectPath = '.') {
        this.projectPath = path.resolve(projectPath);
        this.technologies = new Set();
        this.details = {};
    }

    // قراءة وتحليل package.json
    analyzePackageJson() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            console.log('❌ لم يتم العثور على ملف package.json');
            return;
        }

        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            // تحليل المكتبات الأساسية
            this.analyzeFrameworks(allDeps);
            this.analyzeUILibraries(allDeps);
            this.analyzeStyling(allDeps);
            this.analyzeStateManagement(allDeps);
            this.analyzeDatabase(allDeps);
            this.analyzeAuthentication(allDeps);
            this.analyzeTesting(allDeps);
            this.analyzeDeployment(allDeps);
            this.analyzeUtilities(allDeps);

            this.details.packageJson = {
                name: packageJson.name,
                version: packageJson.version,
                scripts: Object.keys(packageJson.scripts || {}),
                totalDependencies: Object.keys(allDeps).length
            };

        } catch (error) {
            console.log('❌ خطأ في قراءة package.json:', error.message);
        }
    }

    // تحليل الإطارات الأساسية
    analyzeFrameworks(deps) {
        const frameworks = {
            'next': 'Next.js',
            'react': 'React',
            'react-dom': 'React DOM',
            '@next/font': 'Next.js Fonts',
            'typescript': 'TypeScript',
            '@types/react': 'React TypeScript Types',
            '@types/node': 'Node.js TypeScript Types'
        };

        Object.keys(frameworks).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(frameworks[dep]);
            }
        });
    }

    // تحليل مكتبات واجهة المستخدم
    analyzeUILibraries(deps) {
        const uiLibs = {
            '@radix-ui': 'Radix UI',
            'shadcn': 'shadcn/ui',
            '@headlessui/react': 'Headless UI',
            'react-hook-form': 'React Hook Form',
            '@hookform/resolvers': 'React Hook Form Resolvers',
            'framer-motion': 'Framer Motion',
            'react-spring': 'React Spring',
            'lucide-react': 'Lucide Icons',
            'react-icons': 'React Icons',
            '@heroicons/react': 'Hero Icons',
            'recharts': 'Recharts',
            'react-chartjs-2': 'Chart.js for React',
            'swiper': 'Swiper',
            'react-slick': 'React Slick'
        };

        Object.keys(uiLibs).forEach(dep => {
            if (deps[dep] || this.checkForPartialMatch(deps, dep)) {
                this.technologies.add(uiLibs[dep]);
            }
        });
    }

    // تحليل مكتبات التنسيق
    analyzeStyling(deps) {
        const stylingLibs = {
            'tailwindcss': 'Tailwind CSS',
            'styled-components': 'Styled Components',
            '@emotion/react': 'Emotion',
            'sass': 'Sass/SCSS',
            'postcss': 'PostCSS',
            'autoprefixer': 'Autoprefixer',
            'clsx': 'clsx (Class Utilities)',
            'class-variance-authority': 'CVA (Class Variance Authority)',
            'tailwind-merge': 'Tailwind Merge'
        };

        Object.keys(stylingLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(stylingLibs[dep]);
            }
        });
    }

    // تحليل إدارة الحالة
    analyzeStateManagement(deps) {
        const stateLibs = {
            'redux': 'Redux',
            '@reduxjs/toolkit': 'Redux Toolkit',
            'react-redux': 'React Redux',
            'zustand': 'Zustand',
            'jotai': 'Jotai',
            'recoil': 'Recoil',
            'swr': 'SWR',
            '@tanstack/react-query': 'TanStack Query (React Query)',
            'apollo-client': 'Apollo GraphQL Client'
        };

        Object.keys(stateLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(stateLibs[dep]);
            }
        });
    }

    // تحليل قواعد البيانات
    analyzeDatabase(deps) {
        const dbLibs = {
            'prisma': 'Prisma ORM',
            '@prisma/client': 'Prisma Client',
            'mongoose': 'Mongoose (MongoDB)',
            'mongodb': 'MongoDB',
            'mysql2': 'MySQL',
            'pg': 'PostgreSQL',
            'sqlite3': 'SQLite',
            'drizzle-orm': 'Drizzle ORM',
            'kysely': 'Kysely'
        };

        Object.keys(dbLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(dbLibs[dep]);
            }
        });
    }

    // تحليل المصادقة
    analyzeAuthentication(deps) {
        const authLibs = {
            'next-auth': 'NextAuth.js',
            '@auth0/nextjs-auth0': 'Auth0',
            'firebase': 'Firebase Auth',
            'supabase': 'Supabase Auth',
            'clerk': 'Clerk',
            'jsonwebtoken': 'JWT'
        };

        Object.keys(authLibs).forEach(dep => {
            if (deps[dep] || this.checkForPartialMatch(deps, dep)) {
                this.technologies.add(authLibs[dep]);
            }
        });
    }

    // تحليل الاختبارات
    analyzeTesting(deps) {
        const testLibs = {
            'jest': 'Jest',
            '@testing-library/react': 'React Testing Library',
            'cypress': 'Cypress',
            'playwright': 'Playwright',
            'vitest': 'Vitest',
            'eslint': 'ESLint',
            'prettier': 'Prettier'
        };

        Object.keys(testLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(testLibs[dep]);
            }
        });
    }

    // تحليل النشر والتطوير
    analyzeDeployment(deps) {
        const deployLibs = {
            'vercel': 'Vercel',
            'netlify': 'Netlify',
            'docker': 'Docker'
        };

        Object.keys(deployLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(deployLibs[dep]);
            }
        });
    }

    // تحليل المكتبات المساعدة
    analyzeUtilities(deps) {
        const utilLibs = {
            'axios': 'Axios (HTTP Client)',
            'lodash': 'Lodash',
            'date-fns': 'date-fns',
            'dayjs': 'Day.js',
            'zod': 'Zod (Schema Validation)',
            'yup': 'Yup (Validation)',
            'react-hot-toast': 'React Hot Toast',
            'sonner': 'Sonner (Toast)',
            'uuid': 'UUID Generator',
            'bcryptjs': 'bcrypt.js',
            'sharp': 'Sharp (Image Processing)'
        };

        Object.keys(utilLibs).forEach(dep => {
            if (deps[dep]) {
                this.technologies.add(utilLibs[dep]);
            }
        });
    }

    // البحث عن تطابق جزئي في أسماء الحزم
    checkForPartialMatch(deps, searchTerm) {
        return Object.keys(deps).some(dep => dep.includes(searchTerm));
    }

    // تحليل ملفات التكوين
    analyzeConfigFiles() {
        const configFiles = {
            'tailwind.config.js': 'Tailwind CSS',
            'tailwind.config.ts': 'Tailwind CSS',
            'next.config.js': 'Next.js Config',
            'next.config.ts': 'Next.js Config',
            'tsconfig.json': 'TypeScript',
            '.eslintrc.json': 'ESLint',
            '.eslintrc.js': 'ESLint',
            'prettier.config.js': 'Prettier',
            '.prettierrc': 'Prettier',
            'postcss.config.js': 'PostCSS',
            'jest.config.js': 'Jest',
            'cypress.config.js': 'Cypress',
            'playwright.config.js': 'Playwright'
        };

        Object.keys(configFiles).forEach(file => {
            if (fs.existsSync(path.join(this.projectPath, file))) {
                this.technologies.add(configFiles[file]);
            }
        });
    }

    // تحليل بنية المجلدات
    analyzeProjectStructure() {
        const importantDirs = {
            'app': 'Next.js App Router',
            'pages': 'Next.js Pages Router',
            'components': 'Components Architecture',
            'lib': 'Utilities Library',
            'hooks': 'Custom React Hooks',
            'context': 'React Context',
            'store': 'State Management Store',
            'styles': 'Custom Styles',
            'public': 'Static Assets',
            'prisma': 'Prisma Database',
            '__tests__': 'Testing',
            'cypress': 'Cypress Testing',
            '.github': 'GitHub Actions/Workflows'
        };

        Object.keys(importantDirs).forEach(dir => {
            if (fs.existsSync(path.join(this.projectPath, dir))) {
                this.technologies.add(importantDirs[dir]);
            }
        });
    }

    // تحليل محتوى الملفات للبحث عن shadcn/ui
    analyzeShadcnUsage() {
        try {
            // البحث عن مجلد components/ui
            const uiPath = path.join(this.projectPath, 'components', 'ui');
            if (fs.existsSync(uiPath)) {
                this.technologies.add('shadcn/ui Components');
            }

            // البحث عن lib/utils.js أو lib/utils.ts
            const utilsPath1 = path.join(this.projectPath, 'lib', 'utils.js');
            const utilsPath2 = path.join(this.projectPath, 'lib', 'utils.ts');

            if (fs.existsSync(utilsPath1) || fs.existsSync(utilsPath2)) {
                const utilsContent = fs.readFileSync(
                    fs.existsSync(utilsPath2) ? utilsPath2 : utilsPath1,
                    'utf8'
                );

                if (utilsContent.includes('clsx') && utilsContent.includes('tailwind-merge')) {
                    this.technologies.add('shadcn/ui Utils');
                }
            }
        } catch (error) {
            // تجاهل الأخطاء
        }
    }

    // تشغيل التحليل الكامل
    analyze() {
        console.log('🔍 بدء تحليل مشروع Next.js...\n');
        console.log(`📁 مسار المشروع: ${this.projectPath}\n`);

        this.analyzePackageJson();
        this.analyzeConfigFiles();
        this.analyzeProjectStructure();
        this.analyzeShadcnUsage();

        this.generateReport();
    }

    // إنتاج التقرير النهائي
    generateReport() {
        const reportContent = this.generateReportContent();

        // طباعة التقرير في الكونسول
        console.log(reportContent);

        // حفظ التقرير في ملف
        this.saveReportToFile(reportContent);
    }

    // إنشاء محتوى التقرير
    generateReportContent() {
        let report = '📊 تقرير التقنيات المستخدمة في المشروع:\n';
        report += '='.repeat(50) + '\n';
        report += `📁 مسار المشروع: ${this.projectPath}\n`;
        report += `🕐 تاريخ التحليل: ${new Date().toLocaleString('ar-EG')}\n\n`;

        if (this.technologies.size === 0) {
            report += '❌ لم يتم العثور على أي تقنيات\n';
            return report;
        }

        // تجميع التقنيات حسب النوع
        const techArray = Array.from(this.technologies).sort();

        report += `✅ تم العثور على ${techArray.length} تقنية:\n\n`;

        techArray.forEach((tech, index) => {
            report += `${index + 1}. ${tech}\n`;
        });

        // معلومات إضافية من package.json
        if (this.details.packageJson) {
            report += '\n📋 معلومات إضافية:\n';
            report += '-'.repeat(30) + '\n';
            report += `اسم المشروع: ${this.details.packageJson.name || 'غير محدد'}\n`;
            report += `الإصدار: ${this.details.packageJson.version || 'غير محدد'}\n`;
            report += `عدد الحزم المثبتة: ${this.details.packageJson.totalDependencies}\n`;
            report += `سكريبتات متاحة: ${this.details.packageJson.scripts.join(', ')}\n`;
        }

        report += '\n🎉 تم انتهاء التحليل بنجاح!\n';
        return report;
    }

    // حفظ التقرير في ملف
    saveReportToFile(reportContent) {
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            const fileName = `tech-analysis-${timestamp}.txt`;
            const filePath = path.join(this.projectPath, fileName);

            // إزالة الرموز التعبيرية للملف النصي وتنسيق أفضل
            const cleanContent = reportContent
                .replace(/📊|🔍|📁|🕐|✅|❌|📋|🎉/g, '')
                .replace(/=+/g, '='.repeat(50))
                .replace(/-+/g, '-'.repeat(30));

            fs.writeFileSync(filePath, cleanContent, 'utf8');

            console.log(`\n💾 تم حفظ التقرير في الملف: ${fileName}`);
            console.log(`📂 المسار الكامل: ${filePath}`);

        } catch (error) {
            console.log(`❌ خطأ في حفظ الملف: ${error.message}`);
        }
    }
}

// تشغيل السكريبت
function main() {
    const projectPath = process.argv[2] || '.';
    const analyzer = new NextJSTechAnalyzer(projectPath);
    analyzer.analyze();
}

// التحقق من وجود module.exports للاستخدام كمكتبة
if (require.main === module) {
    main();
}

module.exports = NextJSTechAnalyzer;