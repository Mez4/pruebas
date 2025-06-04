import * as FnCoordinador from '../../../modulos/creditos/CompCreditos/CreditoCoordinador/Funciones'
import { CForm } from './TraspasoCajaBoveda/CForm'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import { ActionSelect, Card, ModalWin, Spinner } from "../../../../global"
import DataTable, { IDataTableColumn } from "react-data-table-component"
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin"
import { FaExchangeAlt, FaFilter, FaLink, FaSearch } from "react-icons/fa"
import { FiRefreshCcw } from "react-icons/fi"
import { Form, Formik } from "formik"
import { connect } from 'react-redux'
import * as Yup from 'yup';
import React from "react"
import * as Funciones from './TraspasoCajaBoveda/Funciones'
import { FiltrarDatos } from '../../../../../global/functions'

interface IntInitialState {
    CajaID: number
    SucursalID: number
    BovedaID: number
    TipoTraspaso: number
}

const TraspasoCajaBoveda = (props) => {
    const DatosMostrar: any[] = []
    const Datos: any[] = []
    let isMounted = React.useRef(true)

    const [state, setState] = React.useState<any>({
        CajaID: 0,
        SucursalID: 0,
        BovedaID: 0,
        TipoTraspaso: 0,
        Form: {
            Mostrar: false,
            Datos: {}
        },
        Cajas: [],
        Bovedas: [],
    })

    const FnGetSucursales = () => {
        FnSucursales.FNGet(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });
                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }

    const FnGetBovedas = (SucursalID: number) => {
        Funciones.FNGetBovedas(props.oidc, SucursalID)
            .then((respuesta: any) => {
                var bovedas = respuesta.map((e: any) => {
                    var obj = { value: e.BovedaID, label: e.Boveda };
                    return obj
                });
                setState(s => ({ ...s, Bovedas: bovedas }))
            })
            .catch(() => {
                setState(s => ({ ...s, Bovedas: [] }))
            })
    }

    const FnGetCajas = (SucursalID: number) => {
        Funciones.FNGetCajas(props.oidc, SucursalID)
            .then((respuesta: any) => {
                var cajas = respuesta.map((e: any) => {
                    var obj = { value: e.CajaID, label: e.Descripcion };
                    return obj
                });
                setState(s => ({ ...s, Cajas: cajas }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cajas: [] }))
            })
    }

    const getTableData = ({ TipoTraspaso, SucursalID }) => {
        setState(s => ({ ...s, TipoTraspaso: TipoTraspaso, SucursalID: SucursalID }))
        FnGetCajas(SucursalID)
        FnGetBovedas(SucursalID)
    }

    const dgGuardar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
    }))

    const fnCancelar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos } }
    }))


    const traspasoModal = (open = true, e) => {
        setState(s => ({
            ...s,
            Form: {
                ...s.Form,
                Mostrar: open,
                Datos: {
                    ValorOrigen: e.value,
                    TipoTraspaso: s.TipoTraspaso
                }
            }
        }))
    }

    React.useEffect(() => {
        console.log('camnia algo', state.TipoTraspaso != 1 ? state.Cajas : state.Bovedas);
        setState(s => ({
            ...s, DatosMostrar: state.TipoTraspaso != 1 ? s.Cajas : s.Bovedas/* FiltrarDatos(
                state.TipoTraspaso != 1 ? s.Cajas : s.Bovedas,
                state.TipoTraspaso != 1 ? ColumnsCaja : ColumnsBoveda,
                state.Filtro
            ) */
        }))
    }, [state.Bovedas, state.Cajas, state.Filtro])

    React.useEffect(() => {
        if (isMounted.current === true)
            FnGetSucursales()
        return () => { isMounted.current = false }
    }, [])


    const ColumnsCaja = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: 'Caja ID', selector: 'value', sortable: false, wrap: true },
            { name: 'Descripcion', selector: 'label', sortable: false, wrap: true, },
            { name: 'Traspasar', cell: (e) => (<div onClick={() => traspasoModal(true, e)}> <FaExchangeAlt /> </div>) },
        ]
        return colRet
    }, [])

    const ColumnsBoveda = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: 'Boveda ID', selector: 'value', sortable: false, wrap: true },
            { name: 'Boveda', selector: 'label', sortable: false, wrap: true, },
            { name: 'Traspasar', cell: (e) => (<div onClick={() => traspasoModal(true, e)}> <FaExchangeAlt /></div>) },
        ]
        return colRet
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <Card.Body.Content>
                                <Formik
                                    initialValues={{
                                        TipoTraspaso: 1,
                                        SucursalID: null,
                                    }}
                                    enableReinitialize
                                    validationSchema={
                                        Yup.object().shape({
                                            TipoTraspaso: Yup.number().required(),
                                            SucursalID: Yup.number().required(),
                                        })}
                                    onSubmit={getTableData}>
                                    {({ values }) => (
                                        <Form>
                                            <div className="columns is-centered is-mobile is-multiline">
                                                <div className="column is-full-desktop is-full-mobile is-full-tablet" style={{ backgroundColor: '#F7F7F7', padding: '2em', borderRadius: '15px' }}>
                                                    <div>
                                                        <div style={{ float: 'left' }}><FaFilter /></div>
                                                        <div><label> FILTROS</label></div>
                                                    </div>
                                                    <div className="row" style={{ textAlign: 'initial' }}>
                                                        <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <ActionSelect
                                                                disabled={false}
                                                                label="Sucursal"
                                                                name="SucursalID"
                                                                placeholder={'Seleccione una sucursal'}
                                                                options={state.optSucursales || []}
                                                                addDefault={false}
                                                                valor={values.SucursalID}
                                                            />
                                                        </div>
                                                        <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <ActionSelect
                                                                disabled={false}
                                                                label="Tipo traspaso"
                                                                name="TipoTraspaso"
                                                                placeholder={'Seleccione un coordinador'}
                                                                options={[{ value: 2, label: 'Caja a boveda', }, { value: 1, label: 'Boveda a caja', }]}
                                                                addDefault={false}
                                                                valor={values.TipoTraspaso}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                                                        <div className="text-end">
                                                            <button disabled={false} type="submit" className="btn btn-primary waves-effect waves-light">
                                                                <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                                <div className="columns is-centered is-mobile is-multiline">
                                    {state.Cargando && <Spinner />}
                                    {state.Error && <span>Error al cargar los datos...</span>}
                                    {(!state.Cargando && !state.Error) &&
                                        <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar registro" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <span className="input-group-text"><FaSearch /> </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            paginationComponentOptions={{
                                                noRowsPerPage: false, rowsPerPageText: 'Registros por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',
                                            }}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            noDataComponent={<div>No hay datos</div>}
                                            title={<span> {state.TipoTraspaso != 1 ? 'No hay cajas' : 'No hay bovedas'} </span>}
                                            keyField={state.TipoTraspaso != 1 ? 'CajaID' : 'BovedaID'}
                                            defaultSortField={state.TipoTraspaso != 1 ? 'CajaID' : 'BovedaID'}
                                            columns={state.TipoTraspaso != 1 ? ColumnsCaja : ColumnsBoveda}
                                        />}
                                </div>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <ModalWin open={state.Form.Mostrar}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Seleccione el la {state.TipoTraspaso != 1 ? 'boveda' : 'caja'} a traspasar </h5>
                </ModalWin.Header>
                <ModalWin.Body>
                    <CForm
                        dgGuardar={dgGuardar}
                        fnCancelar={fnCancelar}
                        initialValues={state.Form.Datos}
                        oidc={props.oidc}
                        state={state}
                    />
                </ModalWin.Body>
            </ModalWin>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TraspasoCajaBoveda)