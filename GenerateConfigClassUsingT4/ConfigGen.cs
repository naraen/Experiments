


using System.Configuration;
using System.Diagnostics;

namespace ConfigClassGen
{
    partial class Config
    {
        private static Config thisInstance;
        private void OnCreate();

        static Config() {
            thisInstance = new Config();
        }

        public static Config GetInstance() {
            return thisInstance;
        }

        private Config() {
			PollingInterval=ConfigurationManager.AppSettings["pollingInterval"];
GCMServerAPIKey=ConfigurationManager.AppSettings["GCMServerAPIKey"];
GCMSenderId=ConfigurationManager.AppSettings["GCMSenderId"];
AndroidApplicationPackageName=ConfigurationManager.AppSettings["AndroidApplicationPackageName"];
RestAPIBase=ConfigurationManager.AppSettings["RestAPIBase"];
RestAPIAdminKey=ConfigurationManager.AppSettings["RestAPIAdminKey"];
           
            this.TraceSource = new TraceSource("WellPepper");
        }

		public string PollingInterval{ get;private set;} 
public string GCMServerAPIKey{ get;private set;} 
public string GCMSenderId{ get;private set;} 
public string AndroidApplicationPackageName{ get;private set;} 
public string RestAPIBase{ get;private set;} 
public string RestAPIAdminKey{ get;private set;} 
    }
}
