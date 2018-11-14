
# Documentation

Here is all public documentation about kinka.

If you not found answer on your question don't be shy to [post your question here](https://github.com/acacode/kinka/issues)


## Kinka instance

<table>
  <tr>
    <td colspan="3" align="center"> <code>kinka['property']</code></td>
  </tr>
  <tr>
    <td>Name</td>
    <td>Options</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>
        <b>get</b>
    </td>
	<td>
        <br><code>path: string</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
	    create request with <code>GET</code> method. <hr>
	    returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td>
        <b>options</b>
    </td>
	<td>
        <br><code>path: string</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
	    create request with <code>OPTIONS</code> method. <hr>
	    returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>head</td>
	<td>[ 
    <br><code>path: string</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with <code>HEAD</code> method. <hr>
	    returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>put</td>
	<td>[ 
    <br><code>path: string</code>, 
    <br><code>body?: any</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with <code>PUT</code> method. <hr>
		returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>post</td>
    <td>[ 
    <br><code>path: string</code>, 
    <br><code>body?: any</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with <code>POST</code> method. <hr>
		returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>patch</td>
    <td>[ 
    <br><code>path: string</code>, 
    <br><code>body?: any</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with <code>PATCH</code> method. <hr>
		returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>delete</td>
	<td>[ 
    <br><code>path: string</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with <code>DELETE</code> method. <hr>
	    returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>custom</td>
    <td>[ 
    <br><code>method: string</code>, 
    <br><code>path: string</code>, 
    <br><code>options?: MethodOptions</code>
    <br> ]
    </td>
    <td>
	    create request with custom method name. <hr>
		returns <code>Promise &lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td><b>create</td>
    <td>[
    <br><code>options?: InstanceOptions</code>
    <br> ]
    </td>
    <td>
	    create new kinka instance with your own options.<br>
	example: <br>
	<code style="display:block; white-space: pre-wrap;">
	 const api = kinka.create({baseURL: 'myapi.com'}) <br>
	 api.get('/all') // GET: myapi.com/all promise
    </code>
    <hr> returns <code>Kinka</code>
   </td>
  </tr>
</table>

<!-- 
## Interfaces


<table>
  <tr>
    <td colspan="3"> <code>kinka['property']</code></td>
  </tr>
  <tr>
    <td>Name</td>
    <td>Options</td>
    <td>Description</td>
  </tr>
  <tr>
    <td><b>get</td>
    <td>see </td>
    <td>Two</td>
  </tr>
</table>
-->
<!-- [api](https://github.com/acacode/kinka/blob/master/README.md) -->