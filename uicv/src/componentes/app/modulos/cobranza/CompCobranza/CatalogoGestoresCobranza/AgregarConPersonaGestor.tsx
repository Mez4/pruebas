import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { toast } from 'react-toastify'

// Formik
// import * as Yup from 'yup'
//import * as Funciones from './Prospectos/Funciones'

import * as Funciones from '../../../cobranza/CompCobranza/CatalogoGestoresCobranza/Funciones'
import { FormasGestor } from '../../../../../formas'





/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: any,
    optProdMesa: { value: number, label: string }[],

    // Callbacks
    cbGuardar(item: any): any
    fnCancelar(): any,
    FNGetLocal(): any,
    // Modal controls
    mostrar: boolean
}

export const AgregarConPersonaGestor = (props: FormaAgregarTipo) => {
    const [loading, setLoading] = React.useState(false)

    // Render our component 
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar usuario" : "Agregar usuario"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasGestor.FormaDatosGenerales({ Prefijo: 'PersonaGestor_', Titulo: 'Gestor', SubTitulo: 'Gestor Persona' }),
                        FormasGestor.FormaDatosPersonales({ Prefijo: 'DatosPersonales_', Titulo: 'Gestor', SubTitulo: 'Datos Personales' }),
                        FormasGestor.FormaSeleccionMesaCobranza({ Prefijo: 'MesaCobranza_', Titulo: 'Gestor', SubTitulo: 'Mesa Cobranza', optProdMesa: props.optProdMesa }),
                    ]}

                    // Provisionar esta variable para mostrar datos de edicion
                    Datos={{}}

                    // Personalizacion [Botones]
                    CLASE__BOTONES__DIV={'d-grid gap-2 d-md-flex justify-content-md-end'}
                    CLASE__BOTONES__CANCELAR={'btn btn-danger btn-sm'}
                    CLASE__BOTONES__TERMINAR={'btn btn-confia btn-sm'}
                    CLASE__BOTONES__SIGUIENTE={'btn btn-confia btn-sm'}
                    CLASE__BOTONES__ANTERIOR={'btn btn-warning btn-sm'}

                    // Personalizacion [Listado]
                    CLASE__LISTADO_PASOS__PROGRESO={'bg-info'}
                    CLASE__LISTADO_PASOS__TERMINADO={'bg-success'}
                    CLASE__LISTADO_PASOS__LI__TITULO={`card-title mb-0`}

                    // Funciones
                    FN__CANCELAR={props.fnCancelar}
                    PROMESA__PROCESAR={(Datos: any) => {

                        //console.log('??', Datos)
                        const Persona = {
                            Nombre: Datos.PersonaGestor_Nombre,
                            ApellidoPaterno: Datos.PersonaGestor_ApellidoPaterno,
                            ApellidoMaterno: Datos.PersonaGestor_ApellidoMaterno,
                            FechaNacimiento: Datos.PersonaGestor_FechaNacimiento,
                            SexoID: Datos.PersonaGestor_SexoID,
                            CURP: Datos.DatosPersonales_CURP,
                            RFC: Datos.DatosPersonales_RFC,
                            EstadoCivilID: Datos.DatosPersonales_EstadoCivilID,
                            NombreConyuge: Datos.DatosPersonales_NombreConyuge,
                            EscolaridadID: 7,
                            TelefonoMovil: Datos.PersonaGestor_Telefeno,
                            CorreoElectronico: Datos.PersonaGestor_Correo,
                            LugarNacimiento: Datos.PersonaGestor_LugarNacimiento,
                            AsentamientoID: Datos.PersonaGestor_AsentamientoID, //Lo agregue yo
                            Calle: Datos.PersonaGestor_Calle, // Lo agregue yo
                            NumeroExterior: Datos.PersonaGestor_NumeroExterior, //Lo agruegue yo
                            TelefonoDomicilio: Datos.PersonaGestor_Telefono,
                            Observaciones: 'N/A',
                            identificacionTipoId: 1,
                            identificacionNumero: '###########',
                            MesaCobranzaID: Datos.MesaCobranza_MesaCobranzaID,
                            vialidadTipoId: Datos.PersonaGestor_vialidadTipoId,
                            orientacionVialidadTipoId: Datos.PersonaGestor_orientacionVialidadTipoId,
                            viviendaTipoId: Datos.PersonaGestor_viviendaTipoId

                        }

                        // Regresamos la nueva promesa
                        return Funciones.FNAgregarPersonaGestor(props.oidc, { ...Persona })
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.fnCancelar() //cierra la forma de CForm
                                //props.cbGuardar(respuesta)
                                props.FNGetLocal() //Actualiza los datos de CatalogoGestoresCobranza
                                console.log(respuesta, 'ALB')
                                toast.success(respuesta.msj)
                            })

                            .catch((error: any) => {
                                if (error.response)
                                    toast.error(`Response Error: ${error.response.data}`)
                                else if (error.request)
                                    toast.error(`Request ${error}`)
                                else
                                    toast.error(`${error}`)
                                setLoading(false)
                            })

                    }}

                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={() => alert("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
