import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./MultiSaldosArqueosBovedas/Funciones";
import { toast } from "react-toastify";
import { Form } from "usetheform";
import { FormateoDinero } from "../../../../../global/variables";

// Icons
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { DBConfia_Tesoreria } from "../../../../../interfaces_db/DBConfia/Tesoreria";
import { Formik } from "formik";

import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";

import XLSX from "xlsx";

type EstadoTipo = {
  DatosInitial: {
    incMovs: number;
    incDetalle: number;
  };
  Habilitar: boolean;
  Filtro: string;
  NombreBalance: string;
  Cargando: boolean;
  Error: boolean;
  ProductoID: number;
  MultiSaldoArqueoBovedaID: number;
  masBalances: boolean;
  Form: any;
  Datos: DBConfia_Tesoreria.ICatalogoBoveda[];
  DatosMostrar: DBConfia_Tesoreria.ICatalogoBoveda[];
  DatosExcel: any[];
};

type CatalogosType = {
  Seguridad: IOidc;
};

const MultiSaldosArqueosBovedas = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const [state, setState] = React.useState<EstadoTipo>({
    Habilitar: true,
    NombreBalance: "",
    ProductoID: 0,
    MultiSaldoArqueoBovedaID: 0,
    Datos: [],
    masBalances: false,
    DatosMostrar: [],
    Filtro: "",
    Cargando: false,
    Error: false,
    DatosInitial: {
      incMovs: 0,
      incDetalle: 0,
    },
    Form: {
      BovedaID: undefined,
      Mostrar: false,
      MostrarCuentasBancos: false,
      BobedaID: undefined,
      Nuevo: false,
      Id: undefined,
      IdCuentaContable: undefined,
      MostrarArqueos: false,
      IdBoveda: 0,
    },
    DatosExcel: [],
  });

  const Columns: IDataTableColumn[] = [
    {
      name: "Sucursal",
      selector: "NombreSucursal",
      sortable: false,
      center: true,
      cell: (props) =>
        props.SucursalID == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">
            <strong>{props.NombreSucursal}</strong>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Caja",
      selector: "NombreCaja",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NombreCaja == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            <strong>{props.NombreCaja}</strong>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Cuenta BancoID",
      selector: "CuentaBancoID",
      sortable: false,
      center: true,
      width: "60px",
      cell: (props) =>
        props.CuentaBancoID == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.CuentaBancoID}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },

    {
      name: "Número de Cuenta",
      selector: "NombreCuenta",
      sortable: false,
      center: true,
      width: "100px",
      cell: (props) =>
        props.NombreCuenta == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NombreCuenta}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Usuario Realizo",
      selector: "UsuarioRealiza",
      sortable: false,
      center: true,
      cell: (props) =>
        props.UsuarioRealiza == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.UsuarioRealiza}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Fecha Realizo",
      selector: "FechaUltimoArqueoBoveda",
      sortable: false,
      center: true,
      width: "110px",
      cell: (props) =>
        props.UsuarioRealiza == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.FechaUltimoArqueoBoveda}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo Sistema",
      selector: "SaldoSistemaUltAB",
      sortable: false,
      center: true,
      cell: (props) =>
        props.SaldoSistemaUltAB == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(props.SaldoSistemaUltAB)}
          </span>
        ),

      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo Físico",
      selector: "SaldoFisicoUltAB",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.SaldoFisicoUltAB == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoFisicoUltAB)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Diferencia",
      selector: "Diferencia",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.Diferencia == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.Diferencia)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltiSaldoArqueoBovedaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
  ];

  React.useEffect(() => {
    //FNGetPeriodos("A")
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const FNGetMultiSaldos2 = () => {
    Funciones.FNGet(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.length > 0) {
            console.log("respuesta", respuesta);
            setState((s) => ({
              ...s,
              MultiSaldoArqueoBovedaID: respuesta[0].MultiSaldoArqueoBovedaID,
            }));
            let tabla: any[] = [];
            let totalDiferencia = 0;
            let totalCajaFisico = 0;
            let totalCajaSistema = 0;
            let sucursalAnterior = 0;
            let cajaAnterior = 0;
            let posicion = 0;
            let primero = true;
            let nombreSucursalAnterior: 0;
            let tabla2: any[] = [];

            respuesta.forEach((element: any) => {
              posicion = posicion + 1;
              if (primero) {
                let detalleSaldos: any = {
                  SucursalID: element.SucursalID,
                  NombreSucursal: element.NombreSucursal,
                  CajaID: element.CajaID,
                  NombreCaja: element.NombreCaja,
                  CuentaBancoID: element.CuentaBancoID,
                  UsuarioRealiza: element.UsuarioRealiza,
                  NombreCuenta: element.NombreCuenta,
                  FechaUltimoArqueoBoveda: element.FechaUltimoArqueoBoveda,
                  SaldoSistemaUltAB: element.SaldoSistemaUltAB,
                  SaldoFisicoUltAB: element.SaldoFisicoUltAB,
                  Diferencia: element.Diferencia,
                };
                tabla.push(detalleSaldos);
                sucursalAnterior = element.SucursalID;
                nombreSucursalAnterior = element.NombreSucursal;
                cajaAnterior = element.CajaID;
                primero = false;
              } else {
                if (element.SucursalID == sucursalAnterior) {
                  let detalleSaldos: any = {
                    SucursalID: element.SucursalID,
                    NombreSucursal: "",
                    CajaID:
                      cajaAnterior == element.CajaID ? "" : element.CajaID,
                    NombreCaja:
                      cajaAnterior == element.CajaID ? "" : element.NombreCaja,
                    CuentaBancoID: element.CuentaBancoID,
                    NombreCuenta: element.NombreCuenta,
                    UsuarioRealiza: element.UsuarioRealiza,
                    FechaUltimoArqueoBoveda: element.FechaUltimoArqueoBoveda,
                    SaldoSistemaUltAB: element.SaldoSistemaUltAB,
                    SaldoFisicoUltAB: element.SaldoFisicoUltAB,
                    Diferencia: element.Diferencia,
                  };
                  tabla.push(detalleSaldos);
                  sucursalAnterior = element.SucursalID;
                  cajaAnterior = element.CajaID;
                  nombreSucursalAnterior = element.NombreSucursal;
                } else {
                  let filtro = respuesta.filter((valor: any) => {
                    return valor.SucursalID == sucursalAnterior;
                  });
                  filtro.forEach((element) => {
                    totalCajaFisico =
                      totalCajaFisico + element.SaldoFisicoUltAB;
                    totalCajaSistema =
                      totalCajaSistema + element.SaldoSistemaUltAB;
                    totalDiferencia = totalDiferencia + element.Diferencia;
                  });

                  let detalleSaldos22: any = {
                    MuiltiSaldoArqueoBovedaDetalleID: -1,
                    SucursalID: "",
                    NombreSucursal: "",
                    CajaID: "",
                    NombreCaja: "",
                    CuentaBancoID: "",
                    NombreCuenta: "",
                    UsuarioRealiza: "",
                    FechaUltimoArqueoBoveda: "Totales:",
                    SaldoSistemaUltAB: totalCajaSistema,
                    SaldoFisicoUltAB: totalCajaFisico,
                    Diferencia: totalDiferencia,
                  };
                  tabla.push(detalleSaldos22);

                  totalCajaFisico = 0;
                  totalCajaSistema = 0;
                  totalDiferencia = 0;

                  let detalleSaldos2: any = {
                    MuiltiSaldoArqueoBovedaDetalleID: -2,
                    SucursalID: "espacio",
                    NombreSucursal: "espacio",
                    CajaID: "espacio",
                    NombreCaja: "espacio",
                    CuentaBancoID: "espacio",
                    NombreCuenta: "espacio",
                    UsuarioRealiza: "espacio",
                    FechaUltimoArqueoBoveda: "espacio",
                    SaldoSistemaUltAB: "espacio",
                    SaldoFisicoUltAB: "espacio",
                    Diferencia: "espacio",
                  };
                  tabla.push(detalleSaldos2);

                  let detalleSaldos3: any = {
                    SucursalID: element.SucursalID,
                    NombreSucursal: element.NombreSucursal,
                    CajaID: element.CajaID,
                    NombreCaja: element.NombreCaja,
                    CuentaBancoID: element.CuentaBancoID,
                    NombreCuenta: element.NombreCuenta,
                    UsuarioRealiza: element.UsuarioRealiza,
                    FechaUltimoArqueoBoveda: element.FechaUltimoArqueoBoveda,
                    SaldoSistemaUltAB: element.SaldoSistemaUltAB,
                    SaldoFisicoUltAB: element.SaldoFisicoUltAB,
                    Diferencia: element.Diferencia,
                  };
                  tabla.push(detalleSaldos3);
                  cajaAnterior = element.CajaID;
                }
                console.log("F1 LENGTH ,", respuesta.length);
                console.log("F1 POSICION ,", posicion);
                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.SucursalID == element.SucursalID;
                  });
                  filtro2.forEach((element) => {
                    totalCajaFisico =
                      totalCajaFisico + element.SaldoFisicoUltAB;
                    totalCajaSistema =
                      totalCajaSistema + element.SaldoSistemaUltAB;
                    totalDiferencia = totalDiferencia + element.Diferencia;
                  });

                  let detalleSaldos: any = {
                    MuiltiSaldoArqueoBovedaDetalleID: -1,
                    SucursalID: "",
                    NombreSucursal: "",
                    CajaID: "",
                    NombreCaja: "",
                    CuentaBancoID: "",
                    NombreCuenta: "",
                    UsuarioRealiza: "",
                    FechaUltimoArqueoBoveda: "Totales:",
                    SaldoSistemaUltAB: totalCajaSistema,
                    SaldoFisicoUltAB: totalCajaFisico,
                    Diferencia: totalDiferencia,
                  };
                  tabla.push(detalleSaldos);
                  totalCajaFisico = 0;
                  totalCajaSistema = 0;
                  totalDiferencia = 0;
                }
              }
            });
            setState((s) => ({
              ...s,
              Datos: tabla,
              Cargando: false,
              DatosExcel: respuesta,
            }));
          }
        }
      })
      .catch((Ex: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);
  const cerrarSwal = () => {
    MySwal2.close();
  };
  const MySwal2 = withReactContent2(Swal2);
  const cerrarSwal2 = () => {
    MySwal2.close();
  };

  const generarXLSX = () => {
    if (state.MultiSaldoArqueoBovedaID > 0) {
      const XLSX = require("xlsx-js-style");
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel, {
        origin: "B3",
      });

      for (let i in ws) {
        if (typeof ws[i] != "object") continue;
        let cell = XLSX.utils.decode_cell(i);

        if (i.replace(/[^0-9]/gi, "") === "3") {
          ws[i].s = {
            fill: {
              patternType: "solid",
              fgColor: { rgb: "c0e17c" },
              bgColor: { rgb: "c0e17c" },
            },
            font: {
              name: "Song Ti",
              sz: 10,
              bold: true,
            },
            border: {
              bottom: {
                style: "thin",
                color: "FF000000",
              },
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: "1",
            },
          };
        } else {
          ws[i].s = {
            font: {
              name: "Song Ti",
              sz: 10,
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: "1",
            },
            border: {
              style: "thin",
            },
          };
        }

        if (
          cell.c == 13 ||
          cell.c == 14 ||
          cell.c == 16 ||
          cell.c == 17 ||
          cell.c == 20 ||
          cell.c == 24
        ) {
          ws[i].s.numFmt = "$#,###.00";
        }

        if (cell.r % 2) {
          ws[i].s.fill = {
            patternType: "solid",
            fgColor: { rgb: "EEEEEE" },
            bgColor: { rgb: "EEEEEE" },
          };
        }
      }

      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      ws["!ref"] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: 40, r: 1 + state.DatosExcel.length + 1 },
      });
      ws["C9"] = { f: "SUM(C2:C5)" };
      ws["B9"] = { v: "Total" };

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "MultiSaldo_ArqueosBovedas.xlsx");
    } else {
      MySwal2.fire({
        icon: "warning",
        html: (
          <div>
            <br />
            <h3 className="text-center">Info</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Primero genera el multisaldos</h5>
            </div>
          </div>
        ),
        showCancelButton: false,
        confirmButtonText: `Ok`,
        confirmButtonColor: `#3085d6`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };
  const generarPDF = () => {
    if (state.MultiSaldoArqueoBovedaID > 0) {
      //Export to excel state of Datos
      let timerInterval;
      MySwal2.fire({
        icon: "info",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Imprimiendo multisaldos.</h5>
            </div>
          </div>
        ),
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: false,
        confirmButtonText: `Ok`,
        didOpen: () => {
          MySwal2.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      let datos = {
        MultiSaldoArqueoBovedaID: state.MultiSaldoArqueoBovedaID,
      };
      Funciones.FNPrintPDF(props.Seguridad, datos)
        .then((respuesta: any) => {
          const file = new Blob([respuesta], { type: "application/pdf" });

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
          MySwal2.close();
        })
        .catch((err) => {
          //   setState(s => ({ ...s, error: true, DatosTabla: [] }))
          toast.error("Ocurrió un error al generar el PDF");
          MySwal2.close();
        });
    } else {
      MySwal2.fire({
        icon: "warning",
        html: (
          <div>
            <br />
            <h3 className="text-center">Info</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Primero genera el multisaldos</h5>
            </div>
          </div>
        ),
        showCancelButton: false,
        confirmButtonText: `Ok`,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Multisaldos Arqueos Bóvedas">
          <Card.Body>
            <Card.Body.Content>
              <div>
                <Formik
                  initialValues={state.Datos}
                  enableReinitialize
                  onSubmit={(values: any) => {}}
                >
                  <Form>
                    <div className="columns is-centered is-mobile is-multiline">
                      <div className="column text-center is-full-desktop is-full-mobile">
                        <br />
                        <button
                          type="submit"
                          className="btn mx-1 btn-primary waves-effect waves-light" //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            FNGetMultiSaldos2();
                          }}
                        >
                          Generar multisaldos
                        </button>
                        <button
                          type="button"
                          className="btn mx-1 btn-secondary waves-effect waves-light"
                          //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            generarPDF();
                          }}
                        >
                          <FaFilePdf size="20px" />
                        </button>
                        <button
                          type="button"
                          className="btn mx-1 btn-success waves-effect waves-light"
                          //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            generarXLSX();
                          }}
                        >
                          <FaFileExcel size="20px" />
                        </button>
                        <button
                          className="btn mx-1 btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            setState((s) => ({
                              ...s,
                              Cargando: true,
                              Error: false,
                              Datos: [],
                            }));
                            FNGetMultiSaldos2();
                          }}
                        >
                          <FiRefreshCcw />
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
              {state.Cargando && (
                <div>
                  <br /> <Spinner />
                </div>
              )}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    data={state.DatosMostrar}
                    striped
                    pagination={false}
                    dense
                    noHeader
                    paginationServer={true}
                    paginationTotalRows={state.DatosMostrar.length}
                    //paginationComponent
                    responsive
                    keyField={"MultiSaldoArqueoBovedaDetalleID"}
                    defaultSortField={"MultiSaldoArqueoBovedaDetalleID"}
                    columns={Columns}
                  />
                </div>
              )}
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IEstado) => ({
  Seguridad: state.oidc,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiSaldosArqueosBovedas);
