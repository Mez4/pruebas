import * as FnCoordinador from '../../../modulos/creditos/CompCreditos/CreditoCoordinador/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import { ActionSelect, Card, ModalWin, Spinner } from "../../../../global"
import DataTable, { IDataTableColumn } from "react-data-table-component"
import * as FnGestoria from "./SociasGestores/Funciones"
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin"
import { FaFilter, FaLink, FaSearch } from "react-icons/fa"
import { CForm } from "./SociasGestores/CForm"
import { FiRefreshCcw } from "react-icons/fi"
import { Form, Formik } from "formik"
import { connect } from 'react-redux'
import * as Yup from 'yup';
import React from "react"
import { FiltrarDatos } from '../../../../../global/functions'
import DataGridComp from '../../../../global/DataGrid'


interface IBuscarSocias {
    SucursalID: number;
    CoordinadorID: number;
}
type InitialState = {
    optCoordinadores: any[],
    optSucursales: any[],
    optGestores: any[],
    DatosMostrar: any[],
    Datos: any[],
    Filtro: string,
    SucursalID: number,
    Cargando: boolean,
    Error: boolean,
    Form: {
        Mostrar?: boolean,
        Datos: {
            Distribuidores: any[],
            UsuarioID: number
        }
    }
}

const Personas = (props) => {
    const DatosMostrar: any[] = []
    const Datos: any[] = []
    let isMounted = React.useRef(true)
    const modalStyle = { overflowY: 'unset' };


    const [state, setState] = React.useState<InitialState>({
        optCoordinadores: [],
        optSucursales: [],
        optGestores: [],
        Datos,
        DatosMostrar,
        Filtro: '',
        SucursalID: 0,
        Cargando: false,
        Error: false,
        Form: {
            Mostrar: false,
            Datos: {
                Distribuidores: [],
                UsuarioID: 0
            }
        }
    })

    const FnGetCoordinadores = (setData: Function, SucursalID: number) => {
        setState(s => ({ ...s, SucursalID }))
        setData(s => ({ ...s, CoordinadorID: '', SucursalID }))
        FnCoordinador.FNGetBySucursal(props.oidc, SucursalID)
            .then((respuesta: any) => {
                var coordinadores = respuesta.map((valor: any) => {
                    var obj = { value: valor.CoordinadorID, label: valor.CoordinadorID + ' - ' + valor.NombreCompleto };
                    return obj
                });
                setState(s => ({ ...s, optCoordinadores: coordinadores }))
            })
            .catch(() => {
                setState(s => ({ ...s, optCoordinadores: [] }))
            })
    }

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

    const FnGetGestores = () => {
        FnGestoria.FNGetGestoresBySucursal(props.oidc, { Permiso: false })
            .then((respuesta: any) => {
                var gestores = respuesta.map((e: any) => {
                    var obj = { value: e.UsuarioID, label: `ID: ${e.ResponsableId} -  ${e.ResponsableNombre}` };
                    return obj
                });
                setState(s => ({ ...s, optGestores: gestores }))
            })
            .catch(() => {
                setState(s => ({ ...s, optGestores: [] }))
            })
    }

    const FnGetDistribuidores = (data: IBuscarSocias) => {
        setState(s => ({ ...s, Cargando: true }))
        FnGestoria.FNGetDvSucursalCoordinador(props.oidc, data)
            .then((res: any) => {
                setState(s => ({
                    ...s, Datos: res, Cargando: false, Error: false,
                    Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
                }))
            })
            .catch(() => {
                setState(s => ({
                    ...s, Datos: [], Error: true, Cargando: false,
                    Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
                }))
            })
    }

    const handleRowSelected = /* React.useCallback( */(selectedRows) => {
        setState(s => ({
            ...s,
            Form: {
                ...Form,
                Datos: { ...s.Form.Datos, Distribuidores: selectedRows }
            }
        }));
    }/* , []) */;

    const gestorModal = (open = true) => {
        if (open)
            FnGetGestores()
        setState(s => ({
            ...s,
            Form: { ...s.Form, Mostrar: open }
        }))
    }

    const dgGuardar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
    }))

    const fnCancelar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos } }
    }))

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    React.useEffect(() => {
        if (isMounted.current === true)
            FnGetSucursales()
        return () => { isMounted.current = false }
    }, [])


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: 'Persona ID', selector: 'DistribuidorID', wrap: true },
            { name: 'Nombre', selector: 'NombreCompleto', wrap: true, },
            { name: 'Cartera', selector: 'Cartera', wrap: true, },
            { name: 'MaxDiasAtraso', selector: 'MaxDiasAtr', wrap: true, },
            { name: 'Responsable', selector: 'ResponsableNombre', wrap: true, },
        ]
        return colRet
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title={'Socias Gestores'}>
                        <Card.Body>
                            <Card.Body.Content>
                                <Formik
                                    initialValues={{
                                        SucursalID: 0,
                                        CoordinadorID: 0,
                                    }}
                                    enableReinitialize
                                    validationSchema={
                                        Yup.object().shape({
                                            SucursalID: Yup.number(),
                                            CoordinadorID: Yup.number(),
                                        })}
                                    onSubmit={FnGetDistribuidores}>
                                    {({ values, setValues }) => (
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
                                                                options={state.optSucursales}
                                                                addDefault={false}
                                                                valor={values.SucursalID}
                                                                accion={(e) => FnGetCoordinadores(setValues, e)}
                                                            />
                                                        </div>
                                                        <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <ActionSelect
                                                                disabled={false}
                                                                label="Coordinador"
                                                                name="CoordinadorId"
                                                                placeholder={'Seleccione un coordinador'}
                                                                options={state.optCoordinadores}
                                                                addDefault={false}
                                                                valor={values.CoordinadorID}
                                                                accion={(e) => setValues({ ...values, CoordinadorID: e })}
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                                                        <button disabled={false} className="btn btn-primary btn-lg" type="submit" >
                                                            Buscar
                                                        </button>
                                                        <button disabled={false} type="button" className="btn btn-success ml-2 btn-lg" onClick={() => gestorModal()} >
                                                            Asignar reesponsable
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                                <div>
                                    {state.Cargando && <Spinner />}
                                    {state.Error && <span>Error al cargar los datos...</span>}
                                    {(!state.Cargando && !state.Error) && <>
                                        <DataGridComp
                                            data={state.DatosMostrar}
                                            columns={Columns}
                                            rowId={'DistribuidorID'}
                                            selectedRows={state.Form.Datos.Distribuidores}
                                            onRowSelected={handleRowSelected}
                                        />
                                    </>}
                                    {/* {(!state.Cargando && !state.Error) &&
                                        <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar persona" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <span className="input-group-text"><FaSearch /> </span>
                                                            <button className="input-group-text" onClick={() => gestorModal()}>
                                                                <FaLink />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            paginationComponentOptions={{
                                                noRowsPerPage: false, rowsPerPageText: 'Distribuidores por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',
                                            }}
                                            contextMessage={{
                                                singular: '- Distribuidor seleccionado',
                                                plural: '- Distribuidores seleccionados',
                                                message: ''
                                            }}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            //selectableRowDisabled={(row: any) => disableRow(row)}
                                            selectableRows
                                            //selectableRowsComponent={<div>ssss</div>}
                                            noDataComponent={<div>No hay datos</div>}
                                            title={<span>Lista de Distribuidores</span>}

                                            onSelectedRowsChange={handleRowSelected}
                                            keyField={"DistribuidorID"}
                                            defaultSortField={"DistribuidorID"}
                                            columns={Columns}
                                        />} */}
                                </div>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <ModalWin  open={state.Form.Mostrar}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Seleccione el gestor a vincular</h5>
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

export default connect(mapStateToProps, mapDispatchToProps)(Personas)