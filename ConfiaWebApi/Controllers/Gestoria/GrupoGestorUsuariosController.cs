using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Gestoria
{
    [Authorize]
    [ApiController]
    [Route("api/Gestoria/[controller]")]
    public class GrupoGestorUsuariosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GrupoGestorUsuariosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
    }
}
