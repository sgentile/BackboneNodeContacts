2011-10-13
==========

Sunny with a few clouds @ Rotterdam, Holland

Breaking change
----------

require ; after dowhile. this

	do	{
	<p>bla</p>
	} while(false)

no longer works, and should be converted to this:

	do	{
	<p>bla</p>
	} while(false);
	

New feature
----------

control brackets are no longer required, so this:

	if(true)	{
		<p>true</p>
	}
	else	{
		<p>false</p>
	}

could now also be written as this:

	if(true)
		<p>true</p>
	else
		<p>false</p>


Breaking change
----------

removed with(locals) statement from the function body. this:

	<html>
	<head>
	<title>@title</title>
	</head>
	<body>
	</body>

should now be written as this:

	<html>
	<head>
	<title>@locals.title</title>
	</head>
	<body>
	</body>

or this:

	@with(locals)
	<html>
	<head>
	<title>@title</title>
	</head>
	<body>
	</body>


Breaking change
----------
Removed the whitespace filter option. It was a little buggy. Maybe it will return in the future, when there is a need.


Release
----------
version 0.1.5 to npm


New feature
----------
You can now use the (async) templates via require! great!




