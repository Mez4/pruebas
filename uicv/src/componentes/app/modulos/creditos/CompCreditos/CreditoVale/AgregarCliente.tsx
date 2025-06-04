import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { formatDate2 } from '../../../../../../global/functions'
// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasGeneral, FormasPersona, FormasClientes } from '../../../../../formas'

import { toast } from 'react-toastify'
import moment from 'moment'

/** Tipo de nuestro componente */
type CFormType = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: any,
    Item2?: any,
    Item3?: any,

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
/**
 * Forma para agregar un cliente en el sistema (Debe de incluir una persona por defecto)
 */
export const AgregarCliente = (props: CFormType) => {

    // Render our component 
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar cliente" : "CONFIRMAR INFORMACION DEL CLIENTE"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasPersona.FormaBasicoUno(),
                        FormasPersona.FormaBasicoDos(),
                        FormasPersona.FormaBasicoTres,
                        FormasGeneral.FormaDireccion({ Prefijo: 'DireccionPersona_', Titulo: 'Direccion', SubTitulo: 'Direccion Personal' }),
                    ]}

                    // Provisionar esta variable para mostrar datos de edicion
                    Datos={{
                        Nombre: props.Item2?.Nombre,
                        ApellidoPaterno: props.Item2?.ApellidoPaterno,
                        ApellidoMaterno: props.Item2?.ApellidoMaterno,
                        FechaNacimiento: moment(moment(props.Item2?.FechaNacimiento).format('DD/MM/YYYY'), "DD/MM/YYYY").toDate(),
                        LugarNacimiento: props.Item2?.LugarNacimiento,
                        CURP: props.Item2?.CURP,
                        RFC: props.Item2?.RFC,
                        SexoID: props.Item2?.SexoID,
                        EstadoCivilID: props.Item2?.EstadoCivilID == '' ? 'N' : props.Item2?.EstadoCivilID,
                        EscolaridadID: 7,
                        DependientesEconomicos: props.Item2?.DependientesEconomicos == '' ? 0 : props.Item2?.DependientesEconomicos,
                        TelefonoDomicilio: props.Item2?.TelefonoDomicilio,
                        TelefonoMovil: props.Item2?.TelefonoMovil,
                        CorreoElectronico: props.Item2?.CorreoElectronico,
                        NombreConyuge: props.Item2?.NombreConyuge,
                        Observaciones: props.Item2?.Observaciones,
                        identificacionTipoId: props.Item2?.identificacionTipoId,
                        identificacionNumero: props.Item2?.identificacionNumero,

                        DireccionPersona_AsentamientoID: props.Item3?.AsentamientoID,
                        DireccionPersona_NombreVialidad: props.Item3?.NombreVialidad,
                        DireccionPersona_NumeroInterior: props.Item3?.NumeroInterior,
                        DireccionPersona_NumeroExterior: props.Item3?.NumeroExterior,
                        //DireccionPersona_vialidadTipoId: props.Item3?.vialidadTipoId,
                        DireccionPersona_orientacionVialidadTipoId: props.Item3?.orientacionVialidadTipoId == '' ? 0 : props.Item3?.orientacionVialidadTipoId,
                        DireccionPersona_viviendaTipoId: 3,
                        DireccionPersona_ReferenciaGeografica: props.Item3?.ReferenciaGeografica
                    }}

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

                        // Validamos los datos opcionales
                        // if (!Datos.FormaEmpleo__FechaTermino) delete Datos.FormaEmpleo__FechaTermino                      

                        const Persona = {
                            Nombre: Datos.Nombre,
                            ApellidoPaterno: Datos.ApellidoPaterno,
                            ApellidoMaterno: Datos.ApellidoMaterno,
                            FechaNacimiento: formatDate2(new Date(Datos.FechaNacimiento)),//Datos.FechaNacimiento,
                            LugarNacimiento: Datos.LugarNacimiento,
                            CURP: Datos.CURP,
                            RFC: Datos.RFC,
                            SexoID: Datos.SexoID ?? props.Item2?.SexoID,
                            EstadoCivilID: Datos.EstadoCivilID == '' ? 'N' : Datos.EstadoCivilID,
                            EscolaridadID: 7,
                            DependientesEconomicos: Datos.DependientesEconomicos == '' ? 0 : Datos.DependientesEconomicos,
                            TelefonoDomicilio: Datos.TelefonoDomicilio,
                            TelefonoMovil: Datos.TelefonoMovil,
                            CorreoElectronico: Datos.CorreoElectronico,
                            NombreConyuge: Datos.NombreConyuge,
                            Observaciones: Datos.Observaciones,
                            identificacionTipoId: Datos.identificacionTipoId,
                            identificacionNumero: Datos.identificacionNumero
                        }

                        const AgregarDireccion = {
                            PersonaID: props.Item2?.PersonaID,
                            DireccionPersona_AsentamientoID: Datos.DireccionPersona_AsentamientoID,
                            DireccionPersona_NombreVialidad: Datos.DireccionPersona_NombreVialidad,
                            DireccionPersona_NumeroInterior: Datos.DireccionPersona_NumeroInterior,
                            DireccionPersona_NumeroExterior: Datos.DireccionPersona_NumeroExterior,
                            DireccionPersona_vialidadTipoId: Datos.DireccionPersona_vialidadTipoId,
                            DireccionPersona_orientacionVialidadTipoId: Datos.DireccionPersona_orientacionVialidadTipoId == '' ? 0 : Datos.DireccionEmpleo_orientacionVialidadTipoId,
                            DireccionPersona_viviendaTipoId: Datos.DireccionPersona_viviendaTipoId,
                            DireccionPersona_ReferenciaGeografica: Datos.DireccionPersona_ReferenciaGeografica
                        }



                        // Regresamos la nueva promesa
                        return Funciones.FNAgregar(props.oidc, { ...Persona, AgregarDireccion })
                    }}
                    // {
                    //return new Promise((resolve, reject) => {
                    //    alert(JSON.stringify(Datos))
                    //   reject('DEBUG')
                    // })
                    // }
                    // }
                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={() => toast.error("Error al guardar el cliente")}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
