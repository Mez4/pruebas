import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasPersona } from '../../../../../formas'
import { FormaUsuario } from '../../../../../formas/usuarios'
import { FormaBasicoUnoSinBloquear } from '../../../../../formas/personas/FormaBasicoUnoSinBloquear'
import { FormaBasicoDosSinBloquear } from '../../../../../formas/personas/FormaBasicoDosSinBloquear'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

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
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarConPersona = (props: FormaAgregarTipo) => {

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
                        FormaUsuario,
                        FormaBasicoUnoSinBloquear(),
                        FormaBasicoDosSinBloquear(),
                        FormasPersona.FormaBasicoTres
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
                        console.log("DATOS", Datos)

                        if (Datos.EscolaridadID < 1) {
                            Datos.EscolaridadID = 7
                        }
                        if (Datos.DependientesEconomicos < 1) {
                            Datos.DependientesEconomicos = 0
                        }
                        Datos.RFC = 'NAAAAAAAAAAA'
                        Datos.LugarNacimiento = 'NAN'
                        Datos.EstadoCivilID = 'N'

                        // Validamos los datos opcionales
                        if (!Datos.FormaEmpleo__FechaTermino)
                            delete Datos.FormaEmpleo__FechaTermino


                        // Regresamos la nueva promesa
                        return Funciones.FNAgregar(props.oidc, Datos)
                    }}

                    // {
                    //return new Promise((resolve, reject) => {
                    //    alert(JSON.stringify(Datos))
                    //   reject('DEBUG')
                    // })
                    // }
                    // }
                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={() => console.log("Error al procesar")}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
