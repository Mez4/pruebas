import React from 'react'
import { FormateoDinero } from '../../../../../../../global/variables'
import Tsp_HiTIndicadores_sp_Cartera from '../../../../../../../interfaces/sp/TIndicadores_sp_Cartera'
import { Indicator } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'

export const ResumenCartera = (props: { indicador: TIndicadorSP }) => {


    // Iteramos los elementos en el indicador
    const agruparCartera = props.indicador.Cartera.reduce((acc, cval) => {

        // Llave de producto
        acc[cval.Producto] = [...(acc[cval.Producto] || []), cval]
        return acc

    }, ({} as any))

    // Obtenemos las llaves de un objecto
    var keys = Object.keys(agruparCartera)

    // Render de componente
    return (
        <div>
            <h4>Resumen de la cartera</h4>
            <div className='row'>
                {keys.map((k, kId) =>
                    <Indicator key={kId} Title='' SubTitle={k} bgClassName={`${kId === 0 ? 'bg-primary' : 'bg-secondary'}`} textClassName='text-white'>
                        <table className="table table-sm text-white" style={{ backgroundColor: 'transparent' }}>
                            <thead>
                                <tr>
                                    <th scope="col" className='text-white'>Indicador</th>
                                    <th style={{ textAlign: 'right' }} scope="col" className='text-white'>Careta</th>
                                    <th style={{ textAlign: 'right' }} scope="col" className='text-white'>Calidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(agruparCartera[k] as Tsp_HiTIndicadores_sp_Cartera[]).map((i, iId) =>
                                    <tr key={iId}>
                                        <td style={{ fontSize: '14px' }}>{i.TipoCartera}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '500', fontSize: '14px' }}>{FormateoDinero.format(i.Cartera).replace(".00", "")}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '500', fontSize: '14px' }}>{FormateoDinero.format(i.Calidad).replace('$', '')}%</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Indicator>
                )}
            </div>
        </div>
    )
}