import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoGrupo/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoGrupo/CForm'
import { BuscarGrupos } from './CreditoGrupo/BuscarGrupos'
import { CFormDetalle } from './CreditoGrupoDetalle/CForm'
import { FiRefreshCcw, FiUserPlus } from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import CreditoGrupoTraspaso from './CreditoGrupoTraspaso'
import { DescripcionDistribuidor } from '../../../../../global/variables'
import ReactTooltip from 'react-tooltip';
import { iUI } from '../../../../../interfaces/ui/iUI'
import FiltroPorUsuario from '../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario'
import { Form, Formik } from 'formik'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        DirectorID: number,
        ProductoID: number,
        SucursalID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        PromotorID: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date,
        GrupoID: number,
        Permiso: boolean,
        tipoDias: string
    },
}

const filtroExceptoCampo = (arr: any[], field: string, data: string) => {
    const response = field && data ? arr.filter((element) => element[`${field}`] == data) : arr;
    return response;
}

const filtro = (data: any[], values) => {
    let arr: any[] = filtroExceptoCampo(data, "", "");
    if (!isNaN(values.producto) && values.producto > 0)
        arr = filtroExceptoCampo(arr, "ProductoID", `${values.producto}`)
    if (!isNaN(values.sucursal) && values.sucursal > 0)
        arr = filtroExceptoCampo(arr, "SucursalID", `${values.sucursal}`)
    if (!isNaN(values.coordinador) && values.coordinador > 0)
        arr = filtroExceptoCampo(arr, "CoordinadorID", `${values.coordinador}`)
    if (!isNaN(values.grupo) && values.grupo > 0)
        arr = filtroExceptoCampo(arr, "GrupoID", `${values.grupo}`)
    return arr;
}

const CreditosGrupo = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { ProductoID: 0, SucursalID: 0, CoordinadorID: 0, Estatus: false, ClasificadorGrupoID: 0 }
    const DatosDetalleDefecto = { DistribuidorID: 0, Estatus: true }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optDistribuidor: any[] = []
    const DatosDetalle: DBConfia_Creditos.IGruposDetalle_VW[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optDistribuidor,
        DatosDetalle,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FormDetalle:
        {
            Mostrar: false,
            Datos: DatosDetalleDefecto,
            Id: 0
        },
        Detalle: false,
        Traspasar: false,
        GrupoID: 0,
        SucursalID: 0,
        tipoUsuario: 0,
        initialValues: {
            DirectorID: 0,
            ProductoID: props.ui.Producto?.ProductoID ?? 0,
            SucursalID: 0,
            ZonaID: 0,
            EmpresaID: 0,
            DistribuidorID: 0,
            CoordinadorID: 0,
            creditoPromotorId: 0,
            ContratoID: 0,
            EstatusID: 'A',
            DistribuidorNivelID: 0,
            FechaInicio: moment().add(-30, 'd').toDate(),
            FechaFin: new Date(),
            GrupoID: 0,
            Permiso: true,
            tipoDias: '1',
        }
    })


    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [coordinador, setCoordinador] = useState(0);
    const [grupo, setGrupo] = useState(0);
    const [tipoUsuario, setTipoUsuario] = useState(0);

    /*const FNGetLocal = () => {

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
    }*/

    const filtrar = (values: any) => {
        const ProdID = !isNaN(values.ProductoID) ? values.ProductoID as number : 0;
        const SucursalIDAux = !isNaN(values.SucursalID) ? values.SucursalID as number : 0;
        const CoordinadorAux = !isNaN(values.CoordinadorID) ? values.CoordinadorID as number : 0;
        const GrupoIDAux = !isNaN(values.GrupoID) ? values.GrupoID as number : 0;
        state.initialValues.ProductoID = ProdID
        state.initialValues.SucursalID = SucursalIDAux
        setLoading(true);
        Funciones.FNGet2(props.oidc, { SucursalID: SucursalIDAux, CoordinadorID: CoordinadorAux, ProductoID: ProdID, GrupoID: GrupoIDAux })
            .then((respuesta: any) => {

                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, DatosMostrar: respuesta }))
                setLoading(false);

                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [], DatosMostrar: [] }))
                setLoading(false);

                // }
            })
    }

    const FNGetDetalle = (GrupoID: number) => {
        // console.log('GrupoID: ', GrupoID)
        Funciones.FNGetDetalleAgregarSocia(props.oidc, GrupoID)
            .then((respuesta: any) => {
                console.log('respuesta: ', respuesta)
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Detalle: true, DatosDetalle: respuesta, FormDetalle: { ...state.FormDetalle, Id: GrupoID } }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Detalle: false, DatosDetalle: [], FormDetalle: { ...state.FormDetalle, Id: 0 } }))
                // }
            })
    }

    const FnGetDistribuidor = (SucursalID: number, ProductoID: number, tipoUsuario: number) => {
        setState(s => ({ ...s }))
        console.log('tiposusuario', state.initialValues.SucursalID, state.initialValues.ProductoID, tipoUsuario)
        Funciones.getGruposDist(props.oidc, SucursalID, ProductoID, tipoUsuario)
            .then((respuesta: any) => {
                var Distribuidor = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorID, label: valor.DistribuidorID + ' - ' + valor.PersonaNombre };
                    return obj

                });

                setState(s => ({ ...s, optDistribuidor: Distribuidor }))
            })
            .catch(() => {
                setState(s => ({ ...s, optDistribuidor: [] }))
            })
    }

    const GetRolUsuario = () => {
        setLoading(true);
        Funciones.FNGetTipoUsuario(props.oidc, { usuarioID: 0 })
            .then((respuesta: any) => {
                setTipoUsuario(respuesta.tipoUsuario)
                state.tipoUsuario = respuesta.tipoUsuario
                setLoading(false);
            })
            .catch((error) => console.log("error!", error))
            .finally(() => setLoading(false))
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'GrupoID', sortable: true, wrap: true },
                { name: 'Producto', selector: 'Producto', sortable: true, wrap: true },
                { name: 'Sucursal', selector: 'Sucursal', sortable: true, wrap: true, width: '140px' },
                { name: 'Clasificador', selector: 'Descripcion', sortable: true, wrap: true },
                { name: 'Coordinador', selector: 'NombreCompleto', sortable: true, width: '31%', wrap: true },
                { name: 'Estatus', selector: 'Estatus', sortable: true, cell: (props) => <span>{props.Estatus ? "Activo" : "Inactivo"}</span> },
                {
                    name: 'Acciones', sortable: false,
                    cell: (data) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <button title='Editar' data-tip data-for={`EditTooltip${data.GrupoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"}
                                onClick={() => {
                                    // console.log('props: ', props)
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...s.Form,
                                            Mostrar: true,
                                            Datos: {
                                                ProductoID: data.ProductoID,
                                                SucursalID: data.SucursalID,
                                                CoordinadorID: data.CoordinadorID,
                                                Estatus: data.Estatus,
                                                ClasificadorGrupoID: data.ClasificadorGrupoID
                                            },
                                            Id: data.GrupoID
                                        }
                                    }))
                                }
                                }>
                                <FaPencilAlt />
                            </button>
                            <ReactTooltip id={`EditTooltip${data.GrupoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Cambiar Coordinador
                            </ReactTooltip>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button title='Detalle' data-tip data-for={`AddDVTooltip${data.GrupoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button"
                                onClick={() => {
                                    FNGetDetalle(data.GrupoID)
                                    FnGetDistribuidor(state.initialValues.SucursalID, state.initialValues.ProductoID, state.tipoUsuario)
                                }}>
                                <FiUserPlus />
                            </button>
                            <ReactTooltip id={`AddDVTooltip${data.GrupoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Agregar {`${DescripcionDistribuidor(1)}`}
                            </ReactTooltip>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {state.tipoUsuario != 3 && <button title='Traspasar' data-tip data-for={`TrasDVTooltip${data.GrupoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                                setState(s => ({ ...s, Traspasar: true, GrupoID: data.GrupoID, SucursalID: data.SucursalID }))
                            }}>
                                <FaExchangeAlt />
                            </button>}
                            <ReactTooltip id={`TrasDVTooltip${data.GrupoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Traspasar {`${DescripcionDistribuidor(2)}`}
                            </ReactTooltip>
                        </div>
                },
            ]
        return colRet
    }, [])

    const DetailColumns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', width: '95px', selector: 'DistribuidorID', sortable: true, wrap: true },
                { name: `${DescripcionDistribuidor(1)}`, selector: 'NombreCompleto', sortable: true, wrap: true, width: '60%' },
                { name: 'Estatus', selector: 'Estatus', sortable: true, wrap: true, cell: (props) => <span>{props.Estatus ? "Activo" : "Inactivo"}</span> }
            ]
        return colRet
    }, [])

    /*React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])*/
    console.log('tipousuario2', tipoUsuario)
    useEffect(() => {
        GetRolUsuario()
    }, [tipoUsuario])

    useEffect(() => {
        const arr = filtro(state.Datos, { producto, sucursal, coordinador, grupo });
        setState(s => ({ ...s, DatosMostrar: arr }));
    }, [producto, sucursal, coordinador, grupo])




    const cbRespuesta = (Datos: any) =>
        setState(s => ({ ...s, Datos: Datos }))

    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.GrupoID === item.GrupoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    const cbAgregarDetalle = (item: any) =>
        setState({ ...state, DatosDetalle: [...state.DatosDetalle, item.Data] })

    const cbActualizarDetalle = (item: any) =>
        setState({ ...state, DatosDetalle: state.DatosDetalle.map(Dato => Dato.GrupoID === item.GrupoID ? item : Dato), FormDetalle: { ...state.FormDetalle, Mostrar: false, Datos: DatosDetalleDefecto } })

    return (
        <div>
            <Card Title="Administrar Grupos">
                <Card.Body>
                    <Card.Body.Content>
                        <FiltroPorUsuario
                            oidc={props.oidc}
                            ui={props.ui}
                            initialValues={state.initialValues}
                            onSubmit={filtrar}
                            loading={loading}
                            EsAdmCreditos={true}
                        // PrintExcelObj={{ data: state.Datos, title: "Consulta Rapida 191", nameDoc: "ConsultaRapida(191)" }}
                        />

                        {state.Datos.length > 0 &&
                            <DataTable
                                subHeader
                                subHeaderComponent=
                                {
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder="Buscar grupos" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                <span className="input-group-text"><FaSearch /> </span>
                                                <button title='Agregar' className="btn btn-outline-secondary" type="button"
                                                    onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                ><FaPlus /></button>
                                                {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                            </div>
                                        </div>
                                    </div>
                                }
                                data={state.Datos}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"GrupoID"}
                                defaultSortField={"GrupoID"}
                                columns={Columns}
                                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                    setState(s => ({ ...s, Error: false, DatosMostrar: state.Datos }))
                                }}
                            />}
                        <ModalWin open={state.Form.Mostrar}>
                            <ModalWin.Header>
                                <h5 className={MODAL_TITLE_CLASS}>
                                    {state.Form.Id ? "Editar Grupos" : "Agregar Grupos"}
                                </h5>
                            </ModalWin.Header>
                            <ModalWin.Body>
                                <CForm
                                    oidc={props.oidc}
                                    ui={props.ui}
                                    initialValues={state.Form.Datos}
                                    Id={state.Form.Id}
                                    cbActualizar={cbActualizar}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={fnCancelar} />
                            </ModalWin.Body>
                        </ModalWin>

                        <ModalWin open={state.Detalle} scrollable>
                            <ModalWin.Header>
                                <h5 className={MODAL_TITLE_CLASS}>
                                    {`Agregar ${DescripcionDistribuidor(2)}`}
                                </h5>
                                <button title='Agregar' type="button" className="delete" onClick={() => setState({ ...state, Detalle: false })} />
                            </ModalWin.Header>
                            <ModalWin.Body>
                                <CFormDetalle
                                    oidc={props.oidc}
                                    initialValues={state.FormDetalle.Datos}
                                    GrupoID={state.FormDetalle.Id}
                                    SucursalID={state.initialValues.SucursalID}
                                    optDistribuidorID={state.optDistribuidor}
                                    DistribuidorID={0}
                                    cbActualizar={cbActualizarDetalle}
                                    cbGuardar={cbAgregarDetalle}
                                // fnCancelar={fnCancelarDetalle}
                                />
                                <DataTable
                                    data={state.DatosDetalle}
                                    striped
                                    // pagination
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"DistribuidorID"}
                                    defaultSortField={"DistribuidorID"}
                                    columns={DetailColumns}
                                // expandableRows
                                // expandOnRowClicked
                                // onRowExpandToggled={(res: any) => {
                                //     HiddenData(res)
                                // }}
                                // expandableRowsComponent={<HiddenData/>}
                                />
                            </ModalWin.Body>
                        </ModalWin>


                        {tipoUsuario != 3 && state.Traspasar && <ModalWin open={state.Traspasar} large>
                            <ModalWin.Header>
                                <h5 className={MODAL_TITLE_CLASS}>
                                    {`Traspasar ${DescripcionDistribuidor(1)} de Grupos`}
                                </h5>
                                <button title='Cerrar' type="button" className="delete" onClick={() => setState({ ...state, Traspasar: false })} />
                            </ModalWin.Header>
                            <ModalWin.Body>
                                <CreditoGrupoTraspaso GrupoID={state.GrupoID} SucursalID={state.SucursalID} />
                            </ModalWin.Body>
                        </ModalWin>}
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditosGrupo)