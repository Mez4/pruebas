import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoPromotor/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUser } from 'react-icons/fa'

import { Link, useParams } from 'react-router-dom'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoPromotor/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormAsigna } from './CreditoPromotor/CFormAsigna'
import Sucursales from '../../../../selectores/Sucursales';
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc
}

const CreditoPromotor = (props: CatalogosType) => {
    console.log(props);

    let isMounted = React.useRef(true)
    const modalStyle = { overflowY: 'unset' };
    const DatosDefecto = { creditoPromotorNombre: '', activo: false, SucursalID: 0 }
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
            Id: undefined
        },
        MostrarAsigna: false
    })

    // Ontenemos el ID del producto
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta);
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'creditoPromotorId', sortable: true, },
                { name: 'Nombre', selector: 'creditoPromotorNombre', sortable: true, },
                { name: 'Activo', selector: 'activo', sortable: true, cell: (props) => <span>{props.activo ? "SI" : "No"}</span> },
                { name: 'Fecha Registro', selector: 'fhRegistro', sortable: true, cell: (props) => <span>{props.fhRegistro ? moment(props.fhRegistro).format('DD/MM/YYYY HH:mm a') : ""}</span> },
                { name: 'Sucursal', selector: 'SucursalNombre', sortable: true, },
                { name: 'Usuario Creó', selector: 'UsuarioRegistro', sortable: true, },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button title='Editar' className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { creditoPromotorNombre: props.creditoPromotorNombre, activo: props.activo, SucursalID: props.SucursalID },
                                    Id: props.creditoPromotorId
                                }
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
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true, SucursalID: 0 } }, MostrarAsigna: false })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        if (item.activo == true) {
            setState({
                ...state, Datos: state.Datos.map(Dato => Dato.creditoPromotorId === item.creditoPromotorId ? item : Dato),
                Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true, SucursalID: 0 } }, MostrarAsigna: false
            })
        }
        else {
            const Promotores = state.Datos.filter((promotor: any) => promotor.creditoPromotorId !== item.creditoPromotorId);
            setState({ ...state, Datos: Promotores, Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true, SucursalID: 0 } }, MostrarAsigna: false });
        }
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    const fnCancelarAsigna = () => setState({ ...state, MostrarAsigna: false })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Promotores">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar promotor" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /></span>
                                                        <button title='Agregar' className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, MostrarAsigna: true })}
                                                        ><FaPlus /></button>
                                                        <button title='Actualizar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"creditoPromotorId"}
                                        defaultSortField={"creditoPromotorId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Promotor" : "Agregar Promotor"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body style={{ overflowY: 'unset' }}>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                ProdID={id_int}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.MostrarAsigna}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Asignar persona como promotor
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body style={modalStyle}>
                                            <CFormAsigna
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={id_int}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelarAsigna} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoPromotor)