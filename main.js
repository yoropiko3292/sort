const canvases = document.querySelectorAll("canvas");
const serectors = document.querySelectorAll("select");
const speed = document.getElementById("speed");
const preDeta = document.getElementById("preDeta");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const random = document.getElementById("random");
const result = document.getElementById("result");
const inputs = document.querySelectorAll("input");
const width = 400;
const height = 400;

let Deta;

random.addEventListener("click",detaSet);
start.addEventListener("click",soatStart);
speed.addEventListener("mousemove",function(){
    document.getElementById("speedMeter").textContent = speed.value;
})
preDeta.addEventListener("keyup",function(){
    detaMake();
    graph(canvases[0],Deta,null,"#000000");
});

detaSet();

function detaSet() {
    const detaValue = Number(document.getElementById("detaValue").value);
    const detaMin = Number(document.getElementById("detaMin").value);
    const detaMax = Number(document.getElementById("detaMax").value);
    if(detaValue % 1 == 0 && detaValue > 0 && detaValue < 501 && detaMin % 1 == 0 && detaMax % 1 == 0  && detaMax >= detaMin){
        Deta = new Array(detaValue);
        cvs = new Array(canvases.length);
        for(i = 0;i < Deta.length;i++){
            Deta[i] = Math.round(Math.random() * (detaMax - detaMin) + detaMin);
        }
        preDeta.value = Deta;
        for(i = 0; i < canvases.length; i++){
            graph(canvases[i],Deta,null,"#000000");
        }
    }else{
        alert("無効な値が入力されています");
    }
}

function detaMake(){
    let soatStartMemoA;
    Deta = new Array(0);
    for(i = 0; i < preDeta.value.length; i++){
        soatStartMemoA = "";
        if(Number(preDeta.value[i]) % 1 == 0 || preDeta.value[i] == "-"){
            soatStartMemoA = preDeta.value[i];
            i++;
            while(Number(preDeta.value[i]) % 1 == 0){
                soatStartMemoA += preDeta.value[i];
                i++;
            }
            if(soatStartMemoA % 1 == 0){
                Deta.push(Number(soatStartMemoA));
            }
        }
    }
}

function soatStart(){
    detaMake();
    if(Deta.length > 1 && Deta.length < 501){
        for(i = 0; i < inputs.length; i++){
            inputs[i].disabled = true;
        }
        stop.disabled = false;
        for(i = 0; i < canvases.length; i++){
            if(serectors[i].value == "bubble"){
                bubbleSoat(i);
            }
            if(serectors[i].value == "shaker"){
                shakerSoat(i);
            }
        }
    }
}

function graph(canvas,deta,red,color){
    let max = Math.max.apply(null,deta);
    let min = Math.min.apply(null,deta);
    cvs = canvas.getContext("2d");
    cvs.clearRect(0,0,canvas.width,canvas.height);
    for(i = 0; i < deta.length; i++){
        if(i == red){
            cvs.fillStyle = "#ff0000";
        }else{
            cvs.fillStyle = color;
        }
        cvs.fillRect(canvas.width / deta.length * i, canvas.height, canvas.width / deta.length, canvas.height / (min - max - 1) * (deta[i] - min + 1));
    }
}

function bubbleSoat(num){

    let canvas = canvases[num];
    let deta = Deta;
    let a = 0;
    let b;
    let c = 0;
    let d = 0;

    stop.addEventListener("click",function(){
        stopSoat(soat,deta);
    });

    const soat = setInterval(function(){
        if(a < deta.length && deta[a] > deta[a + 1]){
            b = deta[a + 1];
            deta[a + 1] = deta[a];
            deta[a] = b;
            d = a;
        }
        graph(canvas,deta,a,"#000000");
        if(a == deta.length - c - 1){
            if(d != 0){
                c++;
                a = -1;
                d = 0;
            }else{
                stopSoat(soat,deta);
                graph(canvas,deta,null,"#0099ff");
                result.value = deta;
                return;
            }
        }
        a++;
    },Number(speed.value));

    soat;
}

function shakerSoat(num){
    
    let canvas = canvases[num];
    let deta = Deta;
    let a = 0;
    let b;
    let c = 0;
    let d = 1;
    let e = 0;

    stop.addEventListener("click",function(){
        stopSoat(soat,deta);
    });

    const soat = setInterval(function(){
        if(d == 1){
            if(a < deta.length && deta[a] > deta[a + 1]){
                b = deta[a + 1];
                deta[a + 1] = deta[a];
                deta[a] = b;
                e = a;
            }
            a++;
        }else{
            if(0 < a && deta[a - 1] > deta[a]){
                b = deta[a - 1];
                deta[a - 1] = deta[a];
                deta[a] = b;
                e = a;
            }
            a--;
        }
        graph(canvas,deta,a,"#000000");
        if((a == deta.length - c - 1 && d == 1) || (a == c - 1 && d == -1)){
            d *= -1;
            if(e != 0){
                if(d == 1){
                    a = c - 1;
                }else{
                    a = deta.length - c;
                    c++;
                }
                e = 0;
            }else{
                stopSoat(soat,deta);
                graph(canvas,deta,null,"#0099ff");
                result.value = deta;
                return;
            }
        }
    },Number(speed.value));

    soat;
}

function stopSoat(interval,deta){
    graph(canvases[0],deta,null,"#000000");
    stop.disabled = true;
    clearInterval(interval);
    for(i = 0; i < inputs.length; i++){
        inputs[i].disabled = false;
    }
    stop.disabled = true;
}