import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasGeneral, FormasPersona, FormasProspecto } from '../../../../../formas'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id: number,
    TipoPersona: number,
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
export const AgregarReferencia = (props: FormaAgregarTipo) => {

    // Render our component 
    return (
        <ModalWin open={props.mostrar} large center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Agregar Referencia" : "Error"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasProspecto.FormaReferencia({ Prefijo: 'ProspectoPersona_', Titulo: 'Referencia Prospecto', SubTitulo: 'Nueva Referencia' }),
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

                        console.log('??', Datos)

                        const DatosReferencia = {
                            prospectoID: props.Id,
                            TipoPersona: props.TipoPersona,
                            Nombre: Datos.ProspectoPersona_Nombre,
                            PrimerApellido: Datos.ProspectoPersona_PrimerApellido,
                            SegundoApellido: Datos.ProspectoPersona_SegundoApellido,
                            Parentezco: Datos.ProspectoPersona_Parentesco,
                            Edad: parseInt(Datos.ProspectoPersona_Edad),
                            Celular: Datos.ProspectoPersona_Celular,
                            Domicilio: Datos.ProspectoPersona_Domicilio,
                        }

                        // Regresamos la nueva promesa
                        return Funciones.FNAgregarReferencia(props.oidc, { ...DatosReferencia })
                        //return new Promise(() => null) //Funciones.FNAgregar(props.oidc, Datos)
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
                        if (error.response)
                            alert(`Response Error: ${JSON.stringify(error.response)}`)
                        else if (error.request)
                            alert(`Request ${error}`)
                        else
                            alert(`${error}`)
                    }}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
