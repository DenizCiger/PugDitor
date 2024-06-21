document.getElementById('pngInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const pngData = e.target.result;
            handlePngData(pngData); // Pass the PNG data to the handler function
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid PNG file.");
    }
});

document.getElementById('jsonInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonContent = JSON.parse(e.target.result);
                handleJsonData(jsonContent); // Pass the JSON data to the handler function
            } catch (error) {
                console.error("Error parsing JSON: ", error);
                alert("Error parsing JSON: " + error);
            }
        };
        reader.readAsText(file);
    } else {
        alert("Please select a valid JSON file.");
    }
});
