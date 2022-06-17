using Amazon;
using Amazon.Chime;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chime.HelperService
{
    public class ChimeClientService : IChimeClientService
    {
        public IConfiguration Configuration { get; }

        private readonly AmazonChimeClient chimeClient;

        public ChimeClientService(IConfiguration configuration)
        {
            Configuration = configuration;
            chimeClient = new AmazonChimeClient(Configuration["Chime:awsAccessKeyId"], Configuration["Chime:awsSecretAccessKey"], RegionEndpoint.APSoutheast1);
        }

        public AmazonChimeClient GetChimeClient()
        {
            return chimeClient;
        }
    }
}
