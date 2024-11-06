create database IF NOT EXISTS simple_blog_development_db;
use simple_blog_development_db;

#CREATE TABLE IF NOT EXISTS UserAccounts (
#    User_email VARCHAR(100) primary key,
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#);

CREATE TABLE IF NOT EXISTS Blogs (
    Blog_id INT auto_increment primary key,
    Blog_title VARCHAR(100),
    User_email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Posts (
    Post_id INT auto_increment primary key,
    Post_contest LONGTEXT,
    User_email VARCHAR(100),
    Blog_id INT,
    FOREIGN KEY (Blog_id) REFERENCES Blogs(Blog_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    Comment_id INT auto_increment primary key,
    Comment_contents LONGTEXT,
    User_email VARCHAR(100),
    Post_id INT,
    FOREIGN KEY (Post_id) REFERENCES Posts(Post_id)
);