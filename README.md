# nodejs-bff-sql
learning create backend for frontend query data from MySQL using NodeJS


# how to build docker image
docker build -t nodejs-bff-sql .

# how to run
## Preriquisit 
### Create docker network
    docker network create nodejs-bff-sql
### run the MS-SQL server
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=P@ssw0rd" --net nodejs-bff-sql \
    -p 1433:1433 --name sql1 --hostname sql1 --rm -d \
    mcr.microsoft.com/mssql/server:2022-latest

### create database, table, and test-data
    docker exec -it sql1 "bash"
### then you will inside the container (bash).
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "P@ssw0rd"
### then you in sqlcmd shell.  Then run below set of commands.
    CREATE DATABASE TestDB;
    GO
    SELECT Name from sys.databases;
    GO
    USE TestDB;
    CREATE TABLE Inventory (id INT, name NVARCHAR(50), quantity INT);
    INSERT INTO Inventory VALUES (1, 'banana', 150); INSERT INTO Inventory VALUES (2, 'orange', 154);
    GO
    SELECT * FROM Inventory ;
    GO
 
## Docker command to run the server.
    docker run --rm --name nodejs-bff-sql --net nodejs-bff-sql -p 3000:3000 nodejs-bff-sql:latest 

## Example curl command to test.
    curl -v http://localhost:3000/api/capture-time


## Example of output from curl command
<pre><span style="background-color:#D3D7CF"><span style="color:#008787">  </span></span><span style="background-color:#008787"><span style="color:#D3D7CF"></span></span><span style="background-color:#008787"><span style="color:#E4E4E4">  </span></span><span style="background-color:#008787"><span style="color:#EEEEEE"><b>~</b></span></span><span style="background-color:#008787"><span style="color:#E4E4E4"> </span></span><span style="color:#008787"></span> <span style="color:#4E9A06">curl</span> -v http://localhost:3000/api/data                                               </span>
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
&gt; GET /api/data HTTP/1.1
&gt; Host: localhost:3000
&gt; User-Agent: curl/8.1.2
&gt; Accept: */*
&gt; 
&lt; HTTP/1.1 200 OK
&lt; X-Powered-By: Express
&lt; Access-Control-Allow-Origin: *
&lt; Content-Type: application/json; charset=utf-8
&lt; Content-Length: 81
&lt; ETag: W/&quot;51-+VDufckcWErQ6bWn6O0LdiqLIRM&quot;
&lt; Date: Mon, 17 Jul 2023 16:20:19 GMT
&lt; Connection: keep-alive
&lt; Keep-Alive: timeout=5
&lt; 
* Connection #0 to host localhost left intact
[{&quot;id&quot;:1,&quot;name&quot;:&quot;banana&quot;,&quot;quantity&quot;:150},{&quot;id&quot;:2,&quot;name&quot;:&quot;orange&quot;,&quot;quantity&quot;:154}]<span style="background-color:#FFFFFF"><span style="color:#1C1C1C"><b>%</b></span></span>  </pre>


## Example server console log that capture the response time
<pre><span style="background-color:#D3D7CF"><span style="color:#008787">  </span></span><span style="background-color:#008787"><span style="color:#D3D7CF"></span></span><span style="background-color:#008787"><span style="color:#E4E4E4">  </span></span><span style="background-color:#008787"><span style="color:#EEEEEE"><b>~</b></span></span><span style="background-color:#008787"><span style="color:#E4E4E4"> </span></span><span style="color:#008787"></span> <span style="color:#4E9A06">node</span> server.js                                               </span>
Server is listening on port 3000
http://localhost:3000/api/data:response-time: 91.47 ms
http://localhost:3000/api/data:response-time: 34.45 ms
http://localhost:3000/api/data:response-time: 30.44 ms
http://localhost:3000/api/data:response-time: 69.77 ms
http://localhost:3000/api/data:response-time: 66.59 ms
http://localhost:3000/api/data:response-time: 34.09 ms
 </pre>

## Clean up
    docker kill    nodejs-bff-sql sql1
    docker network rm nodejs-bff-sql
