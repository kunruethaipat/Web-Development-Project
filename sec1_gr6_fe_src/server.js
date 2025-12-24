// Sets up an Express server with Axios, Multer, and routing functionalities.
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 8082;
const router = express.Router();
const multer = require('multer');

// Setup multer to store file uploads
const storage = multer.memoryStorage(); // or diskStorage if you want to save files
const upload = multer({ storage: storage });

// Configures the server to use the router and parse URL-encoded and JSON request bodies.
app.use(router);
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Base directory to serve files from
const BASE_DIR = path.join(__dirname); // Automatically resolves to the current directory where server.js is located
console.log(BASE_DIR);

// Serve static assets
app.use('/css', express.static(path.join(BASE_DIR, 'css')));
app.use('/js', express.static(path.join(BASE_DIR, 'js')));
app.use('/img', express.static(path.join(BASE_DIR, 'img')));
app.use('/dist', express.static(path.join(BASE_DIR, 'dist')));

// Explicit page routes
router.get('/', (req, res) => {
  // console.log(BASE_DIR);
  res.sendFile(path.join(BASE_DIR, 'index.html'));
}
);
router.get('/index', (req, res) => {
  // console.log(BASE_DIR);
  res.sendFile(path.join(BASE_DIR, 'index.html'));
}
);

// Defines routes to serve various HTML pages for different parts of the website.
app.get('/login', (req, res) => res.sendFile(path.join(BASE_DIR, 'login.html')));
app.get('/team', (req, res) => res.sendFile(path.join(BASE_DIR, 'team.html')));
app.get('/product', (req, res) => res.sendFile(path.join(BASE_DIR, 'product.html')));
app.get('/admin_login', (req, res) => res.sendFile(path.join(BASE_DIR, 'admin_login.html')));
app.get('/advance-search', (req, res) => res.sendFile(path.join(BASE_DIR, 'advance-search.html')));
app.get('/create_account', (req, res) => res.sendFile(path.join(BASE_DIR, 'create_account.html')));
app.get('/product_detail', (req, res) => res.sendFile(path.join(BASE_DIR, 'product_detail.html')));
app.get('/service_admin', (req, res) => res.sendFile(path.join(BASE_DIR, 'service_admin.html')));
app.get('/add_product', (req, res) => res.sendFile(path.join(BASE_DIR, 'add_product.html')));
app.get('/update_product', (req, res) => res.sendFile(path.join(BASE_DIR, 'update_product.html')));

// Handles admin login authentication by sending credentials to the backend and redirecting based on the result.
router.post('/admin_login_auth', async function (req, res)  {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
   try{
    const response = await axios.post('http://localhost:8083/api/admin_login_auth',{
      username,
      password
    });

    if(response.data.success){
      res.redirect('/service_admin');
    }
   }
   catch(error){
    console.error('login error:',error);
    res.redirect('/admin_login');
   }
});

// Handles product deletion by forwarding the request to the backend API and returning the result.
router.delete('/deleteProduct/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`http://localhost:8083/api/deleteProduct/${id}`);
    res.send(response.data); // send back success to frontend
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).send('Failed to delete product');
  }
});

// Handles adding a new product by uploading its image and sending product data to the backend API.
router.post('/addNewProduct', upload.single('productImage'), async function (req, res) {
  const file = req.file; // <-- file upload
  const { productName, brand, volume, price, type, description } = req.body;
  console.log(productName);
  let imageUrl = '';
  if (file) {
    imageUrl = file.buffer.toString('base64'); // or upload to storage and get URL
  }
  try {
    const response = await axios.post('http://localhost:8083/api/addNewProduct', {
      productName,
      brand,
      volume,
      price,
      type,
      description,
      imageUrl
    });
    res.redirect('/service_admin');
  } catch (error) {
    console.error('Add new product error:', error);
    res.redirect('/service_admin');
  }
});

// Handles updating a product by sending the updated data and image to the backend API.
router.post('/updateProduct', upload.single('productImage'), async (req, res) => {
  const file = req.file;
  const { product_ID, productName, brand, volume, price, type, description } = req.body;
  const imageUrl = file ? file.buffer.toString('base64') : '';
  try {
    const response = await axios.put('http://localhost:8083/api/updateProduct', {
      product_ID,
      productName,
      brand,
      type,
      volume,
      price,
      description,
      imageUrl
    });
    if (response.data.success) {
      console.log('Update succeeded:', response.data.message);
      return res.redirect('/service_admin');
    } else {
      console.error('Update failed:', response.data);
      return res.redirect('/service_admin');
    }
  } catch (err) {
    console.error('Update product error:', err.response?.data || err.message);
    return res.redirect('/service_admin');
  }
});

// Fetches product details by ID from the backend API and returns them as JSON.
router.get('/api/getProduct/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`http://localhost:8083/api/getProduct/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Fetch product error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send('Product not found');
  }
});

// Fetches all product data from the backend API and returns it as a JSON response.
router.get('/getAllProducts', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:8083/api/getAllProducts');
    res.json(response.data); // send back to frontend
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Fetches all user-visible products from the backend API and returns them as JSON to the frontend.
router.get('/getAllProductsUser', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:8083/api/getAllProductsUser');
    console.log(response.data);
    res.json(response.data); // send back to frontend
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Fetches detailed product data from the backend API and returns it as JSON to the frontend.
router.get('/getProductDetail', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:8083/api/getProductDetail');
    console.log(response.data);
    res.json(response.data); // send back to frontend
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Fallback 404 route
app.use((req, res) => {
  const notFoundPath = path.join(BASE_DIR, '/index.html');
  res.status(404).sendFile(notFoundPath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});