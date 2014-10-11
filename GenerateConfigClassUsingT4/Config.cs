using System.Diagnostics;

namespace ConfigClassGen
{
    partial class Config
    {
        partial void OnCreate() {
            this.TraceSource = new TraceSource("SomeSource");
        }

        public TraceSource TraceSource { get; private set; }
    }
}
