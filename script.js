// Global Variables
let currentStyle = 'basic';
let calculatedMeasurements = {};

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const downloadSvgBtn = document.getElementById('downloadSvg');
const printPatternBtn = document.getElementById('printPattern');
const patternSection = document.getElementById('patternSection');
const patternSvg = document.getElementById('patternSvg');
const measurementsBody = document.getElementById('measurementsBody');
const instructionsText = document.getElementById('instructionsText');
const styleButtons = document.querySelectorAll('.style-btn');

// Style Selection
styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        styleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStyle = btn.dataset.style;
    });
});

// Generate Pattern
generateBtn.addEventListener('click', generatePattern);
downloadSvgBtn.addEventListener('click', downloadSVG);
printPatternBtn.addEventListener('click', () => window.print());

function generatePattern() {
    // Get input values
    const blouseSize = parseFloat(document.getElementById('blouseSize').value);
    const blouseLength = parseFloat(document.getElementById('blouseLength').value);
    const chestSize = parseFloat(document.getElementById('chestSize').value);
    const shoulderSize = parseFloat(document.getElementById('shoulderSize').value);
    const armRound = parseFloat(document.getElementById('armRound').value);
    const neckRound = parseFloat(document.getElementById('neckRound').value);
    const backNeckLength = parseFloat(document.getElementById('backNeckLength').value);
    const waistSize = parseFloat(document.getElementById('waistSize').value);

    // Validate inputs
    if (!blouseSize || !blouseLength || !chestSize || !shoulderSize || 
        !armRound || !neckRound || !backNeckLength || !waistSize) {
        alert('⚠️ Please fill in all measurement fields!');
        return;
    }

    // Calculate pattern measurements
    calculatedMeasurements = calculateMeasurements({
        blouseSize, blouseLength, chestSize, shoulderSize,
        armRound, neckRound, backNeckLength, waistSize
    });

    // Display measurements table
    displayMeasurements();

    // Generate SVG pattern
    generateSVG(currentStyle, calculatedMeasurements);

    // Display instructions
    displayInstructions(currentStyle, calculatedMeasurements);

    // Show pattern section
    patternSection.style.display = 'block';
    
    // Scroll to pattern
    patternSection.scrollIntoView({ behavior: 'smooth' });
}

function calculateMeasurements(inputs) {
    const {
        blouseSize, blouseLength, chestSize, shoulderSize,
        armRound, neckRound, backNeckLength, waistSize
    } = inputs;

    // Calculate derived measurements
    const chestQuarter = chestSize / 4;
    const shoulderHalf = shoulderSize / 2;
    const armRoundHalf = armRound / 2;
    const neckQuarter = neckRound / 4;
    const waistQuarter = waistSize / 4;

    // Style-specific calculations
    const styleCalcs = {
        basic: {
            neckLoose: neckQuarter + 0.25,
            neckDepth: backNeckLength - 2,
            shoulderWidth: shoulderHalf - 0.5,
            armholeDepth: armRoundHalf + 1,
            waistTaper: waistQuarter - 0.5
        },
        boat: {
            neckLoose: neckQuarter + 1,
            neckDepth: 3,
            shoulderWidth: shoulderHalf,
            armholeDepth: armRoundHalf + 1.5,
            backLength: backNeckLength + 1
        },
        pot: {
            neckLoose: neckQuarter + 0.5,
            neckDepth: backNeckLength + 3,
            neckPotLength: backNeckLength,
            neckBoxLength: 3,
            shoulderWidth: shoulderHalf - 0.5,
            armholeDepth: armRoundHalf + 1
        },
        katori: {
            neckLoose: neckQuarter,
            neckDepth: 6,
            shoulderWidth: shoulderHalf - 0.25,
            armholeDepth: armRoundHalf + 0.5,
            katoriCurve: chestQuarter * 0.6,
            beltLength: 2.5
        },
        temple: {
            neckLoose: neckQuarter + 0.5,
            neckDepth: backNeckLength,
            shoulderWidth: shoulderHalf,
            armholeDepth: armRoundHalf + 1,
            boxLength: backNeckLength + 3,
            templeCuts: 3
        },
        cutwork: {
            neckLoose: neckQuarter,
            neckDepth: backNeckLength + 2,
            shoulderWidth: shoulderHalf - 0.25,
            armholeDepth: armRoundHalf + 0.5,
            scallopCount: 5,
            scallopDepth: 0.5
        }
    };

    return {
        ...inputs,
        chestQuarter,
        shoulderHalf,
        armRoundHalf,
        neckQuarter,
        waistQuarter,
        ...styleCalcs[currentStyle]
    };
}

function displayMeasurements() {
    const m = calculatedMeasurements;
    const measurements = [
        ['Blouse Size', m.blouseSize, 'Input size'],
        ['Full Length', m.blouseLength, 'Total blouse length'],
        ['Chest/Bust', m.chestSize, 'Full chest measurement'],
        ['Chest (1/4)', m.chestQuarter.toFixed(2), 'For pattern drafting'],
        ['Shoulder', m.shoulderSize, 'Full shoulder'],
        ['Shoulder (1/2)', m.shoulderHalf.toFixed(2), 'Half shoulder'],
        ['Arm Round', m.armRound, 'Full arm circumference'],
        ['Neck Round', m.neckRound, 'Full neck circumference'],
        ['Neck (1/4)', m.neckQuarter.toFixed(2), 'For pattern drafting'],
        ['Back Neck Length', m.backNeckLength, 'Input back neck'],
        ['Waist', m.waistSize, 'Full waist measurement'],
        ['Waist (1/4)', m.waistQuarter.toFixed(2), 'For pattern drafting']
    ];

    // Add style-specific measurements
    if (currentStyle === 'pot') {
        measurements.push(['Neck Loose', m.neckLoose.toFixed(2), 'For pot neck']);
        measurements.push(['Neck Pot Length', m.neckPotLength, 'Depth of pot cut']);
        measurements.push(['Neck Box Length', m.neckBoxLength, 'Box at top of neck']);
    } else if (currentStyle === 'boat') {
        measurements.push(['Neck Loose', m.neckLoose.toFixed(2), 'Wide boat neck']);
        measurements.push(['Back Length', m.backLength, 'Back pattern length']);
    } else if (currentStyle === 'katori') {
        measurements.push(['Katori Curve', m.katoriCurve.toFixed(2), 'Side curve']);
        measurements.push(['Belt Length', m.beltLength, 'Waist belt']);
    }

    measurementsBody.innerHTML = measurements.map(([name, value, notes]) => `
        <tr>
            <td><strong>${name}</strong></td>
            <td>${value}"</td>
            <td>${notes}</td>
        </tr>
    `).join('');
}

function generateSVG(style, m) {
    // SVG dimensions
    const svgWidth = 600;
    const svgHeight = 700;
    const scale = 20; // pixels per inch
    const offsetX = 100;
    const offsetY = 50;

    let patternPath = '';
    let annotations = '';
    let title = '';

    switch(style) {
        case 'basic':
            patternPath = generateBasicPattern(m, scale, offsetX, offsetY);
            title = 'Basic Back Pattern';
            break;
        case 'boat':
            patternPath = generateBoatPattern(m, scale, offsetX, offsetY);
            title = 'Boat Neck Back Pattern';
            break;
        case 'pot':
            patternPath = generatePotPattern(m, scale, offsetX, offsetY);
            title = 'Pot Neck Back Pattern';
            break;
        case 'katori':
            patternPath = generateKatoriPattern(m, scale, offsetX, offsetY);
            title = 'Katori Back Pattern';
            break;
        case 'temple':
            patternPath = generateTemplePattern(m, scale, offsetX, offsetY);
            title = 'Temple Neck Back Pattern';
            break;
        case 'cutwork':
            patternPath = generateCutworkPattern(m, scale, offsetX, offsetY);
            title = 'Cut Work Back Pattern';
            break;
    }

    patternSvg.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .pattern-line { stroke: #333; stroke-width: 2; fill: none; }
                    .pattern-fill { fill: #f0e6ff; stroke: #667eea; stroke-width: 2; }
                    .dart-line { stroke: #e91e63; stroke-width: 1.5; stroke-dasharray: 5,5; }
                    .annotation { font-size: 12px; fill: #666; }
                    .measurement { font-size: 14px; fill: #667eea; font-weight: bold; }
                    .title { font-size: 18px; fill: #333; font-weight: bold; }
                    .grid { stroke: #eee; stroke-width: 0.5; }
                </style>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="0.5"/>
                </pattern>
            </defs>
            
            <!-- Background Grid -->
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- Title -->
            <text x="${svgWidth/2}" y="30" class="title" text-anchor="middle">${title}</text>
            <text x="${svgWidth/2}" y="50" class="annotation" text-anchor="middle">Size ${m.blouseSize} - Haseena Fashion World</text>
            
            <!-- Pattern -->
            ${patternPath}
            
            <!-- Annotations -->
            ${annotations}
        </svg>
    `;
}

function generateBasicPattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderHalf * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const waist = m.waistQuarter * scale;
    
    // Back pattern coordinates
    const x1 = ox, y1 = oy;
    const x2 = ox + chest, y2 = oy;
    const x3 = ox + chest, y3 = oy + length;
    const x4 = ox + waist + 20, y4 = oy + length;
    const x5 = ox + chest + 30, y5 = oy + length - armhole;
    const x6 = ox + shoulder, y6 = oy;
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} L ${x5} ${y5} L ${x6} ${y6} Z" />
        
        <!-- Neck curve -->
        <path class="pattern-line" d="M ${ox} ${oy} Q ${ox + neck} ${oy} ${ox + neck} ${oy + m.neckDepth * scale}" />
        
        <!-- Armhole curve -->
        <path class="pattern-line" d="M ${ox + shoulder} ${oy} Q ${ox + shoulder + 20} ${oy + armhole/2} ${ox + chest + 30} ${oy + armhole}" />
        
        <!-- Side seam -->
        <line class="pattern-line" x1="${ox + chest}" y1="${oy + length}" x2="${ox + waist + 20}" y2="${oy + length}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 15} ${oy + length} L ${ox + chest/2} ${oy + length - 80} L ${ox + chest/2 + 15} ${oy + length}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox - 10}" y="${oy + length/2}" text-anchor="middle" transform="rotate(-90 ${ox - 10} ${oy + length/2})">Length: ${m.blouseLength}"</text>
        <text class="measurement" x="${ox + shoulder/2}" y="${oy + 20}" text-anchor="middle">Shoulder: ${m.shoulderHalf.toFixed(2)}"</text>
    `;
}

function generateBoatPattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderWidth * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const backLength = m.backLength * scale;
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + chest} ${oy} L ${ox + chest} ${oy + length} L ${ox + chest + 30} ${oy + length - armhole} L ${ox + shoulder + 20} ${oy} L ${ox + shoulder} ${oy} Z" />
        
        <!-- Boat neck wide curve -->
        <path class="pattern-line" d="M ${ox} ${oy} Q ${ox + chest/2} ${oy + neck/2} ${ox + chest} ${oy}" />
        
        <!-- Scallop details for boat neck -->
        <path class="pattern-line" d="M ${ox + chest*0.3} ${oy + neck*0.3} Q ${ox + chest*0.35} ${oy + neck*0.5} ${ox + chest*0.4} ${oy + neck*0.3}" />
        <path class="pattern-line" d="M ${ox + chest*0.6} ${oy + neck*0.3} Q ${ox + chest*0.65} ${oy + neck*0.5} ${ox + chest*0.7} ${oy + neck*0.3}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 20} ${oy + length} L ${ox + chest/2} ${oy + length - 100} L ${ox + chest/2 + 20} ${oy + length}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox + chest/2}" y="${oy + neck + 20}" text-anchor="middle">Neck: ${m.neckLoose.toFixed(2)}"</text>
        <text class="measurement" x="${ox - 10}" y="${oy + length/2}" text-anchor="middle" transform="rotate(-90 ${ox - 10} ${oy + length/2})">Length: ${m.blouseLength}"</text>
    `;
}

function generatePotPattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderWidth * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const neckPot = m.neckPotLength * scale;
    const neckBox = m.neckBoxLength * scale;
    const neckDeep = m.neckDepth * scale;
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + chest} ${oy} L ${ox + chest} ${oy + length} L ${ox + chest + 30} ${oy + length - armhole} L ${ox + shoulder + 20} ${oy} L ${ox + shoulder} ${oy} Z" />
        
        <!-- Pot neck design -->
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + neck} ${oy} L ${ox + neck} ${oy + neckBox} L ${ox + neckBox/2} ${oy + neckDeep} L ${ox} ${oy + neckBox} Z" />
        
        <!-- Pot curve -->
        <path class="pattern-line" d="M ${ox + neckBox/2} ${oy + neckDeep} Q ${ox + neckBox/2 + 30} ${oy + neckDeep + 20} ${ox + neckBox/2} ${oy + neckPot}" />
        
        <!-- Armhole curve -->
        <path class="pattern-line" d="M ${ox + shoulder} ${oy} Q ${ox + shoulder + 20} ${oy + armhole/2} ${ox + chest + 30} ${oy + armhole}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 20} ${oy + length} L ${ox + chest/2} ${oy + length - 90} L ${ox + chest/2 + 20} ${oy + length}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox - 15}" y="${oy + neckDeep/2}" text-anchor="middle" transform="rotate(-90 ${ox - 15} ${oy + neckDeep/2})">Neck Deep: ${m.neckDepth.toFixed(1)}"</text>
        <text class="measurement" x="${ox + chest/2}" y="${oy + neckPot + 30}" text-anchor="middle">Pot Length: ${m.neckPotLength}"</text>
    `;
}

function generateKatoriPattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderWidth * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const katoriCurve = m.katoriCurve * scale;
    const beltLength = m.beltLength * scale;
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + chest} ${oy} L ${ox + chest} ${oy + length} L ${ox + chest + 30} ${oy + length - armhole} L ${ox + shoulder + 20} ${oy} L ${ox + shoulder} ${oy} Z" />
        
        <!-- Neck curve -->
        <path class="pattern-line" d="M ${ox} ${oy} Q ${ox + neck} ${oy} ${ox + neck} ${oy + m.neckDepth * scale}" />
        
        <!-- Katori side curve -->
        <path class="pattern-line" d="M ${ox} ${oy + length - beltLength} Q ${ox + katoriCurve} ${oy + length - beltLength/2} ${ox + chest} ${oy + length}" />
        
        <!-- Waist belt -->
        <rect x="${ox}" y="${oy + length - beltLength}" width="${chest}" height="${beltLength}" fill="none" stroke="#e91e63" stroke-width="2" />
        
        <!-- Armhole curve -->
        <path class="pattern-line" d="M ${ox + shoulder} ${oy} Q ${ox + shoulder + 20} ${oy + armhole/2} ${ox + chest + 30} ${oy + armhole}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 15} ${oy + length} L ${ox + chest/2} ${oy + length - 80} L ${ox + chest/2 + 15} ${oy + length}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox + chest + 40}" y="${oy + length - beltLength/2}" text-anchor="middle">Katori: ${m.katoriCurve.toFixed(2)}"</text>
        <text class="measurement" x="${ox - 10}" y="${oy + length/2}" text-anchor="middle" transform="rotate(-90 ${ox - 10} ${oy + length/2})">Length: ${m.blouseLength}"</text>
    `;
}

function generateTemplePattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderWidth * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const boxLength = m.boxLength * scale;
    const templeCuts = m.templeCuts;
    
    // Create temple/jagged edges
    let templePath = `M ${ox} ${oy}`;
    const cutWidth = chest / (templeCuts * 2);
    const cutDepth = 10;
    
    for (let i = 0; i < templeCuts; i++) {
        const x = ox + (i * 2 + 1) * cutWidth;
        templePath += ` L ${x} ${oy - cutDepth} L ${x + cutWidth} ${oy}`;
    }
    templePath += ` L ${ox + chest} ${oy}`;
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + chest} ${oy} L ${ox + chest} ${oy + length} L ${ox + chest + 30} ${oy + length - armhole} L ${ox + shoulder + 20} ${oy} L ${ox + shoulder} ${oy} Z" />
        
        <!-- Temple cuts -->
        <path class="pattern-line" d="${templePath}" stroke="#e91e63" stroke-width="2" />
        
        <!-- Neck curve -->
        <path class="pattern-line" d="M ${ox} ${oy} Q ${ox + neck} ${oy} ${ox + neck} ${oy + m.neckDepth * scale}" />
        
        <!-- Box design -->
        <rect x="${ox}" y="${oy + length - boxLength}" width="${chest}" height="${boxLength}" fill="none" stroke="#667eea" stroke-width="2" />
        
        <!-- Armhole curve -->
        <path class="pattern-line" d="M ${ox + shoulder} ${oy} Q ${ox + shoulder + 20} ${oy + armhole/2} ${ox + chest + 30} ${oy + armhole}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 20} ${oy + length - boxLength} L ${ox + chest/2} ${oy + length - boxLength - 80} L ${ox + chest/2 + 20} ${oy + length - boxLength}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox + chest/2}" y="${oy + length - boxLength/2}" text-anchor="middle">Box: ${m.boxLength}"</text>
    `;
}

function generateCutworkPattern(m, scale, ox, oy) {
    const length = m.blouseLength * scale;
    const chest = m.chestQuarter * scale;
    const shoulder = m.shoulderWidth * scale;
    const neck = m.neckLoose * scale;
    const armhole = m.armholeDepth * scale;
    const scallopCount = m.scallopCount;
    const scallopDepth = m.scallopDepth * scale;
    
    // Create scalloped edges
    const scallopWidth = chest / scallopCount;
    let scallopPath = '';
    
    for (let i = 0; i < scallopCount; i++) {
        const x = ox + i * scallopWidth;
        scallopPath += ` M ${x} ${oy + length} Q ${x + scallopWidth/2} ${oy + length - scallopDepth} ${x + scallopWidth} ${oy + length}`;
    }
    
    // Side scallops
    let sideScallopPath = `M ${ox} ${oy + length - armhole}`;
    for (let i = 0; i < scallopCount; i++) {
        const y = oy + length - armhole + i * (armhole/scallopCount);
        sideScallopPath += ` Q ${ox - scallopDepth} ${y + armhole/scallopCount/2} ${ox} ${y + armhole/scallopCount}`;
    }
    
    return `
        <rect class="pattern-fill" x="${ox}" y="${oy}" width="${chest}" height="${length}" />
        <path class="pattern-line" d="M ${ox} ${oy} L ${ox + chest} ${oy} L ${ox + chest} ${oy + length} L ${ox + chest + 30} ${oy + length - armhole} L ${ox + shoulder + 20} ${oy} L ${ox + shoulder} ${oy} Z" />
        
        <!-- Bottom scallops -->
        <path class="pattern-line" d="${scallopPath}" stroke="#e91e63" stroke-width="2" fill="none" />
        
        <!-- Side scallops -->
        <path class="pattern-line" d="${sideScallopPath}" stroke="#e91e63" stroke-width="2" fill="none" />
        
        <!-- Neck curve -->
        <path class="pattern-line" d="M ${ox} ${oy} Q ${ox + neck} ${oy} ${ox + neck} ${oy + m.neckDepth * scale}" />
        
        <!-- Armhole curve -->
        <path class="pattern-line" d="M ${ox + shoulder} ${oy} Q ${ox + shoulder + 20} ${oy + armhole/2} ${ox + chest + 30} ${oy + armhole}" />
        
        <!-- Dart -->
        <path class="dart-line" d="M ${ox + chest/2 - 15} ${oy + length} L ${ox + chest/2} ${oy + length - 80} L ${ox + chest/2 + 15} ${oy + length}" />
        
        <!-- Measurements -->
        <text class="measurement" x="${ox + chest/2}" y="${oy - 10}" text-anchor="middle">Chest: ${m.chestQuarter.toFixed(2)}"</text>
        <text class="measurement" x="${ox - 15}" y="${oy + length/2}" text-anchor="middle" transform="rotate(-90 ${ox - 15} ${oy + length/2})">Length: ${m.blouseLength}"</text>
    `;
}

function displayInstructions(style, m) {
    const instructions = {
        basic: `
            <ol>
                <li>Draw a rectangle with width = <span class="highlight">${m.chestQuarter.toFixed(2)}"</span> and height = <span class="highlight">${m.blouseLength}"</span></li>
                <li>Mark shoulder width: <span class="highlight">${m.shoulderHalf.toFixed(2)}"</span> from left</li>
                <li>Draw neck curve: <span class="highlight">${m.neckLoose.toFixed(2)}"</span> wide, <span class="highlight">${m.neckDepth.toFixed(1)}"</span> deep</li>
                <li>Mark armhole depth: <span class="highlight">${m.armholeDepth.toFixed(1)}"</span> from top</li>
                <li>Draw armhole curve from shoulder to side</li>
                <li>Add dart at center bottom for fitting</li>
                <li>Taper side seam to waist: <span class="highlight">${m.waistQuarter.toFixed(2)}"</span></li>
            </ol>
        `,
        boat: `
            <ol>
                <li>Draw base rectangle: <span class="highlight">${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</span></li>
                <li>Draw wide boat neck: <span class="highlight">${m.neckLoose.toFixed(2)}"</span> wide</li>
                <li>Add scallop details along neckline</li>
                <li>Mark shoulder: <span class="highlight">${m.shoulderHalf.toFixed(2)}"</span></li>
                <li>Draw armhole curve to depth <span class="highlight">${m.armholeDepth.toFixed(1)}"</span></li>
                <li>Add back length: <span class="highlight">${m.backLength}"</span></li>
                <li>Add center back dart for fitting</li>
            </ol>
        `,
        pot: `
            <ol>
                <li>Draw base rectangle: <span class="highlight">${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</span></li>
                <li>Mark neck loose: <span class="highlight">${m.neckLoose.toFixed(2)}"</span></li>
                <li>Draw neck box: <span class="highlight">${m.neckBoxLength}"</span> deep</li>
                <li>Draw pot neck depth: <span class="highlight">${m.neckPotLength}"</span></li>
                <li>Create curved pot shape</li>
                <li>Mark shoulder and armhole</li>
                <li>Add side seam and waist taper</li>
            </ol>
        `,
        katori: `
            <ol>
                <li>Draw base rectangle: <span class="highlight">${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</span></li>
                <li>Mark neck: <span class="highlight">${m.neckLoose.toFixed(2)}"</span></li>
                <li>Draw katori curve on side: <span class="highlight">${m.katoriCurve.toFixed(2)}"</span></li>
                <li>Mark waist belt: <span class="highlight">${m.beltLength}"</span></li>
                <li>Draw curved seam from belt to hem</li>
                <li>Add armhole and shoulder</li>
                <li>Add center back dart</li>
            </ol>
        `,
        temple: `
            <ol>
                <li>Draw base rectangle: <span class="highlight">${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</span></li>
                <li>Create temple/jagged cuts along neckline</li>
                <li>Draw box design at bottom: <span class="highlight">${m.boxLength}"</span></li>
                <li>Mark neck depth: <span class="highlight">${m.neckDepth}"</span></li>
                <li>Add armhole and shoulder</li>
                <li>Add decorative temple edges</li>
                <li>Add center dart</li>
            </ol>
        `,
        cutwork: `
            <ol>
                <li>Draw base rectangle: <span class="highlight">${m.chestQuarter.toFixed(2)}" × ${m.blouseLength}"</span></li>
                <li>Draw scalloped edges at bottom: <span class="highlight">${m.scallopCount} scallops</span></li>
                <li>Add side scallops along armhole</li>
                <li>Mark neck: <span class="highlight">${m.neckLoose.toFixed(2)}"</span></li>
                <li>Draw deep neck: <span class="highlight">${m.neckDepth.toFixed(1)}"</span></li>
                <li>Add armhole curve</li>
                <li>Add center dart</li>
            </ol>
        `
    };
    
    instructionsText.innerHTML = instructions[style] || instructions.basic;
}

function downloadSVG() {
    const svgData = patternSvg.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blouse_pattern_${currentStyle}_size${calculatedMeasurements.blouseSize}.svg`;
    link.click();
    URL.revokeObjectURL(url);
}