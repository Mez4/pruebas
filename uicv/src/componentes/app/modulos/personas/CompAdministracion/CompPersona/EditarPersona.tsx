import React from 'react'
import { AsistenteFormik, ModalWin } from '../../../../../global'
import * as FormasPersona from '../../../../../formas/personas'
import { toast } from 'react-toastify'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type EditarPersonaTipo = {
    oidc: IOidc,
    Mostrar: boolean,
    OcultarFormas(): any,
    PersonaID: number,
    DatosPersona: any,
    ActualizarPersona(persona: any): any
}
export const EditarPersona = ({ oidc, Mostrar, OcultarFormas, PersonaID, DatosPersona, ActualizarPersona }: EditarPersonaTipo) => {
    return (
        <ModalWin large={true} open={Mostrar}>
            <ModalWin.Header>
                Editar Persona
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik

                    MostrarPasos={true}
                    Pasos={[
                        FormasPersona.FormaBasicoUno(),
                        FormasPersona.FormaBasicoDos(),
                        FormasPersona.FormaBasicoTres,
                    ]}

                    // Provisionar esta variable para mostrar datos de edicion
                    Datos={DatosPersona}

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
                    FN__CANCELAR={() => OcultarFormas()}
                    PROMESA__PROCESAR={(Datos: any) => {

                        // Agregamos el usuario
                        return Funciones.FNEditar(oidc, { ...Datos, PersonaID })
                    }}

                    // LIMPIEZA DE DATOS (O, FUNCIONES AL TERMINAR EL USO DEL CONTROL)
                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => ActualizarPersona(DatosPromesa)}

                    // FUNCION AL COMETER UN ERROR
                    FN__ERROR={() => toast.error('Error al procesar')}

                />
            </ModalWin.Body>
        </ModalWin>
    )
}
