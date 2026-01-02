// sincronizar-final.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function repararJSONConProblemas() {
    console.log('🔧 Reparando JSON con problemas...\n');
    
    // Lista de JSON problemáticos detectados
    const jsonProblematicos = [
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockespanol.json'
    ];
    
    for (const jsonPath of jsonProblematicos) {
        const fullPath = path.join(__dirname, jsonPath);
        try {
            console.log(`Intentando reparar: ${jsonPath}`);
            
            // Leer el archivo como texto crudo
            const contenido = await fs.readFile(fullPath, 'utf8');
            
            // Mostrar primeros 200 caracteres para diagnóstico
            console.log('Primeros 200 chars:', contenido.substring(0, 200));
            
            // Intentar limpiar posibles BOM o caracteres extraños
            const contenidoLimpio = contenido
                .replace(/^\uFEFF/, '') // Remove BOM
                .replace(/\r\n/g, '\n') // Normalizar saltos de línea
                .trim();
            
            // Guardar versión limpia
            await fs.writeFile(fullPath, contenidoLimpio, 'utf8');
            console.log('✅ Limpieza básica aplicada\n');
            
        } catch (error) {
            console.log(`❌ Error con ${jsonPath}:`, error.message);
        }
    }
}

async function sincronizarCompleto() {
    console.log('🚀 INICIANDO SINCRONIZACIÓN COMPLETA\n');
    
    // 1. Primero reparar JSON problemáticos
    await repararJSONConProblemas();
    
    // 2. Leer TODOS los archivos existentes
    console.log('📁 Leyendo archivos MP3 y JSON...');
    
    const audioPath = path.join(__dirname, 'public', 'audio');
    const chordsPath = path.join(__dirname, 'public', 'chords');
    
    let mp3Files, jsonFiles;
    
    try {
        mp3Files = (await fs.readdir(audioPath))
            .filter(f => f.toLowerCase().endsWith('.mp3'))
            .map(f => ({
                nombreCompleto: f,
                nombreBase: f.replace('.mp3', '').replace('.MP3', ''),
                nombreLower: f.toLowerCase().replace('.mp3', '')
            }));
        
        jsonFiles = (await fs.readdir(chordsPath))
            .filter(f => f.toLowerCase().endsWith('.json'))
            .map(f => ({
                nombreCompleto: f,
                nombreBase: f.replace('.json', '').replace('.JSON', ''),
                nombreLower: f.toLowerCase().replace('.json', '')
            }));
    } catch (error) {
        console.error('❌ Error leyendo carpetas:', error.message);
        return;
    }
    
    // Crear Mapas para búsqueda eficiente
    const mp3Map = new Map();
    const jsonMap = new Map();
    
    mp3Files.forEach(f => {
        mp3Map.set(f.nombreLower, f.nombreCompleto);
        mp3Map.set(f.nombreBase, f.nombreCompleto);
    });
    
    jsonFiles.forEach(f => {
        jsonMap.set(f.nombreLower, f.nombreCompleto);
        jsonMap.set(f.nombreBase, f.nombreCompleto);
    });
    
    console.log(`✅ MP3 encontrados: ${mp3Files.length}`);
    console.log(`✅ JSON encontrados: ${jsonFiles.length}\n`);
    
    // 3. Lista COMPLETA de listados
    const todosLosListados = [
        // Covers por género
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasespanol.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasingles.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-discoingles.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-festivos-bso.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkespanol.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkingles.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-latinobailableespanol.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockespanol.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockingles.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-reggaeingles.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableespanol.json',
        'public/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableingles.json',
        
        // Homenajes
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-acdc.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-adams-sting-stewart.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-aerosmith.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-alejandro-lerner.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-andres-calamaro.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-beatles.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-bersuit.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-bon-jovi.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-cadillacs-pericos-kapanga.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-ccr.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-cerati-soda.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-coldplay.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-diego-torres.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-divididos.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-elton-john-georgemichael.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-enanitosverdes.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-garcia-paez-spinetta.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-green-day-offspring.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-gunsnroses.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-inxs.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-laley-mana.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-larenga-pappo-redondos-ratones.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-lenny-kravitz.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-los-pijos.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-michaeljackson.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-nirvana-foo-fighters-system.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-oasis.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-philcollins.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-queen.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-redhotchili.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-robbiewilliams.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-rolling-stones.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-roxette.json',
        'public/listados/listados-musica-homenajes/listado-musica-homenaje-u2.json'
    ];
    
    // 4. Procesar CADA listado
    let totalProcesados = 0;
    let totalCorrecciones = 0;
    let totalEliminadas = 0;
    let listadosConErrores = [];
    
    for (const listadoRelativo of todosLosListados) {
        totalProcesados++;
        const listadoPath = path.join(__dirname, listadoRelativo);
        
        // Verificar si existe
        try {
            await fs.access(listadoPath);
        } catch {
            console.log(`❌ No existe: ${listadoRelativo}`);
            listadosConErrores.push(`${listadoRelativo} (no existe)`);
            continue;
        }
        
        console.log(`${totalProcesados}. 📄 ${listadoRelativo}`);
        
        try {
            // Leer y parsear JSON
            let contenido;
            try {
                contenido = await fs.readFile(listadoPath, 'utf8');
            } catch (readError) {
                console.log(`   ❌ Error leyendo archivo: ${readError.message}`);
                listadosConErrores.push(`${listadoRelativo} (error lectura)`);
                continue;
            }
            
            // Limpiar posible BOM
            contenido = contenido.replace(/^\uFEFF/, '');
            
            let data;
            try {
                data = JSON.parse(contenido);
            } catch (parseError) {
                console.log(`   ❌ Error en JSON (posición ${parseError.position}): ${parseError.message}`);
                console.log(`   📍 Contexto: ${contenido.substring(parseError.position - 50, parseError.position + 50)}`);
                listadosConErrores.push(`${listadoRelativo} (JSON inválido)`);
                continue;
            }
            
            let correcciones = 0;
            let eliminadas = 0;
            let mantenidas = 0;
            
            // Función para procesar canciones
            function procesarCancionesArray(cancionesArray) {
                if (!Array.isArray(cancionesArray)) return cancionesArray;
                
                const resultado = [];
                
                for (const cancion of cancionesArray) {
                    if (!cancion || typeof cancion !== 'object') {
                        eliminadas++;
                        continue;
                    }
                    
                    // Extraer nombres de archivos
                    let nombreMP3 = '';
                    let nombreJSON = '';
                    
                    if (cancion.audio && typeof cancion.audio === 'string') {
                        const basename = path.basename(cancion.audio);
                        nombreMP3 = basename.replace(/\.mp3$/i, '');
                    }
                    
                    if (cancion.chords && typeof cancion.chords === 'string') {
                        const basename = path.basename(cancion.chords);
                        nombreJSON = basename.replace(/\.json$/i, '');
                    }
                    
                    // Verificar si existen (insensible a mayúsculas)
                    const mp3Lower = nombreMP3.toLowerCase();
                    const jsonLower = nombreJSON.toLowerCase();
                    
                    const tieneMP3 = mp3Map.has(mp3Lower);
                    const tieneJSON = jsonMap.has(jsonLower);
                    
                    if (tieneMP3 && tieneJSON) {
                        // ✅ AMBOS existen - MANTENER y CORREGIR
                        const cancionCorregida = { ...cancion };
                        let corrigio = false;
                        
                        // Obtener nombres correctos (con mayúsculas originales)
                        const mp3Correcto = mp3Map.get(mp3Lower);
                        const jsonCorrecto = jsonMap.get(jsonLower);
                        
                        const nombreMP3Correcto = mp3Correcto.replace('.mp3', '').replace('.MP3', '');
                        const nombreJSONCorrecto = jsonCorrecto.replace('.json', '').replace('.JSON', '');
                        
                        // Corregir URL de audio
                        const urlAudioCorrecta = `/audio/${nombreMP3Correcto}.mp3`;
                        if (cancionCorregida.audio !== urlAudioCorrecta) {
                            cancionCorregida.audio = urlAudioCorrecta;
                            corrigio = true;
                        }
                        
                        // Corregir URL de chords
                        const urlChordsCorrecta = `/chords/${nombreJSONCorrecto}.json`;
                        if (cancionCorregida.chords !== urlChordsCorrecta) {
                            cancionCorregida.chords = urlChordsCorrecta;
                            corrigio = true;
                        }
                        
                        if (corrigio) correcciones++;
                        resultado.push(cancionCorregida);
                        mantenidas++;
                    } else {
                        // ❌ FALTA alguno - ELIMINAR
                        eliminadas++;
                        if (!tieneMP3 && nombreMP3) {
                            console.log(`      🗑️  Sin MP3: ${nombreMP3}`);
                        }
                        if (!tieneJSON && nombreJSON) {
                            console.log(`      🗑️  Sin JSON: ${nombreJSON}`);
                        }
                    }
                }
                
                return resultado;
            }
            
            // Procesar según estructura del listado
            if (Array.isArray(data)) {
                // Listado es array directo
                const original = data.length;
                data = procesarCancionesArray(data);
                eliminadas = original - data.length;
            } else if (data && typeof data === 'object') {
                // Buscar propiedades que sean arrays
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        const original = data[key].length;
                        data[key] = procesarCancionesArray(data[key]);
                        eliminadas += (original - data[key].length);
                    }
                }
            }
            
            // Guardar si hubo cambios
            if (correcciones > 0 || eliminadas > 0) {
                await fs.writeFile(listadoPath, JSON.stringify(data, null, 2), 'utf8');
                console.log(`   ✅ Mantenidas: ${mantenidas}, Corregidas: ${correcciones}, Eliminadas: ${eliminadas}`);
                totalCorrecciones += correcciones;
                totalEliminadas += eliminadas;
            } else {
                console.log(`   ✓ Sin cambios (${mantenidas} canciones)`);
            }
            
        } catch (error) {
            console.log(`   💥 Error inesperado: ${error.message}`);
            listadosConErrores.push(`${listadoRelativo} (${error.message})`);
        }
    }
    
    // 5. RESUMEN FINAL
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SINCRONIZACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log(`📊 Listados procesados: ${totalProcesados}`);
    console.log(`🔧 URLs corregidas: ${totalCorrecciones}`);
    console.log(`🗑️  Canciones eliminadas: ${totalEliminadas}`);
    
    if (listadosConErrores.length > 0) {
        console.log(`\n⚠️  Listados con errores (${listadosConErrores.length}):`);
        listadosConErrores.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n✨ Todos los listados ahora están sincronizados con los archivos reales.');
    console.log('📁 Solo quedan canciones que tienen ambos archivos: MP3 + JSON');
    console.log('='.repeat(60));
}

// Ejecutar
sincronizarCompleto().catch(error => {
    console.error('💥 ERROR CRÍTICO:', error);
    process.exit(1);
});