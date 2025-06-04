import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { toast } from 'react-toastify'

// Formik
// import * as Yup from 'yup'
//import * as Funciones from './Prospectos/Funciones'

import * as Funciones from './Funciones'
import { FormasGestor } from '../../../../../formas'
import Personas from '../../../personas/CompAdministracion/Personas'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: any,
    DistribuidorID: number,
    GestorID: number,
    idRelMesaCredProd: number
    // optProdMesa: { value: number, label: string }[],

    // Callbacks
    cbGuardar(item: any): any,
    fnCancelar(): any,
    FNGetLocal(): any,
    cbActualizar(item: any): any,
    // Modal controls
    mostrar: boolean
}

export const CFormAgregarDireccion = (props: FormaAgregarTipo) => {
    const [loading, setLoading] = React.useState(false)

    // Render our component 
    return (

        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar usuario" : "AGREGAR DIRECCION"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        // FormasGestor.FormaDatosGenerales({ Prefijo: 'PersonaGestor_', Titulo: 'Gestor', SubTitulo: 'Gestor Persona' }),
                        // FormasGestor.FormaDatosPersonales({ Prefijo: 'DatosPersonales_', Titulo: 'Gestor', SubTitulo: 'Datos Personales' }),
                        FormasGestor.FormaDireccion({ Prefijo: 'Direccion_', Titulo: 'DIRECCION', SubTitulo: 'Direccion' }),
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
                            AsentamientoID: Datos.Direccion_AsentamientoID, //Lo agregue yo
                            Calle: Datos.Direccion_Calle, // Lo agregue yo
                            NumeroExterior: Datos.Direccion_NumeroExterior, //Lo agruegue yo
                            identificacionNumero: '###########',
                            vialidadTipoId: Datos.Direccion_vialidadTipoId,
                            orientacionVialidadTipoId: Datos.Direccion_orientacionVialidadTipoId,
                            viviendaTipoId: Datos.Direccion_viviendaTipoId,
                            DistribuidorID: props.DistribuidorID,
                            Nota: Datos.Direccion_Nota,
                            GestorID: props.GestorID,
                            idRelMesaCredProd: props.idRelMesaCredProd,
                            ReferenciasGeograficas: Datos.Direccion_ReferenciasGeograficas
                        }

                        // Regresamos la nueva promesa
                        return Funciones.FNAgregarDireccion(props.oidc, { ...Persona })
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.FNGetLocal() //Actualiza los datos de CatalogoGestoresCobranza
                                props.fnCancelar() //cierra la forma de CForm
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

                    // FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={() => alert("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
