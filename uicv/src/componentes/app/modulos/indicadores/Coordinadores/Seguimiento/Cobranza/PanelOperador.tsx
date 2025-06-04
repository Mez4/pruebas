import React from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { Card } from '../../../../../../global'
import ReactApexChart from 'react-apexcharts'
import { FormateoDinero } from '../../../../../../../global/variables'
import { RiAlertFill } from 'react-icons/ri'
import TIndicadorSP from './TIndicadorSP'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../../interfaces/sp/TIndicadores_sp_Historicos'

/**
 * Nuevo componente de panel de operador, ahora basado en info de SPs
 * @param props {TIndicadorSP} Información de los SPs
 * @returns {React Component}
 */
const PanelOperador = (props: { indicador: TIndicadorSP, distribuidoras090: Tsp_HiTIndicadores_sp_Historicos[] }): React.ReactElement => {

    // console.log('indicador: ', props.indicador)
    // console.log('distribuidoras090: ', props.distribuidoras090)

    // Opciones para nuestro grafico
    let options: ApexCharts.ApexOptions = {
        chart: {
            type: "pie",
            width: 380
        },
        labels: ['Puntual', 'Impuntual', 'Tardia', 'SinPago'],
        legend: {
            show: true,
            position: 'bottom'
        },
        dataLabels: {
            enabled: false,
            style: {
                colors: ["#000000"]
            },
            formatter: function (val, opts) {
                return `${opts.w.globals.labels[opts.seriesIndex]}: ${FormateoDinero.format(val as number)} %`;
            },
        }
    }

    // Convenios, detalle
    const saldoConvenio090 = props.distribuidoras090.filter(f => f.DistribuidorEstatus === "C").map(c => c.Saldo).reduce((p, a) => p + a, 0)
    const cuentasConvenio090 = props.distribuidoras090.filter(f => f.DistribuidorEstatus === "C" && f.Saldo > 0).length

    // Calcula la calidad de convenio
    const calcularCalidadConvenio = (saldo: number) =>
        saldo > 0 && props.indicador.Coordinador.Vencido > 0
            ? 100 - ((100 / props.indicador.Coordinador.Vencido) * saldo)
            : 0

    // Obtenemos la calidad del convenio
    const calidadConvenio090 = calcularCalidadConvenio(saldoConvenio090)

    // Render del componente
    return (
        <div>
            <h4>Panel del coordinador</h4>
            <div className='row'>
                <div className='col-md-12 col-lg-8'>
                    <Card Title={
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                            <FaUserAlt className={'mr-2 is-size-7'} />
                            <span className='is-size-7'> Socias con <span className='has-text-weight-semibold'>días atraso 0</span></span>
                        </div>
                    }>
                        <Card.Body clssName='p-2'>
                            {props.indicador.Coordinador !== null &&
                                <div className='row'>
                                    <div className='col-sm-12 col-md-12 col-lg-8'>
                                        <table className="table table-sm responsibe__table">
                                            <thead className='has-background-link'>
                                                <tr>
                                                    <th scope="col" className='has-text-light has-background-link'>Concepto</th>
                                                    <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'></th>
                                                    <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'>Recuperación</th>
                                                    <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'>Cuentas</th>
                                                    <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'>Peso</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Por Cobrar</th>
                                                    <td data-label={'Total'} style={{ textAlign: 'right' }}><strong>{FormateoDinero.format(props.indicador.Coordinador.Vencido)}</strong></td>
                                                    <td data-label={'Recuperado'} style={{ textAlign: 'right' }}>
                                                        {/* <strong>
                                                        {FormateoDinero.format(0)}
                                                    </strong> */}
                                                        &nbsp;
                                                    </td>
                                                    <td data-label={'Cuentas'} style={{ textAlign: 'right' }}>
                                                        <strong>
                                                            {props.indicador.Coordinador.Dvs_Vencido}
                                                        </strong>
                                                    </td>
                                                    <td data-label={'Peso'} style={{ textAlign: 'right' }}>
                                                        <strong> - </strong>
                                                    </td>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Anticipada</th>
                                                    <td data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaPA).replace(".00", "")}</td>
                                                    <td data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaPA).replace("$", "")}%</td>
                                                    <td data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaPA}</td>
                                                    <td data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_CobranzaPA).replace('$', '')}%</td>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Puntual</th>
                                                    <th data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaPP).replace(".00", "")}</th>
                                                    <th data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaPP).replace("$", "")}%</th>
                                                    <th data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaPP}</th>
                                                    <th data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_CobranzaPP).replace('$', '')}%</th>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Impuntual</th>
                                                    <td data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaPI).replace(".00", "")}</td>
                                                    <td data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaPI).replace("$", "")}%</td>
                                                    <td data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaPI}</td>
                                                    <td data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_CobranzaPI).replace('$', '')}%</td>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Tardio</th>
                                                    <td data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaPT).replace(".00", "")}</td>
                                                    <td data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaPT).replace("$", "")}%</td>
                                                    <td data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaPT}</td>
                                                    <td data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_CobranzaPT).replace('$', '')}%</td>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Sin Pago</th>
                                                    <td data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaSP).replace(".00", "")}</td>
                                                    <td data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaSP).replace("$", "")}%</td>
                                                    <td data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaSP}</td>
                                                    <td data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_CobranzaSP).replace('$', '')}%</td>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row">Final</th>
                                                    <th data-label={'Cobranza'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.CobranzaFinal).replace(".00", "")}</th>
                                                    <th data-label={'% Recuperado'} style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_CobranzaFinal).replace("$", "")}%</th>
                                                    <th data-label={'Cuentas'} style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_CobranzaFinal}</th>
                                                    <th data-label={'Peso'} style={{ textAlign: 'right' }}>{FormateoDinero.format(0).replace('$', '')}%</th>
                                                </tr>
                                                <tr className='has-background-white'>
                                                    <th scope="row" className="text-danger">PENDIENTE</th>
                                                    <th data-label={'Cobranza'} className="text-danger" style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Pendiente).replace(".00", "")}</th>
                                                    <th data-label={'% Recuperado'} className="text-danger" style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Porc_Pendiente).replace("$", "")}%</th>
                                                    <th data-label={'Cuentas'} className="text-danger" style={{ textAlign: 'right' }}>{props.indicador.Coordinador.Dvs_Pendiente}</th>
                                                    <th data-label={'Peso'} className="text-danger" style={{ textAlign: 'right' }}>{FormateoDinero.format(props.indicador.Coordinador.Peso_Pendiente).replace('$', '')}%</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-sm-12 col-md-6 col-lg-4'>
                                        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                                            <ReactApexChart options={options} series={[props.indicador.Coordinador.Porc_CobranzaPP, props.indicador.Coordinador.Porc_CobranzaPI, props.indicador.Coordinador.Porc_CobranzaPT, props.indicador.Coordinador.Porc_CobranzaSP]} type="pie" width={"100%"} />
                                            {/* <ReactApexChart options={options} series={[55, 20, 15, 10]} type="pie" width={"100%"} /> */}
                                        </div>
                                    </div>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                </div>


                {/** ################################################
                Indicador de calidad de cartera
                ################################################ **/}

                <div className='col-md-12 col-lg-4'>
                    <Card Title={
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                            <RiAlertFill className={'mr-2 is-size-7'} />
                            <span className='is-size-7 has-text-weight-semibold'>Seguimiento convenios</span>
                        </div>
                    }>
                        <Card.Body clssName='p-0'>
                            <table className="table table-sm responsibe__table">
                                <thead className='has-background-link'>
                                    <tr>
                                        <th scope="col" className='has-text-light has-background-link'>Indicador</th>
                                        <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'>Cartera</th>
                                        <th style={{ textAlign: 'right' }} scope="col" className='has-text-light has-background-link'>Calidad</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <th scope="row">Cartera</th>
                                        <td data-label={'Total'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(saldoConvenio090).replace(".00", "")}
                                            </strong>
                                        </td>
                                        <td data-label={'Calidad'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(calidadConvenio090).replace('$', '')}%
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Saldo Riesgo</th>
                                        <td data-label={'Riesgo'} style={{ textAlign: 'right' }}><strong>{FormateoDinero.format(saldoConvenio090).replace(".00", "")}</strong></td>
                                        <td data-label={'% Recuperado'} style={{ textAlign: 'right' }}>-</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Socias</th>
                                        <td data-label={'Socias'} style={{ textAlign: 'right' }}>
                                            <strong>{cuentasConvenio090}</strong></td>
                                        <td data-label={'Calidad.Socias'} style={{ textAlign: 'right' }}>-</td>
                                    </tr>

                                    <tr>
                                        <th scope="row">1-15 Días</th>
                                        <td data-label={'Cartera'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(props.indicador.Distribuidoras__1_15__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, c) => p + c, 0)).replace(".00", "")}
                                            </strong>
                                        </td>
                                        <td data-label={'Calidad'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(calcularCalidadConvenio(props.indicador.Distribuidoras__1_15__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, c) => p + c, 0))).replace('$', '')} %
                                            </strong>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">1-45 Días</th>
                                        <td data-label={'Cartera'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(props.indicador.Distribuidoras__1_45__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, a) => p + a, 0)).replace(".00", "")}
                                            </strong>
                                        </td>
                                        <td data-label={'Calidad'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(calcularCalidadConvenio(props.indicador.Distribuidoras__1_45__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, c) => p + c, 0))).replace('$', '')} %
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">46-90 Días</th>
                                        <td data-label={'Cartera'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(props.indicador.Distribuidoras__46_90__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, a) => p + a, 0)).replace(".00", "")}
                                            </strong>
                                        </td>
                                        <td data-label={'Calidad'} style={{ textAlign: 'right' }}>
                                            <strong>
                                                {FormateoDinero.format(calcularCalidadConvenio(props.indicador.Distribuidoras__46_90__Diasatraso.filter(f => f.DistribuidorEstatus === "C").map(m => m.Saldo).reduce((p, c) => p + c, 0))).replace('$', '')} %
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default PanelOperador