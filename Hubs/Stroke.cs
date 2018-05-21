using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRDrawing.Hubs
{
    public class Stroke
    {
        public Point Start { get; set; }
        public Point End { get; set; }
        public string Color { get; set; }
    }
}
