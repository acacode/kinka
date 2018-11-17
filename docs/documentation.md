
# Documentation

Here is all public documentation about kinka.

If you didn't find the answer on your question don't be shy to [post your question here](https://github.com/acacode/kinka/issues)


Kinka have two versions: **development** and **production** (~4KB)

For using production version needs set environment variable `NODE_ENV` to `production`
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
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>body?: any</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
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
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
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
    <td colspan="3"> <b>RequestOptions: object</b></td>
  </tr>
  <tr>
    <td>Property</td>
    <td>Default value</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>
        <b>query?: object</b>
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        query params for your http request<br>
        example:<br>
    <pre><code>
kinka.get('/all', { 
    query: { 
        disabled: true, 
        sortBy: 'date' 
    }})
// endpoint will be {{baseURL}}/all?disabled=true&sortBy=date
    </code></pre>	  
  </td>
  </tr>
  <tr>
    <td>
        <b>abortableKey?:string</b>
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        With abortable key your request have ability to cancel last request if request with the same key is start launching
    </td>
  </tr>
  <tr>
    <td>
        <b>omitCatches?: bool</b>
    </td>
    <td>
        <code>instance.omitCatches | true</code>
    </td>
    <td>
        With <code>true</code> value your responses will not be throwing exceptions and you don't need to wrap your requests in <code>try/catch</code>.<br>
        And if you want to catch exception you can get this from <code>response.err</code> or <code>response.isError</code><br>
        Example:<br>
  <pre><code>
const { err, status } = await kinka.get('/bad-request')
if(err){
    // catched exception
}
  </code></pre>	  
  <span>Otherwise:<span>
  <pre><code>
try{
    const { data } = await kinka.get('/bad-request')
}catch(e){
    // catched exception
}
  </code></pre>
  </td>
  </tr>
  <tr>
    <td>
        <b>withAuth?: bool</b>
    </td>
    <td>
        <code>false</code>
    </td>
    <td>
        Indicates that this request should use credentials (like cookies or specific auth headers)<br>
        Sets flag <code>withCredentials</code><br>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials">Read more about it is here...</a>
    </td>
  </tr>
  <tr>
    <td>
        <b>headers?: object</b>
    </td>
    <td>
        <code>instance.omitCatches | undefined</code>
    </td>
    <td>
        Sets request headers<br>
        Example:<br>
    <pre><code>
await kinka.get('/donuts/all', { 
    headers: { 
        ['Specific-Header']: 'arrgghhh' 
    } 
})
    </code></pre>
    </td>
  </tr>
  <tr>
    <td>
        <b>body?: any</b>
    </td>
    <td>undefined</td>
    <td>
        Sets the request body. It is content which needed to send on server
    </td>
  </tr>
  <tr>
    <td>
        <b>timeout?: number</b>
    </td>
    <td>0</td>
    <td>
        Sets the number of milliseconds after which request automatically will be terminated. 0 value means no timeout.<br>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout">Read more about it is here...</a>
    </td>
  </tr>
</table>
<!-- [api](https://github.com/acacode/kinka/blob/master/README.md) -->


# Examples

```
import kinka from 'kinka'

kinka.get('https://test-api.com/users').then(response => {
  // GET: https://test-api.com/users
  if (!response.err) {
    console.log(response.data)
  }
})
```

```
import kinka from 'kinka'

const api = kinka.create({ baseURL: 'https://test-api.com' })

api.get('/users').then(response => {
  // GET: https://test-api.com/users
  if (!response.err) {
    console.log(response.data)
  }
})
```

```
import kinka from 'kinka'

const api = kinka.create({ baseURL: 'https://test-api.com' })

api
  .post(
    '/users',
    {
      firstName: 'David',
      lastName: 'Bowie',
    },
    {
      query: { as: 'admin' },
    }
  )
  .then(({ err, isSuccess, data }) => {
    // POST: https://test-api.com/users
    if (!err && isSuccess) {
      // err = undefined, isSuccess = true
      console.log(data) // response data
    }
  })
```

```
import kinka from 'kinka'

const api = kinka.create({ baseURL: 'https://test-api.com' })

const getUsers = () =>
  api.get('/users', {
    query: {
      queryParam1: 1,
      queryParam2: 'test',
      queryParam3: false,
    },
    abortableKey: 'usersAbortableKey',
    headers: {
      'Specific-Header': 'some header data',
    },
  })

const test = async () => {
  const users = await api.all([getUsers(), getUsers(), getUsers()])
  // all requests will be GET: https://test-api.com/users?queryParam1=1&queryParam2=test&queryParam3=false
  // first and second requests has been catched because for each one specified same param 'abortableKey'
  if (users[0].err && users[1].err && !users[2].err) {
    const data = users[2].data
    console.log('data', data)
  }
}

test()
```