import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import TablaDiasComparacionCoordinador from '../../../Componentes/TablaDiasComparacionCoordinador';

type ComparativaContraQuincenaType = {
    data: {
        arrayVigente: any[],
        arrayPasado: any[],
    },
    loading: boolean
}

export default function ComparativaContraQuincena(props: ComparativaContraQuincenaType) {
    const [state, setState] = useState({ arrayPasado: [{ fechaCorte: "" }], arrayVigente: [{ fechaCorte: "" }], sumPasado: [0], sumVigente: [0], sumAntePasado: [0], isFechaCorte8: false });

    const funGetTotalComparativa = () => {
        const vigente: any[] = [], pasado: any[] = [];
        const sumPasado: number[] = [0,0];
        const sumVigente: number[] = [0, 0];

        props.data.arrayVigente.map((element: any) => {
            vigente.push(element);
            sumVigente[0] = element.SumaCorteVigente;
            //sumVigente[1] += element.fechaCorte?.includes("08T") ? element.D_09 ?? 0 : element.D_24 ?? 0;
            //sumVigente[2] += element.fechaCorte?.includes("08T") ? element.D_10 ?? 0 : element.D_25 ?? 0;
            //sumVigente[3] += element.fechaCorte?.includes("08T") ? element.D_11 ?? 0 : element.D_26 ?? 0;
            //sumVigente[4] += element.fechaCorte?.includes("08T") ? element.D_12 ?? 0 : element.D_27 ?? 0;
            //sumVigente[5] += element.fechaCorte?.includes("08T") ? element.D_13 ?? 0 : element.D_28 ?? 0;
            //sumVigente[6] += element.fechaCorte?.includes("08T") ? element.D_14 ?? 0 : element.D_29 ?? 0;
            //sumVigente[7] += element.fechaCorte?.includes("08T") ? element.D_15 ?? 0 : element.D_30 ?? 0;
            //sumVigente[8] += element.fechaCorte?.includes("08T") ? element.D_16 ?? 0 : element.D_31 ?? 0;
            //sumVigente[9] += element.fechaCorte?.includes("08T") ? element.D_17 ?? 0 : element.D_01 ?? 0;
            //sumVigente[10] += element.fechaCorte?.includes("08T") ? element.D_18 ?? 0 : element.D_02 ?? 0;
            //sumVigente[11] += element.fechaCorte?.includes("08T") ? element.D_19 ?? 0 : element.D_03 ?? 0;
            //sumVigente[12] += element.fechaCorte?.includes("08T") ? element.D_20 ?? 0 : element.D_04 ?? 0;
            // sumVigente[13] += element.fechaCorte?.includes("08T") ? element.D_21 ?? 0: element.D_05 ?? 0 ;
            // sumVigente[14] += element.fechaCorte?.includes("08T") ? element.D_22 ?? 0: element.D_06 ?? 0 ;
            // sumVigente[15] += element.fechaCorte?.includes("08T") ? element.D_23 ?? 0: element.D_07 ?? 0 ;
        });

        props.data.arrayPasado.map((element: any) => {
            pasado.push(element);
            sumPasado[0] = element.SumaCortePasado;
            //sumPasado[1] += !vigente[0].fechaCorte?.includes("08T") ? element.D_09 ?? 0 : element.D_24 ?? 0;
            //sumPasado[2] += !vigente[0].fechaCorte?.includes("08T") ? element.D_10 ?? 0 : element.D_25 ?? 0;
            //sumPasado[3] += !vigente[0].fechaCorte?.includes("08T") ? element.D_11 ?? 0 : element.D_26 ?? 0;
            //sumPasado[4] += !vigente[0].fechaCorte?.includes("08T") ? element.D_12 ?? 0 : element.D_27 ?? 0;
            //sumPasado[5] += !vigente[0].fechaCorte?.includes("08T") ? element.D_13 ?? 0 : element.D_28 ?? 0;
            //sumPasado[6] += !vigente[0].fechaCorte?.includes("08T") ? element.D_14 ?? 0 : element.D_29 ?? 0;
            //sumPasado[7] += !vigente[0].fechaCorte?.includes("08T") ? element.D_15 ?? 0 : element.D_30 ?? 0;
            //sumPasado[8] += !vigente[0].fechaCorte?.includes("08T") ? element.D_16 ?? 0 : element.D_31 ?? 0;
            //sumPasado[9] += !vigente[0].fechaCorte?.includes("08T") ? element.D_17 ?? 0 : element.D_01 ?? 0;
            //sumPasado[10] += !vigente[0].fechaCorte?.includes("08T") ? element.D_18 ?? 0 : element.D_02 ?? 0;
            //sumPasado[11] += !vigente[0].fechaCorte?.includes("08T") ? element.D_19 ?? 0 : element.D_03 ?? 0;
            //sumPasado[12] += !vigente[0].fechaCorte?.includes("08T") ? element.D_20 ?? 0 : element.D_04 ?? 0;
            // sumPasado[13] += !vigente[0].fechaCorte?.includes("08T") ? element.D_21 ?? 0: element.D_05 ?? 0 ;
            // sumPasado[14] += !vigente[0].fechaCorte?.includes("08T") ? element.D_22 ?? 0: element.D_06 ?? 0 ;
            // sumPasado[15] += !vigente[0].fechaCorte?.includes("08T") ? element.D_23 ?? 0: element.D_07 ?? 0 ;
        });

 
        setState(s => ({ ...s, arrayPasado: pasado, arrayVigente: vigente, isFechaCorte8: pasado.length > 0 ? pasado[0].fechaCorte?.includes("08T") : !vigente[0].fechaCorte?.includes("08T"), sumPasado: sumPasado, sumVigente: sumVigente, }));
    } 

    useEffect(() => {
        funGetTotalComparativa();
    }, [props.loading])

    return (
        <>
            <h2 style={{ textTransform: "uppercase", textAlign: "center", color: "#000000" }}>Comparativa contra quincena</h2>
            {/* Tablas de dias a comparar entre corte vigente y corte pasada */}
            <h6><span style={{ fontWeight: "bold" }}>Corte Pasado:  {" "}</span>{state.arrayPasado.length > 0 ? state.arrayPasado[0]?.fechaCorte.split("T")[0] : "No hay corte pasado"}</h6>
            <h6><span style={{ fontWeight: "bold" }}>Corte Vigente: {" "}</span>{state.arrayVigente[0]?.fechaCorte.split("T")[0]}</h6>
            <div className="text-end">
                <h6>S/P - Sin porcentaje</h6>
            </div>
            <div>
                <TablaDiasComparacionCoordinador date={state.arrayPasado[0]?.fechaCorte} backgroundColor='#DBEBF3' data={props.data.arrayPasado} />
                <TablaDiasComparacionCoordinador date={state.arrayVigente[0]?.fechaCorte} backgroundColor={"#E3EBDB"} data={props.data.arrayVigente}  />
            </div>
            {/* FIN Tablas de dias a comparar entre corte vigente y corte pasada */}
            <div className='columns is-centered'>
                <div className="column is-narrow">
                    <div>
                        <Chart
                            options={{
                                chart: {
                                    width: '50%',
                                    type: 'line',
                                },
                                labels: ["",""],
                                responsive: [{
                                    breakpoint: 480,
                                    options: {
                                        chart: {
                                            width: '100%' 
                                        },
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }],
                                markers: {
                                    size: 3
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
                            series={[{
                                type: 'bar',
                                name: "Corte pasado",
                                color: '#0000FF',
                                data: state.sumPasado
                            }, {
                                type: 'bar',
                                name: "Corte vigente",
                                color: "#FF8000",
                                data: state.sumVigente
                            }]}
                            type="line"
                            width="700"
                            height="320"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}