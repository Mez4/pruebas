import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import CreditoComisionDetalle from './CreditoComisionDetalle'
import CreditoComisionSucursal from './CreditoComisionSucursal'
import * as Funciones from './CreditoComision/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnNiveles from '../../distribuidor/CompDistribuidor/DistribuidorNivel/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaListAlt, FaWindowClose, FaCodeBranch, FaPercentage, FaChartBar } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoComision/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

import ReactTooltip from 'react-tooltip';
import { CFormTraspasoTabulador } from './CreditoComision/CFormTraspasoTabulador'
import { CFormTraspasoTabuladorNivOrig } from './CreditoComision/CFormTraspasoTabuladorNivOrig'


type CatalogosType = {
    oidc: IOidc
}

const CreditoComision = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        ProductoID: 0,
        Descripcion: '',
        Activo: false,
        ConvenioID: 0
    }
    const Datos: any[] = []
    const Detail = {}
    const DatosMostrar: any[] = []
    const optProductos: any[] = []
    const optNiveles: any[] = []
    const optSucursales: any[] = []
    const optNivelesOrigen: any[] = []
    const optNivelesOrigenDestino: any[] = []
    const [state, setState] = React.useState({
        Datos,
        Detail,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        optProductos,
        optNiveles,
        optSucursales,
        optNivelesOrigen,
        optNivelesOrigenDestino,
        isUpdate: false,
        ProductoID: 0,
        ComisionesID: 0,
        ShowDetail: false,
        ShowBranch: false,
        ShowTab: false,
        ShowTabOrigen: false,
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const FnGetProductos = () => {
        FnProductos.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var productos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProductoID, label:'Empresa: ' + valor.EmpresaNombre + '- Producto: ' + valor.Producto };
                    return obj
                });

                setState(s => ({ ...s, optProductos: productos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optProductos: [] }))
                // }
            })
    }

    const FnGetNiveles = () => {
        FnNiveles.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });
                setState(s => ({ ...s, optNiveles: niveles }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optNiveles: [] }))
                // }
            })
    }

    const FnGetNivelesOrigen = () => {
        Funciones.FNGetNivelesOrigen(props.oidc)
            .then((respuesta: any) => {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });
                setState(s => ({ ...s, optNivelesOrigen: niveles }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNivelesOrigen: [] }))
            })
    }

    const FnGetSucursales = () => {
        FnSucursales.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optSucursales: sucursales }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optSucursales: [] }))
                // }
            })
    }

    

   

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'identifier', sortable: true, wrap: true, center: true, width: '50px', },
                { name: 'Producto', selector: 'Producto.Producto', sortable: true, wrap: true, center: true,},
                { name: 'Descripción', selector: 'Descripcion', sortable: true,wrap: true,center: true,  },
                { name: 'Activa', selector: 'Activo', sortable: true, center: true, cell: (props) => <span>{props.Activo ? "SI" : "No"}</span>, width:'60px', },
                { name: 'Convenio', selector: 'convenio', sortable: true, wrap: true, center: true, cell: (props) => <span>{props.convenio == "" ? "N/A" : props.convenio}</span> },
                { name: 'Registró', selector: 'UsuarioRegistro.Nombre', sortable: true,wrap: true,center: true,  },
                { name: 'Fecha Registro', selector: 'RegistroFecha', sortable: true, wrap: true, center: true,},
                { name: 'Modificó', selector: 'UsuarioModifico.Nombre', sortable: true, wrap: true,center: true, },
                { name: 'Fecha Modificación', selector: 'ModificoFecha', sortable: true,wrap: true, center: true, },
                {
                    name: 'Acciones', sortable: false,center: true, width:'80px',
                    cell: (props) =>
                        <div>
                            <button title='Editar' className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form,
                                        Mostrar: true,
                                        Datos: {
                                            ProductoID: props.ProductoID,
                                            Descripcion: props.Descripcion,
                                            Activo: props.Activo,
                                            ConvenioID: props.ConvenioID
                                        },
                                        Id: props.ComisionesID
                                    },
                                    isUpdate: true
                                }))
                            }}>
                                <FaPencilAlt />
                            </button>
                            {'\u00A0'}
                            <button  data-tip data-for="DetailTooltip" className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    ShowDetail: true,
                                    ProductoID: props.ProductoID,
                                    ComisionesID: props.ComisionesID,
                                    Detail: props
                                }))
                            }}>
                                <FaListAlt />
                            </button>
                            <ReactTooltip id="DetailTooltip"
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Detalle de la comisión
                            </ReactTooltip>
                            {/*<button data-tip data-for="BranchTooltip" className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    ShowBranch: true,
                                    ProductoID: props.ProductoID,
                                    ComisionesID: props.ComisionesID,
                                    Detail: props
                                }))
                            }}>
                                <FaCodeBranch />
                            </button>
                            <ReactTooltip id="BranchTooltip"
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Sucursales Relacionadas
                            </ReactTooltip>*/ }
                        </div>

                },
                {
                    name: 'Traspasos', sortable: false,center: true,width:'70px',
                    cell: (props) =>
                        <div>
                            <button data-tip data-for="TraspasoTab" className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    optNivelesOrigenDestino : props,
                                    ShowTab: true,
                                    ProductoID: props.ProductoID,
                                    ComisionesID: props.ComisionesID,
                                    Detail: props
                                }))
                            }}>
                                <FaPercentage />
                            </button>
                            <ReactTooltip id="TraspasoTab"
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Traspaso Tabulador
                            </ReactTooltip>
                            {'\u00A0'}
                            <button data-tip data-for="TraspasoTabOrigen" className="asstext" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    ShowTabOrigen: true,
                                    ProductoID: props.ProductoID,
                                    ComisionesID: props.ComisionesID,
                                    Detail: props
                                }))
                            }}>
                                <FaChartBar  />
                            </button>
                            <ReactTooltip id="TraspasoTabOrigen"
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Traspaso Tabulador Por Nivel Origen
                            </ReactTooltip>
                        </div>
                }
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetProductos()
            FnGetNiveles()
            FnGetNivelesOrigen()
            FnGetSucursales()
        }
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
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ComisionesID === item.ComisionesID ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    const cbCancelar = () => setState(s => ({ ...s, ShowTab: false, VerEvidencias: false }))

    const cbCancelarOrigen = () => setState(s => ({ ...s, ShowTabOrigen: false, VerEvidencias: false }))

    // const cbClose = (item: any) => 
    //     setState(s => ({ ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === state.ProductoID && Dato.ComisionesID === state.ComisionesID ? {...Dato, SucursalesIds: item} : Dato), ProductoID: 0, ComisionesID: 0,  }))
    const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        // selectAllRowsItem: true,
        // selectAllRowsItemText: "Todos",
        // nextLabel: "Siguiente",
        // previousLabel: "Anterior",
        // firstLabel: "Primero",
        // lastLabel: "Último"
      };

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Comisiones">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={paginationOptions}
                                        noDataComponent="No hay registros que mostrar"
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar comisión" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button title='Agregar' className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined }, isUpdate: false })}
                                                        ><FaPlus /></button>
                                                        <button title='Actualizar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar.map((item, index) => {
                                            item.Index = index;
                                            return item;
                                        })}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"Index"}
                                        defaultSortField={"identifier"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.Id) ? "Editar Comisión" : "Agregar Comisión"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optProductos={state.optProductos}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                isUpdate={state.isUpdate} />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.ShowDetail} full={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Detalle de la Comisión
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowDetail: false }))} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowDetail &&
                                                <CreditoComisionDetalle
                                                    opcionesPagina = {paginationOptions}
                                                    ProductoID={state.ProductoID}
                                                    ComisionesID={state.ComisionesID}
                                                    optNiveles={state.optNiveles}
                                                    Datos={state.Detail}
                                                    optNivelesOrigen={state.optNivelesOrigen}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.ShowBranch} center xlarge={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Sucursales Relacionadas a la Comisión
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => {
                                                setState(s => ({ ...s, ShowBranch: false }))
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowBranch &&
                                                <CreditoComisionSucursal
                                                    ProductoID={state.ProductoID}
                                                    ComisionesID={state.ComisionesID}
                                                    optSucursales={state.optSucursales}
                                                    Head={state.Detail}
                                                // cbClose={cbClose}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.ShowTab} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Traspaso Comisiones
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => {
                                                setState(s => ({ ...s, ShowTab: false }))
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowTab &&
                                                <CFormTraspasoTabulador
                                                OrigenData={state.DatosMostrar}
                                                oidc={props.oidc}
                                                ProductoID={state.ProductoID}
                                                ComisionesID={state.ComisionesID}
                                                //optComisiones={state.optComisiones}
                                                fnCancelar={cbCancelar}
                                                isUpdate={state.isUpdate} />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.ShowTabOrigen} large={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Traspaso Comisiones Por Origen
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => {
                                                setState(s => ({ ...s, ShowTabOrigen: false }))
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowTabOrigen &&
                                                <CFormTraspasoTabuladorNivOrig
                                                OrigenData={state.DatosMostrar}
                                                oidc={props.oidc}
                                                ProductoID={state.ProductoID}
                                                ComisionesID={state.ComisionesID}
                                                ComisionesDestinoID={state.ComisionesID}
                                                //optComisiones={state.optComisiones}
                                                fnCancelar={cbCancelarOrigen}
                                                isUpdate={state.isUpdate} />
                                            }
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoComision)