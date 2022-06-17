using Amazon.Chime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chime.HelperService
{
    public interface IChimeClientService
    {
        AmazonChimeClient GetChimeClient();
    }
}
