const fs = require('fs');
let c = fs.readFileSync('src/app/home.css', 'utf8');
const target = "@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');";
if (c.includes(target)) {
    c = c.replace(target, '');
    c = target + '\n' + c;
    fs.writeFileSync('src/app/home.css', c);
    console.log('Fixed CSS import.');
} else {
    console.log('Import not found.');
}
