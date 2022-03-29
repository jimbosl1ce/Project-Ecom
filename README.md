# Project ECOM
Project ECOM is a single page e-commerce web application created utilizing React and Node/Express. This project was created by a team of three engineers at DJAM Industries.

![Screenshot](https://i.makeagif.com/media/2-25-2022/zsFKJB.gif)

## :heavy_check_mark: Features

### Product Overview

* Cycle through different photos of the same style using the carousel
* Click thumbnails to view different styles of the same product
* Click on image to zoom with highlight box

### Related Items

* Create your own outfits by adding items to the list
* Cycle through your outfit with the carousel
* Get ideas on outfits with the 'Wear it with' section
* Compare items at a touch of a button

### Ratings And Reviews

* See how others have rated products
* Add your own review to products
* Search reviews for products
* Leave ratings

### Questions And Answers

* Add Questions about products
* Search Questions already asked
* See answers others have posted
* Add Answers about products

## :heavy_check_mark: Installation

```
npm install
```

## Setup
* Rename tokens.example.js to tokens.js
* Create a .env file
* Add HR_TOKEN=githubtoken


In two different terminals run

```
npm run react-prod
npm run startprod
```

open

```
http://localhost:3000/

```

## Performant Backend

### Challenge: 
Create a performant and scalable backend system in AWS capable of handling 100 requests per second (RPS) for **Product** and **Product Styles** routes.

Approach:
- Select Database (noSQL v SQL)
- Define and initialize model within DBMS
- Build Performant Queries
- Validate Performance Locally
- Deploy in AWS and Scale


### Selecting a Database
I selected PostgreSQL as the database of choice for the following reasons:
- [PostgreSQL is more performant vs. MongoDB](https://www.enterprisedb.com/news/new-benchmarks-show-postgres-dominating-mongodb-varied-workloads) and RPS is the goal!
- I wanted to use PostgreSQL aggregate functions to shape queries according to frontend requirements.
- This data won't have variations.
- The data is relational in nature (see below model).

### Define and Initialize Model

Having selected PostgreSQL as my DBMS, my immediate next step was to map out my database design. 

Using this diagram made translating each table's worth of data easier to translate to CREATE TABLE commands.

**Database Design**
![Screen Shot 2022-03-29 at 8 52 41 AM](https://user-images.githubusercontent.com/43115008/160653308-f2d6bef7-8ca3-413b-8a43-3662df9788f6.png)

**Table query snapshot**
![Screen Shot 2022-03-29 at 9 17 24 AM](https://user-images.githubusercontent.com/43115008/160658316-85ffb14c-7a57-4ab5-bde9-122267cb68f0.png)

### Build Performant Queries

**Query Building**
I found building queries from scratch challenging. But by using PostgreSQL's [documentation](https://www.postgresql.org/docs/14/index.html), I was able to accurately shape the queried data to take the exact shape my frontend asked for.

![Screen Shot 2022-03-29 at 9 32 38 AM](https://user-images.githubusercontent.com/43115008/160661165-f8fb112d-c8e2-4664-b006-8545eb2e244a.png)


**Query Plan Data**

By validating my query data shape according to my frontend's specifications, as well as query planning and execution times, I focused my attention on confirming performance locally before moving to the cloud.

**Query Plan Metrics :**

~ Planning Time: 5.757ms
~ Execution Time: 1.815ms

![Screen Shot 2022-03-29 at 9 21 44 AM](https://user-images.githubusercontent.com/43115008/160659122-87f6a031-fea5-4777-bf6c-f66befb4017b.png)

### Validating Performance Locally

**Local K6 Testing**

![Screen Shot 2022-03-29 at 9 24 47 AM](https://user-images.githubusercontent.com/43115008/160659671-603d8c9d-94c7-4a2a-9243-05368c16d097.png)

### Deploying and Scaling in AWS

By this point, I was energized. My aggregate functions shaped data according to spec, were performant, and showed promising K6 local testing results.

At this phase, I had a blast setting up EC2 T2.micros and measuring performance as I horizontally scaled.

**Test 1:**
Diagram:

![Screen Shot 2022-03-29 at 10 00 14 AM](https://user-images.githubusercontent.com/43115008/160666013-9a843674-8508-4ca3-a694-91842126d2ac.png)

Results:

![Screen Shot 2022-03-29 at 10 00 00 AM](https://user-images.githubusercontent.com/43115008/160665966-ecb38898-796c-4994-a787-6714998acd88.png)

Notes: 

Cloud baseline established. While these results weren't as performant as my local K6 testing results, I was happy to have a baseline before moving onto additional architectures.

**Test 2:**
Diagram:

![Screen Shot 2022-03-29 at 10 01 52 AM](https://user-images.githubusercontent.com/43115008/160666261-760d8352-a140-43ca-b0e7-80a1a3291dbf.png)

Results:

 ![Screen Shot 2022-03-29 at 10 01 35 AM](https://user-images.githubusercontent.com/43115008/160666215-d98391d3-1283-4937-9ca4-aa62c1d0e6e4.png)
 
Notes:

T2.Micro EC2 instances come with 1 vGPU, which I hypothesized was being put under stress by hosting both the Express server as well as Postgres. I noted a large uptick in performance at 1,000 RPS, however, at the expense of a much higher latency.

**Test 3**
Diagram:

![Screen Shot 2022-03-29 at 10 06 40 AM](https://user-images.githubusercontent.com/43115008/160666984-211e25ad-c8b3-4e68-bee2-d367312d80ad.png)

Results:

![Screen Shot 2022-03-29 at 10 10 49 AM](https://user-images.githubusercontent.com/43115008/160667653-b95fe3b6-e4db-48d2-b75c-63bb5f903514.png)

Notes:

By introducing a NGINX Load Balancer, I was able to increase RPS by an additional 42.9% (Products) and 53.1% (Styles) while reducing latency by 61% (Styles) and 67% (Products). 

While I was excited adjust NGINX's config settings according to suggestions made in their documentation, I was suspect that my PostgreSQL DBMS EC2 bottlenecked performance - particularly because each request shaped a response in JSON via PostreSQL aggregate functions.

**Test 4**
Diagram:

![Screen Shot 2022-03-29 at 10 16 33 AM](https://user-images.githubusercontent.com/43115008/160668585-df2d8355-cc50-406b-a64e-4e1a2e238d80.png)

Results:

![Screen Shot 2022-03-29 at 10 17 02 AM](https://user-images.githubusercontent.com/43115008/160668658-30b1e1a4-4ca6-4b06-ae94-12cb3b1aa851.png)

Notes:

While I saw decent performance gains in STYLES, I decided to continue horizontally scaling given the diminishing returns seen in PRODCUTS. 

**Test 5**
Diagram:

![Screen Shot 2022-03-29 at 10 18 42 AM](https://user-images.githubusercontent.com/43115008/160668944-f2d0d9fb-702f-4f9d-b54d-b8621e27b332.png)

Results:

![Screen Shot 2022-03-29 at 10 19 14 AM](https://user-images.githubusercontent.com/43115008/160669034-6d6a1692-f600-4602-b91f-5954a375845d.png)

Notes:

While building this setup was exciting, I was ultimately dissapointed with only a modest 10% increase in PRODUCTS RPS performance. At this point in time, I focused my attention toward [tuning my NGINX load balancer](https://www.nginx.com/blog/tuning-nginx/). 

**Test 6** - Caching Enabled
Results:

![Screen Shot 2022-03-29 at 10 22 12 AM](https://user-images.githubusercontent.com/43115008/160669517-31fa7271-e884-47e9-9e7f-7a585e728466.png)

Notes:

By enabling caching in my NGINX load balancer, I was able to drastically reduce cloud resources while **increasing performance to 3,700 RPS**. Caching reduced server and DBMS stress as well as latency, and drastically improved throughput.

**Final thoughts** 

If I had more time, I'd migrate my load balancer to a larger T2 instance and continue horizontally scaling.

![Screen Shot 2022-03-29 at 10 32 11 AM](https://user-images.githubusercontent.com/43115008/160671181-19971635-96bf-4657-b3d7-b3f30d73369b.png)

