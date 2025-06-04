import React from 'react'
import { FaEnvelope, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'
import { Formik, Form } from 'formik'
import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import DataTable from 'react-data-table-component'
import { FiltrarDatos, formatDate2 } from '../../../../../../global/functions'
import { AgregarPermiso } from './'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { array } from 'yup'
import { FNCancelar } from '../../../creditos/CompCreditos/CreditoGlobal/Funciones'


type PermisosEspeciales = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    UsuarioID: number
    ui: iUI;
    Error: boolean,
    Cargando: boolean,
    initialValues: {
        PermisosDelUsuario: any
        NombreUsuario: string,
        UsuarioID: number
    }

    // Callbacks
    fnAbrirModalAgregarPermisoEspecial(): any,
    cbActualizar(item: any): any,
    fnCancelar(): any,
    cbAgregarPermiso(item: any): any
    cbGuardar(item: any): any


    // Modal controls
    mostrar: boolean,
}
export const PermisosEspeciales = (props: PermisosEspeciales, ui: iUI) => {
    console.log("PROPS", props.Item)
    // Loading
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)

    /** funcion para agregar */
    //Format date string to DD-MM-yyyy and return string



    const Columns = [
        {
            name: 'UsuarioPermisoEspecialID',
            selector: 'UsuarioPermisoEspecialID',
            sortable: false,
            center: true
        },
        {
            name: 'Producto', selector: 'Producto', sortable: false, center: true,
            cell: row => <div>{row.Producto ? row.Producto : "NA"}</div>

        },

        { name: 'Permiso', selector: 'Descripcion', sortable: false, center: true },
        //FechaAsignacion
        {
            name: 'Fecha Asignación', selector: 'CreacionFecha', sortable: false, center: true,
            cell: row => <div>{row.CreacionFecha ?
                formatDate2(new Date(row.CreacionFecha)) : "NA"

            }</div>
        }

    ]
    return (

        <ModalWin open={props.mostrar} xlarge center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Permisos Especiales de:  <strong> {props.Item?.NombreCompleto}</strong>
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={props.initialValues}
                    enableReinitialize
                    onSubmit={(values: any, { resetForm }) => {

                        // Set our form to a loading state
                        setLoading(true)

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
                                                    <DataTable
                                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                                        subHeader
                                                        subHeaderComponent=
                                                        {
                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="input-group mb-3">
                                                                        <button title={'Agregar usuario a persona'} className="btn btn-outline-secondary" type="button" onClick={props.fnAbrirModalAgregarPermisoEspecial}><FaPlus /></button>
                                                                        {/* <button title={'Agregar usuario y persona'} className="btn btn-outline-secondary" type="button" onClick={fnAgregar}><FaUserPlus /></button>
                                                                        <button className="btn btn-outline-secondary" type="button" onClick={FNGetLocal}><FiRefreshCcw /></button>   */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        data={props.initialValues.PermisosDelUsuario}
                                                        striped
                                                        pagination
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"UsuarioPermisoEspecialID"}
                                                        columns={Columns}
                                                    />
                                                    {/*   <AgregarPermiso
                                                        oidc={props.oidc}
                                                        ui={props.ui}
                                                        Item={state.Item}
                                                        cbActualizar={cbActualizar}
                                                        cbGuardar={cbAgregar}
                                                        fnCancelar={fnCancelar}
                                                        mostrar={state.AgregarPermiso}
                                                        ProductoID={1}

                                                    /> */}


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
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin >
    )
}
