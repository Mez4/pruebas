import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2, CustomFieldDatePicker2 } from '../../global'
import { EmpresasExperiencia } from '../../selectores'
import { ErrorMessage } from 'formik'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import { BiUserPlus, BiBadgeCheck } from 'react-icons/bi'
import { DBConfia_Prospeccion } from '../../../interfaces_db/DBConfia/Prospeccion'
import { FormateoDinero } from '../../../global/variables'
import moment from 'moment'
import { useState } from 'react'
import { toast } from 'react-toastify'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    accion(item: any): any,
    Exps?: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[]
    TieneExp?: boolean
}

export const FormaDatosEconomicosExVentas = ({ Prefijo, Titulo, SubTitulo, accion, Exps, TieneExp }: DireccionTipo) => {

    const [TieneExperiencia, setTieneExperiencia] = useState('')
    const [TieneExperienciaDisplay, setTieneExperienciaDisplay] = useState('none')
    const [Experiencias, setExperiencias] = useState([])
    const [tablaDisplay, setTablaDisplay] = useState('none')
    const [Empresa, setEmpresa] = useState('')
    const [showCredit, setShowCredit] = useState(false);

    const InitialValues: any = {}
    InitialValues[`${Prefijo}TieneExperiencia`] = ''
    InitialValues[`${Prefijo}Empresa`] = ''
    InitialValues[`${Prefijo}Fecha`] = ''
    InitialValues[`${Prefijo}LimiteCredito`] = 0;
    InitialValues[`${Prefijo}CreditoDisponible`] = 0;

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}TieneExperiencia`] = Yup.boolean().typeError('Selecciona una opción').required()
    if (TieneExperienciaDisplay === 'block') {
        ValSchemaObjecet[`${Prefijo}Empresa`] = Yup.string().required('Captura Empresa y agrega la empresa');
        ValSchemaObjecet[`${Prefijo}Fecha`] = Yup.date()
        .required('Captura fecha y agrega la empresa')
        .test('future-date', 'La fecha no debe ser mayor a la fecha actual', function (value) {
          if (!value) return true; // Permitir valores nulos o indefinidos
            let dateObject;
            // Intentar convertir la cadena en un objeto Date
          if (typeof value === 'string') {
            dateObject = new Date(value);
          } else if (value instanceof Date) {
            dateObject = value;
          }
          if (!dateObject || isNaN(dateObject.getTime())) {
            return false; // No es una fecha válida
          }
          // Ajustar la hora actual a medianoche
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          // Comparar con la fecha actual
          return dateObject <= currentDate;
        });
        ValSchemaObjecet[`${Prefijo}LimiteCredito`] =   Yup.number().required('Captura la cantidad y agrega la empresa').typeError('Ingresa solo numeros');
        // ValSchemaObjecet[`${Prefijo}CreditoDisponible`] = Yup.number().typeError('Ingrese un numero').required().min(0);
        
        ValSchemaObjecet[`${Prefijo}CreditoDisponible`] = Yup.number().required('Captura la cantidad y agrega la empresa').typeError('Ingresa solo numeros');
        // ValSchemaObjecet[`${Prefijo}CreditoDisponible`] = Yup.number().required('Captura la cantidad y agrega la empresa').typeError('Ingresa solo numeros')
    }
    const TieneExperienciaSelected = (val: string) => {
        setTieneExperienciaDisplay(val === 'true' ? 'block' : 'none')
        setTieneExperiencia(val)
        if (val === 'false') {
            setTablaDisplay('none')
            setExperiencias([])
            accion(Experiencias)
        }
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const AddElement = /*async*/ () => {
        setTieneExperienciaDisplay('none')
        setTablaDisplay('none')
        let value = Empresa.split(',')
        let empresaTxt: string = value[1]
        let empresa: number = parseInt(value[0])
        const formatoFechaRegExp = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        let fecha: string = document.getElementsByClassName('react-datepicker-popper')[0]['value']
        const coincidencias = fecha.match(formatoFechaRegExp);
        if (!coincidencias) {
             toast.error("La fecha debe cumplir con el formato 'dd/mm/yyyy'")
             setTieneExperienciaDisplay('block')
             setTablaDisplay('block')
        }else{
            let limite: number = parseFloat(document.getElementsByName('ProspectoPersona_LimiteCredito')[0]['value'])
            let dispo: number = parseFloat(document.getElementsByName('ProspectoPersona_CreditoDisponible')[0]['value'])
            if ((empresa > 0) && (fecha.length > 0) && (limite > 0) && (dispo > 0)) {
                let arrExperiencias = Experiencias as any
                let nuevoVeiculo = { empresaTxt, empresa, fecha, limite, dispo }
                arrExperiencias.push(nuevoVeiculo)
                setExperiencias(arrExperiencias)
                accion(Experiencias)
                //await timeout(100);
                setEmpresa('')
                setTablaDisplay('block')
            } else {
                if (Experiencias.length > 0) { setTablaDisplay('block') }
                setTieneExperienciaDisplay('block')
            }    
        }
        
    }

    const RemoveElement = async (index: number) => {
        setTablaDisplay('none')
        let arrExperiencias = Experiencias as any
        arrExperiencias.splice(index, 1)
        setExperiencias(arrExperiencias)
        await timeout(100);
        if (Experiencias.length > 0) {
            setTablaDisplay('block')
        } else {
            setTieneExperiencia('false')
        }
        accion(Experiencias)
    }

    // const []
    const empresaSelected = (val: string) => setEmpresa(val);
    if (TieneExp === false && TieneExperiencia === '')
        TieneExperienciaSelected('false')

    if ((Exps?.length ?? 0) > 0 && TieneExperiencia === '') {
        TieneExperienciaSelected('true')
        setTieneExperienciaDisplay('none')
        Exps?.forEach((e: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW) => {
            let arrExperiencias = Experiencias as any
            let nuevoVeiculo = { empresaTxt: e.Descripcion, empresa: e.EmpresaExperienciaID, fecha: moment(e.FechaIngreso).format('DD/MM/YYYY'), limite: e.LimiteCredito, dispo: e.CreditoDisponible }
            arrExperiencias.push(nuevoVeiculo)
            setExperiencias(arrExperiencias)
            accion(Experiencias)
            setEmpresa('')
        })
        setTablaDisplay('block')
    }
    // else if((Exps?.length ?? 0) === 0 && TieneExperiencia === '')
    //     TieneExperienciaSelected('false')

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <CustomSelect2 name={`${Prefijo}TieneExperiencia`} disabled={false} options={[{ value: true, label: 'Si tiene.' }, { value: false, label: 'No tiene.' }]} addDefault={false} label={'¿Experiencia en Ventas?'} placeholder={'¿El prospecto tiene experiencia en ventas?'} accion={TieneExperienciaSelected} valor={TieneExperiencia} />
                <br />
                {TieneExperienciaDisplay === 'block' && <div style={{ display: TieneExperienciaDisplay, padding: '1em', backgroundColor: '#f0f0f0' }}>
                    <h6 className={MODAL_TITLE_CLASS}>*Captura Experiencia</h6>
                    <div className={"row"} style={{ marginBottom: '1em' }}>
                        <div className={"col-sm-12 col-md-5"}>
                            <EmpresasExperiencia {...cprops} label={'Empresa'} name={`${Prefijo}Empresa`} accion={empresaSelected} valor={Empresa} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            
                                <CustomFieldDatePicker2 {...cprops} label={'F.Ingreso'} name={`${Prefijo}Fecha`} placeholder={'Fecha de Ingreso'} />
                            
                        </div>
                    </div>
                    <div className={"row"} style={{ marginBottom: '1em' }}>
                        <div className={"col-sm-12 col-md-6"}>
                            <div className="input-group">
                                <CustomFieldText2 {...cprops} label={'Limite Credito'} name={`${Prefijo}LimiteCredito`} placeholder={'Limite Credito'} />
                                {/* <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={`${Prefijo}LimiteCredito`}>{'Limite Credito'}</label>
                                <input type="input" className="form-control" name={`${Prefijo}LimiteCredito`} defaultValue={''} /> */}
                            </div>
                            {/* <ErrorMessage component="div" name={`${Prefijo}LimiteCredito`} className="text-danger" /> */}
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <div className="input-group">
                                <CustomFieldText2 {...cprops} label={'Credito Disp.'} name={`${Prefijo}CreditoDisponible`} placeholder={'Credito Disp.'} />
                                {/* <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={`${Prefijo}CreditoDisponible`}>{'Credito Disp.'}</label>
                                <input type="input" className="form-control" name={`${Prefijo}CreditoDisponible`} defaultValue={''} /> */}
                            </div>
                            {/* <ErrorMessage component="div" name={`${Prefijo}CreditoDisponible`} className="text-danger" /> */}
                        </div>
                    </div>
                    <div className='' style={{ textAlign: 'end' }}>
                        <button disabled={Experiencias.length === 0} className="btn btn-danger" type="button" onClick={() => setTieneExperienciaDisplay('none')}>NO AGREGAR</button>
                        &nbsp;
                        <button className="btn btn-success" type="button" onClick={AddElement}>AGREGAR EXPERIENCIA</button>
                    </div>
                </div>}
                <div style={{ textAlign: 'center' }}>
                    {(TieneExperienciaDisplay === 'none' && tablaDisplay === 'block') && <button className="btn btn-success" type="button" onClick={() => setTieneExperienciaDisplay('block')}>CAPTURAR OTRA EMPRESA</button>}
                </div>
                <br />
                {(TieneExperienciaDisplay === 'block' && tablaDisplay == 'none') && <div style={{ padding: '3em', backgroundColor: '#f9f9f9', textAlign: 'end' }}>
                    <h6 style={{ color: 'red' }} className={MODAL_TITLE_CLASS}>*Sin experiencia agregada</h6>
                </div>}
                <div style={{ display: tablaDisplay, padding: '3em', backgroundColor: '#f9f9f9' }}>
                    <h6 className={MODAL_TITLE_CLASS}>*Empresas Capturadas</h6>
                    <table className="table table-sm m-0 mt-0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Empresa</th>
                                <th>Fecha</th>
                                <th>Limite Crédito</th>
                                <th>Crédito Disponible</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Experiencias.map((c: any, cId: number) =>
                                    <tr key={'crd_' + cId}>
                                        <td><BiBadgeCheck color={'green'} size={20} /></td>
                                        <td><p style={{ padding: '3px' }}>{c.empresaTxt}</p></td>
                                        <td><p style={{ padding: '3px' }}>{c.fecha}</p></td>
                                        <td><p style={{ padding: '3px' }}>{FormateoDinero.format(c.limite)}</p></td>
                                        <td><p style={{ padding: '3px' }}>{FormateoDinero.format(c.dispo)}</p></td>
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