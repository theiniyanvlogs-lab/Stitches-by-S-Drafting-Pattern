// Global Variables
let currentStyle = 'basic';
let calculatedMeasurements = {};
let generatedSVGContent = '';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ App initialized successfully');
    
    initializeStyleButtons();
    initializeGenerateButton();
    initializeActionButtons();
});

function initializeStyleButtons() {
    const styleButtons = document.querySelectorAll('.style-btn');
    console.log('🔍 Found style buttons:', styleButtons.length);
    
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            styleButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#333';
            });
            
            // Add active to clicked
            this.classList.add('active');
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.color = 'white';
            
            currentStyle = this.dataset.style;
            console.log('🎨 Style changed to:', currentStyle);
        });
    });
}

function initializeGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Generate Pattern clicked - Style:', currentStyle);
            generatePattern();
        });
    } else {
        console.error('❌ Generate button not found!');
    }
}

function initializeActionButtons() {
    const downloadBtn = document.getElementById('downloadSvg');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadSVG();
        });
    }
    
    const printBtn = document.getElementById('printPattern');
    if (printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            printPattern();
        });
    }
}

function generatePattern() {
    console.log('🚀 Generating pattern for style:', currentStyle);
    
    try {
        const blouseSize = parseFloat(document.getElementById('blouseSize').value);
        const blouseLength = parseFloat(document.getElementById('blouseLength').value);
        const chestSize = parseFloat(document.getElementById('chestSize').value);
        const shoulderSize = parseFloat(document.getElementById('shoulderSize').value);
        const armRound = parseFloat(document.getElementById('armRound').value);
        const neckRound = parseFloat(document.getElementById('neckRound').value);
        const backNeckLength = parseFloat(document.getElementById('backNeckLength').value);
        const waistSize = parseFloat(document.getElementById('waistSize').value);

        if (!blouseSize || !blouseLength || !chestSize || !shoulderSize || 
            !armRound || !neckRound || !backNeckLength || !waistSize) {
            alert('⚠️ Please fill in ALL measurement fields!');
            return;
        }

        // Calculate measurements
        calculatedMeasurements = {
            blouseSize,
            blouseLength,
            chestSize,
            shoulderSize,
            armRound,
            neckRound,
            backNeckLength,
            waistSize,
            chestQuarter: chestSize / 4,
            shoulderHalf: shoulderSize / 2,
            armRoundHalf: armRound / 2,
            neckQuarter: neckRound / 4,
            waistQuarter: waistSize / 4,
            // Derived
            neckLoose: (neckRound / 4) + 0.5,
            neckDepth: backNeckLength,
            armholeDepth: (armRound / 2) + 1,
            totalWidth: (chestSize / 4) + 4,
            totalLength: blouseLength + 1
        };

        console.log('📐 Measurements:', calculatedMeasurements);

        // Show pattern section
        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
        }

        // Generate style-specific pattern
        generateStyleSpecificPattern();
        displayMeasurementsTable();
        displayInstructions();

        // Scroll to pattern
        setTimeout(() => {
            if (patternSection) {
                patternSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        
        console.log('✅ Pattern generated successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    }
}

function generateStyleSpecificPattern() {
    const m = calculatedMeasurements;
    const scale = 30; // pixels per inch
    
    // Base dimensions
    const chestW = m.chestQuarter;
    const totalW = m.totalWidth;
    const totalH = m.totalLength;
    
    // SVG canvas
    const padding = 120;
    const svgWidth = (totalW * scale) + (padding * 2) + 50;
    const svgHeight = (totalH * scale) + (padding * 2) + 100;
    
    const ox = padding;
    const oy = padding + 30;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}" 
     height="${svgHeight}" 
     viewBox="0 0 ${svgWidth} ${svgHeight}">
    
    <rect width="100%" height="100%" fill="#ffffff"/>
    
    <text x="${svgWidth/2}" y="30" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">
        ${m.blouseSize} SIZE BLOUSE - ${getStyleName(currentStyle)}
    </text>
    <text x="${svgWidth/2}" y="50" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="12" fill="#666">
        Haseena Fashion World
    </text>
    
    <!-- Grid -->
    ${createGrid(ox, oy, totalW * scale, totalH * scale, scale)}
    
    <!-- Style-specific pattern -->
    ${getStylePattern(currentStyle, ox, oy, m, scale)}
    
    <!-- Measurements -->
    ${getStyleAnnotations(currentStyle, ox, oy, m, scale)}
    
</svg>`;

    generatedSVGContent = svgContent;
    window.generatedSVG = svgContent;
    
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svgContent;
        console.log('✅ SVG inserted');
    }
}

function getStyleName(style) {
    const names = {
        basic: 'BASIC BACK',
        boat: 'BOAT NECK',
        pot: 'POT NECK DESIGN',
        katori: 'KATORI CUT',
        temple: 'TEMPLE NECK',
        cutwork: 'CUT WORK DESIGN'
    };
    return names[style] || 'BASIC BACK';
}

function getStylePattern(style, ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalW = m.totalWidth * scale;
    const totalH = m.totalLength * scale;
    
    switch(style) {
        case 'basic':
            return generateBasicPattern(ox, oy, m, scale);
            
        case 'pot':
            return generatePotPattern(ox, oy, m, scale);
            
        case 'boat':
            return generateBoatPattern(ox, oy, m, scale);
            
        case 'katori':
            return generateKatoriPattern(ox, oy, m, scale);
            
        case 'temple':
            return generateTemplePattern(ox, oy, m, scale);
            
        case 'cutwork':
            return generateCutworkPattern(ox, oy, m, scale);
            
        default:
            return generateBasicPattern(ox, oy, m, scale);
    }
}

function generateBasicPattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    
    return `
        <!-- Main rectangle -->
        <rect x="${ox}" y="${oy}" width="${chestW}" height="${totalH}" 
              fill="#fafafa" stroke="#333" stroke-width="2"/>
        
        <!-- Neck curve -->
        <path d="M ${ox} ${oy} 
                 Q ${ox + neckW * 0.5} ${oy} 
                   ${ox + neckW} ${oy + neckD * 0.3}
                 Q ${ox + neckW} ${oy + neckD * 0.7}
                   ${ox} ${oy + neckD}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Shoulder line -->
        <line x1="${ox}" y1="${oy}" x2="${ox + shoulderW}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Armhole curve -->
        <path d="M ${ox + shoulderW} ${oy}
                 Q ${ox + shoulderW + 20} ${oy + armholeD * 0.4}
                   ${ox + chestW} ${oy + armholeD}"
              fill="none" stroke="#2196f3" stroke-width="2.5"/>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
        
        <!-- Hem -->
        <line x1="${ox}" y1="${oy + totalH}" x2="${ox + chestW}" y2="${oy + totalH}" 
              stroke="#333" stroke-width="2"/>
    `;
}

function generatePotPattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalW = m.totalWidth * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const neckBox = 3.5 * scale;
    const neckPot = (m.backNeckLength + 0.5) * scale;
    const neckDeep = (m.backNeckLength + 4) * scale;
    const remainShoulder = (m.shoulderSize / 2 - 4) * scale;
    const armBox = 7 * scale;
    const armCurve = (m.armRound / 2 + 2.5) * scale;
    
    return `
        <!-- Outer rectangle -->
        <rect x="${ox}" y="${oy}" width="${totalW}" height="${totalH}" 
              fill="none" stroke="#333" stroke-width="2"/>
        
        <!-- Inner rectangle (chest area) -->
        <rect x="${ox}" y="${oy}" width="${chestW}" height="${totalH}" 
              fill="#fafafa" stroke="#333" stroke-width="1.5"/>
        
        <!-- Neck box -->
        <rect x="${ox}" y="${oy}" width="${neckW}" height="${neckBox}" 
              fill="none" stroke="#e91e63" stroke-width="2"/>
        
        <!-- Pot neck curve -->
        <path d="M ${ox} ${oy + neckBox}
                 Q ${ox + neckW} ${oy + neckBox}
                   ${ox + neckW} ${oy + neckPot}
                 Q ${ox + neckW} ${oy + neckDeep * 0.9}
                   ${ox} ${oy + neckDeep}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Horizontal line at neck box -->
        <line x1="${ox}" y1="${oy + neckBox}" x2="${ox + neckW}" y2="${oy + neckBox}" 
              stroke="#e91e63" stroke-width="1" stroke-dasharray="3,2"/>
        
        <!-- Vertical line at neck width -->
        <line x1="${ox + neckW}" y1="${oy}" x2="${ox + neckW}" y2="${oy + neckBox}" 
              stroke="#e91e63" stroke-width="1"/>
        
        <!-- Shoulder -->
        <line x1="${ox + neckW}" y1="${oy}" 
              x2="${ox + chestW - remainShoulder}" y2="${oy}" 
              stroke="#333" stroke-width="2"/>
        
        <!-- Armhole box -->
        <rect x="${ox + chestW}" y="${oy}" 
              width="${remainShoulder}" height="${armBox}" 
              fill="none" stroke="#2196f3" stroke-width="1.5" stroke-dasharray="3,2"/>
        
        <!-- Armhole curve -->
        <path d="M ${ox + chestW - remainShoulder} ${oy}
                 Q ${ox + chestW} ${oy + armBox * 0.5}
                   ${ox + chestW} ${oy + armBox}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Extended arm curve -->
        <path d="M ${ox + chestW} ${oy + armBox}
                 Q ${ox + chestW + 10} ${oy + armCurve}
                   ${ox + chestW} ${oy + armCurve}"
              fill="none" stroke="#e91e63" stroke-width="2" stroke-dasharray="3,2"/>
        
        <!-- Side seam -->
        <line x1="${ox + chestW}" y1="${oy + armBox}" 
              x2="${ox + chestW}" y2="${oy + totalH}" 
              stroke="#333" stroke-width="2"/>
        
        <!-- Bottom -->
        <line x1="${ox}" y1="${oy + totalH}" 
              x2="${ox + totalW}" y2="${oy + totalH}" 
              stroke="#333" stroke-width="2"/>
        
        <!-- Seam allowance (shaded) -->
        <rect x="${ox + totalW - 2 * scale}" y="${oy + armBox}" 
              width="${2 * scale}" height="${totalH - armBox}" 
              fill="#e0e0e0"/>
        
        <!-- Hatching for seam allowance -->
        ${createHatching(ox + totalW - 2 * scale, oy + armBox, 2 * scale, totalH - armBox)}
        
        <!-- Center back line -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
    `;
}

function generateBoatPattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    
    return `
        <!-- Main rectangle -->
        <rect x="${ox}" y="${oy}" width="${chestW}" height="${totalH}" 
              fill="#fafafa" stroke="#333" stroke-width="2"/>
        
        <!-- Boat neck - wide shallow curve -->
        <path d="M ${ox} ${oy}
                 Q ${ox + chestW * 0.25} ${oy + neckW * 0.3}
                   ${ox + chestW * 0.5} ${oy + neckW * 0.4}
                 Q ${ox + chestW * 0.75} ${oy + neckW * 0.3}
                   ${ox + chestW} ${oy}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Scallop details for boat neck -->
        <path d="M ${ox + chestW * 0.2} ${oy + neckW * 0.2}
                 Q ${ox + chestW * 0.25} ${oy + neckW * 0.35}
                   ${ox + chestW * 0.3} ${oy + neckW * 0.2}"
              fill="none" stroke="#e91e63" stroke-width="1.5"/>
        <path d="M ${ox + chestW * 0.7} ${oy + neckW * 0.2}
                 Q ${ox + chestW * 0.75} ${oy + neckW * 0.35}
                   ${ox + chestW * 0.8} ${oy + neckW * 0.2}"
              fill="none" stroke="#e91e63" stroke-width="1.5"/>
        
        <!-- Shoulder -->
        <line x1="${ox}" y1="${oy}" x2="${ox + shoulderW}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Armhole -->
        <path d="M ${ox + shoulderW} ${oy}
                 Q ${ox + shoulderW + 20} ${oy + armholeD * 0.4}
                   ${ox + chestW} ${oy + armholeD}"
              fill="none" stroke="#2196f3" stroke-width="2.5"/>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
        
        <!-- Hem -->
        <line x1="${ox}" y1="${oy + totalH}" x2="${ox + chestW}" y2="${oy + totalH}" 
              stroke="#333" stroke-width="2"/>
    `;
}

function generateKatoriPattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = ((m.chestSize - m.waistSize) / 8) * scale;
    const katoriStart = totalH * 0.4;
    
    return `
        <!-- Katori shape with fitted waist -->
        <path d="M ${ox} ${oy}
                 L ${ox + chestW} ${oy}
                 L ${ox + chestW} ${oy + katoriStart}
                 Q ${ox + chestW - 15} ${oy + totalH * 0.6}
                   ${ox + waistW - waistRed} ${oy + totalH}
                 L ${ox} ${oy + totalH}
                 Z"
              fill="#fafafa" stroke="#333" stroke-width="2"/>
        
        <!-- Neck curve -->
        <path d="M ${ox} ${oy}
                 Q ${ox + neckW} ${oy}
                   ${ox + neckW} ${oy + neckD * 0.3}
                 Q ${ox + neckW} ${oy + neckD * 0.7}
                   ${ox} ${oy + neckD}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Katori side curve line -->
        <path d="M ${ox + chestW} ${oy + katoriStart}
                 Q ${ox + chestW - 15} ${oy + totalH * 0.6}
                   ${ox + waistW - waistRed} ${oy + totalH}"
              fill="none" stroke="#e91e63" stroke-width="2"/>
        
        <!-- Waist line -->
        <line x1="${ox}" y1="${oy + totalH * 0.7}" 
              x2="${ox + waistW - waistRed}" y2="${oy + totalH * 0.7}" 
              stroke="#4caf50" stroke-width="1.5" stroke-dasharray="3,2"/>
        
        <!-- Shoulder -->
        <line x1="${ox}" y1="${oy}" x2="${ox + shoulderW}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Armhole -->
        <path d="M ${ox + shoulderW} ${oy}
                 Q ${ox + shoulderW + 20} ${oy + armholeD * 0.4}
                   ${ox + chestW} ${oy + armholeD}"
              fill="none" stroke="#2196f3" stroke-width="2.5"/>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
        
        <!-- Belt/waist band -->
        <rect x="${ox}" y="${oy + totalH - 2.5 * scale}" 
              width="${waistW - waistRed}" height="${2.5 * scale}" 
              fill="none" stroke="#ff9800" stroke-width="2"/>
    `;
}

function generateTemplePattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const boxLength = (m.backNeckLength + 3) * scale;
    
    return `
        <!-- Main rectangle -->
        <rect x="${ox}" y="${oy}" width="${chestW}" height="${totalH}" 
              fill="#fafafa" stroke="#333" stroke-width="2"/>
        
        <!-- Temple/Jagged neck design -->
        <path d="M ${ox} ${oy}
                 L ${ox + neckW * 0.3} ${oy - 10}
                 L ${ox + neckW * 0.6} ${oy}
                 L ${ox + neckW} ${oy - 15}
                 L ${ox + neckW} ${oy + neckD}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Temple scallops at bottom -->
        ${createTempleScallops(ox, oy + totalH - 2 * scale, chestW, scale)}
        
        <!-- Box design at bottom -->
        <rect x="${ox}" y="${oy + totalH - boxLength}" 
              width="${chestW}" height="${boxLength}" 
              fill="none" stroke="#ff9800" stroke-width="2"/>
        
        <!-- Box decorative lines -->
        <line x1="${ox}" y1="${oy + totalH - boxLength * 0.5}" 
              x2="${ox + chestW}" y2="${oy + totalH - boxLength * 0.5}" 
              stroke="#ff9800" stroke-width="1" stroke-dasharray="5,3"/>
        
        <!-- Shoulder -->
        <line x1="${ox}" y1="${oy}" x2="${ox + shoulderW}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Armhole -->
        <path d="M ${ox + shoulderW} ${oy}
                 Q ${ox + shoulderW + 20} ${oy + armholeD * 0.4}
                   ${ox + chestW} ${oy + armholeD}"
              fill="none" stroke="#2196f3" stroke-width="2.5"/>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
    `;
}

function generateCutworkPattern(ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalH = m.totalLength * scale;
    const neckW = m.neckLoose * scale;
    const neckD = (m.backNeckLength + 2) * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const scallopCount = 6;
    const scallopDepth = 0.5 * scale;
    
    return `
        <!-- Main rectangle -->
        <rect x="${ox}" y="${oy}" width="${chestW}" height="${totalH}" 
              fill="#fafafa" stroke="#333" stroke-width="2"/>
        
        <!-- Deep curved neck -->
        <path d="M ${ox} ${oy}
                 Q ${ox + neckW} ${oy}
                   ${ox + neckW} ${oy + neckD * 0.3}
                 Q ${ox + neckW} ${oy + neckD * 0.7}
                   ${ox} ${oy + neckD}"
              fill="none" stroke="#e91e63" stroke-width="2.5"/>
        
        <!-- Scallop cuts at bottom -->
        ${createScallopCuts(ox, oy + totalH - scallopDepth, chestW, scallopCount, scallopDepth)}
        
        <!-- Side scallop cuts -->
        ${createSideScallops(ox, oy + totalH - armholeD, armholeD, 5, scallopDepth)}
        
        <!-- Shoulder -->
        <line x1="${ox}" y1="${oy}" x2="${ox + shoulderW}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Armhole -->
        <path d="M ${ox + shoulderW} ${oy}
                 Q ${ox + shoulderW + 20} ${oy + armholeD * 0.4}
                   ${ox + chestW} ${oy + armholeD}"
              fill="none" stroke="#2196f3" stroke-width="2.5"/>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH}" 
              stroke="#999" stroke-width="1.5" stroke-dasharray="4,2"/>
    `;
}

function createTempleScallops(ox, oy, width, scale) {
    let scallops = '';
    const count = 5;
    const scallopW = width / count;
    
    for (let i = 0; i < count; i++) {
        const x = ox + i * scallopW;
        scallops += `M ${x} ${oy} 
                     Q ${x + scallopW * 0.25} ${oy - 8} 
                       ${x + scallopW * 0.5} ${oy} 
                     Q ${x + scallopW * 0.75} ${oy - 8} 
                       ${x + scallopW} ${oy} `;
    }
    
    return `<path d="${scallops}" fill="none" stroke="#e91e63" stroke-width="2"/>`;
}

function createScallopCuts(ox, oy, width, count, depth) {
    let scallops = '';
    const scallopW = width / count;
    
    for (let i = 0; i < count; i++) {
        const x = ox + i * scallopW;
        scallops += `M ${x} ${oy} 
                     Q ${x + scallopW * 0.5} ${oy - depth} 
                       ${x + scallopW} ${oy} `;
    }
    
    return `<path d="${scallops}" fill="none" stroke="#e91e63" stroke-width="2"/>`;
}

function createSideScallops(ox, oy, height, count, depth) {
    let scallops = '';
    const scallopH = height / count;
    
    for (let i = 0; i < count; i++) {
        const y = oy + i * scallopH;
        scallops += `M ${ox} ${y} 
                     Q ${ox - depth} ${y + scallopH * 0.5} 
                       ${ox} ${y + scallopH} `;
    }
    
    return `<path d="${scallops}" fill="none" stroke="#e91e63" stroke-width="2"/>`;
}

function getStyleAnnotations(style, ox, oy, m, scale) {
    const chestW = m.chestQuarter * scale;
    const totalW = m.totalWidth * scale;
    const totalH = m.totalLength * scale;
    
    let annotations = '';
    
    // Common measurements
    annotations += `
        <!-- Chest -->
        <text x="${ox + chestW / 2}" y="${oy - 10}" text-anchor="middle" 
              font-family="Arial" font-size="13" fill="#4caf50" font-weight="bold">
            Chest: ${m.chestQuarter.toFixed(2)}"
        </text>
        
        <!-- Length -->
        <text x="${ox - 15}" y="${oy + totalH / 2}" text-anchor="middle" 
              font-family="Arial" font-size="13" fill="#2196f3" font-weight="bold"
              transform="rotate(-90 ${ox - 15} ${oy + totalH / 2})">
            Length: ${m.blouseLength}"
        </text>
    `;
    
    // Style-specific annotations
    if (style === 'pot') {
        const neckW = m.neckLoose * scale;
        const neckBox = 3.5 * scale;
        const neckPot = (m.backNeckLength + 0.5) * scale;
        const remainShoulder = (m.shoulderSize / 2 - 4) * scale;
        const armBox = 7 * scale;
        const armCurve = (m.armRound / 2 + 2.5) * scale;
        
        annotations += `
            <!-- Neck measurements -->
            <text x="${ox + neckW / 2}" y="${oy - 25}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#e91e63" font-weight="bold">
                ${m.neckLoose}"
            </text>
            <text x="${ox + neckW + remainShoulder / 2}" y="${oy - 25}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#e91e63" font-weight="bold">
                ${((m.shoulderSize / 2) - 4).toFixed(1)}"
            </text>
            
            <!-- Side measurements -->
            <text x="${ox - 25}" y="${oy + neckBox / 2}" text-anchor="middle" 
                  font-family="Arial" font-size="11" fill="#e91e63"
                  transform="rotate(-90 ${ox - 25} ${oy + neckBox / 2})">
                3½"
            </text>
            <text x="${ox - 25}" y="${oy + neckBox + (m.backNeckLength + 0.5 - 3.5) * scale / 2}" text-anchor="middle" 
                  font-family="Arial" font-size="11" fill="#e91e63"
                  transform="rotate(-90 ${ox - 25} ${oy + neckBox + (m.backNeckLength + 0.5 - 3.5) * scale / 2})">
                ${m.backNeckLength}"
            </text>
            <text x="${ox - 25}" y="${oy + (m.backNeckLength + 4) * scale + (m.totalLength - (m.backNeckLength + 4)) * scale / 2}" text-anchor="middle" 
                  font-family="Arial" font-size="11" fill="#333"
                  transform="rotate(-90 ${ox - 25} ${oy + (m.backNeckLength + 4) * scale + (m.totalLength - (m.backNeckLength + 4)) * scale / 2})">
                ${(m.totalLength - (m.backNeckLength + 4)).toFixed(1)}"
            </text>
            
            <!-- Arm measurements -->
            <text x="${ox + chestW + 15}" y="${oy + armBox / 2}" text-anchor="start" 
                  font-family="Arial" font-size="12" fill="#2196f3" font-weight="bold">
                7"
            </text>
            <text x="${ox + chestW + 15}" y="${oy + armBox + (armCurve - 7) * scale / 2}" text-anchor="start" 
                  font-family="Arial" font-size="12" fill="#e91e63" font-weight="bold">
                ${((m.armRound / 2) + 2.5).toFixed(1)}"
            </text>
            
            <!-- Chest label -->
            <text x="${ox + chestW / 2}" y="${oy + (m.backNeckLength + 4) * scale + 25}" text-anchor="middle" 
                  font-family="Arial" font-size="14" fill="#4caf50" font-weight="bold">
                ${m.chestQuarter.toFixed(1)}"
            </text>
            <text x="${ox + chestW / 2}" y="${oy + (m.backNeckLength + 4) * scale + 42}" text-anchor="middle" 
                  font-family="Arial" font-size="11" fill="#666">
                chest
            </text>
            
            <!-- Bottom width -->
            <text x="${ox + totalW / 2}" y="${oy + totalH + 25}" text-anchor="middle" 
                  font-family="Arial" font-size="13" fill="#333" font-weight="bold">
                ${m.totalWidth.toFixed(1)}"
            </text>
        `;
    } else if (style === 'temple') {
        annotations += `
            <!-- Neck -->
            <text x="${ox + m.neckLoose * scale / 2}" y="${oy - 20}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#e91e63" font-weight="bold">
                ${m.neckLoose.toFixed(1)}"
            </text>
            
            <!-- Box -->
            <text x="${ox + chestW / 2}" y="${oy + totalH - (m.backNeckLength + 3) * scale / 2}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#ff9800" font-weight="bold">
                ${(m.backNeckLength + 3).toFixed(1)}"
            </text>
        `;
    } else if (style === 'katori') {
        const waistW = m.waistQuarter * scale;
        const waistRed = ((m.chestSize - m.waistSize) / 8) * scale;
        
        annotations += `
            <!-- Waist -->
            <text x="${ox + (waistW - waistRed) / 2}" y="${oy + totalH * 0.7 - 10}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#4caf50" font-weight="bold">
                Waist: ${(m.waistSize / 4).toFixed(2)}"
            </text>
            
            <!-- Katori label -->
            <text x="${ox + chestW + 20}" y="${oy + totalH * 0.6}" text-anchor="start" 
                  font-family="Arial" font-size="11" fill="#e91e63">
                Katori Curve
            </text>
        `;
    } else {
        // Basic, Boat, Cutwork
        annotations += `
            <!-- Neck -->
            <text x="${ox + m.neckLoose * scale / 2}" y="${oy - 20}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#e91e63" font-weight="bold">
                Neck: ${m.neckLoose.toFixed(2)}"
            </text>
            
            <!-- Shoulder -->
            <text x="${ox + m.shoulderHalf * scale / 2}" y="${oy + 20}" text-anchor="middle" 
                  font-family="Arial" font-size="12" fill="#333" font-weight="bold">
                Shoulder: ${m.shoulderHalf.toFixed(2)}"
            </text>
            
            <!-- Armhole -->
            <text x="${ox + chestW + 15}" y="${oy + m.armholeDepth * scale}" text-anchor="start" 
                  font-family="Arial" font-size="12" fill="#2196f3" font-weight="bold">
                Armhole: ${m.armholeDepth.toFixed(1)}"
            </text>
        `;
    }
    
    return annotations;
}

function createGrid(ox, oy, width, height, spacing) {
    let grid = '';
    for (let x = ox; x <= ox + width; x += spacing) {
        grid += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + height}" 
                     stroke="#f5f5f5" stroke-width="0.5"/>`;
    }
    for (let y = oy; y <= oy + height; y += spacing) {
        grid += `<line x1="${ox}" y1="${y}" x2="${ox + width}" y2="${y}" 
                     stroke="#f5f5f5" stroke-width="0.5"/>`;
    }
    return grid;
}

function createHatching(x, y, width, height) {
    let hatching = '';
    const spacing = 10;
    for (let i = -height; i < width + height; i += spacing) {
        hatching += `<line x1="${x + i}" y1="${y}" 
                         x2="${x + i - height}" y2="${y + height}" 
                         stroke="#bbb" stroke-width="1"/>`;
    }
    return hatching;
}

function displayMeasurementsTable() {
    const m = calculatedMeasurements;
    const tbody = document.getElementById('measurementsBody');
    
    if (!tbody) return;
    
    const measurements = [
        ['Blouse Size', m.blouseSize, 'Input size'],
        ['Blouse Length', m.blouseLength, 'Full length'],
        ['Chest (Full)', m.chestSize, 'Full chest'],
        ['Chest (1/4)', m.chestQuarter.toFixed(2), 'For pattern'],
        ['Shoulder (Full)', m.shoulderSize, 'Full shoulder'],
        ['Shoulder (1/2)', m.shoulderHalf.toFixed(2), 'Half shoulder'],
        ['Arm Round', m.armRound, 'Full arm'],
        ['Armhole Depth', m.armholeDepth.toFixed(2), 'Calculated'],
        ['Neck Round', m.neckRound, 'Neck circumference'],
        ['Neck Loose', m.neckLoose.toFixed(2), 'Neck + ease'],
        ['Back Neck Length', m.backNeckLength, 'Neck depth'],
        ['Waist (Full)', m.waistSize, 'Full waist'],
        ['Waist (1/4)', m.waistQuarter.toFixed(2), 'For pattern']
    ];
    
    tbody.innerHTML = measurements.map(([name, value, notes]) => `
        <tr>
            <td><strong>${name}</strong></td>
            <td>${value}"</td>
            <td style="color: #666; font-size: 0.9em;">${notes}</td>
        </tr>
    `).join('');
}

function displayInstructions() {
    const m = calculatedMeasurements;
    const instructionsDiv = document.getElementById('instructionsText');
    
    if (!instructionsDiv) return;
    
    const styleNames = {
        basic: 'Basic Back',
        pot: 'Pot Neck Design',
        boat: 'Boat Neck',
        katori: 'Katori Cut',
        temple: 'Temple Neck',
        cutwork: 'Cut Work Design'
    };
    
    const instructions = {
        basic: `
            <ol>
                <li>Draw rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
                <li><strong>Neck:</strong> Width ${m.neckLoose.toFixed(2)}", Depth ${m.neckDepth}" - draw smooth curve</li>
                <li><strong>Shoulder:</strong> ${m.shoulderHalf.toFixed(2)}" from left at top</li>
                <li><strong>Armhole:</strong> Depth ${m.armholeDepth.toFixed(1)}" - curve from shoulder to side</li>
                <li>Add <strong>0.5" seam allowance</strong> on all edges</li>
            </ol>
        `,
        pot: `
            <ol>
                <li>Draw outer rectangle: <strong>${m.totalWidth.toFixed(1)}" × ${m.totalLength.toFixed(1)}"</strong></li>
                <li>Draw inner rectangle (chest): <strong>${m.chestQuarter.toFixed(1)}" width</strong></li>
                <li><strong>Neck Box:</strong> ${m.neckLoose}" wide × 3.5" deep at top-left</li>
                <li><strong>Pot Neck:</strong> Curve from box to depth ${m.neckPotLength}"</li>
                <li><strong>Shoulder:</strong> Remaining ${(m.shoulderSize / 2 - 4).toFixed(1)}"</li>
                <li><strong>Armhole Box:</strong> 7" deep with curve to ${(m.armRound / 2 + 2.5).toFixed(1)}"</li>
                <li>Add <strong>2" seam allowance</strong> on right (shaded)</li>
            </ol>
        `,
        boat: `
            <ol>
                <li>Draw rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
                <li><strong>Boat Neck:</strong> Wide shallow curve across top - ${m.neckLoose.toFixed(2)}" deep</li>
                <li>Add scallop details along neckline</li>
                <li><strong>Shoulder:</strong> ${m.shoulderHalf.toFixed(2)}"</li>
                <li><strong>Armhole:</strong> Curve to depth ${m.armholeDepth.toFixed(1)}"</li>
                <li>Add seam allowance on all edges</li>
            </ol>
        `,
        katori: `
            <ol>
                <li>Draw base rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
                <li><strong>Neck:</strong> Standard curve, width ${m.neckLoose.toFixed(2)}"</li>
                <li><strong>Katori Curve:</strong> Start tapering at 40% length to waist</li>
                <li><strong>Waist:</strong> ${(m.waistSize / 4).toFixed(2)}" (tapered from chest)</li>
                <li>Add <strong>2.5" belt</strong> at bottom</li>
                <li>Draw smooth curved seam from waist to hem</li>
            </ol>
        `,
        temple: `
            <ol>
                <li>Draw rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
                <li><strong>Temple Neck:</strong> Jagged/scalloped design at top - ${m.neckLoose.toFixed(2)}" wide</li>
                <li><strong>Box Design:</strong> ${(m.backNeckLength + 3).toFixed(1)}" box at bottom</li>
                <li>Add decorative scallop edges along bottom</li>
                <li><strong>Shoulder & Armhole:</strong> Standard measurements</li>
                <li>Add seam allowance</li>
            </ol>
        `,
        cutwork: `
            <ol>
                <li>Draw rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
                <li><strong>Deep Neck:</strong> ${m.neckLoose.toFixed(2)}" wide, ${(m.backNeckLength + 2).toFixed(1)}" deep</li>
                <li><strong>Scallop Cuts:</strong> 6 scallops along bottom edge</li>
                <li><strong>Side Scallop:</strong> 5 scallops along armhole side</li>
                <li>Cut decorative shapes as shown in pattern</li>
                <li>Add seam allowance on straight edges only</li>
            </ol>
        `
    };
    
    instructionsDiv.innerHTML = `
        <h3 style="color: #667eea; margin-bottom: 15px;">
            <i class="fas fa-info-circle"></i> Drafting Instructions - ${styleNames[currentStyle]}
        </h3>
        ${instructions[currentStyle] || instructions.basic}
    `;
}

function downloadSVG() {
    console.log('📥 Downloading SVG...');
    
    let svgContent = generatedSVGContent || window.generatedSVG;
    
    if (!svgContent) {
        const svgElement = document.querySelector('#patternContainer svg');
        if (svgElement) {
            svgContent = svgElement.outerHTML;
        }
    }
    
    if (!svgContent) {
        alert('❌ No pattern generated yet!');
        return;
    }
    
    try {
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `blouse_${currentStyle}_size${calculatedMeasurements.blouseSize}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        console.log('✅ Downloaded');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function printPattern() {
    const svgElement = document.querySelector('#patternContainer svg');
    if (!svgElement) {
        alert('❌ No pattern to print!');
        return;
    }
    
    try {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Blouse Pattern - Size ${calculatedMeasurements.blouseSize}</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    svg { max-width: 100%; height: auto; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h2 style="text-align: center; color: #667eea;">
                    ${calculatedMeasurements.blouseSize} SIZE BLOUSE - ${getStyleName(currentStyle)}
                </h2>
                ${svgElement.outerHTML}
                <script>window.onload = function() { window.print(); window.close(); };</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
