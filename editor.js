// Pre defined stuff
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Global variables
let pngData = null;
let jsonData = null;
let scale = 1;
let offset = {
    x: 0,
    y: 0
};
let characters = {};
let selectedCharacter = null;
let mode = null; // 'Animation' or 'Attack'
let categories = null;
let items = null;
let data = null;
let animationData = null;

function selectItem(item) {
    console.log("Selected item:", item);
    const dropdown = getAndClear('data');
    
    data = items[item];
    console.log(data)

    if (mode === 'Animation') {
        animationData = data;
    } else {
        animationData = null;
    }

    for (const key in data) {
        const option = document.createElement('option');
        option.value = `{${key}: ${key}`
        option.text = key;
        option.onclick = function() {
            console.log("Selected data:", key);
        }
        dropdown.appendChild(option);
    }

    drawImageOnCanvas(pngData);
}

function selectCategory(category) {
    items = categories[category];
    console.log("Selected category:", category);

    const dropdown = getAndClear('items');
    // Reset childs
    getAndClear('data');

    for (const item in items) {
        const option = document.createElement('option');
        option.value = item;
        option.text = item;
        option.onclick = function() {
            selectItem(item);
        }
        dropdown.appendChild(option);
    }
}    

function selectType(type) {
    mode = type;
    console.log("Selected type:", mode);

    const dropdown = getAndClear('categories')
    categories = characters[selectedCharacter][mode === 'Animation' ? 'animations' : 'attacks'];
    // Reset childs
    getAndClear('items');
    getAndClear('data');

    for (const category in categories) {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        option.onclick = function() {
            selectCategory(category);
        }
        dropdown.appendChild(option);
    }
}

function selectCharacter(character) {
    selectedCharacter = character;
    console.log("Selected character:", selectedCharacter);
    
    const dropdown = getAndClear('type');
    // Reset childs
    getAndClear('categories');
    getAndClear('items');
    getAndClear('data');
    
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');

    option1.value = 'Animation';
    option1.text = 'Animation';
    option1.onclick = function() {
        selectType('Animation');
    }
    option2.value = 'Attack';
    option2.text = 'Attack';
    option2.onclick = function() {
        selectType('Attack');
    }
    dropdown.appendChild(option1);
    dropdown.appendChild(option2);

}

function getAndClear(id) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = '';

    return dropdown;
}

function highlightFrames() {
    const frames = animationData.frameTime.length;
    const startPos = animationData.spriteSheetStart;
    const endPos = animationData.spriteSheetEnd;
    const frameWidth = (endPos.x - startPos.x) / frames;
    const frameHeight = endPos.y - startPos.y;

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = scale;
    for (let i = 0; i < frames; i++) {
        ctx.strokeRect(
            offset.x + startPos.x*scale + i*frameWidth*scale,
            offset.y + startPos.y*scale,
            frameWidth*scale,
            frameHeight*scale
        );
    }
    ctx.globalAlpha = 1;
}


// Function to handle PNG data
function handlePngData(data) {
    pngData = data;
    // console.log("PNG data stored:", pngData);
    drawImageOnCanvas(pngData);
}
// Function to handle JSON data
function handleJsonData(data) {
    jsonData = data;
    console.log("JSON data stored:", jsonData);
    
    // Extract relevant data
    characters = jsonData.characters;

    // Add characters to the dropdown
    const dropdown = document.getElementById('characters');
    
    for (const character in characters) {
        const option = document.createElement('option');
        option.value = character;
        option.text = character;
        option.onclick = function() {
            selectCharacter(character);
        }
        dropdown.appendChild(option);
    }
}
// Function to draw the PNG image on a canvas
function drawImageOnCanvas(imageData) {
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offset.x, offset.y, img.width*scale, img.height*scale);

        if (animationData) {
            highlightFrames();
        }
    };
    img.src = imageData;
}
// Keyboard event listener
document.addEventListener('keydown', function(event) {
    // Save
    if (event.code === 'KeyS' && event.ctrlKey) {
        event.preventDefault();
        console.log("Ctrl+S pressed");
        // TODO: Save the current image
    } 
    // Zoom in
    if (event.code === 'Plus' || event.code === 'BracketRight' || event.code === 'NumpadAdd') {
        event.preventDefault();
        scale *= 1.1;
        drawImageOnCanvas(pngData);
    }
    // Zoom out
    if (event.code === 'Minus' || event.code === 'Slash' || event.code === 'NumpadSubtract') {
        event.preventDefault();
        scale /= 1.1;
        drawImageOnCanvas(pngData);
    }
    // Move left
    if (event.code === 'ArrowLeft') {
        event.preventDefault();
        offset.x += 10;
        drawImageOnCanvas(pngData);
    }
    // Move right
    if (event.code === 'ArrowRight') {
        event.preventDefault();
        offset.x -= 10;
        drawImageOnCanvas(pngData);
    }
    // Move up
    if (event.code === 'ArrowUp') {
        event.preventDefault();
        offset.y += 10;
        drawImageOnCanvas(pngData);
    }
    // Move down
    if (event.code === 'ArrowDown') {
        event.preventDefault();
        offset.y -= 10;
        drawImageOnCanvas(pngData);
    }
    // Reset
    if (event.code === 'KeyR') {
        event.preventDefault();
        scale = 1;
        offset = {x: 0, y: 0};
        drawImageOnCanvas(pngData);
    }
});