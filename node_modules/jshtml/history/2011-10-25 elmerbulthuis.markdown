2011-10-25
==========

Very rainy outside... A good day to try out my new Vespa hotcover!


Breaking change
----------

When in tag-mode the first tag should also be the last tag, and the first tags should be balanced. This wil no longer work:
	
	if(true)
		<b><a><l><a><n><c><e>
		does not work!
		</b></a></l></a></n></c></e>
	
use this instead
	
	if(true)
		<text>
		<b><a><l><a><n><c><e>
		does work!
		</b></a></l></a></n></c></e>
		</text>
	
but don't do this:
	
	if(true)
		<text>
		<b><a><l><a><n><c><e>
		<text>
		does not work!
		</b></a></l></a></n></c></e>
		</text>
	
do this:
	
	if(true)
		<text>
		<b><a><l><a><n><c><e>
		<text>
		does work!
		</b></a></l></a></n></c></e>
		</text>
	
and now for the good news,


New feature
----------

text tags can now be nested, they will never be displayed.

this:
	
	<text>
	a
	<text>
	b
	</text>
	</text>

prints
	
	a
	b
	

New feature
----------

Not every tag has to be closed, only the tags that have the same name as the opening name of the tag-block.

this is now possible:
	
	if(true)
		<p>
		<img src="yeah.gif" alt="yeah">
		</p>
	
but beware, this is not ok, because img is the opening tag, and we are not closing it...

	if(true)
		<img src="yeah.gif" alt="yeah">

this is also ok:
	
	if(true)
		<span>
		<input type="checkbox" name="yeah" value="yeah">
		<span>
		<img src="yeah.gif" alt="yeah">
		</span>
		</span>
	
this is not, because the first tag is a span tag and it is opened twice. because input and img are not the first tag, they don't have to be closed.
	
	if(true)
		<span>
		<input type="checkbox" name="yeah" value="yeah">
		<span>
		<img src="yeah.gif" alt="yeah">
		</span>
	
let me know what you think about this feature!

gr.

	

Release
----------

release 0.2.1 to npm


