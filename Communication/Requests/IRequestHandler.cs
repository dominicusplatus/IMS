using System;
namespace Communication.Requests
{
    public interface IConcreteRequestResponseProvider : IObserver<IConcreteRequest>
    {
    }

    public class ConcreteRequestResponseProviderDecorator : IConcreteRequestResponseProvider
    {
        private IConcreteRequestResponseProvider _provider;

        public ConcreteRequestResponseProviderDecorator(IConcreteRequestResponseProvider provider)
        {
            _provider = provider;
        }

        public void OnCompleted()
        {
            _provider.OnCompleted();
        }

        public void OnError(Exception error)
        {
           _provider.OnError(error);
        }

        public void OnNext(IConcreteRequest value)
        {
           _provider.OnNext(value);
        }
    }

}
