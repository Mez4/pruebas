import React from 'react'
import { FaDollarSign, FaEdit, FaEnvelope, FaPencilAlt, FaSearch } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ActionSelect, Card, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'
import { Formik, Form } from 'formik'
import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import DataTable from 'react-data-table-component'
import { FiltrarDatos } from '../../../../../../global/functions'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CFormProducto } from './CFormProducto'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { Productos } from '../../../../../selectores'

type PermisosEspeciales = {
    ProductoID: number
    ui: iUI

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    initialValues: {
        Nombre: string;
        distribuidorIdMin: number;
        distribuidorIdMax: number;
        importeLimiteCreditoDefault: number;
        tabuladorTipoID: number;
        empresaId: number;
        ZonaID: number;
        ProductoID: number;
        SucursalFisicaID: number;
        ProductosIds: any;
        NombreCompleto: string;
        PersonaResponsableId: number;
    };

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,
    cbGuardar(item: any): any

    // Modal controls
    mostrar: boolean,
}
export const AgregarPermiso = (props: PermisosEspeciales, ui: iUI) => {

    // Loading

    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)
    const DatosMostrar: any[] = []
    const Datos: any[] = []

    const [state, setState] = React.useState({

        Filtro: '',
        Cargando: true,
        Error: false,
        Item2: undefined as DBConfia_Seguridad.IUsuariosPermisosVW | undefined,
        MostrarForm: false,
        DatosMostrar,
        Datos,
        FormaPermiso: false,
        DispersionesSeleccionadas: [],
        CantidadDispersionesSeleccionadas: 0,
        optCuentasOrdenantes4: [],
        Mostrar: false,

        Form: {
            Mostrar: false,
/*             Datos: DatosDefecto,
 */            Id: undefined,
        },

    })
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])



    const cbAgregar = (Item: any) => {
        setState(s => ({ ...s, Datos: [...s.Datos, Item], FormaAgregar: false, Item: undefined }))
    }
    const fnAgregarProducto = () => setState(s => ({ ...s, Mostrar: true, Item: undefined }))


    /** funcion Callback al actualizar un item */
    const cbActualizar = (Item: any) => {
        setState(s => ({ ...s, Datos: s.Datos.map(Dato => Dato.PersonaID === Item.PersonaID && Dato.UsuarioID === Item.UsuarioID ? Item : Dato) }))

    }
    const MySwal = withReactContent(Swal)

    const [selectedRows, setSelectedRows] = React.useState([{
        ProductosSeleccionados: []
    }]);

    const [toggleCleared, setToggleCleared] = React.useState(false);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log("SELECTED ROWS", selectedRows)
    }, []);


    const contextActions = React.useMemo(() => {


        const handleClick = () => {
            if (selectedRows.length > 0) {
                console.log("FIRST IF")
                //extract column ProductosSeleccionados from selectedRows
                const ProductosSeleccionados = selectedRows.map(row => row.ProductosSeleccionados)

                if (ProductosSeleccionados.length <= 0) {
                    MySwal.fire({
                        title: '<strong>Error</strong>',
                        icon: 'info',
                        html:
                            <div className="text-center">
                                <br />
                                Selecciona al menos un productos en todos los permisos seleccionados.
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        focusCancel: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    })
                    return;
                }



            }

            let total = 0;
            selectedRows.forEach(element => {

                total = total + 1
            });
            MySwal.fire({
                title: '<strong>Agregar Permisos Especiales</strong>',
                icon: 'info',
                html:
                    <div className="text-center">
                        <br />
                        Se agregaran un total de <strong>{total}</strong> permisos, ¿desea continuar?.
                    </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusCancel: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                confirmButtonAriaLabel: 'Aceptar',
                cancelButtonAriaLabel: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    MySwal.fire({
                        title: '<strong>Agregar Permisos Especiales</strong>',
                        icon: 'warning',
                        html:
                            <div className="text-center">
                                <br />
                                Total de {total} permiso/s seleccionado/s para agregar, ¿confirmar?.
                                <br /> <br /><h5><strong style={{ color: 'red' }}>Nota: Esta acción no se puede cancelar ni revertir.</strong></h5>
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        focusCancel: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Agregando permisos...</h5>
                                        </div>
                                    </div>,
                                    timerProgressBar: true,
                                    allowEscapeKey: false,
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    showCancelButton: false,
                                    showCloseButton: false,
                                    didOpen: () => {
                                        MySwal.showLoading()
                                    },

                                }
                            );
                            let a = {
                                Permisos: selectedRows,
                            }
                            console.log("A", a)
                            Funciones.AddPermiso(props.oidc, a)
                                .then((respuesta: any) => {

                                    if (isMounted.current === true) {
                                        respuesta.Permisos.forEach(element => {
                                            console.log("RESPUESTA", respuesta)
                                            let index = state.Datos.findIndex(x => x.UsuarioPermisoEspecialID === element.UsuarioPermisoEspecialID);
                                            if (index !== -1) {
                                                state.Datos.splice(index, 1);
                                            }
                                        })
                                        setToggleCleared(!toggleCleared);
                                        setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                        MySwal.close();
                                        MySwal.fire({
                                            icon: 'success',
                                            title: '<strong>Agregar Permisos</strong>',
                                            html:
                                                <div className="text-center">
                                                    <br />
                                                    <h5>Se agregaron <strong>{respuesta.DispersionesRegistradas} </strong> permisos de <strong>{respuesta.DispersioneRecibidas}</strong> solicitados.</h5>
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            showConfirmButton: true,
                                            focusCancel: true,
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            confirmButtonColor: '#3085d6',
                                        })
                                    }
                                })
                                .catch(() => {
                                    if (isMounted.current === true) {
                                        toast.error("Error al realizar la operación")
                                        MySwal.close();
                                    }
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonAriaLabel: 'Aceptar',
                                    cancelButtonAriaLabel: ''
                                }
                            );
                        }
                    })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }
                    );
                }
            })
        }
        return (
            <button data-tip data-for="TT1_1" style={{ backgroundColor: '#28a745', color: 'white' }}
                type="button" className="ms-2 btn waves-effect waves-light" onClick={handleClick}>
                Agregar permisos seleccionados
            </button>
        );
    }, [selectedRows]);



    const Columns = [
        // { name: 'Id', selector: 'Id', sortable: true, },
        { name: 'ID', selector: 'PermisoID', sortable: false },
        { name: 'Permiso', selector: 'Nombre', sortable: false },
        { name: 'Pantalla', selector: 'NombrePantalla', sortable: false },
        { name: 'Modulo', selector: 'NombreModulo', sortable: false },
        {
            name: 'Agregar Producto', sortable: false, minWidth: "400px",
            cell: (cprops) =>
                <React.Fragment >
                    <Productos
                        oidc={props.oidc}
                        ui={props.ui}
                        ProductosIds={props.initialValues.ProductosIds}
                        disabled={false}
                        name={"ProductosIds"}
                        valor={props.ProductoID}
                    />
                </React.Fragment>

        },
    ]
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.GetPermisosEsp(props.oidc)
            .then((respuesta: any) => {
                console.log("RESPUESTA AGG", respuesta)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    React.useEffect(() => {
        FNGetDatos()
        /*  FNGetProducto() */

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    // Pasamos nuestra forma
    return (
        <ModalWin open={props.mostrar} xlarge>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Agregar Permisos Especiales
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Usuario: props.Item?.Usuario }}
                    enableReinitialize
                    onSubmit={(values: any) => {

                        // Set our form to a loading state
                        setLoading(true)


                    }}>
                    <Form>
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <Card>
                                        <Card.Body>
                                            {state.Cargando /* && <Spinner /> */}
                                            {state.Error && <span>Error al cargar los datos...</span>}
                                            {!state.Cargando && !state.Error &&
                                                <div>
                                                    <DataTable
                                                        subHeader
                                                        contextActions={contextActions}
                                                        clearSelectedRows={toggleCleared}
                                                        onSelectedRowsChange={handleRowSelected}
                                                        //onSelectedRowsChange={(rows: any) => handleSelectDispersion(roUnws)}
                                                        paginationComponentOptions={{
                                                            noRowsPerPage: false, rowsPerPageText: 'Permisos por página',
                                                            rangeSeparatorText: 'de',
                                                            selectAllRowsItem: false,
                                                            selectAllRowsItemText: 'Todos',
                                                        }}
                                                        contextMessage={{ singular: '- Permiso seleccionado', plural: '- Permisos seleccionados', message: 'para agregar' }}
                                                        /* selectableRowDisabled={(row: any) => disableRow(row)} */
                                                        selectableRows
                                                        //selectableRowsComponent={<div>ssss</div>}
                                                        noDataComponent={<div>No hay datos</div>}
                                                        title={<span>Permisos disponibles</span>}
                                                        subHeaderComponent=
                                                        {
                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" className="form-control" placeholder="Buscar Permiso" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                                        <span className="input-group-text"><FaSearch /> </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        data={state.DatosMostrar}
                                                        striped
                                                        pagination
                                                        dense
                                                        responsive
                                                        keyField={"CreditoID"}
                                                        defaultSortField={"CreditoID"}
                                                        columns={Columns}
                                                    />

                                                </div>


                                            }
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </React.Fragment>
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}
