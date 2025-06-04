import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import * as Funciones from '../../../Funciones';
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc';
import moment from 'moment';
import { addOneDay, addSevenDay } from '../../../../../../../global/functions';

type ResumenQuincenaVigentesType = {
    data: any[],
    loading: boolean,
    oidc: IOidc,
    Grupo: number,
    ProductoID: string,
    Fecha: string,
    SucursalID: number,
}

export default function ResumenQuincenaVigentes(props: ResumenQuincenaVigentesType) {
    const [info, setInfo] = useState({ Pactado: 0, Anticipada: 0, Puntual: 0, Tardia: 0, Final: 0, Acumulada: 0, Total:0, Pendiente:0 });

    const funGetResumenQuincenaVigentes = async () => {
        Funciones.FNResumenQuincenaVigentes(props.oidc, { DistribuidorID: 0, isGerente: false, GrupoID: props.Grupo, SucursalID: props.SucursalID })
            .then((respuesta: any) => {
                const res: any = { Pactado: 0, Anticipada: 0, Puntual: 0, Tardia: 0, Final: 0, Acumulada: 0, Total:0, Pendiente:0 };
                respuesta.map(element => {
                    console.log("ELEMENTRESUMENQUINCENAS", element)

                    res['Anticipada'] += element['Anticipada'] ?? 0;
                    res['Puntual'] += element['Puntual'] ?? 0; // Puntual
                    res['Tardia'] += element['Tardia'] ?? 0;
                    res['Final'] += element['Final'] ?? 0; // Final
                    res['Pactado'] += element['Pactado'] ?? 0;
                    res['Pendiente'] += element['Pendiente'] ?? 0;
                    res['Total'] += element['Total'] ?? 0;
                    res['Acumulada'] += element['Acumulada'] ?? 0;
                })

                res['Pactado'] = res['Pactado'] > 0 ? res['Pactado'] : 1;

                setInfo(res);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        funGetResumenQuincenaVigentes();
    }, [props.Grupo])

    return (
        <>
            <h2 style={{ textTransform: "uppercase", textAlign: "center", color: "#000000" }}>Resumen de la quincena vigentes {props.Fecha ? moment(addOneDay(new Date(props.Fecha))).format('DD-MM-YYYY') : ''}</h2>
            <div className='columns' style={{ flex: 1, alignContent: "center" }}>
                <div className="column is-full-mobile is-6-tablet is-6-desktop is-7-widescreen">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center" }} scope="col">Concepto</th>
                                <th style={{ textAlign: "center" }} scope="col">Monto</th>
                                <th style={{ textAlign: "center" }} scope="col">Recuperaci&oacute;n</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th style={{ textAlign: "center" }} scope="row">Pactado</th>
                                <td style={{ textAlign: "center" }}>{(info.Pactado == 1 ? 0 : info.Pactado).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>-</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }} scope="row">Anticipada</td>
                                <td style={{ textAlign: "center" }}>{info.Anticipada.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * (info.Anticipada / info.Pactado)) > 100 ? 100 :(100 * (info.Anticipada / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }} scope="row">Puntual</td>
                                <td style={{ textAlign: "center" }}>{info.Puntual.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * (info.Puntual / info.Pactado)) > 100 ? 100 : (100 * (info.Puntual / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: "center" }} scope="row">Acumulado</th>
                                <td style={{ textAlign: "center" }}>{(info.Acumulada).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * ((info.Acumulada) / info.Pactado)) > 100 ? 100 : (100 * ((info.Acumulada) / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }} scope="row">Tardía</td>
                                <td style={{ textAlign: "center" }}>{info.Tardia.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * (info.Tardia / info.Pactado)) > 100 ? 100 : (100 * (info.Tardia / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }} scope="row">Final</td>
                                <td style={{ textAlign: "center" }}>{info.Final.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * (info.Final / info.Pactado)) > 100 ? 100 : (100 * (info.Final / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: "center" }} scope="row">Total</th>
                                <td style={{ textAlign: "center" }}>{info.Total.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{((100 * (info.Total / info.Pactado)) > 100 ? 100 : (100 * (info.Total / info.Pactado))).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }} scope="row">Pendiente</td>
                                <td style={{ textAlign: "center" }}>{(info.Pendiente).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</td>
                                <td style={{ textAlign: "center" }}>{(100 * ((info.Pendiente) / info.Pactado)).toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="column is-full-mobile is-6-tablet is-6-desktop is-3-widescreen">
                    <Chart
                        options={{
                            chart: {
                                width: '50%',
                                type: 'pie',
                            },
                            colors: ['#2E93fA', '#66DA26', '#546E7A', '#FF9800', '#FF0000'],
                            labels: ['Anticipada', 'Puntual', 'Tardia', 'Final', 'Pendiente'],
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: '100%',
                                    },
                                    legend: {
                                        position: 'bottom'
                                    },
                                }
                            }],
                            dataLabels: {
                                formatter: function (val: number) {
                                    return val.toFixed(2) + '%'
                                },
                            }
                        }}
                        series={[info.Anticipada, info.Puntual, info.Tardia, info.Final, info.Pendiente]}
                        type="pie"
                        width="380"
                    />
                </div>
            </div>
        </>
    )
}