-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-04-2023 a las 09:48:05
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

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

DELIMITER $$
--
-- Procedimientos
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
-- Funciones
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
-- Estructura de tabla para la tabla `epics`
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
-- Estructura de tabla para la tabla `privilegios`
--

CREATE TABLE `privilegios` (
  `id` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `privilegios`
--

INSERT INTO `privilegios` (`id`, `nombre`) VALUES
(1, 'crear_usuarios'),
(2, 'no_hay');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

CREATE TABLE `projects` (
  `project_ID` int(100) NOT NULL,
  `project_Name` varchar(200) NOT NULL,
  `report_ID` int(100) DEFAULT NULL,
  `epic_Link` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `report_ID` int(100) NOT NULL,
  `report_Progress` int(100) DEFAULT NULL,
  `report_Estimated` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `descripcion` varchar(400) COLLATE utf8mb4_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'crear usuarios'),
(2, 'user', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_privilegio`
--

CREATE TABLE `rol_privilegio` (
  `idRol` int(11) NOT NULL,
  `idPrivilegio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `rol_privilegio`
--

INSERT INTO `rol_privilegio` (`idRol`, `idPrivilegio`) VALUES
(1, 1),
(1, 2),
(2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
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
-- Estructura de tabla para la tabla `users`
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
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_ID`, `user_Name`, `user_Password`, `user_Phone`, `user_Mail`, `user_WeeklyAgilePoints`, `user_Skill`, `ticket_Assignee`, `ticket_Assignee_ID`) VALUES
(1, 'Diego Vega', '$2a$12$FnpO1SU9uiu3MRPInTThIOg4qoTizzj1qaw3WqPEjj2tw1hQExLIe', '4426060404', 'diego@gmail.com', 0, '', NULL, NULL),
(2, 'Arturo Cristián Díaz López', '$2a$12$FnpO1SU9uiu3MRPInTThIOg4qoTizzj1qaw3WqPEjj2tw1hQExLIe', '4421054338', 'arturo@outlook.com', 0, '', NULL, NULL),
(3, 'Bernardo Gomez-Romero', '$2a$12$FnpO1SU9uiu3MRPInTThIOg4qoTizzj1qaw3WqPEjj2tw1hQExLIe', NULL, 'bernardo.gomez@dispatchhealth.com', 6, 'Front End', 'Bernardo Gomez-Romero', '61c9eb457c6f980070deda99'),
(4, 'Giorgi Gelashvili', '$2a$12$1uyzx5zj9ZizDDly3WRqneEXjorXI8TblTRVd73iHpUcCbvKXTNs6', '4424987666', 'giorgi@dispatchhealth.com', 0, 'Front End', 'Giorgi Gelashvili', '62cdef6c6eba71983721e037'),
(5, 'Alan Malagon', '$2a$12$tAIkkijN1BgoNnDY376XJesbe8fZwSFPKsEJY9ILORzA8ZbckabKG', '4424987666', 'alan@dispatchhealth', 0, 'Front End', 'Alan Malagon', '62cded1010fcc6f7ae3e5a73'),
(6, 'Antonio Antillon', '1234', NULL, 'antonio@dispatchhealth.com', 0, 'Back End', 'Antonio Antillon', '61f81bb630f6b8006aa75942'),
(7, 'Dan Cohn', '1234', NULL, 'dan@dispatchhealth.com', 0, 'Back End', 'Dan Cohn', '607f2fef739dd40069a4b2a3'),
(8, 'Kevin Anderson', '1234', NULL, 'kevin@dispatchhealth.com', 0, 'Back End', 'Kevin Anderson', '62cdf0d01e326fd93012992d'),
(9, 'Itzel Barreto', '1234', NULL, 'itzel@dispatchhealth.com', 0, 'Back End', 'Itzel Barreto', '62ce0b47a94a6f9c0efe90bf'),
(10, 'Sam Lanker', '1234', '', 'sam@dispatchhealth.com', 0, 'Front End', 'Sam Lanker', '62cdf020afe495359d9d9b0b'),
(11, 'Ashton Mitchell', '1234', NULL, 'ashton@dispatchhealth.com', 0, 'Front End', 'Ashton Mitchell', '61a3edabb0b630006afda9e4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`idUsuario`, `idRol`) VALUES
(1, 2),
(2, 2),
(3, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `epics`
--
ALTER TABLE `epics`
  ADD PRIMARY KEY (`epic_ID`),
  ADD KEY `epic_Link` (`epic_Link`);

--
-- Indices de la tabla `privilegios`
--
ALTER TABLE `privilegios`
  ADD PRIMARY KEY (`id`);

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
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rol_privilegio`
--
ALTER TABLE `rol_privilegio`
  ADD PRIMARY KEY (`idRol`,`idPrivilegio`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_Id`),
  ADD KEY `epic_Link` (`epic_Link`,`ticket_Assignee_ID`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`),
  ADD KEY `ticket_Assignee_ID` (`ticket_Assignee_ID`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD KEY `usuario_rol_id_1` (`idUsuario`),
  ADD KEY `usuario_rol_id_2` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `epics`
--
ALTER TABLE `epics`
  MODIFY `epic_ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `ticket_Id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `rol_privilegio`
--
ALTER TABLE `rol_privilegio`
  ADD CONSTRAINT `rol_privilegio_id_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `rol_privilegio_id_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `privilegios` (`id`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_id_1` FOREIGN KEY (`idUsuario`) REFERENCES `users` (`user_ID`),
  ADD CONSTRAINT `usuario_rol_id_2` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
