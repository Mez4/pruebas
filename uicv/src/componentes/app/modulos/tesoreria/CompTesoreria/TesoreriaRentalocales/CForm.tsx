import {useEffect, useState} from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomActionSelect, CustomFieldDatePicker, CustomFieldDatePicker2, CustomFieldText, CustomSelect, DatePickeEnd, ModalWin, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { type } from 'os'
import { AgregarDireccionesPersona } from '../../../personas/CompAdministracion/CompPersona/AgregarDireccionesPersona'
import { FaPencilAlt } from 'react-icons/fa'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CFormD } from '../../../creditos/CompCreditos/CreditoReestructuraRelacion/CFormD'
import { CFormComp } from './CFormComp'
import { BuscarAsentamiento, ControlAsentamientos, Sucursales } from '../../../../../selectores'
import moment from 'moment'
import { FNGetSucursales } from '../CajasUsuarios/Funciones'


type CFormType = {
    ID                          :       number;
    Seguridad                   :       IOidc,
    DatosSuc                    :       { value: number, label: string }[],
    InitialValues: {
            SucursalId          :       number,
            NombreSucursal      :       string,
            Monto               :       number,
            FechaInicio         :       any,
            FechaFin            :       any,
            DiasRest            :       number,
            DetSuc              :       string,
            Carga               :       boolean,
            ContratoId          :       number,
    },
    fnCancelar():any
    cbActualizar(item:any):any
    cbGuardar(item:any):any
}


export const CFormSuc = (props:CFormType) => {
    console.log(props)
    const [state, setState] = useState({

        VerDoc          :   false,
        documentoPath   :   '',
        documentoNombre :   '',
        SubirDoc        :   false,
        documentoLabel  :   0,
                   
    })
    
    // const [showAsentamiento, setShowAsentamiento] = useState(false)
    const fnOpen = () => setShowAsentamiento(true)
    const fnCancelar = () => setShowAsentamiento(false)
    const cbAceptar = (id: number) => {
                                        setShowAsentamiento(false);
                                        setAsentamientoID(id);
    }
    const [isLoading, setIsLoading] = useState(false)
    const fnSubirDoc = (documentoNombre: string, documentoLabel: number) => setState({...state, SubirDoc: true, documentoNombre, documentoLabel })
    const fcCañcelarVerDoc = () => setState({...state, VerDoc:false, SubirDoc:false})    
    const [showAsentamiento, setShowAsentamiento] = useState(false)
    const [AsentamientoID, setAsentamientoID] = useState(0)
    const cbAceptarA = (id: number) => {   setShowAsentamiento(false);        setAsentamientoID(id);  }
    const fnCancelarA = () => setShowAsentamiento(false)


    function cbMuestraActual(show: boolean) {
        throw new Error('Function not implemented.')
    }
    return(

    <Formik initialValues={props.InitialValues}
            // DatosSuc = {props.DatosSuc}
            enableReinitialize
            validationSchema={Yup.object().shape({
                FechaFin: Yup.date().required("Campo obligatorio")
                // FechaInicio: Yup.date().required("Campo obligatirio")
            })}
            onSubmit={(values: any) => {
               setIsLoading(true);
               if ( !!props.ID ){
                 Funciones.FNActualizarDetalleRantaSucursal(props.Seguridad, values)
                 .then((resp) => {
                      setIsLoading(false)
                      props.cbActualizar(resp);
                      console.log('Se realizo');
                 })
                 .catch(() => {
                  setIsLoading(false);
                  console.log('No entro')
                 })
                console.log('Editar')
            }else{

                Funciones.FNCargarDetalleRantaSucursal(props.Seguridad, values
                    ).then((respuesta: any) => {
                        setIsLoading(false);
                        props.cbGuardar(respuesta);
                    })
                    .catch((error: any) => {
                        setIsLoading(false);
                        toast.error('Error al agregar Sucursal');
                    })
            }
                
            }}>
    

            <Form>
                <div style={{display:'flex', justifyContent: 'center', marginBottom: '2rem'}}>
                 {!!props.ID ? 
                <><h3>Modificar sucursal: <span style={{ color: '#3085d6' }}>{props.InitialValues.NombreSucursal}</span></h3><br /></>
                 : <h3>Agregar sucursal</h3>} 
                </div>

                {!props.ID &&
                <CustomSelect
                    disabled={false} // props.Id=== undefined? false : true
                    label="Sucursal"
                    name="SucursalId"
                    placeholder="Nombre de sucursal"
                    addDefault={false} 
                    options={props.DatosSuc}                    
                />  
                
                }
         
                {/* <h1>{props.DatosSuc[0]}</h1> */}
                <div className='fechas' style={{display: 'flex', 
                                                 flexDirection: 'row', 
                                                 justifyContent: 'space-evenly'}}>
                    <CustomFieldDatePicker
                                disabled={isLoading}
                                label="Fecha inicio de contrato"
                                name="FechaInicio"
                                placeholder="Inicio de contrato"
                                
                    />
                    
                    <CustomFieldDatePicker
                                disabled={isLoading}
                                label="Fecha limite de contrato"
                                name="FechaFin"
                                placeholder="Finalizacion de contrato"
                    />
                  
                </div>

                <CustomFieldText
                            disabled={isLoading}// props.Id=== undefined? false : true
                            label="Monto"
                            name="Monto"
                            placeholder="Monto"
                />
                <CustomFieldText
                            disabled={isLoading}// props.Id=== undefined? false : true
                            label="Informacion sucursal"
                            name="DetSuc"
                            placeholder="Cambiar detalle"
                />



            <hr />

            <div style={{display:'flex',justifyContent:'center'}}>
               
            {props.ID &&
                <button 
                    disabled={false } 
                    type="button" 
                    style={{ paddingTop: '0px', paddingBottom: '3px' }} 
                    className="btn btn-primary" 
                    onClick={() => fnSubirDoc('SUBIR CONTRATO', 1)}
                >   
                  <strong>SUBIR CONTRATO</strong> 
                </button>
            }
            </div>
                
            {state.SubirDoc && <ModalWin open={state.SubirDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{state.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fcCañcelarVerDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {<CFormComp
                            oidc={props.Seguridad}
                            //ProductoID={props.iUI.Producto?.ProductoID as number}
                            //optTipos={state.optTipos}
                            InitialValues={props.InitialValues}
                            documentoLabel={state.documentoLabel}
                            cbMuestraActual={cbMuestraActual} optTipos={[]}                    />}  
                </ModalWin.Body>
            </ModalWin>}

            <hr />
                        {isLoading && <Spinner/>}
                        {!isLoading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        }
            </Form> 
    </Formik>
    )
}