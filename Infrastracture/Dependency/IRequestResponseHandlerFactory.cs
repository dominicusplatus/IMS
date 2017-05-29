﻿using System;
using Communication.Requests;

namespace Infrastracture.Dependency
{
    public interface IRequestResponseHandlerFactory
	{
		T GetHandler<T>() where T : IConcreteRequestResponseProvider;
	}

	public class HandlerFactory : IRequestResponseHandlerFactory
	{
		public T GetHandler<T>() where T : IConcreteRequestResponseProvider
		{
			return (T)Activator.CreateInstance(typeof(T));
		}
	}
}
