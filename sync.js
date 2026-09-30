const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../DICE Refonte/src');
const webDir = path.join(__dirname, 'src');

// 1. Update home.css
let indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf8');
indexCss = indexCss.replace(/@import 'tailwindcss';/, '');
indexCss = indexCss.replace(/@theme \{([\s\S]*?)\}/, (match, p1) => {
  return `:root {${p1}}`;
});
let homeCss = fs.readFileSync(path.join(webDir, 'app/home.css'), 'utf8');
// prevent duplicating if already synced
if (!homeCss.includes('journey-diamond-spin-3d')) {
  fs.writeFileSync(path.join(webDir, 'app/home.css'), homeCss + '\n\n' + indexCss);
}

// 2. Copy Canvas & helpers
const copyHelper = (filename) => {
  const content = fs.readFileSync(path.join(srcDir, 'components', filename), 'utf8');
  let updated = content.replace(/\.\/DiamondCrystal/g, './DiamondCrystal');
  fs.writeFileSync(path.join(webDir, 'components/home', filename), updated);
};
copyHelper('DiamondCanvas.tsx');
copyHelper('DiamondCrystal.tsx');
copyHelper('ProgressionPath.tsx');
copyHelper('IntroSection.tsx');

let diamondJourneyContent = fs.readFileSync(path.join(srcDir, 'components/DiamondJourney.tsx'), 'utf8');
// fix image import
diamondJourneyContent = diamondJourneyContent.replace(/import diamondImg from '\.\.\/assets\/mission-diamond\.png'/, "const diamondImg = '/images/mission-diamond.png'");
fs.writeFileSync(path.join(webDir, 'components/home/DiamondJourney.tsx'), diamondJourneyContent);

// 3. HeroSection
let heroContent = fs.readFileSync(path.join(srcDir, 'components/Hero.tsx'), 'utf8');
heroContent = heroContent.replace(/\.\/DiamondCanvas/g, '@/components/home/DiamondCanvas');
heroContent = heroContent.replace(/\.\/ProgressionPath/g, '@/components/home/ProgressionPath');
if (fs.existsSync(path.join(webDir, 'components/layout/HeroSection.jsx'))) {
    fs.unlinkSync(path.join(webDir, 'components/layout/HeroSection.jsx'));
}
fs.writeFileSync(path.join(webDir, 'components/layout/HeroSection.tsx'), heroContent);

// 4. PanelsSection
let experiencesContent = fs.readFileSync(path.join(srcDir, 'components/Experiences.tsx'), 'utf8');
if (fs.existsSync(path.join(webDir, 'components/home/PanelsSection.jsx'))) {
    fs.unlinkSync(path.join(webDir, 'components/home/PanelsSection.jsx'));
}
fs.writeFileSync(path.join(webDir, 'components/home/PanelsSection.tsx'), experiencesContent);

// 6. WhyDiceSection
let whyDiamondContent = fs.readFileSync(path.join(srcDir, 'components/WhyDiamond.tsx'), 'utf8');
if (fs.existsSync(path.join(webDir, 'components/layout/WhyDiceSection.jsx'))) {
    fs.unlinkSync(path.join(webDir, 'components/layout/WhyDiceSection.jsx'));
}
fs.writeFileSync(path.join(webDir, 'components/layout/WhyDiceSection.tsx'), whyDiamondContent);

// 7. SpeakersSection
let expertsContent = fs.readFileSync(path.join(srcDir, 'components/Experts.tsx'), 'utf8');
if (fs.existsSync(path.join(webDir, 'components/home/SpeakersSection.jsx'))) {
    fs.unlinkSync(path.join(webDir, 'components/home/SpeakersSection.jsx'));
}
fs.writeFileSync(path.join(webDir, 'components/home/SpeakersSection.tsx'), expertsContent);

// 8. CTASection
let communityContent = fs.readFileSync(path.join(srcDir, 'components/Community.tsx'), 'utf8');
if (fs.existsSync(path.join(webDir, 'components/layout/CTASection.jsx'))) {
    fs.unlinkSync(path.join(webDir, 'components/layout/CTASection.jsx'));
}
fs.writeFileSync(path.join(webDir, 'components/layout/CTASection.tsx'), communityContent);

console.log('Sync completed successfully.');
