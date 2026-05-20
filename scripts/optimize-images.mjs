import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const TARGETS = [
    'public/projects/cashify',
    'public/projects/nox-connection',
    'public/projects/smk-almusyaffa',
    'public/projects/uygur-mutfagi',
];

const MAX_WIDTH = 1920;
const QUALITY = 82;

async function optimizeDir(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

        const fullPath = path.join(dir, file);
        const base = path.basename(file, ext);
        const outPath = path.join(dir, `${base}.webp`);

        const srcStat = await fs.stat(fullPath);

        await sharp(fullPath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(outPath);

        const outStat = await fs.stat(outPath);
        const saved = (1 - outStat.size / srcStat.size) * 100;
        console.log(`${fullPath}  ${(srcStat.size / 1024).toFixed(0)}KB -> ${(outStat.size / 1024).toFixed(0)}KB  (-${saved.toFixed(1)}%)`);

        // remove original
        await fs.unlink(fullPath);
    }
}

for (const dir of TARGETS) {
    console.log(`\n== ${dir} ==`);
    await optimizeDir(dir);
}
console.log('\nDone.');
