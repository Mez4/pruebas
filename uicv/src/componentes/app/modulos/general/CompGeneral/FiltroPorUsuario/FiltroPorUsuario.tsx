import { useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { useParams } from "react-router-dom"
import { Directores, Grupos, Productos, Sucursales, Zonas, Distribuidores, Clientes, Coordinadores, Promotores } from "../../../../../selectores"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { iUI } from "../../../../../../interfaces/ui/iUI"
import { FaFileExcel, FaFilter } from "react-icons/fa"

import * as Funciones from './Funciones'
import XLSX from 'xlsx'
import { toast } from "react-toastify"
import { ActionSelect, DatePickeEnd, DatePickeStart } from "../../../../../global"
import moment from "moment"
import { permisoExportar } from "../../../../../hooks/ExoportarExcelBtnPermisos"

type FormFiltroPorUsuario = {
    oidc: IOidc,
    ui: iUI,
    onSubmit: (value?: any) => void,
    PrintExcel?: (item?: any) => any,
    initialValues: {
        DirectorID: number,
        ProductoID: number,
        SucursalID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        ClienteID?: number,
        CoordinadorID: number,
        creditoPromotorId: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date,
        GrupoID: number,
        Permiso: boolean,
        tipoDias: string,
        Fecha?: Date | null,
        DiasAtraso?: number
    },
    loading?: boolean,
    EsGlobal?: boolean,
    Es1506?: boolean,
    Es1549?: boolean,
    //Reasignar Prospectos e Interesados
    ReasignarPI?: boolean,
    EsAdmCreditos?: boolean,
    EsNotasRapidas?: boolean,
    PrintExcelObj?: {
        data: any[],
        title: string,
        nameDoc: string
    },
    children?: JSX.Element
}


export default function FiltroPorUsuario(props: FormFiltroPorUsuario) {
    let params = useParams<{ productoId: string }>();
    const [loading, setLoading] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(0);
    // const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [startDate, setStartDate] = useState(moment().startOf('day').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const nombreClase = `column is-12-mobile is-12-tablet is-${!props.EsGlobal ? '4' : '3'}-desktop`;
    const ExpPermisos = permisoExportar(2933);  // 1506, 1625, 191, 221
    
    const GetRolUsuario = () => {
        console.log("Entro a GetRolUsuario");
        setLoading(true);
        Funciones.FNGetTipoUsuario(props.oidc)
            .then((respuesta: any) => {
                console.log("respuesta tipo usuario", respuesta);
                setTipoUsuario(respuesta.tipoUsuario);
                props.initialValues.ProductoID = parseInt(params.productoId);
                console.log("tipo usuario", tipoUsuario)

                switch (respuesta.tipoUsuario) {
                    case 1:
                        props.initialValues.DirectorID = respuesta.UsuarioID;
                        props.initialValues.ZonaID = respuesta.ZonaID;
                        break;
                    case 2:
                        props.initialValues.ZonaID = respuesta.ZonaID;
                        props.initialValues.DirectorID = respuesta.DirectorID;
                        break;
                    case 3:
                        props.initialValues.ZonaID = respuesta.ZonaID;
                        props.initialValues.SucursalID = respuesta.SucursalID;
                        props.initialValues.DirectorID = respuesta.DirectorID;
                        props.initialValues.creditoPromotorId = respuesta.creditoPromotorId;
                        break;
                    case 4:
                        props.initialValues.ZonaID = respuesta.ZonaID;
                        props.initialValues.GrupoID = respuesta.GrupoID;
                        props.initialValues.SucursalID = respuesta.SucursalID;
                        props.initialValues.DirectorID = respuesta.DirectorID;
                        break;
                }
            })
            .catch((error) => console.log("error!", error))
            .finally(() => setLoading(false))
    }

    const GenerarXLSX = (data: any[], title: string, nameDoc: string) => {
        if (data.length == 0) {
            toast.warning("No se encontro informacion para exportar");
            return;
        }
        const XLSX = require('xlsx-js-style');

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "B2" });

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${nameDoc}.xlsx`)
    }

    useEffect(() => {
        GetRolUsuario();
    }, [tipoUsuario])

    return (<Formik
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}>
        {({ values }) => (
            <Form>
                <div style={{ backgroundColor: '#F0F0F0', padding: '1em', borderRadius: '15px' }}>
                    <div>
                        <div style={{ float: 'left', marginRight: 5 }}><FaFilter /></div>
                        <div><label> FILTROS </label></div>
                    </div>
                    <div style={{ width: '100%', textAlign: 'center', display: 'inline-block' }}>
                        <div className="columns is-desktop">
                            <div className={nombreClase}>
                                <Directores oidc={props.oidc} isSingle disabled={loading || tipoUsuario >= 1} name={'DirectorID'} valor={values.DirectorID} />
                            </div>
                            <div className={nombreClase}>
                                {!loading && <Productos oidc={props.oidc} ui={props.ui} isSingle disabled={loading || tipoUsuario > 1} DirectorID={isNaN(values.DirectorID!) ? 0 : values.DirectorID} name={'ProductoID'} valor={values.ProductoID} />}
                            </div>
                            <div className={nombreClase}>
                                {!loading && <Zonas oidc={props.oidc} cargar disabled={loading || tipoUsuario >= 1} DirectorID={isNaN(values.DirectorID!) ? 0 : values.DirectorID} name={'ZonaID'} isProducto />}
                            </div>
                            {props.EsGlobal &&
                                //Filto se muestra cuando es Global
                                <div className={nombreClase}>
                                    <Sucursales disabled={loading || isNaN(values.ProductoID) || values.ProductoID == 0 || tipoUsuario >= 3} ZonaID={isNaN(values.ZonaID!) ? 0 : values.ZonaID} name={'SucursalID'} valor={isNaN(values.SucursalID) ? 0 : values.SucursalID} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} />
                                </div>
                            }
                        </div>
                        <div className="columns is-desktop">
                            {!props.EsGlobal &&
                                //Filtro se muestra cuando es reportes
                                <div className={nombreClase}>
                                    <Sucursales disabled={loading || isNaN(values.ProductoID) || values.ProductoID == 0 || tipoUsuario >= 3} ZonaID={isNaN(values.ZonaID!) ? 0 : values.ZonaID} name={'SucursalID'} valor={isNaN(values.SucursalID) ? 0 : values.SucursalID} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} />
                                </div>
                            }
                            {!props.ReasignarPI &&
                                <div className={nombreClase}>
                                    <Grupos oidc={props.oidc} name={"GrupoID"} GrupoID={isNaN(values.GrupoID) ? 0 : values.GrupoID} disabled={loading || tipoUsuario >= 4} cargar SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} Permiso={false} />
                                </div>
                            }

                            <div className={nombreClase} hidden={!Boolean(props.children)}>
                                {/* Este children es para la fecha o para cualquier campo necesario */}
                                {props.children}
                            </div>
                            {props.EsGlobal &&
                                <>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                        <Distribuidores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} GrupoID={isNaN(values.GrupoID) ? 0 : values.GrupoID} name="DistribuidorID" />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                        <Clientes disabled={loading} DistribuidorID={values.DistribuidorID} name={'ClienteID'} />
                                    </div>
                                    <div className="text-end">
                                        <div className="column is-12-mobile is-12-tablet is-6-desktop" >
                                            {/* <br /> */}
                                            <label className="form-label mb-0 " style={{ paddingInlineStart: 20 }} >Dias Atraso</label>
                                            <br />
                                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                <Field type="radio" className="btn-check" name="tipoDias" id="Dias0" autoComplete="off" value="0" />
                                                <label className="btn btn-outline-primary" htmlFor="Dias0">N/A</label>

                                                <Field type="radio" className="btn-check" name="tipoDias" id="Dias1" autoComplete="off" value="1" />
                                                <label className="btn btn-outline-primary" htmlFor="Dias1">1/45</label>

                                                <Field type="radio" className="btn-check" name="tipoDias" id="Dias2" autoComplete="off" value="2" />
                                                <label className="btn btn-outline-primary" htmlFor="Dias2">46/90</label>

                                                <Field type="radio" className="btn-check" name="tipoDias" id="Dias3" autoComplete="off" value="3" />
                                                <label className="btn btn-outline-primary" htmlFor="Dias3">90+</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {props.EsNotasRapidas &&
                                <div className={nombreClase} >

                                    <DatePickeStart
                                        name={'FechaInicio'}
                                        label={'Fecha Inicio'}
                                        disabled={loading}
                                        placeholder={'Inicio'}
                                        isClearable
                                        startDate={startDate}
                                        endDate={endDate}
                                        setStartDate={setStartDate}
                                    />
                                </div>
                            }
                            {props.Es1549 &&
                                <>
                                    <div className={nombreClase} >
                                        <ActionSelect
                                            addDefault
                                            name="DiasAtraso"
                                            label="Días de atraso menos a:"
                                            valor={values.DiasAtraso}
                                            disabled={loading}
                                            placeholder="Selecciona días de atraso"
                                            options={[
                                                { value: 1, label: "0" },
                                                { value: 2, label: "1" },
                                                { value: 3, label: "2" },
                                                { value: 4, label: "3" },
                                                { value: 5, label: "4" },
                                                { value: 6, label: "5" },
                                                { value: 7, label: "6" },
                                                { value: 8, label: "7" },
                                                { value: 9, label: "8" },
                                                { value: 10, label: "9" },
                                                { value: 11, label: "10" },
                                                { value: 12, label: "11" },
                                                { value: 13, label: "12" },
                                                { value: 14, label: "13" },
                                                { value: 15, label: "14" },
                                                { value: 16, label: "15" },
                                                { value: 17, label: "16" },
                                                { value: 18, label: "17" },
                                                { value: 19, label: "18" },
                                                { value: 20, label: "19" },
                                                { value: 21, label: "20" },
                                                { value: 22, label: "21" },
                                                { value: 23, label: "22" },
                                                { value: 24, label: "23" },
                                                { value: 25, label: "24" },
                                                { value: 26, label: "25" },
                                                { value: 27, label: "26" },
                                                { value: 28, label: "27" },
                                                { value: 29, label: "28" },
                                                { value: 30, label: "29" },
                                                { value: 31, label: "30" },
                                                { value: 32, label: "31" },
                                                { value: 33, label: "32" },
                                                { value: 34, label: "33" },
                                                { value: 35, label: "34" },
                                                { value: 36, label: "35" },
                                                { value: 37, label: "36" },
                                                { value: 38, label: "37" },
                                                { value: 39, label: "38" },
                                                { value: 40, label: "39" },
                                                { value: 41, label: "40" },
                                                { value: 41, label: "41" },
                                                { value: 42, label: "42" },
                                                { value: 43, label: "43" },
                                                { value: 44, label: "44" },
                                                { value: 45, label: "45" },
                                                { value: 46, label: "46" },
                                                { value: 47, label: "47" },
                                                { value: 48, label: "48" },
                                                { value: 49, label: "49" },
                                                { value: 50, label: "50" },
                                                { value: 51, label: "51" },
                                                { value: 52, label: "52" },
                                                { value: 53, label: "53" },
                                                { value: 54, label: "54" },
                                                { value: 55, label: "55" },
                                                { value: 56, label: "56" },
                                                { value: 57, label: "57" },
                                                { value: 58, label: "58" },
                                                { value: 59, label: "59" },
                                                { value: 60, label: "60" },
                                                { value: 61, label: "61" },
                                                { value: 62, label: "62" },
                                                { value: 63, label: "63" },
                                                { value: 64, label: "64" },
                                                { value: 65, label: "65" },
                                                { value: 66, label: "66" },
                                                { value: 67, label: "67" },
                                                { value: 68, label: "68" },
                                                { value: 69, label: "69" },
                                                { value: 70, label: "70" },
                                                { value: 71, label: "71" },
                                                { value: 72, label: "72" },
                                                { value: 73, label: "73" },
                                                { value: 74, label: "74" },
                                                { value: 75, label: "75" },
                                                { value: 76, label: "76" },
                                                { value: 77, label: "77" },
                                                { value: 78, label: "78" },
                                                { value: 79, label: "79" },
                                                { value: 80, label: "80" },
                                                { value: 81, label: "81" },
                                                { value: 82, label: "82" },
                                                { value: 83, label: "83" },
                                                { value: 84, label: "84" },
                                                { value: 85, label: "85" },
                                                { value: 86, label: "86" },
                                                { value: 87, label: "87" },
                                                { value: 88, label: "88" },
                                                { value: 89, label: "89" },
                                                { value: 90, label: "90" },
                                                { value: 91, label: "91" },
                                                { value: 93, label: "92" },
                                                { value: 94, label: "93" },
                                                { value: 95, label: "94" },
                                                { value: 96, label: "95" },
                                                { value: 97, label: "96" },
                                                { value: 98, label: "97" },
                                                { value: 99, label: "98" },
                                                { value: 100, label: "99" },
                                                { value: 101, label: "100" },
                                            ]}
                                        />
                                    </div>
                                </>
                            }
                            {props.EsAdmCreditos &&
                                <>
                                    <div className={nombreClase}>
                                        <Coordinadores disabled={loading || isNaN(values.SucursalID)} valor={isNaN(values.CoordinadorID) ? 0 : values.CoordinadorID} name="CoordinadorID" SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} />
                                    </div>
                                </>
                            }

                            {props.ReasignarPI &&
                                <>
                                    <div className={nombreClase}>
                                        <Promotores
                                            disabled={loading || isNaN(values.SucursalID)}
                                            valor={isNaN(values.ProductoID) ? 0 : values.creditoPromotorId}
                                            name="creditoPromotorId"
                                            SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} />
                                    </div>
                                </>
                            }
                            {props.Es1506 &&
                                <>

                                    <div className={nombreClase}>
                                        <Coordinadores disabled={loading || isNaN(values.SucursalID)} valor={isNaN(values.CoordinadorID) ? 0 : values.CoordinadorID} name="CoordinadorID" SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} />
                                        <DatePickeStart
                                            name={'Fecha'}
                                            label={'Fecha'}
                                            disabled={loading}
                                            placeholder={'Fecha del reporte'}
                                            isClearable
                                            startDate={startDate}
                                            endDate={endDate}
                                            setStartDate={setStartDate}
                                        />
                                    </div>
                                </>

                            }
                        </div>
                        <div className="columns is-desktop">

                            {props.EsNotasRapidas &&
                                <>

                                    <div className={nombreClase}>
                                        {/*<div style={{ height: '67px', width: '300px', marginLeft: '20px'}} >*/}
                                        <DatePickeEnd
                                            name={'FechaFin'}
                                            label={'Fecha Fin'}
                                            disabled={loading}
                                            placeholder={'Fin'}
                                            isClearable startDate={startDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />
                                    </div>

                                </>

                            }
                            {props.Es1506 &&
                                <>
                                    <div className={nombreClase}>
                                        {/* <br /> */}
                                        <label className="form-label mb-0 " style={{ paddingInlineStart: 20 }} >Días Atraso</label>
                                        <br />
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias0" autoComplete="off" value="0" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias0">N/A</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias1" autoComplete="off" value="1" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias1">1/45</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias2" autoComplete="off" value="2" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias2">46/90</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias3" autoComplete="off" value="3" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias3">90+</label>
                                        </div>
                                    </div>
                                </>

                            }
                        </div>
                        <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                            <button disabled={props.loading && tipoUsuario < 0} className="btn btn-primary btn-lg" type="submit">Buscar</button>

                            {!props.EsAdmCreditos && !props.ReasignarPI && <button disabled={!ExpPermisos} type="button" className="btn btn-success btn-lg waves-effect waves-light mx-2"
                                style={{ padding: 8, textAlign: "center", paddingInline: 15 }}
                                onClick={() => {
                                    if (props.PrintExcel) {
                                        props.PrintExcel(values);
                                        return;
                                    }
                                    GenerarXLSX(
                                        props.PrintExcelObj ? props.PrintExcelObj.data : [],
                                        props.PrintExcelObj ? props.PrintExcelObj.title : "",
                                        props.PrintExcelObj ? props.PrintExcelObj.nameDoc : "Doc"
                                    );
                                }}>
                                Exportar&nbsp;<FaFileExcel size="20px" style={{ marginTop: -2 }} />
                            </button>}
                        </div>
                    </div>
                </div>
            </Form>
        )}
    </Formik>
    )
}
