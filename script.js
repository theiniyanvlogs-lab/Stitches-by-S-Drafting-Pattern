// Global Variables
let currentStyle = 'basic';
let calculatedMeasurements = {};
let generatedSVGContent = '';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ App initialized successfully');
    
    // Initialize style buttons
    initializeStyleButtons();
    
    // Initialize generate button
    initializeGenerateButton();
    
    // Initialize download and print buttons
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
    } else {
        console.error('❌ Generate button not found!');
    }
}

function initializeActionButtons() {
    // Download button
    const downloadBtn = document.getElementById('downloadSvg');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadSVG();
        });
    }
    
    // Print button
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
        // Get all input values
        const blouseSize = parseFloat(document.getElementById('blouseSize').value);
        const blouseLength = parseFloat(document.getElementById('blouseLength').value);
        const chestSize = parseFloat(document.getElementById('chestSize').value);
        const shoulderSize = parseFloat(document.getElementById('shoulderSize').value);
        const armRound = parseFloat(document.getElementById('armRound').value);
        const neckRound = parseFloat(document.getElementById('neckRound').value);
        const backNeckLength = parseFloat(document.getElementById('backNeckLength').value);
        const waistSize = parseFloat(document.getElementById('waistSize').value);

        console.log('📏 Input measurements:', {
            blouseSize, blouseLength, chestSize, shoulderSize,
            armRound, neckRound, backNeckLength, waistSize
        });

        // Validate all inputs
        if (!blouseSize || !blouseLength || !chestSize || !shoulderSize || 
            !armRound || !neckRound || !backNeckLength || !waistSize) {
            alert('⚠️ Please fill in ALL measurement fields!');
            return;
        }

        // Calculate derived measurements
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
            neckLoose: (neckRound / 4) + 0.5,
            neckDepth: backNeckLength,
            armholeDepth: (armRound / 2) + 1
        };

        console.log('📐 Calculated measurements:', calculatedMeasurements);

        // Show pattern section
        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
            console.log('✅ Pattern section displayed');
        } else {
            console.error('❌ patternSection element not found!');
        }

        // Generate SVG pattern
        generateSVGPattern();
        
        // Display measurements table
        displayMeasurementsTable();
        
        // Display instructions
        displayInstructions();

        // Scroll to pattern section
        setTimeout(() => {
            if (patternSection) {
                patternSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        
        console.log('✅ Pattern generation completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in generatePattern:', error);
        alert('Error generating pattern: ' + error.message);
    }
}

function generateSVGPattern() {
    const m = calculatedMeasurements;
    const scale = 20; // pixels per inch
    
    // Pattern dimensions
    const chestWidth = m.chestQuarter * scale;
    const length = m.blouseLength * scale;
    
    // Neck calculations
    const neckWidth = m.neckLoose * scale;
    const neckDepthPx = m.neckDepth * scale;
    
    // Shoulder
    const shoulderWidth = m.shoulderHalf * scale;
    
    // Armhole
    const armholeDepth = m.armholeDepth * scale;
    
    // SVG dimensions with padding
    const svgWidth = chestWidth + 200;
    const svgHeight = length + 200;
    const offsetX = 100;
    const offsetY = 100;
    
    // Create SVG string
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}" 
     height="${svgHeight}" 
     viewBox="0 0 ${svgWidth} ${svgHeight}">
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="#fafafa"/>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="40" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333">
        ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
    </text>
    <text x="${svgWidth/2}" y="65" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="14" fill="#666">
        Size ${m.blouseSize} - Haseena Fashion World
    </text>
    
    <!-- Main pattern rectangle -->
    <rect x="${offsetX}" y="${offsetY}" 
          width="${chestWidth}" 
          height="${length}"
          fill="#f0e6ff" 
          stroke="#667eea" 
          stroke-width="3"/>
    
    <!-- Neck curve -->
    <path d="M ${offsetX} ${offsetY} 
             Q ${offsetX + neckWidth} ${offsetY} 
               ${offsetX + neckWidth} ${offsetY + neckDepthPx}"
          fill="none" 
          stroke="#e91e63" 
          stroke-width="2.5"
          stroke-dasharray="5,3"/>
    
    <!-- Shoulder line -->
    <line x1="${offsetX}" y1="${offsetY}" 
          x2="${offsetX + shoulderWidth}" y2="${offsetY}"
          stroke="#333" 
          stroke-width="2" 
          stroke-dasharray="5,3"/>
    
    <!-- Armhole curve -->
    <path d="M ${offsetX + shoulderWidth} ${offsetY}
             Q ${offsetX + shoulderWidth + 30} ${offsetY + armholeDepth/2}
               ${offsetX + chestWidth} ${offsetY + armholeDepth}"
          fill="none" 
          stroke="#e91e63" 
          stroke-width="2.5"/>
    
    <!-- Center back line -->
    <line x1="${offsetX}" y1="${offsetY}"
          x2="${offsetX}" y2="${offsetY + length}"
          stroke="#333" 
          stroke-width="2" 
          stroke-dasharray="5,3"/>
    
    <!-- Side seam -->
    <line x1="${offsetX + chestWidth}" y1="${offsetY}"
          x2="${offsetX + chestWidth}" y2="${offsetY + length}"
          stroke="#333" 
          stroke-width="2"/>
    
    <!-- Hem line -->
    <line x1="${offsetX}" y1="${offsetY + length}"
          x2="${offsetX + chestWidth}" y2="${offsetY + length}"
          stroke="#333" 
          stroke-width="2"/>
    
    <!-- Measurement labels -->
    <text x="${offsetX + chestWidth/2}" y="${offsetY - 15}" 
          text-anchor="middle" font-family="Arial" font-size="14" 
          fill="#667eea" font-weight="bold">
        Chest: ${m.chestQuarter.toFixed(2)}"
    </text>
    
    <text x="${offsetX - 15}" y="${offsetY + length/2}" 
          text-anchor="middle" font-family="Arial" font-size="14" 
          fill="#667eea" font-weight="bold"
          transform="rotate(-90 ${offsetX - 15} ${offsetY + length/2})">
        Length: ${m.blouseLength}"
    </text>
    
    <text x="${offsetX + shoulderWidth/2}" y="${offsetY + 25}" 
          text-anchor="middle" font-family="Arial" font-size="12" 
          fill="#e91e63" font-weight="bold">
        Shoulder: ${m.shoulderHalf.toFixed(2)}"
    </text>
    
    <text x="${offsetX + chestWidth + 15}" y="${offsetY + armholeDepth}" 
          text-anchor="start" font-family="Arial" font-size="12" 
          fill="#e91e63" font-weight="bold">
        Armhole: ${m.armholeDepth.toFixed(1)}"
    </text>
    
    <!-- Grid pattern -->
    ${createGrid(offsetX, offsetY, chestWidth, length, scale)}
</svg>`;

    // Store for download
    generatedSVGContent = svgContent;
    window.generatedSVG = svgContent;
    
    // Try to insert into patternContainer
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svgContent;
        console.log('✅ SVG pattern inserted into patternContainer');
    } else {
        console.error('❌ patternContainer not found! Creating it...');
        createPatternContainer(svgContent);
    }
}

function createPatternContainer(svgContent) {
    // Find patternSection and add patternContainer if it doesn't exist
    const patternSection = document.getElementById('patternSection');
    if (patternSection) {
        const container = document.createElement('div');
        container.id = 'patternContainer';
        container.className = 'pattern-container';
        container.innerHTML = svgContent;
        patternSection.appendChild(container);
        console.log('✅ Created patternContainer dynamically');
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

function displayMeasurementsTable() {
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
    
    if (!instructionsDiv) {
        console.error('❌ instructionsText not found!');
        return;
    }
    
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
    
    console.log('✅ Instructions displayed');
}

function downloadSVG() {
    console.log('📥 Downloading SVG...');
    
    // Get SVG content
    let svgContent = generatedSVGContent || window.generatedSVG;
    
    if (!svgContent) {
        // Try to get from DOM
        const svgElement = document.querySelector('#patternContainer svg');
        if (svgElement) {
            svgContent = svgElement.outerHTML;
        }
    }
    
    if (!svgContent) {
        alert('❌ No pattern generated yet! Click "Generate Pattern" first.');
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
        
        console.log('✅ SVG downloaded successfully');
    } catch (error) {
        console.error('❌ Download error:', error);
        alert('Error downloading: ' + error.message);
    }
}

function printPattern() {
    console.log('🖨️ Printing pattern...');
    
    const svgElement = document.querySelector('#patternContainer svg');
    if (!svgElement) {
        alert('❌ No pattern to print! Generate a pattern first.');
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
    } catch (error) {
        console.error('❌ Print error:', error);
        alert('Error printing: ' + error.message);
    }
}
