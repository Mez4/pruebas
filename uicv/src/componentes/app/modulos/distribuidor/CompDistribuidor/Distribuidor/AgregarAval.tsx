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
    Item?: DBConfia_Distribuidores.IDistribuidoresAvalesInfo_VW

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any, distribuidorID: any): any
    fnCancelar(): any,
    distribuidorID: number,

    // Modal controls
    Mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */

export const AgregarAval = (props: FormaAgregarTipo) => {
    const [loading, setLoading] = React.useState(false)

    // Render our component 
    return (
        <ModalWin zIndex={4000} open={props.Mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Agregar Aval" : "Agregar Aval"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasDistribuidor.FormaDatosGenerales({ Prefijo: 'DistribuidorPersona_', Titulo: 'Aval', SubTitulo: 'Aval Persona', /*SexoID: props.Item?.SexoID, LugarNac: props.Item?.LugarNacimiento, AsentID: props.Item?.AsentamientoID, oidc: props.oidc*/ }),
                        FormasDistribuidor.FormaDatosPersonales({ Prefijo: 'DatosPersonales_', Titulo: 'Aval', SubTitulo: 'Datos Personales' }),
                        FormasDistribuidor.FormaDatosGeneralesLaboral({ Prefijo: 'AvalLaboral_', Titulo: 'Aval', SubTitulo: 'Datos Laborales', /*TieneEmpleo: props.Item?.TieneEmpleo, OcupacionID: props.Item?.OcupacionID, AsentID: props.Item?.AsentamientoIDEmpleo*/ }),
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

                        console.log('??', Datos, props.distribuidorID)
                        const Persona = {
                            DistribuidorID: props.distribuidorID,
                            Nombre: Datos.DistribuidorPersona_Nombre,
                            ApellidoPaterno: Datos.DistribuidorPersona_ApellidoPaterno,
                            ApellidoMaterno: Datos.DistribuidorPersona_ApellidoMaterno,
                            FechaNacimiento: Datos.DistribuidorPersona_FechaNacimiento,
                            // Localidad:Datos.DistribuidorPersona_Localidad,
                            SexoID: Datos.DistribuidorPersona_SexoID,
                            CURP: Datos.DatosPersonales_CURP,
                            RFC: Datos.DatosPersonales_RFC,
                            EstadoCivilID: Datos.DatosPersonales_EstadoCivilID,
                            NombreConyuge: Datos.DatosPersonales_NombreConyuge,
                            EscolaridadID: 7,
                            TelefonoMovil: Datos.DistribuidorPersona_TelefonoMovil,
                            cp: Datos.DistribuidorPersona_cp,
                            CorreoElectronico: Datos.DistribuidorPersona_Correo,
                            LugarNacimiento: Datos.DistribuidorPersona_LugarNacimiento,//DistribuidorPersona_LugarNacimiento,
                            AsentamientoID: Datos.DistribuidorPersona_AsentamientoID,
                            Calle: Datos.DistribuidorPersona_Calle,
                            NumeroExterior: Datos.DistribuidorPersona_NumeroExterior,
                            NumeroInterior: Datos.DistribuidorPersona_NumeroInterior,
                            TelefonoDomicilio: Datos.DistribuidorPersona_Telefono,
                            Observaciones: 'N/A',
                            identificacionTipoId: 1,
                            identificacionNumero: '###########',
                            vialidadTipoId: Datos.DistribuidorPersona_vialidadTipoId,
                            orientacionVialidadTipoId: Datos.DistribuidorPersona_orientacionVialidadTipoId,
                            viviendaTipoId: Datos.DistribuidorPersona_viviendaTipoId
                        }

                        const AgregarAval = {
                            // PersonaID: !props.Item ? props.Id : props.Item.PersonaID,
                            // CrearProspecto: true,
                            // trabaja: Datos.Trabaja,

                            DireccionPersona_AsentamientoID: parseInt(Datos.DistribuidorPersona_AsentamientoID),
                            DireccionPersona_NombreVialidad: Datos.DistribuidorPersona_Calle,
                            DireccionPersona_NumeroExterior: Datos.DistribuidorPersona_NumeroExterior,
                            DireccionPersona_NumeroInterior: Datos.DistribuidorPersona_NumeroInterior,

                            DireccionPersona_vialidadTipoId: Datos.DistribuidorPersona_vialidadTipoId,
                            DireccionPersona_orientacionVialidadTipoId: Datos.DistribuidorPersona_orientacionVialidadTipoId,
                            DireccionPersona_ViviendaTipoId: Datos.DistribuidorPersona_viviendaTipoId,


                            Laboral_Trabaja: Datos.AvalLaboral_Trabaja === 'true',
                            Laboral_Empresa: Datos.AvalLaboral_Empresa,
                            Laboral_OcupacionID: parseInt(Datos.AvalLaboral_OcupacionID === '' ? 0 : Datos.AvalLaboral_OcupacionID),
                            Laboral_Telefono: Datos.AvalLaboral_TelefonoLaboral,
                            Laboral_SueldoMensual: parseFloat(Datos.AvalLaboral_SueldoMensual === '' ? 0 : Datos.AvalLaboral_SueldoMensual),
                            Laboral_Antiguedad: Datos.AvalLaboral_Antiguedad,

                            DireccionLaboral_AsentamientoID: Datos.AvalLaboral_AsentamientoIDLaboral,
                            DireccionLaboral_NombreVialidad: Datos.AvalLaboral_CalleLaboral,
                            DireccionLaboral_NumeroExterior: Datos.AvalLaboral_NumeroExteriorLaboral,


                            DireccionLaboral_NumeroInteriorLaboral: Datos.AvalLaboral_NumeroInteriorLaboral,

                            DireccionLaboral_vialidadTipoId: parseInt(Datos.AvalLaboral_vialidadTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_vialidadTipoIdLaboral), //Datos.AvalLaboral_vialidadTipoIdLaboral,
                            DireccionLaboral_orientacionVialidadTipoId: parseInt(Datos.AvalLaboral_orientacionVialidadTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_orientacionVialidadTipoIdLaboral), //Datos.AvalLaboral_orientacionVialidadTipoIdLaboral,
                            DireccionLaboral_viviendaTipoId: parseInt(Datos.AvalLaboral_viviendaTipoIdLaboral === '' ? 0 : Datos.AvalLaboral_viviendaTipoIdLaboral), //Datos.AvalLaboral_viviendaTipoIdLaboral,

                        }

                        // Regresamos la nueva promesa

                        return Funciones.FNAgregarAval(props.oidc, { ...Persona, AgregarAval }, props.distribuidorID)

                    }}

                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa, props.distribuidorID)}
                    FN__ERROR={() => alert("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )

}
