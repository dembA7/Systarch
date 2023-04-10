-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 09, 2023 at 09:29 PM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `systarch`
--

-- --------------------------------------------------------

--
-- Table structure for table `epics`
--

CREATE TABLE `epics` (
  `epic_ID` varchar(100) NOT NULL,
  `user_ID` varchar(100) DEFAULT NULL,
  `ticket_ID` varchar(100) DEFAULT NULL,
  `project_ID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_ID` varchar(100) NOT NULL,
  `project_Name` varchar(100) NOT NULL,
  `report_ID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_ID` varchar(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_ID` varchar(100) NOT NULL,
  `ticket_Key` varchar(100) NOT NULL,
  `ticket_Status` varchar(50) DEFAULT NULL,
  `ticket_Points` int(15) DEFAULT NULL,
  `ticket_Type` char(5) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL,
  `ticket_Update` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` varchar(100) NOT NULL,
  `user_Password` varchar(100) NOT NULL,
  `user_Name` varchar(100) NOT NULL,
  `user_Phone` int(10) DEFAULT NULL,
  `user_Mail` varchar(100) NOT NULL,
  `user_WeeklyAgilePoints` int(50) DEFAULT NULL,
  `user_Skill` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `epics`
--
ALTER TABLE `epics`
  ADD PRIMARY KEY (`epic_ID`),
  ADD KEY `user_ID` (`user_ID`,`ticket_ID`,`project_ID`),
  ADD KEY `project_ID` (`project_ID`),
  ADD KEY `ticket_ID` (`ticket_ID`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_ID`),
  ADD KEY `report_ID` (`report_ID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_ID`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `epics`
--
ALTER TABLE `epics`
  ADD CONSTRAINT `epics_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  ADD CONSTRAINT `epics_ibfk_2` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`),
  ADD CONSTRAINT `epics_ibfk_3` FOREIGN KEY (`ticket_ID`) REFERENCES `tickets` (`ticket_ID`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`report_ID`) REFERENCES `reports` (`report_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
