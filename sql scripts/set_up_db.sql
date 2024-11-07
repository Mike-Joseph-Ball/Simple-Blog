create database IF NOT EXISTS simple_blog_development_db;
use simple_blog_development_db;

#CREATE TABLE IF NOT EXISTS UserAccounts (
#    User_email VARCHAR(100) primary key,
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#);

CREATE TABLE IF NOT EXISTS Blogs (
    Blog_id INT auto_increment primary key,
    blog_title VARCHAR(100) UNIQUE,
    blog_description VARCHAR(100),
    comment_settings_default VARCHAR(50),
    blog_template_style VARCHAR(50),
    user_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Posts (
    Post_id INT auto_increment primary key,
    Post_contest LONGTEXT,
    User_email VARCHAR(100),
    Blog_id INT,
    FOREIGN KEY (Blog_id) REFERENCES Blogs(Blog_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Comments (
    Comment_id INT auto_increment primary key,
    Comment_contents LONGTEXT,
    User_email VARCHAR(100),
    Post_id INT,
    FOREIGN KEY (Post_id) REFERENCES Posts(Post_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);