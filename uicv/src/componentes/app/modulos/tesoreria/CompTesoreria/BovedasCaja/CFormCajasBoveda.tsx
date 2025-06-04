import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, Card, ModalWin } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DatePicker, { registerLocale } from "react-datepicker"
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FaCheckCircle, FaExclamationCircle, FaPencilAlt, FaSearch, FaTimesCircle } from 'react-icons/fa'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CForm } from './CForm'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

type CFormType = {
    oidc: IOidc
    Id?: number,
    //initialValues: { NombreMoneda: string, TipoCambio: number, Fecha?: Date, ClaveMonedaSat: string },
    //cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(op: any): any
    DatosModal?: any,
    CargandoModal: boolean,
    ErrorModal: boolean
    mostrarModal(op: any, id: any): any
    mostrar: boolean,
    OpcionesMovimientos: { value: number, label: string }[],
    FNGetSaldos(op: any): any
    DatosSaldoBoveda: {}
    FNGetMovimientosModal2(id: any, fecha: any): any
    DatosModalMovimientos: any[]

}

export const CFormCajasBoveda = (props: CFormType) => {
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
            MostrarModal2: false,
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })
    // Loading
    const [loading, setLoading] = React.useState(false)

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(props.DatosModal, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [props.DatosModal, state.Filtro])

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Bóveda',
                    selector: 'boveda',
                    sortable: true,

                },
                {
                    name: 'Caja',
                    selector: 'caja',
                    sortable: true,

                },
                {
                    name: 'Billete',
                    selector: 'billete',
                    sortable: true,
                },
                {
                    name: 'Moneda',
                    selector: 'moneda',
                    sortable: true,
                },
                {
                    name: 'Total',
                    selector: 'total',
                    sortable: true,
                },
                {
                    name: 'Estado',
                    selector: 'estado',
                    sortable: true,
                    cell: (props) => <span title="Texto flotante">{props.estado === "Buena" ? <FaCheckCircle size="20px" color="green" title="Buena" /> : props.estado === "Regular" ? <FaExclamationCircle size="20px" color="#FFAE00" title="Regular" /> : <FaTimesCircle size="20px" color="red" title="Mala" />}</span>

                },
                {
                    name: 'Porcentaje',
                    selector: 'porcentaje',
                    sortable: true,
                },
                {
                    name: 'Fecha',
                    selector: 'fecha',
                    sortable: true,
                    wrap: true,
                    format: (r) => r.fecha && new Date(r.fecha).toLocaleDateString()
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    cell: (propss) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            console.log(propss)
                            props.mostrarModal(2, propss.bovedaId)
                            props.FNGetSaldos(propss.cajaId)
                            let fecha = new Date();
                            let mesString;
                            let diaString;

                            let mesInicio = fecha.getMonth() + 1
                            if (mesInicio < 10)
                                mesString = '0' + mesInicio

                            let diaInicial = fecha.getDate()
                            if (diaInicial < 10)
                                diaString = '0' + diaInicial

                            let fechaInicial = diaString + "-" + mesString + "-" + fecha.getFullYear()

                            props.FNGetMovimientosModal2(propss.cajaId, fechaInicial)

                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [state.Form])

    React.useEffect(() => {
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // Return the component
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Cajas/Bóvedas">
                    <Card.Body>
                        <Card.Body.Content>
                            {props.CargandoModal && <Spinner />}
                            {props.ErrorModal && <span>Error al cargar los datos...</span>}
                            {!props.CargandoModal && !props.ErrorModal &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Cajas/Bóvedas" value={state.Filtro} onChange={e => { setState(s => ({ ...s, Filtro: e.target.value })) }} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => { }}><FiRefreshCcw /></button>
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
                                        keyField={"bovedaId"}
                                        defaultSortField={"bovedaId"}
                                        columns={Columns}

                                    />
                                    <br></br>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => { props.fnCancelar(1) }}>
                                            Cerrar
                                        </button>
                                    </div>
                                    <ModalWin large={true} open={props.mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Movimiento de Boveda</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                //cbActualizar={props.cbActualizar}
                                                cbGuardar={props.cbGuardar}
                                                fnCancelar={props.fnCancelar}
                                                OpcionesMovimientos={props.OpcionesMovimientos}
                                                DatosSaldoBoveda={props.DatosSaldoBoveda}
                                                DatosModalMovimientos={props.DatosModalMovimientos}
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