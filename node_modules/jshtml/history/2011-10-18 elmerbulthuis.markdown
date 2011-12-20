2011-10-18
==========

Raining in Den Haag. Today I take my first MSTC exam (and passed it).


Breaking change
----------

use writeBody() / writePartial(view) instead of body() and partial(view).

and remember, this:

	@{
	writePartial('header');
	writeBody();
	}

or this:

	@writePartial('header');
	@writeBody();

but this

	@writePartial('header')
	@writeBody()

is bad!



Bugfix
----------

I was using JSON.encode instead of JSON.parse in the unit tests. Very stupid indeed.



New feature
----------

the 'with' option allows you to set a default context for your views. Check out the 'defaultWith' example.

now it is possible to set the locals variable as the default with context. You may write the following

	<html>
	<title>@locals.title</title>
	<body>
		@locals.message
	</body>
	</html>

as

	<html>
	<title>@title</title>
	<body>
		@message
	</body>
	</html>

by setting the with option to 'locals'. It is also possible to use multiple context, for example ['locals', 'this'] will result in something like this:

	with(this)
	with(locals)	{
		/*
		compiled jshtml template
		*/
	}

now references to variables will first search 'locals', then 'this'.

So, hear yo think, why is the default value of the with option not 'locals'? The answer is consistency. If you use a function in your templates, which you will certainly do in async scenario's, the with context is lost.

This will work as expected

	var o = {a:1, b:2}
	function c()	{
		return o.a + o.b;
	}
	var result = c(); //result = 3
	
this will work as expected

	var a = 1;
	var b = 2;
	function c()	{
		return a + b;
	}
	var result = c(); //result = 3

but this won't

	var o = {a:1, b:2}
	with(o)	{
		function c()	{
			return a + b;
		}
		var result = c(); //result != 3
	}
	
If with(locals) is default it may seem like all of locals members are really locals (as in scenario 2) but they are not. Setting the context explicitly makes you aware of that.



