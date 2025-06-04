using System.Text;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia;

/// <summary>
/// Controlador para manejar las rutinas de seguridad:
/// Login
/// Validate
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CatalogosController : ControllerBase
{
    /// <summary>
    /// Conexion a base de datos
    /// </summary>
    private DBConfiaContext ConeccionBD;

    /// <summary>
    /// Constructor del controlador
    /// </summary>
    /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
    public CatalogosController(IConfiguration _Configuration, DBConfiaContext _ConexionBD)
    {
        this.ConeccionBD = _ConexionBD;
    }

}

