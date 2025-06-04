import React from 'react';
import { iUI } from '../../../../../../interfaces/ui/iUI';

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, CustomFieldText2, CustomSelect2, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Formik, Form } from 'formik'
import ActionMultipleSelect from '../../../../../global/ActionMultipleSelect';
import * as Funciones from './Funciones';
import * as Yup from 'yup';

import { toast } from 'react-toastify'
import Usuario from './Usuario';

type UpdateUsuario = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    UsuarioID: number
    ui: iUI;
    Error: boolean,
    Cargando: boolean,
    productosOptions: { value: number, label: string }[]

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,
    cbGuardar(item: any): any

    // Modal controls
    mostrar: boolean,
}

export const UpdateUsuario = (props: UpdateUsuario, ui: iUI) => {
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
                    Editar usuario:  <strong> {props.Item?.NombreCompleto}</strong>
                </h5>
            </ModalWin.Header>
            <ModalWin.Body style={{ overflowY: 'unset' }}>
                <Formik
                    validationSchema={Yup.object({
                        CorreoElectronico: Yup.string().email().required(),
                        Usuario: Yup.string().required(),
                        PersonaNombre: Yup.string().min(3).required(),
                        PersonaApellidoPaterno: Yup.string().min(3).required(),
                        PersonaApellidoMaterno: Yup.string().min(3).required()
                    })}
                    initialValues={props.Item}
                    enableReinitialize
                    onSubmit={(values: any, { resetForm }) => {
                        // Set our form to a loading state
                        setLoading(true)
                        console.log(values)
                        let data = {
                            UsuarioID: props.Item.UsuarioID,
                            Usuario: values.Usuario,
                            CorreoElectronico: values.CorreoElectronico,
                            NombrePersona: values.PersonaNombre,
                            ApellidoPaterno: values.PersonaApellidoPaterno,
                            ApellidoMaterno: values.PersonaApellidoMaterno,
                            ProductoID: (!values.ProductoID || values.ProductoID.includes('Selecciona') || values.ProductoID == 0) ? null : values.ProductoID,
                        }
                        Funciones.FNUpdateUsuario(props.oidc, data)
                            .then((respuesta: any) => {
                                setLoading(false);
                                toast.success("Usuario actualizado correctamente");
                                props.cbActualizar(respuesta);
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al actualizar el usuario");
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
                                                <div className='d-flex flex-column gap-3'>
                                                    <CustomFieldText2
                                                        disabled={false}
                                                        label={"Nombre"}
                                                        datoType="text"
                                                        name={"PersonaNombre"}
                                                        placeholder={"Nombre"}
                                                    />
                                                    <CustomFieldText2
                                                        disabled={false}
                                                        label={"A. Paterno"}
                                                        datoType="text"
                                                        name={"PersonaApellidoPaterno"}
                                                        placeholder={"Apellido Paterno"}
                                                    />
                                                    <CustomFieldText2
                                                        disabled={false}
                                                        label={"A. Materno"}
                                                        datoType="text"
                                                        name={"PersonaApellidoMaterno"}
                                                        placeholder={"Apellido Materno"}
                                                    />
                                                    <CustomFieldText2
                                                        disabled={false}
                                                        label={"E-Mail"}
                                                        datoType="text"
                                                        name={"CorreoElectronico"}
                                                        placeholder={"Correo electrónico"}
                                                    />
                                                    <CustomFieldText2
                                                        disabled={false}
                                                        label={"Usuario"}
                                                        datoType="text"
                                                        name={"Usuario"}
                                                        placeholder={"Usuario"}
                                                    />
                                                    <CustomSelect2
                                                        name="ProductoID"
                                                        disabled={false}
                                                        label="Producto"
                                                        valor={props.Item?.ProductoID}
                                                        options={props.productosOptions}
                                                        placeholder="Selecciona un producto"
                                                        addDefault={false}
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