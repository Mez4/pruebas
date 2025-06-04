import React from 'react'
import { FaList } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../../../global/variables'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'


const TablaSociasPendientes = (props: { indicador: TIndicadorSP }) => {

    const LastItem = props.indicador.CobranzaPorCoordinador__DiaCero[props.indicador.CobranzaPorCoordinador__DiaCero.length - 1]

    return (
        <Card Title={
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                <FaList className={'mr-2 is-size-7'} />
                <span className='is-size-7 has-text-weight-semibold'>Resumen de la cuenta vigente</span>
            </div>
        }>
            <Card.Body clssName='p-0'>
                <table className="table table-sm responsibe__table" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                    <thead className=''>
                        <tr>
                            <th className='p-1 pl-2 has-background-link text-white' scope="col" style={{ width: '60%' }}>Coordinador</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Pendientes</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Pendiente[$]</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Pendiente[%]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.indicador.CobranzaPorCoordinador__DiaCero.slice(0, -1).map((c, cId) =>
                            <tr key={cId}>
                                <td className='py-1 pl-2' style={{ width: '100%' }}>{c.Coordinador}</td>
                                <td className='p-1 px-2 has-text-right'>{c.Dvs_Vencido}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format(c.Pendiente).replace(".00", "")}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format(c.Porc_Pendiente).replace('$', '')} %</td>
                            </tr>
                        )}
                        {LastItem &&
                            <tr className='has-background-grey-dark  text-white' >
                                <td className='py-1 pl-2 has-text-centered' style={{ width: '100%' }}>TOTAL</td>
                                <td className='p-1 px-2 has-text-right'>{LastItem.Dvs_Vencido}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format(LastItem.Pendiente).replace(".00", "")}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format(LastItem.Porc_Pendiente).replace('$', '')} %</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Card.Body>
        </Card>
    )
}

export default TablaSociasPendientes