using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.OcupacionCoord_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class OcupacionCoord_VW
    {
              
        
        [Column("MB_CIASID")]
        public decimal MB_CIASID { get; set; }
      
        
        [Column("Emp_nie")]
        public int Emp_nie { get; set; }
      
        
        [Column("Emp_TitProf")]
        public string Emp_TitProf { get; set; }
      
        
        [Column("Emp_LugCas")]
        public string Emp_LugCas { get; set; }
      
        
        [Column("Emp_direcc")]
        public string Emp_direcc { get; set; }
      
        
        [Column("Emp_telefo")]
        public string Emp_telefo { get; set; }
      
        
        [Column("Emp_car_espe")]
        public int? Emp_car_espe { get; set; }
      
        
        [Column("Emp_car_famil")]
        public int? Emp_car_famil { get; set; }
      
        
        [Column("Emp_pre_natal")]
        public int? Emp_pre_natal { get; set; }
      
        
        [Column("Emp_tramoaf")]
        public int? Emp_tramoaf { get; set; }
      
        
        [Column("Emp_naco")]
        public int? Emp_naco { get; set; }
      
        
        [Column("Emp_Pasaporte")]
        public string Emp_Pasaporte { get; set; }
      
        
        [Column("Emp_CalMig")]
        public string Emp_CalMig { get; set; }
      
        
        [Column("Emp_CartaNat")]
        public string Emp_CartaNat { get; set; }
      
        
        [Column("Emp_esco")]
        public int? Emp_esco { get; set; }
      
        
        [Column("Emp_prco")]
        public int? Emp_prco { get; set; }
      
        
        [Column("Emp_ecco")]
        public int? Emp_ecco { get; set; }
      
        
        [Column("Emp_idco")]
        public int? Emp_idco { get; set; }
      
        
        [Column("Emp_accidente")]
        public string Emp_accidente { get; set; }
      
        
        [Column("Emp_ferol")]
        public DateTime? Emp_ferol { get; set; }
      
        
        [Column("Emp_sitmil")]
        public string Emp_sitmil { get; set; }
      
        
        [Column("Emp_grusan")]
        public string Emp_grusan { get; set; }
      
        
        [Column("Emp_DrCalle")]
        public string Emp_DrCalle { get; set; }
      
        
        [Column("Emp_DrNumI")]
        public string Emp_DrNumI { get; set; }
      
        
        [Column("Emp_DrNumE")]
        public string Emp_DrNumE { get; set; }
      
        
        [Column("Emp_DrColonia")]
        public string Emp_DrColonia { get; set; }
      
        
        [Column("Emp_DrCodigoP")]
        public string Emp_DrCodigoP { get; set; }
      
        
        [Column("Emp_DrCodigoP2")]
        public string Emp_DrCodigoP2 { get; set; }
      
        
        [Column("Emp_DrMunicipio")]
        public string Emp_DrMunicipio { get; set; }
      
        
        [Column("Emp_DrOrientacion")]
        public string Emp_DrOrientacion { get; set; }
      
        
        [Column("Emp_Cve_elector")]
        public string Emp_Cve_elector { get; set; }
      
        
        [Column("Emp_Alergias")]
        public string Emp_Alergias { get; set; }
      
        
        [Column("Emp_TelEmergencias")]
        public string Emp_TelEmergencias { get; set; }
      
        
        [Column("Emp_ContEmergencias")]
        public string Emp_ContEmergencias { get; set; }
      
        
        [Column("Emp_NomPadre")]
        public string Emp_NomPadre { get; set; }
      
        
        [Column("Emp_PadreFN")]
        public DateTime? Emp_PadreFN { get; set; }
      
        
        [Column("Emp_PadreVive")]
        public string Emp_PadreVive { get; set; }
      
        
        [Column("Emp_PadreDE")]
        public string Emp_PadreDE { get; set; }
      
        
        [Column("Emp_NomMadre")]
        public string Emp_NomMadre { get; set; }
      
        
        [Column("Emp_MadreFN")]
        public DateTime? Emp_MadreFN { get; set; }
      
        
        [Column("Emp_MadreVive")]
        public string Emp_MadreVive { get; set; }
      
        
        [Column("Emp_MadreDE")]
        public string Emp_MadreDE { get; set; }
      
        
        [Column("Emp_NacLugar")]
        public string Emp_NacLugar { get; set; }
      
        
        [Column("Emp_NacCiudad")]
        public string Emp_NacCiudad { get; set; }
      
        
        [Column("Emp_Aniversario")]
        public DateTime? Emp_Aniversario { get; set; }
      
        
        [Column("ClinID")]
        public string ClinID { get; set; }
      
        
        [Column("Emp_poliza")]
        public string Emp_poliza { get; set; }
      
        
        [Column("ASG_ID")]
        public int? ASG_ID { get; set; }
      
        
        [Column("IDSE_Imp")]
        public string IDSE_Imp { get; set; }
      
        
        [Column("INFV_CAL")]
        public int? INFV_CAL { get; set; }
      
        
        [Column("Emp_DirEst")]
        public string Emp_DirEst { get; set; }
      
        
        [Column("Emp_Temp")]
        public string Emp_Temp { get; set; }
      
        
        [Column("Emp_FIProy")]
        public DateTime? Emp_FIProy { get; set; }
      
        
        [Column("Emp_TraAnt")]
        public string Emp_TraAnt { get; set; }
      
        
        [Column("Emp_cedprof")]
        public string Emp_cedprof { get; set; }
      
        
        [Column("Emp_Licencia")]
        public string Emp_Licencia { get; set; }
      
        
        [Column("Emp_Cartilla")]
        public string Emp_Cartilla { get; set; }
      
        
        [Column("Emp_Checa")]
        public string Emp_Checa { get; set; }
      
        
        [Column("Emp_Tras")]
        public string Emp_Tras { get; set; }
      
        
        [Column("Emp_EmpPro")]
        public decimal? Emp_EmpPro { get; set; }
      
        
        [Column("Emp_NSocio")]
        public decimal? Emp_NSocio { get; set; }
      
        
        [Column("Emp_material")]
        public string Emp_material { get; set; }
      
        
        [Column("Emp_igf")]
        public int? Emp_igf { get; set; }
      
        
        [Column("Emp_dormitorio")]
        public int? Emp_dormitorio { get; set; }
      
        
        [Column("Emp_conservacion")]
        public string Emp_conservacion { get; set; }
      
        
        [Column("Emp_equipamiento")]
        public string Emp_equipamiento { get; set; }
      
        
        [Column("Emp_servicios")]
        public string Emp_servicios { get; set; }
      
        
        [Column("Emp_higuiene")]
        public string Emp_higuiene { get; set; }
      
        
        [Column("Emp_SUCURP")]
        public string Emp_SUCURP { get; set; }
      
        
        [Column("Emp_SUJor")]
        public int? Emp_SUJor { get; set; }
      
        
        [Column("Emp_SUTipSal")]
        public int? Emp_SUTipSal { get; set; }
      
        
        [Column("Emp_SUCveUbi")]
        public string Emp_SUCveUbi { get; set; }
      
        
        [Column("Emp_SUCreINF")]
        public string Emp_SUCreINF { get; set; }
      
        
        [Column("Emp_SUCreDV")]
        public int? Emp_SUCreDV { get; set; }
      
        
        [Column("Emp_SUTipDsc")]
        public int? Emp_SUTipDsc { get; set; }
      
        
        [Column("Emp_SUIniDsc")]
        public DateTime? Emp_SUIniDsc { get; set; }
      
        
        [Column("Emp_SUValDsc")]
        public decimal? Emp_SUValDsc { get; set; }
      
        
        [Column("Emp_SUPrcDsc")]
        public decimal? Emp_SUPrcDsc { get; set; }
      
        
        [Column("Emp_SUSDIB")]
        public decimal? Emp_SUSDIB { get; set; }
      
        
        [Column("Emp_SUCons")]
        public int? Emp_SUCons { get; set; }
      
        
        [Column("Emp_SUTipMov")]
        public string Emp_SUTipMov { get; set; }
      
        
        [Column("Emp_SUFecMov")]
        public DateTime? Emp_SUFecMov { get; set; }
      
        
        [Column("Emp_SULTCod")]
        public int? Emp_SULTCod { get; set; }
      
        
        [Column("Emp_SUSDIF")]
        public decimal? Emp_SUSDIF { get; set; }
      
        
        [Column("Emp_SUSDIV")]
        public decimal? Emp_SUSDIV { get; set; }
      
        
        [Column("Emp_SUSDIN")]
        public decimal? Emp_SUSDIN { get; set; }
      
        
        [Column("Emp_SUSDITopDF")]
        public decimal? Emp_SUSDITopDF { get; set; }
      
        
        [Column("Emp_SUFacSal")]
        public decimal? Emp_SUFacSal { get; set; }
      
        
        [Column("Emp_SUPrcInf")]
        public decimal? Emp_SUPrcInf { get; set; }
      
        
        [Column("Emp_SUPrcEstado")]
        public decimal? Emp_SUPrcEstado { get; set; }
      
        
        [Column("Tsin_cod")]
        public string Tsin_cod { get; set; }
      
        
        [Column("Mb_Cod_Ban")]
        public string Mb_Cod_Ban { get; set; }
      
        
        [Column("Emp_ctacte")]
        public string Emp_ctacte { get; set; }
      
        
        [Column("Emp_CtaAdic")]
        public string Emp_CtaAdic { get; set; }
      
        
        [Column("DpCodigo")]
        public decimal? DpCodigo { get; set; }
      
        
        [Column("CtCodigo")]
        public int? CtCodigo { get; set; }
      
        
        [Column("Emp_declara")]
        public string Emp_declara { get; set; }
      
        
        [Column("Emp_PTU")]
        public string Emp_PTU { get; set; }
      
        
        [Column("Emp_mpco")]
        public int? Emp_mpco { get; set; }
      
        
        [Column("Emp_cuota_ahorro")]
        public decimal? Emp_cuota_ahorro { get; set; }
      
        
        [Column("Emp_bien")]
        public string Emp_bien { get; set; }
      
        
        [Column("Emp_etapa")]
        public int? Emp_etapa { get; set; }
      
        
        [Column("Emp_actualizado")]
        public int? Emp_actualizado { get; set; }
      
        
        [Column("Emp_Comisi")]
        public string Emp_Comisi { get; set; }
      
        
        [Column("Emp_DctoIm")]
        public string Emp_DctoIm { get; set; }
      
        
        [Column("Emp_CobObj")]
        public decimal? Emp_CobObj { get; set; }
      
        
        [Column("Emp_Despensa")]
        public decimal? Emp_Despensa { get; set; }
      
        
        [Column("Emp_Asistencia")]
        public decimal? Emp_Asistencia { get; set; }
      
        
        [Column("Vales_Cod")]
        public string Vales_Cod { get; set; }
      
        
        [Column("Pres_Grupo")]
        public int? Pres_Grupo { get; set; }
      
        
        [Column("Emp_categ")]
        public int? Emp_categ { get; set; }
      
        
        [Column("Emp_ahorro")]
        public decimal? Emp_ahorro { get; set; }
      
        
        [Column("Emp_pfija")]
        public decimal? Emp_pfija { get; set; }
      
        
        [Column("Emp_Ban_afore")]
        public string Emp_Ban_afore { get; set; }
      
        
        [Column("Emp_Cta_afore")]
        public string Emp_Cta_afore { get; set; }
      
        
        [Column("AreCodArea")]
        public int? AreCodArea { get; set; }
      
        
        [Column("Emp_fechanacimiento")]
        public DateTime? Emp_fechanacimiento { get; set; }
      
        
        [Column("Emp_sexo")]
        public string Emp_sexo { get; set; }
      
        
        [Column("Emp_estado_civil")]
        public string Emp_estado_civil { get; set; }
      
        
        [Column("Emp_foto")]
        public string Emp_foto { get; set; }
      
        
        [Column("Emp_tipco")]
        public int? Emp_tipco { get; set; }
      
        
        [Column("PsCodigo")]
        public decimal? PsCodigo { get; set; }
      
        
        [Column("Emp_PlzCod")]
        public int? Emp_PlzCod { get; set; }
      
        
        [Column("Emp_fefct")]
        public DateTime? Emp_fefct { get; set; }
      
        
        [Column("Emp_sueldo_mes")]
        public decimal? Emp_sueldo_mes { get; set; }
      
        
        [Column("Emp_tipcco")]
        public string Emp_tipcco { get; set; }
      
        
        [Column("Emp_tipjo")]
        public int? Emp_tipjo { get; set; }
      
        
        [Column("Emp_jor")]
        public string Emp_jor { get; set; }
      
        
        [Column("Emp_tipnv4")]
        public string Emp_tipnv4 { get; set; }
      
        
        [Column("Emp_carfec")]
        public DateTime? Emp_carfec { get; set; }
      
        
        [Column("Emp_catfec")]
        public DateTime? Emp_catfec { get; set; }
      
        
        [Column("Emp_CtaAux")]
        public string Emp_CtaAux { get; set; }
      
        
        [Column("Emp_imss")]
        public string Emp_imss { get; set; }
      
        
        [Column("Emp_DigVer")]
        public int? Emp_DigVer { get; set; }
      
        
        [Column("Emp_desltr")]
        public string Emp_desltr { get; set; }
      
        
        [Column("Emp_sueldo_fiscal")]
        public decimal? Emp_sueldo_fiscal { get; set; }
      
        
        [Column("Emp_Puntualidad")]
        public decimal? Emp_Puntualidad { get; set; }
      
        
        [Column("Emp_sueldo_base")]
        public decimal? Emp_sueldo_base { get; set; }
      
        
        [Column("Emp_sueldo_nfiscal")]
        public decimal? Emp_sueldo_nfiscal { get; set; }
      
        
        [Column("Emp_sueldo_efectivo")]
        public decimal? Emp_sueldo_efectivo { get; set; }
      
        
        [Column("Emp_descar")]
        public string Emp_descar { get; set; }
      
        
        [Column("Rol_cod")]
        public int? Rol_cod { get; set; }
      
        
        [Column("Emp_dignie")]
        public string Emp_dignie { get; set; }
      
        
        [Column("Emp_rut")]
        public string Emp_rut { get; set; }
      
        
        [Column("Emp_digito")]
        public string Emp_digito { get; set; }
      
        
        [Column("Emp_frec")]
        public DateTime? Emp_frec { get; set; }
      
        
        [Column("Emp_FecCon")]
        public DateTime? Emp_FecCon { get; set; }
      
        
        [Column("Emp_fevac")]
        public DateTime? Emp_fevac { get; set; }
      
        
        [Column("Emp_feprg")]
        public DateTime? Emp_feprg { get; set; }
      
        
        [Column("Emp_diavac")]
        public int? Emp_diavac { get; set; }
      
        
        [Column("Emp_vacprg")]
        public int? Emp_vacprg { get; set; }
      
        
        [Column("Emp_prgext")]
        public int? Emp_prgext { get; set; }
      
        
        [Column("Emp_FecAltaIMSS")]
        public DateTime? Emp_FecAltaIMSS { get; set; }
      
        
        [Column("Emp_fecha_ingreso")]
        public DateTime? Emp_fecha_ingreso { get; set; }
      
        
        [Column("Emp_fecfin")]
        public DateTime? Emp_fecfin { get; set; }
      
        
        [Column("ETCId")]
        public string ETCId { get; set; }
      
        
        [Column("Emp_sueldo_dia")]
        public decimal? Emp_sueldo_dia { get; set; }
      
        
        [Column("Emp_CtaSuc")]
        public string Emp_CtaSuc { get; set; }
      
        
        [Column("Emp_lpObra")]
        public string Emp_lpObra { get; set; }
      
        
        [Column("Emp_DrCiudad")]
        public string Emp_DrCiudad { get; set; }
      
        
        [Column("Emp_DrEstado")]
        public string Emp_DrEstado { get; set; }
      
        
        [Column("NMINEDID")]
        public int? NMINEDID { get; set; }
      
        
        [Column("Emp_lpco")]
        public decimal? Emp_lpco { get; set; }
      
        
        [Column("Emp_patern")]
        public string Emp_patern { get; set; }
      
        
        [Column("Emp_matern")]
        public string Emp_matern { get; set; }
      
        
        [Column("Emp_nombres")]
        public string Emp_nombres { get; set; }
      
        
        [Column("Est_cod")]
        public string Est_cod { get; set; }
      
        
        [Column("NMPLINID")]
        public int? NMPLINID { get; set; }
      
        
        [Column("Es_cod")]
        public string Es_cod { get; set; }
      
        
        [Column("Emp_CGCA01ID")]
        public string Emp_CGCA01ID { get; set; }
      
        
        [Column("Emp_CGCA02ID")]
        public string Emp_CGCA02ID { get; set; }
      
        
        [Column("Emp_CGCA03ID")]
        public string Emp_CGCA03ID { get; set; }
      
        
        [Column("Emp_CGCA04ID")]
        public string Emp_CGCA04ID { get; set; }
      
        
        [Column("Emp_CGCA05ID")]
        public string Emp_CGCA05ID { get; set; }
      
        
        [Column("Emp_CGCA06ID")]
        public string Emp_CGCA06ID { get; set; }
      
        
        [Column("Emp_CGCA07ID")]
        public string Emp_CGCA07ID { get; set; }
      
        
        [Column("Emp_CGCA08ID")]
        public string Emp_CGCA08ID { get; set; }
      
        
        [Column("Emp_CGCA09ID")]
        public string Emp_CGCA09ID { get; set; }
      
        
        [Column("Emp_CGCA10ID")]
        public string Emp_CGCA10ID { get; set; }
      
        
        [Column("Emp_ALIAS")]
        public string Emp_ALIAS { get; set; }
      
        
        [Column("Emp_GrupoNom")]
        public int? Emp_GrupoNom { get; set; }
      
        
        [Column("Emp_DC")]
        public decimal? Emp_DC { get; set; }
      
        
        [Column("Emp_CU")]
        public decimal? Emp_CU { get; set; }
      
        
        [Column("Emp_Fte")]
        public string Emp_Fte { get; set; }
      
        
        [Column("Emp_puesto")]
        public decimal? Emp_puesto { get; set; }
      
        
        [Column("Emp_EsMadre")]
        public string Emp_EsMadre { get; set; }
      
        
        [Column("Emp_EMail")]
        public string Emp_EMail { get; set; }
      
        
        [Column("Emp_JefeInm")]
        public int? Emp_JefeInm { get; set; }
      
        
        [Column("Emp_JefeCia")]
        public decimal? Emp_JefeCia { get; set; }
      
        
        [Column("Emp_cncdir")]
        public decimal? Emp_cncdir { get; set; }
      
        
        [Column("NMTPPLZID")]
        public string NMTPPLZID { get; set; }
      
        
        [Column("Emp_LyEsRN")]
        public string Emp_LyEsRN { get; set; }
      
        
        [Column("Emp_PswEnc")]
        public string Emp_PswEnc { get; set; }
      
        
        [Column("Emp_Key")]
        public string Emp_Key { get; set; }
      
        
        [Column("Emp_pwd")]
        public string Emp_pwd { get; set; }
      
        
        [Column("Emp_Ctrl")]
        public int? Emp_Ctrl { get; set; }
      
        
        [Column("NmSucID")]
        public decimal NmSucID { get; set; }
      
        
        [Column("GSangId")]
        public int? GSangId { get; set; }
      
        
        [Column("Emp_tel4")]
        public string Emp_tel4 { get; set; }
      
        
        [Column("Emp_tel3")]
        public string Emp_tel3 { get; set; }
      
        
        [Column("Emp_tel2")]
        public string Emp_tel2 { get; set; }
      
        
        [Column("EMP01ID")]
        public string EMP01ID { get; set; }
      
        
        [Column("EMP02ID")]
        public string EMP02ID { get; set; }
      
        
        [Column("EMP_RFC_TMP")]
        public string EMP_RFC_TMP { get; set; }
      
        
        [Column("EMP_CURP_TMP")]
        public string EMP_CURP_TMP { get; set; }
      
        
        [Column("Id_Horario")]
        public int? Id_Horario { get; set; }
      
        
        [Column("wDespensaEfvo")]
        public int? wDespensaEfvo { get; set; }
      
        
        [Column("wDespensapor")]
        public int? wDespensapor { get; set; }
      
        
        [Column("emp_edo")]
        public string emp_edo { get; set; }
      
        
        [Column("EMP_FECFIN2")]
        public DateTime? EMP_FECFIN2 { get; set; }
      
        
        [Column("Emp_fecnss")]
        public DateTime? Emp_fecnss { get; set; }
      
        
        [Column("Emp_gratif")]
        public decimal? Emp_gratif { get; set; }
      
        
        [Column("Emp_CandBan")]
        public string Emp_CandBan { get; set; }
      
        
        [Column("Emp_asignacion")]
        public string Emp_asignacion { get; set; }
      
        
        [Column("Emp_segmento")]
        public string Emp_segmento { get; set; }
      
        
        [Column("Emp_jefedirecto")]
        public string Emp_jefedirecto { get; set; }
      
        
        [Column("Emp_tarjetavales")]
        public string Emp_tarjetavales { get; set; }
      
        
        [Column("Emp_Esc_cod")]
        public int? Emp_Esc_cod { get; set; }
      
        
        [Column("Emp_coordinador")]
        public int? Emp_coordinador { get; set; }
      
        
        [Column("Emp_Enc_Nomina")]
        public string Emp_Enc_Nomina { get; set; }
      
        
        [Column("Emp_Cont_num")]
        public int? Emp_Cont_num { get; set; }
      
        
        [Column("Est_cod_fin")]
        public string Est_cod_fin { get; set; }
      
        
        [Column("Exp_Validado")]
        public string Exp_Validado { get; set; }
      
        
        [Column("Cvecli")]
        public string Cvecli { get; set; }
      
        
        [Column("Est_nom_apl")]
        public string Est_nom_apl { get; set; }
      
        
        [Column("IdBancario")]
        public string IdBancario { get; set; }
      
        
        [Column("Est_empl_finiquito")]
        public string Est_empl_finiquito { get; set; }
      
        
        [Column("IdEmpVR")]
        public decimal? IdEmpVR { get; set; }
      
        
        [Column("Tipo_Traspaso")]
        public string Tipo_Traspaso { get; set; }
      
        
        [Column("Emp_nie_ant")]
        public int? Emp_nie_ant { get; set; }
      
        
        [Column("Regimen")]
        public int? Regimen { get; set; }
      
        
        [Column("Sindicato")]
        public int? Sindicato { get; set; }
      
        
        [Column("Mb_Cod_Ban2")]
        public string Mb_Cod_Ban2 { get; set; }
      
        
        [Column("Emp_ctacte2")]
        public string Emp_ctacte2 { get; set; }
      
        
        [Column("Emp_CtaAdic2")]
        public string Emp_CtaAdic2 { get; set; }
      
        
        [Column("ID_SISTEMA_CARTERA")]
        public int? ID_SISTEMA_CARTERA { get; set; }
      
        
        [Column("ID_SISTEMA_PRESPER")]
        public int? ID_SISTEMA_PRESPER { get; set; }
      
        
        [Column("PsCodigoSal")]
        public int? PsCodigoSal { get; set; }
      
        
        [Column("PuestoFiscal")]
        public string PuestoFiscal { get; set; }
      
        
        [Column("Emp_SUImpDsc")]
        public decimal? Emp_SUImpDsc { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("IdSucRenta")]
        public decimal? IdSucRenta { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("PuestoNomina")]
        public string PuestoNomina { get; set; }
      
        
        [Column("PuestoCV")]
        public int? PuestoCV { get; set; }
      
        
        [Column("Id")]
        public int? Id { get; set; }
      
        
        [Column("Ocupacion")]
        public string Ocupacion { get; set; }
      
        
        [Column("PuestoFinanciera")]
        public bool? PuestoFinanciera { get; set; }
      
        
        [Column("EsPromotor")]
        public bool? EsPromotor { get; set; }
      
        
        [Column("EsCoordinador")]
        public bool? EsCoordinador { get; set; }
      
        
        [Column("EsCajero")]
        public bool? EsCajero { get; set; }
      
        
        [Column("EsGestor")]
        public bool? EsGestor { get; set; }
      
        
        [Column("EsDirector")]
        public bool? EsDirector { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
