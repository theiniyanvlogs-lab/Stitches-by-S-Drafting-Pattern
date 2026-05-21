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
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            styleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.dataset.style;
            console.log('🎨 Style selected:', currentStyle);
        });
    });
}

function initializeGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Generate Pattern button clicked');
            generatePattern();
        });
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
    console.log('🚀 Starting pattern generation...');
    
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

        // Calculate all derived measurements
        calculatedMeasurements = {
            blouseSize,
            blouseLength,
            chestSize,
            shoulderSize,
            armRound,
            neckRound,
            backNeckLength,
            waistSize,
            // Basic calculations
            chestQuarter: chestSize / 4,
            shoulderHalf: shoulderSize / 2,
            armRoundHalf: armRound / 2,
            neckQuarter: neckRound / 4,
            waistQuarter: waistSize / 4,
            // Derived measurements
            neckLoose: (neckRound / 4) + 0.5,
            neckDepth: backNeckLength,
            armholeDepth: (armRound / 2) + 1,
            neckWidth: (neckRound / 4) + 0.25,
            // Waist shaping
            waistReduction: (chestSize - waistSize) / 8,
            // For pot neck
            potNeckDepth: backNeckLength + 2,
            potNeckWidth: (neckRound / 4) - 0.5
        };

        console.log('📐 Calculated measurements:', calculatedMeasurements);

        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
        }

        generateAccurateSVGPattern();
        displayMeasurementsTable();
        displayInstructions();

        setTimeout(() => {
            if (patternSection) {
                patternSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        
        console.log('✅ Pattern generation completed!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    }
}

function generateAccurateSVGPattern() {
    const m = calculatedMeasurements;
    const scale = 25; // pixels per inch for better visibility
    
    // Pattern base dimensions
    const baseWidth = m.chestQuarter * scale;
    const baseHeight = m.blouseLength * scale;
    
    // SVG canvas with padding
    const padding = 100;
    const svgWidth = baseWidth + (padding * 2);
    const svgHeight = baseHeight + (padding * 2);
    
    // Origin point (top-left of pattern)
    const ox = padding;
    const oy = padding;
    
    // Key measurement points
    const neckW = m.neckWidth * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = m.waistReduction * scale;
    
    // Generate style-specific pattern
    let patternPath = '';
    let annotations = '';
    
    switch(currentStyle) {
        case 'basic':
            patternPath = generateBasicBackPath(ox, oy, m, scale);
            annotations = generateBasicAnnotations(ox, oy, m, scale);
            break;
        case 'pot':
            patternPath = generatePotNeckPath(ox, oy, m, scale);
            annotations = generatePotAnnotations(ox, oy, m, scale);
            break;
        case 'boat':
            patternPath = generateBoatNeckPath(ox, oy, m, scale);
            annotations = generateBoatAnnotations(ox, oy, m, scale);
            break;
        case 'katori':
            patternPath = generateKatoriPath(ox, oy, m, scale);
            annotations = generateKatoriAnnotations(ox, oy, m, scale);
            break;
        default:
            patternPath = generateBasicBackPath(ox, oy, m, scale);
            annotations = generateBasicAnnotations(ox, oy, m, scale);
    }
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}" 
     height="${svgHeight}" 
     viewBox="0 0 ${svgWidth} ${svgHeight}">
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="#ffffff"/>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="40" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#333">
        ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
    </text>
    <text x="${svgWidth/2}" y="65" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="14" fill="#666">
        Size ${m.blouseSize} - Haseena Fashion World
    </text>
    
    <!-- Grid -->
    ${createGrid(ox, oy, baseWidth, baseHeight, scale)}
    
    <!-- Pattern fill -->
    <path d="${patternPath}" fill="#f0e6ff" stroke="#667eea" stroke-width="3"/>
    
    <!-- Annotations and measurements -->
    ${annotations}
    
    <!-- Scale indicator -->
    <text x="${svgWidth - 80}" y="${svgHeight - 20}" 
          font-family="Arial" font-size="12" fill="#999">
        Scale: 1" = ${scale}px
    </text>
</svg>`;

    generatedSVGContent = svgContent;
    window.generatedSVG = svgContent;
    
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svgContent;
        console.log('✅ SVG pattern inserted');
    }
}

function generateBasicBackPath(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    const neckW = m.neckWidth * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = m.waistReduction * scale;
    
    return `M ${ox} ${oy}
            L ${ox + w} ${oy}
            L ${ox + w} ${oy + h}
            L ${ox + waistW - waistRed} ${oy + h}
            L ${ox} ${oy + h}
            Z
            
            M ${ox} ${oy}
            Q ${ox + neckW} ${oy} ${ox + neckW} ${oy + neckD}
            
            M ${ox + shoulderW} ${oy}
            Q ${ox + shoulderW + 15} ${oy + armholeD * 0.3}
              ${ox + w} ${oy + armholeD}`;
}

function generatePotNeckPath(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    const neckW = m.potNeckWidth * scale;
    const neckD = m.potNeckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = m.waistReduction * scale;
    
    // Pot neck shape
    return `M ${ox} ${oy}
            L ${ox + w} ${oy}
            L ${ox + w} ${oy + h}
            L ${ox + waistW - waistRed} ${oy + h}
            L ${ox} ${oy + h}
            Z
            
            M ${ox} ${oy}
            L ${ox + neckW} ${oy}
            L ${ox + neckW} ${oy + neckD * 0.3}
            Q ${ox + neckW + 20} ${oy + neckD * 0.6}
              ${ox + neckW} ${oy + neckD}
            Q ${ox + neckW - 20} ${oy + neckD * 1.2}
              ${ox} ${oy + neckD * 0.8}
            Z
            
            M ${ox + shoulderW} ${oy}
            Q ${ox + shoulderW + 15} ${oy + armholeD * 0.3}
              ${ox + w} ${oy + armholeD}`;
}

function generateBoatNeckPath(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    const neckW = m.neckWidth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = m.waistReduction * scale;
    
    return `M ${ox} ${oy}
            L ${ox + w} ${oy}
            L ${ox + w} ${oy + h}
            L ${ox + waistW - waistRed} ${oy + h}
            L ${ox} ${oy + h}
            Z
            
            M ${ox} ${oy}
            Q ${ox + w/2} ${oy + neckW * 0.5} ${ox + w} ${oy}
            
            M ${ox + shoulderW} ${oy}
            Q ${ox + shoulderW + 15} ${oy + armholeD * 0.3}
              ${ox + w} ${oy + armholeD}`;
}

function generateKatoriPath(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    const neckW = m.neckWidth * scale;
    const neckD = m.neckDepth * scale;
    const shoulderW = m.shoulderHalf * scale;
    const armholeD = m.armholeDepth * scale;
    const waistW = m.waistQuarter * scale;
    const waistRed = m.waistReduction * scale;
    
    // Katori curve - fitted side seam
    const katoriStart = h * 0.4;
    
    return `M ${ox} ${oy}
            L ${ox + w} ${oy}
            L ${ox + w} ${oy + katoriStart}
            Q ${ox + w - 20} ${oy + h * 0.6}
              ${ox + waistW - waistRed} ${oy + h}
            L ${ox} ${oy + h}
            Z
            
            M ${ox} ${oy}
            Q ${ox + neckW} ${oy} ${ox + neckW} ${oy + neckD}
            
            M ${ox + shoulderW} ${oy}
            Q ${ox + shoulderW + 15} ${oy + armholeD * 0.3}
              ${ox + w} ${oy + armholeD}`;
}

function generateBasicAnnotations(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    
    return `
        <!-- Chest measurement -->
        <text x="${ox + w/2}" y="${oy - 15}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold">
            Chest: ${m.chestQuarter.toFixed(2)}"
        </text>
        
        <!-- Length measurement -->
        <text x="${ox - 15}" y="${oy + h/2}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold"
              transform="rotate(-90 ${ox - 15} ${oy + h/2})">
            Length: ${m.blouseLength}"
        </text>
        
        <!-- Shoulder measurement -->
        <text x="${ox + (m.shoulderHalf * scale)/2}" y="${oy + 20}" 
              text-anchor="middle" font-family="Arial" font-size="12" 
              fill="#e91e63" font-weight="bold">
            Shoulder: ${m.shoulderHalf.toFixed(2)}"
        </text>
        
        <!-- Armhole measurement -->
        <text x="${ox + w + 15}" y="${oy + m.armholeDepth * scale}" 
              text-anchor="start" font-family="Arial" font-size="12" 
              fill="#e91e63" font-weight="bold">
            Armhole: ${m.armholeDepth.toFixed(1)}"
        </text>
        
        <!-- Center back line -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + h}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Waist line -->
        <line x1="${ox}" y1="${oy + h * 0.7}" x2="${ox + m.waistQuarter * scale - m.waistReduction * scale}" y2="${oy + h * 0.7}" 
              stroke="#e91e63" stroke-width="1.5" stroke-dasharray="3,3"/>
        
        <!-- Waist measurement -->
        <text x="${ox + w/2}" y="${oy + h * 0.7 - 10}" text-anchor="middle" 
              font-family="Arial" font-size="11" fill="#e91e63">
            Waist: ${m.waistQuarter.toFixed(2)}"
        </text>
    `;
}

function generatePotAnnotations(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    
    return `
        <text x="${ox + w/2}" y="${oy - 15}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold">
            Chest: ${m.chestQuarter.toFixed(2)}"
        </text>
        
        <text x="${ox - 15}" y="${oy + h/2}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold"
              transform="rotate(-90 ${ox - 15} ${oy + h/2})">
            Length: ${m.blouseLength}"
        </text>
        
        <!-- Pot neck annotation -->
        <text x="${ox + m.potNeckWidth * scale + 20}" y="${oy + m.potNeckDepth * scale / 2}" 
              text-anchor="start" font-family="Arial" font-size="12" 
              fill="#e91e63" font-weight="bold">
            Pot Neck: ${m.potNeckDepth.toFixed(1)}" deep
        </text>
        
        <!-- Center back -->
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + h}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
        
        <!-- Shoulder line -->
        <line x1="${ox}" y1="${oy}" x2="${ox + m.shoulderHalf * scale}" y2="${oy}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    `;
}

function generateBoatAnnotations(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    
    return `
        <text x="${ox + w/2}" y="${oy - 15}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold">
            Chest: ${m.chestQuarter.toFixed(2)}"
        </text>
        
        <text x="${ox - 15}" y="${oy + h/2}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold"
              transform="rotate(-90 ${ox - 15} ${oy + h/2})">
            Length: ${m.blouseLength}"
        </text>
        
        <!-- Boat neck annotation -->
        <text x="${ox + w/2}" y="${oy + m.neckWidth * scale + 20}" 
              text-anchor="middle" font-family="Arial" font-size="12" 
              fill="#e91e63" font-weight="bold">
            Boat Neck: ${m.neckWidth.toFixed(2)}" wide
        </text>
        
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + h}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    `;
}

function generateKatoriAnnotations(ox, oy, m, scale) {
    const w = m.chestQuarter * scale;
    const h = m.blouseLength * scale;
    
    return `
        <text x="${ox + w/2}" y="${oy - 15}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold">
            Chest: ${m.chestQuarter.toFixed(2)}"
        </text>
        
        <text x="${ox - 15}" y="${oy + h/2}" text-anchor="middle" 
              font-family="Arial" font-size="14" fill="#667eea" font-weight="bold"
              transform="rotate(-90 ${ox - 15} ${oy + h/2})">
            Length: ${m.blouseLength}"
        </text>
        
        <!-- Katori curve annotation -->
        <text x="${ox + w + 20}" y="${oy + h * 0.6}" 
              text-anchor="start" font-family="Arial" font-size="12" 
              fill="#e91e63" font-weight="bold">
            Katori Curve
        </text>
        
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + h}" 
              stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    `;
}

function createGrid(ox, oy, width, height, scale) {
    let grid = '';
    const gridSize = scale; // 1 inch grid
    
    for (let x = ox; x <= ox + width; x += gridSize) {
        grid += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + height}" 
                     stroke="#f0f0f0" stroke-width="0.5"/>`;
    }
    
    for (let y = oy; y <= oy + height; y += gridSize) {
        grid += `<line x1="${ox}" y1="${y}" x2="${ox + width}" y2="${y}" 
                     stroke="#f0f0f0" stroke-width="0.5"/>`;
    }
    
    return grid;
}

function displayMeasurementsTable() {
    const m = calculatedMeasurements;
    const tbody = document.getElementById('measurementsBody');
    
    if (!tbody) return;
    
    const measurements = [
        ['Blouse Size', m.blouseSize, 'Input size'],
        ['Full Length', m.blouseLength, 'Total length'],
        ['Chest (Full)', m.chestSize, 'Full chest'],
        ['Chest (1/4)', m.chestQuarter.toFixed(2), 'For pattern'],
        ['Shoulder (Full)', m.shoulderSize, 'Full shoulder'],
        ['Shoulder (1/2)', m.shoulderHalf.toFixed(2), 'Half shoulder'],
        ['Arm Round', m.armRound, 'Arm circumference'],
        ['Armhole Depth', m.armholeDepth.toFixed(2), 'Calculated'],
        ['Neck Round', m.neckRound, 'Neck circumference'],
        ['Neck Loose', m.neckLoose.toFixed(2), 'Neck + ease'],
        ['Back Neck Length', m.backNeckLength, 'Neck depth'],
        ['Waist (Full)', m.waistSize, 'Full waist'],
        ['Waist (1/4)', m.waistQuarter.toFixed(2), 'For pattern'],
        ['Waist Reduction', m.waistReduction.toFixed(2), 'Side seam taper']
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
        pot: 'Pot Neck',
        boat: 'Boat Neck',
        katori: 'Katori'
    };
    
    instructionsDiv.innerHTML = `
        <h3 style="color: #667eea; margin-bottom: 15px;">
            <i class="fas fa-info-circle"></i> Drafting Instructions - ${styleNames[currentStyle]}
        </h3>
        <ol style="line-height: 1.8; padding-left: 20px;">
            <li>Draw rectangle: <strong>${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</strong></li>
            
            <li><strong>Center Back:</strong> Left edge is fold line</li>
            
            <li><strong>Neck:</strong> 
                <ul>
                    <li>Width: ${m.neckWidth.toFixed(2)}" from top-left</li>
                    <li>Depth: ${m.neckDepth}" down</li>
                    <li>Draw smooth curve</li>
                </ul>
            </li>
            
            <li><strong>Shoulder:</strong> ${m.shoulderHalf.toFixed(2)}" from left at top</li>
            
            <li><strong>Armhole:</strong> 
                <ul>
                    <li>Depth: ${m.armholeDepth.toFixed(1)}"</li>
                    <li>Curve from shoulder to side seam</li>
                </ul>
            </li>
            
            <li><strong>Side Seam:</strong> Taper to waist (${m.waistQuarter.toFixed(2)}")</li>
            
            <li>Add <strong>0.5" seam allowance</strong> on all edges</li>
        </ol>
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
        link.download = `blouse_pattern_${currentStyle}_size${calculatedMeasurements.blouseSize}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        console.log('✅ SVG downloaded');
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    }
}

function printPattern() {
    console.log('🖨️ Printing...');
    
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
                    ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
                </h2>
                <p style="text-align: center; color: #666;">Size ${calculatedMeasurements.blouseSize}</p>
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
