<<<<<<< HEAD
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
  `epic_ID` int(100) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `user_ID` int(100) DEFAULT NULL,
  `ticket_ID` int(100) DEFAULT NULL,
  `project_ID` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

CREATE TABLE `projects` (
  `project_ID` int(100) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `project_Name` varchar(200) NOT NULL,
  `report_ID` int(100) DEFAULT NULL,
  `epic_Link` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `report_ID` int(100) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `ticket_Id` int(100) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `Issue_Key` varchar(100) NOT NULL,
  `Issue_Id` int(30) NOT NULL,
  `Summary` varchar(400) NOT NULL,
  `Issue_Type` char(10) NOT NULL,
  `Story_Points` int(50) DEFAULT NULL,
  `ticket_Status` varchar(50) NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `ticket_Update` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  `ticket_Assignee` varchar(100) DEFAULT NULL,
  `ticket_Assignee_ID` varchar(200) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_ID` int(100) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `user_Password` varchar(150) NOT NULL,
  `user_Name` varchar(150) NOT NULL,
  `user_Phone` int(10) DEFAULT NULL,
  `user_Mail` varchar(100) NOT NULL,
  `user_WeeklyAgilePoints` int(50) DEFAULT NULL,
  `user_Skill` char(2) DEFAULT NULL,
  `ticket_Assignee` varchar(100) DEFAULT NULL,
  `ticket_Assignee_ID` varchar(200) DEFAULT NULL
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
  ADD KEY `user_ID` (`user_ID`,`ticket_ID`,`project_ID`),
  ADD KEY `project_ID` (`project_ID`),
  ADD KEY `ticket_ID` (`ticket_ID`);

--
-- Indices de la tabla `projects`
--
ALTER TABLE `projects`
  ADD KEY `report_ID` (`report_ID`),
  ADD KEY `epic_Link` (`epic_Link`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD KEY `epic_Link` (`epic_Link`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD KEY `ticket_Assignee` (`ticket_Assignee`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--

-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `epics`
--
ALTER TABLE `epics`
  ADD CONSTRAINT `epics_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  ADD CONSTRAINT `epics_ibfk_2` FOREIGN KEY (`project_ID`) REFERENCES `projects` (`project_ID`),
  ADD CONSTRAINT `epics_ibfk_3` FOREIGN KEY (`ticket_Id`) REFERENCES `tickets` (`ticket_Id`),
  ADD CONSTRAINT `epics_ibfk_4` FOREIGN KEY (`epic_Link`) REFERENCES `tickets` (`epic_Link`);

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`ticket_Assignee`) REFERENCES `users` (`ticket_Assignee`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`ticket_Assignee_ID`) REFERENCES `users` (`ticket_Assignee`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ticket_Assignee`) REFERENCES `tickets` (`ticket_Assignee`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`ticket_Assignee_ID`) REFERENCES `tickets` (`ticket_Assignee`);

--
-- Filtros para la tabla `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`report_ID`) REFERENCES `reports` (`report_ID`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`epic_Link`) REFERENCES `tickets` (`epic_Link`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
=======
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-04-2023 a las 23:47:41
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

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
  `epic_ID` int(100) NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `user_ID` int(100) DEFAULT NULL,
  `ticket_ID` int(100) DEFAULT NULL,
  `project_ID` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

CREATE TABLE `projects` (
  `project_ID` int(100) NOT NULL,
  `project_Name` varchar(200) NOT NULL,
  `report_ID` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `report_ID` int(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `ticket_Id` int(100) NOT NULL,
  `Issue_Key` varchar(100) NOT NULL,
  `Issue_Id` int(30) NOT NULL,
  `Summary` varchar(400) NOT NULL,
  `Issue_Type` char(10) NOT NULL,
  `Story_Points` float DEFAULT NULL,
  `ticket_Status` varchar(50) NOT NULL,
  `epic_Link` varchar(30) NOT NULL,
  `epic_Link_Summary` varchar(400) NOT NULL,
  `ticket_Update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ticket_Assignee` varchar(100) DEFAULT NULL,
  `ticket_Assignee_ID` varchar(200) DEFAULT NULL,
  `ticket_Label` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `tickets`
--

INSERT INTO `tickets` (`ticket_Id`, `Issue_Key`, `Issue_Id`, `Summary`, `Issue_Type`, `Story_Points`, `ticket_Status`, `epic_Link`, `epic_Link_Summary`, `ticket_Update`, `ticket_Assignee`, `ticket_Assignee_ID`, `ticket_Label`) VALUES
(1, 'PART-2355', 24413, 'PartnerMarketsPage.js / fix flaky test', 'Task', 0, 'To Do', 'PART-234', 'Express Tech Excellence', '0000-00-00 00:00:00', 'Kevin Anderson', '62cdf0d01e326fd93012992d', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_ID` int(100) NOT NULL,
  `user_Password` varchar(150) NOT NULL,
  `user_Name` varchar(150) NOT NULL,
  `user_Phone` int(10) DEFAULT NULL,
  `user_Mail` varchar(100) NOT NULL,
  `user_WeeklyAgilePoints` int(50) DEFAULT NULL,
  `user_Skill` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_ID`, `user_Password`, `user_Name`, `user_Phone`, `user_Mail`, `user_WeeklyAgilePoints`, `user_Skill`) VALUES
(0, '$2a$12$XVRFML.2LtsemV0YWr7OcOd6Cypgb.AFviA1MZkfFgC3DR0RQZ/Dy', 'Diego Vega', 442, 'diego@gmail.com', NULL, '3');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `epics`
--
ALTER TABLE `epics`
  ADD PRIMARY KEY (`epic_ID`);

--
-- Indices de la tabla `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_ID`);

--
-- Indices de la tabla `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_ID`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_Id`);

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
  MODIFY `epic_ID` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `projects`
--
ALTER TABLE `projects`
  MODIFY `project_ID` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reports`
--
ALTER TABLE `reports`
  MODIFY `report_ID` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_Id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(100) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
>>>>>>> d516e836fca21007c24c64a92d2922db48c7f0f9
