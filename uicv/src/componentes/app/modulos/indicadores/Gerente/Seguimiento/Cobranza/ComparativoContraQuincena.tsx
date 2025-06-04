import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import TablaDiasComparacion from '../../../Componentes/TablaDiasComparacion'
import * as Funciones from '../../../Funciones'
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc';

type ComparativaContraQuincenaType = {
    oidc: IOidc,
    GrupoID: number,
    ProductoID: number,
    loading: boolean
}

const funGetTotalComparativa = async ({ setState, oidc, GrupoID, ProductoID }) => {
    const vigente: any[] = [], pasado: any[] = [], antePasado: any[] = [];
    const sumPasado: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /*0, 0, 0*/];
    const sumVigente: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /*0, 0, 0*/];
    const sumAntePasado: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /*0, 0, 0*/];
    let sumSaldoActualVigente: number = 0;
    let sumSaldoActualPasado: number = 0;

    //const response: any = await Funciones.FNComparativoContraQuincena(oidc, { DistribuidorID: 0, GrupoID: GrupoID, ProductoID: ProductoID });

   /* response.arrayVigente.map((element: any) => {
        vigente.push(element);
        sumVigente[0] += element.fechaCorte?.includes("08T") ? element.D_08 ?? 0 : element.D_23 ?? 0;
        sumVigente[1] += element.fechaCorte?.includes("08T") ? element.D_09 ?? 0 : element.D_24 ?? 0;
        sumVigente[2] += element.fechaCorte?.includes("08T") ? element.D_10 ?? 0 : element.D_25 ?? 0;
        sumVigente[3] += element.fechaCorte?.includes("08T") ? element.D_11 ?? 0 : element.D_26 ?? 0;
        sumVigente[4] += element.fechaCorte?.includes("08T") ? element.D_12 ?? 0 : element.D_27 ?? 0;
        sumVigente[5] += element.fechaCorte?.includes("08T") ? element.D_13 ?? 0 : element.D_28 ?? 0;
        sumVigente[6] += element.fechaCorte?.includes("08T") ? element.D_14 ?? 0 : element.D_29 ?? 0;
        sumVigente[7] += element.fechaCorte?.includes("08T") ? element.D_15 ?? 0 : element.D_30 ?? 0;
        sumVigente[8] += element.fechaCorte?.includes("08T") ? element.D_16 ?? 0 : element.D_31 ?? 0;
        sumVigente[9] += element.fechaCorte?.includes("08T") ? element.D_17 ?? 0 : element.D_01 ?? 0;
        sumVigente[10] += element.fechaCorte?.includes("08T") ? element.D_18 ?? 0 : element.D_02 ?? 0;
        sumVigente[11] += element.fechaCorte?.includes("08T") ? element.D_19 ?? 0 : element.D_03 ?? 0;
        sumVigente[12] += element.fechaCorte?.includes("08T") ? element.D_20 ?? 0 : element.D_04 ?? 0;
        sumSaldoActualVigente += element.SaldoActual ?? 0;
        // sumVigente[13] += element.fechaCorte?.includes("08T") ? element.D_21 ?? 0: element.D_05 ?? 0 ;
        // sumVigente[14] += element.fechaCorte?.includes("08T") ? element.D_22 ?? 0: element.D_06 ?? 0 ;
        // sumVigente[15] += element.fechaCorte?.includes("08T") ? element.D_23 ?? 0: element.D_07 ?? 0 ;
    });

    response.arrayPasado.map((element: any) => {
        pasado.push(element);
        sumPasado[0] += !vigente[0].fechaCorte?.includes("08T") ? element.D_08 ?? 0 : element.D_23 ?? 0;
        sumPasado[1] += !vigente[0].fechaCorte?.includes("08T") ? element.D_09 ?? 0 : element.D_24 ?? 0;
        sumPasado[2] += !vigente[0].fechaCorte?.includes("08T") ? element.D_10 ?? 0 : element.D_25 ?? 0;
        sumPasado[3] += !vigente[0].fechaCorte?.includes("08T") ? element.D_11 ?? 0 : element.D_26 ?? 0;
        sumPasado[4] += !vigente[0].fechaCorte?.includes("08T") ? element.D_12 ?? 0 : element.D_27 ?? 0;
        sumPasado[5] += !vigente[0].fechaCorte?.includes("08T") ? element.D_13 ?? 0 : element.D_28 ?? 0;
        sumPasado[6] += !vigente[0].fechaCorte?.includes("08T") ? element.D_14 ?? 0 : element.D_29 ?? 0;
        sumPasado[7] += !vigente[0].fechaCorte?.includes("08T") ? element.D_15 ?? 0 : element.D_30 ?? 0;
        sumPasado[8] += !vigente[0].fechaCorte?.includes("08T") ? element.D_16 ?? 0 : element.D_31 ?? 0;
        sumPasado[9] += !vigente[0].fechaCorte?.includes("08T") ? element.D_17 ?? 0 : element.D_01 ?? 0;
        sumPasado[10] += !vigente[0].fechaCorte?.includes("08T") ? element.D_18 ?? 0 : element.D_02 ?? 0;
        sumPasado[11] += !vigente[0].fechaCorte?.includes("08T") ? element.D_19 ?? 0 : element.D_03 ?? 0;
        sumPasado[12] += !vigente[0].fechaCorte?.includes("08T") ? element.D_20 ?? 0 : element.D_04 ?? 0;
        sumSaldoActualPasado += element.SaldoActual ?? 0;;
        // sumPasado[13] += !vigente[0].fechaCorte?.includes("08T") ? element.D_21 ?? 0: element.D_05 ?? 0 ;
        // sumPasado[14] += !vigente[0].fechaCorte?.includes("08T") ? element.D_22 ?? 0: element.D_06 ?? 0 ;
        // sumPasado[15] += !vigente[0].fechaCorte?.includes("08T") ? element.D_23 ?? 0: element.D_07 ?? 0 ;
    });

    response.arrayAntePasado.map((element: any) => {
        antePasado.push(element);
        sumAntePasado[0] += vigente[0].fechaCorte?.includes("08T") ? element.D_08 ?? 0 : element.D_23 ?? 0;
        sumAntePasado[1] += vigente[0].fechaCorte?.includes("08T") ? element.D_09 ?? 0 : element.D_24 ?? 0;
        sumAntePasado[2] += vigente[0].fechaCorte?.includes("08T") ? element.D_10 ?? 0 : element.D_25 ?? 0;
        sumAntePasado[3] += vigente[0].fechaCorte?.includes("08T") ? element.D_11 ?? 0 : element.D_26 ?? 0;
        sumAntePasado[4] += vigente[0].fechaCorte?.includes("08T") ? element.D_12 ?? 0 : element.D_27 ?? 0;
        sumAntePasado[5] += vigente[0].fechaCorte?.includes("08T") ? element.D_13 ?? 0 : element.D_28 ?? 0;
        sumAntePasado[6] += vigente[0].fechaCorte?.includes("08T") ? element.D_14 ?? 0 : element.D_29 ?? 0;
        sumAntePasado[7] += vigente[0].fechaCorte?.includes("08T") ? element.D_15 ?? 0 : element.D_30 ?? 0;
        sumAntePasado[8] += vigente[0].fechaCorte?.includes("08T") ? element.D_16 ?? 0 : element.D_31 ?? 0;
        sumAntePasado[9] += vigente[0].fechaCorte?.includes("08T") ? element.D_17 ?? 0 : element.D_01 ?? 0;
        sumAntePasado[10] += vigente[0].fechaCorte?.includes("08T") ? element.D_18 ?? 0 : element.D_02 ?? 0;
        sumAntePasado[11] += vigente[0].fechaCorte?.includes("08T") ? element.D_19 ?? 0 : element.D_03 ?? 0;
        sumAntePasado[12] += vigente[0].fechaCorte?.includes("08T") ? element.D_20 ?? 0 : element.D_04 ?? 0;
        // sumAntePasado[13] += vigente[0].fechaCorte?.includes("08T") ? element.D_21 ?? 0: element.D_05 ?? 0 ;
        // sumAntePasado[14] += vigente[0].fechaCorte?.includes("08T") ? element.D_22 ?? 0: element.D_06 ?? 0 ;
        // sumAntePasado[15] += vigente[0].fechaCorte?.includes("08T") ? element.D_23 ?? 0: element.D_07 ?? 0 ;
    });*/

    setState(s => ({ ...s, sumSaldoActual: { sumSaldoActualPasado, sumSaldoActualVigente }, arrayAntePasado: antePasado, arrayPasado: pasado, arrayVigente: vigente, isFechaCorte8: pasado.length > 0 ? pasado[0].fechaCorte?.includes("08T") : !vigente[0].fechaCorte?.includes("08T"), sumPasado: sumPasado, sumVigente: sumVigente, sumAntePasado: sumAntePasado }));
}

export default function ComparativaContraQuincena(props: ComparativaContraQuincenaType) {
    const [state, setState] = useState({
        sumSaldoActual: { sumSaldoActualPasado: 0, sumSaldoActualVigente: 0 },
        arrayAntePasado: [{}],
        arrayPasado: [{ fechaCorte: "" }],
        arrayVigente: [{ fechaCorte: "" }],
        sumPasado: [0],
        sumVigente: [0],
        sumAntePasado: [0],
        isFechaCorte8: false
    });

    useEffect(() => {
        funGetTotalComparativa({ setState, oidc: props.oidc, GrupoID: props.GrupoID, ProductoID: props.ProductoID });
    }, [props.loading])

    return (
        <>
            <h2 style={{ textTransform: "uppercase", textAlign: "center", color: "#000000" }}>Comparativa contra quincena</h2>
            {/* Tablas de dias a comparar entre corte vigente y corte pasada */}
            <h6><span style={{ fontWeight: "bold" }}>Corte Pasado:  {" "}</span>{state.arrayPasado[0]?.fechaCorte.split("T")[0]}</h6>
            <h6><span style={{ fontWeight: "bold" }}>Corte Vigente: {" "}</span>{state.arrayVigente[0]?.fechaCorte.split("T")[0]}</h6>
            <div style={{ marginBottom: 10 }}>
                <TablaDiasComparacion date={state.arrayPasado[0]?.fechaCorte} backgroundColor='#DBEBF3' data={state.sumPasado} dataPasado={state.sumAntePasado} />
                <TablaDiasComparacion date={state.arrayVigente[0]?.fechaCorte} backgroundColor={"#E3EBDB"} data={state.sumVigente} dataPasado={state.sumPasado} />
            </div>
            {/* FIN Tablas de dias a comparar entre corte vigente y corte pasada */}
            <TablaSeguimientoDiarioCaidas date={state.arrayPasado[0]?.fechaCorte} SaldoActual={state.sumSaldoActual.sumSaldoActualVigente} title='anterior' backgroundColor='#E3EBDB' saldosRiesgo={state.sumPasado} />
            <TablaSeguimientoDiarioCaidas date={state.arrayVigente[0]?.fechaCorte} SaldoActual={state.sumSaldoActual.sumSaldoActualPasado} title='actual' backgroundColor='#DBEBF3' saldosRiesgo={state.sumVigente} />
        </>
    )
}

function TablaSeguimientoDiarioCaidas(props: { date: string, title: string, backgroundColor: string, saldosRiesgo: any[], SaldoActual: number }) {
    const [days, setDays]: any[] = useState([]);
    const [arraySaldo, setArraySaldo]: any[] = useState([]);

    const llenarArreglo = () => {
        const array: Date[] = [];
        const arraySaldoRiesgo: number[] = [];
        const date: Date = props.date ? new Date(props.date) : new Date();

        let aux = props.SaldoActual;

        for (let i = 0; i < 5; i++) {
            const dateAux = date.setDate(date.getDate() + 1);
            array.push(new Date(dateAux));
        }

        for (let i = 0; i < 5; i++) {
            aux -= props.saldosRiesgo[i]
            arraySaldoRiesgo.push(aux)
        }

        setDays(array);
        setArraySaldo(arraySaldoRiesgo);
    }

    useEffect(() => {
        llenarArreglo();
    }, [props.date])

    return (
        <>
            <h2 style={{ backgroundColor: props.backgroundColor, textAlign: "center" }}>Seguimiento diario de caidas, quincena {props.title}</h2>
            <div style={{ marginTop: -20 }} className="columns">
                <div className="table-container column is-full-desktop is-full-tablet is-full-mobile">
                    <table className="table is-bordered is-striped">
                        <thead>
                            <tr style={{ backgroundColor: props.backgroundColor }}>
                                <th style={{ textAlign: "center" }}>Indicador</th>
                                {days.map((day, index) =>
                                    <th key={index} style={{ textAlign: "center" }}>
                                        {day.getDate() >= 10 ? day.getDate() : `0${day.getDate()}`}/
                                        {day.getMonth() + 1 > 10 ? day.getMonth() + 1 : `0${day.getMonth() + 1}`}/
                                        {day.getFullYear()}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {/* {["Socias caidas", "Saldo en riesgo", "% Saldo en riesgo"].map((indicador, index) =>  */}
                            {/* <tr>
                                <td style={{ textAlign: "center" }}>Socias caidas</td>
                                <td style={{ textAlign: "center" }}>12</td>
                                <td style={{ textAlign: "center" }}>11</td>
                                <td style={{ textAlign: "center" }}>11</td>
                                <td style={{ textAlign: "center" }}>9</td>
                                <td style={{ textAlign: "center" }}>4</td>
                            </tr> */}
                            <tr>
                                <td style={{ textAlign: "center" }}>Saldo en riesgo</td>
                                {props.saldosRiesgo.map((saldoRiego, index) =>
                                    index < 5
                                        ?
                                        <td key={index} style={{ textAlign: "center" }}>
                                            {(props.SaldoActual - saldoRiego).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                        </td>
                                        : null
                                )}
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>% en riesgo</td>
                                {
                                    arraySaldo.map((item, index) =>
                                        <td key={index} style={{ textAlign: "center" }}>{(item * 100 / props.SaldoActual).toFixed(2)}%</td>
                                    )
                                }
                                {/* <td style={{ textAlign: "center" }}>3.94%</td>
                                <td style={{ textAlign: "center" }}>3.57%</td>
                                <td style={{ textAlign: "center" }}>3.56%</td>
                                <td style={{ textAlign: "center" }}>3.22%</td>
                                <td style={{ textAlign: "center" }}>1.34%</td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
            <div className="columns is-centered">
                <div className="column is-narrow">
                    <div>
                        <Chart
                            options={{
                                chart: {
                                    width: '100%',
                                    type: 'bar',
                                },
                                labels: ["", "", "", "", ""],
                                responsive: [{
                                    breakpoint: 480,
                                    options: {
                                        chart: {
                                            width: '90%'
                                        },
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }],
                                markers: {
                                    size: 3
                                },
                                dataLabels: {
                                    background: {
                                        enabled: true,
                                        foreColor: "#1d1d1d",
                                        dropShadow: { enabled: false }
                                    },
                                    formatter(val, opts) {
                                        return val.toLocaleString("en-US");
                                    },
                                },
                                yaxis: {
                                    decimalsInFloat: 2,
                                    labels: {
                                        formatter: function (val, opts) {
                                            return val.toLocaleString('en-US')
                                        },
                                    }
                                }
                            }}
                            series={
                                [
                                    {
                                        data: arraySaldo,
                                        color: "#d82020"
                                    }
                                ]
                            }
                            type="bar"
                            width="680"
                            height="320"
                        />
                    </div>
                </div>
            </div >
        </>
    )
}