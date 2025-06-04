import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'

import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoMovimientosCaja/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoMovimientosCaja/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { idText, isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

import Swal from 'sweetalert2'
import Swal2 from 'sweetalert2'

import withReactContent from 'sweetalert2-react-content'
import withReactContent2 from 'sweetalert2-react-content'

type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoMovimientosCaja = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        Id: 0,
        CveMovimientoID: '',
        TipoMovimiento: '',
        Cargo: false,
        MovAgrupaID: 0,
        AceptaDepositos: false,
        AceptaRetiros: false,
        Activa: true,
        ManejaEfectivo: false
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsAcumula: any[] = []
    const OptionsRubro: any[] = []
    const OptionsMovimiento: any[] = []
    const OptionsCorresponsal: any[] = []
    const OptionsProducto: any[] = []
    const customStyles = {
        subHeader: {
            style: {
                display: 'block !important'
            },
        }
    }

    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OptionsAcumula,
        OptionsRubro,
        OptionsMovimiento,
        OptionsCorresponsal,
        OptionsProducto

    })

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                console.log(respuesta);
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        if (element.RetiroId === null) {
                            element.RetiroId = null
                        } else {
                            element.RetiroId = element.RetiroId
                        }
                        if (element.IvaId === null) {
                            element.IvaId = null
                        } else {
                            element.IvaId = element.IvaId
                        }
                        if (element.DepositoId === null) {
                            element.DepositoId = null
                        } else {
                            element.DepositoId = element.DepositoId
                        }
                        if (element.ComisionId === null) {
                            element.ComisionId = null
                        } else {
                            element.ComisionId = element.ComisionId
                        }
                        if (element.ProductoId === null) {
                            element.ProductoId = null
                        } else {
                            element.ProductoId = element.ProductoId
                        }

                    });

                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        if (element.RetiroId === null) {
                            element.RetiroId = null
                        } else {
                            element.RetiroId = element.RetiroId
                        }
                        if (element.IvaId === null) {
                            element.IvaId = null
                        } else {
                            element.IvaId = element.IvaId
                        }
                        if (element.DepositoId === null) {
                            element.DepositoId = null
                        } else {
                            element.DepositoId = element.DepositoId
                        }
                        if (element.ComisionId === null) {
                            element.ComisionId = null
                        } else {
                            element.ComisionId = element.ComisionId
                        }
                        if (element.ProductoId === null) {
                            element.ProductoId = null
                        } else {
                            element.ProductoId = element.ProductoId
                        }
                    });
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Acumula Cuenta
    const FnGetAcumula = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula: acumula }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula: [] }))
                }
            })
    }
    //Funcion para obtener los datos de Acumula Cuenta
    const FnGetRubro = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetRubros(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var rubro = respuesta.map((valor: any) => {
                        var obj = { value: valor.gastosRubroID, label: valor.gastosRubroDesc };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsRubro: rubro }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsRubro: [] }))
                }
            })
    }
    //Funcion para obtener los datos demovimientos
    const FnGetMovimiento = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetMovimientos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var movimiento = respuesta.map((valor: any) => {
                        var obj = { value: valor.movAgrupaId, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMovimiento: movimiento }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMovimiento: [] }))
                }
            })
    }

    //Funcion para obtener los datos de corresponsal
    const FnGetCorresponsal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCorresponsales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var corresponsal = respuesta.map((valor: any) => {
                        var obj = { value: valor.corresponsalId, label: valor.corresponsalDesc };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCorresponsal: corresponsal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCorresponsal: [] }))
                }
            })
    }



    //Funcion para obtener los datos de corresponsal
    const FnGetProducto = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetProductos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var producto = respuesta.map((valor: any) => {
                        var obj = { value: valor.productoID, label: valor.producto };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsProducto: producto }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsProducto: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'Id', sortable: false, center: true },
                { name: 'Clave', selector: 'CveMovimientoID', wrap: true, sortable: false, center: true },
                {
                    name: 'Descripcion', selector: 'TipoMovimiento', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.TipoMovimiento}</span>
                },
                {
                    name: 'Cargo', selector: 'Cargo', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.Cargo ? 'Salida' : 'Entrada'}</span>
                },
                {
                    name: 'Mov Agrupa', selector: 'MovAgrupa', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.MovAgrupa}</span>
                },
                {
                    name: 'Acepta depósitos', selector: 'AceptaDepositos', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.AceptaDepositos ? 'Permite depósitos' : 'N/A'}</span>
                },
                {
                    name: 'Acepta retiros', selector: 'AceptaRetiros', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.AceptaDepositos ? 'Permite retiros' : 'N/A'}</span>
                },
                {
                    name: 'Maneja Efectivo', selector: 'ManejaEfectivo', sortable: false, center: true,
                    cell: row => <span className='text-center'>{!!row.ManejaEfectivo ? 'Maneja Efectivo' : 'N/A'}</span>
                },
                {
                    name: 'Activa',
                    selector: 'Activa',
                    sortable: false,
                    center: true,
                    cell: (props) => <span>{props.Activa ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },

                {
                    name: 'Editar', sortable: false, center: true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        Id: props.Id,
                                        CveMovimientoID: props.CveMovimientoID,
                                        TipoMovimiento: props.TipoMovimiento,
                                        Cargo: props.Cargo,
                                        usuario: props.usuario,
                                        CorresponsalId: props.CorresponsalId,
                                        gastosRubroID: props.gastosRubroID,
                                        MovAgrupaID: props.MovAgrupaID,
                                        AceptaDepositos: props.AceptaDepositos,
                                        AceptaRetiros: props.AceptaRetiros,
                                        AplicaIva: props.AplicaIva,
                                        ManejaCuentasdeOrden: props.ManejaCuentasdeOrden,
                                        AplicaIde: props.AplicaIde,
                                        PagaInteres: props.PagaInteres,
                                        TasaInteres: props.TasaInteres,
                                        RetieneIsr: props.RetieneIsr,
                                        MontoApertura: props.MontoApertura,
                                        MontoMaximo: props.MontoMaximo,
                                        AplicaComision: props.AplicaComision,
                                        MontoComision: props.MontoComision,
                                        DepositoId: props.DepositoId,
                                        RetiroId: props.RetiroId,
                                        ComisionId: props.ComisionId,
                                        IvaId: props.IvaId,
                                        ProductoId: props.ProductoId,
                                        Activa: props.Activa,
                                        ManejaEfectivo: props.ManejaEfectivo
                                    },
                                    Id: props.Id
                                }

                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [props.Seguridad])
    React.useEffect(() => {
        FNGetLocal()
        FnGetMovimiento()
        /*  FnGetAcumula()
         FnGetRubro()
         FnGetMovimiento()
         FnGetCorresponsal()
         FnGetProducto() */
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('El movimiento se agrego correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    Id: 0,
                    CveMovimientoID: '',
                    TipoMovimiento: '',
                    Cargo: false,
                    MovAgrupaID: 0,
                    AceptaDepositos: false,
                    AceptaRetiros: false,
                    Activa: true,
                    ManejaEfectivo: false
                }
            }
        })
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El movimiento se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.Id === item.Id ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    Id: 0,
                    CveMovimientoID: '',
                    TipoMovimiento: '',
                    Cargo: false,
                    usuario: false,
                    CorresponsalId: 0,
                    gastosRubroID: 0,
                    MovAgrupaID: 0,
                    AceptaDepositos: false,
                    AceptaRetiros: false,
                    AplicaIva: false,
                    ManejaCuentasdeOrden: false,
                    AplicaIde: false,
                    PagaInteres: false,
                    TasaInteres: 0,
                    RetieneIsr: false,
                    MontoApertura: 0,
                    MontoMaximo: 0,
                    AplicaComision: false,
                    MontoComision: 0,
                    DepositoId: 0,
                    RetiroId: 0,
                    ComisionId: 0,
                    IvaId: 0,
                    ProductoId: 0,
                    Activa: true,
                    ManejaEfectivo: false
                }
            }
        }
        ))
        FNGetDatos()

    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    return (

        <div className="row">
            <div className="col-12">

                <Card Title="Tipos de movimientos por caja">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        //  customStyles={customStyles}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar movimiento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"Id"}
                                        defaultSortField={"Id"}
                                        columns={Columns}
                                    />
                                    <ModalWin large open={state.Form.Mostrar} center={true} scrollable={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Movimientos Caja" : "Agregar Movimientos Caja"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                options={state.OptionsAcumula}
                                                optionsRubro={state.OptionsRubro}
                                                optionsMovimiento={state.OptionsMovimiento}
                                                optionsCorresponsal={state.OptionsCorresponsal}
                                                optionsProducto={state.OptionsProducto}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMovimientosCaja)