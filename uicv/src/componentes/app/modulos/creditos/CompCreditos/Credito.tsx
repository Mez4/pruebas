import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios'
import * as Funciones from './CreditoCredito/Funciones'
// import * as FnProductos from './CreditoProducto/Funciones'
// import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
// import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
// import * as FnClientes from '../../distribuidor/CompDistribuidor/Cliente/Funciones'
// import * as FnTiposDesmbolso from '../../bancos/CompBancos/BancoTipoDesembolso/Funciones'
// import * as FnCreditoCondicionDetalle from './CreditoCondicionDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCreditCard, FaWindowClose, FaUserPlus } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionFieldText } from '../../../../global'

// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc,
    CreditoID: number
}

const Credito = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        CreditoID: 0,
        PersonaID: 0,
        NombreCompleto: '',
        Coordinador: '',
        NoCreditosActivos: '',
        ValeCanje: 0,
        FechaHoraRegistro: '',
        UsuarioIDRegistro: '',
        Capturo: '',
        Descripcion: '',
        Aval: '',
        TasaTipo: '',
        EstatusNombre: '',
        ImporteTotal: 0,
        Abonos: 0,
        SaldoActual: 0,
        Capital: 0,
        Interes: 0,
        ManejoCuenta: 0,
        Seguro: 0,
        IVA: 0,
        TipoDesembolsoID: 0,
        CuentaID: 0
    }
    const Detail: any[] = []
    const DatosMostrar: any[] = []
    // const Clientes: any[] = []
    // const Distribuidores: any[] = []
    // const CondicionesDetalle: any[] = []
    // const DatosCliente: {} = {}
    // const DatosDistribuidor: {} = {}
    // const optProductos: any[] = []
    // const optDistribuidores: any[] = []
    // const optSucursales: any[] = []
    // const optClientes: any[] = []
    // const optTiposDesembolso: any[] = []
    // const optPlazos: any[] = []
    const [state, setState] = React.useState({
        Head: DatosDefecto,
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
        // optProductos,
        // optDistribuidores,
        // optSucursales,
        // optClientes,
        // optTiposDesembolso,
        // optPlazos,
        // isUpdate: false,
        // Clientes,
        // Distribuidores,
        // CondicionesDetalle,
        // DatosCliente,
        // DatosDistribuidor,
        // ShowDatosBancarios: false,
        // PersonaID: 0
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, props.CreditoID)
            .then((respuesta: any) => {
                console.log(respuesta)
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Head: respuesta, Detail: respuesta.PlanPagos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Detail: [], Head: DatosDefecto }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Plazo', selector: 'NoPago', sortable: false, },
                { name: 'Fecha Vencimiento', selector: 'FechaVencimiento', sortable: false, },
                { name: 'Importe', selector: 'ImporteTotal', sortable: false, },
                { name: 'Abonos', selector: 'Abonos', sortable: false, },
                { name: 'Saldo', selector: 'SaldoActual', sortable: false, },
                { name: 'Dias Atraso', selector: 'DiasAtraso', sortable: false, },
                { name: 'Fecha Liquidación', selector: 'FechaLiquidacion', sortable: false, },
                // {
                //     name: 'Acciones', sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...s.Form, 
                //                     Mostrar: true,
                //                     Datos: { 
                //                         ProductoID: props.ProductoID, 
                //                         SucursalId: props.SucursalId,
                //                         CondicionesID: props.CondicionesID,
                //                     },                          
                //                 },
                //             }))
                //         }}>
                //             <FaPencilAlt />
                //         </button>
                // },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Detail, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Detail, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => setState(s => ({ ...s }))

    // const cbDatosBancarios = (item: any) =>
    //     setState(s => ({ ...s, ShowDatosBancarios: false }))

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => setState(s => ({ ...s }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s }))


    return (
        <div className="row">
            <Card Title="Captura de Vales">
                <Card.Body>
                    <Card.Body.Content>
                        {state.Cargando && <Spinner />}
                        {state.Error && <span>Error al cargar los datos...</span>}
                        {!state.Cargando && !state.Error &&
                            <>
                                <div className="row mb-3">
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="CreditoID">Crédito</label>
                                        <input
                                            className={`form-control`}
                                            disabled={true}
                                            value={state.Head.CreditoID}
                                            name="CreditoID"
                                            id="CreditoID"
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="NombreCompleto">Nombre del Cliente</label>
                                        <input
                                            disabled={true}
                                            name="NombreCompleto"
                                            className={`form-control`}
                                            id="NombreCompleto"
                                            value={state.Head.NombreCompleto}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Coordinador">Coordinador</label>
                                        <input
                                            disabled={true}
                                            name="Coordinador"
                                            className={`form-control`}
                                            id="Coordinador"
                                            value={state.Head.Coordinador}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="NoCreditosActivos">Movimiento</label>
                                        <input
                                            disabled={true}
                                            name="NoCreditosActivos"
                                            className={`form-control`}
                                            id="NoCreditosActivos"
                                            value={state.Head.NoCreditosActivos}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="ValeCanje">Folio</label>
                                        <input
                                            disabled={true}
                                            name="ValeCanje"
                                            className={`form-control`}
                                            id="ValeCanje"
                                            value={state.Head.ValeCanje}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="FechaHoraRegistro">Capturada</label>
                                        <input
                                            disabled={true}
                                            name="FechaHoraRegistro"
                                            className={`form-control`}
                                            id="FechaHoraRegistro"
                                            value={state.Head.FechaHoraRegistro}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Capturo">Capturo</label>
                                        <input
                                            disabled={true}
                                            name="Capturo"
                                            className={`form-control`}
                                            id="Capturo"
                                            value={state.Head.Capturo}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="Descripcion">Condición</label>
                                        <input
                                            disabled={true}
                                            name="Descripcion"
                                            className={`form-control`}
                                            id="Descripcion"
                                            value={state.Head.Descripcion}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Aval">Aval</label>
                                        <input
                                            disabled={true}
                                            name="Aval"
                                            className={`form-control`}
                                            id="Aval"
                                            value={state.Head.Aval}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="TasaTipo">Modo</label>
                                        <input
                                            disabled={true}
                                            name="TasaTipo"
                                            className={`form-control`}
                                            id="TasaTipo"
                                            value={state.Head.TasaTipo}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Capital">Capital</label>
                                        <input
                                            disabled={true}
                                            name="Capital"
                                            className={`form-control`}
                                            id="Capital"
                                            value={state.Head.Capital}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Interes">Interes</label>
                                        <input
                                            disabled={true}
                                            name="Interes"
                                            className={`form-control`}
                                            id="Interes"
                                            value={state.Head.Interes}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="ManejoCuenta">Manejo Cuenta</label>
                                        <input
                                            disabled={true}
                                            name="ManejoCuenta"
                                            className={`form-control`}
                                            id="ManejoCuenta"
                                            value={state.Head.ManejoCuenta}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="Seguro">Seguro</label>
                                        <input
                                            disabled={true}
                                            name="Seguro"
                                            className={`form-control`}
                                            id="Seguro"
                                            value={state.Head.Seguro}
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <label className="form-label mb-0" htmlFor="IVA">IVA</label>
                                        <input
                                            disabled={true}
                                            name="IVA"
                                            className={`form-control`}
                                            id="IVA"
                                            value={state.Head.IVA}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="EstatusNombre">Estatus</label>
                                        <input
                                            disabled={true}
                                            name="EstatusNombre"
                                            className={`form-control`}
                                            id="EstatusNombre"
                                            value={state.Head.EstatusNombre}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="ImporteTotal">Total</label>
                                        <input
                                            disabled={true}
                                            name="ImporteTotal"
                                            className={`form-control`}
                                            id="ImporteTotal"
                                            value={state.Head.ImporteTotal}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="Abonos">Pagos</label>
                                        <input
                                            disabled={true}
                                            name="Abonos"
                                            className={`form-control`}
                                            id="Abonos"
                                            value={state.Head.Abonos}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label mb-0" htmlFor="SaldoActual">Saldo</label>
                                        <input
                                            disabled={true}
                                            name="SaldoActual"
                                            className={`form-control`}
                                            id="SaldoActual"
                                            value={state.Head.SaldoActual}
                                        />
                                    </div>
                                </div>
                                <br />

                                <div>
                                    <DataTable
                                        subHeaderAlign="center"
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <h3>Plan de Pagos</h3>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        dense
                                        noHeader
                                        pagination
                                        responsive
                                        keyField={"NoPago"}
                                        defaultSortField={"NoPago"}
                                        columns={Columns}
                                    />

                                    {/* <ModalWin open={state.Form.Mostrar} large={true}>
                                    <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>
                                            {(state.Form.ProductoID  && state.Form.SucursalId) ? "Editar Relación Sucursal - Condición" : "Agregar Relación Sucursal - Condición"}
                                        </h5>
                                    </ModalWin.Header>
                                    <ModalWin.Body> */}
                                    {/* <CForm
                                oidc={props.oidc}
                                ProductoID={1}
                                initialValues={state.Form.Datos}
                                Id={state.Form.Id}
                                // optProductos={state.optProductos}
                                optDistribuidores={state.optDistribuidores}
                                optSucursales={state.optSucursales}
                                optClientes={state.optClientes}
                                // optTiposDesembolso={state.optTiposDesembolso}
                                optTiposDesembolso={[
                                    { value: 1, label: 'Caja' },
                                    { value: 2, label: 'ODP' },
                                    { value: 3, label: 'SPEI' }
                                ]}
                                optPlazos={state.optPlazos}
                                cbActualizar={cbActualizar}
                                cbGuardar={cbAgregar}
                                fnCancelar={fnCancelar}
                                DatosCliente={state.DatosCliente}
                                DatosDistribuidor={state.DatosDistribuidor}
                                fnGetDistribuidores={fnGetDistribuidores}
                                fnGetDatosDistribuidor={fnGetDatosDistribuidor}
                                fnGetDatosCliente={fnGetDatosCliente}
                                fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                fnGetListaPlazos={fnGetListaPlazos}
                                fnGetClientes={FnGetClientes}
                                isUpdate={state.isUpdate} /> */}
                                    {/* </ModalWin.Body>
                                </ModalWin> */}

                                    {/* <ModalWin open={state.ShowDatosBancarios} >
                                <ModalWin.Header>
                                    <h5 className={MODAL_TITLE_CLASS}>
                                        Datos Bancarios del Cliente
                                    </h5>
                                    <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => setState(s => ({ ...s, ShowDatosBancarios: false }))}>
                                        <FaWindowClose size={20} />
                                    </button>
                                </ModalWin.Header>
                                <ModalWin.Body>
                                    {state.ShowDatosBancarios &&
                                        <PersonasDatosBancarios
                                            PersonaID={state.PersonaID}
                                            cbGuardar={cbDatosBancarios}
                                        />
                                    }
                                </ModalWin.Body>
                            </ModalWin> */}
                                </div>
                            </>
                        }
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Credito)