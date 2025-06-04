import React from 'react'
import { FaList } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../../../global/variables'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'
import Select, { OptionsType } from 'react-select'

const TablaResumenQuincena = (props: { indicador: TIndicadorSP }) => {

    const LastItem = props.indicador.CobranzaPorCoordinador__DiaCero[props.indicador.CobranzaPorCoordinador__DiaCero.length - 1]
    const options: OptionsType<{ value: number, label: string }> = [
        { value: 1, label: 'Anticipada' },
        { value: 2, label: 'Puntual' },
        { value: 3, label: 'Impuntual' },
        { value: 4, label: 'Tardia' },
        { value: 5, label: 'Final' }
    ]

    const [selectedItems, setSelectedItems] = React.useState<OptionsType<{ value: number, label: string }>>([
        { value: 1, label: 'Anticipada' },
        { value: 2, label: 'Puntual' },
        { value: 5, label: 'Final' }
    ])

    return (
        <Card Title={
            <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <FaList className={'mr-2 is-size-7'} />
                    <span className='is-size-7 has-text-weight-semibold'>Cuenta vigentes</span>
                </div>
            </React.Fragment>
        }>
            <Card.Body clssName='p-0'>
                <Select options={options} className={"mx-2 mb-2 mt-3"} isMulti={true} onChange={(e) => setSelectedItems(e)} defaultValue={selectedItems} />
                <table className="table table-sm responsibe__table" style={{ fontSize: '0.7rem' }}>
                    <thead className=''>
                        <tr>
                            <th className='p-1 pl-2 has-background-link text-white' scope="col" style={{ width: '12%' }}>Coordinador</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">X.Cobrar</th>
                            {selectedItems.find(f => f.value === 1) && <React.Fragment>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#269e57' }} scope="col">Anticipada</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#269e57', width: '75px' }} scope="col">%</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#269e57', width: '70px' }} scope="col">DVs</th>
                            </React.Fragment>}
                            {selectedItems.find(f => f.value === 2) && <React.Fragment>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#1e7843' }} scope="col">Puntual</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#1e7843', width: '75px' }} scope="col">%</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#1e7843', width: '70px' }} scope="col">DVs</th>
                            </React.Fragment>}
                            {selectedItems.find(f => f.value === 3) && <React.Fragment>
                                <th className='p-1 px-2 text-white has-background-warning-dark' style={{ textAlign: 'right' }} scope="col">Inpuntual</th>
                                <th className='p-1 px-2 text-white has-background-warning-dark' style={{ textAlign: 'right', width: '75px' }} scope="col">%</th>
                                <th className='p-1 px-2 text-white has-background-warning-dark' style={{ textAlign: 'right', width: '70px' }} scope="col">DVs</th>
                            </React.Fragment>}
                            {selectedItems.find(f => f.value === 4) && <React.Fragment>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#ab3f00' }} scope="col">Tardia</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#ab3f00', width: '75px' }} scope="col">%</th>
                                <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#ab3f00', width: '70px' }} scope="col">DVs</th>
                            </React.Fragment>}
                            {selectedItems.find(f => f.value === 5) && <React.Fragment>
                                <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Final</th>
                                <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right', width: '75px' }} scope="col">%</th>
                                <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right', width: '70px' }} scope="col">DVs</th>
                            </React.Fragment>}
                            <th className='p-1 px-2 text-white' style={{ textAlign: 'right', backgroundColor: '#d13f3f' }} scope="col">Pendiente</th>
                            <th className='p-1 pr-2 text-white' style={{ textAlign: 'right', backgroundColor: '#d13f3f', width: '75px' }} scope="col">%</th>
                            <th className='p-1 pr-2 text-white' style={{ textAlign: 'right', backgroundColor: '#d13f3f', width: '70px' }} scope="col">DVs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.indicador.CobranzaPorCoordinador__DiaCero.slice(0, -1).map((c, cId) =>
                            <tr key={cId}>
                                <td className='py-1 pl-2' style={{ width: '100%' }}>{c.Coordinador}</td>
                                <td className='p-1 px-2 has-text-right' style={{ fontWeight: '600' }} >{FormateoDinero.format(c.Vencido).replace(".00", "")}</td>

                                {selectedItems.find(f => f.value === 1) && <React.Fragment>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#269e57' }}>{FormateoDinero.format(c.CobranzaPA).replace(".00", "")}</td>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#269e57' }}>{FormateoDinero.format(c.Porc_CobranzaPA).replace('$', '')}%</td>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#269e57' }}>{c.Dvs_CobranzaPA}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 2) && <React.Fragment>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#1e7843' }}>{FormateoDinero.format(c.CobranzaPP).replace(".00", "")}</td>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#1e7843' }}>{FormateoDinero.format(c.Porc_CobranzaPP).replace('$', '')}%</td>
                                    <td className='p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#1e7843' }}>{c.Dvs_CobranzaPP}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 3) && <React.Fragment>
                                    <td className='p-1 px-2 has-text-right has-text-warning-dark' style={{ fontWeight: '600', color: '#dbc500' }}>{FormateoDinero.format(c.CobranzaPI).replace(".00", "")}</td>
                                    <td className='p-1 px-2 has-text-right has-text-warning-dark' style={{ fontWeight: '600', color: '#dbc500' }}>{FormateoDinero.format(c.Porc_CobranzaPI).replace('$', '')}%</td>
                                    <td className='p-1 px-2 has-text-right has-text-warning-dark' style={{ fontWeight: '600', color: '#dbc500' }}>{c.Dvs_CobranzaPI}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 4) && <React.Fragment>
                                    <td className='p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ab3f00' }}>{FormateoDinero.format(c.CobranzaPT).replace(".00", "")}</td>
                                    <td className='p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ab3f00' }}>{FormateoDinero.format(c.Porc_CobranzaPT).replace('$', '')}%</td>
                                    <td className='p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ab3f00' }}>{c.Dvs_CobranzaPT}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 5) && <React.Fragment>
                                    <td className='p-1 px-2 has-text-right has-text-link' style={{ fontWeight: '600' }}>{FormateoDinero.format(c.CobranzaFinal).replace(".00", "")}</td>
                                    <td className='p-1 px-2 has-text-right has-text-link' style={{ fontWeight: '600' }}>{FormateoDinero.format(100 - c.Porc_Pendiente).replace('$', '')}%</td>
                                    <td className='p-1 px-2 has-text-right has-text-link' style={{ fontWeight: '600' }}>{c.Dvs_CobranzaFinal}</td>
                                </React.Fragment>}
                                <td className='p-1 px-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{FormateoDinero.format(c.Pendiente).replace(".00", "")}</td>
                                <td className='py-1 pr-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{FormateoDinero.format(c.Porc_Pendiente).replace('$', '')}%</td>
                                <td className='py-1 pr-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{c.Dvs_Pendiente}</td>
                            </tr>
                        )}
                        {LastItem &&
                            <tr className='has-background-grey-dark'>
                                <td className='has-background-grey-dark py-1 pl-2 text-white' style={{ width: '100%', textAlign: 'center', fontWeight: '800' }}>TOTAL</td>
                                <td className='has-background-grey-dark p-1 px-2 has-text-right text-white' style={{ fontWeight: '600' }} >{FormateoDinero.format(LastItem.Vencido).replace(".00", "")}</td>

                                {selectedItems.find(f => f.value === 1) && <React.Fragment>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#35d476' }}>{FormateoDinero.format(LastItem.CobranzaPA).replace(".00", "")}</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#35d476' }}>{FormateoDinero.format(LastItem.Porc_CobranzaPA).replace('$', '')}%</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ borderWidth: 0, fontWeight: '600', color: '#35d476' }}>{LastItem.Dvs_CobranzaPA}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 2) && <React.Fragment>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right text-white' style={{ fontWeight: '600' }}>{FormateoDinero.format(LastItem.CobranzaPP).replace(".00", "")}</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right text-white' style={{ fontWeight: '600' }}>{FormateoDinero.format(LastItem.Porc_CobranzaPP).replace('$', '')}%</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right text-white' style={{ fontWeight: '600' }}>{LastItem.Dvs_CobranzaPP}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 3) && <React.Fragment>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ffe500' }}>{FormateoDinero.format(LastItem.CobranzaPI).replace(".00", "")}</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ffe500' }}>{FormateoDinero.format(LastItem.Porc_CobranzaPI).replace('$', '')}%</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#ffe500' }}>{LastItem.Dvs_CobranzaPI}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 4) && <React.Fragment>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#e05300' }}>{FormateoDinero.format(LastItem.CobranzaPT).replace(".00", "")}</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#e05300' }}>{FormateoDinero.format(LastItem.Porc_CobranzaPT).replace('$', '')}%</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#e05300' }}>{LastItem.Dvs_CobranzaPT}</td>
                                </React.Fragment>}
                                {selectedItems.find(f => f.value === 5) && <React.Fragment>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#1f87ff' }}>{FormateoDinero.format(LastItem.CobranzaFinal).replace(".00", "")}</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#1f87ff' }}>{FormateoDinero.format(100 - LastItem.Porc_Pendiente).replace('$', '')}%</td>
                                    <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ fontWeight: '600', color: '#1f87ff' }}>{LastItem.Dvs_CobranzaFinal}</td>
                                </React.Fragment>}
                                <td className='has-background-grey-dark p-1 px-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{FormateoDinero.format(LastItem.Pendiente).replace(".00", "")}</td>
                                <td className='has-background-grey-dark py-1 pr-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{FormateoDinero.format(LastItem.Porc_Pendiente).replace('$', '')}%</td>
                                <td className='has-background-grey-dark py-1 pr-2 has-text-right' style={{ color: '#d13f3f', fontWeight: '600' }}>{LastItem.Dvs_Pendiente}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Card.Body>
        </Card>
    )
}

export default TablaResumenQuincena