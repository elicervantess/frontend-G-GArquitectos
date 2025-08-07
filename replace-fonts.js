const fs = require('fs');
const path = require('path');

// Función para reemplazar en un archivo
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Reemplazar font-lorenna con font-raleway
    content = content.replace(/font-lorenna/g, 'font-raleway');
    
    // Solo escribir si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}:`, error.message);
  }
}

// Archivos a procesar
const files = [
  './src/app/page.tsx',
  './src/components/navbar.tsx'
];

console.log('🔄 Iniciando reemplazo de fuentes...');

files.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    replaceInFile(fullPath);
  } else {
    console.log(`⚠️  Archivo no encontrado: ${fullPath}`);
  }
});

console.log('✨ Reemplazo completado!');
