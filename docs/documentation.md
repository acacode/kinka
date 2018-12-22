
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
    <td colspan="4"> <b>kinka['name'](options)</b></td>
  </tr>
  <tr>
    <td>Name</td>
    <td>Options</td>
    <td>Returns</td>
    <td>Description</td>
  </tr>
  <tr>
    <td><b>abort</b></td>
    <td>
        <code>abortableKey: string</code>
    </td>
    <td><code>undefined</code></td>
    <td>
	      abort request by abortable key<br>
	      example: <br>
	  
	kinka.get('/users', { abortableKey: 'usersKey' })
	kinka.abort('usersKey')
	//GET:/users request will been canceled
	  
  </td>
  </tr>
  <tr>
    <td><b>all</b></td>
    <td>
        <code>requests: Array&lt;Promise&gt;</code>
    </td>
    <td><code>Promise&lt;Response[]&gt;</code></td>
    <td>
          It method can helps if needed to wait more than one request<br>
	      Return a promise that is fulfilled when all the items in the array are fulfilled.<br>
	      example: <br>
	  
	const [friends, family, donuts] = await kinka.all([
	  kinka.get('/friends'),
	  kinka.get('/family'),
	  kinka.get('/donuts'),
	])
	console.log(friends.data)
	console.log(family.data)
	console.log(donuts.data)
	  
  </td>
  </tr>
  <tr>
    <td><b>create</b></td>
    <td>
        <code>options?: InstanceOptions</code>
    </td>
	<td><code>Kinka</code></td>
    <td>
	      create new kinka instance with your own options.<br>
	      example: <br>
	  
	const api = kinka.create({baseURL: 'myapi.com'})
	api.get('/all') // GET: myapi.com/all promise
	  
  </td>
  </tr>
  <tr>
    <td><b>custom</b></td>
    <td>
        <code>method: string</code>, 
        <br><code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
        create request with custom method name.
   </td>
  </tr>
  <tr>
    <td><b>delete</b></td>
	<td>
        <code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
        create request with <code>DELETE</code> method.
    </td>
  </tr>
  <tr>
    <td><b>get</b></td>
	<td>
        <code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
	      create request with <code>GET</code> method.
   </td>
  </tr>
  <tr>
    <td><b>head</b></td>
    <td> 
        <code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
        create request with <code>HEAD</code> method.
    </td>
  </tr>
  <tr>
    <td><b>options</b></td>
  	<td>
        <code>path: string</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
	      create request with <code>OPTIONS</code> method.
    </td>
  </tr>
  <tr>
    <td><b>patch</b></td>
    <td>
        <code>path: string</code>, 
        <br><code>data?: any</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
        create request with <code>PATCH</code> method.
    </td>
  </tr>
  <tr>
    <td><b>post</b></td>
    <td>
        <code>path: string</code>, 
        <br><code>data?: any</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td><code>Promise&lt;Response&gt;</code></td>
    <td>
        create request with <code>POST</code> method.
    </td>
  </tr>
  <tr>
    <td>
        <b>put</b>
    </td>
    <td>
        <code>path: string</code>, 
        <br><code>data?: any</code>, 
        <br><code>options?: RequestOptions</code>
    </td>
	<td>
        <code>Promise&lt;Response&gt;</code>
    </td>
    <td>
        create request with <code>PUT</code> method.
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
    <td>Default</td>
    <td>Description</td>
  </tr>
  <tr>
    <td><b>query?: object</b></td>
    <td><code>undefined</code></td>
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
    <td><b>abortableKey?:string</b></td>
    <td><code>undefined</code></td>
    <td>
        With abortable key your request have ability to cancel last request if request with the same key is start launching
    </td>
  </tr>
  <tr>
    <td><b>omitCatches?: bool</b></td>
    <td><code>instance.omitCatches | true</code></td>
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
    <td><b>withAuth?: bool</b></td>
    <td><code>false</code></td>
    <td>
        Indicates that this request should use credentials (like cookies or specific auth headers)<br>
        Sets flag <code>withCredentials</code><br>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials">Read more about it is here...</a>
    </td>
  </tr>
  <tr>
    <td><b>headers?: object</b></td>
    <td><code>{}</code></td>
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
    <td><b>data?: any</b></td>
    <td><code>undefined</code></td>
    <td>
        Sets the request body. It is content which needed to send on server
    </td>
  </tr>
  <tr>
    <td><b>timeout?: number</b></td>
    <td><code>0</code></td>
    <td>
        Sets the number of milliseconds after which request automatically will be terminated. 0 value means no timeout.<br>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout">Read more about it is here...</a>
    </td>
  </tr>
  <tr>
    <td><b>auth?: any</b></td>
    <td><code>undefined</code></td>
    <td>
        Sets data for the instance `auth` mixin.<br>
        Only works if `auth` mixin is setted in instance options<br>
        Example:<br>
    <pre><code>
const api = kinka.create({
  baseURL: `${baseURL}/${apiPath}`,
  auth: ({ username, password }) => ({
    headers: {
      Authorization: 
        `Token ${username}:${stringToSHA256(password)}`,
    },
  }),
})
api.post(
  '/user',
  { fullName: 'John Week' },
  {
    auth: { 
      username: 'boss-killer', 
      password: 'IloveCats<3'
    },
  }
)
    </code></pre>
    </td>
  </tr>
</table>


<table>
  <tr>
    <td colspan="3"> <b>InstanceOptions: object</b></td>
  </tr>
  <tr>
    <td>Property</td>
    <td>Default</td>
    <td>Description</td>
  </tr>
  <tr>
    <td><b>baseURL?: string</b></td>
    <td><code>location.origin</code></td>
    <td>
        Sets the `baseURL` for instance.<br>
        Allows to set base url address for server.<br>
        Example:<br>
        <pre><code>
const api = kinka.create({ baseURL: 'https://api.com' })
api.get('/data') //GET: https://api.com/data
        </code></pre>
    </td>
  </tr>
  <tr>
    <td><b>customMethods?: (string[] | null)</b></td>
    <td><code>null</code></td>
    <td>
        Allows to create instance methods which will have special http methods.<br>
        Example:<br>
        <pre><code>
const api = kinka.create({
    baseURL: 'https://api.com',
    customMethods: ['move'],
})
api.move('/data', { data: { files: null } })
// MOVE: https://api.com/data
        </code></pre>
    </td>
  </tr>
  <tr>
    <td><b>headers?: object</b></td>
    <td><code>{}</code></td>
    <td>
        Allows to set specific headers for each request created via instance<br>
        Example:<br>
        <pre><code>
const api = kinka.create({
    baseURL: 'https://api.com',
    headers: {
        'API_VERSION': '01',
    },
})
api.get('/data')
/*
    GET: https://api.com/data
    headers: {
        "API_VERSION": "01"
    }
*/
        </code></pre>
    </td>
  </tr>
  <tr>
    <td><b>omitCatches?: bool</b></td>
    <td><code>true</code></td>
    <td>
      Same option as in `RequestOptions` but it works globally<br>
      for each request created via instance
    </td>
  </tr>
  <tr>
    <td><b>timeout?: number</b></td>
    <td><code>0</code></td>
    <td>
      Same option as in `RequestOptions` but it works globally<br>
      for each request created via instance
    </td>
  </tr>
  <tr>
    <td><b>inspectors?: object</b></td>
    <td>{}</td>
    <td>
        Allows to attach inspectors to your kinka instance.<br>
        Inspectors it is watchers for requests or responses<br>
        which allows dynamically change request options or response data.<br>
        If needed to change request options or response data then<br>
        need to return modified options/response.
        Example:<br>
        <pre><code>
const api = kinka.create({
  baseURL: `${baseURL}/${apiPath}`,
  inspectors: {
    request: (url, method, options) => {
      console.log(`request ${url}`, options)
      // here request will be not modified
    },
    response: (url, method, response) => {
      console.log(`response ${url}`, response)
      if(!response.data){
          response.data = null
      }
      // here response will be modified
      // and data will be null 
      return response
    },
  },
})
        </code></pre>
    </td>
  </tr>
  <tr>
    <td><b>auth?(authData):RequestOptions</b></td>
    <td><code>undefined</code></td>
    <td>
        Allows to attach auth mixin for requests in your kinka instance.<br>
        It mixin will be modify your request options before sending request.<br>
        Example:<br>
        <pre><code>
const api = kinka.create({
  baseURL: `${baseURL}/${apiPath}`,
  auth: ({ username, password }) => ({
    headers: {
      Auth: `Token ${username}:${stringToSHA256(password)}`,
    },
  }),
})
api.get('/data', {
  auth: { username: 'TheFlash', password: 'SpeedF0rce' },
})
        </code></pre>
    </td>
  </tr>
</table>


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
