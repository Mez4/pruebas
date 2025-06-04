import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoComisionSucursal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoComisionSucursal/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
    ProductoID: number,
    ComisionesID: number,
    optSucursales: { value: number, label: string }[]
    Head: any
    // cbClose(item: any): any,
}

const CreditoComisionSucursal = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const SucursalesIds: [] = props.Head.SucursalesIds
    const DatosDefecto = {
        SucursalesIds
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
            SucursalId: undefined,
        },
        // ProductoID: props.ProductoID,
        // ComisionesID: props.ComisionesID,
        optSucursales: props.optSucursales,
        isUpdate: false
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        let Datos = {
            ProductoID: props.ProductoID,
            ComisionesID: props.ComisionesID
        }

        Funciones.FNGet(props.oidc, Datos)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                let sucursales = respuesta.map((item: any) => item.SucursalId);
                console.log(sucursales);
                setState(s => ({
                    ...s, Cargando: false, Error: false, Datos: respuesta, Form: {
                        ...s.Form,
                        Datos: { SucursalesIds: sucursales }
                    }
                }))
                // }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Sucursal', selector: 'Sucursal.Nombre', sortable: true, },
                { name: 'Registró', selector: 'UsuarioRegistro.Nombre', sortable: true, },
                { name: 'Fecha Registro', selector: 'RegistroFecha', sortable: true, },
                { name: 'Modificó', selector: 'UsuarioModifico.Nombre', sortable: true, },
                { name: 'Fecha Modificación', selector: 'ModificoFecha', sortable: true, },
                // {
                //     name: 'Acciones', sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...s.Form, Mostrar: true,
                //                     Datos: { 
                //                         SucursalesIds: props.SucursalesIds
                //                     },
                //                     // ProductoID: props.ProductoID,
                //                     // ComisionesID: props.ComisionesID,
                //                     SucursalId: props.SucursalId                                    
                //                 },
                //                 isUpdate: true
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
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any, values: any) => {
        setState({
            ...state, Datos: [...state.Datos, ...item], Form: {
                ...state.Form, Mostrar: false,
                Datos: { SucursalesIds: values }
            }, isUpdate: false
        })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.ComisionesID === item.ComisionesID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false }, isUpdate: false }))

    return (
        <div className="row">
            {/* <div className="col-12">
                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.cbClose(state.Form.Datos.SucursalesIds)}>
                    <FaWindowClose size={20}/>
                </button>
            </div> */}
            <div className="col-12">
                <Card Title="Sucursales">
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
                                                {props.Head.Producto.Producto}
                                            </div>
                                            <div className="col-4">
                                                Comisión
                                                <br />
                                                {props.Head.Descripcion}
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
                                                        <input type="text" className="form-control" placeholder="Buscar sucursal" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                console.log(state.Form.Datos)
                                                                setState(s => ({ ...s, Form: { ...s.Form, Mostrar: true, SucursalId: undefined }, isUpdate: false }))
                                                            }}
                                                        ><FaPlus /></button>
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
                                        keyField={"SucursalId"}
                                        defaultSortField={"SucursalId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center large={false}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.SucursalId) ? "Editar Sucursal" : "Agregar Sucursales"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                ProductoID={props.ProductoID}
                                                ComisionesID={props.ComisionesID}
                                                SucursalId={state.Form.SucursalId}
                                                optSucursales={state.optSucursales}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoComisionSucursal)