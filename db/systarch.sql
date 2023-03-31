<<<<<<< HEAD:db/systarch.sql
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-03-2023 a las 20:40:12
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `systarch`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `epics`
--

CREATE TABLE `epics` (
  `epic_ID` varchar(100) NOT NULL,
  `user_ID` varchar(100) DEFAULT NULL,
  `ticket_ID` varchar(100) DEFAULT NULL,
  `project_ID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

CREATE TABLE `projects` (
  `project_ID` varchar(100) NOT NULL,
  `project_Name` varchar(100) NOT NULL,
  `report_ID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `report_ID` varchar(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `ticket_ID` varchar(100) NOT NULL,
  `ticket_Key` varchar(100) NOT NULL,
  `ticket_Status` varchar(50) DEFAULT NULL,
  `ticket_Points` int(15) DEFAULT NULL,
  `ticket_Type` char(5) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL,
  `ticket_Update` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_ID` varchar(100) NOT NULL,
  `user_Password` varchar(100) NOT NULL,
  `user_Name` varchar(100) NOT NULL,
  `user_Phone` int(10) DEFAULT NULL,
  `user_Mail` varchar(100) NOT NULL,
  `user_WeeklyAgilePoints` int(50) DEFAULT NULL,
  `user_Skill` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_ID`, `user_Password`, `user_Name`, `user_Phone`, `user_Mail`, `user_WeeklyAgilePoints`, `user_Skill`) VALUES
('', '$2a$12$XVRFML.2LtsemV0YWr7OcOd6Cypgb.AFviA1MZkfFgC3DR0RQZ/Dy', 'Diego Vega', 442, 'diego@gmail.com', NULL, '3');



--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `epics`
--
ALTER TABLE `epics`
  ADD PRIMARY KEY (`epic_ID`),
  ADD KEY `user_ID` (`user_ID`,`ticket_ID`,`project_ID`),
  ADD KEY `project_ID` (`project_ID`),
  ADD KEY `ticket_ID` (`ticket_ID`);

--
-- Indices de la tabla `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_ID`),
  ADD KEY `report_ID` (`report_ID`);

--
-- Indices de la tabla `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_ID`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`);


--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `epics`
--
ALTER TABLE `epics`
  MODIFY `epic_ID` varchar(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `projects`
--
ALTER TABLE `projects`
  MODIFY `project_ID` varchar(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `reports`
--
ALTER TABLE `reports`
  MODIFY `report_ID` varchar(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_ID` varchar(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` varchar(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `epics`
--
ALTER TABLE `epics`
  ADD CONSTRAINT `epics_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  ADD CONSTRAINT `epics_ibfk_2` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`),
  ADD CONSTRAINT `epics_ibfk_3` FOREIGN KEY (`ticket_ID`) REFERENCES `tickets` (`ticket_ID`);

--
-- Filtros para la tabla `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`report_ID`) REFERENCES `reports` (`report_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

=======
-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 30, 2023 at 04:11 AM
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
  `epic_Summ` varchar(100) NOT NULL,
  `project_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_ID` int(11) NOT NULL,
  `project_Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_ID` varchar(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL,
  `project_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_ID` int(11) NOT NULL,
  `ticket_Key` varchar(100) NOT NULL,
  `ticket_Summary` varchar(100) NOT NULL,
  `ticket_Status` varchar(50) DEFAULT NULL,
  `ticket_Points` int(11) DEFAULT NULL,
  `ticket_Type` char(5) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL,
  `epic_ID` varchar(100) NOT NULL,
  `user_ID` varchar(80) NOT NULL,
  `ticket_Update` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` varchar(80) NOT NULL,
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
  ADD KEY `project_ID` (`project_ID`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_ID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_ID`),
  ADD KEY `project_ID` (`project_ID`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_ID`),
  ADD KEY `epic_ID` (`epic_ID`),
  ADD KEY `user_ID` (`user_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `epics`
--
ALTER TABLE `epics`
  MODIFY `project_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `project_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `epics`
--
ALTER TABLE `epics`
  ADD CONSTRAINT `epics_ibfk_1` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`epic_ID`) REFERENCES `epics` (`epic_ID`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
>>>>>>> fd757add8b3bd411a0963de43777654b830d40d9:db/script.sql
