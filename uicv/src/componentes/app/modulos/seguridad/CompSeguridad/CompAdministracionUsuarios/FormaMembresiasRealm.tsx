
import React from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

import { ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Zonas, Roles, Sucursales } from '../../../../../selectores'
import { GetServerUrl } from '../../../../../../global/variables'

/** Propiedades de la forma de administracion de membresias */
type FormaMembresiasType = {
    Item: any
    oidc: IOidc
    mostrar: boolean,
    cbActualizar(Item: any): any
    fnCancelar(): any
}

/**
 * Forma para editar las membresias
 * @param props propiedades de las generales
 * @returns Componente de react
 */
export const FormaMembresiasRealm = (props: FormaMembresiasType) => {

    // IsMounted
    const isMounted = React.useRef(true)

    // Loading
    const DatosDefecto: any[] = []
    const [Estado, definirEstado] = React.useState({
        Datos: DatosDefecto,
        Cargando: false,
        Error: false,
        Tipo: 'Zona'
    })

    // Definimos la funcion para asignar un rol
    const AsignarRol = (values: any) => {

        // Cambiamos el estado a carga
        definirEstado(e => ({ ...e, Cargando: true, Error: false }))

        // Posteamos los datos usando axios
        axios.post(`${GetServerUrl()}sistema/usuarios/asignarRolRegionalizado`, { ...values, ...props.Item }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(() => {

                // Obtenemos los roles del usuario
                ObtenerRoles(props.Item)

            })
            .catch(() => {

                // Alerta
                alert("Error al asignar el rol")

                // Cambiamos el estado a carga
                definirEstado(e => ({ ...e, Cargando: false, Error: true }))
            })
    }

    // Definimos la funcion para asignar un rol
    const ObtenerRoles = (values: any) => {

        // Cambiamos el estado
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))

        // Posteamos los datos usando axios
        axios.post(`${GetServerUrl()}sistema/usuarios/obtenerGruposAsignados`, { ...values, CorreoElectronico: props.Item.CorreoElectronico }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                if (isMounted)
                    definirEstado(e => ({ ...e, Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ ...e, Cargando: false, Error: false, Datos: [] }))
            })
    }

    // Definimos la funcion para asignar un rol
    const EliminarRol = (values: any) => {

        // Cambiamos el estado
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))

        // Posteamos los datos usando axios
        axios.post(`${GetServerUrl()}sistema/usuarios/eliminarRolRegionalizado`, { ...values, CorreoElectronico: props.Item.CorreoElectronico }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(() => {
                ObtenerRoles(props.Item)
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ ...e, Cargando: false, Error: false, Datos: [] }))
            })
    }

    React.useEffect(() => {

        // Obtenemos las membresias
        if (props.Item !== undefined && isMounted) {
            ObtenerRoles(props.Item)
        }

        // eslint-disable-next-line
    }, [props.Item])

    // Render the component
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Membresias del usuario
                </h5>
                <button onClick={props.fnCancelar} disabled={Estado.Cargando} type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </ModalWin.Header>
            <ModalWin.Body>
                <div className="text-left">
                    {Estado.Cargando && <Spinner />}
                    {!Estado.Cargando &&
                        <div>
                            <Formik
                                initialValues={{ RolID: '' }}
                                validationSchema={
                                    Yup.object().shape({
                                        RolID: Yup.string().required("Seleccione un rol").min(36, "Seleccione un rol")
                                    })
                                }
                                onSubmit={(values) => {
                                    AsignarRol(values)
                                }}
                            >
                                <Form className="row">
                                    <div className={`col-sm-12 col-md-3`}>
                                        <div className="mb-3">
                                            <label className="form-label mb-0" htmlFor={'Tipo'}>Tipo</label>
                                            <select value={Estado.Tipo} name='Tipo' id='Tipo' className="form-select" disabled={Estado.Cargando} onChange={(c) => definirEstado(e => ({ ...e, Tipo: c.currentTarget.value }))}>
                                                <option value='Zona'>Zona</option>
                                                <option value='Sucursal'>Sucursal</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-10">
                                        <Roles oidc={props.oidc} cargar={props.mostrar && props.Item !== null} />
                                    </div>
                                    <div className="col-sm-12 col-md-2">
                                        <button type={'submit'} style={{ width: "100%", marginTop: "20px" }} className="btn btn-block btn-confia"><FaPlus /></button>
                                    </div>
                                </Form>
                            </Formik>
                            {Estado.Datos.length === 0 &&
                                <div className={"text-center"}>
                                    <p><strong>No hay roles registrados</strong></p>
                                </div>
                            }
                            {Estado.Datos.length > 0 &&
                                <React.Fragment>
                                    <div style={{ height: "2px", backgroundColor: "darkgray" }} className={"mt-1 mb-0"} />
                                    <div className="table-responsive">
                                        <div style={{ width: "100%", maxHeight: "250px", overflowY: "scroll" }}>
                                            <table className="table table-sm m-0">
                                                <thead>
                                                    <tr>
                                                        <th>Rol</th>
                                                        <th>Zona</th>
                                                        <th>Sucursal</th>
                                                        <th>Tipo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Estado.Datos.map((d, dk) => (
                                                        <tr key={'row_' + dk}>
                                                            <td>{d.ROLE_NAME}</td>
                                                            <td>{d.ZonaNombre}</td>
                                                            <td>{d.SucursalNombre}</td>
                                                            <td>{d.ROLE_KIND}</td>
                                                            <td>{d.ROLE_KIND === "DIRECTO" && <FaTrash style={{ cursor: "pointer" }} onClick={() => EliminarRol({ ...props.Item, RolID: d.ROLE_ID, ID: d.ID })} />}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    }
                </div>
            </ModalWin.Body>
        </ModalWin>
    )
}
