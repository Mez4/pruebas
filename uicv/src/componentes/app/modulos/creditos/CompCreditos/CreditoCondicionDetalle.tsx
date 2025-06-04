import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoCondicionDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoCondicionDetalle/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc
    ProductoID: number,
    CondicionesID: number,
    optNiveles: { value: number, label: string }[]
    optNivelesOrigen: { value: number, label: string }[]
    Datos: any,
    opcionesPagina : any
}

// const Values = {
//     ProductoID: 0,
//     CondicionesID: 0
// }

const CreditoCondicionDetalle = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    // const {Seguridad, ProductoID, CondicionesID} = props   

    // const [values, setValues] = useState(Values) 

    // useEffect(() => {         
    //     setValues(s => ({
    //         ...s,            
    //         ProductoID: props.ProductoID,
    //         CondicionesID: props.CondicionesID
    //     }))
    // }, [props.CondicionesID])  

    const DatosDefecto = {
        DistribuidorNivelId: 0,
        DistribuidorNivelOrigenID: 0,
        Activo: false,
        PlazosMinimos: 0,
        PlazosMaximos: 0,
        ImporteMinimo: 0,
        ImporteMaximo: 0,
        ImporteMaximo1erCanje: 0,
        ImporteMaximo2doCanje: 0,
        ImporteMaximo3erCanje: 0,
        ImporteMinimo1erCanje: 0,
        ImporteMinimo2doCanje: 0,
        ImporteMinimo3erCanje: 0,
        PorcTasaPlazo: 0,
        SeguroPlazo: 0,
        PorcIVA: 0,
        Cargo: 0,
        ManejoCuenta: 0,
        PlazosFijos: 0,
        PorcTasaMensual: 0,
        PorcTasaAnual: 0,
        PagoXMilMinimo: 0,
        PagoXMilMaximo: 0,
        PlazosEspeciales: false,
        CapitalCorte: 0,
        PorcCreditosActivosMax: 0,
        CostoAnualTotal:0,
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            RenglonId: undefined,
        },
        ProductoID: props.ProductoID,
        CondicionesID: props.CondicionesID,
        optNiveles: props.optNiveles,
        optNivelesOrigen: props.optNivelesOrigen,
        isUpdate: false
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        let Datos = {
            ProductoID: props.ProductoID,
            CondicionesID: props.CondicionesID
        }

        Funciones.FNGet(props.oidc, Datos)
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Linea', selector: 'RenglonId', sortable: true, width: '60px', center: true,},
                { name: `Nivel Origen`, selector: 'DistribuidorNivelOrigen', sortable: true, },
                { name: `Nivel de ${DescripcionDistribuidor(1)}`, selector: 'Nivel.DistribuidorNivel', sortable: true, },
                { name: 'Activa', selector: 'Activo', sortable: true, cell: (props) => <span>{props.Activo ? "SI" : "No"}</span> },
                { name: 'Plazos Mínimos', selector: 'PlazosMinimos', sortable: true, },
                { name: 'Plazos Máximos', selector: 'PlazosMaximos', sortable: true, },
                { name: 'Importe Mínimo', selector: 'ImporteMinimo', sortable: true, },
                { name: 'Importe Máximo', selector: 'ImporteMaximo', sortable: true, },
                { name: '1erCanje Máximo', selector: 'ImporteMaximo1erCanje', sortable: true, },
                { name: '2doCanje Máximo', selector: 'ImporteMaximo2doCanje', sortable: true, },
                { name: '3erCanje Máximo', selector: 'ImporteMaximo3erCanje', sortable: true, },
                { name: '1erCanje Mínimo', selector: 'ImporteMinimo1erCanje', sortable: true, },
                { name: '2doCanje Mínimo', selector: 'ImporteMinimo2doCanje', sortable: true, },
                { name: '3erCanje Mínimo', selector: 'ImporteMinimo3erCanje', sortable: true, },
                { name: 'Tasa Plazo', selector: 'PorcTasaPlazo', sortable: true, },
                { name: 'Seguro Plazo', selector: 'SeguroPlazo', sortable: true, },
                { name: 'IVA', selector: 'PorcIVA', sortable: true, },
                { name: 'Cargo', selector: 'Cargo', sortable: true, },
                { name: 'Manejo Cuenta', selector: 'ManejoCuenta', sortable: true, },
                { name: 'Plazos Fijos', selector: 'PlazosFijos', sortable: true, },
                { name: 'Tasa Mensual', selector: 'PorcTasaMensual', sortable: true, },
                { name: 'Tasa Anual', selector: 'PorcTasaAnual', sortable: true, },
                { name: 'PagoXMil Mínimo', selector: 'PagoXMilMinimo', sortable: true, },
                { name: 'PagoXMil Máximo', selector: 'PagoXMilMaximo', sortable: true, },
                { name: 'Plazos Especiales', selector: 'PlazosEspeciales', sortable: true, cell: (props) => <span>{props.PlazosEspeciales ? "SI" : "No"}</span> },
                { name: 'Capital Corte', selector: 'CapitalCorte', sortable: true, },
                { name: '%Crédito Activo', selector: 'PorcCreditosActivosMax', sortable: true, },
                { name: 'Costo Anual', selector: 'CostoAnualTotal', sortable: true, },
                {
                    name: 'Acciones', sortable: false, center: true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        DistribuidorNivelId: props.DistribuidorNivelId,
                                        DistribuidorNivelOrigenID: props.DistribuidorNivelOrigenID,
                                        Activo: props.Activo,
                                        PlazosMinimos: props.PlazosMinimos,
                                        PlazosMaximos: props.PlazosMaximos,
                                        ImporteMinimo: props.ImporteMinimo,
                                        ImporteMaximo: props.ImporteMaximo,
                                        ImporteMaximo1erCanje: props.ImporteMaximo1erCanje,
                                        ImporteMaximo2doCanje: props.ImporteMaximo2doCanje,
                                        ImporteMaximo3erCanje: props.ImporteMaximo3erCanje,
                                        ImporteMinimo1erCanje: props.ImporteMinimo1erCanje,
                                        ImporteMinimo2doCanje: props.ImporteMinimo2doCanje,
                                        ImporteMinimo3erCanje: props.ImporteMinimo3erCanje,
                                        PorcTasaPlazo: props.PorcTasaPlazo,
                                        SeguroPlazo: props.SeguroPlazo,
                                        PorcIVA: props.PorcIVA,
                                        Cargo: props.Cargo,
                                        ManejoCuenta: props.ManejoCuenta,
                                        PlazosFijos: props.PlazosFijos,
                                        PorcTasaMensual: props.PorcTasaMensual,
                                        PorcTasaAnual: props.PorcTasaAnual,
                                        PagoXMilMinimo: props.PagoXMilMinimo,
                                        PagoXMilMaximo: props.PagoXMilMaximo,
                                        PlazosEspeciales: props.PlazosEspeciales,
                                        CapitalCorte: props.CapitalCorte,
                                        PorcCreditosActivosMax: props.PorcCreditosActivosMax,
                                        CostoAnualTotal: props.CostoAnualTotal
                                    },
                                     ProductoID: props.ProductoID,
                                     CondicionesID: props.CondicionesID,
                                    RenglonId: props.RenglonId
                                },
                                isUpdate: true
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
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
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.CondicionesID === item.CondicionesID && Dato.RenglonId === item.RenglonId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Lineas del Detalle">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-4">
                                                Producto
                                                <br />
                                                {props.Datos.Producto.Producto}
                                            </div>
                                            <div className="col-4">
                                                Condición
                                                <br />
                                                {props.Datos.Descripcion}
                                            </div>
                                            <div className="col-4"></div>
                                        </div>
                                    </div>
                                    <br />
                                    <DataTable
                                        paginationComponentOptions={props.opcionesPagina}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar linea de la condición" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, RenglonId: undefined }, isUpdate: false })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        defaultSortField={"RenglonId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.RenglonId) ? "Editar Línea de la Condición" : "Agregar Línea a la Condición"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                ProductoID={state.ProductoID}
                                                CondicionesID={state.CondicionesID}
                                                RenglonId={state.Form.RenglonId}
                                                optNiveles={state.optNiveles}
                                                optNivelesOrigen={state.optNivelesOrigen}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                isUpdate={state.isUpdate} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoCondicionDetalle)