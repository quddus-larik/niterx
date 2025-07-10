## Software Requirements Specification (SRS)
#### Mobile Stock eCommerce Web Application

##### 1. Introduction

###### 1.1 Purpose
[Describe the purpose of the application. What problem does it solve? For example, does it aim to provide a platform for users to buy mobile phones at competitive stock prices?]
###### 1.2 Scope
[What are the key features and boundaries of the application? For instance, does it focus solely on mobile phone sales, user profiles, and checkout processes, or are there plans for additional features like reviews or wishlists?]
###### 1.3 Definitions, Acronyms, and Abbreviations

1. NextJS: A React-based framework for server-side rendering and static site generation.
2. TailwindCSS: A utility-first CSS framework for styling.
3. HeroUI: A UI component library used for front-end design.
4. GraphQL: A query language for APIs used in the application.
5. MongoDB: A NoSQL database for storing application data.

###### 1.4 References
[List any references, such as NextJS documentation, GraphQL specifications, or MongoDB guides.]
##### 2. Overall Description
###### 2.1 Product Perspective
[How does the application fit into the broader ecosystem? Is it a standalone web app or integrated with other systems? What role do the GraphQL APIs play in connecting the front end and back end?]
###### 2.2 Product Functions
[What are the main functions? For example:]

* Browse mobile phones on the /phones page.
* View detailed phone information on /phones/[id].
* Process payments on the /checkout page.
* Manage user information on the /profile page.

###### 2.3 User Classes and Characteristics
[Who are the users? For example, are they customers purchasing phones, admins managing stock, or both? What are their technical proficiencies?]
###### 2.4 Operating Environment
[The application runs on web browsers using NextJS for server-side rendering, with MongoDB as the database and ExpressJS for GraphQL APIs. Are there specific browser or device requirements?]
##### 3. Functional Requirements

###### 3.1 Phones Page (/phones)
A market place for all phones.
###### 3.2 Phone Details Page (/phones/[id])
A SSG(Static Site Generation) with Dynamic Route for each phones with detailed description.
###### 3.3 Checkout Page (/checkout)
A checkout web page developed for User detailes, a Address, City etc. it must require for Authentication enabled.
###### 3.4 Profile Page (/profile)
[What user information is managed here? For example, can users update their address, view order history, or manage account settings?]
##### 4. Non-Functional Requirements
###### 4.1 Performance
Improved Perfolrmace by useing GraphQL adn express APIs that can call quickly with usefulll data.
###### 4.2 Security
Authentication type: Open, SSO(Single Sign On), encrypted communication using JWT(JavaScript Web Token).
###### 4.3 Usability
A decent UI with improved UX(user experience) devloped using HeroUI componenets with layouts.
##### 5. Technical Requirements
###### 5.1 Technology Stack

Front End: NextJS (App Router), TailwindCSS, HeroUI.
Back End: ExpressJS with GraphQL APIs.
Database: MongoDB.
Hosting: [Specify if known, e.g., Vercel for NextJS deployment.]

5.2 Folder Structure

```txt

niterX/
├── client/ 
├── server/

```

5.3 API Specifications
[Describe key GraphQL queries/mutations, e.g., fetching phone data, processing orders, or updating user profiles.]
6. Assumptions and Constraints
6.1 Assumptions
[What assumptions are made, e.g., users have stable internet access or MongoDB is hosted on a cloud provider?]
6.2 Constraints
[What are the limitations, e.g., budget, timeline, or specific technology choices?]
7. Deliverables
[List deliverables, such as the web application, API documentation, or user guides.]
8. Project Timeline
[Outline key milestones, such as completing the /phones page, integrating GraphQL APIs, or launching the application.]
9. Approval
[Who needs to approve the SRS, e.g., project manager, client, or development team?]