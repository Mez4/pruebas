import { useEffect, useMemo, useState } from "react"
import * as Funciones from '../../../Funciones'
import { IOidc } from "../../../../../../../interfaces/oidc/IOidc"
import Chart from 'react-apexcharts';

export default function ComparativaContraCorte(props: { oidc: IOidc, GrupoID: number, ProductoID: number, loading: boolean, data: {arrayVigente: any[],arrayPasado: any[]}, }) {
    const [state, setState] = useState({
        arrayPasado: [{ fechaCorte: "" }],
        arrayVigente: [{ fechaCorte: "" }],
        vigente2: {
            sumAnticipada: 0,
            sumPuntual: 0,
            sumTardia: 0,
            sumFinal: 0,
            sumAcumulado: 0,
            pendiente: 0,
            total: 0
        },
        pasado2: {
            sumAnticipada: 0,
            sumPuntual: 0,
            sumTardia: 0,
            sumFinal: 0,
            sumAcumulado: 0,
            pendiente: 0,
            total: 0
        },
        isFechaCorte8: false
    });

    const funGetTotalComparativa = () => {

        const vigente: any[] = [], pasado: any[] = [];
        let sumAnticipada = 0, sumPuntual = 0, sumTardia = 0, sumFinal = 0, sumAcumulado = 0, sumPendiente = 0, sumTotal = 0;

        props.data.arrayVigente.map((element: any) => {
            if(Boolean(element.Vigente)){
                vigente.push(element);
                sumAnticipada += element.TotalAnticipada;
                sumPuntual += element.TotalPuntual;
                sumAcumulado += element.TotalAcumulado;
                sumTardia += element.TotalTardia;
                sumFinal += element.TotalFinal;
                sumPendiente += element.TotalPendiente;
                sumTotal += element.Total;
            }
        });

        const objVigente = {
            sumAnticipada: sumAnticipada,
            sumPuntual: sumPuntual,
            sumAcumulado: sumAcumulado,
            sumTardia: sumTardia,
            sumFinal: sumFinal,
            pendiente: sumPendiente,
            total: sumTotal,
        }

        sumAnticipada = 0; sumPuntual = 0; sumAcumulado = 0; sumTardia = 0; sumFinal = 0;

        props.data.arrayPasado.map((element: any) => {
            if(Boolean(element.Pasado)){
                pasado.push(element);
                sumAnticipada += element.TotalAnticipada;
                sumPuntual += element.TotalPuntual;
                sumAcumulado += element.TotalAcumulado;
                sumTardia += element.TotalTardia;
                sumFinal += element.TotalFinal;
                sumPendiente += element.TotalPendiente;
                sumTotal += element.Total;
            }
        });

        const objPasado = {
            sumAnticipada: sumAnticipada,
            sumPuntual: sumPuntual,
            sumAcumulado: sumAcumulado,
            sumTardia: sumTardia,
            sumFinal: sumFinal,
            pendiente: sumPendiente,
            total: sumTotal
        }

        sumAnticipada = 0; sumPuntual = 0; sumAcumulado = 0; sumTardia = 0; sumFinal = 0;



        // if (arrayPasado.length > 0 && Boolean(arrayPasado[0].fechaCorte)) {
        setState(s => ({
            ...s,
            arrayPasado: pasado,
            arrayVigente: vigente,
            pasado2: objPasado,
            vigente2: objVigente,
            //isFechaCorte8: Boolean(pasado[0]?.FechaCorte) ? pasado[0].FechaCorte?.includes("08T") : !vigente[0].FechaCorte?.includes("08T")
        }));
        // }
    }

    useEffect(() => {
        funGetTotalComparativa()
    }, [props.loading])

    return (
        <>
            <h3 style={{ textAlign: "center" }}>Resumen global y comparativo contra corte</h3>
            <div className='columns'>
                <div className='table-container column is-full-mobile is-5-tablet is-7-desktop is-7-fullhd'>
                    <table className="table is-striped">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", background: "#e0ecf4" }} scope='col'>Indicador</th>
                                <th style={{ textAlign: "center", background: "#e0ecf4" }} scope='col'>Corte pasado</th>
                                <th style={{ textAlign: "center", background: "#e0ecf4" }} scope='col'>Corte vigente</th>
                                <th style={{ textAlign: "center", background: "#e0ecf4" }} scope='col'>Diferencial</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}>Anticipada</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalAnticipada < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalAnticipada) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalAnticipada)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalAnticipada < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalAnticipada) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalAnticipada)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalAnticipada == 0 && props.data.arrayPasado[0].TotalAnticipada < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalAnticipada) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalAnticipada) - (props.data.arrayPasado[0].TotalAnticipada)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalAnticipada - props.data.arrayPasado[0].TotalAnticipada) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalAnticipada- props.data.arrayPasado[0].TotalAnticipada).toLocaleString('en-US'))}%</span>)
                                }</td>                            
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Puntual</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalPuntual) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalPuntual) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalPuntual)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalPuntual < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalPuntual) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalPuntual)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalPuntual == 0 && props.data.arrayPasado[0].TotalPuntual < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalPuntual) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalPuntual) - (props.data.arrayPasado[0].TotalPuntual)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalPuntual - props.data.arrayPasado[0].TotalPuntual) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalPuntual- props.data.arrayPasado[0].TotalPuntual).toLocaleString('en-US'))}%</span>)
                                }</td>                            
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Acumulado</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalAcumulado) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalAcumulado) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalAcumulado)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalAcumulado < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalAcumulado) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalAcumulado)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalAcumulado == 0 && props.data.arrayPasado[0].TotalAcumulado < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalAcumulado) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalAcumulado) - (props.data.arrayPasado[0].TotalAcumulado)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalAcumulado - props.data.arrayPasado[0].TotalAcumulado) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalAcumulado- props.data.arrayPasado[0].TotalAcumulado).toLocaleString('en-US'))}%</span>)
                                }</td>                              
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Tardía</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalTardia) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalTardia) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalTardia)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalTardia < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalTardia) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalTardia)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalTardia == 0 && props.data.arrayPasado[0].TotalTardia < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalTardia) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalTardia) - (props.data.arrayPasado[0].TotalTardia)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalTardia- props.data.arrayPasado[0].TotalTardia) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalTardia- props.data.arrayPasado[0].TotalTardia).toLocaleString('en-US'))}%</span>)
                                }</td>                              
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Final</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalFinal) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalFinal) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalFinal)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalFinal < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalFinal) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalFinal)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalFinal == 0 && props.data.arrayPasado[0].TotalFinal < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalFinal) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalFinal) - (props.data.arrayPasado[0].TotalFinal)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalFinal- props.data.arrayPasado[0].TotalFinal) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalFinal- props.data.arrayPasado[0].TotalFinal).toLocaleString('en-US'))}%</span>)
                                }</td>                            
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Total</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].Total) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].Total) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].Total)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].Total < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].Total) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].Total)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].Total == 0 && props.data.arrayPasado[0].Total < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].Total) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].Total) - (props.data.arrayPasado[0].Total)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].Total- props.data.arrayPasado[0].Total) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].Total - props.data.arrayPasado[0].Total).toLocaleString('en-US'))}%</span>)
                                }</td>                            
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}>Pendiente</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayPasado[0].TotalPendiente) < 0 ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalPendiente) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayPasado[0].TotalPendiente)).toLocaleString('en-US')}%</span>}</td>
                                <td style={{ textAlign: "center" }}>{(props.data.arrayVigente[0].TotalPendiente < 0 ? <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalPendiente) * -1).toLocaleString('en-US')}%</span> : <span>{((props.data.arrayVigente[0].TotalPendiente)).toLocaleString('en-US')}%</span>)}</td>
                                <td style={{ textAlign: "center", fontWeight: 'bold' }}>{
                                        (props.data.arrayVigente[0].TotalPendiente == 0 && props.data.arrayPasado[0].TotalPendiente < 0) 
                                        ? <span style={{color:'red'}}>{((props.data.arrayPasado[0].TotalPendiente) * -1).toLocaleString('en-US')}%</span> :
                                        (((props.data.arrayVigente[0].TotalPendiente) - (props.data.arrayPasado[0].TotalPendiente)) < 0 
                                        ?  <span style={{color:'red'}}>{((props.data.arrayVigente[0].TotalPendiente- props.data.arrayPasado[0].TotalPendiente) * -1).toLocaleString('en-US')}%</span> 
                                        : <span style={{color:'green'}}>{((props.data.arrayVigente[0].TotalPendiente- props.data.arrayPasado[0].TotalPendiente).toLocaleString('en-US'))}%</span>)
                                }</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ textAlign: "center" }}>Cortes</td>
                                <td style={{ textAlign: "center" }}>{props.data.arrayPasado[0]?.FechaCorte.split("T")[0]}</td>
                                <td style={{ textAlign: "center" }}>{props.data.arrayVigente[0]?.FechaCorte.split("T")[0]}</td>
                                <td style={{ textAlign: "center" }}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='column is-full-mobile is-5-tablet is-4-desktop is-5-fullhd'>
                    <div>
                        <Chart
                            options={{
                                chart: {
                                    width: '100%',
                                    type: 'bar',
                                },
                                responsive: [{
                                    breakpoint: 480,
                                    options: {
                                        chart: {
                                            width: '100%'
                                        },
                                        legend: {
                                            position: 'bottom'
                                        },
                                    }
                                }],
                                labels: ["Corte pasado", "Corte vigente"],
                                yaxis: {
                                    decimalsInFloat: 2,
                                    labels: {
                                        formatter: function (val, opts) {
                                            return val.toLocaleString('en-US')
                                        },
                                    }
                                },
                                dataLabels: {
                                    background: {
                                        enabled: true,
                                        foreColor: "#1d1d1d",
                                        dropShadow: { enabled: false }
                                    },
                                    formatter: function (val: number) {
                                        return val.toLocaleString("en-US")
                                    }
                                },
                            }}
                            series={
                                [
                                    {
                                        name: "Anticipado",// Color azul es para anticipada y verde para puntual
                                        data: [props.data.arrayPasado[0].TotalAnticipada, props.data.arrayVigente[0].TotalAnticipada] // 1er Azul y 2do verde
                                    },
                                    {
                                        name: "Puntual", // Color azul es para anticipada y verde para puntual
                                        data: [props.data.arrayPasado[0].TotalPuntual, props.data.arrayVigente[0].TotalPuntual] // 1er Azul y 2do verde
                                    }
                                ]
                            }
                            type="bar"
                            width="350"
                            height={'300'}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}