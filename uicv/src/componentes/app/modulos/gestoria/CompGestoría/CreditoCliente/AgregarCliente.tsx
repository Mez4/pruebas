import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { formatDate2, formatDate } from '../../../../../../global/functions'
// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasGeneral, FormasPersona, FormasClientes } from '../../../../../formas'

import { toast } from 'react-toastify'
import { resolve } from 'dns'
import moment from 'moment'

/** Tipo de nuestro componente */
type CFormType = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: any,

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
    EsZonal?: boolean,
    SucursalID?: number
}
/**
 * Forma para agregar un cliente en el sistema (Debe de incluir una persona por defecto)
 */
export const AgregarCliente = (props: CFormType) => {
    // console.log(moment().diff(moment("990728", "YYMMDD"), 'years') >= 18)
    // Render our component 
    return (
        <ModalWin zIndex={4001} open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar cliente" : "Agregar cliente"}
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
                        FormasClientes.FormaDatosCliente({ SociaID: props.Item, EsZonal: props.EsZonal, SucursalID: props.SucursalID }),
                        FormasPersona.FormaEmpleo(),
                        FormasGeneral.FormaDireccion({ Prefijo: 'DireccionEmpleo_', Titulo: 'Direccion laboral', SubTitulo: 'Ubicacion laboral' })
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

                        // Validamos los datos opcionales

                        const Persona = {
                            Nombre: Datos.Nombre,
                            ApellidoPaterno: Datos.ApellidoPaterno,
                            ApellidoMaterno: Datos.ApellidoMaterno,
                            FechaNacimiento: formatDate2(new Date(Datos.FechaNacimiento)),//Datos.FechaNacimiento,
                            LugarNacimiento: Datos.LugarNacimiento == '' ? 'NA-NA' : Datos.LugarNacimiento,
                            CURP: Datos.CURP,
                            RFC: Datos.RFC == '' ? 'NOSEAGREGARFC' : Datos.RFC,
                            SexoID: Datos.SexoID,
                            EstadoCivilID: Datos.EstadoCivilID == '' ? 'N' : Datos.EstadoCivilID,
                            EscolaridadID: 7,
                            DependientesEconomicos: Datos.DependientesEconomicos == '' ? 7 : Datos.DependientesEconomicos,
                            TelefonoDomicilio: Datos.TelefonoDomicilio,
                            TelefonoMovil: Datos.TelefonoMovil,
                            CorreoElectronico: Datos.CorreoElectronico,
                            NombreConyuge: Datos.NombreConyuge,
                            Observaciones: Datos.Observaciones,
                            identificacionTipoId: Datos.identificacionTipoId,
                            identificacionNumero: Datos.identificacionNumero
                        }

                        const AgregarCliente = {
                            CrearCliente: true,
                            ClienteID: 0,
                            PersonaID: 0,
                            LineaCreditoPersonal: 0, //Datos.LineaCreditoPersonal,
                            PagareEstatusId: 0, //Datos.PagareEstatusId,
                            PagareCantidad: 0, //Datos.PagareCantidad,
                            CreacionPersonaID: 0,
                            CreacionFecha: '',
                            CreacionUsuarioID: 0,
                            IdentificadorAnterior: '0', //Datos.IdentificadorAnterior,
                            DistribuidorID: props.Item ?? Datos.DistribuidorID
                        }

                        const AgregarDireccion = {
                            PersonaID: 1,
                            DireccionPersona_AsentamientoID: Datos.DireccionPersona_AsentamientoID,
                            DireccionPersona_NombreVialidad: Datos.DireccionPersona_NombreVialidad,
                            DireccionPersona_NumeroInterior: Datos.DireccionPersona_NumeroInterior,
                            DireccionPersona_NumeroExterior: Datos.DireccionPersona_NumeroExterior,
                            DireccionPersona_vialidadTipoId: Datos.DireccionPersona_vialidadTipoId,
                            DireccionPersona_orientacionVialidadTipoId: Datos.DireccionPersona_orientacionVialidadTipoId == '' ? 0 : Datos.DireccionEmpleo_orientacionVialidadTipoId,
                            DireccionPersona_viviendaTipoId: Datos.DireccionPersona_viviendaTipoId == '' ? 1 : Datos.DireccionPersona_viviendaTipoId,
                            DireccionPersona_ReferenciaGeografica: Datos.DireccionPersona_ReferenciaGeografica
                        }

                        const AgregarEmpleo = {
                            PersonaID: 1,
                            FormaEmpleo__Empresa: Datos.FormaEmpleo__Empresa,
                            FormaEmpleo__Puesto: Datos.FormaEmpleo__Puesto,
                            FormaEmpleo__OcupacionID: Datos.FormaEmpleo__OcupacionID == '' ? 0 : Datos.FormaEmpleo__OcupacionID,
                            FormaEmpleo__Telefono: Datos.FormaEmpleo__Telefono,
                            FormaEmpleo__FechaIngreso: '1990-01-01', //formatDate2(new Date(Datos.FormaEmpleo__FechaIngreso)) == 'NaN-NaN-NaN' ? '1990-01-01' : Datos.ormaEmpleo__FechaTermino,
                            FormaEmpleo__FechaTermino: '1990-01-01',//formatDate2(new Date(Datos.FormaEmpleo__FechaTermino)) == 'NaN-NaN-NaN' ? '1990-01-01' : Datos.ormaEmpleo__FechaTermino,
                            FormaEmpleo__SueldoMensual: Datos.FormaEmpleo__SueldoMensual == '' ? 0 : Datos.FormaEmpleo__SueldoMensual,
                            DireccionEmpleo_vialidadTipoId: Datos.DireccionEmpleo_vialidadTipoId,
                            DireccionEmpleo_NombreVialidad: Datos.DireccionEmpleo_NombreVialidad,
                            DireccionEmpleo_orientacionVialidadTipoId: Datos.DireccionEmpleo_orientacionVialidadTipoId == '' ? 0 : Datos.DireccionEmpleo_orientacionVialidadTipoId,
                            DireccionEmpleo_NumeroExterior: Datos.DireccionEmpleo_NumeroExterior,
                            DireccionEmpleo_NumeroInterior: Datos.DireccionEmpleo_NumeroInterior,
                            DireccionEmpleo_ReferenciaGeografica: Datos.DireccionEmpleo_ReferenciaGeografica,
                            DireccionEmpleo_AsentamientoID: Datos.DireccionEmpleo_AsentamientoID,
                            DireccionEmpleo_viviendaTipoId: Datos.DireccionEmpleo_viviendaTipoId == '' ? 1 : Datos.DireccionEmpleo_viviendaTipoId
                        }

                        const AgregarProspecto = {
                            CrearProspecto: false
                        }

                        const AgregarDirector = {
                            CrearDirector: false,
                            DirectorID: 0,
                            PersonaID: 0,
                            LineaCreditoPersonal: 1,
                            PagareEstatusId: 0,
                            PagareCantidad: 0.0,
                            CreacionPersonaID: 0,
                            CreacionFecha: "",
                            CreacionUsuarioID: 0,
                            IdentificadorAnterior: "",
                            // DistribuidorID: Datos.DistribuidorID
                        };

                        // Regresamos la nueva promesa
                        return Funciones.FNAgregar(props.oidc, { ...Persona, AgregarCliente, AgregarDireccion, AgregarEmpleo, AgregarProspecto, AgregarDirector })
                    }}
                    // {
                    //return new Promise((resolve, reject) => {
                    //    alert(JSON.stringify(Datos))
                    //   reject('DEBUG')
                    // })
                    // }
                    // }
                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={(error) => {
                        if (error.response) {
                            alert(`Response Error: ${JSON.stringify(error.response.data)}`)
                        } else if (error.request)
                            alert(`Request ${error}`)
                        else
                            alert(`${error}`)
                    }}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
