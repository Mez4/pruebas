import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './MonedaSat/Funciones'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './MonedaSat/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const MonedaSat = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' }
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
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'MonedaSatID',
                    sortable: true,
                },
                {
                    name: 'NombreMoneda',
                    selector: 'NombreMoneda',
                    sortable: true,
                },
                {
                    name: 'TipoCambio',
                    selector: 'TipoCambio',
                    sortable: true,
                },
                {
                    name: 'Fecha',
                    selector: 'Fecha',
                    sortable: true,
                },
                {
                    name: 'ClaveMonedaSat',
                    selector: 'ClaveMonedaSat',
                    sortable: true,
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            var from = props.Fecha.split("/")
                            var f = new Date(from[2], from[1] - 1, from[0])
                            console.log('####', f);
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { NombreMoneda: props.NombreMoneda, TipoCambio: props.TipoCambio, Fecha: f, ClaveMonedaSat: props.ClaveMonedaSat },
                                    Id: props.MonedaSatID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('La moneda se agregó correctamente')

        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('La moneda se actualizó correctamente')



        setState({ ...state, Datos: state.Datos.map(Dato => Dato.MonedaSatID === item.MonedaSatID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' } } })

    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Monedas SAT">
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
                                                        <input type="text" className="form-control" placeholder="Buscar moneda SAT" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
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
                                        keyField={"MonedaSatID"}
                                        defaultSortField={"MonedaSatID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Moneda SAT</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
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
export default connect(mapStateToProps, mapDispatchToProps)(MonedaSat);
