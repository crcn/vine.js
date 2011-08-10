//meh, shit's ugly.

function combineArrays(c1,c2,target,property)
{
	var c1p = c1[property];
		c2p = c2[property];
		
	if(!c1p && !c2p) return;
	
	c1p = c1p || [];
	c2p = c2p || [];
	
	
	c1p = c1p instanceof Array ? c1p : [c1p];
	c2p = c2p instanceof Array ? c2p : [c2p];
	
	target[property] = c1p.concat(c2p);
}

function _buildMessage()
{
	var msg = arguments[0];
	
	for(var i = 1, n = arguments.length; i < n; i++)
	{
		msg = msg.replace(/%\w/, arguments[i]);
	}
	
	return msg;
}


var Vine = 
{

	/**
	 */
	 
	setApi: function(request)
	{
		request.api = Vine.api(request);
		
		return request;
	},

	/**
	 */

	api: function(request,methods,data)
	{
		if(!data) data = {};
		
		var methods  = methods || {};
		

		var invoker = 
		{

			/**
			 */

			error: function()
			{
				if(arguments.length == 0) return data.errors;
				
				if(!data.errors) data.errors = [];
				
				data.errors.push({ message: _buildMessage.apply(null, arguments)});
				return this;
			},

			/**
			 * the type of data. Used for 
			 */

			type: function(type)
			{
				data.type = type;
			},

			/**
			 */
			 
			warning: function()
			{
				if(arguments.length == 0) return data.warnings;
				
				if(!data.warnings) data.warnings = [];
				
				data.warnings.push({ message: _buildMessage.apply(null, arguments)});
				return this;
			},
			
			/**
			 */
			 
			combine: function(api)
			{
				var thisData = data,
					thatData = api.data || api,
					newData = {};
					
				for(var i in thisData) newData[i] = thisData;
				
				combineArrays(thisData,thatData,newData,'errors');
				combineArrays(thisData,thatData,newData,'warnings');
				combineArrays(thisData,thatData,newData,'result');
				
				return Vine.api(null,null,newData);
			},

			/**
			 */
			 

			redirect: function(to)
			{
				if(to == undefined) return data.redirect;
				
				data.redirect = to;
				return this;
			},

			/**
			 */
			 
			message: function(msg)
			{
				if(!msg) return data.message;
				
				data.message = _buildMessage.apply(null, arguments);
				return this;
			},

			/**
			 */
			 
			result: function(result)
			{
				if(result == undefined) return data.result;
				
				data.result = result;
				return this;
			},

			/**
			 */
			 
			results: function(result)
			{
				if(result == undefined) return data.result;
				
				if(!(data.result instanceof Array)) data.result = [];
				data.result.push(result);
				return this;
			},
			
			/**
			 */
			 
			ttl:function(ttl)
			{
				if(ttl > -1)
					data.ttl = ttl;
					
				return this;
			},

			/**
			 * deprecated
			 */
			 
			send: function(request)
			{		
				request.display('json',data);
			},

			/**
			 */
			 
			end: function(target)
			{

				if(target) target.end(data);
				

				return data;
			},

			/**
			 */
			 
			toJSON: function()
			{
				return invoker.data;
			}
		}
		
		invoker.data = data;


		return invoker;

	}
}

exports.api = Vine.api;


['error','warning','combine','redirect','message','result','results','ttl'].forEach(function(method)
{
	exports[method] = function()
	{
		var api = exports.api();
		
		return api[method].apply(api, arguments);
	}
});


