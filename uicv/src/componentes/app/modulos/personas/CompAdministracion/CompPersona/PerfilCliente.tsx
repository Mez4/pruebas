import React from 'react'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldDatePicker2, ModalWin, Spinner } from '../../../../../global'
import { FiAlertTriangle } from 'react-icons/fi'
import moment from 'moment'
import { FaLink } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { BiSearch } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import { EstatusCredito } from '../../../../../selectores'
import { FormateoDinero } from '../../../../../../global/variables'


type ListadoCreditosTipo = {
    ClienteID: string | null,
    oidc: IOidc
}
const PerfilCliente = (props: ListadoCreditosTipo) => {

    // Monitoreamos el estado del componente
    const isMounted = React.useRef(true)

    // Definimos el estado por defecto
    const Datos: any = undefined
    const MensajeError: string | undefined = undefined
    const [Estado, DefinirEstado] = React.useState({
        Datos,
        Cargando: false,
        Error: false,
        MensajeError,

        // Detalle de la forma
        Forma_Mostrar: false,
        FechaInicio: moment().add(-365, 'd').toDate(),
        FechaFin: moment().toDate()
    })

    const FNGetLocal = async (values: any) => {
        if (props.ClienteID !== null) {
            DefinirEstado(e => ({ ...e, Cargando: true, Datos: [], Error: false, Forma_Mostrar: false, FechaInicio: values.FechaInicio, FechaFin: values.FechaFin }))
            Funciones.FNObtenerCreditosActivos(props.oidc, values)
                .then((respuesta: any) => {
                    if (isMounted)
                        DefinirEstado(e => ({ ...e, Datos: respuesta, Error: false, Cargando: false, MensajeError: undefined }))
                })
                .catch((error: any) => {
                    if (isMounted)
                        DefinirEstado(e => ({ ...e, Datos: [], Error: true, Cargando: false, MensajeError: error }))
                })
        }
    }

    // Al momento de carga, obtenemos los ultimos creditos
    /* eslint-disable */
    React.useEffect(() => { FNGetLocal({ ClienteID: props.ClienteID, Recientes: true, FechaInicio: Estado.FechaInicio, FechaFin: Estado.FechaFin }) }, [])
    /* eslint-enable */

    // Rendereamos el componente
    return (
        <div>
            {Estado.Cargando &&
                <div className='text-center'>
                    <Spinner />
                    <strong>Obteniendo creditos</strong>
                </div>
            }
            {Estado.Error &&
                <div className='text-center'>
                    <FiAlertTriangle size={25} />
                    <p><strong>{Estado.MensajeError ?? 'No es un cliente'}</strong></p>
                </div>
            }
            {props.ClienteID === null &&
                <div className='text-center'>
                    <FiAlertTriangle size={25} />
                    <p><strong>No ha solicitado un crédito</strong></p>
                </div>
            }
            {
                !Estado.Error && !Estado.Cargando && Estado.Datos !== undefined &&
                <div>
                    <p className={'mt-0 mb-1'}><strong>#.Cliente:</strong>&nbsp;{Estado.Datos.Cliente.ClienteID}</p>
                    <p className={'mt-0 mb-1'}><strong>Linea de credito:</strong>&nbsp;{Estado.Datos.Cliente.LineaCreditoPersonal}</p>
                    <p className={'mt-0 mb-1'}><strong>Pagare - Cantidad:</strong>&nbsp;{FormateoDinero.format(Estado.Datos.Cliente.PagareCantidad)}</p>
                    <p className={'mt-0 mb-1'}><strong>Pagare - Estatus:</strong>&nbsp;{Estado.Datos.Cliente.pagareEstatusDesc}</p>

                    <div className='mt-3 mb-0 text-center'>
                        <strong>HISTORIAL CREDITOS</strong>
                        <p className={'mt-0 mb-0'}>{moment(Estado.FechaInicio).format('DD-MM-YYYY')} - {moment(Estado.FechaFin).format('DD-MM-YYYY')}</p>
                        <div>
                            <button onClick={() => DefinirEstado(e => ({ ...e, Forma_Mostrar: true }))} className={'btn btn-link waves-effect mt-0 mb-3'}><BsSearch size={18} /></button>
                        </div>
                    </div>
                    <table className="table table-sm m-0 mt-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Capital</th>
                                <th>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Estado.Datos.Creditos.map((c: any, cId: number) =>
                                    <tr key={'crd_' + cId}>
                                        <td><button type="button" className="btn btn-link waves-effect">{moment(c.FechaHoraRegistro).format('DD-MM-YYYY')}&nbsp;<FaLink /></button></td>
                                        <td><p style={{ padding: '3px' }}>{c.Capital}</p></td>
                                        <td><p style={{ padding: '3px' }}>{c.EstatusNombre}</p></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <ModalWin open={Estado.Forma_Mostrar}>
                        <ModalWin.Header>
                            <strong>Consultar creditos</strong>
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <Formik
                                initialValues={{ Estatus: '', FechaInicio: Estado.FechaInicio, FechaFin: Estado.FechaFin }}
                                validationSchema={Yup.object().shape({
                                    FechaInicio: Yup.string().required("Fecha de inicio obligatoria"),
                                    FechaFin: Yup.string().required("Fecha de inicio obligatoria")
                                })}
                                onSubmit={(values) => {
                                    FNGetLocal({ ...values, PersonaID: props.ClienteID })
                                }}
                            >
                                <Form>
                                    <EstatusCredito disabled={Estado.Cargando} name={'EstatusID'} />
                                    <CustomFieldDatePicker2 disabled={Estado.Cargando} name={"FechaInicio"} label='Fecha Inicio' />
                                    <CustomFieldDatePicker2 disabled={Estado.Cargando} name={"FechaFin"} label='Fecha Fin' />
                                    <hr />
                                    <div className='text-end'>
                                        <button type={'button'} onClick={() => DefinirEstado(e => ({ ...e, Forma_Mostrar: false }))} className='btn btn-danger text-white fw-bold text-end me-1'><IoMdClose size={20} /> Cancelar</button>
                                        <button type={'submit'} className='btn btn-confia text-white fw-bold text-end'><BiSearch size={20} /> Consultar</button>
                                    </div>
                                </Form>
                            </Formik>
                        </ModalWin.Body>
                    </ModalWin>
                </div>
            }
        </div>
    )
}
export default PerfilCliente