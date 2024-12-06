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
    comment_settings_default INT DEFAULT 0,
    blog_template_style VARCHAR(50),
    user_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Posts (
    Post_id INT auto_increment primary key,
    Post_title VARCHAR(50),
    Is_post_public BIT DEFAULT 0,
    Comment_settings INT DEFAULT 0,
    Post_content LONGTEXT,
    User_email VARCHAR(100),
    Blog_id INT,
    FOREIGN KEY (Blog_id) REFERENCES Blogs(Blog_id),
	Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Images (
    Image_id INT auto_increment primary key,
    Post_id INT,
    FOREIGN KEY (Post_id) REFERENCES Posts(Post_id),
    Image_filename VARCHAR(50),
    Image_caption LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Comments (
    Comment_id INT auto_increment primary key,
    Comment_content LONGTEXT,
    User_email VARCHAR(100),
    Post_id INT,
    FOREIGN KEY (Post_id) REFERENCES Posts(Post_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);