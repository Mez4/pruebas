import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './DetalleArchivoDispersion/Funciones'
import { toast } from 'react-toastify'
import { date, string } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'
import { CSVLink, CSVDownload } from "../../../../../../src/node_modules_local/react-csv";
// Icons
import { FaPencilAlt, FaFileExcel, FaPlus, FaSearch, FaCircle, FaTrash, FaEye, FaPrint } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './DetalleArchivoDispersion/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CFormDetalleDispersion } from './DetalleArchivoDispersion/CFormDetalleDispersion'
import moment from 'moment'
import { CFormCargarArchivo } from './DetalleArchivoDispersion/CFormCargarArchivo'

import * as XLSX from 'xlsx'
import { CFormReasignar } from './DetalleArchivoDispersion/CFormReasignar'

type CatalogosType = {
    Seguridad: IOidc
}

const DetalleArchivoDispersion = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)

    let isMounted = React.useRef(true)
    const DatosDefecto = {
        archivoDispersionID: 0,
        catConciliacionID: 0,
        estatusArchivoID: 0

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsConciliacion: any[] = []
    const OptionsArchivo: any[] = []
    const CuentasCSV: any[] = []



    const [state, setState] = React.useState({
        Habilitar: true,
        CuentasCSV,
        Datos,
        DatosMostrar,
        estatus1: true,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },

        OptionsConciliacion,
        OptionsArchivo,
    })
    const cargarArchivo = (tipo?: string) => {
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <div className={`modal-body`}>
                        <CFormCargarArchivo
                            cbActualizar={cbActualizarCompleto}
                            oidc={props.Seguridad}
                            tipo={tipo} />
                    </div>
                </div>,
                confirmButtonText: `Ok`,
                showConfirmButton: false,
                allowOutsideClick: false,
                showCloseButton: true
            }
        );
    }

    const handleUpload = (e) => {
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            if (e.target) {
                var data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const cols = make_cols(ws['!ref'])
                let tabla: any[] = []
                console.log("DATE PARSE ,", dataParse)
                let Valor = dataParse[0]
                var StringVal = dataParse[0] + ""
                console.log("VALIDACION ,", StringVal)
                if (StringVal == 'Estado de Órdenes Enviadas' || StringVal == 'Consulta de Órdenes Enviadas') {
                    dataParse.forEach(item => {
                        tabla.push(convert(item))
                    });
                    tabla.splice(0, 2);
                    setState(s => ({ ...s, CuentasCSV: tabla }))
                    console.log("FINAL CONC. ,", tabla)
                } else {
                    setState(s => ({ ...s, CuentasCSV: [] }))
                    MySwal.fire(
                        {
                            icon: 'error',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Archivo no corresponde a formato STP.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Ok`,
                            showConfirmButton: true
                        }
                    );
                }
            }

        };
        reader.readAsBinaryString(f)
    }
    const convert = (arr: any) => {
        let tabla: any[] = []
        var obj = {};
        for (var i = 0; i < arr.length; ++i) {
            obj[i] = arr[i];
        }
        let detalle: any = {
            clave_rastreo: obj[5],
            estado: obj[12],
            cuenta: obj[14],
            causa_dev: obj[13]
        }
        return detalle;
    }

    const make_cols = refstr => {
        type Tipos = { name: string, key: number };    // Specified format
        var o = new Array<Tipos>();
        var range = XLSX.utils.decode_range(refstr);
        for (var i = 0; i <= range.e.c; ++i) {
            o.push({ name: XLSX.utils.encode_col(i), key: i });
        }
        return o;
    };




    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {


                    console.log("RESP", respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Datos: respuesta }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FNGetDevueltas = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGetDevueltas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESP ,", respuesta)

                    //       setState(s => ({ ...s, Datos: respuesta }))

                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    console.log("RESP ,", error)

                    //setState(s => ({ ...s, Datos: [] }))
                }
            })
    }



    const headers = [
        { label: "INSTITUCION_CONTRAPARTE", key: "Institucion_Contraparte" },
        { label: "CLAVE_RASTREO", key: "Clave_Rastreo" },
        { label: "NOMBRE_BENEFICIARIO", key: "Nombre_Beneficiario" },
        { label: "RFC_CURP_BENEFICIARIO", key: "Rfc_Curp_Beneficiario" },
        { label: "TIPO_PAGO", key: "Tipo_Pago" },
        { label: "TIPO_CUENTA_BENEFICIARIO", key: "Tipo_Cuenta_Beneficiario" },
        { label: "MONTO", key: "Monto" },
        { label: "CUENTA_BENEFICIARIO", key: "Cuenta_Beneficiario" },
        { label: "CONCEPTO_PAGO", key: "Concepto_Pago" },
        { label: "REFERENCIA_NUMERICA", key: "Referencia_Numerica" },
        { label: "EMAIL_BENEFICIARIO", key: "Referencia_Numerica" },
        { label: "INSTITUCION_OPERANTE", key: "Institucion_Operante" },
        { label: "EMPRESA", key: "Empresa" },
    ];

    const ClickA = () => {
        var element = document.getElementById('GenerarCSV');
        if (element != null) {
            element?.click();

        }
    }

    const cbActualizarCompleto = (item: any) => {
        console.log("ITEM RECIBIDO .", item)
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.ArchivoDispersionID === item.dispersionID ?
                { ...Dato, EstatusArchivoID: 2 } : Dato)
        }
        ))
    }

    const reImprimirArchivo = (DispersionID) => {

        let timerInterval
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Reimprimiendo CSV.</h5>
                    </div>
                </div>,
                confirmButtonText: `Ok`,
                didOpen: () => {
                    MySwal.showLoading()
                },
            }
        );
        Funciones.FNActulizarReimpresion(props.Seguridad, DispersionID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    FNGetLocal()
                    MySwal.fire({
                        icon: 'success',
                        html: <div><br />
                            <h3 className="text-center">Éxito</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Archivo de dispersión generado con éxito</h5>
                            </div>
                            <div className={'modal-footer text-center'} style={{ display: 'block !important' }}>
                                <div className="row text-center">
                                    <div className="col-12">
                                        <button type="button" className="ms-2 btn btn-success waves-effect waves-light"
                                            onClick={() => {
                                                ClickA()
                                            }}
                                        ><FaFileExcel size="20px" />
                                            <CSVLink data={respuesta} headers={headers} filename={'' + moment(new Date).format('DD-MM-YYYY_hh_mm_ss') + '.csv'}
                                            />
                                            Descargar CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        showCloseButton: true,
                    })
                }
            }).catch((error: any) => {
                if (isMounted.current === true) {

                }
            })
    }



    const verDispersionesDev = () => {
        const MySwal = withReactContent(Swal)

        let timerInterval
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Obteniendo detalle.</h5>
                    </div>
                </div>,
                //timerProgressBar: true,
                confirmButtonText: `Ok`,
                //timer: 500,
                didOpen: () => {
                    MySwal.showLoading()
                },
            }
        );
        Funciones.FNGetDevueltas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    MySwal.fire({
                        allowOutsideClick: false,
                        width: '75%',
                        showCloseButton: true,
                        html:
                            <CFormReasignar
                                DatosSaldos={respuesta}
                                Seguridad={props.Seguridad}
                            ></CFormReasignar>,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))
                }
            })
    }

    const verDispersiones = (DispersionID) => {
        const MySwal = withReactContent(Swal)

        let timerInterval
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Obteniendo detalle.</h5>
                    </div>
                </div>,
                //timerProgressBar: true,
                confirmButtonText: `Ok`,
                //timer: 500,
                didOpen: () => {
                    MySwal.showLoading()
                },
            }
        );
        Funciones.FNGetDetalle(props.Seguridad, DispersionID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    MySwal.fire({
                        allowOutsideClick: false,
                        width: '75%',
                        showCloseButton: true,
                        html:
                            <CFormDetalleDispersion
                                DatosSaldos={respuesta}
                            ></CFormDetalleDispersion>,
                        showCancelButton: false,
                        showConfirmButton: false,
                    })
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))
                }
            })
    }

    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'ArchivoDispersionID', sortable: true, center: true },
            {
                name: 'Fecha Registro',
                selector: 'Fecha',
                sortable: true,
                center: true,
                cell: (props) => <span>{moment(props.Fecha).format('DD-MM-YYYY hh:mm:ss')}</span>

            },
            {
                name: 'Estatus',
                selector: 'EstatusArchivoID',
                sortable: true,
                center: true,
                cell: (props) => <span>{props.EstatusArchivoID === 1 ? <FaCircle color="orange" title="Pendiente" /> : <FaCircle color="green" title="Aplicado" />}</span>
            },
            {
                name: 'ReImpreso',
                selector: 'Impresa',
                sortable: true,
                center: true,
                cell: (props) => <span>{props.Impresa === 1 ? <span>No</span> : <span>Si : {props.Impresa - 1} veces</span>}</span>
            },
            {
                name: 'Acciones', sortable: false, center: true,
                cell: (props) =>
                    <div>
                        <button className="asstext" type={"button"} onClick={() => {
                            verDispersiones(props.ArchivoDispersionID)
                        }} >
                            <FaEye />
                        </button>
                        {props.EstatusArchivoID == 1 && <><button className="asstext ms-2" type={"button"} onClick={() => {
                            reImprimirArchivo(props.ArchivoDispersionID)
                        }} >
                            <FaPrint />
                        </button> </>}
                    </div>

            }
        ]


    React.useEffect(() => {
        FNGetLocal()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const consultarDispersionesDevueltas = (item: any) => {




    }

    const cbActualizar = (item: any) => {
        toast.success('El estatus se actualizo correctamente')
        FNGetDatos()
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.archivoDispersionID === item.archivoDispersionID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    archivoDispersionID: 0,
                    catConciliacionID: 0,
                    estatusArchivoID: 0
                }
            }
        }
        ))


    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Estatus archivos de dispersión">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent={
                                            <div className="columns is-mobile is-multiline">
                                                <div className="column text-center is-one-fifth-desktop is-full-mobile is-one-fifth-tablet">
                                                    <button style={{ whiteSpace: 'nowrap' }} className="btn btn-secondary waves-effect waves-light" disabled={state.Datos.length > 0 ? false : true}
                                                        onClick={() => {
                                                            verDispersionesDev()
                                                        }}>
                                                        Disp. Devueltas
                                                    </button>
                                                </div>
                                                <div className="column text-center is-one-fifth-desktop is-half-mobile is-one-fifth-tablet">
                                                    <button style={{ whiteSpace: 'nowrap' }} className=" btn btn-success waves-effect waves-light" disabled={state.Datos.length > 0 ? false : true} onClick={() => {
                                                        cargarArchivo('ODP')
                                                    }}>
                                                        Subir xls ODP
                                                    </button>

                                                </div>
                                                <div className="column text-center is-one-fifth-desktop is-half-mobile is-one-fifth-tablet">
                                                    <button style={{ whiteSpace: 'nowrap' }} className="btn btn-primary waves-effect waves-light" disabled={state.Datos.length > 0 ? false : true} onClick={() => {
                                                        cargarArchivo('SPEI')
                                                    }}>
                                                        Subir csv SPEI
                                                    </button>
                                                </div>

                                                <div className="column text-center is-two-fifth-desktop is-full-mobile is-two-fifth-tablet">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Detalle" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
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
                                        keyField={"estatusArchivoID"}
                                        defaultSortField={"estatusArchivoID"}
                                        columns={Columns}
                                    />

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
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(DetalleArchivoDispersion)