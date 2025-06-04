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

export const AgregarEmpleoPersona = (props: FormaAgregarTipo) => {
    const [loading, setLoading] = React.useState(false)

    // Render our component 
    return (
        <ModalWin open={props.Mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Agregar Empleo" : "Agregar Empleo"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasPersona.FormaDatosGeneralesLaboral({ Prefijo: 'EmpleoPersona_', Titulo: 'Persona', SubTitulo: 'Empleo Persona', }),
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
                            // Nombre: Datos.EmpleoPersona_Nombre,
                            // ApellidoPaterno: Datos.EmpleoPersona_ApellidoPaterno,
                            // ApellidoMaterno: Datos.EmpleoPersona_ApellidoMaterno,
                            // FechaNacimiento: Datos.EmpleoPersona_FechaNacimiento,
                            // Localidad:Datos.EmpleoPersona_Localidad,
                            // SexoID: Datos.EmpleoPersona_SexoID,
                            // CURP: Datos.DatosPersonales_CURP,
                            // RFC: Datos.DatosPersonales_RFC,
                            // EstadoCivilID: Datos.DatosPersonales_EstadoCivilID,
                            // NombreConyuge: Datos.DatosPersonales_NombreConyuge,
                            // EscolaridadID: Datos.DatosPersonales_EscolaridadID,
                            // TelefonoMovil: Datos.EmpleoPersona_TelefonoMovil,
                            // cp: Datos.EmpleoPersona_cp,
                            // CorreoElectronico: Datos.EmpleoPersona_Correo,
                            // LugarNacimiento: Datos.EmpleoPersona_LugarNacimiento,//EmpleoPersona_LugarNacimiento,
                            // AsentamientoID: Datos.EmpleoPersona_AsentamientoID,
                            // NombreVialidad: Datos.EmpleoPersona_NombreVialidad,
                            // NumeroExterior: Datos.EmpleoPersona_NumeroExterior,
                            // NumeroInterior: Datos.EmpleoPersona_NumeroInterior,
                            // TelefonoDomicilio: Datos.EmpleoPersona_Telefono,
                            // Observaciones: 'N/A',
                            // identificacionTipoId: 1,
                            // identificacionNumero: '###########',
                            // vialidadTipoId: Datos.EmpleoPersona_vialidadTipoId,
                            // orientacionVialidadTipoId: Datos.EmpleoPersona_orientacionVialidadTipoId,
                            // viviendaTipoId: Datos.EmpleoPersona_ViviendaTipoId
                        }

                        const AgregarEmpleoPersona = {
                            // PersonaID: !props.Item ? props.Id : props.Item.PersonaID,
                            // CrearProspecto: true,
                            // trabaja: Datos.Trabaja,
                            PersonaID: props.personaID,

                            // EmpleoPersona_AsentamientoID: parseInt(Datos.EmpleoPersona_AsentamientoID),
                            // EmpleoPersona_NombreVialidad: Datos.EmpleoPersona_NombreVialidad,
                            // EmpleoPersona_NumeroExterior: Datos.EmpleoPersona_NumeroExterior,
                            // EmpleoPersona_NumeroInterior: Datos.EmpleoPersona_NumeroInterior,

                            // EmpleoPersona_vialidadTipoId: parseInt(Datos.EmpleoPersona_vialidadTipoId),
                            // EmpleoPersona_orientacionVialidadTipoId: parseInt(Datos.EmpleoPersona_orientacionVialidadTipoId),
                            // EmpleoPersona_ViviendaTipoId: parseInt(Datos.EmpleoPersona_ViviendaTipoId),
                            // EmpleoPersona_Telefono:Datos.EmpleoPersona_Telefono,


                            Laboral_Trabaja: Datos.EmpleoPersona_Trabaja === 'true',
                            Laboral_Empresa: Datos.EmpleoPersona_Empresa,
                            Laboral_OcupacionID: parseInt(Datos.EmpleoPersona_OcupacionID === '' ? 0 : Datos.EmpleoPersona_OcupacionID),
                            Laboral_Telefono: Datos.EmpleoPersona_TelefonoLaboral,
                            Laboral_SueldoMensual: parseFloat(Datos.EmpleoPersona_SueldoMensual === '' ? 0 : Datos.EmpleoPersona_SueldoMensual),
                            Laboral_Antiguedad: Datos.EmpleoPersona_Antiguedad,

                            DireccionLaboral_AsentamientoID: Datos.EmpleoPersona_AsentamientoIDLaboral,
                            DireccionLaboral_NombreVialidad: Datos.EmpleoPersona_NombreVialidad,
                            DireccionLaboral_NumeroExterior: Datos.EmpleoPersona_NumeroExteriorLaboral,


                            DireccionLaboral_NumeroInteriorLaboral: Datos.EmpleoPersona_NumeroInteriorLaboral,

                            DireccionLaboral_vialidadTipoId: parseInt(Datos.EmpleoPersona_vialidadTipoIdLaboral === '' ? 0 : Datos.EmpleoPersona_vialidadTipoIdLaboral), //Datos.EmpleoPersona_vialidadTipoIdLaboral,
                            DireccionLaboral_orientacionVialidadTipoId: parseInt(Datos.EmpleoPersona_orientacionVialidadTipoIdLaboral === '' ? 0 : Datos.EmpleoPersona_orientacionVialidadTipoIdLaboral), //Datos.EmpleoPersona_orientacionVialidadTipoIdLaboral,
                            DireccionLaboral_viviendaTipoId: parseInt(Datos.EmpleoPersona_viviendaTipoIdLaboral === '' ? 0 : Datos.EmpleoPersona_viviendaTipoIdLaboral), //Datos.EmpleoPersona_viviendaTipoIdLaboral,

                        }

                        // Regresamos la nueva promesa FNAgregarEmpleoPersona
                        console.log(AgregarEmpleoPersona, 'PERS', Persona)

                        return Funciones.AddEmpleo(props.oidc, { ...AgregarEmpleoPersona }, props.personaID)

                    }}

                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa, props.personaID)}
                    FN__ERROR={() => alert("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )

}
