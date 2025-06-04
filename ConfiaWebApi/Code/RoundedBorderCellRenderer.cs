using iText.Layout.Element;
using iText.Layout.Renderer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Code
{
   
    public class RoundedBorderCellRenderer : CellRenderer
    {
        public RoundedBorderCellRenderer(Cell modelElement) : base(modelElement)
        {

        }

        public override void Draw(DrawContext drawContext)
        {
            drawContext.GetCanvas().RoundRectangle(GetOccupiedAreaBBox().GetX() + 1.5f, GetOccupiedAreaBBox().GetY() + 1.5f,
                    GetOccupiedAreaBBox().GetWidth() - 3, GetOccupiedAreaBBox().GetHeight() - 3, 4);
            drawContext.GetCanvas().Stroke();
            base.Draw(drawContext);
        }
    }

}
