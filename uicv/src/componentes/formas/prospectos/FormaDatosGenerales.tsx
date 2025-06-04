import React, { useEffect, useRef, useState } from 'react'
import Yup from '../../../global/yupLocale'
import { ActionFieldNumberText, ActionFieldText, ActionFieldText2, CustomFieldDatePicker2, CustomFieldText2 } from '../../global'
import { Sexos, ControlAsentamientos, BuscarAsentamiento, EstadosPais } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../global/variables'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import moment from 'moment'
import * as Funciones from '../../app/modulos/Prospeccion/CompProspeccion/Prospectos/Funciones'
import { ErrorMessage, Field } from 'formik'
import { FaLessThanEqual } from 'react-icons/fa'
import EstadosPais2 from '../../selectores/EstadosPais2'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    SexoID?: string,
    LugarNac?: string,
    AsentID?: number,
    CURP?: string,
    TelefonoMovil?: string,
    BC?: number,
    oidc: IOidc,
    statusCurp?: boolean
}

export const FormaDatosGenerales = ({ Prefijo, Titulo, SubTitulo, SexoID, LugarNac, AsentID, CURP, TelefonoMovil, BC, oidc, statusCurp }: DireccionTipo) => {
    
    const [state, setState] = React.useState({

        DatosCurp: {
            nombre: "",
            apelidoPaterno: "",
            apellidoMaterno: "",
            sexo: "",
            estadoNacimiento: "",
            fechaNacimiento: "",
        },
        nombre: ""
    })

    //Asentamiento
    const [showAsentamiento, setShowAsentamiento] = React.useState(false)

    const [AsentamientoID, setAsentamientoID] = React.useState(0)
 
    const refNombre = useRef(null)

    const [sexo, setSexo] = React.useState('')

    const [EstadoPais, setEstadoPais] = React.useState('')

    const [CURPOK, setCURPOK] = React.useState(CURP ? CURP : '')
    const [msjCURPOK, setMSJCURPOK] = React.useState('Ya existe una persona con esta CURP registrada')

    const [MOVILOK, setMOVILOK] = React.useState(TelefonoMovil ? TelefonoMovil : '')
    const [msjMOVILOK, setMSJMOVILOK] = React.useState('Ya existe una persona con este Teléfono Móvil registrado')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}Nombre`] = ''
    InitialValues[`${Prefijo}ApellidoPaterno`] = ''
    InitialValues[`${Prefijo}ApellidoMaterno`] = ''
    InitialValues[`${Prefijo}FechaNacimiento`] = ''
    InitialValues[`${Prefijo}Curp`] = ''
    InitialValues[`${Prefijo}SexoID`] = ''
    InitialValues[`${Prefijo}cp`] = ''
    InitialValues[`${Prefijo}TelefonoMovil`] = ''
    InitialValues[`${Prefijo}Correo`] = ''
    InitialValues[`${Prefijo}LugarNacimiento`] = ''

    InitialValues[`${Prefijo}AsentamientoID`] = ''
    InitialValues[`${Prefijo}Localidad`] = ''
    InitialValues[`${Prefijo}Calle`] = ''
    InitialValues[`${Prefijo}NumeroExterior`] = ''
    InitialValues[`${Prefijo}Telefono`] = ''


   
   // let nombre = celular.current.value as string

   const ValSchemaObjecet: any = {}
   ValSchemaObjecet[`${Prefijo}Nombre`] = Yup.string().required().min(3).max(120)
   ValSchemaObjecet[`${Prefijo}ApellidoPaterno`] = Yup.string().required().min(1).max(120)
   ValSchemaObjecet[`${Prefijo}ApellidoMaterno`] = Yup.string().required().min(1).max(120)
   ValSchemaObjecet[`${Prefijo}FechaNacimiento`] = Yup.string().required().test("FechaNacimiento", "La persona debe ser mayor de edad", (value: any) => moment().diff(moment(value), "years") >= 18)
   // ValSchemaObjecet[`${Prefijo}Curp`] = Yup.string().required().min(18).max(18).test("is-tea", msjCURPOK, value => value === CURPOK)
   ValSchemaObjecet[`${Prefijo}Curp`] = Yup.string().required("Campo obligatorio").min(18).max(18).matches(
       /^[A-Za-z]{4}\d{6}[H,M][A-Za-z]{5}[A-Za-z\d]{2}$/i,
       'Introduce una CURP válida'
   )
   ValSchemaObjecet[`${Prefijo}SexoID`] = Yup.string().required().min(1).max(1, 'Selecciona una opción valida')
   ValSchemaObjecet[`${Prefijo}TelefonoMovil`] = Yup.string().required().min(10).max(10)/* .test("is-teax", msjMOVILOK, value => value === MOVILOK) */
   ValSchemaObjecet[`${Prefijo}Telefono`] = Yup.string().min(10).max(10)
   // ValSchemaObjecet[`${Prefijo}Correo`] = Yup.string().required('Campo obligatorio. Si no cuenta con correo capturar NOPROPORCIONA@CORREO.COM').email('Formato de Correo electrónico inválido')
   ValSchemaObjecet[`${Prefijo}LugarNacimiento`] = Yup.string().required().min(3).max(120)

   ValSchemaObjecet[`${Prefijo}AsentamientoID`] = Yup.number().typeError('Ingrese un número').required().min(1)
   ValSchemaObjecet[`${Prefijo}Localidad`] = Yup.string().required().min(1).max(50)
   ValSchemaObjecet[`${Prefijo}Calle`] = Yup.string().required().min(1).max(50)
   ValSchemaObjecet[`${Prefijo}NumeroExterior`] = Yup.string().required().min(1).max(10)

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const sexoSelected = (val: string) => setSexo(val)

    const estadoPaisSelected = (val: string) => setEstadoPais(val)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const lol = async (cat: any) => {
        if (cat.target.value.length === 18) {
            new Promise((Resolver: any, Denegar: any) => {

                axios.post(`${GetServerUrl()}Administracion/Personas/CurpCheck`, { CURP: cat.target.value }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        console.log(respuesta.data.exist)
                        if (!respuesta.data.exist)
                            setCURPOK(cat.target.value)
                    })
                    .catch(error => {
                        if (error.response) {
                            toast.error(`ERROR AL CONSULTAR CURP. Response Error: ${error.response.data}`)
                            setMSJCURPOK(`${error.response.data}`)
                        } else if (error.request) {
                            toast.error(`ERROR AL CONSULTAR CURP. Request ${error}`)
                            setMSJCURPOK(`${error.request}`)
                        } else {
                            toast.error(`ERROR AL CONSULTAR CURP. ${error}`)
                            setMSJCURPOK(`${error}`)
                        }
                    })
            })
        }
    }

    const consultaTelMov = async (tel: any) => {
        if (tel.target.value.length === 10) {
            new Promise((Resolver: any, Denegar: any) => {

                axios.post(`${GetServerUrl()}Administracion/Personas/MovilCheck`, { Telefono: tel.target.value }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        console.log(respuesta.data.exist)
                        if (!respuesta.data.exist)
                            setMOVILOK(tel.target.value)
                    })
                    .catch(error => {
                        if (error.response) {
                            toast.error(`ERROR AL CONSULTAR TEL MOVIL. Response Error: ${error.response.data}`)
                            setMSJMOVILOK(`${error.response.data}`)
                        } else if (error.request) {
                            toast.error(`ERROR AL CONSULTAR TEL MOVIL. Request ${error}`)
                            setMSJMOVILOK(`${error.request}`)
                        } else {
                            toast.error(`ERROR AL CONSULTAR TEL MOVIL. ${error}`)
                            setMSJMOVILOK(`${error}`)
                        }
                    })
            })
        }
    }

    const FNConsultarCurp = async (Curp: any) => {
        console.log('curppppppppp', Curp)
        if (Curp.length === 18) {

            console.log('curppppppppp', Curp)
            setTimeout(() => {
            Funciones.FNBuscarCurp (oidc, Curp)
                .then((respuesta: any) => {
                    //NotifcacionesP = respuesta.data
                    //props.cbValidar(respuesta)
                    console.log(respuesta)
                    state.DatosCurp.nombre = respuesta.data.nombre;
                    state.DatosCurp.apelidoPaterno = respuesta.data.apellidoPaterno;
                    state.DatosCurp.apellidoMaterno = respuesta.data.apellidoMaterno;
                    state.DatosCurp.sexo = respuesta.data.sexo;
                    state.DatosCurp.estadoNacimiento = respuesta.data.estadoNacimiento;
                    state.DatosCurp.fechaNacimiento = respuesta.data.fechaNacimiento;
                    
                    
                    
                    InitialValues[`${Prefijo}Nombre`]= respuesta.data.nombre
                    

                    console.log('respuesta.data',respuesta.data)
                    console.log('valores respues.data', state.DatosCurp)
                    console.log('nombreeeeeeeee', state.DatosCurp.nombre)

                })
                .catch((error: any) => {
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)

                })
            }, 5000);
        }
    }

    const FNNombre = async (Curp: any) => {
        
        if(Curp.length < 3)
            {
                toast.error
            }
        
    }

    if (SexoID && sexo === '')
        sexoSelected(SexoID)

    if (LugarNac && EstadoPais === '')
        estadoPaisSelected(LugarNac)

    if (AsentID && AsentamientoID === 0) {
        setAsentamientoID(AsentID)
    }

    // useEffect(() => {
    
    // }, [])

    console.log('print variable yup', InitialValues[`${Prefijo}Nombre`])
    
    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div>
                    <CustomFieldText2 {...cprops} disabled={BC === 2 || statusCurp ===  true} label={'Nombre'} name={`${Prefijo}Nombre`} placeholder={'Nombre(s)'} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} disabled={BC === 2 || statusCurp ===  true} label={'A.Paterno'} name={`${Prefijo}ApellidoPaterno`} placeholder={'Apellido Paterno'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} disabled={BC === 2 || statusCurp ===  true} label={'A.Materno'} name={`${Prefijo}ApellidoMaterno`} placeholder={'Apellido Materno'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldDatePicker2 {...cprops} disabled={BC === 2 || statusCurp ===  true} label={'F.Nacimiento'} name={`${Prefijo}FechaNacimiento`} placeholder={'Fecha Nacimiento'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <Sexos {...cprops} label={'Sexo'} disabled={BC === 2 || statusCurp} name={`${Prefijo}SexoID`} accion={sexoSelected} valor={sexo} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={BC === 2 || statusCurp ===  true} label={'CURP'} name={`${Prefijo}Curp`} placeholder={'CURP'} fnOnchange={lol} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Movil'} name={`${Prefijo}TelefonoMovil`} placeholder={'Teléfono Móvil'} fnOnchange={consultaTelMov} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Correo'} name={`${Prefijo}Correo`} placeholder={'Correo (Opcional)'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            {/* <EstadosPais disabled={statusCurp ===  true} {...cprops} label={'E.Nacimiento'} name={`${Prefijo}LugarNacimiento`} accion={estadoPaisSelected} valor={EstadoPais} /> */}
                            <EstadosPais2 disabled={statusCurp ===  true} {...cprops} label={'E.Nacimiento'} name={`${Prefijo}LugarNacimiento`} accion={estadoPaisSelected} valor={EstadoPais} />
                        </div>
                    </div>

                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio del prospecto</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} name={`${Prefijo}Calle`} placeholder={'Calle'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Localidad'} name={`${Prefijo}Localidad`} placeholder={'Localidad o Ciudad'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Numero'} name={`${Prefijo}NumeroExterior`} placeholder={'Número Exterior'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Tel.Domicilio'} name={`${Prefijo}Telefono`} placeholder={'Teléfono Fijo (Opcional)'} />
                        </div>
                    </div>
                </div>

                <ModalWin open={showAsentamiento}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            {"Buscar Asentamiento"}
                        </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {showAsentamiento &&
                            <BuscarAsentamiento
                                initialValues={{
                                    EstadoId: 0,
                                    MunicipioId: 0,
                                    TipoAsentamientoId: 0,
                                    CodigoPostalID: 0,
                                    AsentamientoID: 0
                                }}
                                cbAceptar={cbAceptar}
                                fnCancelar={fnCancelar}
                            />}
                    </ModalWin.Body>
                </ModalWin>
            </div>
        )

    }
}