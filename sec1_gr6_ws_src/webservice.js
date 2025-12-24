// Initializes an Express server and MySQL connection setup for backend API services.
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const PORT = 8083;

var cors = require('cors');
app.use(cors());

let corsOptions = {
  origin: 'http://localhost:8082',
  methods:'GET,POST,PUT,DELETE'
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xxxx', // Put your own password
  database: 'Lumony'
});

db.connect(function (err) {
  if(err){
    console.error("Error", err);
    return;
  }
  console.log('Connected DB:', db.config.database);
});

// Testing Delete a Product
// method: DELETE
// URL: http://localhost:8083/api/deleteProduct/21
// body: none

// Testing Delete Another Product
// method: DELETE
// URL: http://localhost:8083/api/deleteProduct/22
// body: none

// Deletes a product from the database by its ID and returns a success message.
app.delete('/api/deleteProduct/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Product WHERE Product_ID = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).send('Database delete error');
    }
    res.send({ success: true, message: 'Product deleted successfully' });
  });
});

// Testing Update a Product
// method: PUT
// URL: http://localhost:8083/api/updateProduct
// body: raw JSON
// {
//   "product_ID": 1,
//   "productName": "Blooming Bouquet Updated",
//   "brand": "Dior",
//   "type": "Perfume",
//   "volume": 50,
//   "price": 125.00,
//   "description": "Updated description: Fresh floral fragrance with a soft finish.",
//   "imageUrl": "new-base64-or-image-url-here",
//   "oldImage": "old-image-url"
// }

// Testing Update Another Product (Keep Old Image)
// method: PUT
// URL: http://localhost:8083/api/updateProduct
// body: raw JSON
// {
//   "product_ID": 2,
//   "productName": "Eros Updated",
//   "brand": "Versace",
//   "type": "Cologne",
//   "volume": 100,
//   "price": 95.00,
//   "description": "Updated description: Bold fragrance with notes of mint and vanilla.",
//   "imageUrl": "",
//   "oldImage": "existing-old-image-url-or-base64"
// }

// Updates a product's details in the database based on the provided information.
app.put('/api/updateProduct', (req, res) => {
  const { product_ID, productName, brand, type, volume, price, description, imageUrl, oldImage } = req.body;

  // If no new image uploaded, use old image
  const finalImage = imageUrl && imageUrl.trim() !== '' ? imageUrl : oldImage;

  const sql = `
    UPDATE Product 
    SET Product_name = ?, Product_brand = ?, Product_type = ?, Product_volume = ?, Product_price = ?, Product_image = ?, Product_description = ?
    WHERE Product_ID = ?
  `;
  const values = [productName, brand, type, volume, price, finalImage, description, product_ID];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log('Rows changed:', result.affectedRows);
    res.send({ success: true, message: 'Product updated successfully' });
  });
});


// Fetches a single product's details from the database by its ID and returns it.
app.get('/api/getProduct/:id', (req, res) => {
  const id = req.params.id;
  console.log('Fetching product with ID:', id);
  const sql = 'SELECT * FROM Product WHERE Product_ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).send('Database query error');
    }
    console.log('Query result:', result);
    if (result.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.send(result[0]);
  });
});

// Authenticates an admin by checking the username and password against the database.
app.post('/api/admin_login_auth', (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  db.query(
    'SELECT * FROM Administrator_Account WHERE Acc_username = ? AND Acc_password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).send('Error');
      if (results.length > 0) {
        res.send({ success: true });
      } else {
        res.status(401).send({ success: false });
      }
    }
  );
});

// Testing Insert a New Product
// method: POST
// URL: http://localhost:8083/api/addNewProduct
// body: raw JSON
// {
//   "productName": "Blooming Bouquet",
//   "brand": "Dior",
//   "type": "Perfume",
//   "volume": 50,
//   "price": 120.00,
//   "imageUrl": "base64-image-or-image-url-here",
//   "description": "A fresh floral fragrance perfect for daily wear."
// }

// Testing Insert Another New Product
// method: POST
// URL: http://localhost:8083/api/addNewProduct
// body: raw JSON
// {
//   "productName": "Chance Eau Tendre",
//   "brand": "Chanel",
//   "type": "Perfume",
//   "volume": 100,
//   "price": 135.50,
//   "imageUrl": "sample-base64-image-or-url",
//   "description": "A fruity-floral fragrance that is delicate and fresh, perfect for everyday elegance."
// }

// Inserts a new product into the database with the provided details and image.
app.post('/api/addNewProduct', (req, res) => {
  const { productName, brand, type, volume, price, imageUrl, description } = req.body;
  const sql = `
    INSERT INTO Product (Product_name, Product_brand, Product_type, Product_volume, Product_price, Product_image, Product_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [productName, brand, type, volume, price, imageUrl, description];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).send('Database insert error');
    }
    res.send({ success: true, message: 'Product added successfully' });
  });
});

// Fetches and returns all products from the database as a JSON array.
app.get('/api/getAllProducts', (req, res) => {
  const sql = 'SELECT * FROM Product';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// Fetches user-filtered products from the database, adds price ranges, and returns them as JSON.
app.get('/api/getAllProductsUser', (req, res) => {
  const { type, brand } = req.query;
  let sql = 'SELECT * FROM Product WHERE 1=1';
  const params = [];
  if (type) {
    sql += ' AND Product_type = ?';
    params.push(type);
  }
  if (brand) {
    sql += ' AND Product_brand = ?';
    params.push(brand);
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Database error');
    }
    const productsWithRange = results.map(product => {
      let priceRange = '';
      if (product.Product_price >= 2000 && product.Product_price <= 3000) {
        priceRange = '2000-3000';
      } else if (product.Product_price <= 4000) {
        priceRange = '3001-4000';
      } else if (product.Product_price <= 5000) {
        priceRange = '4001-5000';
      } else if (product.Product_price <= 6000) {
        priceRange = '5001-6000';
      } else if (product.Product_price <= 7000) {
        priceRange = '6001-7000';
      }
      return {
        ...product,
        priceRange: priceRange
      };
    });
    res.json(productsWithRange);
  });
});

// Fetches detailed information for a specific product by ID and returns it as JSON.
app.get('/api/getProductDetail', (req, res) => {
  const productId = req.query.Product_ID;
  const query = 'SELECT * FROM Product WHERE Product_ID = ?';
  db.query(query, [productId], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
          res.json(results[0]); // ส่งข้อมูลสินค้า
      } else {
          res.status(404).json({ error: "Product not found" });
      }
  });
});

// Serves the `service_admin.html` page when the `/service_admin` route is accessed.
app.get('/service_admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'service_admin.html'));
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
