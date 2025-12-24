[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xi3wYqF3)

# Faculty of Information and Communication Technology <br> ITCS223 Introduction to Web Development <br> Project Phase II

<hr>

## Download and Run Database Script:
   - Download the file `sec1_gr6_database.sql`.
   - Import and Execute it in your MySQL Server to create a database called `LUMONY`.
  
## Project Setup:
   - From GitHub, download ZIP file by pressing green button
   - Then extract the ZIP file
     
## Folder Structure:
   ```
   672-projectphase2-section1_group06-main (root)
    ├── sec1_gr6_fe_src
    │   ├── css
    │   ├── dist
    │   ├── img
    │   ├── js
    │   ├── add_product.html
    │   ├── admin_login.html
    │   ├── advance-search.html
    │   ├── create_account.html
    │   ├── index.html
    │   ├── login.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── product_detail.html
    │   ├── product.html
    │   ├── server.js
    │   ├── service_admin.html
    │   ├── team.html
    │   └── update_product.html
    ├── sec1_gr6_ws_src
    │   ├── package-lock.json
    │   ├── package.json
    │   └── webservice.js
    ├── sec1_gr6_database.sql
    ├── Sec1-Gr06-PJ2-summary.pdf
    └── README.md

   ```
## Changing password for access to connect to the database
   - Open VS Code and Open Folder `672-projectphase2-section1_group06-main`
   - Click 'sec1_gr6_ws_src'
   - Click 'webservice.js'
   - Find
    const db = mysql.createConnection({ <br>
      host: 'localhost',<br>
      user: 'root',<br>
      password: 'xxxxx##<---------- this line<br>
      database: 'Lumony'<br>
    });
   - Replace it with your mySQL password.
   - Then, save the File.

## Install Module ans start the server
   - Open Visial studio code
   - Click 'File'
   - Click 'Open folder'
   - Find '672-projectphase2-section1_group06-main'
   - Click 'terminal' in toolsbar
   - Click 'New terminal'
   - Type in the first terninal "cd sec1_gr6_fe_src"
   - Then type "npm install axios cors express multer nodemon"
   - Click 'New terminal'
   - Type in the second terninal "cd sec1_gr6_ws_src"
   - Then type "npm install axios cors express multer nodemon"
   - Type "npm start" in both terminal.

## Open the Website
- Open your browser and go to:  
  [http://localhost:8082/](http://localhost:8082/)

## How to Use the Website
### For Admin Login
- **Login Page**  
  [http://localhost:8082/admin_login](http://localhost:3000/admin_login)
  or pressing ADMIN on the footer

  - Admin ID: `dome.smith`
  - Password: `passDome123`
  - **Important**: Don't forget to check "**I am not a robot**" before logging in.
- **Adding/Updaing**
  - Example Product Details:
    - Image: You can upload file to 50 MB
    - Product_ID: Auto Increment
    - Product_name: Chanel Chance Eau Tendre
    - Product_brand: Chanel
    - Product_type: Women
    - Product_volume: 100
    - Product_price: 5000
    - Product_description: timeless elegance and sophistication, featuring luxurious scents that blend classic floral, woody, and powdery

Now, the module and our website is ready.
















