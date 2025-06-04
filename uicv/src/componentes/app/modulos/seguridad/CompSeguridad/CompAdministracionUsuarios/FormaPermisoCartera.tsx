import React from 'react';
import { iUI } from '../../../../../../interfaces/ui/iUI';

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Formik, Form } from 'formik'
import ActionMultipleSelect from '../../../../../global/ActionMultipleSelect';
import * as Funciones from './Funciones';

import { toast } from 'react-toastify'

type FormaPermisosCartera = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    UsuarioID: number
    ui: iUI;
    Error: boolean,
    Cargando: boolean,
    initialValues: {
        UsuarioID: number,
        // SucursalesIds: number[],
        ProductosIds: number[],
    }
    initialValues2: {
        UsuarioID: number,
        SucursalesIds: number[],
        // ProductosIds: number[],
    }

    multiSelectOptions: { value: number, label: string }[],
    optSucursales: { value: number, label: string }[],
    // Callbacks
    /* fnAbrirModalActivarWebCobranza(): any, */
    cbActualizar(item: any): any,
    fnCancelar(): any,
    /* cbAgregarPermiso(item: any): any */
    cbGuardar(item: any): any


    // Modal controls
    mostrar: boolean,
}

export const FormaPermisosCartera = (props: FormaPermisosCartera, ui: iUI) => {
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)

    console.log(props.initialValues.ProductosIds)

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
                    Accesos a cartera:  <strong> {props.Item?.NombreCompleto}</strong>
                </h5>
            </ModalWin.Header>
            <ModalWin.Body style={{ overflowY: 'unset' }}>
                <Formik
                    initialValues={{
                        ...props.initialValues,
                        ...props.initialValues2
                    }}
                    enableReinitialize
                    onSubmit={(values: any) => {
                        // Set our form to a loading state
                        setLoading(true)
                        // const enabledModules = props.multiSelectOptions
                        //     .filter((item) => values.enabledModulescobranzaWeb.includes(item.value))
                        //     .map((item) => ('es' + item.label + 'CobranzaWeb'));

                        // let data = {
                        //     ...values,
                        //     UsuarioID: props.Item.UsuarioID
                        // }
                        // enabledModules.forEach((item) => {
                        //     data[item] = true
                        // })
                        Funciones.FNAddPermisosCartera(props.oidc, {
                            ...values,
                            UsuarioID: props.Item.UsuarioID
                        })
                            .then((respuesta: any) => {
                                setLoading(false);
                                toast.success("Permisos a cartera asignados correctamente");
                                props.fnCancelar();
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al asignar permisos a cartera")
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
                                                        name={'ProductosIds'}
                                                        label={'Agregar Productos'}
                                                        /* disabled={false} */
                                                        options={props.multiSelectOptions}
                                                        addDefault={false}
                                                        valor={props.initialValues.ProductosIds}
                                                    />
                                                
                                                    <ActionMultipleSelect
                                                        disabled={loading}
                                                        name={'SucursalesIds'}
                                                        label={'Agregar Sucursales'}
                                                        /* disabled={false} */
                                                        options={props.optSucursales}
                                                        addDefault={false}
                                                        valor={props.initialValues2.SucursalesIds}
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