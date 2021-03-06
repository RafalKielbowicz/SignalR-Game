﻿using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRDrawing.Hubs
{
    public class DrawHub : Hub
    {
        private static ConcurrentBag<Stroke> strokes = new ConcurrentBag<Stroke>();
        public async Task NewStroke(Point start, Point end, string color)
        {
            var task = Clients.Others.SendAsync("newStroke", start, end, color);
            strokes.Add(new Stroke
            {
                Start = start,
                End = end,
                Color = color
            });
            await task;
        }

        public async Task ClearCanvas()
        {
            var task = Clients.Others.SendAsync("clearCanvas");
            strokes.Clear();
            await task;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("clearCanvas");
            var tasks = strokes.Select(s => Clients.Caller.SendAsync("newStroke", s.Start, s.End, s.Color));
            await Task.WhenAll(tasks);
        }
        //chat
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
