if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js');
}

const wins = [
    "00 01 02", 
    "10 11 12", 
    "20 21 22", 
    
    "00 10 20", 
    "01 11 21", 
    "02 12 22",

    "00 11 22",
    "02 11 20"
];

let cross_picks = [];
let circle_picks = [];

// Current player
let current = "cross";

let sym = document.getElementById("sym");

const updateScore = () => {
    let cir = document.getElementById("cir");
    let cro = document.getElementById("cro");

    let x_wins = localStorage.getItem("x");
    let score_x = x_wins? x_wins : 0;
    let o_wins = localStorage.getItem("o");
    let score_o = o_wins? o_wins : 0;

    cir.innerHTML = `- ${score_o}`;
    cro.innerHTML = `- ${score_x}`;
}
window.addEventListener("load", updateScore);

const showModal = (winner, type) => {
    let modal = document.getElementById("modal");
    let verdict = document.getElementById("verdict");
    modal.style.display = type === "show"? "flex" : "none";

    if(winner === "cross") {
        verdict.classList.remove("circle");
        verdict.classList.add("cross");
        verdict.innerHTML = "- is the winner 🥳";
    }else if(winner === "circle") {
        verdict.classList.add("circle");
        verdict.classList.remove("cross");
        verdict.innerHTML = "- is the winner 🥳";
    }else {
        verdict.innerHTML = "It's ended in a draw";
    }

    if(type === "hide") {
        location.reload();
    }
}

const check = (active) => {
    let connected = 0;
    for(let i = 0; i < wins.length; i++) {
        let win = wins[i].split(" ");
        for(let j = 0; j < win.length; j++) {
            if(active === "circle") {
                for(let k = 0; k < circle_picks.length; k++) {
                    if(win[j] === circle_picks[k]) {
                        connected++;
                        
                    }
                    if(connected === 3) {
                        return true;
                    }
                }
            }else {
                for(let k = 0; k < cross_picks.length; k++) {
                    if(win[j] === cross_picks[k]) {
                        connected++;
                        
                    }
                    if(connected === 3) {
                        return true;
                    }
                }
            }
        }
        connected = 0;
    }

    return false;
}

const pick = (space) => {
    let chosen = document.getElementById(space); // Space chosen by current user
    if(!chosen.classList.contains("cross") && !chosen.classList.contains("circle") && !check("circle") && !check("cross")) {
        chosen.classList.add(current);
        sym.classList.remove(current);
        if(current === "circle") {
            current = "cross";
            circle_picks.push(space);
            if(circle_picks.length + cross_picks.length <= 9) {
                if(check("circle")) {
                    let o = localStorage.getItem("o");
                    if(o) {
                        localStorage.setItem("o", parseInt(o)+1);
                    }else {
                        localStorage.setItem("o", 1);
                    }
                    updateScore();
                    showModal('circle', 'show');
                }
            }else {
                showModal('draw', 'show');
            }
        }else {
            current = "circle";
            cross_picks.push(space);
            if(circle_picks.length + cross_picks.length <= 9) {
                if(check("cross")) {
                    let x = localStorage.getItem("x");
                    if(x) {
                        localStorage.setItem("x", parseInt(x)+1);
                    }else {
                        localStorage.setItem("x", 1);
                    }
                    updateScore();
                    showModal('cross', 'show');
                }
            }else {
                showModal('draw', 'show');
            }
        }
        
        sym.classList.add(current);
    }
}

const reset = () => {
    localStorage.clear();
    location.reload();
}