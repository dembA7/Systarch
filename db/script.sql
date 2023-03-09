CREATE DATABASE Systarch;

USE Systarch;

CREATE TABLE Users (
    user_ID VARCHAR(100) PRIMARY KEY  NOT NULL,
    user_Password VARCHAR(100) NOT NULL,
    user_Name VARCHAR(100) NOT NULL,
    user_Phone INT(10),
    user_Mail VARCHAR(100) NOT NULL,
    user_WeeklyAgilePoints INT(50),
    user_Skill CHAR(2)
);

CREATE TABLE Epics (
    epic_ID VARCHAR(100) PRIMARY KEY NOT NULL,
    epic_CompletedPoints INT(100),
    epic_EstimatedPoints INT(100),
    epic_TeamWeeks FLOAT(2),
    epic_TeamWeeklyCapacity INT(50)
);

CREATE TABLE Tickets (
    ticket_ID VARCHAR(100) NOT NULL,
    ticket_Key VARCHAR(100) NOT NULL,
    ticket_Status VARCHAR(50),
    ticket_Points INT(15), 
    ticket_Type CHAR(5),
    ticket_Label VARCHAR(300),
    ticket_Update DATE,
    PRIMARY KEY(ticket_ID, ticket_Key)
);

CREATE TABLE Projects (
    project_ID VARCHAR(100) PRIMARY KEY NOT NULL,
    project_Name VARCHAR(100) NOT NULL
);

CREATE TABLE Reports (
    report_ID VARCHAR(100) PRIMARY KEY NOT NULL,
    report_Progress INT(100),
    report_Estimated INT(100)
);