import React from 'react';
import { iUI } from '../../../../../../interfaces/ui/iUI';

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Formik, Form } from 'formik'
import ActionMultipleSelect from '../../../../../global/ActionMultipleSelect';
import * as Funciones from './Funciones';

import { toast } from 'react-toastify'

type ActivarWebCobranza = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    UsuarioID: number
    ui: iUI;
    Error: boolean,
    Cargando: boolean,
    initialValues: {
        enabledModulescobranzaWeb: number[]
    }

    multiSelectOptions: { value: number, label: string }[],

    // Callbacks
    /* fnAbrirModalActivarWebCobranza(): any, */
    cbActualizar(item: any): any,
    fnCancelar(): any,
    /* cbAgregarPermiso(item: any): any */
    cbGuardar(item: any): any


    // Modal controls
    mostrar: boolean,
}

export const ActivarWebCobranza = (props: ActivarWebCobranza, ui: iUI) => {
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)


    const [state, setState] = React.useState<{ Cargando: boolean; Error: boolean; Datos: any[] }>({
        Cargando: false,
        Error: false,
        Datos: [],
    });

    const [multiSelectValues, setMultiSelectValues] = React.useState();


    return (

        <ModalWin open={props.mostrar} center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Accesos cobranza web de:  <strong> {props.Item?.NombreCompleto}</strong>
                </h5>
            </ModalWin.Header>
            <ModalWin.Body style={{ overflowY: 'unset' }}>
                <Formik
                    initialValues={props.initialValues}
                    enableReinitialize
                    onSubmit={(values: any, { resetForm }) => {
                        // Set our form to a loading state
                        setLoading(true)
                        const enabledModules = props.multiSelectOptions
                            .filter((item) => values.enabledModulescobranzaWeb.includes(item.value))
                            .map((item) => ('es' + item.label + 'CobranzaWeb'));

                        let data = {
                            UsuarioID: props.Item.UsuarioID
                        }
                        enabledModules.forEach((item) => {
                            data[item] = true
                        })
                        Funciones.FNActivarWebCobranza(props.oidc, data)
                            .then((respuesta: any) => {
                                setLoading(false);
                                toast.success("Cobranza web activada.");
                                props.cbActualizar(respuesta);
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al activar cobranza web")
                            });
                    }}>
                    <Form>
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <Card>
                                        <Card.Body>
                                            {props.Cargando && <Spinner />}
                                            {props.Error && <span>Error al cargar los datos...</span>}
                                            {!props.Cargando && !props.Error &&
                                                <div>
                                                    <ActionMultipleSelect
                                                        disabled={loading}
                                                        name={'enabledModulescobranzaWeb'}
                                                        label={'Gestionar roles'}
                                                        /* disabled={false} */
                                                        options={props.multiSelectOptions}
                                                        addDefault={false}
                                                        valor={props.initialValues.enabledModulescobranzaWeb}
                                                    />
                                                </div>
                                            }
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </React.Fragment>
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light"
                                onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Aceptar
                            </button>
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin >
    )
}