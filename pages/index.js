import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Footer from '../components/Footer'
import { Element, scroller } from 'react-scroll';
/* import Swal from 'sweetalert2' */

const setupScroll = {
    duration: 3000,
    delay: 50,
    smooth: true, // linear “easeInQuint” “easeOutCubic”,
    offset: -10
}

const Home = () => {

    const [matriz, setMatriz] = useState([
        [ 1, 10, 10, 10, 10, 10],
        [ 2,  2,  2,  5,  5,  5],
        [ 5,  5,  5, 10, 10, 10],
        [13, 13, 13, 13, 13, 13],
        [ 2,  2,  2,  5,  5,  5],
    ]);
    
    const [data, setData] = useState([]);
    const [active, setActive] = useState(false);
    const [active2, setActive2] = useState(false);
    const [caracterRepeticion, setCaracterRepeticion] = useState([]);
    const [masGrande, setMasGrande] = useState([]);
    const [numBits, setNumBits] = useState([]);
    const [tramas, setTramas] = useState([]);
    const [codificado, setCodificado] = useState('');
    const [compresion, setCompresion] = useState(0);

    useEffect(() => {
        scroller.scrollTo("info", setupScroll)
    }, [compresion])

    const zigZag = () => {
        let tex = ''

        let cont = 0

        let x = 0
        let y = 0

        let lateral = false
        let vertical = false

        let mitad = false

        let secuencia = []

        while (cont < 25) {

            if (!(vertical && y === 0) && !(vertical && x === 4)) {
                secuencia.push(matriz[y][x])
            }

            if (y === 4) {
                mitad = true
            }

            if (mitad) {
                if (vertical) {
                    if (x === 4) {
                        vertical = false
                        lateral = false
                        cont--
                    } else {
                        y--
                        x++
                    }
                } else {
                    if (lateral) {
                        if (y === 4) {
                            x++
                            vertical = true
                        } else {
                            y++
                            x--
                        }
                    } else {
                        if (x === 4) {
                            y++
                            lateral = true
                        }

                    }
                }
            } else {
                if (vertical) {
                    if (y === 0) {
                        vertical = false
                        lateral = false
                        cont--
                    } else {
                        y--
                        x++
                    }
                } else {
                    if (lateral) {
                        if (x === 0) {
                            y++
                            vertical = true
                        } else {
                            y++
                            x--
                        }
                    } else {
                        if (y === 0) {
                            x++
                            lateral = true
                        }

                    }
                }
            }

            cont++
        }

        setData(secuencia)
        setActive(true)
    }

    const lateral = () => {

        let tex = ''
        let secuencia = []

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                secuencia.push(matriz[y][x])
            }
        }

        setData(secuencia)
        setActive(true)
    }

    const vertical = () => {

        let tex = ''
        let secuencia = []

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                secuencia.push(matriz[x][y])
            }
        }

        setData(secuencia)
        setActive(true)
    }

    const codificar = () => {

        setActive2(true)

        let cont = 0
        let repeticiones = []

        let carater = 0

        for (let i = 0; i < data.length; i++) {
            //data[i]
            if (data[i] === data[i + 1]) {
                carater = data[i]
                cont++
            } else {
                carater = data[i]
                cont++
                repeticiones.push([carater, cont, i])
                cont = 0
            }
        }

        setCaracterRepeticion(repeticiones)

        let cuentaCaracter = 0
        let cuentaRepeticion = 0

        for (let i = 0; i < repeticiones.length; i++) {
            if (repeticiones[i][0] > cuentaCaracter) {
                cuentaCaracter = repeticiones[i][0]
            }
            if (repeticiones[i][1] > cuentaRepeticion) {
                cuentaRepeticion = repeticiones[i][1]
            }
        }

        setMasGrande([cuentaCaracter, cuentaRepeticion])

        let binarioCaracter = ''

        while (cuentaCaracter > 0) {
            if (cuentaCaracter % 2 == 0) {
                binarioCaracter += 0
            } else {
                binarioCaracter += 1
            }
            cuentaCaracter = Math.floor(cuentaCaracter / 2)
        }
        
        let binarioRepeticion = ''

        while (cuentaRepeticion > 0) {
            if (cuentaRepeticion % 2 == 0) {
                binarioRepeticion += 0
            } else {
                binarioRepeticion += 1
            }
            cuentaRepeticion = Math.floor(cuentaRepeticion / 2)
        }

        setNumBits([binarioCaracter.length, binarioRepeticion.length])


        let binarios = []

        for (let i = 0; i < repeticiones.length; i++) {

            let carc = repeticiones[i][0]
            let rep = repeticiones[i][1]

            let binCaracter = ''

            while (carc > 0) {
                if (carc % 2 == 0) {
                    binCaracter += 0
                } else {
                    binCaracter += 1
                }
                carc = Math.floor(carc / 2)
            }
            while (binCaracter.length < binarioCaracter.length) {
                binCaracter += '0'
            }

            let binRepeticiones = ''

            while (rep > 0) {
                if (rep % 2 == 0) {
                    binRepeticiones += 0
                } else {
                    binRepeticiones += 1
                }
                rep = Math.floor(rep / 2)
            }
            while (binRepeticiones.length < binarioRepeticion.length) {
                binRepeticiones += '0'
            }

            binarios[i] = [
                binCaracter.split('').reverse().join(''), 
                binRepeticiones.split('').reverse().join(''),
                (i+1)*100
            ]

        }

        setTramas(binarios) 

        let tramaCompleta = ''

        for (let i = 0; i < binarios.length; i++) {
            tramaCompleta += binarios[i][0] + binarios[i][1] 
        }

        setCodificado(tramaCompleta)

        let tasa = 0
        
        tasa = ((25 * 8) - tramaCompleta.length) / (25 * 8)

        setCompresion(tasa * 100)

    }


    return (
        <div className="container">

            <Head>
                <title>Codificación RLE</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>CODIFICACIÓN RLE</h1>

            <div className="content">

                <main>
                        <p style={{fontWeight: 700}}>Matriz</p>
                        <div className="matriz">
                            <span>{matriz[0][0]}</span> <span>{matriz[0][1]}</span> <span>{matriz[0][2]}</span> <span>{matriz[0][3]}</span> <span>{matriz[0][4]}</span>
                            <span>{matriz[1][0]}</span> <span>{matriz[1][1]}</span> <span>{matriz[1][2]}</span> <span>{matriz[1][3]}</span> <span>{matriz[1][4]}</span>
                            <span>{matriz[2][0]}</span> <span>{matriz[2][1]}</span> <span>{matriz[2][2]}</span> <span>{matriz[2][3]}</span> <span>{matriz[2][4]}</span>
                            <span>{matriz[3][0]}</span> <span>{matriz[3][1]}</span> <span>{matriz[3][2]}</span> <span>{matriz[3][3]}</span> <span>{matriz[3][4]}</span>
                            <span>{matriz[4][0]}</span> <span>{matriz[4][1]}</span> <span>{matriz[4][2]}</span> <span>{matriz[4][3]}</span> <span>{matriz[4][4]}</span>
                        </div>
                    <div>
                        <p style={{ fontWeight: 700 }}>Forma de lectura</p>
                        <button onClick={zigZag}>Zig - Zag</button>
                        <button onClick={lateral}>Horizontal</button>
                        <button onClick={vertical}>Vertical</button>
                    </div>
                    
                </main>

                {
                    active
                    ?
                    <main>
                        <div>
                            <div style={{ display: 'grid' }}>
                                <p style={{ fontWeight: 700 }}>Secuencia a Codificar</p>
                                <p className="texto">{JSON.stringify(data)}</p>
                                <br/>
                                <button onClick={codificar}>Codificar</button>
                            </div>
                        </div>
                    </main>
                    :
                    ''
                }

                {
                    active2
                    ?
                    <>
                    <main style={{gridColumn: '1/3'}} name="info">
                        <div style={{width: '500px', textAlign: 'center'}}>
                            {
                                caracterRepeticion.map(car => (
                                    <span key={car[3]}>[{car[0]}:{car[1]}] </span>
                                ))
                            }
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p>carácter más grande: {masGrande[0]} -> {numBits[0]} bits</p>
                            <p>número más grande repeticiones: {masGrande[1]} -> {numBits[1]} bits</p>
                        </div>
                        <div style={{ width: '500px', textAlign: 'center' }}>
                            {
                                tramas.map(trama => (
                                    <span key={trama[3]}>[{trama[0]}:{trama[1]}] </span>
                                ))
                            }
                        </div>
                    </main>

                    <main style={{ gridColumn: '1/3' }}>
                        <div>
                            <p style={{fontWeight: 700}}>Trama resultante</p>
                            <p className="texto2">{codificado}</p>
                        </div>
                        <div>
                            <p style={{fontWeight: 700}}>Tasa de compresion</p>
                            <p>{compresion}%</p>
                        </div>
                    </main>
                    </>
                    :
                    ''
                }

            </div>


            <Footer />

            <style jsx>{`

                .matriz {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                }

                h1 {
                    color: white;
                    text-align: center;
                }

                .texto {
                    width: 300px;
                    overflow-wrap: break-word;
                    text-align: center;
                }

                .texto2 {
                    width: 500px;
                    overflow-wrap: break-word;
                    text-align: center;
                }

                .content {
                    display: grid; 
                    grid-template-columns: ${ active ? '1fr 1fr' : '1fr'};
                }

                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                label {
                    display: grid;
                    justify-items: center;
                    color: white;
                }

                span {
                    color: white;
                }

                .matriz > span {
                    padding: 5px;
                    border: 1px dashed white;
                    text-align: center;
                }

                input {
                    height: 30px;
                    border-radius: 20px;
                    border: 1px solid #33333344;
                    padding: 10px;
                    outline: none;
                    text-align: center;
                }

                select {
                    padding: 0px 10px;
                }

                main {
                    padding: 5rem 0;
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    border-radius: 30px;
                    margin: 10px;
                    padding: 30px;
                    background: #2C3E5044;
                }


                :globla(body) {
                    background: linear-gradient(180deg, #6adc8e 0%, #2ed573 100%);
                }

                p {
                    color: white;
                    text-align: center;
                }

                button {
                    border: none;
                    padding: 10px 30px;
                    border-radius: 30px;
                    background-color: #2ed573;
                    color: white;
                    cursor: pointer;
                    transition: background-color 1s;
                    outline: none;
                    margin: 0px 5px;
                }

                button:hover {
                    background-color: #2ed57366;
                }

            `}</style>

            <style jsx global>{`

              html, body {
                  padding: 0;
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              }

              * {
                  box-sizing: border-box;
              }

      `}</style>

        </div>
    )
}

export default Home