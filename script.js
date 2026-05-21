// Global Variables
let currentStyle = 'basic';
let calculatedMeasurements = {};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ App loaded successfully');
    
    // Get elements
    const generateBtn = document.getElementById('generateBtn');
    const styleButtons = document.querySelectorAll('.style-btn');
    
    // Check if button exists
    if (!generateBtn) {
        console.error('❌ Generate button not found!');
        return;
    }
    
    console.log('✅ Generate button found');
    
    // Style button click handlers
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            styleButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            currentStyle = this.dataset.style;
            console.log('🎨 Style selected:', currentStyle);
        });
    });
    
    // Generate button click handler
    generateBtn.addEventListener('click', function(e) {
        console.log('🔘 Generate button clicked');
        e.preventDefault();
        generatePattern();
    });
});

function generatePattern() {
    console.log('🚀 Starting pattern generation...');
    
    try {
        // Get input values
        const blouseSize = parseFloat(document.getElementById('blouseSize').value);
        const blouseLength = parseFloat(document.getElementById('blouseLength').value);
        const chestSize = parseFloat(document.getElementById('chestSize').value);
        const shoulderSize = parseFloat(document.getElementById('shoulderSize').value);
        const armRound = parseFloat(document.getElementById('armRound').value);
        const neckRound = parseFloat(document.getElementById('neckRound').value);
        const backNeckLength = parseFloat(document.getElementById('backNeckLength').value);
        const waistSize = parseFloat(document.getElementById('waistSize').value);

        console.log('📏 Measurements:', {
            blouseSize, blouseLength, chestSize, shoulderSize,
            armRound, neckRound, backNeckLength, waistSize
        });

        // Validate inputs
        if (!blouseSize || !blouseLength || !chestSize || !shoulderSize || 
            !armRound || !neckRound || !backNeckLength || !waistSize) {
            alert('⚠️ Please fill in ALL measurement fields!');
            return;
        }

        // Calculate measurements
        calculatedMeasurements = calculateMeasurements({
            blouseSize, blouseLength, chestSize, shoulderSize,
            armRound, neckRound, backNeckLength, waistSize
        });

        console.log('📐 Calculated measurements:', calculatedMeasurements);

        // Show pattern section
        const patternSection = document.getElementById('patternSection');
        if (patternSection) {
            patternSection.style.display = 'block';
            console.log('✅ Pattern section displayed');
        }

        // Generate and display pattern
        displayPatternSVG();
        displayMeasurementsTable();
        displayInstructions();

        // Scroll to pattern
        patternSection.scrollIntoView({ behavior: 'smooth' });
        
        console.log('✅ Pattern generation complete!');
        
    } catch (error) {
        console.error('❌ Error generating pattern:', error);
        alert('❌ Error: ' + error.message);
    }
}

function calculateMeasurements(inputs) {
    const {
        blouseSize, blouseLength, chestSize, shoulderSize,
        armRound, neckRound, backNeckLength, waistSize
    } = inputs;

    return {
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
}

function displayPatternSVG() {
    const m = calculatedMeasurements;
    const scale = 20; // pixels per inch
    const offsetX = 50;
    const offsetY = 100;
    
    // Calculate dimensions
    const width = m.chestQuarter * scale + 100;
    const height = m.blouseLength * scale + 150;
    
    // Create SVG
    let svgContent = `
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 600px; border: 2px solid #667eea; border-radius: 10px;">
            <!-- Background -->
            <rect width="100%" height="100%" fill="#fafafa"/>
            
            <!-- Title -->
            <text x="${width/2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
                ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern - Size ${m.blouseSize}
            </text>
            
            <!-- Pattern Rectangle -->
            <rect x="${offsetX}" y="${offsetY}" 
                  width="${m.chestQuarter * scale}" 
                  height="${m.blouseLength * scale}"
                  fill="#f0e6ff" 
                  stroke="#667eea" 
                  stroke-width="2"/>
            
            <!-- Neck Curve -->
            <path d="M ${offsetX} ${offsetY} 
                     Q ${offsetX + m.neckLoose * scale} ${offsetY} 
                       ${offsetX + m.neckLoose * scale} ${offsetY + m.neckDepth * scale}"
                  fill="none" 
                  stroke="#e91e63" 
                  stroke-width="2"/>
            
            <!-- Armhole Curve -->
            <path d="M ${offsetX + m.shoulderHalf * scale} ${offsetY}
                     Q ${offsetX + m.shoulderHalf * scale + 20} ${offsetY + m.armholeDepth * scale / 2}
                       ${offsetX + m.chestQuarter * scale + 30} ${offsetY + m.armholeDepth * scale}"
                  fill="none" 
                  stroke="#e91e63" 
                  stroke-width="2"/>
            
            <!-- Shoulder Line -->
            <line x1="${offsetX}" y1="${offsetY}" 
                  x2="${offsetX + m.shoulderHalf * scale}" y2="${offsetY}"
                  stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
            
            <!-- Side Seam -->
            <line x1="${offsetX + m.chestQuarter * scale}" y1="${offsetY}"
                  x2="${offsetX + m.chestQuarter * scale}" y2="${offsetY + m.blouseLength * scale}"
                  stroke="#333" stroke-width="2"/>
            
            <!-- Center Back Line -->
            <line x1="${offsetX}" y1="${offsetY}"
                  x2="${offsetX}" y2="${offsetY + m.blouseLength * scale}"
                  stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
            
            <!-- Measurements Text -->
            <text x="${offsetX + m.chestQuarter * scale / 2}" y="${offsetY - 10}" 
                  text-anchor="middle" font-size="12" fill="#667eea" font-weight="bold">
                Chest: ${m.chestQuarter.toFixed(2)}"
            </text>
            
            <text x="${offsetX - 10}" y="${offsetY + m.blouseLength * scale / 2}" 
                  text-anchor="middle" font-size="12" fill="#667eea" font-weight="bold"
                  transform="rotate(-90 ${offsetX - 10} ${offsetY + m.blouseLength * scale / 2})">
                Length: ${m.blouseLength}"
            </text>
            
            <text x="${offsetX + m.shoulderHalf * scale / 2}" y="${offsetY + 20}" 
                  text-anchor="middle" font-size="12" fill="#667eea" font-weight="bold">
                Shoulder: ${m.shoulderHalf.toFixed(2)}"
            </text>
            
            <!-- Grid lines -->
            ${generateGridLines(offsetX, offsetY, m.chestQuarter * scale, m.blouseLength * scale, scale)}
        </svg>
    `;
    
    const patternContainer = document.getElementById('patternContainer');
    if (patternContainer) {
        patternContainer.innerHTML = svgContent;
        console.log('✅ SVG pattern displayed');
    }
}

function generateGridLines(ox, oy, width, height, spacing) {
    let lines = '';
    // Vertical lines
    for (let x = ox; x <= ox + width; x += spacing * 2) {
        lines += `<line x1="${x}" y1="${oy}" x2="${x}" y2="${oy + height}" stroke="#e0e0e0" stroke-width="0.5"/>`;
    }
    // Horizontal lines
    for (let y = oy; y <= oy + height; y += spacing * 2) {
        lines += `<line x1="${ox}" y1="${y}" x2="${ox + width}" y2="${y}" stroke="#e0e0e0" stroke-width="0.5"/>`;
    }
    return lines;
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
        ['Neck Round', m.neckRound, 'Neck circumference'],
        ['Neck Loose', m.neckLoose.toFixed(2), 'Neck ease'],
        ['Back Neck Length', m.backNeckLength, 'Neck depth'],
        ['Waist (Full)', m.waistSize, 'Full waist'],
        ['Armhole Depth', m.armholeDepth.toFixed(2), 'Armhole']
    ];
    
    tbody.innerHTML = measurements.map(([name, value, notes]) => `
        <tr>
            <td><strong>${name}</strong></td>
            <td>${value}"</td>
            <td style="color: #666; font-size: 0.9em;">${notes}</td>
        </tr>
    `).join('');
    
    console.log('✅ Measurements table displayed');
}

function displayInstructions() {
    const m = calculatedMeasurements;
    const instructionsDiv = document.getElementById('instructionsText');
    
    if (!instructionsDiv) return;
    
    const instructions = `
        <h3 style="color: #667eea; margin-bottom: 15px;">
            <i class="fas fa-info-circle"></i> Drafting Instructions for ${currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1)} Back Pattern
        </h3>
        <ol style="line-height: 1.8;">
            <li>Draw a rectangle with width <strong>${m.chestQuarter.toFixed(2)}"</strong> (1/4 chest) and height <strong>${m.blouseLength}"</strong> (blouse length)</li>
            
            <li>Mark shoulder width: <strong>${m.shoulderHalf.toFixed(2)}"</strong> from the left edge at the top</li>
            
            <li>Draw neck curve:
                <ul>
                    <li>Width: <strong>${m.neckLoose.toFixed(2)}"</strong></li>
                    <li>Depth: <strong>${m.neckDepth}"</strong></li>
                    <li>Draw a smooth curve from top-left corner</li>
                </ul>
            </li>
            
            <li>Mark armhole depth: <strong>${m.armholeDepth.toFixed(1)}"</strong> from the top on the right side</li>
            
            <li>Draw armhole curve from shoulder point to side seam</li>
            
            <li>Draw side seam straight down from chest width to hem</li>
            
            <li>Add ${m.blouseLength - 1}" length for hem allowance if needed</li>
            
            <li>Mark waist at <strong>${m.waistSize / 4}"</strong> for fitting (optional tapering)</li>
            
            <li>Add seam allowance of 0.5" on all sides except center back</li>
        </ol>
        
        <div style="background: #f0e6ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <strong style="color: #667eea;">💡 Tips:</strong>
            <ul style="margin-top: 8px;">
                <li>Always add seam allowance before cutting fabric</li>
                <li>Use French curve for smooth neck and armhole curves</li>
                <li>Check measurements twice before cutting</li>
                <li>Make a muslin/toile first for expensive fabrics</li>
            </ul>
        </div>
    `;
    
    instructionsDiv.innerHTML = instructions;
    console.log('✅ Instructions displayed');
}
