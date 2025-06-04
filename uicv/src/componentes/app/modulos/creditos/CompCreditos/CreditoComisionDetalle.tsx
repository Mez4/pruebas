import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoComisionDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoComisionDetalle/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc,
    ProductoID: number,
    ComisionesID: number,
    optNiveles: { value: number, label: string }[]
    optNivelesOrigen: { value: number, label: string }[]
    Datos: any,
    opcionesPagina : any
}

const CreditoComisionDetalle = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        DistribuidorNivelID: 0,
        DistribuidorNivelIDOrigen: 0,
        Activo: false,
        DiasMin: 0,
        DiasMax: 0,
        PorcComision: 0,
        PorcComisionReal: 0,
        porcMonedero: 0,
        porcMonederoReal: 0
    }
    const opcionesPagina : any[] = [];
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
        // ProductoID: props.ProductoID,
        // ComisionesID: props.ComisionesID,
        optNiveles: props.optNiveles,
        optNivelesOrigen: props.optNivelesOrigen,
        isUpdate: false,
        opcionesPagina
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        let Datos = {
            ProductoID: props.ProductoID,
            ComisionesID: props.ComisionesID
        }

        Funciones.FNGet(props.oidc, Datos)
            .then((respuesta: any) => {
                console.log('respuesta: ', respuesta)
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
                { name: 'Linea', selector: 'RenglonId', sortable: true, width:'60px' },
                { name: 'Nivel Origen', selector: 'DistribuidorNivelOrigen', sortable: true, wrap:true, width:'180px'},
                { name: `Nivel ${DescripcionDistribuidor(1)}`, selector: 'DistribuidorNivel', sortable: true, },
                { name: 'Activa', selector: 'Activo', sortable: true, cell: (props) => <span>{props.Activo ? "SI" : "No"}</span> },
                { name: 'Mínimo Días', selector: 'DiasMin', sortable: true, },
                { name: 'Máximo Días', selector: 'DiasMax', sortable: true, },
                { name: 'Porc. Comisión', selector: 'PorcComision', sortable: true, },
                { name: 'Porc. Comisión Real', selector: 'PorcComisionReal', sortable: true, },
                { name: 'Porc. Monedero', selector: 'porcMonedero', sortable: true, },
                { name: 'Porc. Monedero Real', selector: 'porcMonederoReal', sortable: true, },
                {
                    name: 'Acciones', sortable: false, width:'65px',center:true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        DistribuidorNivelID: props.DistribuidorNivelID,
                                        DistribuidorNivelIDOrigen: props.DistribuidorNivelIDOrigen,
                                        Activo: props.Activo,
                                        DiasMin: props.DiasMin,
                                        DiasMax: props.DiasMax,
                                        PorcComision: props.PorcComision,
                                        PorcComisionReal: props.PorcComisionReal,
                                        porcMonedero: props.porcMonedero,
                                        porcMonederoReal: props.porcMonederoReal
                                    },
                                     ProductoID: props.ProductoID,
                                     ComisionesID: props.ComisionesID,
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
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.ComisionesID === item.ComisionesID && Dato.RenglonId === item.RenglonId ? item : Dato), Form: {
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
                                                Comisión
                                                <br />
                                                {props.Datos.Descripcion}
                                            </div>
                                            <div className="col-4"></div>
                                        </div>
                                    </div>
                                    <br />
                                    <DataTable
                                        
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar linea de la comisión" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, RenglonId: undefined }, isUpdate: false })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        paginationComponentOptions={props.opcionesPagina }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={""}
                                        defaultSortField={""}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.RenglonId) ? "Editar Línea de la Comisión" : "Agregar Línea a la Comisión"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                ProductoID={props.ProductoID}
                                                ComisionesID={props.ComisionesID}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoComisionDetalle)