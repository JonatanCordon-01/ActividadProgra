let culpable, intentos, puntaje, tiempo, temporizador, nivelJuego;

const sospechosos = [];
for(let i=1;i<=20;i++){
    sospechosos.push({id:i, nombre:`Sospechoso ${i}`, img:`imagenes/sospechoso${i}.jpg`});
}

// Tabla de pistas reales y trampas
const tablaPistas = {
    1:{reales:["Moreno","Lentes transparentes","Gorra","Sonrisa"], trampas:["Bolígrafo","Cinturón negro"]},
    2:{reales:["Blanco","Lentes de color","Sin gorra","Ropa negra"], trampas:["Zapato mojado","Carta manuscrita"]},
    3:{reales:["Moreno","Lentes transparentes","Gorra","Camisa"], trampas:["Foto borrosa","Llaves"]},
    4:{reales:["Blanco","Lentes transparentes","Sin gorra","Ropa colorida"], trampas:["Teléfono","Reloj"]},
    5:{reales:["Moreno","Lentes de color","Gorra","Traje formal"], trampas:["Paquete sospechoso","Cinturón negro"]},
    6:{reales:["Blanco","Lentes transparentes","Sin gorra","Camisa"], trampas:["Bolígrafo","Zapato mojado"]},
    7:{reales:["Moreno","Cabello poco","Sin sonrisa","Ropa casual"], trampas:["Carta manuscrita","Foto borrosa"]},
    8:{reales:["Blanco","Lentes transparentes","Gorra","Ropa negra"], trampas:["Llaves","Teléfono"]},
    9:{reales:["Moreno","Lentes de color","Sin gorra","Traje formal"], trampas:["Reloj","Paquete sospechoso"]},
    10:{reales:["Blanco","Cabello abundante","Sin sonrisa","Camisa"], trampas:["Bolígrafo","Foto borrosa"]},
    11:{reales:["Moreno","Lentes transparentes","Sin gorra","Tatuaje visible"], trampas:["Zapato mojado","Carta manuscrita"]},
    12:{reales:["Blanco","Lentes transparentes","Gorra","Ropa colorida"], trampas:["Cinturón negro","Teléfono"]},
    13:{reales:["Moreno","Lentes de color","Gorra","Ropa casual"], trampas:["Paquete sospechoso","Reloj"]},
    14:{reales:["Blanco","Lentes transparentes","Sin gorra","Traje formal"], trampas:["Foto borrosa","Llaves"]},
    15:{reales:["Moreno","Lentes de color","Gorra","Sonrisa"], trampas:["Bolígrafo","Cinturón negro"]},
    16:{reales:["Blanco","Cabello abundante","Sin sonrisa","Ropa colorida"], trampas:["Zapato mojado","Carta manuscrita"]},
    17:{reales:["Moreno","Cabello poco","Sin sonrisa","Traje formal"], trampas:["Foto borrosa","Paquete sospechoso"]},
    18:{reales:["Blanco","Lentes de color","Gorra","Tatuaje visible"], trampas:["Reloj","Llaves"]},
    19:{reales:["Moreno","Lentes transparentes","Sin gorra","Ropa casual"], trampas:["Bolígrafo","Cinturón negro"]},
    20:{reales:["Blanco","Cabello abundante","Sin sonrisa","Traje formal"], trampas:["Zapato mojado","Teléfono"]}
};

function login(){
    const user=document.getElementById("username").value;
    const pass=document.getElementById("password").value;
    nivelJuego=document.getElementById("nivel").value;
    const msg=document.getElementById("loginMsg");
    if(user==="alumno" && pass==="2025"){
        document.getElementById("loginDiv").style.display="none";
        document.getElementById("gameDiv").style.display="block";
        iniciarJuego();
    } else { msg.textContent="Usuario o contraseña incorrectos"; }
}

function iniciarJuego(){
    intentos=0; puntaje=100;
    tiempo=(nivelJuego==="facil")?90:(nivelJuego==="medio")?60:45;

    const timerDiv = document.getElementById("timer");
    timerDiv.textContent=`Tiempo: ${tiempo}`;
    timerDiv.classList.remove("poco-tiempo");
    document.getElementById("puntaje").textContent=`Puntaje: ${puntaje}`;

    culpable = Math.floor(Math.random()*20)+1;
    clearInterval(temporizador);

    temporizador = setInterval(()=>{
        tiempo--;
        timerDiv.textContent = `Tiempo: ${tiempo}`;
        if(tiempo<=10) timerDiv.classList.add("poco-tiempo");
        if(tiempo<=0){
            clearInterval(temporizador);
            alert(`Se acabó el tiempo. Puntaje final: ${puntaje}`);
            reiniciarJuego();
        }
    },1000);

    let cantidadPistas = (nivelJuego==="facil")?6:(nivelJuego==="medio")?8:10;
    let cantidadTrampas = (nivelJuego==="facil")?2:(nivelJuego==="medio")?3:4;
    let cantidadReales = cantidadPistas - cantidadTrampas;

    let pistasReales = tablaPistas[culpable].reales.slice(0,cantidadReales);
    let trampas = tablaPistas[culpable].trampas.slice(0,cantidadTrampas);

    const pistasDiv = document.getElementById("pistas");
    pistasDiv.innerHTML="";
    let todasPistas = pistasReales.concat(trampas);
    todasPistas.sort(()=>0.5-Math.random());

    for(let texto of todasPistas){
        const div = document.createElement("div");
        div.className="pista";
        div.textContent = texto;
        pistasDiv.appendChild(div);
    }

    const suspectsDiv = document.getElementById("suspects"); suspectsDiv.innerHTML="";
    let suspectsNivel = [];
    if(nivelJuego==="facil") suspectsNivel = [...sospechosos].filter(s=>s.id!==culpable).sort(()=>0.5-Math.random()).slice(0,7);
    else if(nivelJuego==="medio") suspectsNivel = [...sospechosos].filter(s=>s.id!==culpable).sort(()=>0.5-Math.random()).slice(0,14);
    else suspectsNivel = [...sospechosos].filter(s=>s.id!==culpable);

    suspectsNivel.push(sospechosos[culpable-1]);
    suspectsNivel.sort(()=>0.5-Math.random());

    for(let s of suspectsNivel){
        const card = document.createElement("div"); card.className="suspect-card";
        card.innerHTML=`<img src="${s.img}" alt="${s.nombre}">
        <label><input type="radio" name="sospechoso" value="${s.id}"> ${s.nombre}</label>`;
        suspectsDiv.appendChild(card);
    }

    document.getElementById("resultado").value="";
    document.getElementById("videoVictoria").style.display="none";
}

function verificar(){
    intentos++; puntaje-=5;
    const radios=document.getElementsByName("sospechoso"); let seleccionado=null;
    for(let r of radios){ if(r.checked) seleccionado=parseInt(r.value); }
    const resultado=document.getElementById("resultado");
    if(seleccionado===null){ alert("Selecciona un sospechoso"); return; }
    if(seleccionado===culpable){
        clearInterval(temporizador);
        puntaje+=tiempo;
        resultado.value=`¡Correcto! Encontraste al culpable en ${intentos} intento(s). Puntaje: ${puntaje}`;
        document.getElementById("videoVictoria").style.display="block";
        document.getElementById("videoVictoria").play();
        guardarRanking();
    } else {
        resultado.value=`Sospechoso incorrecto. Sigue investigando... Intentos: ${intentos} Puntaje: ${puntaje}`;
    }
    document.getElementById("puntaje").textContent=`Puntaje: ${puntaje}`;
}

function ayuda(){
    puntaje -= 10;
    document.getElementById("puntaje").textContent = `Puntaje: ${puntaje}`;
    
    const cards = document.getElementsByClassName("suspect-card");
    let cardCulpable = null;
    for(let c of cards){
        const radio = c.querySelector("input[type='radio']");
        if(parseInt(radio.value) === culpable) { cardCulpable = c; break; }
    }

    if(!cardCulpable) return;

    if(nivelJuego === "facil"){
        cardCulpable.style.transition = "all 0.3s";
        cardCulpable.style.border = "3px solid yellow";
        cardCulpable.style.transform = "scale(1.1)";
        setTimeout(()=>{
            cardCulpable.style.border = "none";
            cardCulpable.style.transform = "scale(1)";
        },2000);
    }
    else if(nivelJuego === "medio"){
        cardCulpable.style.transition = "opacity 0.4s";
        cardCulpable.style.opacity = "0.9";
        setTimeout(()=>{
            cardCulpable.style.opacity = "1";
        },800);
    }
    else if(nivelJuego === "dificil"){
        cardCulpable.style.transition = "transform 0.2s";
        cardCulpable.style.transform = "translateX(1px)";
        setTimeout(()=>{
            cardCulpable.style.transform = "translateX(0)";
        },200);
    }
}

function reiniciarJuego(){ iniciarJuego(); }

function guardarRanking(){
    let maxPuntaje = localStorage.getItem("maxPuntaje")||0;
    if(puntaje>maxPuntaje) localStorage.setItem("maxPuntaje", puntaje);
}
