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

        // Calculate all measurements exactly like the reference pattern
        calculatedMeasurements = {
            blouseSize,
            blouseLength,
            chestSize,
            shoulderSize,
            armRound,
            neckRound,
            backNeckLength,
            waistSize,
            // Derived measurements (exactly like reference)
            chestQuarter: chestSize / 4, // e.g., 48/4 = 12
            shoulderHalf: shoulderSize / 2,
            armRoundHalf: armRound / 2,
            neckQuarter: neckRound / 4,
            waistQuarter: waistSize / 4,
            // Pot neck specific
            neckLoose: 4, // Standard for pot neck
            neckDeepLength: backNeckLength + 4, // e.g., 8+4 = 12
            neckBoxLength: 3.5,
            neckPotLength: backNeckLength + 0.5,
            remainingShoulder: shoulderSize / 2 - 4,
            armWholeBoxLength: 7,
            armRoundValue: armRound / 2 + 2.5,
            // Dimensions
            totalWidth: (chestSize / 4) + 4, // 12 + 4 = 16
            totalLength: blouseLength + 1 // 15 + 1 = 16
        };

        console.log('📐 Calculated measurements:', calculatedMeasurements);

        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
        }

        generateAccuratePattern();
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

function generateAccuratePattern() {
    const m = calculatedMeasurements;
    const scale = 30; // pixels per inch - larger for clarity
    
    // Base dimensions from reference pattern
    const chestW = m.chestQuarter; // e.g., 12"
    const totalW = m.totalWidth; // e.g., 16"
    const totalH = m.totalLength; // e.g., 16"
    
    // Neck measurements
    const neckLoose = m.neckLoose; // 4"
    const neckBoxL = m.neckBoxLength; // 3.5"
    const neckDeep = m.neckDeepLength; // 12"
    const neckPot = m.neckPotLength; // 8.5"
    
    // Shoulder & Armhole
    const remainShoulder = m.remainingShoulder; // 3.5"
    const armWholeBox = m.armWholeBoxLength; // 7"
    const armRoundVal = m.armRoundValue; // 9.5"
    
    // SVG canvas with padding
    const padding = 120;
    const svgWidth = (totalW * scale) + (padding * 2);
    const svgHeight = (totalH * scale) + (padding * 2);
    
    // Origin point
    const ox = padding;
    const oy = padding;
    
    // Create SVG content
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}" 
     height="${svgHeight}" 
     viewBox="0 0 ${svgWidth} ${svgHeight}">
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="#ffffff"/>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="35" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333">
        ${m.blouseSize} SIZE BLOUSE BACK POT NECK DESIGN
    </text>
    <text x="${svgWidth/2}" y="55" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="13" fill="#666">
        Haseena Fashion World
    </text>
    
    <!-- Grid Background -->
    ${createGrid(ox, oy, totalW * scale, totalH * scale, scale)}
    
    <!-- Main Pattern Rectangle -->
    <rect x="${ox}" y="${oy}" 
          width="${chestW * scale}" 
          height="${totalH * scale}"
          fill="#fafafa" 
          stroke="#333" 
          stroke-width="2"/>
    
    <!-- Extended width rectangle -->
    <rect x="${ox}" y="${oy}" 
          width="${totalW * scale}" 
          height="${totalH * scale}"
          fill="none" 
          stroke="#333" 
          stroke-width="2"/>
    
    <!-- Neck Box (left side) -->
    <rect x="${ox}" y="${oy}" 
          width="${neckLoose * scale}" 
          height="${neckBoxL * scale}"
          fill="none" 
          stroke="#e91e63" 
          stroke-width="2"/>
    
    <!-- Neck Pot Curve -->
    <path d="M ${ox} ${oy + neckBoxL * scale}
             Q ${ox + neckLoose * scale} ${oy + neckBoxL * scale}
               ${ox + neckLoose * scale} ${oy + neckPot * scale}
             Q ${ox + neckLoose * scale} ${oy + neckDeep * scale * 0.8}
               ${ox} ${oy + neckDeep * scale}"
          fill="none" 
          stroke="#e91e63" 
          stroke-width="2.5"/>
    
    <!-- Horizontal neck line -->
    <line x1="${ox}" y1="${oy + neckBoxL * scale}"
          x2="${ox + neckLoose * scale}" y2="${oy + neckBoxL * scale}"
          stroke="#e91e63" stroke-width="1.5" stroke-dasharray="3,2"/>
    
    <!-- Vertical neck line -->
    <line x1="${ox + neckLoose * scale}" y1="${oy}"
          x2="${ox + neckLoose * scale}" y2="${oy + neckBoxL * scale}"
          stroke="#e91e63" stroke-width="1.5"/>
    
    <!-- Shoulder line (top) -->
    <line x1="${ox}" y1="${oy}" 
          x2="${ox + (chestW - remainShoulder) * scale}" y2="${oy}"
          stroke="#333" stroke-width="2" stroke-dasharray="5,3"/>
    
    <!-- Armhole Box -->
    <rect x="${ox + chestW * scale}" y="${oy}" 
          width="${remainShoulder * scale}" 
          height="${armWholeBox * scale}"
          fill="none" 
          stroke="#2196f3" 
          stroke-width="1.5" stroke-dasharray="3,2"/>
    
    <!-- Armhole Curve -->
    <path d="M ${ox + (chestW - remainShoulder) * scale} ${oy}
             Q ${ox + chestW * scale} ${oy + armWholeBox * scale * 0.5}
               ${ox + chestW * scale} ${oy + armWholeBox * scale}"
          fill="none" 
          stroke="#e91e63" 
          stroke-width="2.5"/>
    
    <!-- Side seam -->
    <line x1="${ox + chestW * scale}" y1="${oy + armWholeBox * scale}"
          x2="${ox + chestW * scale}" y2="${oy + totalH * scale}"
          stroke="#333" stroke-width="2"/>
    
    <!-- Bottom line -->
    <line x1="${ox}" y1="${oy + totalH * scale}"
          x2="${ox + totalW * scale}" y2="${oy + totalH * scale}"
          stroke="#333" stroke-width="2"/>
    
    <!-- Seam allowance (shaded area on right) -->
    <rect x="${ox + totalW * scale - 2 * scale}" y="${oy + armWholeBox * scale}" 
          width="${2 * scale}" 
          height="${(totalH - armWholeBox) * scale}"
          fill="#e0e0e0" 
          stroke="#999" 
          stroke-width="1"/>
    
    <!-- Diagonal hatching for seam allowance -->
    ${createHatching(ox + totalW * scale - 2 * scale, oy + armWholeBox * scale, 2 * scale, (totalH - armWholeBox) * scale)}
    
    <!-- ===== MEASUREMENT LABELS ===== -->
    
    <!-- Top width measurements -->
    <text x="${ox + neckLoose * scale / 2}" y="${oy - 15}" text-anchor="middle" 
          font-family="Arial" font-size="14" fill="#e91e63" font-weight="bold">
        ${neckLoose}"
    </text>
    
    <text x="${ox + neckLoose * scale + remainShoulder * scale / 2}" y="${oy - 15}" text-anchor="middle" 
          font-family="Arial" font-size="14" fill="#2196f3" font-weight="bold">
        ${remainShoulder.toFixed(1)}"
    </text>
    
    <!-- Left side measurements -->
    <text x="${ox - 15}" y="${oy + neckBoxL * scale / 2}" text-anchor="middle" 
          font-family="Arial" font-size="13" fill="#e91e63" font-weight="bold"
          transform="rotate(-90 ${ox - 15} ${oy + neckBoxL * scale / 2})">
        ${neckBoxL}"
    </text>
    
    <text x="${ox - 15}" y="${oy + neckBoxL * scale + (neckDeep - neckBoxL) * scale / 2}" text-anchor="middle" 
          font-family="Arial" font-size="13" fill="#e91e63" font-weight="bold"
          transform="rotate(-90 ${ox - 15} ${oy + neckBoxL * scale + (neckDeep - neckBoxL) * scale / 2})">
        ${(neckDeep - neckBoxL).toFixed(1)}"
    </text>
    
    <text x="${ox - 15}" y="${oy + neckDeep * scale + (totalH - neckDeep) * scale / 2}" text-anchor="middle" 
          font-family="Arial" font-size="13" fill="#333" font-weight="bold"
          transform="rotate(-90 ${ox - 15} ${oy + neckDeep * scale + (totalH - neckDeep) * scale / 2})">
        ${(totalH - neckDeep).toFixed(1)}"
    </text>
    
    <!-- Right side measurements -->
    <text x="${ox + chestW * scale + 15}" y="${oy + armWholeBox * scale / 2}" text-anchor="start" 
          font-family="Arial" font-size="13" fill="#2196f3" font-weight="bold">
        ${armWholeBox}"
    </text>
    
    <text x="${ox + chestW * scale + 15}" y="${oy + armWholeBox * scale + (armRoundVal - armWholeBox) * scale}" text-anchor="start" 
          font-family="Arial" font-size="13" fill="#e91e63" font-weight="bold">
        ${armRoundVal.toFixed(1)}"
    </text>
    
    <!-- Chest measurement -->
    <text x="${ox + chestW * scale / 2}" y="${oy + neckDeep * scale + 20}" text-anchor="middle" 
          font-family="Arial" font-size="16" fill="#4caf50" font-weight="bold">
        ${chestW.toFixed(1)}"
    </text>
    <text x="${ox + chestW * scale / 2}" y="${oy + neckDeep * scale + 38}" text-anchor="middle" 
          font-family="Arial" font-size="12" fill="#666">
        chest
    </text>
    
    <!-- Bottom width -->
    <text x="${ox + totalW * scale / 2}" y="${oy + totalH * scale + 25}" text-anchor="middle" 
          font-family="Arial" font-size="14" fill="#333" font-weight="bold">
        ${totalW.toFixed(1)}"
    </text>
    
    <!-- Center back line -->
    <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + totalH * scale}" 
          stroke="#333" stroke-width="1.5" stroke-dasharray="4,2"/>
    
    <!-- Horizontal reference lines -->
    <line x1="${ox + neckLoose * scale}" y1="${oy + neckBoxL * scale}" 
          x2="${ox + chestW * scale}" y2="${oy + neckBoxL * scale}" 
          stroke="#999" stroke-width="0.5" stroke-dasharray="3,2"/>
    
    <line x1="${ox}" y1="${oy + neckDeep * scale}" 
          x2="${ox + chestW * scale}" y2="${oy + neckDeep * scale}" 
          stroke="#999" stroke-width="0.5" stroke-dasharray="3,2"/>
</svg>`;

    generatedSVGContent = svgContent;
    window.generatedSVG = svgContent;
    
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svgContent;
        console.log('✅ SVG pattern inserted');
    }
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
        ['Chest', m.chestSize, 'Full chest'],
        ['Chest (1/4)', m.chestQuarter.toFixed(2), 'For pattern'],
        ['Shoulder', m.shoulderSize, 'Full shoulder'],
        ['Remaining Shoulder', m.remainingShoulder.toFixed(2), 'For armhole'],
        ['Arm Round', m.armRound, 'Full arm'],
        ['Arm Whole Box', m.armWholeBoxLength, 'Armhole depth'],
        ['Neck Round', m.neckRound, 'Full neck'],
        ['Neck Loose', m.neckLoose, 'Neck width'],
        ['Neck Box Length', m.neckBoxLength, 'Box depth'],
        ['Neck Pot Length', m.neckPotLength, 'Pot depth'],
        ['Neck Deep Length', m.neckDeepLength, 'Total neck depth'],
        ['Back Neck Length', m.backNeckLength, 'Input back neck'],
        ['Waist', m.waistSize, 'Full waist']
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
    
    instructionsDiv.innerHTML = `
        <h3 style="color: #667eea; margin-bottom: 15px;">
            <i class="fas fa-info-circle"></i> Drafting Instructions
        </h3>
        <ol style="line-height: 1.8; padding-left: 20px;">
            <li>Draw rectangle: <strong>${m.totalWidth.toFixed(1)}" × ${m.totalLength.toFixed(1)}"</strong></li>
            
            <li><strong>Neck Box:</strong> Mark ${m.neckLoose}" wide × ${m.neckBoxLength}" deep at top-left</li>
            
            <li><strong>Neck Pot:</strong> Draw curve from neck box to depth ${m.neckPotLength}"</li>
            
            <li><strong>Shoulder:</strong> Mark ${m.remainingShoulder.toFixed(1)}" remaining from chest width</li>
            
            <li><strong>Armhole Box:</strong> ${m.armWholeBoxLength}" deep from top-right</li>
            
            <li><strong>Armhole Curve:</strong> Connect shoulder to armhole depth with smooth curve</li>
            
            <li><strong>Chest Width:</strong> ${m.chestQuarter.toFixed(1)}" (1/4 of chest)</li>
            
            <li>Add <strong>2" seam allowance</strong> on right side (shaded area)</li>
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
                    ${calculatedMeasurements.blouseSize} SIZE BLOUSE BACK POT NECK DESIGN
                </h2>
                <p style="text-align: center; color: #666;">Haseena Fashion World</p>
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
