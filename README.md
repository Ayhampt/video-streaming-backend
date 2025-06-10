<h1>Backend for Video Streaming Platform</h1>
<h3>This is the backend service for a modern video streaming platform, built with Node.js and Express. It provides a robust set of APIs for user authentication, video management, and file handling using MongoDB for the database and Cloudinary for media storage.</h3>

<h2> ✨Features</h2>
<h3>User Authentication:</h3>
Secure user registration, login, and logout functionalities. Passwords are encrypted using bcrypt.

Profile Management: Users can manage their profile information, including avatars and cover images.

Account Deletion: Users have the ability to delete their own accounts.

Video Uploads: Seamless video and thumbnail uploads using multer and cloudinary.

<h3>Video Management:</h3>

Publish video

Update video titles, descriptions, and thumbnails.

Delete videos from the platform.

Toggle the publish status of a video (public or private).


<h3>More coming Up...</h3>



<h3>Middleware:</h3>

Authentication: Middleware to protect routes and ensure only authenticated users can perform certain actions.

Logging: morgan for detailed HTTP request logging during development.

File Handling: multer for efficient handling of multipart/form-data (file uploads).

Developer Friendly: nodemon for automatic server restarts during development.

<h3>🛠️ Tech Stack</h3>

Runtime: Node.js

Framework: Express.js

Database: MongoDB 

Authentication: JWT (JSON Web Tokens), bcrypt

File Uploads: Multer

Cloud Media Storage: Cloudinary

HTTP Logging: Morgan

Development Utility: Nodemon

Environment Variables: dotenv

