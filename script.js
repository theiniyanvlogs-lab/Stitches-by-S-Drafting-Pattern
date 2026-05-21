// Global Variables
let currentStyle = 'basic';
let calculatedMeasurements = {};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ App initialized');
    
    // Style buttons
    const styleButtons = document.querySelectorAll('.style-btn');
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            styleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.dataset.style;
            console.log('Style selected:', currentStyle);
        });
    });
    
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generatePattern();
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('downloadSvg');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadSVG);
    }
    
    // Print button
    const printBtn = document.getElementById('printPattern');
    if (printBtn) {
        printBtn.addEventListener('click', printPattern);
    }
});

function generatePattern() {
    console.log('🚀 Generating pattern...');
    
    try {
        // Get values
        const blouseSize = parseFloat(document.getElementById('blouseSize').value);
        const blouseLength = parseFloat(document.getElementById('blouseLength').value);
        const chestSize = parseFloat(document.getElementById('chestSize').value);
        const shoulderSize = parseFloat(document.getElementById('shoulderSize').value);
        const armRound = parseFloat(document.getElementById('armRound').value);
        const neckRound = parseFloat(document.getElementById('neckRound').value);
        const backNeckLength = parseFloat(document.getElementById('backNeckLength').value);
        const waistSize = parseFloat(document.getElementById('waistSize').value);

        // Validate
        if (!blouseSize || !blouseLength || !chestSize || !shoulderSize || 
            !armRound || !neckRound || !backNeckLength || !waistSize) {
            alert('⚠️ Please fill in ALL fields!');
            return;
        }

        // Calculate
        calculatedMeasurements = {
            blouseSize, blouseLength, chestSize, shoulderSize,
            armRound, neckRound, backNeckLength, waistSize,
            chestQuarter: chestSize / 4,
            shoulderHalf: shoulderSize / 2,
            armRoundHalf: armRound / 2,
            neckQuarter: neckRound / 4,
            waistQuarter: waistSize / 4,
            neckLoose: (neckRound / 4) + 0.5,
            neckDepth: backNeckLength,
            armholeDepth: (armRound / 2) + 1
        };

        console.log('Measurements:', calculatedMeasurements);

        // Show pattern section
        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
        }

        // Generate SVG
        generateSVGPattern();
        
        // Show measurements
        displayMeasurements();
        
        // Show instructions
        displayInstructions();

        // Scroll to pattern
        setTimeout(() => {
            patternSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        console.log('✅ Pattern generated successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    }
}

function generateSVGPattern() {
    const m = calculatedMeasurements;
    const scale = 25; // pixels per inch
    const padding = 80;
    
    // Pattern dimensions
    const patternWidth = m.chestQuarter * scale;
    const patternHeight = m.blouseLength * scale;
    const svgWidth = patternWidth + (padding * 2);
    const svgHeight = patternHeight + (padding * 2);
    
    // Coordinates
    const startX = padding;
    const startY = padding;
    
    // Neck point
    const neckWidth = m.neckLoose * scale;
    const neckDepth = m.neckDepth * scale;
    
    // Shoulder point
    const shoulderWidth = m.shoulderHalf * scale;
    
    // Armhole
    const armholeDepth = m.armholeDepth * scale;
    
    // Create SVG
    const svg = `
        <svg id="patternSvg" width="${svgWidth}" height="${svgHeight}" 
             xmlns="http://www.w3.org/2000/svg" 
             style="background: #fafafa; border: 2px solid #667eea; border-radius: 10px;">
            
            <!-- Title -->
            <text x="${svgWidth/2}" y="30" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">
                ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
            </text>
            <text x="${svgWidth/2}" y="50" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="12" fill="#666">
                Size ${m.blouseSize} - Haseena Fashion World
            </text>
            
            <!-- Grid -->
            ${createGrid(startX, startY, patternWidth, patternHeight, scale)}
            
            <!-- Main pattern shape -->
            <path d="M ${startX} ${startY}
                     L ${startX + patternWidth} ${startY}
                     L ${startX + patternWidth} ${startY + patternHeight}
                     L ${startX} ${startY + patternHeight}
                     Z"
                  fill="#f0e6ff" 
                  stroke="#667eea" 
                  stroke-width="3"/>
            
            <!-- Neck curve -->
            <path d="M ${startX} ${startY}
                     Q ${startX + neckWidth} ${startY}
                       ${startX + neckWidth} ${startY + neckDepth}"
                  fill="none" 
                  stroke="#e91e63" 
                  stroke-width="2.5"
                  stroke-dasharray="5,3"/>
            
            <!-- Shoulder line -->
            <line x1="${startX}" y1="${startY}" 
                  x2="${startX + shoulderWidth}" y2="${startY}"
                  stroke="#333" 
                  stroke-width="2" 
                  stroke-dasharray="5,3"/>
            
            <!-- Armhole curve -->
            <path d="M ${startX + shoulderWidth} ${startY}
                     Q ${startX + shoulderWidth + 20} ${startY + armholeDepth/2}
                       ${startX + patternWidth} ${startY + armholeDepth}"
                  fill="none" 
                  stroke="#e91e63" 
                  stroke-width="2.5"/>
            
            <!-- Center back line -->
            <line x1="${startX}" y1="${startY}"
                  x2="${startX}" y2="${startY + patternHeight}"
                  stroke="#333" 
                  stroke-width="2" 
                  stroke-dasharray="5,3"/>
            
            <!-- Side seam -->
            <line x1="${startX + patternWidth}" y1="${startY}"
                  x2="${startX + patternWidth}" y2="${startY + patternHeight}"
                  stroke="#333" 
                  stroke-width="2"/>
            
            <!-- Hem line -->
            <line x1="${startX}" y1="${startY + patternHeight}"
                  x2="${startX + patternWidth}" y2="${startY + patternHeight}"
                  stroke="#333" 
                  stroke-width="2"/>
            
            <!-- Measurements -->
            <text x="${startX + patternWidth/2}" y="${startY - 10}" 
                  text-anchor="middle" font-family="Arial" font-size="13" 
                  fill="#667eea" font-weight="bold">
                Chest: ${m.chestQuarter.toFixed(2)}"
            </text>
            
            <text x="${startX - 10}" y="${startY + patternHeight/2}" 
                  text-anchor="middle" font-family="Arial" font-size="13" 
                  fill="#667eea" font-weight="bold"
                  transform="rotate(-90 ${startX - 10} ${startY + patternHeight/2})">
                Length: ${m.blouseLength}"
            </text>
            
            <text x="${startX + shoulderWidth/2}" y="${startY + 20}" 
                  text-anchor="middle" font-family="Arial" font-size="12" 
                  fill="#e91e63" font-weight="bold">
                Shoulder: ${m.shoulderHalf.toFixed(2)}"
            </text>
            
            <text x="${startX + patternWidth + 10}" y="${startY + armholeDepth}" 
                  text-anchor="start" font-family="Arial" font-size="12" 
                  fill="#e91e63" font-weight="bold">
                Armhole: ${m.armholeDepth.toFixed(1)}"
            </text>
            
            <!-- Neck measurement -->
            <text x="${startX + neckWidth/2}" y="${startY + neckDepth + 15}" 
                  text-anchor="middle" font-family="Arial" font-size="11" 
                  fill="#999">
                Neck: ${m.neckLoose.toFixed(2)}" × ${m.neckDepth.toFixed(1)}"
            </text>
        </svg>
    `;
    
    // Insert SVG
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svg;
        console.log('✅ SVG inserted into DOM');
    } else {
        console.error('❌ patternContainer not found!');
    }
}

function createGrid(ox, oy, width, height, spacing) {
    let grid = '';
    const gridSize = spacing * 2;
    
    // Vertical lines
    for (let x = ox; x <= ox + width; x += gridSize) {
        grid += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + height}" 
                     stroke="#e0e0e0" stroke-width="0.5"/>`;
    }
    
    // Horizontal lines
    for (let y = oy; y <= oy + height; y += gridSize) {
        grid += `<line x1="${ox}" y1="${y}" x2="${ox + width}" y2="${y}" 
                     stroke="#e0e0e0" stroke-width="0.5"/>`;
    }
    
    return grid;
}

function displayMeasurements() {
    const m = calculatedMeasurements;
    const tbody = document.getElementById('measurementsBody');
    
    if (!tbody) {
        console.error('❌ measurementsBody not found!');
        return;
    }
    
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
        ['Waist (1/4)', m.waistQuarter.toFixed(2), 'For pattern']
    ];
    
    tbody.innerHTML = measurements.map(([name, value, notes]) => `
        <tr>
            <td><strong>${name}</strong></td>
            <td>${value}"</td>
            <td style="color: #666; font-size: 0.9em;">${notes}</td>
        </tr>
    `).join('');
    
    console.log('✅ Measurements table updated');
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
            <li>Draw a rectangle: <strong>${m.chestQuarter.toFixed(2)}" width</strong> × <strong>${m.blouseLength}" height</strong></li>
            
            <li><strong>Neck:</strong> From top-left, mark ${m.neckLoose.toFixed(2)}" across and ${m.neckDepth}" down. Draw smooth curve.</li>
            
            <li><strong>Shoulder:</strong> Mark ${m.shoulderHalf.toFixed(2)}" from left at top</li>
            
            <li><strong>Armhole:</strong> From shoulder point, draw curve to side at depth ${m.armholeDepth.toFixed(1)}"</li>
            
            <li><strong>Side seam:</strong> Draw straight line down from chest width</li>
            
            <li><strong>Hem:</strong> Draw bottom line across width</li>
            
            <li>Add <strong>0.5" seam allowance</strong> on all edges except center back</li>
        </ol>
        
        <div style="background: #f0e6ff; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #667eea;">
            <strong style="color: #667eea;">💡 Pro Tips:</strong>
            <ul style="margin-top: 8px; padding-left: 20px;">
                <li>Use French curve for smooth neck and armhole</li>
                <li>Always make a muslin/toile first</li>
                <li>Check measurements twice before cutting fabric</li>
                <li>Add extra 1" for hem allowance at bottom</li>
            </ul>
        </div>
    `;
}

function downloadSVG() {
    console.log('📥 Downloading SVG...');
    
    const svgElement = document.getElementById('patternSvg');
    if (!svgElement) {
        alert('❌ No pattern generated yet!');
        return;
    }
    
    try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `blouse_pattern_${currentStyle}_size${calculatedMeasurements.blouseSize}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ SVG downloaded');
    } catch (error) {
        console.error('❌ Download error:', error);
        alert('Error downloading: ' + error.message);
    }
}

function printPattern() {
    console.log('🖨️ Printing pattern...');
    
    const svgElement = document.getElementById('patternSvg');
    if (!svgElement) {
        alert('❌ No pattern to print!');
        return;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Blouse Pattern - Size ${calculatedMeasurements.blouseSize}</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif;
                }
                svg { 
                    max-width: 100%; 
                    height: auto;
                }
                @media print {
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <h2 style="text-align: center; color: #667eea;">
                ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
            </h2>
            <p style="text-align: center; color: #666;">
                Size ${calculatedMeasurements.blouseSize} - Haseena Fashion World
            </p>
            ${svgElement.outerHTML}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    console.log('✅ Print dialog opened');
}
