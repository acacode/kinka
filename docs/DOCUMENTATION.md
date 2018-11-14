
# Documentation

Here is all public documentation about kinka.

If you not found answer on your question don't be shy to [post your question here](https://github.com/acacode/kinka/issues)


Kinka have two versions: **development** and **production** (~4KB)
For using production version needs set environment variable `NODE_ENV` to 'production`
```
process.env.NODE_ENV = 'production'
```

## Kinka instance

<table>
  <tr>
    <td colspan="3"> <b>kinka['property']</b></td>
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
        <br><code>path: MethodPath</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
	      create request with <code>GET</code> method. <hr>
	      returns <code>Promise&lt;Response&gt; </code>
   </td>
  </tr>
  <tr>
    <td>
        <b>options</b>
    </td>
  	<td>
        <br><code>path: MethodPath</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
	      create request with <code>OPTIONS</code> method. <hr>
	      returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>head</b>
    </td>
    <td> 
        <br><code>path: MethodPath</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with <code>HEAD</code> method. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>put</b>
    </td>
    <td>
        <br><code>path: MethodPath</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with <code>PUT</code> method. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>post</b>
    </td>
    <td>
        <br><code>path: MethodPath</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with <code>POST</code> method. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>patch</b>
    </td>
    <td>
        <br><code>path: MethodPath</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with <code>PATCH</code> method. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>delete</b>
    </td>
	  <td>
        <br><code>path: MethodPath</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with <code>DELETE</code> method. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
    </td>
  </tr>
  <tr>
    <td>
        <b>custom</b>
    </td>
    <td>
        <br><code>method: string</code>, 
        <br><code>path: MethodPath</code>, 
        <br><code>options?: MethodOptions</code>
    </td>
    <td>
        create request with custom method name. <hr>
        returns <code>Promise&lt;Response&gt; </code>    
   </td>
  </tr>
  <tr>
    <td>
        <b>create</b>
    </td>
    <td>
        <br><code>options?: InstanceOptions</code>
    </td>
    <td>
	      create new kinka instance with your own options.<br>
	      example: <br>
	  
	const api = kinka.create({baseURL: 'myapi.com'})
	api.get('/all') // GET: myapi.com/all promise
	  
  <hr> returns <code>Kinka</code>
  </td>
  </tr>
</table>


## Interfaces


<table>
  <tr>
    <td colspan="3"> <b>MethodPath: string</b></td>
  </tr>
  <tr>
    <td colspan="3">
      Can have value like <code>/your-endpoint</code> or with full path <code>http://myapi.com/your-endpoint</code>. <br>
      If you are use not own kinka instance:<br>
      value '<code>/your-endpoint</code>' will have full path '<code>{{location.origin}}/your-endpoint</code>'.<br>
      (example: <code>http:localhost:3000/your-endpoint</code>).<br>
      But if you was created your own kinka instance with <code>baseURL</code>:<br>
      (<code>const api = kinka.create({ baseURL: 'http://myapi.com' })</code>)<br>
      value '<code>/your-endpoint</code>' will have full path '<code>http://myapi.com/your-endpoint</code>'
    </td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"> <b>MethodOptions: object</b></td>
  </tr>
  <tr>
    <td>Property</td>
    <td>Default value</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>
        <b>query: object</b>
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        query params for your http request<br>
        example:<br>
	  
	kinka.get('/all', { query: { disabled: true, sortBy: 'date' } })
	// endpoint will be {{baseURL}}/all?disabled=true&sortBy=date
	  
  </td>
  </tr>
  <tr>
    <td>
        <b>abortableKey:string</b>
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        With abortable key your request have the ability cancelation last request if request with the same key is start launching
    </td>
  </tr>
  <tr>
    <td>
        <b>omitCatches</b>
    </td>
    <td>
        <code>instance.omitCatches | true</code>
    </td>
    <td>
        With <code>true</code> value your responses will not be throwing exceptions and you don't needed wrap your requests in <code>try/catch</code>.<br>
        And if you want catch your request exception you can get this from <code>response.err</code> or <code>response.isError</code><br>
        Example:<br>  
	  
	const { err, status } = await kinka.get('/bad-request')
	if(err){
	    // catched exception 
	} 
	  	  
  <span>Otherwise:<span>

      
      try{
        const { data } = await.kinka.get('/bad-request')
      }catch(e){
        // catched exception
      }
      

  </td>
  </tr>
  <tr>
    <td>
        <b>withAuth</b>
    </td>
    <td>
        <code>false</code>
    </td>
    <td>not yet</td>
  </tr>
  <tr>
    <td>
        <b>headers?: object</b>
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>not yet</td>
  </tr>
  <tr>
    <td>
        <b>body</b>
    </td>
    <td>undefined</td>
    <td>not yet</td>
  </tr>
</table>
<!-- [api](https://github.com/acacode/kinka/blob/master/README.md) -->
