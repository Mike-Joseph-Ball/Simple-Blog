use simple_blog_development_db;

INSERT INTO Blogs (blog_title,blog_description,comment_settings_default,blog_template_style,user_email) 
VALUES ("Mike's Blog","This is the blog where mike posts all of his happenings","comments allowed","Simple Blog","michaelball357@gmail.com"),("Cold Shaker Blog","This is a blog for Mike Ball's YouTube channel","comments allowed","Simple Blog","michaelball357@gmail.com");

INSERT INTO Posts (Post_title,Post_content,User_email,Blog_id) VALUES 
("Summary of mike","This will later be JSON data that is rerendered for viewing/editing.","michaelball357@gmail.com",1), 
("What to write?","I'm running out of ideas what to write for sample posts. This is gonna be deleted later anyway!!","michaelball357@gmail.com",1);

INSERT INTO Comments (Comment_content,User_email,Post_id) VALUES 
("Really like this post! thumbs up from me.","michaelball357@gmail.com",1);