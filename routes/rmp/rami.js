While

const numero = "123"
const base = 5
let resultado = 0
let exponente = numero.length
let i = 0

while(i < numero.length){
    exponente = exponente - 1
    let exponencial = Math.pow(base, exponente)
    let valor = parseInt(numero[i]) * exponencial
    resultado = resultado + valor
    i = i + 1 
}

