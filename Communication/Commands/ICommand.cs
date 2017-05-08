using System;
using System.Collections.Generic;
using System.Text;

namespace Communication.Commands
{
    public interface ICommand<out TPin, in TPout>
    {
         string Id { get; set; }
         string Message { get; set; }
         int Lifetime { get; set; }
         bool ExceptsResults { get; set; }
         TPin GetCommandParameter();
         void SetExpectedPrototype(TPout prototype);
    }
}
