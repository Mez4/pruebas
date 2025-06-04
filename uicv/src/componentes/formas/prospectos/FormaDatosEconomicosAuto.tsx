import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { ErrorMessage } from 'formik'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import { BiUserPlus, BiBadgeCheck } from 'react-icons/bi'
import { DBConfia_Prospeccion } from '../../../interfaces_db/DBConfia/Prospeccion'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    accion(item: any): any,
    Vehs?: DBConfia_Prospeccion.IRelacionAutoMoto[],
    TieneVeh?: boolean
}

export const FormaDatosEconomicosAuto = ({ Prefijo, Titulo, SubTitulo, accion, Vehs, TieneVeh }: DireccionTipo) => {

    const [TieneAutoMoto, setTieneAutoMoto] = React.useState('')
    const [TieneAutoMotoDisplay, setTieneAutoMotoDisplay] = React.useState('none')
    const [Vehiculos, setVehiculos] = React.useState([])
    const [tablaDisplay, setTablaDisplay] = React.useState('none')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}TieneAutoMoto`] = ''
    InitialValues[`${Prefijo}Marca`] = ''
    InitialValues[`${Prefijo}Modelo`] = ''
    InitialValues[`${Prefijo}Vehiculos`] = ''

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}TieneAutoMoto`] = Yup.boolean().typeError('Selecciona una opción').required()
    if (TieneAutoMotoDisplay === 'block') {
        ValSchemaObjecet[`${Prefijo}Marca`] = Yup.string().required('Captura y agrega el vehiculo')
        ValSchemaObjecet[`${Prefijo}Modelo`] = Yup.string().required('Captura y agrega el vehiculo')
    }
    const TieneAutoMotoSelected = (val: string) => {
        setTieneAutoMotoDisplay(val === 'true' ? 'block' : 'none')
        setTieneAutoMoto(val)
        if (val === 'false') {
            setTablaDisplay('none')
            setVehiculos([])
            accion(Vehiculos)
        }
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const AddElement = async () => {
        setTieneAutoMotoDisplay('none')
        setTablaDisplay('none')
        let marca: string = document.getElementsByName('ProspectoPersona_Marca')[0]['value']
        let modelo: string = document.getElementsByName('ProspectoPersona_Modelo')[0]['value']
        if ((marca.length > 0) && (modelo.length > 0)) {
            let arrVeiculos = Vehiculos as any
            let nuevoVeiculo = { marca, modelo }
            arrVeiculos.push(nuevoVeiculo)
            setVehiculos(arrVeiculos)
            accion(Vehiculos)
            await timeout(100);
            setTablaDisplay('block')
        } else {
            if (Vehiculos.length > 0) { setTablaDisplay('block') }
            setTieneAutoMotoDisplay('block')
        }
    }

    const RemoveElement = async (index: number) => {
        setTablaDisplay('none')
        let arrVeiculos = Vehiculos as any
        arrVeiculos.splice(index, 1)
        setVehiculos(arrVeiculos)
        await timeout(100);
        if (Vehiculos.length > 0) {
            setTablaDisplay('block')
        } else {
            setTieneAutoMoto('false')
        }
        accion(Vehiculos)
    }

    if (TieneVeh === false && TieneAutoMoto === '')
        TieneAutoMotoSelected('false')

    if ((Vehs?.length ?? 0) > 0 && TieneAutoMoto === '') {
        TieneAutoMotoSelected('true')
        setTieneAutoMotoDisplay('none')
        Vehs?.forEach((e: DBConfia_Prospeccion.IRelacionAutoMoto) => {
            let arrVeiculos = Vehiculos as any
            let nuevoVeiculo = { marca: e.Marca, modelo: e.Modelo }
            arrVeiculos.push(nuevoVeiculo)
            setVehiculos(arrVeiculos)
            accion(Vehiculos)
        })
        setTablaDisplay('block')
    }
    // else if((Vehs?.length ?? 0) === 0 && TieneAutoMoto === '')
    //     TieneAutoMotoSelected('false')

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <CustomSelect2 name={`${Prefijo}TieneAutoMoto`} disabled={false} options={[{ value: true, label: 'Si tiene.' }, { value: false, label: 'No tiene.' }]} addDefault={false} label={'¿Tiene Vehiculo?'} placeholder={'¿El prospecto tiene auto o moto?'} accion={TieneAutoMotoSelected} valor={TieneAutoMoto} />
                <br />
                {TieneAutoMotoDisplay === 'block' && <div style={{ display: TieneAutoMotoDisplay, padding: '1em', backgroundColor: '#f0f0f0' }}>
                    <h6 className={MODAL_TITLE_CLASS}>*Captura Vehiculo (auto o moto)</h6>
                    <div className={"row"} style={{ marginBottom: '1em' }}>
                        <div className={"col-sm-12 col-md-6"}>
                            <div className="input-group">
                                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={`${Prefijo}Marca`}>{'Marca'}</label>
                                <input type="input" className="form-control" name={`${Prefijo}Marca`} defaultValue={''} />
                            </div>
                            <ErrorMessage component="div" name={`${Prefijo}Marca`} className="text-danger" />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <div className="input-group">
                                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={`${Prefijo}Modelo`}>{'Modelo'}</label>
                                <input type="input" className="form-control" name={`${Prefijo}Modelo`} defaultValue={''} />
                            </div>
                            <ErrorMessage component="div" name={`${Prefijo}Modelo`} className="text-danger" />
                        </div>
                    </div>
                    <div className='' style={{ textAlign: 'end' }}>
                        <button disabled={Vehiculos.length === 0} className="btn btn-danger" type="button" onClick={() => setTieneAutoMotoDisplay('none')}>NO AGREGAR</button>
                        &nbsp;
                        <button className="btn btn-success" type="button" onClick={AddElement}>AGREGAR VEHICULO</button>
                    </div>
                </div>}
                <div style={{ textAlign: 'center' }}>
                    {(TieneAutoMotoDisplay === 'none' && tablaDisplay === 'block') && <button className="btn btn-success" type="button" onClick={() => setTieneAutoMotoDisplay('block')}>CAPTURAR OTRO VEHICULO</button>}
                </div>
                <br />
                {(TieneAutoMotoDisplay === 'block' && tablaDisplay == 'none') && <div style={{ padding: '3em', backgroundColor: '#f9f9f9', textAlign: 'end' }}>
                    <h6 style={{ color: 'red' }} className={MODAL_TITLE_CLASS}>*Sin vehiculos agregados</h6>
                </div>}
                <div style={{ display: tablaDisplay, padding: '3em', backgroundColor: '#f9f9f9' }}>
                    <h6 className={MODAL_TITLE_CLASS}>*Vehiculos Capturados</h6>
                    <table className="table table-sm m-0 mt-0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Vehiculos.map((c: any, cId: number) =>
                                    <tr key={'crd_' + cId}>
                                        <td><BiBadgeCheck color={'green'} size={20} /></td>
                                        <td><p style={{ padding: '3px' }}>{c.marca}</p></td>
                                        <td><p style={{ padding: '3px' }}>{c.modelo}</p></td>
                                        <td>
                                            <button type="button" onClick={() => RemoveElement(cId)}>QUITAR</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <br />
            </div>
        )
    }
}