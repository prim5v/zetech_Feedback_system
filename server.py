# #tables

# Create table Users if not exists(
#     id serial primary key,
#     username varchar(100) unique not null,
#     user_id varchar(100) unique not null,
#     email varchar(100) unique not null,
#     password varchar(100) not null,
#     created_at timestamp default current_timestamp
# );

# Create table Issues if not exists(
#     id serial primary key,
#     issue_id varchar(100) unique not null,
#     ticket_id varchar(100) unique not null,
#     title varchar(100) not null,
#     description text not null,
#     category varchar(100) not null, enum ('Academics', 'Hostel', 'Transport', 'Examination', 'Other', 'Facilities', 'Cafeteria', 'Library', 'Sports', 'Health Services', 'IT Services', 'Administrative Services'),
#     status varchar(100) default 'pending', enum ('pending', 'in Review', 'closed', 'Resolved'),
#     submitted_at timestamp default current_timestamp,
#     updated_at timestamp default current_timestamp,
#     user_id varchar(100) references users(user_id),
#     submission_type varchar(100) not null enum ('Anonymous', 'Named'),
#     name varchar(100) null,
#     email varchar(100) null,
#     contact_number varchar(50) null,
#     admission_number varchar(100) null      
# );

# Create table Responses if not exists(
#     id serial primary key,
#     response_id varchar(100) unique not null,
#     issue_id varchar(100) references Issues(issue_id),
#     responder_id varchar(100) references Users(user_id),
#     message text not null,
#     responded_at timestamp default current_timestamp
# );

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issues Table
CREATE TABLE IF NOT EXISTS Issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id VARCHAR(100) UNIQUE NOT NULL,
    ticket_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category ENUM(
        'Academics', 'Hostel', 'Transport', 'Examination', 'Other', 
        'Facilities', 'Cafeteria', 'Library', 'Sports', 
        'Health Services', 'IT Services', 'Administrative Services'
    ) NOT NULL,
    status ENUM('pending', 'in Review', 'closed', 'Resolved') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(100),
    submission_type ENUM('Anonymous', 'Named') NOT NULL,
    name VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    contact_number VARCHAR(50) NULL,
    admission_number VARCHAR(100) NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Responses Table
CREATE TABLE IF NOT EXISTS Responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id VARCHAR(100) UNIQUE NOT NULL,
    issue_id VARCHAR(100),
    responder_id VARCHAR(100),
    message TEXT NOT NULL,
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issue FOREIGN KEY (issue_id) REFERENCES Issues(issue_id),
    CONSTRAINT fk_responder FOREIGN KEY (responder_id) REFERENCES Users(user_id)
);
