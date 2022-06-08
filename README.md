**InsuranceApp**

Prerequisites:
  - install MongoDB
  - to populate db, run initdb.js
-----

**Login users**
----
	Logs in given user and retrieves an auth token.
	
* **URL**

  /clients/login

* **Method:**
  
  `POST` 

* **Data Params**

  Body should be a JSON with name and password defined.

* **Success Response:**

  * **Code:** 200 <br />
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />

  OR

  * **Code:** 404 NOT FOUND <br />

* **Notes:**

	To login, use user data defined in db/mockdata.js.
----

**Get client data by id.**
----
	Retrieves client data given the specified id. You must provide the auth token and be authorized to be able to access this method.
	
* **URL**

  /clients/:id

* **Method:**
  
  `GET` 

* **HEADERS**

	`x-auth`
	
* **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
   **Content:** `{ "id":"12",
					"name":"Mae",
					"email":"mae@gmail.com",
					"role":"admin"}`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
  
  OR

  * **Code:** 401 UNAUTHORIZED <br />
  
  OR

 * **Code:** 403 FORBIDDEN <br />
----

**Get client data by name**
----
	Retrieves client data given the specified name. You must provide the auth token and be authorized to be able to access this method.
	
* **URL**

  /clients/byname/:name

* **Method:**
  
  `GET` 

* **HEADERS**

	`x-auth`
	
* **URL Params**

   **Required:**
 
   `name=[string]`

* **Success Response:**

  * **Code:** 200 <br />
   **Content:** `{ "id":"12",
					"name":"Mae",
					"email":"mae@gmail.com",
					"role":"admin"}`
 
* **Error Response:**

 * **Code:** 404 NOT FOUND <br />
  
  OR

 * **Code:** 401 UNAUTHORIZED <br />
 
 OR

 * **Code:** 403 FORBIDDEN <br />
 ----
 
 **Get client data associated with a given policy.**
----
	Retrieves client data given the specified policy. You must provide the auth token and be authorized to be able to access this method.
	
* **URL**

  /clients/bypolicy/:policyId

* **Method:**
  
  `GET` 

* **HEADERS**

	`x-auth`
	
* **URL Params**

   **Required:**
 
   `policyId=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
   **Content:** `{ "id":"12",
					"name":"Mae",
					"email":"mae@gmail.com",
					"role":"admin"}`
 
* **Error Response:**

 * **Code:** 404 NOT FOUND <br />
  
  OR

 * **Code:** 401 UNAUTHORIZED <br />
 
 OR

 * **Code:** 403 FORBIDDEN <br />
 ----
 
  **Get a list of policies associated with a given client.**
----
	Retrieves a list of policies given a specified client. You must provide the auth token and be authorized to be able to access this method.
	
* **URL**

  /policies/:clientId

* **Method:**
  
  `GET` 

* **HEADERS**

	`x-auth`
	
* **URL Params**

   **Required:**
 
   `clientId=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
   **Content:** `[{ "id":"123",
         "amountInsured":1825.89,
         "email":"inesblankenship@quotezart.com",
         "inceptionDate":"2016-06-01T03:33:32Z",
         "installmentPayment":true,
         "clientId":"345" }]`
 
* **Error Response:**

 * **Code:** 404 NOT FOUND <br />
  
  OR

 * **Code:** 401 UNAUTHORIZED <br />
 
 OR

 * **Code:** 403 FORBIDDEN <br />
