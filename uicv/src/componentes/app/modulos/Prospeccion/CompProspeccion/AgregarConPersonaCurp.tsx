import React from "react";
import { ModalWin, AsistenteFormik } from "../../../../global";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Formik
// import * as Yup from 'yup'
import * as Funciones from "./Prospectos/Funciones";
import {
  FormasGeneral,
  FormasPersona,
  FormasProspecto,
} from "../../../../formas";
import { DBConfia_Prospeccion } from "../../../../../interfaces_db/DBConfia/Prospeccion";
import moment from "moment";

/** Tipo de nuestro componente */
type FormaAgregarTipo = {
  // Basico
  oidc: IOidc;
  Id?: number;
  Item?: any;

  // Callbacks
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;

  // Modal controls
  mostrar: boolean;
  statusCurp?: boolean;
  SucursalID?: number;
};
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarConPersonaCurp = (props: FormaAgregarTipo) => {
  // Render our component
  return (
    <ModalWin open={props.mostrar} large>
      <ModalWin.Header>
        <h5 className={MODAL_TITLE_CLASS}>
          {props.Id ? "Editar usuario" : "Agregar usuario"}
        </h5>
      </ModalWin.Header>
      <ModalWin.Body>
        <AsistenteFormik
          MostrarPasos={true}
          Pasos={[
            FormasProspecto.FormaDatosGenerales({
              Prefijo: "ProspectoPersona_",
              Titulo: "Prospecto",
              SubTitulo: "Prospecto Persona",
              SexoID: props.Item?.SexoID,
              LugarNac: props.Item?.LugarNacimiento,
              AsentID: props.Item?.AsentamientoID,
              CURP: props.Item?.CURP,
              TelefonoMovil: props.Item?.TelefonoMovil,
              BC: props.Item?.EstatusConsultaBuroID,
              oidc: props.oidc,
              statusCurp: props?.statusCurp,
            }),
            FormasProspecto.FormaDatosGeneralesLaboral({
              Prefijo: "ProspectoLaboral_",
              Titulo: "Prospecto",
              SubTitulo: "Datos Laborales",
              TieneEmpleo: props.Item?.TieneEmpleo,
              OcupacionID: props.Item?.OcupacionID,
              AsentID: props.Item?.AsentamientoIDEmpleo,
            }),
            FormasProspecto.FormaDatosGeneralesECivil({
              Prefijo: "ProspectoConyuge_",
              Titulo: "Prospecto",
              SubTitulo: "Datos Estado Civil",
              EstadoCivilID: props.Item?.EstadoCivilID,
              TieneEmpleo: props.Item?.TieneEmpleoConyuge,
              OcupacionID: props.Item?.OcupacionIDConyuge,
              AsentID: props.Item?.AsentamientoIDEmpresaConyuge,
            }),
          ]}
          // Provisionar esta variable para mostrar datos de edicion
          Datos={{
            ProspectoPersona_ID: props.Item?.PersonaID ?? 0,
            //-----------------------------------------------------------
            ProspectoPersona_Nombre: props.Item?.Nombre ?? "",
            ProspectoPersona_ApellidoPaterno: props.Item?.ApellidoPaterno ?? "",
            ProspectoPersona_ApellidoMaterno: props.Item?.ApellidoMaterno ?? "",
            ProspectoPersona_FechaNacimiento: moment(
              moment(props.Item?.FechaNacimiento).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            ).toDate(),
            ProspectoPersona_Curp: props.Item?.CURP ?? "",
            ProspectoPersona_SexoID: props.Item?.SexoID ?? "",
            ProspectoPersona_cp: props.Item?.CodigoPostal ?? 0,
            ProspectoPersona_TelefonoMovil: props.Item?.TelefonoMovil ?? "",
            ProspectoPersona_Correo: props.Item?.CorreoElectronico ?? "",
            ProspectoPersona_LugarNacimiento: props.Item?.LugarNacimiento ?? "",

            ProspectoPersona_AsentamientoID: props.Item?.AsentamientoID ?? 0,
            ProspectoPersona_Localidad: props.Item?.localidad ?? "",
            ProspectoPersona_Calle: props.Item?.calle ?? "",
            ProspectoPersona_NumeroExterior: props.Item?.numeroExterior ?? "",
            ProspectoPersona_Telefono: props.Item?.TelefonoDomicilio ?? "",
            //-----------------------------------------------------------
            ProspectoLaboral_Trabaja: !props.Item?.TieneEmpleo
              ? props.Item?.TieneEmpleo
              : props.Item.TieneEmpleo === 1
              ? "true"
              : "false",
            ProspectoLaboral_Empresa: props.Item?.Empresa ?? "",
            ProspectoLaboral_OcupacionID: props.Item?.OcupacionID ?? "",
            ProspectoLaboral_SueldoMensual: props.Item?.Sueldo ?? "",
            ProspectoLaboral_Antiguedad: props.Item?.Antiguedad ?? "",
            ProspectoLaboral_TelefonoLaboral: props.Item?.TelefonoEmpleo ?? "",
            ProspectoLaboral_AsentamientoIDLaboral:
              props.Item?.AsentamientoIDEmpleo ?? 0,
            ProspectoLaboral_LocalidadLaboral:
              props.Item?.localidadEmpleo ?? "",
            ProspectoLaboral_CalleLaboral: props.Item?.calleEmpleo ?? "",
            ProspectoLaboral_NumeroExteriorLaboral:
              props.Item?.numeroExteriorEmpleo ?? "",
            //-----------------------------------------------------------
            ProspectoConyuge_EstadoCivilID: props.Item?.EstadoCivilID ?? "",
            ProspectoConyuge_NombreConyuge: props.Item?.NombreConyuge ?? "",
            ProspectoConyuge_Trabaja:
              (props.Item?.TieneEmpleoConyuge ?? null) === 1 ? "true" : "false",
            ProspectoConyuge_EmpresaConyuge: props.Item?.EmpresaConyuge ?? "",
            ProspectoConyuge_OcupacionIDConyuge:
              props.Item?.OcupacionIDConyuge ?? 0,
            ProspectoConyuge_SueldoMensualConyuge:
              props.Item?.SueldoConyuge ?? 0,
            ProspectoConyuge_AntiguedadConyuge:
              props.Item?.AntiguedadConyuge ?? "",
            ProspectoConyuge_TelefonoLaboralConyuge:
              props.Item?.TelefonoEmpresaConyuge ?? "",
            ProspectoConyuge_AsentamientoIDLaboralConyuge:
              props.Item?.AsentamientoIDEmpresaConyuge ?? 0,
            ProspectoConyuge_LocalidadLaboralConyuge:
              props.Item?.localidadEmpresaConyuge ?? "",
            ProspectoConyuge_CalleLaboralConyuge:
              props.Item?.calleEmpresaConyuge ?? "",
            ProspectoConyuge_NumeroExteriorLaboralConyuge:
              props.Item?.NumeroExteriorEmpresaConyuge ?? "",
          }}
          // Personalizacion [Botones]
          CLASE__BOTONES__DIV={"d-grid gap-2 d-md-flex justify-content-md-end"}
          CLASE__BOTONES__CANCELAR={"btn btn-danger btn-sm"}
          CLASE__BOTONES__TERMINAR={"btn btn-confia btn-sm"}
          CLASE__BOTONES__SIGUIENTE={"btn btn-confia btn-sm"}
          CLASE__BOTONES__ANTERIOR={"btn btn-warning btn-sm"}
          // Personalizacion [Listado]
          CLASE__LISTADO_PASOS__PROGRESO={"bg-info"}
          CLASE__LISTADO_PASOS__TERMINADO={"bg-success"}
          CLASE__LISTADO_PASOS__LI__TITULO={`card-title mb-0`}
          // Funciones
          FN__CANCELAR={props.fnCancelar}
          PROMESA__PROCESAR={(Datos: any) => {
            console.log("??", Datos);
            const Persona = {
              Nombre: Datos.ProspectoPersona_Nombre,
              ApellidoPaterno: Datos.ProspectoPersona_ApellidoPaterno,
              ApellidoMaterno: Datos.ProspectoPersona_ApellidoMaterno,
              FechaNacimiento: Datos.ProspectoPersona_FechaNacimiento,
              LugarNacimiento: Datos.ProspectoPersona_LugarNacimiento,
              CURP: Datos.ProspectoPersona_Curp,
              RFC: `${Datos.ProspectoPersona_Curp.substr(0, 10)}XXX`,
              SexoID: Datos.ProspectoPersona_SexoID,
              EstadoCivilID: Datos.ProspectoConyuge_EstadoCivilID,
              EscolaridadID: 7,
              DependientesEconomicos: 0,
              TelefonoDomicilio:
                Datos.ProspectoPersona_Telefono.length > 0
                  ? Datos.ProspectoPersona_Telefono
                  : "0000000000",
              TelefonoMovil: Datos.ProspectoPersona_TelefonoMovil,
              CorreoElectronico: Datos.ProspectoPersona_Correo,
              NombreConyuge: `${Datos.ProspectoConyuge_NombreConyuge}`,
              Observaciones: "N/A",
              identificacionTipoId: 1,
              identificacionNumero: "###########",
              NombreCompleto: `${Datos.ProspectoPersona_Nombre} ${Datos.ProspectoPersona_ApellidoMaterno} ${Datos.ProspectoPersona_ApellidoMaterno}`,
            };

            const AgregarCliente = {},
              AgregarDireccion = {},
              AgregarEmpleo = {},
              AgregarDirector = {};

            const AgregarProspecto = {
              PersonaID: props.Item?.PersonaID ?? 1,
              CrearProspecto: true,
              trabaja: Datos.Trabaja,

              DireccionPersona_AsentamientoID: parseInt(
                Datos.ProspectoPersona_AsentamientoID
              ),
              DireccionPersona_NombreVialidad: Datos.ProspectoPersona_Calle,
              DireccionPersona_NumeroExterior:
                Datos.ProspectoPersona_NumeroExterior,
              DireccionPersona_Localidad: Datos.ProspectoPersona_Localidad,
              Laboral_Trabaja: Datos.ProspectoLaboral_Trabaja === "true",
              Laboral__Empresa: Datos.ProspectoLaboral_Empresa,
              Laboral__OcupacionID: parseInt(
                Datos.ProspectoLaboral_OcupacionID === ""
                  ? 0
                  : Datos.ProspectoLaboral_OcupacionID
              ),
              Laboral__Telefono: Datos.ProspectoLaboral_TelefonoLaboral,
              Laboral__SueldoMensual: parseFloat(
                Datos.ProspectoLaboral_SueldoMensual === ""
                  ? 0
                  : Datos.ProspectoLaboral_SueldoMensual
              ),
              Laboral__Antiguedad: Datos.ProspectoLaboral_Antiguedad,

              DireccionLaboral_AsentamientoID: parseInt(
                Datos.ProspectoLaboral_AsentamientoIDLaboral
              ),
              DireccionLaboral_NombreVialidad:
                Datos.ProspectoLaboral_CalleLaboral,
              DireccionLaboral_NumeroExterior:
                Datos.ProspectoLaboral_NumeroExteriorLaboral,
              DireccionLaboral_LocalidadLaboral:
                Datos.ProspectoLaboral_LocalidadLaboral,

              Conyuge_Trabaja: Datos.ProspectoConyuge_Trabaja === "true",
              Conyuge_EmpresaConyuge: Datos.ProspectoConyuge_EmpresaConyuge,
              Conyuge_OcupacionIDConyuge: parseInt(
                Datos.ProspectoConyuge_OcupacionIDConyuge === ""
                  ? 0
                  : Datos.ProspectoConyuge_OcupacionIDConyuge
              ),
              Conyuge_TelefonoLaboralConyuge:
                Datos.ProspectoConyuge_TelefonoLaboralConyuge,
              Conyuge_SueldoMensualConyuge: parseFloat(
                Datos.ProspectoConyuge_SueldoMensualConyuge === ""
                  ? 0
                  : Datos.ProspectoConyuge_SueldoMensualConyuge
              ),
              Conyuge_AntiguedadConyuge:
                Datos.ProspectoConyuge_AntiguedadConyuge,
              Conyuge_AsentamientoIDLaboralConyuge: parseInt(
                Datos.ProspectoConyuge_AsentamientoIDLaboralConyuge
              ),
              Conyuge_CalleLaboralConyuge:
                Datos.ProspectoConyuge_CalleLaboralConyuge,
              Conyuge_NumeroExteriorLaboralConyuge:
                Datos.ProspectoConyuge_NumeroExteriorLaboralConyuge,
              Conyuge_LocalidadLaboralConyuge:
                Datos.ProspectoConyuge_LocalidadLaboralConyuge,
            };

            // Regresamos la nueva promesa
            return Funciones.FNAgregar(props.oidc, {
              ...Persona,
              AgregarCliente,
              AgregarProspecto,
              AgregarDirector,
              SucursalID: props.SucursalID ?? 0,
            });
          }}
          FN__LIMPIAR={(Datos: any, DatosPromesa: any) =>
            props.cbGuardar(DatosPromesa)
          }
          FN__ERROR={(error) => {
            if (error.response) {
              alert(`Response Error: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) alert(`Request ${error}`);
            else alert(`${error}`);
          }}
        />
      </ModalWin.Body>
    </ModalWin>
  );
};
