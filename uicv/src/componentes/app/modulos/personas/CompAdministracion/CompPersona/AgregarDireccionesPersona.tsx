import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasGeneral, FormasPersona, FormasProspecto, FormasDistribuidor } from '../../../../../formas'
import { DBConfia_Distribuidores } from '../../../../../../interfaces_db/DBConfia/Distribuidores'
import moment from 'moment'
import { toast } from 'react-toastify'


/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: DBConfia_Distribuidores.IDistribuidores

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any, personaID: any): any
    fnCancelar(): any,
    personaID: number,

    // Modal controls
    Mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */

export const AgregarDireccionesPersona = (props: FormaAgregarTipo) => {
    const [loading, setLoading] = React.useState(false)

    // Render our component 
    return (
        <ModalWin open={props.Mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Agregar Dirección" : "Agregar Dirección"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasPersona.FormaDatosGenerales({ Prefijo: 'DireccionPersona_', Titulo: 'Persona', SubTitulo: 'Dirección Persona', }),
                    ]}

                    // Provisionar esta variable para Mostrar datos de edicion
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

                        console.log('??', Datos)
                        const Persona = {
                            // DistribuidorID: props.personaID,
                            // Nombre: Datos.DireccionPersona_Nombre,
                            // ApellidoPaterno: Datos.DireccionPersona_ApellidoPaterno,
                            // ApellidoMaterno: Datos.DireccionPersona_ApellidoMaterno,
                            // FechaNacimiento: Datos.DireccionPersona_FechaNacimiento,
                            // Localidad:Datos.DireccionPersona_Localidad,
                            // SexoID: Datos.DireccionPersona_SexoID,
                            // CURP: Datos.DatosPersonales_CURP,
                            // RFC: Datos.DatosPersonales_RFC,
                            // EstadoCivilID: Datos.DatosPersonales_EstadoCivilID,
                            // NombreConyuge: Datos.DatosPersonales_NombreConyuge,
                            // EscolaridadID: Datos.DatosPersonales_EscolaridadID,
                            // TelefonoMovil: Datos.DireccionPersona_TelefonoMovil,
                            // cp: Datos.DireccionPersona_cp,
                            // CorreoElectronico: Datos.DireccionPersona_Correo,
                            // LugarNacimiento: Datos.DireccionPersona_LugarNacimiento,//DireccionPersona_LugarNacimiento,
                            AsentamientoID: Datos.DireccionPersona_AsentamientoID,
                            NombreVialidad: Datos.DireccionPersona_NombreVialidad,
                            NumeroExterior: Datos.DireccionPersona_NumeroExterior,
                            NumeroInterior: Datos.DireccionPersona_NumeroInterior,
                            TelefonoDomicilio: Datos.DireccionPersona_Telefono,
                            // Observaciones: 'N/A',
                            // identificacionTipoId: 1,
                            // identificacionNumero: '###########',
                            vialidadTipoId: Datos.DireccionPersona_vialidadTipoId,
                            orientacionVialidadTipoId: Datos.DireccionPersona_orientacionVialidadTipoId,
                            viviendaTipoId: Datos.DireccionPersona_ViviendaTipoId
                        }

                        const AgregarDireccionesPersona = {
                            // PersonaID: !props.Item ? props.Id : props.Item.PersonaID,
                            // CrearProspecto: true,
                            // trabaja: Datos.Trabaja,
                            PersonaID: props.personaID,

                            DireccionPersona_AsentamientoID: parseInt(Datos.DireccionPersona_AsentamientoID),
                            DireccionPersona_NombreVialidad: Datos.DireccionPersona_NombreVialidad,
                            DireccionPersona_NumeroExterior: Datos.DireccionPersona_NumeroExterior,
                            DireccionPersona_NumeroInterior: Datos.DireccionPersona_NumeroInterior,

                            DireccionPersona_vialidadTipoId: parseInt(Datos.DireccionPersona_vialidadTipoId),
                            DireccionPersona_orientacionVialidadTipoId: parseInt(Datos.DireccionPersona_orientacionVialidadTipoId),
                            DireccionPersona_ViviendaTipoId: parseInt(Datos.DireccionPersona_ViviendaTipoId),
                            DireccionPersona_Telefono: `${Datos.DireccionPersona_Telefono}`


                            // Laboral_Trabaja: Datos.AvalLaboral_Trabaja === 'true',
                            // Laboral_Empresa: Datos.AvalLaboral_Empresa,
                            // Laboral_OcupacionID: parseInt(Datos.AvalLaboral_OcupacionID === '' ? 0 : Datos.AvalLaboral_OcupacionID),
                            // Laboral_Telefono: Datos.AvalLaboral_TelefonoLaboral,
                            // Laboral_SueldoMensual: parseFloat(Datos.AvalLaboral_SueldoMensual === '' ? 0 : Datos.AvalLaboral_SueldoMensual),
                            // Laboral_Antiguedad: Datos.AvalLaboral_Antiguedad,

                            // DireccionLaboral_AsentamientoID: Datos.AvalLaboral_AsentamientoIDLaboral,
                            // DireccionLaboral_NombreVialidad: Datos.AvalLaboral_NombreVialidadLaboral,
                            // DireccionLaboral_NumeroExterior: Datos.AvalLaboral_NumeroExteriorLaboral,


                            // DireccionLaboral_NumeroInteriorLaboral: Datos.AvalLaboral_NumeroInteriorLaboral,

                            // DireccionLaboral_vialidadTipoId: parseInt(Datos.AvalLaboral_vialidadTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_vialidadTipoIdLaboral), //Datos.AvalLaboral_vialidadTipoIdLaboral,
                            // DireccionLaboral_orientacionVialidadTipoId: parseInt(Datos.AvalLaboral_orientacionVialidadTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_orientacionVialidadTipoIdLaboral), //Datos.AvalLaboral_orientacionVialidadTipoIdLaboral,
                            // DireccionLaboral_viviendaTipoId: parseInt(Datos.AvalLaboral_viviendaTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_viviendaTipoIdLaboral), //Datos.AvalLaboral_viviendaTipoIdLaboral,

                        }

                        // Regresamos la nueva promesa FNAgregarDireccionesPersona
                        // console.log(AgregarDireccionesPersona,'PERS',Persona)

                        return Funciones.AddDireccion(props.oidc, { ...AgregarDireccionesPersona }, props.personaID)

                    }}

                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa, props.personaID)}
                    FN__ERROR={() => alert("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )

}
