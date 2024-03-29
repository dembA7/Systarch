-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2023 at 01:38 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spProgreso` (IN `_epic_Link` VARCHAR(30), OUT `progreso` INT)   BEGIN
  DECLARE total_tickets INT DEFAULT 0;
  DECLARE total_status INT DEFAULT 0;
  
  SELECT COUNT(*) INTO total_tickets FROM tickets WHERE epic_Link = _epic_Link;
  SELECT COUNT(*) INTO total_status FROM tickets WHERE epic_Link = _epic_Link AND ticket_Status IN ('Done', 'Closed','Canceled');
  
  IF total_tickets > 0 THEN
    SET progreso = (total_status / total_tickets) * 100;
  ELSE
    SET progreso = 0;
  END IF;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `get_progreso` (`epic_Link` VARCHAR(30)) RETURNS INT(11)  BEGIN
    DECLARE progreso INT;
    CALL spProgreso(epic_Link, @progreso);
    RETURN @progreso;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_Sprints` (`_epic_Link` VARCHAR(30)) RETURNS FLOAT  BEGIN
  DECLARE total_points FLOAT(11,2) DEFAULT 0;
  DECLARE total_teamAP FLOAT(11,2) DEFAULT 0;
  DECLARE progreso FLOAT(11,2) DEFAULT 0;
  
  SELECT SUM(t.Story_Points) INTO total_points FROM tickets t WHERE epic_Link = _epic_Link;
  SELECT SUM(DISTINCT u.user_WeeklyAgilePoints) INTO total_teamAP FROM users u, tickets t WHERE u.ticket_Assignee_ID = t.ticket_Assignee_ID AND t.epic_Link = _epic_Link;

  IF total_teamAP > 0 THEN
    SET progreso = (total_points / total_teamAP);
  ELSE
    SET progreso = 0;
  END IF;
  RETURN progreso;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `epics`
--

CREATE TABLE `epics` (
  `epic_ID` int(100) NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `user_ID` int(100) DEFAULT NULL,
  `ticket_ID` int(100) DEFAULT NULL,
  `project_ID` int(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `privilegios`
--

CREATE TABLE `privilegios` (
  `id` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `privilegios`
--

INSERT INTO `privilegios` (`id`, `nombre`) VALUES
(1, 'crear_usuarios'),
(2, 'no_hay');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_ID` int(100) NOT NULL,
  `project_Name` varchar(200) NOT NULL,
  `report_ID` int(100) DEFAULT NULL,
  `epic_Link` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `project_epics`
--

CREATE TABLE `project_epics` (
  `project_ID` int(11) NOT NULL,
  `epic_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_ID` int(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `descripcion` varchar(400) COLLATE utf8mb4_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'crear usuarios'),
(2, 'user', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rol_privilegio`
--

CREATE TABLE `rol_privilegio` (
  `idRol` int(11) NOT NULL,
  `idPrivilegio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `rol_privilegio`
--

INSERT INTO `rol_privilegio` (`idRol`, `idPrivilegio`) VALUES
(1, 1),
(1, 2),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_Id` int(100) NOT NULL,
  `Issue_Key` varchar(100) NOT NULL,
  `Issue_Id` int(30) NOT NULL,
  `Summary` varchar(400) NOT NULL,
  `Issue_Type` char(50) NOT NULL,
  `Story_Points` float DEFAULT NULL,
  `ticket_Status` varchar(50) NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `ticket_Update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ticket_Created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ticket_Assignee` varchar(100) DEFAULT NULL,
  `ticket_Assignee_ID` varchar(200) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` int(100) NOT NULL,
  `user_Name` varchar(150) NOT NULL,
  `user_Password` varchar(150) NOT NULL,
  `user_Phone` varchar(10) DEFAULT NULL,
  `user_Mail` varchar(100) NOT NULL,
  `user_WeeklyAgilePoints` int(50) DEFAULT NULL,
  `user_Skill` varchar(50) DEFAULT NULL,
  `ticket_Assignee` varchar(100) DEFAULT NULL,
  `ticket_Assignee_ID` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_ID`, `user_Name`, `user_Password`, `user_Phone`, `user_Mail`, `user_WeeklyAgilePoints`, `user_Skill`, `ticket_Assignee`, `ticket_Assignee_ID`) VALUES
(3, 'Bernardo Gomez-Romero', '$2a$12$FnpO1SU9uiu3MRPInTThIOg4qoTizzj1qaw3WqPEjj2tw1hQExLIe', NULL, 'bernardo.gomez@dispatchhealth.com', 6, 'Front End', 'Bernardo Gomez-Romero', '61c9eb457c6f980070deda99');

-- --------------------------------------------------------

--
-- Table structure for table `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `usuario_rol`
--

INSERT INTO `usuario_rol` (`idUsuario`, `idRol`) VALUES
(3, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `epics`
--
ALTER TABLE `epics`
  ADD PRIMARY KEY (`epic_ID`),
  ADD KEY `epic_Link` (`epic_Link`);

--
-- Indexes for table `privilegios`
--
ALTER TABLE `privilegios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_ID`);

--
-- Indexes for table `project_epics`
--
ALTER TABLE `project_epics`
  ADD PRIMARY KEY (`project_ID`,`epic_ID`),
  ADD KEY `epics` (`epic_ID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rol_privilegio`
--
ALTER TABLE `rol_privilegio`
  ADD PRIMARY KEY (`idRol`,`idPrivilegio`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_Id`),
  ADD KEY `epic_Link` (`epic_Link`,`ticket_Assignee_ID`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--
-- Indexes for table `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD KEY `usuario_rol_id_1` (`idUsuario`),
  ADD KEY `usuario_rol_id_2` (`idRol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `epics`
--
ALTER TABLE `epics`
  MODIFY `epic_ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_ID` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_ID` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_Id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `project_epics`
--
ALTER TABLE `project_epics`
  ADD CONSTRAINT `epics` FOREIGN KEY (`epic_ID`) REFERENCES `epics` (`epic_ID`),
  ADD CONSTRAINT `projects` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`);

--
-- Constraints for table `rol_privilegio`
--
ALTER TABLE `rol_privilegio`
  ADD CONSTRAINT `rol_privilegio_id_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `rol_privilegio_id_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `privilegios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
