import axios from "axios";
import { GetServerUrl } from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { DBConfia_Creditos } from "../../../../../../interfaces_db/DBConfia/Creditos";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";

type ClientePersonaType = {
  // Persona: DBConfia_General.IPersonas_VW,
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  LugarNacimiento: string;
  CURP: string;
  RFC: string;
  SexoID: string;
  EstadoCivilID: string;
  EscolaridadID: number;
  DependientesEconomicos: number;
  TelefonoDomicilio: string;
  TelefonoMovil: string;
  CorreoElectronico: string;
  NombreConyuge: string;
  Observaciones: string;
  identificacionTipoId: number;
  identificacionNumero: string;
  AgregarCliente: DBConfia_Creditos.IClientes;
  AgregarDireccion: {
    PersonaID: number;
    DireccionPersona_AsentamientoID: number;
    DireccionPersona_NombreVialidad: string;
    DireccionPersona_NumeroInterior: string;
    DireccionPersona_NumeroExterior: string;
    DireccionPersona_vialidadTipoId: number;
    DireccionPersona_orientacionVialidadTipoId: number;
    DireccionPersona_viviendaTipoId: number;
  };
  AgregarEmpleo: {
    PersonaID: number;
    FormaEmpleo__Empresa: string;
    FormaEmpleo__Puesto: string;
    FormaEmpleo__OcupacionID: number;
    FormaEmpleo__Telefono: string;
    FormaEmpleo__FechaIngreso: string;
    FormaEmpleo__FechaTermino: string;
    FormaEmpleo__SueldoMensual: number;
    DireccionEmpleo_vialidadTipoId: number;
    DireccionEmpleo_NombreVialidad: string;
    DireccionEmpleo_orientacionVialidadTipoId: number;
    DireccionEmpleo_NumeroExterior: string;
    DireccionEmpleo_NumeroInterior: string;
    DireccionEmpleo_ReferenciaGeografica: string;
    DireccionEmpleo_AsentamientoID: number;
    DireccionEmpleo_viviendaTipoId: number;
  };
  AgregarProspecto: {
    CrearProspecto: boolean;
  };
  AgregarDirector: DBConfia_General.IDirectores;
};

export const FNObtener = (oidc: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Administracion/Personas/get`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNAgregar = (oidc: IOidc, Datos: ClientePersonaType, ok: boolean) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos Cliente: ", Datos);
if(ok){
  axios
  .post(`${GetServerUrl()}Administracion/Personas/add`, Datos, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oidc.user.access_token}`,
    },
  })
  .then((respuesta) => {
    Resolver(respuesta.data);
  })
  .catch((error) => {
    console.log("error: ", error);
    Denegar(error);
  });
}
else{
  Denegar("Escanee su huella por favor")
}
    
  });

export const FNConsultarEstatusCURP = (oidc: IOidc) => {
  return new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}General/Renapo/ObtenerEstatusCurp`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });
};

export const FNBuscarCurp = (oidc: IOidc, Curp: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}General/Renapo/buscaCurp`, Curp, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("error: ", error);
        Denegar(error);
      });
  });
