const dataInput = document.getElementById("dataInput");
const posInputs = [
    document.getElementById("x"),
    document.getElementById("y"),
    document.getElementById("z")
];
const output = document.getElementById("output");
const copyButton = document.getElementById("copyButton");

let baseData = [];
let shift = [0, 0, 0];
let data = [];

dataInput.addEventListener("input", () => {
    if (/[0-9a-f]{24}$/.test(dataInput.value)) {
        fetch(`https://cdn.dashcraft.io/v2/prod/track/${dataInput.value.slice(-24)}.json`)
            .then(response => response.json())
            .then(json => {
                baseData = json.trackPieces;
                updateData();
            });
    } else {
        try {
            baseData = JSON.parse(dataInput.value);
            updateData();
        } catch {
            return;
        }
    }
});

for (let i = 0; i < posInputs.length; i++) {
    posInputs[i].addEventListener("input", () => {
        shift[i] = parseInt(posInputs[i].value) || 0;
        updateData();
    });
}

function updateData() {
    data = [];

    for (let i = 0; i < baseData.length; i++) {
        let item = structuredClone(baseData[i]);
        item.p = item.p.map((p, j) => p + shift[j]);
        data.push(item);
    }

    output.innerText = JSON.stringify(data);
}

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(output.innerText);
});

