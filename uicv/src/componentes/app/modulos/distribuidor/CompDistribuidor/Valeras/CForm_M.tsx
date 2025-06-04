import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  ActionMultipleSelect,
  ActionSelect,
} from "../../../../../global";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import { FaBarcode, FaFilter, FaExclamationCircle } from "react-icons/fa";
type CFormType = {
  oidc: IOidc;
  datos: any[];
  Valeras: number[];
  evento: string;
  columns: IDataTableColumn<any>[];
  optProductos: { value: number; label: string }[];
  optSeries: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optCodigosB: { value: number; label: string }[];
  initialValues: {
    ProductoID: number;
    DistribuidorID: number;
    serieId: string;
    FolioInicial: number;
    FolioFinal: number;
    Estatus: string;
    RegistroFecha?: Date;
    RegistroUsuarioId: string;
    AsignaSucursalId: number;
    AsignaSucursalUsuarioId: string;
    ReciboSucursalUsuarioId: string;
    AsignaDistribudiorUsuarioId: string;
    CanceladoUsuarioId: string;
    ValeraTrackingEstatusID: number;
    EnvioSucursalNota: string;
    ReciboSucursalNota: string;
  };
  cbGuardar(item: any): any;
  FnGetSeries(id: any): any;
  fnCancelar(): any;
  selectValeras(row: any): void;
  selectValerasMultiple(valeraId: any): void;
  filtrandoM(
    ProductId: number,
    serieId: number,
    SucursalId: number,
    FolioI: number,
    FolioF: number,
    CodigoB: string,
    Tracking: number[],
    selc: boolean
  ): void;
  cbActualizarM(Valeras: number[], values: any, tracking: number): any;
};

export const CFormM = (props: CFormType) => {
  // Loading
  const [loading, setLoading] = React.useState(false);
  const [isMounted, setisMounted] = React.useState(false);
  const [showDataTable, setshowDataTable] = React.useState(true);
  const [Page, setPage] = React.useState(1);
  const [Pagination, setPagination] = React.useState(5);

  const [FiltroProd, setFiltroProd] = React.useState(0);
  const [FiltroSeri, setFiltroSeri] = React.useState(0);
  const [FiltroSucu, setFiltroSucu] = React.useState(0);
  const [FiltroFolI, setFiltroFolI] = React.useState(0);
  const [FiltroFolF, setFiltroFolF] = React.useState(0);
  const [FiltroCodB, setFiltroCodB] = React.useState("");
  const [FiltroSelc, setFiltroSelc] = React.useState(false);

  const [ValerasX, setValerasX] = React.useState([] as number[]);

  useEffect(() => {
    setValerasX(props.Valeras);
  }, [props.Valeras]);

  useEffect(() => {
    console.log("showDataTable");
    if (showDataTable && ValerasX.length <= 0) setFiltroSelc(false);
  }, [showDataTable]);

  useEffect(() => {
    setshowDataTable(props.evento === "" ? false : true);
    setFiltroProd(0);
    setFiltroSeri(0);
    setFiltroSucu(0);
    setFiltroFolI(0);
    setFiltroFolF(0);
    setFiltroCodB("");
    setFiltroSelc(false);
  }, [props.evento]);

  useEffect(() => {
    filtrando();
  }, [
    FiltroProd,
    FiltroSeri,
    FiltroSucu,
    FiltroFolI,
    FiltroFolF,
    FiltroCodB,
    FiltroSelc,
  ]);

  const getProducto = (ProductID: number) => {
    setFiltroProd(ProductID);
    if (ProductID === 0) setFiltroSeri(0);
    props.FnGetSeries(ProductID);
  };

  const getSerie = (serieId: number) => {
    setFiltroSeri(serieId);
  };

  const getSucurasl = (sucursalId: number) => {
    setFiltroSucu(sucursalId);
  };

  const getFolioI = (folioI: string) => {
    let folio = folioI ? parseInt(folioI) : 0;
    setFiltroFolI(folio);
  };

  const getFolioF = (folioF: string) => {
    let folio = folioF ? parseInt(folioF) : 0;
    setFiltroFolF(folio);
  };

  const getCodigoB = (codigoB: string) => {
    setFiltroCodB(codigoB);
  };

  const getSelc = (selc: boolean) => {
    console.log(selc);
    setFiltroSelc(selc);
  };

  const filtrando = () => {
    props.filtrandoM(
      FiltroProd,
      FiltroSeri,
      FiltroSucu,
      FiltroFolI,
      FiltroFolF,
      FiltroCodB,
      props.evento === "ASIGNAR"
        ? [3]
        : props.evento === "ENVIAR"
        ? [4]
        : props.evento === "REASIGNAR"
        ? [4, 6]
        : props.evento === "RECIBIR" || "REENVIAR"
        ? [5]
        : [11],
      FiltroSelc
    );
  };

  const selectByCheck = (row: any) => {
    let valerasSelected = row.selectedRows.map((valor: any) => {
      return valor.ValeraID;
    });

    let valerasMostrar = props.datos.map((valor: any) => {
      return valor.ValeraID;
    });

    ValerasX.forEach((e) => {
      if (!valerasMostrar.includes(e)) valerasSelected.push(e);
    });

    props.selectValerasMultiple(valerasSelected);
  };

  const selectByCode = async (value: any) => {
    setshowDataTable(false);
    setFiltroSelc(false);
    setValerasX(value);
    props.selectValerasMultiple(value);
    setTimeout(() => {
      setFiltroSelc(true);
      setshowDataTable(true);
    }, 100);
  };

  const onKeyDown = (keyEvent: any) => {
    console.log(keyEvent);
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const refSucursal = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // return () => {
    setisMounted(true);
    // }
  }, []);

  let validationShape = {
    AsignaSucursalId: Yup.number(),
    EnvioSucursalNota: Yup.string(),
    ReciboSucursalNota: Yup.string(),
  };

  if (["ASIGNAR", "REASIGNAR", "REENVIAR"].includes(props.evento))
    validationShape.AsignaSucursalId = Yup.number()
      .required("Campo Obligatorio")
      .moreThan(0, "Seleccione la Sucursal a la que se asignaran las valeras");

  if (["ENVIAR", "REENVIAR"].includes(props.evento))
    validationShape.EnvioSucursalNota = Yup.string().required(
      "Campo obligatorio (numero guia, paqueteria, fechas, etc.)"
    );

  if (props.evento === "RECIBIR")
    validationShape.ReciboSucursalNota = Yup.string().required(
      "Campo obligatorio (ej. Se recibieron las valeras correctamente. y/o agregar observaciones)"
    );
  // Return the component
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape(validationShape)}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);
        if (ValerasX.length > 0) {
          setFiltroProd(0);
          setFiltroSeri(0);
          setFiltroSucu(0);
          setFiltroFolI(0);
          setFiltroFolF(0);
          setFiltroCodB("");
          if (props.evento === "ASIGNAR") {
            Funciones.FNUpdateSucursalM(props.oidc, {
              ...values,
              Valeras: ValerasX,
            })
              .then(async (respuesta: any) => {
                toast.success(
                  "Se asignaron las Valeras Correctamente a la Sucursal"
                );
                await timeout(1000);
                toast.info(
                  "Generando Documento de asignación de valeras. Esto puede demorar un par de minutos por favor espere",
                  { autoClose: 60000 }
                );
                props.cbActualizarM(ValerasX, values, 4);
                Funciones.FNGetFileM(props.oidc, {
                  ...values,
                  Valeras: ValerasX,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);

                    enlaceTemporal.click();

                    setTimeout(() => {
                      // Imprimir el documento
                      // window.print();
                    }, 1000);
                    setLoading(false);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error(
                  "Error al asignar las Valeras, por favor revisa los datos seleccionados."
                );
              });
          } else if (props.evento === "REASIGNAR") {
            Funciones.FNREUpdateSucursalM(props.oidc, {
              ...values,
              Valeras: ValerasX,
            })
              .then(async (respuesta: any) => {
                toast.success(
                  "Se ReAsignaron las Valeras Correctamente a la Sucursal"
                );
                await timeout(1000);
                toast.info(
                  "Generando Documento de Reasignación de valeras. Esto puede demorar un par de minutos por favor espere",
                  { autoClose: 60000 }
                );
                props.cbActualizarM(ValerasX, values, 4);
                Funciones.FNGetFileM(props.oidc, {
                  ...values,
                  Valeras: ValerasX,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);

                    enlaceTemporal.click();

                    setTimeout(() => {
                      // Imprimir el documento
                      // window.print();
                    }, 1000);

                    setLoading(false);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error(
                  "Error al reasignar las Valeras, por favor revisa los datos seleccionados."
                );
              });
          } else if (props.evento === "ENVIAR") {
            Funciones.FNUpdateEnvioM(props.oidc, {
              ...values,
              Valeras: ValerasX,
            })
              .then(async (respuesta: any) => {
                toast.success(
                  "Se capturo el envío de las Valeras Correctamente"
                );
                await timeout(1000);
                toast.info(
                  "Generando Documento de Envío de valeras. Esto puede demorar un par de minutos por favor espere",
                  { autoClose: 60000 }
                );
                props.cbActualizarM(ValerasX, values, 5);
                Funciones.FNGetFileM(props.oidc, {
                  ...values,
                  Valeras: ValerasX,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);

                    enlaceTemporal.click();

                    setTimeout(() => {
                      // Imprimir el documento
                      // window.print();
                    }, 1000);

                    setLoading(false);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error(
                  "Error al captura el envío de las Valeras, por favor revisa los datos seleccionados."
                );
              });
          } else if (props.evento === "RECIBIR") {
            Funciones.FNUpdateReciboM(props.oidc, {
              ...values,
              Valeras: ValerasX,
            })
              .then(async (respuesta: any) => {
                toast.success(
                  "Se confirmo que las Valeras se recibieron Correctamente"
                );
                await timeout(1000);
                toast.info(
                  "Generando Documento de Recepción de valeras. Esto puede demorar un par de minutos por favor espere",
                  { autoClose: 60000 }
                );
                props.cbActualizarM(ValerasX, values, 6);
                Funciones.FNGetFileM(props.oidc, {
                  ...values,
                  Valeras: ValerasX,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);

                    enlaceTemporal.click();

                    setTimeout(() => {
                      // Imprimir el documento
                      // window.print();
                    }, 1000);

                    setLoading(false);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error(
                  "Error al recibir las Valeras, por favor revisa los datos seleccionados."
                );
              });
          } else if (props.evento === "REENVIAR") {
            Funciones.FNUpdateREEnvioM(props.oidc, {
              ...values,
              Valeras: ValerasX,
            })
              .then(async (respuesta: any) => {
                toast.success(
                  "Se capturo el Reenvío de las Valeras Correctamente"
                );
                await timeout(1000);
                toast.info(
                  "Generando Documento de Reenvío de valeras. Esto puede demorar un par de minutos por favor espere",
                  { autoClose: 60000 }
                );
                props.cbActualizarM(ValerasX, values, 5);
                Funciones.FNGetFileM(props.oidc, {
                  ...values,
                  Valeras: ValerasX,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    const fileURL = URL.createObjectURL(file);
                    const enlaceTemporal = document.createElement("a");
                    enlaceTemporal.href = fileURL;
                    enlaceTemporal.target = "_blank";
                    enlaceTemporal.style.display = "none";

                    document.body.appendChild(enlaceTemporal);

                    enlaceTemporal.click();

                    setTimeout(() => {
                      // Imprimir el documento
                      // window.print();
                    }, 1000);
                    setLoading(false);
                    toast.success(
                      "Generación de documento, realizada correctamente"
                    );
                  })
                  .catch((error: any) => {
                    toast.error("Error al generar documento");
                    setLoading(false);
                  });
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error(
                  "Error al captura el Reenvío de las Valeras, por favor revisa los datos seleccionados."
                );
              });
          } else {
            toast.error("Sin evento selecciónado");
          }
        } else {
          setLoading(false);
          toast.error("No ha Seleccionado ninguna valera");
        }

        // Finish the callback
      }}
    >
      <Form onKeyDown={onKeyDown}>
        <div className="row">
          {["ASIGNAR", "REASIGNAR", "REENVIAR"].includes(props.evento) && (
            <div className="col-md-12">
              {isMounted && (
                <ActionSelect
                  disabled={false}
                  label="Sucursal Destino"
                  name="AsignaSucursalId"
                  placeholder={"Seleccione la Sucursal"}
                  options={props.optSucursales}
                  addDefault={false}
                  valor={props.initialValues.AsignaSucursalId}
                  //accion={props.fnGetDistribuidores}
                />
              )}
            </div>
          )}
          {["ENVIAR", "REENVIAR"].includes(props.evento) && (
            <CustomFieldText
              disabled={loading}
              label="Nota de Envío"
              name="EnvioSucursalNota"
              placeholder="No. guia, fechas, etc."
            />
          )}
          {props.evento === "RECIBIR" && (
            <CustomFieldText
              disabled={loading}
              label="Nota de Recepción de Valeras"
              name="ReciboSucursalNota"
              placeholder="Observaciones de la recepción de valeras."
            />
          )}

          <ActionMultipleSelect
            disabled={loading}
            label={`Valeras Seleccionadas (${ValerasX.length})`}
            name="ValerasIds"
            placeholder="Captura el código de barras o selecciona la Valera de la tabla"
            options={props.optCodigosB}
            addDefault={false}
            valor={props.Valeras}
            delete={0}
            maxMenuHeight={50}
            openMenuOnClick={false}
            // ref={refArticulos}

            accion={selectByCode}
          />
          <button type="submit" hidden ref={() => {}} />

          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              {
                <button
                  type="button"
                  className="btn btn-danger waves-effect waves-light"
                  onClick={props.fnCancelar}
                >
                  {"Cancelar"}
                </button>
              }
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light"
              >
                {"Ok"}
              </button>
            </div>
          )}

          {ValerasX.length === 0 && (
            <div className="text-danger">
              *Seleccione una Valera de la lista
            </div>
          )}
          {/*<label className='form-label mb-0'>Selecciona los Bloques de Valera</label>*/}

          <div>
            {!showDataTable ? (
              <>
                <div style={{ textAlign: "center" }}>
                  <FaBarcode size={369} />
                </div>
              </>
            ) : (
              <DataTable
                subHeader
                noDataComponent={
                  <div style={{ margin: "4em" }}>
                    {" "}
                    <>
                      <FaExclamationCircle color={"grey"} size={20} /> NO HAY
                      VALERAS QUE COINCIDAN CON LOS FILTROS SELECCIONADOS
                    </>{" "}
                  </div>
                }
                paginationComponentOptions={{
                  rowsPerPageText: "Registros por pagina:",
                  rangeSeparatorText: "de",
                  noRowsPerPage: false,
                  selectAllRowsItem: false,
                  selectAllRowsItemText: "Todo",
                }}
                subHeaderComponent={
                  props.evento != "" && (
                    <>
                      <div className="col-sm-12">
                        <div>
                          <div>
                            <label
                              style={{
                                margin: "0px",
                                paddingTop: "1em",
                                display: "block",
                                fontSize: "1.2em",
                              }}
                            >
                              VALERAS{" "}
                              {props.evento === "ASIGNAR"
                                ? "DISPONIBLES "
                                : props.evento === "ENVIAR"
                                ? "RESERVADAS "
                                : props.evento === "REASIGNAR"
                                ? "ASIGNADAS "
                                : props.evento === "RECIBIR"
                                ? "ENVIADAS "
                                : "REASIGNADAS "}
                              {FiltroSelc ? "SELECCIONADAS" : ""}
                            </label>
                          </div>
                        </div>
                        <div
                          style={{
                            backgroundColor: "#F7F7F7",
                            padding: "1em",
                            borderRadius: "15px",
                          }}
                        >
                          <div>
                            <div style={{ float: "left" }}>
                              <FaFilter />
                            </div>
                            <div>
                              <label> FILTROS</label>
                            </div>
                          </div>
                          <div style={{ width: "100%", textAlign: "center" }}>
                            <div style={{ display: "inline-block" }}>
                              <div
                                className="row"
                                style={{ textAlign: "initial" }}
                              >
                                {props.evento !== "RECIBIR" && (
                                  <div
                                    style={{ width: "190px", height: "60px" }}
                                  >
                                    <ActionSelect
                                      disabled={false}
                                      label="Productos"
                                      name="ProductoID"
                                      placeholder="TODOS LOS PRODUCTOS"
                                      options={props.optProductos}
                                      addDefault={true}
                                      valor={FiltroProd}
                                      accion={getProducto}
                                    />
                                  </div>
                                )}
                                {props.evento !== "RECIBIR" && (
                                  <div
                                    style={{ width: "190px", height: "60px" }}
                                  >
                                    <ActionSelect
                                      disabled={props.optSeries.length === 0}
                                      label="Series"
                                      name="serieId"
                                      placeholder="TODAS LAS SERIES"
                                      options={props.optSeries}
                                      addDefault={true}
                                      valor={FiltroSeri}
                                      accion={getSerie}
                                    />
                                  </div>
                                )}
                                {["ENVIAR", "REASIGNAR", "REENVIAR"].includes(
                                  props.evento
                                ) && (
                                  <div
                                    style={{ width: "190px", height: "60px" }}
                                  >
                                    <ActionSelect
                                      disabled={false}
                                      label="Sucursales"
                                      name="SucursalID"
                                      placeholder="TODAS LAS SUCURSALES"
                                      options={props.optSucursales}
                                      addDefault={true}
                                      valor={FiltroSucu}
                                      accion={getSucurasl}
                                    />
                                  </div>
                                )}
                                <div style={{ width: "130px", height: "60px" }}>
                                  <label className="form-label mb-0">
                                    F.Inicial
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Folio INICIAL"
                                    value={FiltroFolI}
                                    onChange={(e) => getFolioI(e.target.value)}
                                  />
                                </div>
                                <div style={{ width: "130px", height: "60px" }}>
                                  <label className="form-label mb-0">
                                    F.Final
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Folio Final"
                                    value={FiltroFolF}
                                    onChange={(e) => getFolioF(e.target.value)}
                                  />
                                </div>
                                <div style={{ width: "130px", height: "60px" }}>
                                  <label className="form-label mb-0">
                                    C. de Barras
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="No capturado"
                                    value={FiltroCodB}
                                    onChange={(e) => getCodigoB(e.target.value)}
                                  />
                                </div>
                                <div style={{ width: "90px", height: "60px" }}>
                                  <label
                                    htmlFor="cbox2"
                                    className="form-label mb-0"
                                  >
                                    Selc.
                                  </label>
                                  <br />
                                  <div>
                                    <input
                                      type="checkbox"
                                      style={{ marginTop: "0.7em" }}
                                      checked={FiltroSelc}
                                      onChange={(e) =>
                                        getSelc(e.target.checked)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }
                data={props.datos}
                selectableRowSelected={(row: any) => {
                  //console.log('ROW', row.ValeraID)
                  return props.Valeras.includes(row.ValeraID);
                }}
                selectableRows
                //selectableRowDisabled={(row: any) => row.ValeraID === 73}
                onSelectedRowsChange={selectByCheck}
                striped
                pagination
                dense
                noHeader
                responsive
                keyField={"ValeraID"}
                defaultSortField={"ValeraID"}
                columns={props.columns}
                paginationPerPage={Pagination}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                paginationDefaultPage={Page}
                onChangeRowsPerPage={(perPage) => {
                  setPagination(perPage);
                }}
                onChangePage={(page) => {
                  setPage(page);
                }}
              />
            )}
          </div>
        </div>
      </Form>
    </Formik>
  );
};
